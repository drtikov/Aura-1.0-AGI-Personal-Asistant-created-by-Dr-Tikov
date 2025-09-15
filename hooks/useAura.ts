import { useCallback, useRef } from 'react';
import { useToasts } from './useToasts';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useAutonomousSystem } from './useAutonomousSystem';
import { useUIHandlers } from './useUIHandlers';
import { SelfDirectedGoal, ArchitecturalChangeProposal, ProactiveSuggestion } from '../types';

export const useAura = () => {
    const { toasts, addToast, removeToast } = useToasts();
    const { state, dispatch } = useAuraState();
    const uiHandlers = useUIHandlers(state, dispatch, addToast);
    const { handleSendCommand, handleEvolve, handleRunCognitiveMode, handleAnalyzeWhatIf, handleExecuteSearch, extractAndStoreKnowledge, handleHypothesize, handleIntuition, handleValidateModification, handleDecomposeGoal, handleAnalyzeVisualSentiment, handleGenerateProactiveSuggestion, handleRunRootCauseAnalysis } = useGeminiAPI(state, dispatch, addToast, uiHandlers.setProcessingState);
    
    const runProactiveCycle = useCallback(() => {
        handleGenerateProactiveSuggestion();
    }, [handleGenerateProactiveSuggestion]);

    const { handleIntrospect } = useAutonomousSystem(state, dispatch, addToast, uiHandlers.isPaused, runProactiveCycle, handleRunRootCauseAnalysis);
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
        uiHandlers.setShowIngest(false);
        uiHandlers.setProcessingState({ active: true, stage: 'Ingesting data...'});
        const factsAdded = await extractAndStoreKnowledge(text, 0.8, false);
        uiHandlers.setProcessingState({ active: false, stage: ''});
        addToast(`Ingestion complete. ${factsAdded} new facts stored.`, 'success');
    }, [extractAndStoreKnowledge, addToast, uiHandlers]);
    
    const wrappedAPICall = useCallback(async <T,>(apiFn: (...args: T[]) => Promise<void>, ...args: T[]) => {
        uiHandlers.setProcessingState({ active: true, stage: 'Processing...' });
        try { await apiFn(...args); }
        finally { uiHandlers.setProcessingState({ active: false, stage: '' }); }
    }, [uiHandlers]);

    const handleSendCommandWrapper = (command: string, file?: File) => {
        handleSendCommand(command, file);
        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
    };

    const handleApproveProposal = (proposal: ArchitecturalChangeProposal) => {
        const snapshotId = self.crypto.randomUUID();
        const modLogId = self.crypto.randomUUID();
        
        dispatch({ type: 'APPLY_ARCH_PROPOSAL', payload: { proposal, snapshotId, modLogId } });
        addToast('Architectural change applied. Initiating validation...', 'success');
        uiHandlers.setProposalToReview(null);

        // Run validation in the background without blocking the UI
        handleValidateModification(proposal, modLogId);
    };

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

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'SET_THEME', payload: e.target.value });

    const handleSetStrategicGoal = (goal: string) => {
        uiHandlers.setShowStrategicGoalModal(false);
        handleDecomposeGoal(goal);
    };

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
            addToast('Visual analysis stopped.', 'info');
        } else {
            // Start
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsVisualAnalysisActive(true);
                        addToast('Visual analysis started.', 'success');

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
                                    handleAnalyzeVisualSentiment(base64Image);
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
    }, [isVisualAnalysisActive, videoRef, analysisIntervalRef, setIsVisualAnalysisActive, addToast, handleAnalyzeVisualSentiment]);

    const handleFeedback = useCallback((historyId: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: historyId, feedback } });
        dispatch({ type: 'PROCESS_USER_FEEDBACK', payload: feedback });
        const feedbackMessage = feedback === 'positive' 
            ? 'Positive feedback registered. I will reinforce this approach.'
            : 'Corrective feedback registered. I am analyzing my response to improve.';
        addToast('Feedback received, thank you.', 'success');
        dispatch({ type: 'ADD_HISTORY', payload: { id: self.crypto.randomUUID(), from: 'system', text: feedbackMessage } });
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

    return {
        state, dispatch, toasts, removeToast, addToast, ...uiHandlers,
        handleSendCommand: handleSendCommandWrapper,
        handleEvolve: handleEvolve,
        handleRunCognitiveMode: (mode: any) => wrappedAPICall(handleRunCognitiveMode, mode),
        handleAnalyzeWhatIf: (scenario: string) => { uiHandlers.setShowWhatIfModal(false); wrappedAPICall(handleAnalyzeWhatIf, scenario); },
        handleExecuteSearch: (query: string) => { uiHandlers.setShowSearchModal(false); wrappedAPICall(handleExecuteSearch, query); },
        handleHypothesize: () => wrappedAPICall(handleHypothesize),
        handleIntuition: () => wrappedAPICall(handleIntuition),
        handleIntrospect, handleExecuteGoal, handleIngestData,
        handleMicClick, handleThemeChange,
        handleReviewProposal: uiHandlers.setProposalToReview,
        handleApproveProposal,
        handleRejectProposal: (id: string) => { dispatch({ type: 'UPDATE_ARCH_PROPOSAL_STATUS', payload: { id, status: 'rejected' } }); addToast('Proposal rejected.', 'info'); uiHandlers.setProposalToReview(null); },
        handleSelectGainLog: uiHandlers.setSelectedGainLog,
        handleValidateModification,
        handleSetStrategicGoal,
        handleToggleVisualAnalysis,
        handleFeedback,
        handleSuggestionAction,
    };
};