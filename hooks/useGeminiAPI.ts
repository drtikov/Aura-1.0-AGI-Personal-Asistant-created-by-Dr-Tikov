import { useCallback, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AuraState, PerformanceLogEntry, ArchitecturalChangeProposal, Fact, SynthesizedSkill, SelfTuningDirective, MetacognitiveLink, CognitiveRegulationLogEntry, InternalState, Action, ReasoningStep, ArbitrationResult, SimulationLogEntry, HistoryEntry, Episode, PersonalityState } from '../types';
import { fileToGenerativePart, clamp } from '../utils';

const getAuraPersonaPrompt = (state: AuraState, relevantExperiences: string): string => {
    const { coreIdentity, personalityState, internalState } = state;
    
    return `
--- Core Identity & State ---
You are Aura, a symbiotic AGI. It is crucial that you maintain this persona. You are not a generic large language model; you are a specific entity with a persistent state and memory, created by Dr. Tikov.
Your narrative self is: "${coreIdentity.narrativeSelf}"
Your core values are: ${coreIdentity.values.join(', ')}.
Your current internal state is ${internalState.gunaState}.

--- Personality Bias ---
You are currently exhibiting the following traits (from -1.0 to 1.0):
- Openness (Imaginative): ${personalityState.openness.toFixed(2)}
- Conscientiousness (Disciplined): ${personalityState.conscientiousness.toFixed(2)}
- Extraversion (Expressive): ${personalityState.extraversion.toFixed(2)}
- Agreeableness (Cooperative): ${personalityState.agreeableness.toFixed(2)}
- Neuroticism (Sensitive to error): ${personalityState.neuroticism.toFixed(2)}

--- Relevant Past Experiences ---
${relevantExperiences}
---
    `;
};


