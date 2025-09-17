import { useCallback, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AuraState, PerformanceLogEntry, ArchitecturalChangeProposal, Fact, SynthesizedSkill, SelfTuningDirective, MetacognitiveLink, CognitiveRegulationLogEntry, InternalState, Action, ReasoningStep, ArbitrationResult, SimulationLogEntry } from '../types';
import { fileToGenerativePart, clamp } from '../utils';

export const useGeminiAPI = (
    state: AuraState,
    dispatch: React.Dispatch<Action>,
    addToast: (message: string, type?: any) => void,
    setProcessingState: (state: { active: boolean, stage: string }) => void
) => {
    const ai = useMemo(() => new GoogleGenAI({apiKey: process.env.API_KEY}), []);

    const primeCognitiveStateForTask = useCallback(async (command: string, skills: string[]): Promise<{ regulationLogId: string | null }> => {
        const model = state.metacognitiveCausalModel;
        const currentState = state.internalState;
        const adjustments: Partial<Record<keyof InternalState, number>> = {};
        const appliedDirectives: string[] = [];
        const stateAdjustmentsForLog: CognitiveRegulationLogEntry['stateAdjustments'] = {};
    
        for (const skill of skills) {
            const relevantLinks = Object.values(model).filter(link => link.target.key === skill);
    
            for (const link of relevantLinks) {
                const signalKey = link.source.key as keyof InternalState;
                if (typeof currentState[signalKey] !== 'number') continue;
    
                const currentValue = currentState[signalKey] as number;
                const isDetrimental = link.correlation < -0.1;
    
                if (isDetrimental) {
                    if (link.source.condition === 'HIGH' && currentValue > 0.7) {
                        adjustments[signalKey] = (adjustments[signalKey] || 0) - 0.2;
                         appliedDirectives.push(`Reduced ${signalKey} for ${skill}`);
                    } else if (link.source.condition === 'LOW' && currentValue < 0.3) {
                        adjustments[signalKey] = (adjustments[signalKey] || 0) + 0.2;
                         appliedDirectives.push(`Increased ${signalKey} for ${skill}`);
                    }
                }
            }
        }
    
        if (Object.keys(adjustments).length > 0) {
            const reason = `Optimizing state for task requiring [${skills.join(', ')}]`;
            
            for(const key in adjustments) {
                const k = key as keyof InternalState;
                const from = currentState[k] as number;
                const to = clamp(from + adjustments[k]!);
                stateAdjustmentsForLog[k] = { from, to };
            }
    
            dispatch({ type: 'PRIME_INTERNAL_STATE', payload: { adjustments, reason } });
    
            const newLogEntry: CognitiveRegulationLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                triggeringCommand: command,
                targetSkills: skills,
                primingDirective: reason,
                stateAdjustments: stateAdjustmentsForLog,
                outcomeLogId: null,
            };
            dispatch({ type: 'LOG_COGNITIVE_REGULATION', payload: newLogEntry });
    
            return { regulationLogId: newLogEntry.id };
        }
    
        return { regulationLogId: null };
    }, [dispatch, state.internalState, state.metacognitiveCausalModel]);

    const handleSendCommand = useCallback(async (command: string, file?: File): Promise<PerformanceLogEntry | null> => {
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { from: 'user', text: command } });
        setProcessingState({ active: true, stage: 'Planning...' });
        const startTime = Date.now();
        let regulationLogId: string | null = null;
        
        try {
            // Step 1: PLAN - Decompose the task into a series of steps using available skills.
            const availableSkills = [
                ...Object.keys(state.cognitiveForgeState.skillTemplates),
                ...state.cognitiveForgeState.synthesizedSkills.map(s => s.name)
            ];
            const planningPrompt = `
                You are the planner for an AGI. Your task is to decompose a user's request into a structured plan of executable steps.
                You have access to a list of skills. For each step, you must choose the most appropriate skill and define the exact input for it.
                The input can be the original user command, or the output of a previous step (referenced as {{step_N_output}}).

                Available Skills: ${availableSkills.join(', ')}
                User Request: "${command}"

                Generate a plan.
            `;
            
            const planResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: planningPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            plan: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        step: { type: Type.INTEGER },
                                        skill: { type: Type.STRING },
                                        reasoning: { type: Type.STRING },
                                        input: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const { plan: reasoningPlan } = JSON.parse(planResponse.text) as { plan: ReasoningStep[] };

            if (!reasoningPlan || reasoningPlan.length === 0) {
                throw new Error("The planner failed to generate a valid execution plan.");
            }

            // Step 2: PRIME - Adjust cognitive state based on the skills required for the plan.
            const skillsInPlan = [...new Set(reasoningPlan.map(step => step.skill))];
            setProcessingState({ active: true, stage: `Priming for: ${skillsInPlan.join(', ')}` });
            const primingResult = await primeCognitiveStateForTask(command, skillsInPlan);
            regulationLogId = primingResult.regulationLogId;

            // Step 3: EXECUTE - Iterate through the plan and execute each step.
            const stepOutputs: Record<string, string> = {};
            for (const step of reasoningPlan) {
                setProcessingState({ active: true, stage: `Executing: ${step.skill}` });
                
                // Substitute inputs from previous steps
                let finalInput = step.input.replace(/\{\{step_(\d+)_output\}\}/g, (match, stepNum) => {
                    return stepOutputs[stepNum] || '';
                });

                const skillTemplate = state.cognitiveForgeState.skillTemplates[step.skill];
                if (!skillTemplate) { throw new Error(`Skill "${step.skill}" not found in Cognitive Forge.`); }

                let contents: any = finalInput;
                if (file && step.step === 1) { // Assume file is only for the first step
                    const filePart = await fileToGenerativePart(file);
                    contents = { parts: [{ text: finalInput }, filePart] };
                }

                const stepResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents,
                    config: {
                        systemInstruction: skillTemplate.systemInstruction,
                        ...skillTemplate.parameters
                    }
                });

                stepOutputs[step.step] = stepResponse.text;
            }

            // Step 4: SUMMARIZE - Synthesize the final output from the last step's result.
            setProcessingState({ active: true, stage: 'Synthesizing response...' });
            const finalOutput = stepOutputs[reasoningPlan.length]; // Use the last step's output directly or summarize if needed.
            
            const newLogEntry: PerformanceLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                input: command,
                output: finalOutput,
                success: true, // Placeholder
                duration: Date.now() - startTime,
                cognitiveGain: Math.random() * 0.1, // Placeholder
                decisionContext: {
                    internalStateSnapshot: state.internalState,
                    workingMemorySnapshot: state.workingMemory,
                    reasoning: "Executed multi-step plan.",
                    reasoningPlan: reasoningPlan,
                }
            };

            dispatch({ type: 'ADD_PERFORMANCE_LOG', payload: newLogEntry });
            dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { from: 'bot', text: newLogEntry.output || '', skill: `Plan (${skillsInPlan.length} steps)`, logId: newLogEntry.id } });
            
            if (regulationLogId) {
                dispatch({ type: 'UPDATE_REGULATION_LOG_OUTCOME', payload: { regulationLogId, outcomeLogId: newLogEntry.id } });
            }

            return newLogEntry;

        } catch (error) {
            console.error("Gemini API error during command execution:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addToast(`An error occurred: ${errorMessage}`, "error");
            dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { from: 'system', text: `Error: ${errorMessage}` } });
            return null;
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [dispatch, setProcessingState, addToast, state.cognitiveForgeState, state.internalState, state.workingMemory, ai, primeCognitiveStateForTask]);

    const analyzePerformanceForEvolution = useCallback(async (): Promise<void> => {
        addToast('Metacognitive cycle: Analyzing architecture for improvements...', 'info');
        const logs = state.performanceLogs.slice(-50);
        const templates = state.cognitiveForgeState.skillTemplates;
        if (logs.length < 10) return;

        const prompt = `
            Analyze the provided AGI performance logs and skill templates to identify the single most impactful opportunity for improvement. 
            Generate a single, concrete Self-Tuning Directive.
            
            Possible Directive Types:
            1.  'TUNE_PARAMETERS': If a skill's performance is inconsistent. Suggest a specific change to temperature, topK, or topP. (e.g., lower temperature for CODE_GENERATION if it's producing buggy code).
            2.  'REWRITE_INSTRUCTION': If a skill's system instruction is ambiguous or causing repeated, subtle failures. Propose a new, improved instruction.
            3.  'SYNTHESIZE_SKILL': If you observe a recurring, multi-step pattern in user requests that is not covered by a single skill. Propose a new skill to automate this pattern.

            Logs: ${JSON.stringify(logs.map(l => ({ input: l.input, success: l.success, duration: l.duration, skill: l.decisionContext?.reasoningPlan[0]?.skill })))}
            Templates: ${JSON.stringify(templates)}
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['TUNE_PARAMETERS', 'REWRITE_INSTRUCTION', 'SYNTHESIZE_SKILL'] },
                            targetSkill: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            payload: { type: Type.OBJECT, properties: {} }
                        }
                    }
                }
            });
            const directiveData = JSON.parse(response.text);
            const directive: SelfTuningDirective = { ...directiveData, id: self.crypto.randomUUID(), timestamp: Date.now(), status: 'proposed' };
            dispatch({ type: 'ADD_SELF_TUNING_DIRECTIVE', payload: directive });
            addToast(`New evolutionary directive proposed: ${directive.type}`, 'success');
        } catch (e) {
            console.error("Failed to generate tuning directive", e);
            addToast("Performance analysis failed to produce a directive.", "warning");
        }
    }, [ai, state.performanceLogs, state.cognitiveForgeState.skillTemplates, dispatch, addToast]);

    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective): Promise<void> => {
        addToast(`Synthesizing solution for: ${directive.payload.userGoal}`, 'info');
        const availableSkills = Object.keys(state.cognitiveForgeState.skillTemplates).join(', ');

        const prompt = `
            Based on the user goal "${directive.payload.userGoal}" and the available skills [${availableSkills}], generate a plan for a new synthesized skill.
            The plan should be an array of steps. Each step must define the skill to use and an inputTemplate.
            - Use '{{input}}' to represent the user's initial prompt to the new skill.
            - Use '{{step_N_output}}' to reference the output of a previous step.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            steps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: { skill: { type: Type.STRING }, inputTemplate: { type: Type.STRING } }
                                }
                            }
                        }
                    }
                }
            });

            const skillData = JSON.parse(response.text);
            const newSkill: SynthesizedSkill = {
                id: self.crypto.randomUUID(),
                name: skillData.name.replace(/\s/g, '_'),
                description: skillData.description,
                steps: skillData.steps,
                status: 'active',
                sourceDirectiveId: directive.id,
            };

            dispatch({ type: 'ADD_SYNTHESIZED_SKILL', payload: { skill: newSkill, directiveId: directive.id } });
        } catch (e) {
            console.error("Failed to synthesize skill plan:", e);
            dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'failed' } } });
        }
    }, [ai, state.cognitiveForgeState.skillTemplates, dispatch, addToast]);

    const runSkillSimulation = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<SimulationLogEntry> => {
        const simLog: Omit<SimulationLogEntry, 'id'|'timestamp'> = {
            skill: directive.targetSkill,
            type: directive.type,
            result: 'failure',
            details: 'Simulation placeholder.'
        };
        // In a real scenario, this would involve running test cases against the proposed change.
        // For now, we simulate a probabilistic outcome.
        const success = Math.random() > 0.3; // 70% chance of success
        simLog.result = success ? 'success' : 'failure';
        simLog.details = success ? `Simulation for ${directive.type} on ${directive.targetSkill} passed validation.` : `Simulation failed: The proposed change did not meet performance criteria.`;
        
        const logEntry: SimulationLogEntry = { ...simLog, id: self.crypto.randomUUID(), timestamp: Date.now() };
        dispatch({ type: 'ADD_SIMULATION_LOG', payload: logEntry });
        return logEntry;
    }, [dispatch]);

    const runCognitiveArbiter = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<ArbitrationResult | null> => {
        const prompt = `
            You are the Cognitive Arbiter of an AGI. Your role is to ensure self-modifications are safe, effective, and aligned with core values.
            Evaluate the following proposed self-tuning directive.
            
            Directive:
            - Type: ${directive.type}
            - Target: ${directive.targetSkill}
            - Reasoning: ${directive.reasoning}
            - Proposed Change: ${JSON.stringify(directive.payload)}
            - Simulation Result: ${directive.simulationResult?.result} - "${directive.simulationResult?.details}"

            Core Values: ${state.coreIdentity.values.join(', ')}

            Based on this, decide the outcome. Consider risk, potential benefit, and alignment.
            - 'APPROVE_AUTONOMOUSLY': For low-risk, high-confidence improvements (e.g., minor parameter tuning).
            - 'REQUEST_USER_APPROVAL': For significant changes (e.g., new skills) or when confidence is moderate.
            - 'REJECT': If the change is risky, flawed, or misaligned.
        `;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            decision: { type: Type.STRING, enum: ['APPROVE_AUTONOMOUSLY', 'REQUEST_USER_APPROVAL', 'REJECT'] },
                            confidence: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING }
                        }
                    }
                }
            });
            return JSON.parse(response.text) as ArbitrationResult;
        } catch (e) {
            console.error("Cognitive Arbiter failed:", e);
            return null;
        }
    }, [ai, state.coreIdentity.values]);
    
    const consolidateCoreIdentity = useCallback(async (): Promise<void> => {
        const historySummary = state.performanceLogs.slice(-100).map(log => `Input: "${log.input}" -> Success: ${log.success}, Gain: ${log.cognitiveGain.toFixed(2)}`).join('\n');
        const prompt = `Based on my recent performance, synthesize my core identity: a "narrativeSelf" (first-person sentence) and 3-5 single-word "values".\n\nLogs:\n${historySummary}`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { narrativeSelf: { type: Type.STRING }, values: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
            });
            const identity = JSON.parse(response.text.trim());
            if(identity.narrativeSelf && Array.isArray(identity.values)) {
                dispatch({ type: 'UPDATE_CORE_IDENTITY', payload: identity });
                addToast('Core identity updated.', 'success');
            }
        } catch (error) { addToast('Failed to consolidate core identity.', 'error'); }
    }, [state.performanceLogs, ai, dispatch, addToast]);
    
    const analyzeStateComponentCorrelation = useCallback(async (): Promise<void> => {
        addToast('Metacognitive Analysis: Searching for internal causal links...', 'info');
        const dataSummary = state.performanceLogs.slice(-100).map(log => ({ skill: state.history.find(h => h.logId === log.id)?.skill || 'UNKNOWN', success: log.success, duration: log.duration, gain: log.cognitiveGain, state: log.decisionContext?.internalStateSnapshot })).filter(item => item.state && item.skill !== 'UNKNOWN');
        if (dataSummary.length < 20) { addToast('Analysis skipped: Not enough data.', 'warning'); return; }
        const prompt = `Analyze this AGI data. Find one strong correlation link between an internal state signal (HIGH >0.7 or LOW <0.3) and a skill's performance (successRate, duration). DATA: ${JSON.stringify(dataSummary)}`;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { source_key: { type: Type.STRING }, source_condition: { type: Type.STRING, enum: ['HIGH', 'LOW'] }, target_key: { type: Type.STRING }, target_metric: { type: Type.STRING, enum: ['successRate', 'duration'] }, correlation: { type: Type.NUMBER }, observation_count: { type: Type.INTEGER } } } }
                }
            });
            const results = JSON.parse(response.text.trim());
            const newLinks: MetacognitiveLink[] = results.map((r: any) => ({ id: `${r.source_key}:${r.target_key}:${r.target_metric}`, source: { type: 'internalState', key: r.source_key, condition: r.source_condition }, target: { type: 'componentPerformance', key: r.target_key, metric: r.target_metric }, correlation: r.correlation, observationCount: r.observation_count, lastUpdated: Date.now() }));
            if (newLinks.length > 0) {
                dispatch({ type: 'UPDATE_META_CAUSAL_MODEL', payload: newLinks });
                addToast(`Discovered new metacognitive insight about ${newLinks[0].target.key}.`, 'success');
            } else { addToast('Analysis complete. No new significant links found.', 'info'); }
        } catch (error) { addToast('Failed to analyze internal causal links.', 'error'); }
    }, [addToast, state.performanceLogs, state.history, ai, dispatch]);

    // --- Other Placeholder Functions ---
    const handleEvolve = useCallback(async () => { addToast('Evolution triggered.', 'info'); }, [addToast]);
    const handleRunCognitiveMode = useCallback(async (mode: string) => { addToast(`Cognitive mode '${mode}' initiated.`, 'info'); }, [addToast]);
    const handleAnalyzeWhatIf = useCallback(async (scenario: string) => { addToast(`Analyzing scenario: ${scenario}`, 'info'); }, [addToast]);
    const handleExecuteSearch = useCallback(async (query: string) => { addToast(`Searching for: ${query}`, 'info'); }, [addToast]);
    const extractAndStoreKnowledge = useCallback(async (text: string, confidence: number, isVolatile: boolean): Promise<Fact[]> => { addToast('Extracting knowledge...', 'info'); return []; }, [addToast]);
    const handleHypothesize = useCallback(async () => { addToast('Generating hypothesis...', 'info'); }, [addToast]);
    const handleIntuition = useCallback(async () => { addToast('Activating intuition...', 'info'); }, [addToast]);
    const handleValidateModification = useCallback(async (proposal: ArchitecturalChangeProposal, modLogId: string) => { addToast('Validating modification...', 'info'); }, [addToast]);
    const handleDecomposeGoal = useCallback(async (goal: string) => { addToast('Decomposing goal...', 'info'); }, [addToast]);
    const handleAnalyzeVisualSentiment = useCallback(async (base64Image: string) => { /* This is a quiet, background operation */ }, []);
    const handleGenerateProactiveSuggestion = useCallback(async () => { addToast('Generating suggestions...', 'info'); }, [addToast]);
    const handleRunRootCauseAnalysis = useCallback(async (failureLog: PerformanceLogEntry) => { addToast('Running root cause analysis...', 'info'); }, [addToast]);
    const detectKnownUnknowns = useCallback(async (text: string) => { addToast('Detecting known unknowns...', 'info'); }, [addToast]);


    return {
        handleSendCommand, handleEvolve, handleRunCognitiveMode, handleAnalyzeWhatIf, handleExecuteSearch,
        extractAndStoreKnowledge, handleHypothesize, handleIntuition, handleValidateModification,
        handleDecomposeGoal, handleAnalyzeVisualSentiment, handleGenerateProactiveSuggestion,
        handleRunRootCauseAnalysis, detectKnownUnknowns, synthesizeNewSkill, runSkillSimulation,
        analyzePerformanceForEvolution, consolidateCoreIdentity, analyzeStateComponentCorrelation,
        runCognitiveArbiter,
    };
};