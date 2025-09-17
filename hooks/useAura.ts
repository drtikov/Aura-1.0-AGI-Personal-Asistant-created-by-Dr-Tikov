import { useCallback, useRef } from 'react';
import { useToasts } from './useToasts';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useAutonomousSystem } from './useAutonomousSystem';
import { useUIHandlers } from './useUIHandlers';
import { SelfDirectedGoal, ArchitecturalChangeProposal, ProactiveSuggestion, PerformanceLogEntry } from '../types';
import { useModal } from '../context/ModalContext';

export const useAura = () => {
    const { toasts, addToast, removeToast } = useToasts();
    const { state, dispatch, memoryStatus } = useAuraState();
    const uiHandlers = useUIHandlers(state, dispatch, addToast);
    const apiHooks = useGeminiAPI(state, dispatch, addToast, uiHandlers.setProcessingState);
    const { handleSendCommand } = apiHooks;
    const modal = useModal();

    const { 
        synthesizeNewSkill, 
        runSkillSimulation, 
        analyzePerformanceForEvolution, 
        consolidateCoreIdentity, 
        analyzeStateComponentCorrelation, 
        runCognitiveArbiter 
    } = apiHooks;

    const { handleIntrospect } = useAutonomousSystem({
        state,
        dispatch,
        addToast,
        isPaused: uiHandlers.isPaused,
        synthesizeNewSkill,
        runSkillSimulation,
        analyzePerformanceForEvolution,
        consolidateCoreIdentity,
        analyzeStateComponentCorrelation,
        runCognitiveArbiter,
    });
    const { isVisualAnalysisActive, setIsVisualAnalysisActive, videoRef, analysisIntervalRef, isRecording, setIsRecording, setCurrentCommand } = uiHandlers;
    const recognitionRef = useRef<any | null>(null);

    const handleExecuteGoal = useCallback(async (goal: SelfDirectedGoal) => {
        addToast(`Executing goal: ${goal.actionCommand}`, 'info');
        dispatch({ type: 'UPDATE_GOAL_STATUS', payload: { id: goal.id, status: 'executing' } });
        
        const logEntry = await handleSendCommand(goal.actionCommand);

        if (logEntry) {
            const executionLog = `Execution ${logEntry.success ? 'succeeded' : 'failed'}. Cognitive Gain: ${logEntry.cognitiveGain.toFixed(2)}. Duration: ${logEntry.duration}ms.`;
            dispatch({ type: 'UPDATE_GOAL_OUTCOME', payload: { id: goal.id, status: logEntry.success ? 'completed' : 'failed', executionLog, logId: logEntry.id } });
        } else {
            const executionLog = 'Execution failed due to a system error.';
            dispatch({ type: 'UPDATE_GOAL_OUTCOME', payload: { id: goal.id, status: 'failed', executionLog, logId: '' } });
        }
    }, [addToast, handleSendCommand, dispatch]);
    
    const handleIngestData = useCallback(async (text: string) => {
        modal.close();
        uiHandlers.setProcessingState({ active: true, stage: 'Ingesting data...'});
        const factsAdded = await apiHooks.extractAndStoreKnowledge(text, 0.8, false);
        uiHandlers.setProcessingState({ active: false, stage: ''});
        addToast(`Ingestion complete. ${factsAdded.length} new facts stored.`, 'success');
    }, [apiHooks.extractAndStoreKnowledge, addToast, uiHandlers, modal]);
    
    const wrappedAPICall = useCallback(async <T,>(apiFn: (...args: T[]) => Promise<void>, ...args: T[]) => {
        uiHandlers.setProcessingState({ active: true, stage: 'Processing...' });
        try { await apiFn(...args); }
        finally { uiHandlers.setProcessingState({ active: false, stage: '' }); }
    }, [uiHandlers]);

    const handleSendCommandWrapper = useCallback((command: string, file?: File) => {
        handleSendCommand(command, file);
        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
    }, [handleSendCommand, uiHandlers]);

    const handleApproveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        const snapshotId = self.crypto.randomUUID();
        const modLogId = self.crypto.randomUUID();
        
        dispatch({ type: 'APPLY_ARCH_PROPOSAL', payload: { proposal, snapshotId, modLogId, isAutonomous: false } });
        dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: 'Architectural change applied. Initiating validation...', type: 'info' } });
        modal.close();

        // Run validation in the background without blocking the UI
        apiHooks.handleValidateModification(proposal, modLogId);
    }, [dispatch, modal, apiHooks.handleValidateModification]);

    const handleRejectProposal = useCallback((id: string) => {
        dispatch({ type: 'UPDATE_ARCH_PROPOSAL_STATUS', payload: { id, status: 'rejected' } });
        dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: 'Architectural proposal rejected.', type: 'info' } });
        modal.close();
    }, [dispatch, modal]);

    const handleMicClick = useCallback(() => {
        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            addToast('Speech recognition is not supported in this browser.', 'warning');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsRecording(true);
            addToast('Listening...', 'info');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setCurrentCommand(transcript);
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            let errorMessage = 'An error occurred during speech recognition.';
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
            } else if (event.error === 'no-speech') {
                errorMessage = 'No speech was detected.';
            }
            addToast(errorMessage, 'error');
        };
        
        recognition.onend = () => {
            setIsRecording(false);
            recognitionRef.current = null;
        };

        recognition.start();

    }, [addToast, isRecording, setIsRecording, setCurrentCommand]);

    const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'SET_THEME', payload: e.target.value }), [dispatch]);

    const handleSetStrategicGoal = useCallback((goal: string) => {
        modal.close();
        apiHooks.handleDecomposeGoal(goal);
    }, [modal, apiHooks.handleDecomposeGoal]);

    const handleToggleVisualAnalysis = useCallback(async () => {
        if (isVisualAnalysisActive) {
            // Stop
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsVisualAnalysisActive(false);
            dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: 'Visual analysis stopped.', type: 'info' } });
        } else {
            // Start
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsVisualAnalysisActive(true);
                        dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: 'Visual analysis started.', type: 'success' } });

                        analysisIntervalRef.current = window.setInterval(() => {
                            if (videoRef.current && videoRef.current.readyState >= 3) { // HAVE_FUTURE_DATA
                                const canvas = document.createElement('canvas');
                                canvas.width = videoRef.current.videoWidth;
                                canvas.height = videoRef.current.videoHeight;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    // Flip the image horizontally to match the mirrored preview
                                    ctx.translate(canvas.width, 0);
                                    ctx.scale(-1, 1);
                                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                                    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
                                    apiHooks.handleAnalyzeVisualSentiment(base64Image);
                                }
                            }
                        }, 5000); // Analyze every 5 seconds
                    };
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                addToast('Camera access was denied. Please enable it in your browser settings.', 'error');
            }
        }
    }, [isVisualAnalysisActive, videoRef, analysisIntervalRef, setIsVisualAnalysisActive, dispatch, apiHooks.handleAnalyzeVisualSentiment]);

    const handleFeedback = useCallback((historyId: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: historyId, feedback } });
        dispatch({ type: 'PROCESS_USER_FEEDBACK', payload: feedback });
        const feedbackMessage = feedback === 'positive' 
            ? 'Positive feedback registered. I will reinforce this approach.'
            : 'Corrective feedback registered. I am analyzing my response to improve.';
        addToast('Feedback received, thank you.', 'success');
        dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: feedbackMessage, type: 'info' } });
    }, [dispatch, addToast]);

    const handleSuggestionAction = useCallback((suggestionId: string, action: 'accepted' | 'rejected') => {
        const suggestion = state.proactiveEngineState.generatedSuggestions.find(s => s.id === suggestionId);
        if (!suggestion) return;

        dispatch({ type: 'UPDATE_SUGGESTION_STATUS', payload: { id: suggestionId, status: action } });
        
        if (action === 'accepted') {
            addToast(`Executing: "${suggestion.text}"`, 'info');
            handleSendCommand(suggestion.text);
        } else {
            addToast('Suggestion dismissed.', 'info');
        }
    }, [state.proactiveEngineState.generatedSuggestions, dispatch, handleSendCommand, addToast]);

    const handleTraceGoal = useCallback((logId: string) => {
        const log = state.performanceLogs.find((l: PerformanceLogEntry) => l.id === logId);
        if (log) {
            modal.open('causalChain', { log });
        } else {
            addToast('Could not find the trace log for that goal.', 'warning');
        }
    }, [state.performanceLogs, modal, addToast]);

    return {
        state, dispatch, toasts, removeToast, addToast, ...uiHandlers, memoryStatus,
        handleSendCommand: handleSendCommandWrapper,
        handleEvolve: () => wrappedAPICall(apiHooks.handleEvolve),
        handleRunCognitiveMode: useCallback((mode: any) => wrappedAPICall(apiHooks.handleRunCognitiveMode, mode), [wrappedAPICall, apiHooks.handleRunCognitiveMode]),
        handleAnalyzeWhatIf: useCallback((scenario: string) => { modal.close(); wrappedAPICall(apiHooks.handleAnalyzeWhatIf, scenario); }, [modal, wrappedAPICall, apiHooks.handleAnalyzeWhatIf]),
        handleExecuteSearch: useCallback((query: string) => { modal.close(); wrappedAPICall(apiHooks.handleExecuteSearch, query); }, [modal, wrappedAPICall, apiHooks.handleExecuteSearch]),
        handleHypothesize: () => wrappedAPICall(apiHooks.handleHypothesize),
        handleIntuition: () => wrappedAPICall(apiHooks.handleIntuition),
        handleIntrospect, 
        handleExecuteGoal, 
        handleIngestData,
        handleMicClick, 
        handleThemeChange,
        handleReviewProposal: (proposal: ArchitecturalChangeProposal) => modal.open('proposalReview', { proposal, onApprove: handleApproveProposal, onReject: handleRejectProposal }),
        handleSelectGainLog: (log: any) => modal.open('cognitiveGainDetail', { log }),
        handleValidateModification: apiHooks.handleValidateModification,
        handleSetStrategicGoal,
        handleToggleVisualAnalysis,
        handleFeedback,
        handleSuggestionAction,
        handleTraceGoal,
    };
};