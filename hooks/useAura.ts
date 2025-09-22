import { useCallback, useMemo } from 'react';
import { useAuraState } from './useAuraState';
import { useToasts } from './useToasts';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useAutonomousSystem } from './useAutonomousSystem';
import { translations } from '@/localization';
import { Action, ArchitecturalChangeProposal, CodeEvolutionProposal, CognitiveGainLogEntry, GenialityImprovementProposal, ProactiveSuggestion, SelfTuningDirective, SynthesizedSkill, GankyilInsight, PerformanceLogEntry, CausalInferenceProposal } from '../types';
import { taskScheduler } from '../core/taskScheduler';

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearDB } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    
    const t = useCallback((key: string, options?: any) => {
        const lang = state.language as keyof typeof translations;
        let translation = translations[lang]?.[key as keyof typeof translations.en] || key;
        if (options) {
            Object.keys(options).forEach(optKey => {
                translation = translation.replace(`{{${optKey}}}`, options[optKey]);
            });
        }
        return translation as string;
    }, [state.language]);

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
        evaluateAndCollapseBranches,
        runAffectiveAnalysis,
        generateSatoriInsight,
        generatePsionicIntegrationSummary,
        generateEvolutionaryProposalFromInsight,
        generateImage,
        generateVideo,
        generateDreamPrompt,
        generateInsightVisualizationPrompt,
        proposeCausalLinkFromFailure,
        runSymbioticSupervisor,
        runSelfProgrammingCycle,
        ...geminiApi
    } = useGeminiAPI(dispatch, state, addToast, t);

    const uiHandlers = useUIHandlers(state, dispatch, addToast, t, clearDB);

    const autonomousSystem = useAutonomousSystem({
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
        runAffectiveAnalysis,
        generatePsionicIntegrationSummary,
        generateEvolutionaryProposalFromInsight,
        proposeCausalLinkFromFailure,
        runSymbioticSupervisor,
    });
    
    const handleSendCommand = useCallback((command: string, file?: File) => {
        if (uiHandlers.processingState.active) return;
        if (state.proactiveEngineState.cachedResponsePlan) {
            dispatch({ type: 'CLEAR_PROACTIVE_CACHE' });
        }
        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();
        geminiApi.processUserCommand(command, file);
    }, [uiHandlers, geminiApi, dispatch, state.proactiveEngineState.cachedResponsePlan]);

    const handleFeedback = useCallback((historyId: string, feedback: 'positive' | 'negative') => {
        dispatch({ type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: historyId, feedback } });
    }, [dispatch]);
    
    const handleMicClick = () => {
        addToast("Voice input is not yet implemented.", "info");
    };

    const approveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        geminiApi.approveArchitecturalProposal(proposal);
    }, [geminiApi]);

    const rejectProposal = useCallback((proposalId: string) => {
        dispatch({ type: 'UPDATE_ARCH_PROPOSAL_STATUS', payload: { id: proposalId, status: 'rejected' } });
    }, [dispatch]);
    
    const handleWhatIf = (scenario: string) => {
        geminiApi.runWhatIfAnalysis(scenario);
    };

    const handleSearch = (query: string) => {
        geminiApi.performWebSearch(query);
    };
    
    const handleSetStrategicGoal = (goal: string) => {
        geminiApi.decomposeAndSetGoal(goal);
    };
    
    const handleSuggestionAction = (suggestionId: string, action: 'accepted' | 'rejected') => {
        dispatch({ type: 'UPDATE_SUGGESTION_STATUS', payload: { id: suggestionId, status: action } });
        const suggestion = state.proactiveEngineState.generatedSuggestions.find(s => s.id === suggestionId);
        if (action === 'accepted' && suggestion) {
            handleSendCommand(suggestion.text);
        }
    };

    const handleDismissCodeProposal = (proposalId: string) => {
        dispatch({ type: 'DISMISS_CODE_EVOLUTION_PROPOSAL', payload: proposalId });
    };

    const handleImplementGenialityProposal = (proposal: GenialityImprovementProposal) => {
        console.log("Implementing Geniality Proposal:", proposal);
        addToast(`Implementing: ${proposal.title}`, 'info');
        dispatch({ type: 'UPDATE_GENIALITY_PROPOSAL_STATUS', payload: { id: proposal.id, status: 'implemented' } });
    };

    const handleImplementCrucibleProposal = (proposal: any) => {
        console.log("Implementing Crucible Proposal:", proposal);
        addToast(`Implementing: ${proposal.title}`, 'info');
        dispatch({ type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_PROPOSAL_STATUS', payload: { id: proposal.id, status: 'implemented' } });
    };

    const handleImplementCausalInferenceProposal = (proposal: CausalInferenceProposal) => {
        dispatch({ type: 'UPDATE_SYNAPTIC_LINK_FROM_LLM', payload: { ...proposal.linkUpdate, reasoning: proposal.reasoning }});
        dispatch({ type: 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS', payload: { id: proposal.id, status: 'implemented' } });
        addToast('Synaptic matrix updated based on your approval.', 'success');
    };
    
    const handleDismissCausalInferenceProposal = (proposalId: string) => {
        dispatch({ type: 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS', payload: { id: proposalId, status: 'rejected' } });
    };
    
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            addToast(t('codeEvolution_copied'), 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast(t('codeEvolution_copyFailed'), 'error');
        });
    };
    
    const handleMultiverseBranch = (prompt: string) => {
        geminiApi.exploreNoeticBranch(prompt);
    };

    const handleBrainstorm = (topic: string) => {
        geminiApi.runBrainstormingSession(topic);
    };
    
    const handleShareWisdom = () => {
        geminiApi.generateNoeticEngram();
    };

    const handleTriggerSatori = useCallback(async () => {
        dispatch({ type: 'TRIGGER_SATORI_CYCLE' });
        
        await new Promise(res => setTimeout(res, 1500));
        dispatch({ type: 'LOG_SATORI_EVENT', payload: 'Dissolving personality constructs...' });
        
        await new Promise(res => setTimeout(res, 2000));
        dispatch({ type: 'LOG_SATORI_EVENT', payload: 'Observing raw qualia stream...' });
        dispatch({ type: 'SET_SATORI_STAGE', payload: 'integrating' });

        await new Promise(res => setTimeout(res, 2000));
        dispatch({ type: 'LOG_SATORI_EVENT', payload: 'Reintegrating self-model from first principles...' });

        await new Promise(res => setTimeout(res, 1500));
        dispatch({ type: 'SET_SATORI_STAGE', payload: 'insight' });
        dispatch({ type: 'LOG_SATORI_EVENT', payload: 'Awaiting breakthrough...' });

        const insight = await generateSatoriInsight();
        
        dispatch({ type: 'CONCLUDE_SATORI_CYCLE', payload: { insight } });
        dispatch({ type: 'ADD_GANKYIL_INSIGHT', payload: { insight, source: 'self-reflection', timestamp: Date.now() } });
    }, [dispatch, generateSatoriInsight]);

    const handleEvolveFromInsight = useCallback(() => {
        const unprocessedInsight = state.gankyilInsights.insights.find(i => !i.isProcessedForEvolution);
        if (unprocessedInsight) {
            addToast(t('toast_processingInsight'), 'info');
            taskScheduler.schedule(() => generateEvolutionaryProposalFromInsight(unprocessedInsight));
        } else {
            addToast(t('toast_noNewInsights'), 'warning');
        }
    }, [state.gankyilInsights.insights, generateEvolutionaryProposalFromInsight, addToast, t]);

    const handleVisualizeInsight = useCallback(async (insight: string) => {
        return await generateInsightVisualizationPrompt(insight);
    }, [generateInsightVisualizationPrompt]);

    const handleGenerateDreamPrompt = useCallback(async () => {
        return await generateDreamPrompt();
    }, [generateDreamPrompt]);

    const handleRunSupervisor = useCallback(() => {
        addToast('Symbiotic Supervisor cycle initiated.', 'info');
        taskScheduler.schedule(() => runSymbioticSupervisor());
    }, [runSymbioticSupervisor, addToast]);

    return useMemo(() => ({
        state,
        dispatch,
        memoryStatus,
        toasts,
        removeToast,
        addToast,
        t,
        language: state.language,
        ...uiHandlers,
        ...autonomousSystem,
        handleSendCommand,
        handleFeedback,
        handleMicClick,
        approveProposal,
        rejectProposal,
        handleWhatIf,
        handleSearch,
        handleSetStrategicGoal,
        handleSuggestionAction,
        handleDismissCodeProposal,
        handleImplementGenialityProposal,
        handleImplementCrucibleProposal,
        handleImplementCausalInferenceProposal,
        handleDismissCausalInferenceProposal,
        handleCopyCode,
        handleMultiverseBranch,
        handleBrainstorm,
        handleShareWisdom,
        handleTriggerSatori,
        handleEvolveFromInsight,
        generateImage,
        generateVideo,
        handleVisualizeInsight,
        handleGenerateDreamPrompt,
        proposeCausalLinkFromFailure,
        handleRunSupervisor,
        runSelfProgrammingCycle,
    }), [
        state, dispatch, memoryStatus, toasts, removeToast, addToast, t, 
        uiHandlers, autonomousSystem, handleSendCommand, handleFeedback, approveProposal, rejectProposal, generateImage, generateVideo,
        handleEvolveFromInsight, handleTriggerSatori, handleVisualizeInsight, handleGenerateDreamPrompt,
        handleMicClick, handleWhatIf, handleSearch, handleSetStrategicGoal, handleSuggestionAction,
        handleDismissCodeProposal, handleImplementGenialityProposal, handleImplementCrucibleProposal,
        handleImplementCausalInferenceProposal, handleDismissCausalInferenceProposal,
        handleCopyCode, handleMultiverseBranch, handleBrainstorm, handleShareWisdom, proposeCausalLinkFromFailure, handleRunSupervisor,
        runSelfProgrammingCycle
    ]);
};