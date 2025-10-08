// hooks/useAura.ts
import { useMemo, useCallback, useEffect, useRef, Dispatch } from 'react';
import i18next from '../i18n';
import { GoogleGenAI, Chat, FunctionDeclaration, GenerateContentResponse, Part, Type } from "@google/genai";
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem, UseAutonomousSystemProps } from './useAutonomousSystem';
import { useDomObserver } from './useDomObserver';
import { useLiveSession } from './useLiveSession';
import { 
    SelfProgrammingCandidate, CoCreatedWorkflow, NeuroCortexState, Percept, TacticalPlan, TriageDecision, ArchitecturalChangeProposal, 
    DoxasticHypothesis, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal, UnifiedProposal, 
    SyscallCall, DoxasticSimulationResult, AuraState, Action, GankyilInsight, SEDLDirective, ProposedAxiom, Summary
} from '../types';
import { clamp } from '../utils';
import { HAL } from '../core/hal';
import { taskScheduler } from '../core/taskScheduler';

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
    const { state, dispatch, memoryStatus, clearMemoryAndState } = useAuraState();
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
    const t = i18next.t.bind(i18next);

    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);
    
    // Pass the single AI instance to the stateless API hook
    const geminiAPI = useGeminiAPI(ai, state, dispatch, addToast);

    const uiHandlers = useUIHandlers(state, dispatch, syscall, addToast, t, clearMemoryAndState, geminiAPI);

    // --- Phase 1: DOM Perception ---
    useDomObserver(useCallback((summary: string) => {
        syscall('SITUATIONAL_AWARENESS/LOG_DOM_CHANGE', { summary });
    }, [syscall]));

    // --- Phase 1: Live Session ---
    const liveSession = useLiveSession(ai, state, dispatch, addToast);
    
    // Effect to initialize and re-initialize the chat session when context changes
    useEffect(() => {
        const pluginTools = state.pluginState.registry
            .filter(p => p.type === 'TOOL' && p.status === 'enabled' && p.toolSchema)
            .map(p => p.toolSchema as FunctionDeclaration);

        const queryInternalStateTool: FunctionDeclaration = {
            name: 'queryInternalState',
            description: "Query Aura's own internal state, such as memory or the virtual file system (VFS). Use this to answer questions about what Aura knows, remembers, what files it has, or to read file contents.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    domain: {
                        type: Type.STRING,
                        description: "The area of Aura's state to query.",
                        enum: ['vfs', 'workingMemory', 'episodicMemory', 'knowledgeGraph'],
                    },
                    query: {
                        type: Type.STRING,
                        description: 'The specific query. For "vfs", use "ls <path>" to list files or "cat <path>" to read a file. For memory domains, use "list" to see recent items or "search <term>" for specific information.'
                    }
                },
                required: ['domain', 'query'],
            }
        };
        
        const allTools = [...pluginTools, queryInternalStateTool];

        chatSession.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: state.coreIdentity.narrativeSelf,
                ...(allTools.length > 0 && { tools: [{ functionDeclarations: allTools }] })
            }
        });
        console.log("Chat session initialized/updated with tools:", allTools.map(t => t.name));
    }, [ai, state.coreIdentity.narrativeSelf, state.pluginState.registry]);

    useAutonomousSystem({
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        syscall,
        ...geminiAPI,
    } as UseAutonomousSystemProps);

    const mdnaInitialized = useRef(false);
    useEffect(() => {
        if (memoryStatus === 'ready' && !mdnaInitialized.current) {
            if (Object.keys(state.mdnaSpace).length === 0 && state.knowledgeGraph.length > 0) {
                syscall('MEMORY/INITIALIZE_MDNA_SPACE', {});
                mdnaInitialized.current = true;
            }
        }
    }, [memoryStatus, state.mdnaSpace, state.knowledgeGraph, syscall]);

    const handleSendCommand = useCallback(async (prompt: string, file?: File | null) => {
        if (!prompt.trim() && !file) return;
        if (!chatSession.current) {
            addToast('Chat session is not ready.', 'error');
            return;
        }

        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
        uiHandlers.setProcessingState({ active: true, stage: t('status_thinking') });

        const userEntryId = self.crypto.randomUUID();
        syscall('ADD_HISTORY_ENTRY', { 
            id: userEntryId, 
            from: 'user', 
            text: prompt, 
            ...(file && { fileName: file.name }) 
        });

        // --- Variant L: Contextual Retriever ---
        const allSummaries = [
            // FIX: Conditionally spread globalSummary to avoid spreading a null value.
            ...(state.chronicleState.globalSummary ? [{...state.chronicleState.globalSummary, id: 'global'}] : []),
            ...Object.entries(state.chronicleState.dailySummaries).map(([date, summary]) => ({ ...(summary as Summary), id: date }))
        ];

        let contextualPrompt = prompt;
        if (allSummaries.length > 0) {
            // FIX: Correctly call the newly added `findMostRelevantSummary` function.
            const relevantSummaryId = await geminiAPI.findMostRelevantSummary(prompt, allSummaries.map(s => ({id: s.id, summary: s.summary})));
            const relevantSummary = allSummaries.find(s => s.id === relevantSummaryId);
            if (relevantSummary) {
                contextualPrompt = `(Relevant Memory: "${relevantSummary.summary}")\n\n${prompt}`;
                addToast("Contextual memory retrieved.", 'info');
            }
        }
        // --- End Variant L ---

        const botEntryId = self.crypto.randomUUID();
        syscall('ADD_HISTORY_ENTRY', { 
            id: botEntryId, 
            from: 'bot', 
            text: '', 
            streaming: true,
            internalStateSnapshot: state.internalState // Keep the snapshot
        });

        try {
            const parts: Part[] = [{ text: contextualPrompt }];
            if (file) {
                const filePart = await fileToGenerativePart(file);
                parts.unshift(filePart);
            }

            const stream = await chatSession.current.sendMessageStream({ message: parts });

            let aggregatedResponse: GenerateContentResponse | null = null;
            let finalResponseText = '';
            for await (const chunk of stream) {
                aggregatedResponse = aggregatedResponse ? { ...aggregatedResponse, ...chunk } : chunk;
                const text = chunk.text;
                if (text) {
                    finalResponseText += text;
                    syscall('APPEND_TO_HISTORY_ENTRY', { id: botEntryId, textChunk: text });
                }
            }
            
            let finalSkill = 'Core Conversation'; // Default skill
            if (aggregatedResponse?.functionCalls) {
                const toolCalls = aggregatedResponse.functionCalls;
                const functionResponseParts: Part[] = [];

                for (const fc of toolCalls) {
                     syscall('ADD_HISTORY_ENTRY', { from: 'tool', text: fc.name, args: fc.args });
                     try {
                        const result = await geminiAPI.executeToolByName(fc.name, fc.args);
                        functionResponseParts.push({
                            functionResponse: {
                                name: fc.name,
                                response: result,
                            }
                        });
                        finalSkill = fc.name; // Use the tool name as the skill
                     } catch (e) {
                        console.error(`Tool call ${fc.name} failed:`, e);
                        functionResponseParts.push({ 
                            functionResponse: {
                                name: fc.name,
                                response: { error: (e as Error).message }
                            }
                        });
                     }
                }

                if (functionResponseParts.length > 0) {
                    const toolResponseStream = await chatSession.current.sendMessageStream({
                        message: functionResponseParts
                    });

                    for await (const chunk of toolResponseStream) {
                        const text = chunk.text;
                        if (text) {
                            finalResponseText += text;
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: botEntryId, textChunk: text });
                        }
                    }
                }
            }

            // Finalize the entry
            syscall('FINALIZE_HISTORY_ENTRY', { id: botEntryId, finalState: { streaming: false, skill: finalSkill } });

            // Schedule episodic memory creation as a background task
            if (finalResponseText.trim()) {
                taskScheduler.schedule(() => geminiAPI.generateEpisodicMemory(prompt, finalResponseText));
            }

        } catch (error) {
            console.error("Chat execution failed:", error);
            const errorMessage = error instanceof Error ? error.message : 'Chat execution failed.';
            syscall('APPEND_TO_HISTORY_ENTRY', { id: botEntryId, textChunk: `\n\n[ERROR: ${errorMessage}]` });
            syscall('FINALIZE_HISTORY_ENTRY', { id: botEntryId, finalState: { streaming: false, skill: 'Error' } });
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
        }
    }, [state.internalState, state.chronicleState, syscall, addToast, t, geminiAPI, uiHandlers]);


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
    
    // FIX: Corrected generic type 'Omit' to have two arguments.
    const handleCreateWorkflow = useCallback((workflowData: Omit<CoCreatedWorkflow, 'id'>) => {
        syscall('ADD_WORKFLOW_PROPOSAL', workflowData);
        addToast("New workflow created!", 'success');
    }, [syscall, addToast]);

    // FIX: Added return statement to export all necessary functions and state for other components.
    return {
        state,
        dispatch,
        memoryStatus,
        clearDB: clearMemoryAndState, // Note: passing the new reset function
        toasts,
        addToast,
        removeToast,
        t,
        language: state.language,
        syscall,
        handleSendCommand,
        handleFeedback,
        handleShareWisdom,
        handleCreateWorkflow,
        ...uiHandlers,
        ...geminiAPI,
        ...liveSession,
    };
};
