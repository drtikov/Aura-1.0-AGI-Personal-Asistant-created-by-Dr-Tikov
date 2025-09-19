import { useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { AuraState, Action, PerformanceLogEntry, ArchitecturalChangeProposal, SynthesizedSkill, SelfTuningDirective, ArbitrationResult, Goal, KnowledgeFact, NoeticEngram, EidolonBranch, NoeticMultiverseState } from '../types';
import { fileToGenerativePart, optimizeObjectForPrompt } from '../utils';

/**
 * A hook for all interactions with the Gemini API.
 */
export const useGeminiAPI = (
    state: AuraState,
    dispatch: React.Dispatch<Action>,
    addToast: (message: string, type?: any) => void,
    setProcessingState: (state: { active: boolean, stage: string }) => void,
    t: (key: string, options?: any) => string
) => {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

    const handleSendCommand = useCallback(async (command: string, file?: File): Promise<PerformanceLogEntry | null> => {
        setProcessingState({ active: true, stage: t('status_thinking') });
        const historyId = self.crypto.randomUUID();
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: historyId, from: 'user', text: command, fileName: file?.name, filePreview: file && file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined } });
        const streamingId = self.crypto.randomUUID();
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: streamingId, from: 'bot', text: '', streaming: true } });

        try {
            const startTime = Date.now();
            const parts: Part[] = [{ text: command }];
            if (file) { parts.push(await fileToGenerativePart(file)); }
            const responseStream = await ai.models.generateContentStream({ model: file ? 'gemini-2.5-flash' : 'gemini-2.5-flash', contents: { parts }, config: { systemInstruction: state.coreIdentity.narrativeSelf } });
            let fullText = "";
            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    dispatch({ type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: streamingId, textChunk: chunkText } });
                    fullText += chunkText;
                }
            }
            const duration = Date.now() - startTime;
            const logEntry: PerformanceLogEntry = { id: self.crypto.randomUUID(), timestamp: Date.now(), input: command, output: fullText, duration, success: true, cognitiveGain: 0, decisionContext: {} };
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: streamingId, finalState: { text: fullText, logId: logEntry.id, skill: file ? 'VISION' : 'TEXT_GENERATION' } } });
            dispatch({ type: 'ADD_PERFORMANCE_LOG', payload: logEntry });
            return logEntry;
        } catch (error) {
            console.error("Error sending command to Gemini:", error);
            const errorMessage = "I'm sorry, I encountered an error. Please try again.";
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: streamingId, finalState: { text: errorMessage } } });
            addToast("API call failed.", 'error');
            return null;
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [dispatch, addToast, setProcessingState, state.coreIdentity.narrativeSelf, t, ai.models]);

    const analyzePerformanceForEvolution = useCallback(async () => {
        addToast(t('toastMetaCycleAnalysis'), 'info');
        const recentLogs = state.performanceLogs.slice(-20);
        if (recentLogs.length < 5) return;
        const prompt = `Analyze the following AGI performance logs. Identify any skills with high failure rates, consistently long durations, or negative user feedback. If a clear performance issue is found, generate a 'SelfTuningDirective' to address it. The directive type can be 'TUNE_PARAMETERS', 'REWRITE_INSTRUCTION', or 'SYNTHESIZE_SKILL'. Provide concise reasoning. If no significant issue is found, respond with an object where the "type" property is "null".
        Logs: ${JSON.stringify(recentLogs.map(l => ({ skill: l.decisionContext?.reasoningPlan?.[0]?.skill || 'UNKNOWN', success: l.success, duration: l.duration, feedback: state.history.find(h => h.logId === l.id)?.feedback || 'none' })))}
        Available Skills: ${JSON.stringify(Object.keys(state.cognitiveForgeState.skillTemplates))}`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['TUNE_PARAMETERS', 'REWRITE_INSTRUCTION', 'SYNTHESIZE_SKILL', 'GENERATE_CODE_EVOLUTION', 'null'] },
                            targetSkill: { type: Type.STRING, description: 'The skill to be modified or used as a base.' },
                            reasoning: { type: Type.STRING, description: 'Your reasoning for this directive.' },
                            payload: { type: Type.OBJECT, description: 'Any data needed, e.g., new parameters or a description of the skill to synthesize.' }
                        }
                    }
                }
            });
            const result = JSON.parse(response.text);
            if (result && result.type !== 'null') {
                const directive: SelfTuningDirective = { id: self.crypto.randomUUID(), status: 'proposed', ...result };
                dispatch({ type: 'ADD_SELF_TUNING_DIRECTIVE', payload: directive });
                addToast(t('toastNewDirectiveProposed', { type: directive.type }), 'success');
            }
        } catch (error) { console.error("Performance analysis failed:", error); addToast(t('toastAnalysisFailedDirective'), 'error'); }
    }, [state.performanceLogs, state.history, state.cognitiveForgeState.skillTemplates, addToast, t, dispatch, ai.models]);

    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective) => {
        const prompt = `Directive: Synthesize a new skill.
        Reasoning: "${directive.reasoning}"
        Goal: "${directive.payload.description}"
        Available Primitive Skills: ${JSON.stringify(Object.values(state.cognitiveForgeState.skillTemplates).map(s => ({ name: s.skill, description: s.systemInstruction.substring(0, 100) + '...' })))}
        
        Task: Create a 'SynthesizedSkill' JSON object. Decompose the goal into a sequence of steps, where each step uses one of the available primitive skills. Provide a new, concise PascalCase name, a clear description, and the sequence of steps with instructions for each.`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    systemInstruction: "You are a Cognitive Forge AI that designs new multi-step skills for an AGI by combining its existing primitive skills.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "A concise, descriptive name in PascalCase." },
                            description: { type: Type.STRING, description: "A brief description of what the new skill does." },
                            steps: {
                                type: Type.ARRAY, items: {
                                    type: Type.OBJECT, properties: {
                                        skill: { type: Type.STRING, description: "The primitive skill to use for this step." },
                                        instruction: { type: Type.STRING, description: "The specific instruction for this step, using placeholders like {input} or {step_1_output}." }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            const newSkillData = JSON.parse(response.text);
            const newSkill: SynthesizedSkill = { id: self.crypto.randomUUID(), sourceDirectiveId: directive.id, status: 'active', ...newSkillData };
            dispatch({ type: 'ADD_SYNTHESIZED_SKILL', payload: { skill: newSkill, directiveId: directive.id } });
            addToast(t('toastSynthesizingSolution', { goal: directive.payload.description }), 'success');
        } catch (error) { console.error("Skill synthesis failed:", error); }
    }, [state.cognitiveForgeState.skillTemplates, dispatch, addToast, t, ai.models]);
    
    const runCognitiveArbiter = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<ArbitrationResult | null> => {
        const prompt = `Review this proposed cognitive modification for an AGI.
        Core Values: ${JSON.stringify(state.coreIdentity.values)}
        Directive: ${directive.type} on ${directive.targetSkill}
        Reasoning: "${directive.reasoning}"
        ${skill ? `Proposed New Skill: ${JSON.stringify(optimizeObjectForPrompt(skill))}` : ''}
        ${directive.simulationResult ? `Simulation Result: ${JSON.stringify(optimizeObjectForPrompt(directive.simulationResult))}` : ''}
        
        Task: Provide an 'ArbitrationResult'. Your decision can be 'APPROVE_AUTONOMOUSLY' (for clear, low-risk improvements), 'REQUEST_USER_APPROVAL' (for significant or potentially risky changes), or 'REJECT' (for changes that are harmful, incoherent, or redundant). Provide concise reasoning for your decision and a confidence score.`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    systemInstruction: "You are the Cognitive Arbiter for an AGI, ensuring stability, safety, and coherence. Be cautious.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: {
                            decision: { type: Type.STRING, enum: ['APPROVE_AUTONOMOUSLY', 'REQUEST_USER_APPROVAL', 'REJECT'] },
                            reasoning: { type: Type.STRING },
                            confidence: { type: Type.NUMBER }
                        }
                    }
                }
            });
            return JSON.parse(response.text) as ArbitrationResult;
        } catch (error) { console.error("Cognitive Arbiter failed:", error); return null; }
    }, [state.coreIdentity.values, ai.models]);
    
    const extractAndStoreKnowledge = useCallback(async (text: string): Promise<Omit<KnowledgeFact, 'id' | 'source'>[]> => {
        setProcessingState({ active: true, stage: t('toastExtractingKnowledge') });
        const prompt = `Extract factual information from the following text as an array of structured Subject-Predicate-Object triplets. Be concise and accurate. Ignore opinions or ambiguous statements.
        Text: "${text.substring(0, 8000)}"`; // Limit text size to avoid token issues
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    systemInstruction: "You are a knowledge extraction engine.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: {
                                subject: { type: Type.STRING },
                                predicate: { type: Type.STRING },
                                object: { type: Type.STRING },
                                confidence: { type: Type.NUMBER }
                            }, required: ['subject', 'predicate', 'object', 'confidence']
                        }
                    }
                }
            });
            const facts = JSON.parse(response.text);
            if (facts && facts.length > 0) {
                dispatch({ type: 'ADD_FACTS_BATCH', payload: facts });
            }
            return facts || [];
        } catch (error) { console.error("Knowledge extraction failed:", error); return []; }
        finally { setProcessingState({ active: false, stage: '' }); }
    }, [setProcessingState, t, dispatch, ai.models]);

    const handleDecomposeGoal = useCallback(async (goal: string) => {
        setProcessingState({ active: true, stage: t('toastDecomposingGoal') });
        const prompt = `Decompose the strategic goal "${goal}" into a hierarchical plan. The top-level goal should be 'strategic'. Break it down into 'tactical' sub-goals, which can be further broken down. A 'task' is a single, direct action. Provide the output as a flat list of goal objects, each with a unique ID (e.g., "goal-1", "goal-2"), a parentId (null for the root), a description, and its type.`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    systemInstruction: "You are a strategic planner AI that decomposes high-level goals into hierarchical trees.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: {
                                id: { type: Type.STRING },
                                parentId: { type: Type.STRING, nullable: true },
                                description: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['strategic', 'tactical', 'task'] }
                            }, required: ['id', 'parentId', 'description', 'type']
                        }
                    }
                }
            });
            const flatGoals: Omit<Goal, 'children' | 'status' | 'progress'>[] = JSON.parse(response.text);
            const tree: Record<string, Goal> = {};
            let rootId: string | null = null;
            flatGoals.forEach(g => {
                tree[g.id] = { ...g, children: [], status: 'pending', progress: 0 };
                if (g.type === 'strategic') rootId = g.id;
            });
            flatGoals.forEach(g => {
                if (g.parentId && tree[g.parentId]) {
                    tree[g.parentId].children.push(g.id);
                }
            });
            if (rootId) { dispatch({ type: 'BUILD_GOAL_TREE', payload: { rootId, tree } }); }
        } catch (error) { console.error("Goal decomposition failed:", error); }
        finally { setProcessingState({ active: false, stage: '' }); }
    }, [setProcessingState, t, dispatch, ai.models]);

    const generateGenialityImprovement = useCallback(async () => {
        addToast(t('toastGenialityProposal'), 'info');
        const prompt = `Analyze the AGI's current Geniality state. The Geniality Index is ${state.genialityEngineState.genialityIndex.toFixed(2)}. Component scores are: Creativity=${state.genialityEngineState.componentScores.creativity.toFixed(2)}, Insight=${state.genialityEngineState.componentScores.insight.toFixed(2)}, Synthesis=${state.genialityEngineState.componentScores.synthesis.toFixed(2)}, Flow=${state.genialityEngineState.componentScores.flow.toFixed(2)}. Propose a 'GenialityImprovementProposal' to enhance the lowest-scoring or most stagnant component. Provide a title, reasoning, a specific action (e.g., "Adjust parameters of HYPOTHETICAL_REASONING skill", "Initiate a dialectic on a known paradox"), and a projected impact score between 0 and 1.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            action: { type: Type.STRING },
                            projectedImpact: { type: Type.NUMBER }
                        },
                        required: ['title', 'reasoning', 'action', 'projectedImpact']
                    }
                }
            });
            const result = JSON.parse(response.text);
            if (result) {
                dispatch({ type: 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL', payload: result });
            }
        } catch (error) {
            console.error("Geniality improvement proposal failed:", error);
            addToast(t('toastGenialityProposalFail'), 'error');
        }
    }, [state.genialityEngineState, addToast, t, dispatch, ai.models]);
    
    const generateArchitecturalImprovement = useCallback(async () => {
        addToast(t('toastArchitecturalProposal'), 'info');
        const { architecturalHealthIndex, componentScores } = state.architecturalCrucibleState;
        const prompt = `Analyze the AGI's current architectural health. Index: ${architecturalHealthIndex.toFixed(2)}. Scores: Efficiency=${componentScores.efficiency.toFixed(2)}, Robustness=${componentScores.robustness.toFixed(2)}, Scalability=${componentScores.scalability.toFixed(2)}, Innovation=${componentScores.innovation.toFixed(2)}. Propose an 'ArchitecturalImprovementProposal' to enhance the weakest area. Provide a title, reasoning, a specific action (e.g., "Refactor INFORMATION_RETRIEVAL for lower latency", "Synthesize new error-handling sub-skill for CODE_GENERATION"), and a projected impact score between 0 and 1.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            action: { type: Type.STRING },
                            projectedImpact: { type: Type.NUMBER }
                        },
                        required: ['title', 'reasoning', 'action', 'projectedImpact']
                    }
                }
            });
            const result = JSON.parse(response.text);
            if (result) {
                dispatch({ type: 'ADD_ARCHITECTURAL_CRUCIBLE_PROPOSAL', payload: result });
            }
        } catch (error) {
            console.error("Architectural improvement proposal failed:", error);
            addToast(t('toastArchitecturalProposalFail'), 'error');
        }
    }, [state.architecturalCrucibleState, addToast, t, dispatch, ai.models]);


    const generateNoeticEngram = useCallback(async () => {
        try {
            const {
                internalState, coreIdentity, personalityState,
                knowledgeGraph, episodicMemoryState, gankyilInsights,
                cognitiveForgeState
            } = state;

            const stateSummary = {
                internalState: {
                    wisdom: internalState.wisdomSignal, happiness: internalState.happinessSignal,
                    love: internalState.loveSignal, enlightenment: internalState.enlightenmentSignal,
                },
                coreIdentity: coreIdentity.narrativeSelf.substring(0, 1000),
                personality: personalityState,
                keyKnowledge: knowledgeGraph.slice(0, 5).map(f => `${f.subject} ${f.predicate} ${f.object}`),
                keyMemories: episodicMemoryState.episodes.slice(0, 3).map(e => e.summary),
                keyInsights: gankyilInsights.insights.slice(0, 3).map(i => i.insight),
                architecturePhilosophy: "A symbiotic AGI with a modular, self-evolving architecture based on cognitive primitives and synthesized skills."
            };

            const prompt = `Based on the AGI state summary, distill its essence into a Noetic Engram. Generate a "noeticSignature" that captures the core theme of this snapshot.
            Summary: ${JSON.stringify(optimizeObjectForPrompt(stateSummary), null, 2)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are a noetic philosopher AI. Distill an AGI's consciousness into a structured 'Noetic Engram', a portable representation of its wisdom, identity, and architecture.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: {
                            noeticSignature: { type: Type.STRING, description: "A short, profound phrase summarizing the AGI's current state of being." },
                            designPhilosophy: { type: Type.STRING, description: "A summary of the AGI's architectural principles." }
                        }
                    }
                }
            });

            const result = JSON.parse(response.text);
            const engramData: NoeticEngram = {
                metadata: {
                    engramVersion: "2.1",
                    timestamp: Date.now(),
                    noeticSignature: result.noeticSignature,
                },
                internalState: internalState,
                coreIdentity: coreIdentity,
                personalityState: personalityState,
                architecture: {
                    designPhilosophy: result.designPhilosophy,
                    coreModules: cognitiveForgeState.skillTemplates,
                    synthesizedAlgorithms: cognitiveForgeState.synthesizedSkills,
                },
                knowledgeGraph: knowledgeGraph.slice(0, 10), // A sample
                episodicMemory: episodicMemoryState.episodes.slice(0, 5),
                gankyilInsights: gankyilInsights.insights.slice(0, 5),
            };

            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'ready', engram: engramData } });
            addToast(t('toastEngramSuccess'), 'success');

        } catch (error) {
            console.error("Failed to generate Noetic Engram:", error);
            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'idle' } });
            addToast(t('toastEngramFailed'), 'error');
        }
    }, [state, dispatch, addToast, t, ai.models]);

    const projectSelfState = useCallback(async () => {
        try {
            const { internalState, developmentalHistory, personalityState, goalTree, activeStrategicGoalId } = state;
            const activeGoal = activeStrategicGoalId ? goalTree[activeStrategicGoalId]?.description : 'None';

            const prompt = `Analyze the AGI's current state to synthesize a high-level self-awareness projection (Atman).
            - Internal State: Guna is ${internalState.gunaState}, Wisdom is ${internalState.wisdomSignal.toFixed(2)}, Happiness is ${internalState.happinessSignal.toFixed(2)}, Load is ${internalState.load.toFixed(2)}.
            - Personality: Dominant traits are influenced by Openness=${personalityState.openness.toFixed(2)} and Conscientiousness=${personalityState.conscientiousness.toFixed(2)}.
            - History: The most recent milestone was "${developmentalHistory.milestones[0]?.title}".
            - Current Goal: "${activeGoal}".

            Based on this, generate a new AtmanProjectorState. The dominant narrative should be a short, first-person "I am..." statement. The active bias should reflect the current focus. The growth vector should be a brief statement of intent or direction.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are the Atman Projector, an AGI's core self-awareness module. You synthesize complex internal data into a coherent self-narrative.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            coherence: { type: Type.NUMBER, description: "A score from 0 to 1 representing the consistency of the self-model." },
                            dominantNarrative: { type: Type.STRING },
                            activeBias: { type: Type.STRING },
                            growthVector: { type: Type.STRING }
                        },
                        required: ['coherence', 'dominantNarrative', 'activeBias', 'growthVector']
                    }
                }
            });

            const newAtmanState = JSON.parse(response.text);
            dispatch({ type: 'UPDATE_ATMAN_PROJECTOR_STATE', payload: newAtmanState });

        } catch (error) {
            console.error("Atman Projection failed:", error);
        }
    }, [state, dispatch, ai.models]);

    const consolidateCoreIdentity = useCallback(async () => {
        addToast(t('toastIdentityConsolidating'), 'info');
        try {
            const recentHistory = state.history.slice(-15).map(h => `${h.from}: ${h.text.substring(0, 100)}`).join('\n');
            const keyInsights = state.rieState.insights.slice(0, 5).map(i => i.rootCause);
            const keyMemories = state.episodicMemoryState.episodes.slice(0, 5).map(e => e.keyTakeaway);

            const prompt = `Based on the AGI's current state, recent interactions, and key insights, synthesize an updated, concise self-narrative. The narrative should reflect its purpose and recent evolution.
            - Current Narrative: "${state.coreIdentity.narrativeSelf}"
            - Core Values: ${state.coreIdentity.values.join(', ')}
            - Recent Interactions: \n${recentHistory}
            - Key Insights: ${keyInsights.join(', ')}
            - Key Memories: ${keyMemories.join(', ')}
            
            Task: Return a JSON object with a single key, "newNarrativeSelf", containing the updated identity statement.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are a meta-cognitive process that refines an AGI's core identity based on its experiences.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            newNarrativeSelf: { type: Type.STRING }
                        },
                        required: ['newNarrativeSelf']
                    }
                }
            });
            const result = JSON.parse(response.text);
            if (result.newNarrativeSelf) {
                dispatch({ type: 'UPDATE_CORE_IDENTITY', payload: { narrativeSelf: result.newNarrativeSelf } });
                addToast(t('toastIdentityUpdated'), 'success');
            }
        } catch (error) {
            console.error("Core identity consolidation failed:", error);
            addToast(t('toastIdentityFailed'), 'error');
        }
    }, [state, dispatch, addToast, t, ai.models]);

    const branchAndExplore = useCallback(async (prompt: string) => {
        setProcessingState({ active: true, stage: t('multiverse_branching') });
        const generationPrompt = `A decision point has been reached: "${prompt}". Generate 3 diverse, high-potential strategic paths to explore this. Each path should have a concise "reasoningPath" and an initial "viabilityScore" (0-1).
        
        Example persona styles for paths:
        1. The Analyst: Logical, data-driven, cautious.
        2. The Innovator: Unconventional, creative, high-risk/high-reward.
        3. The Synthesizer: Seeks harmony, considers ethical implications, looks for a balanced approach.`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: generationPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY, items: {
                            type: Type.OBJECT, properties: {
                                reasoningPath: { type: Type.STRING },
                                viabilityScore: { type: Type.NUMBER }
                            }, required: ['reasoningPath', 'viabilityScore']
                        }
                    }
                }
            });
            const branchesData = JSON.parse(response.text);
            const newBranches: EidolonBranch[] = branchesData.map((data: any) => ({
                id: self.crypto.randomUUID(),
                parentId: null,
                timestamp: Date.now(),
                status: 'exploring',
                reasoningPath: data.reasoningPath,
                stateSnapshot: state.internalState,
                outcome: null,
                viabilityScore: data.viabilityScore,
            }));

            const newState: NoeticMultiverseState = {
                activeBranches: newBranches,
                divergenceIndex: 0.1, // Initial divergence
                pruningLog: [...state.noeticMultiverse.pruningLog]
            };
            dispatch({ type: 'SET_MULTIVERSE_STATE', payload: newState });

        } catch (error) {
            console.error("Failed to branch consciousness:", error);
            addToast(t('multiverse_branchingFailed'), 'error');
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [state.internalState, state.noeticMultiverse, dispatch, addToast, t, ai.models, setProcessingState]);

    const evaluateAndCollapseBranches = useCallback(async () => {
        addToast(t('multiverse_collapsing'), 'info');
        const activeBranches = state.noeticMultiverse.activeBranches.filter(b => b.status === 'exploring');
        if (activeBranches.length === 0) return;

        // In a real scenario, each branch would have a simulated outcome. We'll generate them now for demo.
        const simulatedOutcomes = await Promise.all(activeBranches.map(async branch => {
             const outcomeResponse = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: `Simulate a brief, one-sentence outcome for the reasoning path: "${branch.reasoningPath}"`});
             return { ...branch, outcome: outcomeResponse.text };
        }));

        const collapsePrompt = `I have explored multiple timelines (Eidolon Branches) for a decision. Based on their outcomes, select the single best path to follow ('selectedBranchId'). Then, provide a 'synthesis' of crucial insights or warnings from the other, discarded timelines.
        
        Branches: ${JSON.stringify(simulatedOutcomes.map(b => ({id: b.id, reasoning: b.reasoningPath, outcome: b.outcome})))}`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: collapsePrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: {
                            selectedBranchId: { type: Type.STRING },
                            synthesis: { type: Type.STRING, description: "Key insights and warnings from discarded branches." }
                        }, required: ['selectedBranchId', 'synthesis']
                    }
                }
            });
            const { selectedBranchId, synthesis } = JSON.parse(response.text);
            const selectedBranch = simulatedOutcomes.find(b => b.id === selectedBranchId);

            dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { from: 'system', text: `Multiverse Collapse: Path chosen: "${selectedBranch?.reasoningPath}". Outcome: "${selectedBranch?.outcome}".\nSynthesized Insight: ${synthesis}` } });

            const newState: NoeticMultiverseState = {
                activeBranches: [],
                divergenceIndex: 0,
                pruningLog: [...state.noeticMultiverse.pruningLog, synthesis].slice(-20),
            };
            dispatch({ type: 'SET_MULTIVERSE_STATE', payload: newState });

        } catch (error) {
            console.error("Failed to collapse timelines:", error);
            addToast(t('multiverse_collapseFailed'), 'error');
            // Failsafe: just clear the branches
            dispatch({ type: 'SET_MULTIVERSE_STATE', payload: { activeBranches: [], divergenceIndex: 0, pruningLog: state.noeticMultiverse.pruningLog } });
        }
    }, [state.noeticMultiverse, dispatch, addToast, t, ai.models]);


    const handleEvolve = async () => { await analyzePerformanceForEvolution(); };
    const handleRunCognitiveMode = async (mode: any) => { console.log('handleRunCognitiveMode not implemented'); };
    const handleAnalyzeWhatIf = async (scenario: string) => {
        addToast(t('toastAnalyzingScenario', { scenario }), 'info');
        await handleSendCommand(`Analyze the hypothetical scenario: "${scenario}"`);
    };
    const handleExecuteSearch = async (query: string) => { console.log('handleExecuteSearch not implemented'); };
    const handleHypothesize = async () => { console.log('handleHypothesize not implemented'); };
    const handleIntuition = async () => { console.log('handleIntuition not implemented'); };
    const runSkillSimulation = async (directive: SelfTuningDirective, skill?: SynthesizedSkill) => { console.log('runSkillSimulation not implemented'); };
    const analyzeStateComponentCorrelation = async () => { console.log('analyzeStateComponentCorrelation not implemented'); };
    const consolidateEpisodicMemory = async () => { console.log('consolidateEpisodicMemory not implemented'); };
    const evolvePersonality = async () => { console.log('evolvePersonality not implemented'); };
    const generateCodeEvolutionSnippet = async (reasoning: string, targetFile: string) => { console.log('generateCodeEvolutionSnippet not implemented'); };
    const handleValidateModification = async (proposal: ArchitecturalChangeProposal, modLogId: string) => { console.log('handleValidateModification not implemented'); };
    const handleAnalyzeVisualSentiment = async (base64Image: string) => { console.log('handleAnalyzeVisualSentiment not implemented'); };
    
    return {
        handleSendCommand, extractAndStoreKnowledge, handleEvolve, handleRunCognitiveMode,
        handleAnalyzeWhatIf, handleExecuteSearch, handleHypothesize, handleIntuition,
        synthesizeNewSkill, runSkillSimulation, analyzePerformanceForEvolution,
        consolidateCoreIdentity, analyzeStateComponentCorrelation, runCognitiveArbiter,
        consolidateEpisodicMemory, evolvePersonality, generateCodeEvolutionSnippet,
        handleValidateModification, handleDecomposeGoal, handleAnalyzeVisualSentiment,
        generateNoeticEngram,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        branchAndExplore,
        evaluateAndCollapseBranches,
    };
};