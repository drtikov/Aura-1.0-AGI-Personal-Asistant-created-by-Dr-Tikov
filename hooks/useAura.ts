// hooks/useAura.ts
import { useMemo, useCallback } from 'react';
import i18next from 'i18next';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem } from './useAutonomousSystem';
import { translations } from '../localization';
import { SelfProgrammingCandidate } from '../types';

// Initialize localization
i18next.init({
    resources: translations,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearDB } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();

    const t = useMemo(() => {
        const i18nInstance = i18next.createInstance();
        i18nInstance.init({
            resources: translations,
            lng: state.language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
        return (key: string, options?: any) => i18nInstance.t(key, options);
    }, [state.language]);

    const uiHandlers = useUIHandlers(state, dispatch, addToast, t, clearDB);
    
    const geminiAPI = useGeminiAPI(state, dispatch, addToast);

    const autonomousSystem = useAutonomousSystem({
        state,
        dispatch,
        addToast,
        isPaused: uiHandlers.isPaused,
        ...geminiAPI,
    });
    
    const handleSendCommand = useCallback(async (prompt: string, file?: File | null) => {
        if (!prompt.trim() && !file) return;

        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
        
        const userEntryId = self.crypto.randomUUID();
        dispatch({
            type: 'ADD_HISTORY_ENTRY',
            payload: {
                id: userEntryId,
                from: 'user',
                text: prompt,
                ...(file && { fileName: file.name }),
            }
        });

        // --- Intercept special commands ---
        if (prompt.toLowerCase().trim() === 'further develop yourself') {
            const evaluatedCandidate = state.selfProgrammingState.candidates.find(
                (c: SelfProgrammingCandidate) => c.status === 'evaluated'
            );

            if (evaluatedCandidate) {
                // An evaluated candidate exists, so implement it.
                dispatch({
                    type: 'ADD_HISTORY_ENTRY',
                    payload: {
                        id: self.crypto.randomUUID(),
                        from: 'system',
                        text: `Directive confirmed. Implementing the previously evaluated proposal: ${evaluatedCandidate.reasoning}`
                    }
                });
                
                dispatch({ 
                    type: 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', 
                    payload: { id: evaluatedCandidate.id } 
                });

                let implementationDetail = '';
                if (evaluatedCandidate.type === 'CREATE') {
                    implementationDetail = `New component '${evaluatedCandidate.newFile.path}' created.`;
                } else if (evaluatedCandidate.type === 'MODIFY') {
                    implementationDetail = `File '${evaluatedCandidate.targetFile}' modified.`;
                }

                addToast(`Autonomous evolution implemented. ${implementationDetail}`, 'success');

            } else {
                // No evaluated candidate, so generate a new one.
                dispatch({
                    type: 'ADD_HISTORY_ENTRY',
                    payload: {
                        id: self.crypto.randomUUID(),
                        from: 'system',
                        text: "Directive received. Initiating autonomous self-development protocol. A new evolution candidate will be generated for your review in the 'Self-Programming' panel."
                    }
                });
                await autonomousSystem.proposeNewComponent();
            }
            return;
        }

        uiHandlers.setProcessingState({ active: true, stage: 'Thinking...' });

        const botEntryId = self.crypto.randomUUID();
        dispatch({
            type: 'ADD_HISTORY_ENTRY',
            payload: { id: botEntryId, from: 'bot', text: '', streaming: true }
        });
        
        try {
            const responseText = await geminiAPI.generateResponse(prompt, file);
            dispatch({
                type: 'FINALIZE_HISTORY_ENTRY',
                payload: { id: botEntryId, finalState: { text: responseText } }
            });
        } catch (error) {
            console.error("Failed to get response:", error);
            dispatch({
                type: 'FINALIZE_HISTORY_ENTRY',
                payload: { id: botEntryId, finalState: { text: "An error occurred while generating a response." } }
            });
            addToast("Failed to generate response.", 'error');
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
        }

    }, [dispatch, geminiAPI, autonomousSystem, uiHandlers, addToast, state.selfProgrammingState.candidates]);

    const handleFeedback = useCallback((id: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'UPDATE_HISTORY_FEEDBACK', payload: { id, feedback } });
    }, [dispatch]);


    const handleShareWisdom = useCallback(async () => {
        dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'generating' } });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'ready', engram } });
        } catch (error) {
            console.error("Failed to generate Noetic Engram:", error);
            addToast("Failed to generate Noetic Engram.", 'error');
            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'idle' } });
        }
    }, [dispatch, addToast, geminiAPI.generateNoeticEngram]);
    
    // Combine all handlers and state into a single object for the context
    const auraInterface = useMemo(() => ({
        state,
        dispatch,
        memoryStatus,
        clearDB,
        toasts,
        addToast,
        removeToast,
        t,
        language: state.language,
        ...uiHandlers,
        ...geminiAPI,
        ...autonomousSystem,
        handleSendCommand,
        handleFeedback,
        handleShareWisdom,
    }), [state, dispatch, memoryStatus, clearDB, toasts, addToast, removeToast, t, uiHandlers, geminiAPI, autonomousSystem, handleSendCommand, handleFeedback, handleShareWisdom]);

    return auraInterface;
};