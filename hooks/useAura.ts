

// hooks/useAura.ts
// Consolidated React imports to resolve 'duplicate identifier' errors.
import { useMemo, useCallback, useEffect, useRef, Dispatch } from 'react';
import i18next from '../i18n';
import { GoogleGenAI, Chat, FunctionDeclaration } from "@google/genai";
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
// Correctly import useUIHandlers. The previous conflict error was due to garbage content in this file.
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem, UseAutonomousSystemProps } from './useAutonomousSystem';
// Consolidated type imports to resolve 'duplicate identifier' errors caused by garbage file content.
import { 
    SelfProgrammingCandidate, CoCreatedWorkflow, NeuroCortexState, Percept, TacticalPlan, TriageDecision, ArchitecturalChangeProposal, 
    DoxasticHypothesis, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal, UnifiedProposal, 
    SyscallCall, DoxasticSimulationResult, AuraState, Action, GankyilInsight, SEDLDirective, POLCommand
} from '../types';
import { clamp } from '../utils';
import { HAL } from '../core/hal';
import { generateHeuristicCGLPlan } from '../core';

// Helper function to convert File to a Gemini Part, moved from useGeminiAPI
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearDB } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    
    // Create a single, memoized instance of the Gemini AI client
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);
    
    // Create a ref to hold the stateful chat session
    const chatSession = useRef<Chat | null>(null);

    // This effect synchronizes the i18next language with the app state.
    // It's more efficient than re-initializing the entire i18n instance on every language change.
    useEffect(() => {
        if (i18next.language !== state.language) {
            i18next.changeLanguage(state.language);
        }
    }, [state.language]);

    // The 't' function is now stable and directly from the singleton i18next instance.
    // The component will re-render due to the language change in the state,
    // and i18next.t will automatically return the correct translations.
    const t = i18next.t.bind(i18next);

    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    const uiHandlers = useUIHandlers(state, syscall, addToast, t, clearDB);
    
    // Pass the single AI instance to the stateless API hook
    const geminiAPI = useGeminiAPI(ai, state, dispatch, addToast);
    
    // Effect to initialize and re-initialize the chat session when context changes
    useEffect(() => {
        const tools = state.pluginState.registry
            .filter(p => p.type === 'TOOL' && p.status === 'enabled' && p.toolSchema)
            .map(p => p.toolSchema as FunctionDeclaration);

        chatSession.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: state.coreIdentity.narrativeSelf,
                ...(tools.length > 0 && { tools: [{ functionDeclarations: tools }] })
            }
        });
        console.log("Chat session initialized/updated.");
    }, [ai, state.coreIdentity.narrativeSelf, state.pluginState.registry]);

    useAutonomousSystem({
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        ...geminiAPI,
    } as UseAutonomousSystemProps);

    // Dynamic CGL Planning Engine
    useEffect(() => {
        const { status, activeDirective } = state.cognitiveOSState;
        if (status === 'translating_cgl' && activeDirective) {
            // OPTIMIZATION: Replaced the async Gemini call with a synchronous, local heuristic planner.
            // This makes the planning step instantaneous and removes the dependency on an external API call.
            const plan = generateHeuristicCGLPlan(activeDirective);
            if (plan) {
                syscall('COGNITIVE_OS/SET_PLAN', plan);
            } else {
                // This case should not happen with the heuristic planner, but it's good practice.
                const errorMessage = "Heuristic planner failed to generate a plan.";
                console.error("Dynamic CGL planning failed:", errorMessage);
                syscall('COGNITIVE_OS/EXECUTION_FAILED', { error: errorMessage });
            }
        }
    }, [state.cognitiveOSState.status, state.cognitiveOSState.activeDirective, syscall, t]);
    
    // --- New POL Parallel Execution Pipeline ---
    useEffect(() => {
        const { status, commandQueue, currentStageIndex } = state.cognitiveOSState;
        
        // This effect is the "kernel scheduler" for the POL pipeline.
        // It triggers whenever the OS is ready to execute the next stage.
        if (status === 'ready_to_execute') {
            
            const executePipeline = async () => {
                const stageToExecute = commandQueue[currentStageIndex];

                // If there are no more stages, the pipeline is complete.
                if (!stageToExecute) {
                    syscall('COGNITIVE_OS/PIPELINE_COMPLETE', {});
                    uiHandlers.setProcessingState({ active: false, stage: '' });
                    // Finalize the bot's response entry
                    const botEntry = state.history.find(e => e.streaming);
                    if (botEntry) {
                        syscall('FINALIZE_HISTORY_ENTRY', { id: botEntry.id, finalState: { streaming: false }});
                    }
                    return;
                }
                
                // Advance the stage and set status to 'executing'
                syscall('COGNITIVE_OS/ADVANCE_STAGE', { stage: stageToExecute, stageIndex: currentStageIndex });
                uiHandlers.setProcessingState({ active: true, stage: t('cogOS_executing', { current: currentStageIndex + 1, total: commandQueue.length }) });

                try {
                    // Execute all commands in the current stage in parallel.
                    const results = await Promise.all(
                        stageToExecute.map(async (command: POLCommand) => {
                            let result: any = null;
                            switch (command.type) {
                                case 'CHAT_MESSAGE': {
                                    // The final response generation is the part that still calls the LLM.
                                    const response = await geminiAPI.generateSimpleResponse(command.payload.message);
                                    const botEntry = state.history.find(e => e.streaming);
                                    if (botEntry) {
                                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botEntry.id, textChunk: response });
                                    }
                                    result = { success: true };
                                    break;
                                }
                                case 'TOOL_EXECUTE':
                                    result = await geminiAPI.executeToolByName(command.payload.name, command.payload.args);
                                    break;
                                case 'SYSCALL':
                                    syscall(command.payload.call, command.payload.args);
                                    result = { success: true };
                                    break;
                            }
                            return { command, result };
                        })
                    );
                    
                    // Once all commands in the stage are complete, mark the stage as complete.
                    // This will set the status back to 'ready_to_execute', re-triggering this effect for the next stage.
                    syscall('COGNITIVE_OS/STAGE_COMPLETE', { completedCommands: results });

                } catch (error) {
                    console.error(`CECS Execution failed at stage ${currentStageIndex}:`, error);
                    const errorMessage = error instanceof Error ? error.message : "Unknown execution error.";
                    syscall('COGNITIVE_OS/EXECUTION_FAILED', { error: `Pipeline failed at stage ${currentStageIndex}: ${errorMessage}` });
                    uiHandlers.setProcessingState({ active: false, stage: '' });
                }
            };
            
            executePipeline();
        }
    }, [state.cognitiveOSState.status, state.cognitiveOSState.currentStageIndex, geminiAPI, syscall, uiHandlers, t, state.history]);


    const handleSendCommand = useCallback(async (prompt: string, file?: File | null) => {
        if (!prompt.trim() && !file) return;

        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();

        const directive: SEDLDirective = {
            id: `sedl-${self.crypto.randomUUID()}`,
            type: 'user_prompt',
            content: prompt,
            timestamp: Date.now(),
            file: file || null
        };
        
        // Add user message to history immediately
        const userEntryId = self.crypto.randomUUID();
        syscall('ADD_HISTORY_ENTRY', { 
            id: userEntryId, 
            from: 'user', 
            text: prompt, 
            ...(file && { fileName: file.name }) 
        });

        // Add a placeholder for the bot's response
        const botEntryId = self.crypto.randomUUID();
        syscall('ADD_HISTORY_ENTRY', { 
            id: botEntryId, 
            from: 'bot', 
            text: '', 
            streaming: true 
        });

        // Initiate the CECS pipeline
        syscall('COGNITIVE_OS/EXECUTE_DIRECTIVE', directive);
        
    }, [syscall, uiHandlers]);


    const handleFeedback = useCallback((id: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_HISTORY_FEEDBACK', args: { id, feedback } } });
    }, [dispatch]);


    const handleShareWisdom = useCallback(async () => {
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_NOETIC_ENGRAM_STATE', args: { status: 'generating' } } });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_NOETIC_ENGRAM_STATE', args: { status: 'ready', engram } } });
        } catch (error) {
            console.error("Failed to generate Noetic Engram:", error);
            addToast("Failed to generate Noetic Engram.", 'error');
            dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_NOETIC_ENGRAM_STATE', args: { status: 'idle' } } });
        }
    }, [dispatch, addToast, geminiAPI]);
    
    const handleCreateWorkflow = useCallback((workflowData: Omit<CoCreatedWorkflow, 'id'>) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'ADD_WORKFLOW_PROPOSAL', args: workflowData } });
        addToast(`New workflow "${workflowData.name}" created!`, 'success');
    }, [dispatch, addToast]);

    const handleTrainCorticalColumn = useCallback(async (specialty: string, curriculum: string) => {
        const newColumnId = `cc_learning_${specialty.toLowerCase().replace(/\s+/g, '_')}_${self.crypto.randomUUID().substring(0, 4)}`;

        // Step 1: Create the column with low activation
        dispatch({ type: 'SYSCALL', payload: { call: 'CREATE_CORTICAL_COLUMN', args: { id: newColumnId, specialty } }});
        
        const startMessage = `Skill training initiated for "${specialty}". Analyzing provided curriculum to build foundational knowledge.`;
        dispatch({ type: 'SYSCALL', payload: { call: 'ADD_HISTORY_ENTRY', args: { id: self.crypto.randomUUID(), from: 'system', text: startMessage } } });
        addToast(t('toast_skillTrainingStarted', { specialty }), 'info');

        // Step 2: Process curriculum
        const extractedFacts = await geminiAPI.processCurriculumAndExtractFacts(curriculum);

        if (extractedFacts && extractedFacts.length > 0) {
            // Step 3: Add facts to knowledge graph
            dispatch({ type: 'SYSCALL', payload: { call: 'ADD_FACTS_BATCH', args: extractedFacts } });

            // Step 4: Calculate activation boost
            const activationBoost = clamp(0.10 + extractedFacts.length * 0.02, 0.1, 0.75);
            dispatch({ type: 'SYSCALL', payload: { call: 'SET_COLUMN_ACTIVATION', args: { id: newColumnId, activation: activationBoost } } });

            const completeMessage = `Training complete for "${specialty}". Extracted ${extractedFacts.length} key facts from the curriculum, providing an initial activation boost to ${(activationBoost * 100).toFixed(0)}%. The new column will continue to mature autonomously.`;
            dispatch({ type: 'SYSCALL', payload: { call: 'ADD_HISTORY_ENTRY', args: { id: self.crypto.randomUUID(), from: 'system', text: completeMessage } } });
            addToast(t('toast_skillTrainingComplete', { specialty, count: extractedFacts.length, activation: (activationBoost * 100).toFixed(0) }), 'success');
        } else {
            const completeMessage = `Training complete for "${specialty}". No structured facts were extracted from the curriculum, but the column has been created with a base activation. It will mature through standard autonomous processes.`;
            // FIX: Completed the truncated line of code.
            dispatch({ type: 'SYSCALL', payload: { call: 'ADD_HISTORY_ENTRY', args: { id: self.crypto.randomUUID(), from: 'system', text: completeMessage } } });
        }
    }, [dispatch, addToast, t, geminiAPI]);

    // FIX: Added dummy implementations for handlers used by components but missing from the original file.
    const handleEvolveFromInsight = useCallback(() => { addToast('Evolving from insight is not implemented yet.', 'warning'); }, [addToast]);
    const handleVisualizeInsight = useCallback(async (insight: string) => { addToast('Visualizing insight is a mock.', 'info'); return `A surreal, artistic visualization of the concept: "${insight}"`; }, [addToast]);
    const handleImplementUnifiedProposal = useCallback((proposal: UnifiedProposal) => { syscall('OA/UPDATE_PROPOSAL', {id: proposal.id, updates: { status: 'approved' }}); addToast(`Proposal ${proposal.id} approved for implementation.`, 'info'); }, [syscall, addToast]);
    const handleDismissUnifiedProposal = useCallback((proposal: UnifiedProposal) => { syscall('OA/UPDATE_PROPOSAL', {id: proposal.id, updates: { status: 'rejected' }}); addToast(`Proposal ${proposal.id} dismissed.`, 'info'); }, [syscall, addToast]);
    const handleCopyCode = useCallback((code: string) => { HAL.Clipboard.writeText(code).then(() => addToast('Code copied!', 'success')); }, [addToast]);
    const handleAuditArchitecture = useCallback(() => { addToast('Auditing architecture for new primitives is not implemented yet.', 'warning'); }, [addToast]);
    const handleGenerateCognitiveSequence = useCallback((directive: string) => { addToast('Generating cognitive sequence is not implemented yet.', 'warning'); }, [addToast]);
    const testCausalHypothesis = useCallback((hypothesis: DoxasticHypothesis) => { addToast(`Testing causal hypothesis ${hypothesis.id} is not implemented yet.`, 'warning'); }, [addToast]);
    
    const generateVideo = useCallback(async (prompt: string, onProgress: (msg: string) => void): Promise<string | null> => {
        addToast('Video generation is a mock.', 'info');
        onProgress('Simulating video generation...');
        await new Promise(r => setTimeout(r, 5000));
        onProgress('Finalizing video...');
        await new Promise(r => setTimeout(r, 2000));
        return "mock_video.mp4"; // This won't work but it's a mock.
    }, [addToast]);

    const handleSynthesizeAbstractConcept = useCallback((name: string, columnIds: string[]) => {
        syscall('SYNTHESIZE_ABSTRACT_CONCEPT', { name, columnIds });
        addToast(`New abstract concept "${name}" synthesized from ${columnIds.length} columns.`, 'success');
    }, [syscall, addToast]);
    
    const handleGenerateDreamPrompt = useCallback(async (): Promise<string | null> => {
        const dreamLog = state.cognitiveModeLog.find(l => l.mode === 'Dream');
        if (dreamLog) {
            return `A surreal, dreamlike, otherworldly visualization of: ${dreamLog.outcome}`;
        }
        addToast("No recent dream log found to generate from.", "warning");
        return null;
    }, [state.cognitiveModeLog, addToast]);
    
    // FIX: Added a comprehensive return statement to the hook, exporting all necessary state and handlers for the UI.
    return {
        state,
        dispatch,
        memoryStatus,
        clearDB,
        toasts,
        addToast,
        removeToast,
        t,
        syscall,
        ...uiHandlers,
        handleSendCommand,
        handleFeedback,
        handleShareWisdom,
        handleCreateWorkflow,
        handleTrainCorticalColumn,
        handleSynthesizeAbstractConcept,
        handleGenerateDreamPrompt,
        generateVideo,
        handleEvolveFromInsight,
        handleVisualizeInsight,
        handleImplementUnifiedProposal,
        handleDismissUnifiedProposal,
        handleCopyCode,
        handleAuditArchitecture,
        handleGenerateCognitiveSequence,
        testCausalHypothesis,
        ...geminiAPI
    };
};