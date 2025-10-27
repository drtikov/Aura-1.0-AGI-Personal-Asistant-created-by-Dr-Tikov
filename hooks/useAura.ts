// hooks/useAura.ts
import { useMemo, useEffect, useRef } from 'react';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem } from './useAutonomousSystem';
import { useToolExecution } from './useToolExecution';
import { HAL } from '../core/hal';
import { SyscallCall, HistoryEntry, ConceptualProofStrategy, Hypothesis, HeuristicPlan, DesignHeuristic, Persona, CognitiveStrategy, KernelTaskType } from '../types';
import { GoogleGenAI } from '@google/genai';
import { useDomObserver } from './useDomObserver';
import { useLiveSession } from './useLiveSession';
import { useTranslation } from 'react-i18next';
import { personas } from '../state/personas';

let ai: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
    if (ai) return ai;
    if (process.env.API_KEY) {
        try {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai;
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            throw new Error("Failed to initialize Gemini API. Check API Key.");
        }
    }
    console.error("API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set.");
};

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearMemoryAndState } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    const { t, i18n } = useTranslation();

    // This effect syncs i18next language with app state language
    useEffect(() => {
        if (i18n.language !== state.language) {
            i18n.changeLanguage(state.language);
        }
    }, [state.language, i18n]);

    const aiInstance = useMemo(() => getAI(), []);

    const syscall = (call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    };

    const geminiAPI = useGeminiAPI(aiInstance, state, dispatch, addToast);
    
    const uiHandlers = useUIHandlers(state, dispatch, syscall, addToast, t, clearMemoryAndState, geminiAPI);

    useAutonomousSystem({
        geminiAPI,
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        syscall,
    });
    
    useDomObserver((summary: string) => {
        syscall('SITUATIONAL_AWARENESS/LOG_DOM_CHANGE', { summary });
    });
    
    useToolExecution({
        syscall,
        addToast,
        toolExecutionRequest: state.toolExecutionRequest,
        state,
    });

    const liveSession = useLiveSession(aiInstance, state, dispatch, addToast);

    const processCommand = async (command: string, file?: File) => {
        syscall('PROCESS_USER_INPUT_INTO_PERCEPT', {
            intent: 'unknown',
            rawText: command,
            ...(file && { sensoryEngram: { modality: file.type.startsWith('image') ? 'visual' : 'auditory', rawPrimitives: [{type: 'file_attachment', value: file.name}] } })
        });

        const triageResult = await geminiAPI.triageUserIntent(command);
        syscall('ADD_HISTORY_ENTRY', { 
            from: 'system', 
            text: `Cognitive Triage: Classified as '${triageResult.type}'. Goal: "${triageResult.goal}". Reasoning: ${triageResult.reasoning}`
        });

        let taskType: KernelTaskType;
        let payload: any = { command, file, triageResult };

        switch (triageResult.type) {
            case 'SYMBOLIC_REASONING_SOLVER':
                taskType = KernelTaskType.RUN_SYMBOLIC_SOLVER;
                break;
            case 'VISION_ANALYSIS':
                taskType = KernelTaskType.RUN_VISION_ANALYSIS;
                break;
            case 'COMPLEX_TASK':
                taskType = KernelTaskType.DECOMPOSE_STRATEGIC_GOAL;
                break;
            case 'MATHEMATICAL_PROOF':
                taskType = KernelTaskType.RUN_MATHEMATICAL_PROOF;
                break;
            case 'BRAINSTORM':
            case 'BRAINSTORM_SCIFI_COUNCIL':
                taskType = KernelTaskType.RUN_BRAINSTORM_SESSION;
                break;
            case 'SIMPLE_CHAT':
            default:
                taskType = KernelTaskType.GENERATE_CHAT_RESPONSE;
                break;
        }

        syscall('KERNEL/QUEUE_TASK', {
            id: `task_${self.crypto.randomUUID()}`,
            type: taskType,
            payload: payload,
            timestamp: Date.now(),
        });
    };

    const handleSendCommand = (command: string, file?: File) => {
        if (!command.trim() && !file) {
            return;
        }
        
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: command, fileName: file?.name });
        syscall('PROCESS_COMMAND', { command, file });
        
        uiHandlers.setCurrentCommand('');
        uiHandlers.setAttachedFile(null);
    };

    useEffect(() => {
        if (state.commandToProcess) {
            const { command, file } = state.commandToProcess;
            syscall('CLEAR_COMMAND_TO_PROCESS', {});
            processCommand(command, file);
        }
    }, [state.commandToProcess]);
    
    const handleFeedback = (id: string, feedback: 'positive' | 'negative') => {
        syscall('UPDATE_HISTORY_FEEDBACK', { id, feedback });
        syscall('USER_MODEL/LOG_TASK_SUCCESS', { success: feedback === 'positive' });
    };

    return {
        state,
        dispatch,
        syscall,
        memoryStatus,
        toasts,
        addToast,
        removeToast,
        t,
        i18n,
        language: i18n.language,
        geminiAPI,
        ...uiHandlers,
        ...liveSession,
        handleSendCommand,
        handleFeedback,
    };
};