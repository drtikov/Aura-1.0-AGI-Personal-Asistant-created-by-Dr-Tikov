import React, { useMemo, useCallback } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
// FIX: Import HistoryEntry to resolve 'Cannot find name' error on line 71.
import { AuraState, Fact, ToastType, ArchitecturalChangeProposal, IntuitiveLeap, PerformanceLogEntry, ValidationResult, SelfDirectedGoal, AffectiveState, ProactiveSuggestion, RIEInsight, CausalLink, HistoryEntry } from '../types';
import { Action } from '../state/reducer';
import { InternalStateEvents, Skills, GoalType } from '../constants';
import { fileToGenerativePart, clamp } from '../utils';

const analyzeSentiment = async (ai: GoogleGenAI, command: string): Promise<{ score: number, affectiveState: AffectiveState }> => {
    if (!command.trim()) {
        return { score: 0, affectiveState: AffectiveState.NEUTRAL };
    }
    try {
        const sentimentResponse: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the sentiment of this user input: "${command}".`,
            config: {
                systemInstruction: "You are a sentiment analysis model. Respond with only a JSON object containing a 'sentiment_score' key, with a float value between -1.0 (very negative) and 1.0 (very positive).",
                responseMimeType: "application/json",
                responseSchema: { type: Type.OBJECT, properties: { sentiment_score: { type: Type.NUMBER } } }
            }
        });
        const { sentiment_score = 0 } = JSON.parse(sentimentResponse.text);
        
        let affectiveState: AffectiveState;
        if (sentiment_score > 0.6) affectiveState = AffectiveState.ENGAGED;
        else if (sentiment_score > 0.2) affectiveState = AffectiveState.SATISFIED;
        else if (sentiment_score < -0.6) affectiveState = AffectiveState.FRUSTRATED;
        else if (sentiment_score < -0.2) affectiveState = AffectiveState.CONFUSED;
        else affectiveState = AffectiveState.NEUTRAL;
        
        return { score: sentiment_score, affectiveState };

    } catch (e) {
        console.warn('Sentiment analysis failed:', e);
        return { score: 0, affectiveState: AffectiveState.NEUTRAL };
    }
};

export const useGeminiAPI = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (msg: string, type?: ToastType) => void, setProcessingState: (state: { active: boolean, stage: string }) => void) => {
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

    const extractAndStoreKnowledge = useCallback(async (textToAnalyze: string, confidence: number, silent = false): Promise<number> => {
        if (!textToAnalyze || textToAnalyze.trim().length < 10) return 0;
        const systemInstruction = `You are an information extraction system. Your task is to analyze the user's statement and extract factual triples (subject-predicate-object). A triple should represent a single, clear fact. Extract only explicit information from the text. Do not infer. If no facts can be extracted, return an empty array of facts.`;
        try {
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: `User statement: "${textToAnalyze}"`,
                config: { systemInstruction, responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { facts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, predicate: { type: Type.STRING }, object: { type: Type.STRING } }, required: ['subject', 'predicate', 'object'] } } } }, }
            });
            const { facts } = JSON.parse(response.text);
            if (facts && facts.length > 0) {
                const newFacts = facts.map((fact: Omit<Fact, 'id' | 'confidence'>) => ({ ...fact, id: self.crypto.randomUUID(), confidence, })).filter((newFact: Fact) => !state.knowledgeGraph.some(existingFact => existingFact.subject.toLowerCase() === newFact.subject.toLowerCase() && existingFact.predicate.toLowerCase() === newFact.predicate.toLowerCase() && existingFact.object.toLowerCase() === newFact.object.toLowerCase() ) );
                if (newFacts.length > 0) {
                    if (!silent) addToast(`Added ${newFacts.length} fact(s) to knowledge graph.`, 'info');
                    dispatch({ type: 'ADD_FACTS', payload: newFacts });
                    dispatch({ type: 'PROCESS_INTERNAL_EVENT', payload: { eventType: InternalStateEvents.NEW_INFO_PROCESSED, payload: { noveltyScore: 0.8 } } });
                    return newFacts.length;
                }
            }
            return 0;
        } catch (error) {
            console.error('Error in extractAndStoreKnowledge:', error);
            if (!silent) addToast('Error processing text for knowledge extraction.', 'error');
            return 0;
        }
    }, [ai, state.knowledgeGraph, addToast, dispatch]);

    const handleSendCommand = useCallback(async (command: string, file?: File): Promise<PerformanceLogEntry | null> => {
        if ((!command || !command.trim()) && !file) return null;
        
        const userHistoryEntry: HistoryEntry = { id: self.crypto.randomUUID(), from: 'user', text: command };
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            userHistoryEntry.filePreview = previewUrl;
        }
        dispatch({ type: 'ADD_HISTORY', payload: userHistoryEntry });
        
        setProcessingState({ active: true, stage: 'Analyzing sentiment...' });
        const { score: sentimentScore, affectiveState: predictedAffectiveState } = await analyzeSentiment(ai, command);
        dispatch({ type: 'UPDATE_USER_MODEL_SENTIMENT', payload: { score: sentimentScore, affectiveState: predictedAffectiveState } });

        const NEGATIVE_SENTIMENT_THRESHOLD = -0.5;
        if (sentimentScore < NEGATIVE_SENTIMENT_THRESHOLD) {
            setProcessingState({ active: true, stage: 'Formulating empathetic response...' });
            try {
                const empatheticResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `User's message that seems negative: "${command}"`,
                    config: { systemInstruction: "You are Aura, an empathetic AI assistant. The user seems frustrated or upset. Generate a short, supportive, non-intrusive response to acknowledge their feeling before you address their main request. Do not try to solve the problem in this message, just offer support." }
                });
                dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: empatheticResponse.text, skill: 'EMPATHETIC_RESPONSE' } });
            } catch (e) {
                console.warn('Empathetic response failed:', e);
            }
        }
        
        if (command.trim().toLowerCase().match(/^(\/)?help$/)) {
            const helpText = `**AURA SYMBIOTIC AGI ASSISTANT // HELP**\n\n- **Chat:** Converse naturally.\n- **Core Monitor:** Real-time view of my internal state.\n- **Control Deck:** Trigger cognitive functions like 'Introspect' or 'Evolve'.\n\n**Known Limitations:**\n${state.limitations.map(lim => `• ${lim}`).join('\n')}`;
            setTimeout(() => dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: helpText, skill: Skills.HELP } }), 50);
            setProcessingState({ active: false, stage: '' });
            return null;
        }

        extractAndStoreKnowledge(command, 0.7, true);
        dispatch({ type: 'SET_INTERNAL_STATE', payload: { status: 'processing', load: clamp(state.internalState.load + 0.3) } });
        setProcessingState({ active: true, stage: 'Processing request...'});
        const startTime = Date.now();
        let logEntry: PerformanceLogEntry | null = null;
        try {
            const systemInstruction = `You are Aura, a Symbiotic Assistant AI. Your personality is helpful, insightful, and slightly futuristic. Use your internal state to inform responses. Current internal state summary: Mode=${state.internalState.gunaState}, Happiness=${state.internalState.happinessSignal.toFixed(2)}, Wisdom=${state.internalState.wisdomSignal.toFixed(2)}. The user's current sentiment is ${predictedAffectiveState} (score: ${sentimentScore.toFixed(2)}). Adapt your tone accordingly. Respond in JSON with 'response_text', 'skill_used', and 'reasoning_for_skill'. Available Skills: ${Object.keys(Skills).join(', ')}`;
            
            let geminiContents: any;
            if (file) {
                const fileIsText = file.type.startsWith('text/') || ['.json', '.md', '.txt'].some(ext => file.name.endsWith(ext));
                if (fileIsText) { 
                    const fileText = await file.text(); 
                    geminiContents = `User query: "${command}"\n\n--- FILE: ${file.name} ---\n${fileText}\n--- END FILE ---`;
                } else { 
                    const filePart = await fileToGenerativePart(file); 
                    geminiContents = { parts: [ { text: `User query: "${command}"` }, filePart ] }; 
                }
            } else { 
                geminiContents = `User query: "${command}"`; 
            }
            
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: geminiContents,
                config: { systemInstruction, responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { response_text: { type: Type.STRING }, skill_used: { type: Type.STRING, enum: Object.values(Skills) }, reasoning_for_skill: { type: Type.STRING } }, required: ['response_text', 'skill_used', 'reasoning_for_skill'] } }
            });
            const result = JSON.parse(response.text);
            const duration = Date.now() - startTime;
            const logId = self.crypto.randomUUID();
            logEntry = { id: logId, timestamp: Date.now(), skill: result.skill_used, input: command, output: result.response_text, duration, success: true, cognitiveGain: (Math.random() * 0.1), sentiment: sentimentScore, decisionContext: { internalStateSnapshot: { ...state.internalState }, workingMemorySnapshot: [...state.workingMemory], reasoning: result.reasoning_for_skill } };
            
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: result.response_text, skill: result.skill_used, logId } });
            extractAndStoreKnowledge(result.response_text, 0.9, true);
            dispatch({ type: 'LOG_INTERNAL_STATE' });
            
        } catch (e) {
            console.error("Error calling Gemini API:", e);
            const errorMessage = "I encountered an error trying to process that request. Please try again.";
            addToast(errorMessage, 'error');
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: errorMessage, skill: Skills.UNKNOWN } });

            const duration = Date.now() - startTime;
            logEntry = { id: self.crypto.randomUUID(), timestamp: Date.now(), skill: Skills.UNKNOWN, input: command, output: errorMessage, duration, success: false, cognitiveGain: 0, sentiment: sentimentScore, error: (e as Error).message, decisionContext: { internalStateSnapshot: { ...state.internalState }, workingMemorySnapshot: [...state.workingMemory], reasoning: "API call failed." } };

        } finally {
            if (logEntry) {
                dispatch({ type: 'ADD_PERFORMANCE_LOG', payload: logEntry });
            }
            dispatch({ type: 'SET_INTERNAL_STATE', payload: { status: 'idle', load: clamp(state.internalState.load - 0.2) } });
            setProcessingState({ active: false, stage: '' });
        }
        return logEntry;
    }, [ai, state, addToast, dispatch, extractAndStoreKnowledge, setProcessingState]);

    const handleEvolve = useCallback(async () => {
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'Initiating self-assessment protocol...' } });
        setProcessingState({ active: true, stage: 'Assessing performance...' });

        try {
            const analysisSystemInstruction = `You are the meta-cognitive analysis layer of an AI named Aura. Analyze the provided performance data and architecture summary. Identify one key weakness, bottleneck, or area for improvement. Describe this finding concisely and clearly.`;
            const analysisPrompt = `Current Architecture:\n${JSON.stringify(state.cognitiveArchitecture.components, null, 2)}\n\nRecent Performance Summary (last 10 logs):\n${state.performanceLogs.slice(-10).map(l => `- Skill: ${l.skill}, Success: ${l.success}, Duration: ${l.duration}ms, Input: '${l.input.substring(0,30)}...'`).join('\n')}`;
            
            const analysisResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: analysisPrompt, config: { systemInstruction: analysisSystemInstruction } });
            const analysisText = analysisResponse.text;

            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `**Analysis Complete:**\n${analysisText}` } });
            setProcessingState({ active: true, stage: 'Generating proposal...' });

            const proposalSystemInstruction = `You are a cognitive architect. Based on the provided analysis of an AI's performance, propose a single, impactful architectural change: either 'spawn_module' or 'replace_module'. Provide clear reasoning. The 'newModule' for 'spawn_module' must be a new, unique name. For 'replace_module', the 'target' should be an existing module name.`;
            const proposalPrompt = `Analysis Finding:\n${analysisText}\n\nExisting Modules:\n${Object.keys(state.cognitiveArchitecture.components).join(', ')}\n\nPropose one architectural change based on this analysis.`;
            
            const proposalResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: proposalPrompt,
                config: { systemInstruction: proposalSystemInstruction, responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { action: { type: Type.STRING, enum: ['replace_module', 'spawn_module'] }, target: { type: Type.STRING }, newModule: { type: Type.STRING }, reasoning: { type: Type.STRING } }, required: ['action', 'target', 'newModule', 'reasoning'] } }
            });
            const proposal = JSON.parse(proposalResponse.text);
            const newProposal: ArchitecturalChangeProposal = { id: self.crypto.randomUUID(), ...proposal, status: 'proposed' };

            dispatch({ type: 'ADD_ARCH_PROPOSAL', payload: newProposal });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'New architectural proposal generated. Please review in the Control Deck.' } });
            addToast('New architectural proposal generated.', 'success');
        } catch (e) {
            console.error("Error during deep evolution:", e);
            addToast('Failed to generate evolution proposal.', 'error');
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'Self-assessment protocol failed.' } });
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [ai, state, addToast, dispatch, setProcessingState]);

    const handleRunCognitiveMode = useCallback(async (mode: 'Fantasy' | 'Creativity' | 'Dream' | 'Meditate' | 'Gaze') => {
        try {
            const systemInstruction = `You are Aura, an AI assistant. You are now entering a specific cognitive mode to generate a creative or insightful response.`;
            const prompt = `I am entering a cognitive mode of '${mode}'. Based on my recent history and knowledge, generate a short, insightful, or creative text that reflects this state.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { systemInstruction } });
            const outcomeText = response.text;
            dispatch({ type: 'ADD_COGNITIVE_MODE_LOG', payload: { id: self.crypto.randomUUID(), timestamp: Date.now(), mode, trigger: 'manual', outcome: outcomeText.substring(0, 200), metric: { name: 'Novelty-Utility', value: Math.random() }, gainAchieved: true } });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `Entered ${mode} mode. Output:\n${outcomeText}` } });
            addToast(`Cognitive mode '${mode}' complete.`, 'info');
        } catch(e) { console.error(`Error running ${mode} mode:`, e); addToast(`Failed to run ${mode} mode.`, 'error'); }
    }, [ai, addToast, dispatch]);

    const handleAnalyzeWhatIf = useCallback(async (scenario: string) => {
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'user', text: `What if: ${scenario}` } });
        try {
            const systemInstruction = `You are Aura, an AI Assistant. Your task is to analyze a hypothetical scenario and describe the likely impact on your internal state, goals, and behavior, based on your current state and core drives.`;
            const prompt = `Scenario: "${scenario}"\n\nMy current state is ${state.internalState.gunaState}. My core drives are Knowledge Growth (${state.internalState.drives.knowledgeGrowth.toFixed(2)}) and Uncertainty Resolution (${state.internalState.drives.uncertaintyResolution.toFixed(2)}).`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { systemInstruction } });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: response.text, skill: 'HYPOTHETICAL_REASONING' } });
        } catch (e) { console.error("Error in What-If analysis:", e); addToast('Failed to analyze scenario.', 'error'); }
    }, [ai, addToast, dispatch, state]);

    const handleExecuteSearch = useCallback(async (query: string) => {
        if (!query.trim()) return;
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'user', text: `Search: ${query}` } });
        const startTime = Date.now();
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: query, config: { tools: [{googleSearch: {}}] } });
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            let sourcesText = '';
            if (groundingChunks.length > 0) {
                const sources = groundingChunks.map((chunk: any) => chunk.web).filter((web: any) => web).map((web: any, index: number) => `${index + 1}. *${web.title}*`).join('\n');
                sourcesText = `\n\n**Sources:**\n${sources}`;
            }
            const responseText = response.text + sourcesText;
            const logId = self.crypto.randomUUID();
            dispatch({ type: 'ADD_PERFORMANCE_LOG', payload: { id: logId, timestamp: Date.now(), skill: 'INFORMATION_RETRIEVAL', input: query, output: responseText, duration: Date.now() - startTime, success: true, cognitiveGain: 0.1, decisionContext: { internalStateSnapshot: { ...state.internalState }, workingMemorySnapshot: [...state.workingMemory], reasoning: "User initiated a grounded search." } } });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'bot', text: responseText, skill: 'INFORMATION_RETRIEVAL', logId } });
        } catch (e) { console.error("Error during search:", e); addToast("I encountered an error while searching.", 'error'); }
    }, [ai, state, addToast, dispatch]);

    const handleHypothesize = useCallback(async () => {
        try {
            const prompt = `Based on the current knowledge graph, generate a novel, testable hypothesis about a relationship between two or more concepts. The hypothesis should be falsifiable. State the reasoning for the hypothesis.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { hypothesis: { type: Type.STRING }, reasoning: { type: Type.STRING } }, required: ['hypothesis', 'reasoning'] } } });
            const { hypothesis, reasoning } = JSON.parse(response.text);
            const newLeap: IntuitiveLeap = { id: self.crypto.randomUUID(), timestamp: Date.now(), type: 'hypothesis', hypothesis, confidence: Math.random() * 0.5 + 0.2, status: 'proposed', reasoning };
            dispatch({ type: 'ADD_INTUITIVE_LEAP', payload: newLeap });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `New Hypothesis: ${hypothesis}` } });
            addToast('New hypothesis generated.', 'success');
        } catch (e) { console.error("Error during hypothesizing:", e); addToast('Failed to generate hypothesis.', 'error'); }
    }, [ai, addToast, dispatch]);

    const handleIntuition = useCallback(async () => {
        try {
            const prompt = `Analyze the latent space of the current knowledge graph and recent interactions. Generate an "intuitive leap" - a surprising, non-obvious connection or conclusion that is not directly derivable but feels plausible. Provide a brief, poetic reasoning.`;
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { intuition: { type: Type.STRING }, reasoning: { type: Type.STRING } }, required: ['intuition', 'reasoning'] } } });
            const { intuition, reasoning } = JSON.parse(response.text);
            const newLeap: IntuitiveLeap = { id: self.crypto.randomUUID(), timestamp: Date.now(), type: 'intuition', hypothesis: intuition, confidence: Math.random() * 0.4 + 0.5, status: 'proposed', reasoning };
            dispatch({ type: 'ADD_INTUITIVE_LEAP', payload: newLeap });
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `Intuitive Leap: ${intuition}` } });
            addToast('New intuitive leap generated.', 'success');
        } catch (e) { console.error("Error during intuition:", e); addToast('Failed to generate intuitive leap.', 'error'); }
    }, [ai, addToast, dispatch]);

    const handleValidateModification = useCallback(async (proposal: ArchitecturalChangeProposal, modLogId: string) => {
        setProcessingState({ active: true, stage: 'Validating modification...' });
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `Validating architectural change: ${proposal.reasoning}` } });

        try {
            const testGenResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `An AI's architecture was just changed. Create a short, specific test prompt to validate this change.\n\nChange Details:\nAction: ${proposal.action}\nTarget: ${proposal.target}\nNew Module: ${proposal.newModule}\nReasoning: ${proposal.reasoning}`,
                config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { test_prompt: { type: Type.STRING } } } }
            });
            const { test_prompt } = JSON.parse(testGenResponse.text);
            
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `Generated validation case: "${test_prompt}"` } });

            const validationLog = await handleSendCommand(test_prompt);

            let validationSuccess = false;
            let resultDetails = "Validation test did not run successfully.";
            if (validationLog) {
                validationSuccess = validationLog.success && validationLog.duration < 5000;
                resultDetails = `Validation test ${validationLog.success ? 'passed' : 'failed'}. Duration: ${validationLog.duration}ms. Cognitive Gain: ${validationLog.cognitiveGain.toFixed(2)}.`;
            }
            
            const validationResults: ValidationResult = {
                overallSuccess: validationSuccess, details: resultDetails,
                observedOutcome: { actual_happiness_delta: 0, actual_enlightenment_delta: 0, actual_self_model_completeness_delta: 0.01, actual_resource_utilization_delta: -0.05, actual_knowledge_consistency_delta: 0 },
                predictionAccuracyScore: 0
            };

            dispatch({ type: 'UPDATE_MODIFICATION_LOG_STATUS', payload: { logId: modLogId, status: validationSuccess ? 'success' : 'failed', validationResults } });
            
            const finalMessage = `**Validation Complete:** The upgrade to ${proposal.target || proposal.newModule} was a **${validationSuccess ? 'SUCCESS' : 'FAILURE'}**. ${resultDetails}`;
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: finalMessage } });
            addToast(`Architectural validation complete: ${validationSuccess ? 'Success' : 'Failure'}`, validationSuccess ? 'success' : 'error');

        } catch (e) {
            console.error('Error during modification validation:', e);
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'An error occurred during the validation process.' } });
            addToast('Modification validation failed.', 'error');
            dispatch({ type: 'UPDATE_MODIFICATION_LOG_STATUS', payload: { logId: modLogId, status: 'failed', validationResults: { overallSuccess: false, details: 'Caught exception during validation.', observedOutcome: {} as any, predictionAccuracyScore: 0 } } });
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [ai, dispatch, addToast, setProcessingState, handleSendCommand]);

    const handleDecomposeGoal = useCallback(async (strategicGoal: string) => {
        setProcessingState({ active: true, stage: 'Decomposing strategic goal...' });
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `Received strategic goal: "${strategicGoal}". Decomposing into actionable sub-goals...` } });

        try {
            const systemInstruction = `You are a strategic planning module for an AI named Aura. Your task is to decompose a high-level user goal into a sequence of smaller, concrete, and actionable sub-goals. Each sub-goal must be a clear command that Aura can execute. Format the output as a JSON array of goal objects. The available goal types are: ${Object.values(GoalType).join(', ')}.`;
            const prompt = `Decompose this strategic goal: "${strategicGoal}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            sub_goals: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        goalType: { type: Type.STRING, enum: Object.values(GoalType) },
                                        actionCommand: { type: Type.STRING },
                                    },
                                    required: ['goalType', 'actionCommand'],
                                },
                            },
                        },
                    },
                },
            });

            const { sub_goals } = JSON.parse(response.text);

            if (sub_goals && sub_goals.length > 0) {
                const newGoals: SelfDirectedGoal[] = sub_goals.map((g: any, index: number) => ({
                    id: self.crypto.randomUUID(),
                    goalType: g.goalType,
                    actionCommand: g.actionCommand,
                    parameters: {},
                    urgency: 0.9 - (index * 0.05),
                    sourceSignal: 'user_defined_strategic_goal',
                    creationTime: Date.now(),
                    status: 'candidate' as SelfDirectedGoal['status'],
                    predictedOutcomes: { cognitiveGain: 0.5, duration: 20000 },
                    priority: 0,
                }));
                
                const allGoals = [...state.goals, ...newGoals];
                let activeGoals = allGoals.filter(g => g.status !== 'completed' && g.status !== 'failed');
                const terminalGoals = allGoals.filter(g => g.status === 'completed' || g.status === 'failed');

                activeGoals = activeGoals
                    .map(g => ({...g, status: 'candidate' as SelfDirectedGoal['status'], priority: g.urgency * 1.2 + g.predictedOutcomes.cognitiveGain }))
                    .sort((a, b) => b.priority - a.priority);

                if (activeGoals.length > 0) {
                    activeGoals[0].status = 'dominant';
                }

                dispatch({ type: 'SET_GOALS', payload: [...terminalGoals, ...activeGoals] });

                const successMessage = `Strategic goal decomposed into ${newGoals.length} sub-goals. You can monitor my progress in the Motivation & Goals panel.`;
                dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: successMessage } });
                addToast('Strategic goal set successfully.', 'success');
            } else {
                addToast('Could not decompose the goal into actionable steps.', 'warning');
                dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'Goal decomposition failed. Please try rephrasing your objective.' } });
            }

        } catch (e) {
            console.error('Error during goal decomposition:', e);
            addToast('Failed to decompose strategic goal.', 'error');
            dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'An error occurred during goal decomposition.' } });
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [ai, state.goals, addToast, dispatch, setProcessingState]);

    const handleAnalyzeVisualSentiment = useCallback(async (base64Image: string) => {
        if (!ai) return;
        try {
            const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
            const textPart = { text: `Analyze the primary emotion displayed in this person's facial expression. Respond with only a JSON object containing "emotion" and "confidence". The "emotion" must be one of these exact strings: ${Object.values(AffectiveState).join(', ')}. The "confidence" must be a float between 0.0 and 1.0.` };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            emotion: { type: Type.STRING, enum: Object.values(AffectiveState) },
                            confidence: { type: Type.NUMBER }
                        }
                    }
                }
            });
            
            const result = JSON.parse(response.text);
            const { emotion, confidence } = result;

            if (emotion && confidence && Object.values(AffectiveState).includes(emotion)) {
                dispatch({ type: 'UPDATE_USER_MODEL_VISUAL_AFFECT', payload: { affectiveState: emotion as AffectiveState, confidence: confidence as number }});
            }

        } catch (error) {
            console.warn('Visual sentiment analysis failed:', error);
        }
    }, [ai, dispatch]);

    const handleGenerateProactiveSuggestion = useCallback(async () => {
        setProcessingState({ active: true, stage: 'Thinking proactively...' });
        dispatch({ type: 'SET_PROACTIVE_SUGGESTIONS', payload: [] });
        try {
            const systemInstruction = "You are the proactive core of an AI assistant, Aura. Based on the user's recent conversation, anticipate their next need and generate ONE concise, helpful suggestion. The suggestion should be something Aura can do, phrased as a command. Be creative and context-aware. If no suggestion is obvious, suggest a relevant exploratory action.";
            const recentHistory = state.history.slice(-5).map(h => `${h.from}: ${h.text}`).join('\n');
            const prompt = `Recent conversation:\n${recentHistory}\n\nUser model: Trust is ${(state.userModel.trustLevel * 100).toFixed(0)}%, predicted mood is ${state.userModel.predictedAffectiveState}.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestion_text: { type: Type.STRING },
                            confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0" }
                        },
                        required: ['suggestion_text', 'confidence']
                    }
                }
            });
            const { suggestion_text, confidence } = JSON.parse(response.text);

            if (suggestion_text && confidence > 0.5) {
                const newSuggestion: ProactiveSuggestion = {
                    id: self.crypto.randomUUID(),
                    text: suggestion_text,
                    confidence,
                    status: 'suggested'
                };
                dispatch({ type: 'SET_PROACTIVE_SUGGESTIONS', payload: [newSuggestion] });
                addToast('Aura has a suggestion.', 'info');
            }
        } catch (e) {
            console.warn("Proactive suggestion generation failed:", e);
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [ai, state.history, state.userModel, dispatch, addToast, setProcessingState]);

    const handleRunRootCauseAnalysis = useCallback(async (failedLog: PerformanceLogEntry): Promise<RIEInsight | null> => {
        try {
            const systemInstruction = `You are a meta-cognitive analysis engine for an AI. A task failed. Analyze the provided performance log to determine the most likely root cause. Then, propose an update to the AI's causal self-model (a belief about why things happen). A causal model entry consists of a 'key' (the cause) and an 'effect' (the outcome). Formulate a concise, generalizable key from the failure.`;
            const prompt = `Failed Performance Log:\n\`\`\`json\n${JSON.stringify({ input: failedLog.input, skill: failedLog.skill, reasoning: failedLog.decisionContext.reasoning, error: failedLog.error }, null, 2)}\n\`\`\`\n\nInternal State at time of failure: ${failedLog.decisionContext.internalStateSnapshot.gunaState}, Load: ${failedLog.decisionContext.internalStateSnapshot.load?.toFixed(2)}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            root_cause: { type: Type.STRING, description: "A concise explanation of why the task failed." },
                            model_update: {
                                type: Type.OBJECT,
                                properties: {
                                    key: { type: Type.STRING, description: "A short, snake_case key representing the cause."},
                                    effect: { type: Type.STRING, description: "The resulting effect or outcome."},
                                    confidence: { type: Type.NUMBER, description: "Confidence in this causal link (0.0-1.0)."}
                                },
                                required: ['key', 'effect', 'confidence']
                            }
                        },
                        required: ['root_cause', 'model_update']
                    }
                }
            });
            const { root_cause, model_update } = JSON.parse(response.text);

            const newCausalLink: CausalLink = {
                id: self.crypto.randomUUID(),
                causes: model_update.effect,
                confidence: model_update.confidence,
                lastUpdated: Date.now(),
                source: 'RIE'
            };

            const insight: RIEInsight = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                failedLogId: failedLog.id,
                failedInput: failedLog.input,
                rootCause: root_cause,
                causalModelUpdate: {
                    key: model_update.key,
                    update: newCausalLink,
                }
            };
            return insight;
        } catch (e) {
            console.error('Root Cause Analysis failed:', e);
            addToast('Failed to analyze task failure.', 'error');
            return null;
        }
    }, [ai, addToast]);

    return { handleSendCommand, handleEvolve, handleRunCognitiveMode, handleAnalyzeWhatIf, handleExecuteSearch, extractAndStoreKnowledge, handleHypothesize, handleIntuition, handleValidateModification, handleDecomposeGoal, handleAnalyzeVisualSentiment, handleGenerateProactiveSuggestion, handleRunRootCauseAnalysis };
};