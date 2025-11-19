// hooks/useAura.ts
import { useMemo, useEffect, useRef, useCallback } from 'react';
import { useAuraState } from './useAuraState.ts';
import { useGeminiAPI } from './useGeminiAPI.ts';
import { useUIHandlers } from './useUIHandlers.ts';
import { useToasts } from './useToasts.ts';
import { useAutonomousSystem } from './useAutonomousSystem.ts';
import { useToolExecution } from './useToolExecution.ts';
import { HAL } from '../core/hal.ts';
import { SyscallCall, HistoryEntry, Hypothesis, HeuristicPlan, Persona, CognitiveStrategy, KernelTaskType, TriageResult } from '../types.ts';
import { useDomObserver } from './useDomObserver.ts';
import { useLiveSession } from './useLiveSession.ts';
import { useTranslation } from 'react-i18next';
import { personas } from '../state/personas.ts';

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearMemoryAndState, saveStateToMemory } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    const { t, i18n } = useTranslation();

    // This effect syncs i18next language with app state language
    useEffect(() => {
        if (i18n.language !== state.language) {
            i18n.changeLanguage(state.language);
        }
    }, [state.language, i18n]);

    const syscall = useCallback((call: SyscallCall, args: any, traceId?: string) => {
        dispatch({ type: 'SYSCALL', payload: { call, args, traceId } });
    }, [dispatch]);

    const geminiAPI = useGeminiAPI(state, dispatch, addToast);
    
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
        geminiAPI, // Pass geminiAPI to the tool executor
    });

    const liveSession = useLiveSession(state, dispatch, addToast);

    const processCommand = async (command: string, file: File | undefined, traceId: string) => {
        syscall('PROCESS_USER_INPUT_INTO_PERCEPT', {
            intent: 'unknown',
            rawText: command,
            ...(file && { sensoryEngram: { modality: file.type.startsWith('image') ? 'visual' : 'auditory', rawPrimitives: [{type: 'file_attachment', value: file.name}] } })
        }, traceId);

        const triageResult = await geminiAPI.triageUserIntent(command);
        syscall('ADD_HISTORY_ENTRY', { 
            from: 'system', 
            text: `Cognitive Triage: Classified as '${triageResult.type}'. Goal: "${triageResult.goal}". Reasoning: ${triageResult.reasoning}`
        }, traceId);

        let taskType: KernelTaskType;
        let payload: any = { command, file, triageResult };

        switch (triageResult.type) {
            case 'SYMBOLIC_SOLVER':
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
            // FIX: Corrected typo from BRAINSTORM_SCIFI_COUNCIL to BRAINSTORM_SCI_FI_COUNCIL to match the type definition.
            case 'BRAINSTORM_SCI_FI_COUNCIL':
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
            traceId,
        }, traceId);
    };

    const handleSendCommand = (command: string, file?: File) => {
        if (!command.trim() && !file) {
            return;
        }
        
        const traceId = `trace_user_${self.crypto.randomUUID()}`;
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: command, fileName: file?.name }, traceId);
        syscall('PROCESS_COMMAND', { command, file, traceId }, traceId);
        
        uiHandlers.setCurrentCommand('');
        uiHandlers.setAttachedFile(null);
    };

    useEffect(() => {
        if (state.commandToProcess) {
            const { command, file, traceId } = state.commandToProcess;
            syscall('CLEAR_COMMAND_TO_PROCESS', {}, traceId);
            processCommand(command, file, traceId);
        }
    }, [state.commandToProcess]);
    
    const handleFeedback = (id: string, feedback: 'positive' | 'negative') => {
        const traceId = `trace_feedback_${self.crypto.randomUUID()}`;
        syscall('UPDATE_HISTORY_FEEDBACK', { id, feedback }, traceId);
        syscall('USER_MODEL/LOG_TASK_SUCCESS', { success: feedback === 'positive' }, traceId);

        if (feedback === 'negative') {
            syscall('ETHICAL_GOVERNOR/LEARN_FROM_FEEDBACK', { historyId: id, feedback }, traceId);
        }
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
        saveStateToMemory,
        ...uiHandlers,
        ...liveSession,
        handleSendCommand,
        handleFeedback,
    };
};