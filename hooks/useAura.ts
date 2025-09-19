import { useCallback, useRef } from 'react';
import { useToasts } from './useToasts';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useAutonomousSystem } from './useAutonomousSystem';
import { useUIHandlers } from './useUIHandlers';
import { SelfDirectedGoal, ArchitecturalChangeProposal, ProactiveSuggestion, PerformanceLogEntry, ModalType, ModalProps, GenialityImprovementProposal, ArchitecturalImprovementProposal, CognitiveGainLogEntry } from '../types';
import { useModal } from '../context/ModalContext';
import { resources } from '../constants';

export const useAura = () => {
    const { toasts, addToast, removeToast } = useToasts();
    const { state, dispatch, memoryStatus, clearDB } = useAuraState();
    
    const t = useCallback((key: string, options?: any) => {
        const langResources = resources[state.language]?.translation || resources.en.translation;
        let translation = langResources[key] || resources.en.translation[key] || key;
        
        if (options) {
            Object.keys(options).forEach(optKey => {
                const regex = new RegExp(`{{${optKey}}}`, 'g');
                translation = translation.replace(regex, options[optKey]);
            });
        }
        return translation;
    }, [state.language]);

    const uiHandlers = useUIHandlers(state, dispatch, addToast, t, clearDB);
    const apiHooks = useGeminiAPI(state, dispatch, addToast, uiHandlers.setProcessingState, t);
    const { handleSendCommand } = apiHooks;
    const modal = useModal();

    const { 
        synthesizeNewSkill, 
        runSkillSimulation, 
        analyzePerformanceForEvolution, 
        consolidateCoreIdentity, 
        analyzeStateComponentCorrelation, 
        runCognitiveArbiter,
        consolidateEpisodicMemory,
        evolvePersonality,
        generateCodeEvolutionSnippet,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        branchAndExplore,
        evaluateAndCollapseBranches,
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
        consolidateEpisodicMemory,
        evolvePersonality,
        generateCodeEvolutionSnippet,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        evaluateAndCollapseBranches,
    });
    const { isVisualAnalysisActive, setIsVisualAnalysisActive, videoRef, analysisIntervalRef, isRecording, setIsRecording, setCurrentCommand } = uiHandlers;
    const recognitionRef = useRef<any | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleExecuteGoal = useCallback(async (goal: SelfDirectedGoal) => {
        addToast(t('toastExecutingGoal', { goal: goal.actionCommand }), 'info');
        dispatch({ type: 'UPDATE_GOAL_STATUS', payload: { id: goal.id, status: 'in_progress' } });
        
        const logEntry = await handleSendCommand(goal.actionCommand);

        if (logEntry) {
            const executionLog = `Execution ${logEntry.success ? 'succeeded' : 'failed'}. Cognitive Gain: ${logEntry.cognitiveGain.toFixed(2)}. Duration: ${logEntry.duration}ms.`;
            dispatch({ type: 'UPDATE_GOAL_OUTCOME', payload: { id: goal.id, status: logEntry.success ? 'completed' : 'failed', executionLog, logId: logEntry.id } });
        } else {
            const executionLog = 'Execution failed due to a system error.';
            dispatch({ type: 'UPDATE_GOAL_OUTCOME', payload: { id: goal.id, status: 'failed', executionLog, logId: '' } });
        }
    }, [addToast, handleSendCommand, dispatch, t]);
    
    const handleIngestData = useCallback(async (text: string) => {
        modal.close();
        uiHandlers.setProcessingState({ active: true, stage: 'Ingesting data...'});
        // FIX: The function `extractAndStoreKnowledge` expects 1 argument, not 3.
        const factsAdded = await apiHooks.extractAndStoreKnowledge(text);
        uiHandlers.setProcessingState({ active: false, stage: ''});
        addToast(t('toastIngestionComplete', { count: factsAdded.length }), 'success');
    }, [apiHooks.extractAndStoreKnowledge, addToast, uiHandlers, modal, t]);
    
    const wrappedAPICall = useCallback(async <T,>(apiFn: (...args: T[]) => Promise<void>, ...args: T[]) => {
        uiHandlers.setProcessingState({ active: true, stage: 'Processing...' });
        try { await apiFn(...args); }
        finally { uiHandlers.setProcessingState({ active: false, stage: '' }); }
    }, [uiHandlers]);

    const handleSendCommandWrapper = useCallback(async (command: string, file?: File) => {
        await handleSendCommand(command, file);
        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
    }, [handleSendCommand, uiHandlers]);

    const handleApproveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        const snapshotId = self.crypto.randomUUID();
        const modLogId = self.crypto.randomUUID();
        
        dispatch({ type: 'APPLY_ARCH_PROPOSAL', payload: { proposal: { ...proposal, timestamp: Date.now() }, snapshotId, modLogId, isAutonomous: false } });
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
            addToast(t('toastSpeechNotSupported'), 'warning');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = state.language;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsRecording(true);
            addToast(t('toastListening'), 'info');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setCurrentCommand(transcript);
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            let errorMessage = t('toastSRFail');
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                errorMessage = t('toastMicDenied');
            } else if (event.error === 'no-speech') {
                errorMessage = t('toastNoSpeech');
            }
            addToast(errorMessage, 'error');
        };
        
        recognition.onend = () => {
            setIsRecording(false);
            recognitionRef.current = null;
        };

        recognition.start();

    }, [addToast, isRecording, setIsRecording, setCurrentCommand, t, state.language]);

    const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'SET_THEME', payload: e.target.value }), [dispatch]);
    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value }), [dispatch]);


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
                        
                        // Create canvas once and reuse for performance
                        if (!canvasRef.current) {
                            canvasRef.current = document.createElement('canvas');
                        }
                        const canvas = canvasRef.current;
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;
                        const ctx = canvas.getContext('2d');

                        analysisIntervalRef.current = window.setInterval(() => {
                            if (videoRef.current && videoRef.current.readyState >= 3 && ctx) {
                                // Mirror the canvas context to match the CSS-mirrored video feed
                                ctx.save();
                                ctx.translate(canvas.width, 0);
                                ctx.scale(-1, 1);
                                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                                ctx.restore(); // Restore context to prevent cumulative transformations

                                const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
                                apiHooks.handleAnalyzeVisualSentiment(base64Image);
                            }
                        }, 5000); // Analyze every 5 seconds
                    };
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                addToast(t('toastCameraAccessDenied'), 'error');
            }
        }
    }, [isVisualAnalysisActive, videoRef, analysisIntervalRef, setIsVisualAnalysisActive, dispatch, apiHooks.handleAnalyzeVisualSentiment, addToast, t]);

    const handleFeedback = useCallback((historyId: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: historyId, feedback } });
        dispatch({ type: 'PROCESS_USER_FEEDBACK', payload: feedback });
        addToast(t('toastFeedbackReceived'), 'info');
        addToast(feedback === 'positive' ? t('toastPositiveFeedbackReinforce') : t('toastCorrectiveFeedbackImprove'), 'success');
    }, [dispatch, addToast, t]);

    const handleReviewProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        modal.open('proposalReview', {
            proposal,
            onApprove: handleApproveProposal,
            onReject: handleRejectProposal
        });
    }, [modal, handleApproveProposal, handleRejectProposal]);

    const handleSuggestionAction = useCallback((suggestionId: string, action: 'accepted' | 'rejected') => {
        dispatch({ type: 'UPDATE_SUGGESTION_STATUS', payload: { id: suggestionId, status: action } });
        addToast(action === 'accepted' ? t('toastSuggestionAccepted', { text: state.proactiveEngineState.generatedSuggestions.find(s => s.id === suggestionId)?.text || '' }) : t('toastSuggestionDismissed'), 'info');
    }, [dispatch, addToast, t, state.proactiveEngineState.generatedSuggestions]);

    const handleSelectGainLog = useCallback((log: CognitiveGainLogEntry) => {
        modal.open('cognitiveGainDetail', { log });
    }, [modal]);

    const handleShareWisdom = useCallback(() => {
        dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'generating' } });
        addToast(t('toastEngramGenerating'), 'info');
        apiHooks.generateNoeticEngram();
    }, [dispatch, addToast, t, apiHooks.generateNoeticEngram]);

    const createModalHandler = useCallback(<T extends ModalType>(type: T, props: ModalProps[T]) => {
        return () => modal.open(type, props);
    }, [modal]);
    
    const handleDismissCodeProposal = useCallback((id: string) => {
        dispatch({ type: 'DISMISS_CODE_EVOLUTION_PROPOSAL', payload: id });
    }, [dispatch]);

    const handleImplementGenialityProposal = useCallback((proposal: GenialityImprovementProposal) => {
        dispatch({ type: 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL_STATUS', payload: { id: proposal.id, status: 'implemented' } });
        addToast(t('toastProposalImplemented', { title: proposal.title }), 'success');
    }, [dispatch, addToast, t]);

    const handleImplementCrucibleProposal = useCallback((proposal: ArchitecturalImprovementProposal) => {
        dispatch({ type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_PROPOSAL_STATUS', payload: { id: proposal.id, status: 'implemented' } });
        addToast(t('toastProposalImplemented', { title: proposal.title }), 'success');
    }, [dispatch, addToast, t]);

    const handleCopyCode = useCallback((code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            addToast(t('codeEvolution_copied'), 'success');
        }, (err) => {
            console.error('Could not copy code: ', err);
            addToast(t('codeEvolution_copyFailed'), 'error');
        });
    }, [addToast, t]);

    const handleAnalyzeWhatIf = useCallback(async (scenario: string) => {
        modal.close();
        addToast(t('toastAnalyzingScenario', { scenario }), 'info');
        await handleSendCommand(`Analyze the hypothetical scenario: "${scenario}"`);
    }, [modal, addToast, t, handleSendCommand]);

    const handleBranchConsciousness = useCallback(async (prompt: string) => {
        modal.close();
        addToast(t('multiverse_branchingInitiated', { prompt }), 'info');
        await branchAndExplore(prompt);
    }, [modal, addToast, t, branchAndExplore]);

    // FIX: Added a comprehensive return statement to provide all necessary state and handlers.
    return {
        // For App.tsx
        state,
        toasts,
        removeToast,
        t,
        language: state.language,

        // From useAuraState
        dispatch,
        memoryStatus,
        clearDB,
        
        // From useToasts
        addToast,

        // From useUIHandlers
        ...uiHandlers,

        // From useGeminiAPI (overwriting handleSendCommand)
        ...apiHooks,
        handleSendCommand: handleSendCommandWrapper,
        
        // Handlers from useAura
        handleFeedback,
        handleApproveProposal,
        handleRejectProposal,
        handleMicClick,
        handleThemeChange,
        handleLanguageChange,
        handleSetStrategicGoal,
        handleIngestData,
        handleToggleVisualAnalysis,
        handleIntrospect,
        
        // Newly created handlers
        handleReviewProposal,
        handleSuggestionAction,
        handleSelectGainLog,
        handleShareWisdom,
        createModalHandler,
        handleDismissCodeProposal,
        handleImplementGenialityProposal,
        handleImplementCrucibleProposal,
        handleCopyCode,
        handleAnalyzeWhatIf,
        handleBranchConsciousness,
    };
};