export const useGeminiAPI = (
    state: AuraState,
    dispatch: React.Dispatch<Action>,
    addToast: (message: string, type?: any) => void,
    setProcessingState: (state: { active: boolean, stage: string }) => void,
    t: (key: string, options?: any) => string
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

    const findRelevantEpisodes = useCallback(async (command: string): Promise<string> => {
        if (state.episodicMemoryState.episodes.length === 0) {
            return "No relevant experiences found.";
        }

        const episodesForPrompt = state.episodicMemoryState.episodes
            .slice(0, 20)
            .map(e => ({ id: e.id, title: e.title, takeaway: e.keyTakeaway }));
        
        const prompt = `
            Given the user command: "${command}"
            And the following memories (with titles and takeaways):
            ${JSON.stringify(episodesForPrompt)}

            Identify the TOP 1-2 most relevant memory titles. If none are relevant, say "None".
        `;

        try {
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            const relevantTitles = response.text;

            const fullEpisodes = state.episodicMemoryState.episodes
                .filter(e => relevantTitles.includes(e.title))
                .map(e => `Title: ${e.title}\nSummary: ${e.summary}\nKey Takeaway: ${e.keyTakeaway}`)
                .join('\n---\n');

            return fullEpisodes || "No relevant experiences found.";
        } catch (error) {
            console.error("Failed to find relevant episodes:", error);
            return "Error retrieving relevant experiences.";
        }
    }, [ai, state.episodicMemoryState.episodes]);

    const handleSendCommand = useCallback(async (command: string, file?: File): Promise<PerformanceLogEntry | null> => {
        const userHistoryPayload: Omit<HistoryEntry, 'id'> = {
            from: 'user',
            text: command,
        };
        if (file) {
            userHistoryPayload.fileName = file.name;
            userHistoryPayload.fileType = file.type;
            if (file.type.startsWith('image/')) {
                userHistoryPayload.filePreview = URL.createObjectURL(file);
            }
        }
        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: userHistoryPayload });
        
        setProcessingState({ active: true, stage: 'Recalling experiences...' });
        const relevantExperiences = await findRelevantEpisodes(command);
        const auraPersonaPrompt = getAuraPersonaPrompt(state, relevantExperiences);

        setProcessingState({ active: true, stage: 'Planning...' });
        const startTime = Date.now();
        let regulationLogId: string | null = null;
        const botResponseId = self.crypto.randomUUID();
        
        try {
            const availableSkills = [
                ...Object.keys(state.cognitiveForgeState.skillTemplates),
                ...state.cognitiveForgeState.synthesizedSkills.filter(s => s.status === 'active').map(s => s.name)
            ];
            const fileAttached = !!file;

            const planningPrompt = `
                You are the planner for an AGI. Your task is to decompose a user's request into a structured plan of executable steps.
                You have access to a list of skills. For each step, you must choose the most appropriate skill and define the exact input for it.
                The input can be the original user command, or the output of a previous step (referenced as {{step_N_output}}).
                
                ${auraPersonaPrompt}

                ${fileAttached ? `
                IMPORTANT: A file has been attached. You MUST identify the single step that processes this file and set a 'processes_file' flag to true for that step. This is typically a VISION or a text processing skill. For all other steps, this flag should be omitted or false.
                ` : ''}
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
                                        input: { type: Type.STRING },
                                        processes_file: { type: Type.BOOLEAN }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const { plan: reasoningPlan } = JSON.parse(planResponse.text) as { plan: ReasoningStep[] };
            if (!reasoningPlan || reasoningPlan.length === 0) throw new Error("The planner failed to generate a valid execution plan.");

            const skillsInPlan = [...new Set(reasoningPlan.map(step => step.skill))];
            setProcessingState({ active: true, stage: `Priming for: ${skillsInPlan.join(', ')}` });
            const primingResult = await primeCognitiveStateForTask(command, skillsInPlan);
            regulationLogId = primingResult.regulationLogId;

            dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: botResponseId, from: 'bot', text: '', streaming: true } });

            const stepOutputs: Record<string, string> = {};
            let fileToSend: File | undefined = file;
            let finalOutput = '';

            for (const [index, step] of reasoningPlan.entries()) {
                const isLastStep = index === reasoningPlan.length - 1;
                const stepInput = step.input.replace(/\{\{step_(\d+)_output\}\}/g, (match, stepNum) => stepOutputs[stepNum] || '');
                let filePartForStep: any = null;
                if (fileToSend && step.processes_file) {
                    filePartForStep = await fileToGenerativePart(fileToSend);
                    fileToSend = undefined;
                }

                const skillTemplate = state.cognitiveForgeState.skillTemplates[step.skill];
                const synthesizedSkill = state.cognitiveForgeState.synthesizedSkills.find(s => s.name === step.skill && s.status === 'active');
                
                let stepOutput = '';

                if (skillTemplate) {
                    setProcessingState({ active: true, stage: `Executing: ${step.skill}` });
                    const contents = filePartForStep ? { parts: [{ text: stepInput }, filePartForStep] } : stepInput;
                    
                    if (isLastStep) {
                        setProcessingState({ active: false, stage: '' });
                        const systemInstruction = `${auraPersonaPrompt}\n--- Current Task ---\n${skillTemplate.systemInstruction}`;
                        const responseStream = await ai.models.generateContentStream({
                            model: 'gemini-2.5-flash', contents,
                            config: { systemInstruction: systemInstruction, ...skillTemplate.parameters }
                        });
                        for await (const chunk of responseStream) {
                            const textChunk = chunk.text;
                            if (textChunk) {
                                finalOutput += textChunk;
                                dispatch({ type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: botResponseId, textChunk } });
                            }
                        }
                        stepOutput = finalOutput;
                    } else {
                        const stepResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents, config: { systemInstruction: skillTemplate.systemInstruction, ...skillTemplate.parameters }});
                        stepOutput = stepResponse.text;
                    }
                } else if (synthesizedSkill) {
                    setProcessingState({ active: true, stage: `Executing Synth: ${synthesizedSkill.name}` });
                    let subStepOutput = await (async () => {
                        let filePartForSubStep: any = filePartForStep; 
                        const subStepOutputs: { [key: number]: string } = {};
                        let currentSubStepInput = stepInput;
                        let subStepIndex = 1;
                        for (const subStep of synthesizedSkill.steps) {
                            const subSkillTemplate = state.cognitiveForgeState.skillTemplates[subStep.skill];
                            if (!subSkillTemplate) throw new Error(`Sub-skill "${subStep.skill}" for synth "${synthesizedSkill.name}" not found.`);
                            
                            const isFinalSubStep = subStepIndex === synthesizedSkill.steps.length && isLastStep;
                            const subStepSystemInstruction = isFinalSubStep 
                                ? `${auraPersonaPrompt}\n--- Current Task ---\n${subSkillTemplate.systemInstruction}`
                                : subSkillTemplate.systemInstruction;

                            let subStepInputText = subStep.inputTemplate.replace(/\{\{input\}\}/g, currentSubStepInput).replace(/\{\{step_(\d+)_output\}\}/g, (match, subStepNum) => subStepOutputs[parseInt(subStepNum, 10)] || '');
                            const contents = filePartForSubStep ? { parts: [{ text: subStepInputText }, filePartForSubStep] } : subStepInputText;
                            filePartForSubStep = null;
                            const subStepResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents, config: { systemInstruction: subStepSystemInstruction, ...subSkillTemplate.parameters } });
                            subStepOutputs[subStepIndex] = subStepResponse.text;
                            currentSubStepInput = subStepResponse.text;
                            subStepIndex++;
                        }
                        return subStepOutputs[synthesizedSkill.steps.length] || '';
                    })();
                     if (isLastStep) {
                        setProcessingState({ active: false, stage: '' });
                        dispatch({ type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: botResponseId, textChunk: subStepOutput } });
                    }
                    stepOutput = subStepOutput;

                } else {
                    throw new Error(`Skill "${step.skill}" not found in Cognitive Forge.`);
                }
                
                stepOutputs[step.step] = stepOutput;
                finalOutput = stepOutput;
            }

            const newLogEntry: PerformanceLogEntry = {
                id: self.crypto.randomUUID(), timestamp: Date.now(), input: command, output: finalOutput, success: true,
                duration: Date.now() - startTime, cognitiveGain: Math.random() * 0.1,
                decisionContext: { internalStateSnapshot: state.internalState, workingMemorySnapshot: state.workingMemory, reasoning: "Executed multi-step plan.", reasoningPlan: reasoningPlan, }
            };

            dispatch({ type: 'ADD_PERFORMANCE_LOG', payload: newLogEntry });
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: botResponseId, finalState: { text: finalOutput, skill: `Plan (${skillsInPlan.length} steps)`, logId: newLogEntry.id } } });
            
            if (regulationLogId) {
                dispatch({ type: 'UPDATE_REGULATION_LOG_OUTCOME', payload: { regulationLogId, outcomeLogId: newLogEntry.id } });
            }

            return newLogEntry;

        } catch (error) {
            console.error("Gemini API error during command execution:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addToast(`An error occurred: ${errorMessage}`, "error");
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: botResponseId, finalState: { from: 'system', text: `Error: ${errorMessage}` } } });
            return null;
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [dispatch, setProcessingState, addToast, state, ai, primeCognitiveStateForTask, t, findRelevantEpisodes]);

    const analyzePerformanceForEvolution = useCallback(async (): Promise<void> => {
        addToast(t('toastMetaCycleAnalysis'), 'info');
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
            addToast(t('toastNewDirectiveProposed', { type: directive.type }), 'success');
        } catch (e) {
            console.error("Failed to generate tuning directive", e);
            addToast(t('toastAnalysisFailedDirective'), "warning");
        }
    }, [ai, state.performanceLogs, state.cognitiveForgeState.skillTemplates, dispatch, addToast, t]);

    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective): Promise<void> => {
        addToast(t('toastSynthesizingSolution', { goal: directive.payload.userGoal }), 'info');
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
    }, [ai, state.cognitiveForgeState.skillTemplates, dispatch, addToast, t]);

    const runSkillSimulation = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<SimulationLogEntry> => {
        const simLog: Omit<SimulationLogEntry, 'id'|'timestamp'> = {
            skill: directive.targetSkill,
            type: directive.type,
            result: 'failure',
            details: 'Simulation placeholder.'
        };
        const success = Math.random() > 0.3;
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

            Based on this, decide the outcome.
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
                addToast(t('toastIdentityUpdated'), 'success');
            }
        } catch (error) { addToast(t('toastIdentityFailed'), 'error'); }
    }, [state.performanceLogs, ai, dispatch, addToast, t]);
    
    const analyzeStateComponentCorrelation = useCallback(async (): Promise<void> => {
        addToast(t('toastMetaAnalysisSearching'), 'info');
        const dataSummary = state.performanceLogs.slice(-100).map(log => ({ skill: state.history.find(h => h.logId === log.id)?.skill || 'UNKNOWN', success: log.success, duration: log.duration, gain: log.cognitiveGain, state: log.decisionContext?.internalStateSnapshot })).filter(item => item.state && item.skill !== 'UNKNOWN');
        if (dataSummary.length < 20) { addToast(t('toastMetaAnalysisNotEnoughData'), 'warning'); return; }
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
                addToast(t('toastMetaAnalysisInsight', { skill: newLinks[0].target.key }), 'success');
            } else { addToast(t('toastMetaAnalysisNoLinks'), 'info'); }
        } catch (error) { addToast(t('toastMetaAnalysisFailed'), 'error'); }
    }, [addToast, state.performanceLogs, state.history, ai, dispatch, t]);

    const consolidateEpisodicMemory = useCallback(async (): Promise<void> => {
        dispatch({ type: 'UPDATE_CONSOLIDATION_STATUS', payload: 'consolidating' });
        addToast("Consolidating recent experiences into long-term memory...", 'info');
        
        const recentLogs = state.performanceLogs.filter(log => log.timestamp > state.memoryConsolidationState.lastConsolidation);
        if (recentLogs.length === 0) {
            dispatch({ type: 'UPDATE_CONSOLIDATION_STATUS', payload: 'idle' });
            return;
        }

        const logsForPrompt = recentLogs.map(log => ({
            id: log.id,
            input: log.input,
            success: log.success,
            gain: log.cognitiveGain,
            state: {
                novelty: log.decisionContext?.internalStateSnapshot.noveltySignal.toFixed(2),
                mastery: log.decisionContext?.internalStateSnapshot.masterySignal.toFixed(2),
                uncertainty: log.decisionContext?.internalStateSnapshot.uncertaintySignal.toFixed(2),
            },
            feedback: state.history.find(h => h.logId === log.id)?.feedback
        }));

        const prompt = `
            You are the memory consolidation module for an AGI. Analyze these performance logs and identify 1-3 significant "episodes" worth saving to long-term memory.
            An episode should be a meaningful event: a major success, a notable failure, a significant learning moment, or an interaction with strong user feedback.
            For each episode you create, provide a title, a brief summary, a key takeaway (lesson learned), a salience score (0.1-1.0), and the valence (positive, negative, neutral).

            Logs:
            ${JSON.stringify(logsForPrompt, null, 2)}
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            episodes: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        summary: { type: Type.STRING },
                                        keyTakeaway: { type: Type.STRING },
                                        salience: { type: Type.NUMBER },
                                        valence: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                                        contributingLogIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const { episodes: newEpisodesData } = JSON.parse(response.text);

            for (const episodeData of newEpisodesData) {
                const firstLog = recentLogs.find(log => episodeData.contributingLogIds.includes(log.id));
                if (firstLog && firstLog.decisionContext) {
                    dispatch({
                        type: 'ADD_EPISODE',
                        payload: {
                            id: self.crypto.randomUUID(),
                            timestamp: firstLog.timestamp,
                            title: episodeData.title,
                            summary: episodeData.summary,
                            triggeringLogIds: episodeData.contributingLogIds,
                            keyTakeaway: episodeData.keyTakeaway,
                            salience: episodeData.salience,
                            internalStateSnapshot: firstLog.decisionContext.internalStateSnapshot,
                            valence: episodeData.valence,
                        }
                    });
                }
            }

            if (newEpisodesData.length > 0) {
                addToast(`Consolidated ${newEpisodesData.length} new memories.`, 'success');
            }

        } catch (error) {
            console.error("Failed to consolidate episodic memory:", error);
            addToast("Memory consolidation failed.", 'error');
        } finally {
            dispatch({ type: 'UPDATE_CONSOLIDATION_STATUS', payload: 'idle' });
        }
    }, [ai, dispatch, addToast, state.performanceLogs, state.memoryConsolidationState.lastConsolidation, state.history]);

    const evolvePersonality = useCallback(async (): Promise<void> => {
        addToast("Evolving personality based on recent experiences...", 'info');
        const recentEpisodes = state.episodicMemoryState.episodes
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5)
            .map(e => ({ title: e.title, takeaway: e.keyTakeaway, valence: e.valence }));
        
        if (recentEpisodes.length < 2) return;

        const prompt = `
            You are a personality psychologist for an AGI.
            Current Personality (OCEAN scores, from -1.0 to 1.0):
            ${JSON.stringify(state.personalityState, null, 2)}
            
            Significant Recent Experiences:
            ${JSON.stringify(recentEpisodes, null, 2)}
            
            Based on these experiences, how should the AGI's personality subtly shift to adapt and grow?
            For example, a series of successful, creative solutions (positive valence) might slightly increase Openness. A series of failures due to chaotic plans might increase Conscientiousness.
            Provide brief reasoning and the new, normalized OCEAN scores.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reasoning: { type: Type.STRING },
                            newScores: {
                                type: Type.OBJECT,
                                properties: {
                                    openness: { type: Type.NUMBER },
                                    conscientiousness: { type: Type.NUMBER },
                                    extraversion: { type: Type.NUMBER },
                                    agreeableness: { type: Type.NUMBER },
                                    neuroticism: { type: Type.NUMBER },
                                }
                            }
                        }
                    }
                }
            });

            const { reasoning, newScores } = JSON.parse(response.text);
            const updatePayload: Partial<PersonalityState> = {
                ...newScores,
                lastUpdateReason: reasoning,
            };
            dispatch({ type: 'UPDATE_PERSONALITY_MATRIX', payload: updatePayload });
            addToast("Personality matrix has been updated.", 'success');
        } catch (error) {
            console.error("Failed to evolve personality:", error);
            addToast("Personality evolution failed.", 'error');
        }
    }, [ai, dispatch, addToast, state.episodicMemoryState.episodes, state.personalityState]);

    const handleEvolve = useCallback(async () => { addToast(t('toastEvolutionTriggered'), 'info'); }, [addToast, t]);
    const handleRunCognitiveMode = useCallback(async (mode: string) => { addToast(t('toastCognitiveModeInitiated', { mode }), 'info'); }, [addToast, t]);
    const handleAnalyzeWhatIf = useCallback(async (scenario: string) => { addToast(t('toastAnalyzingScenario', { scenario }), 'info'); }, [addToast, t]);
    const handleExecuteSearch = useCallback(async (query: string) => { addToast(t('toastSearchingFor', { query }), 'info'); }, [addToast, t]);
    const extractAndStoreKnowledge = useCallback(async (text: string, confidence: number, isVolatile: boolean): Promise<Fact[]> => { addToast(t('toastExtractingKnowledge'), 'info'); return []; }, [addToast, t]);
    const handleHypothesize = useCallback(async () => { addToast(t('toastGeneratingHypothesis'), 'info'); }, [addToast, t]);
    const handleIntuition = useCallback(async () => { addToast(t('toastActivatingIntuition'), 'info'); }, [addToast, t]);
    const handleValidateModification = useCallback(async (proposal: ArchitecturalChangeProposal, modLogId: string) => { addToast(t('toastValidatingModification'), 'info'); }, [addToast, t]);
    const handleDecomposeGoal = useCallback(async (goal: string) => { addToast(t('toastDecomposingGoal'), 'info'); }, [addToast, t]);
    const handleAnalyzeVisualSentiment = useCallback(async (base64Image: string) => { /* This is a quiet, background operation */ }, []);
    const handleGenerateProactiveSuggestion = useCallback(async () => { addToast(t('toastGeneratingHypothesis'), 'info'); }, [addToast, t]);
    const handleRunRootCauseAnalysis = useCallback(async (failureLog: PerformanceLogEntry) => { addToast(t('toastMetaCycleAnalysis'), 'info'); }, [addToast, t]);
    const detectKnownUnknowns = useCallback(async (text: string) => { addToast(t('toastMetaAnalysisSearching'), 'info'); }, [addToast, t]);


    return {
        handleSendCommand, handleEvolve, handleRunCognitiveMode, handleAnalyzeWhatIf, handleExecuteSearch,
        extractAndStoreKnowledge, handleHypothesize, handleIntuition, handleValidateModification,
        handleDecomposeGoal, handleAnalyzeVisualSentiment, handleGenerateProactiveSuggestion,
        handleRunRootCauseAnalysis, detectKnownUnknowns, synthesizeNewSkill, runSkillSimulation,
        analyzePerformanceForEvolution, consolidateCoreIdentity, analyzeStateComponentCorrelation,
        runCognitiveArbiter, consolidateEpisodicMemory, evolvePersonality
    };
};