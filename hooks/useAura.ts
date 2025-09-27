// hooks/useAura.ts
import { useMemo, useCallback, useEffect, useRef } from 'react';
import i18next from 'i18next';
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem } from './useAutonomousSystem';
import { translations } from '../localization';
import { SelfProgrammingCandidate, CoCreatedWorkflow, NeuroCortexState, Percept, TacticalPlan, TriageDecision, ArchitecturalChangeProposal, CausalHypothesis, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal, UnifiedProposal } from '../types';
import { clamp } from '../utils';

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

    useAutonomousSystem({
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        ...geminiAPI,
    });
    
    const handleSendCommand = useCallback(async (prompt: string, file?: File | null) => {
        if (!prompt.trim() && !file) return;

        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();

        const userEntryId = self.crypto.randomUUID();
        dispatch({
            type: 'SYSCALL',
            payload: { call: 'ADD_HISTORY_ENTRY', args: { id: userEntryId, from: 'user', text: prompt, ...(file && { fileName: file.name }) } }
        });

        uiHandlers.setProcessingState({ active: true, stage: t('status_thinking') });
        
        const botEntryId = self.crypto.randomUUID();
        dispatch({
            type: 'SYSCALL',
            payload: { call: 'ADD_HISTORY_ENTRY', args: { id: botEntryId, from: 'bot', text: '', streaming: true } }
        });

        try {
            const responseText = await geminiAPI.generateResponse(prompt, file);
            
            dispatch({
                type: 'SYSCALL',
                payload: { call: 'FINALIZE_HISTORY_ENTRY', args: { id: botEntryId, finalState: { text: responseText, streaming: false } } }
            });

            const extractedFacts = await geminiAPI.extractKnowledgeFromInteraction(prompt, responseText);
            if (extractedFacts && extractedFacts.length > 0) {
                dispatch({ type: 'SYSCALL', payload: { call: 'ADD_FACTS_BATCH', args: extractedFacts } });
                addToast(t('knowledgeExtraction_toast', { count: extractedFacts.length }), 'info');
            }
        } catch (error) {
            console.error("Error during direct response generation:", error);
            const errorMessage = "I encountered an error trying to respond. Please try again.";
            dispatch({
                type: 'SYSCALL',
                payload: { call: 'FINALIZE_HISTORY_ENTRY', args: { id: botEntryId, finalState: { text: errorMessage, streaming: false } } }
            });
            addToast("Failed to generate response.", "error");
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
        }
    }, [dispatch, geminiAPI, uiHandlers, addToast, t]);


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
            dispatch({ type: 'SYSCALL', payload: { call: 'ADD_HISTORY_ENTRY', args: { id: self.crypto.randomUUID(), from: 'system', text: completeMessage } } });
            addToast(`Training for "${specialty}" complete. No initial facts extracted.`, 'warning');
        }

    }, [dispatch, addToast, geminiAPI, t]);

    const handleSynthesizeAbstractConcept = useCallback((name: string, columnIds: string[]) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'SYNTHESIZE_ABSTRACT_CONCEPT', args: { name, columnIds } } });
         dispatch({
            type: 'SYSCALL',
            payload: {
                call: 'ADD_HISTORY_ENTRY',
                args: {
                    id: self.crypto.randomUUID(),
                    from: 'system',
                    text: `Abstract Thought Synthesis initiated. A new concept, "${name}", is being formed from ${columnIds.length} cortical columns. Its activation can be monitored in the Neuro-Cortex panel.`
                }
            }
        });
        addToast(`Synthesizing new abstract concept: ${name}`, 'success');
    }, [dispatch, addToast]);

    const handleSetStrategicGoal = useCallback(async (goal: string) => {
        uiHandlers.setProcessingState({ active: true, stage: t('strategicGoal_decomposing') });
        try {
            const { tree, rootId } = await geminiAPI.decomposeStrategicGoal(goal);
            dispatch({ type: 'SYSCALL', payload: { call: 'BUILD_GOAL_TREE', args: { tree, rootId } } });
            addToast(t('strategicGoal_successToast'), 'success');
        } catch (error) {
            console.error("Failed to set strategic goal:", error);
            addToast(t('strategicGoal_errorToast'), 'error');
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
        }
    }, [uiHandlers, geminiAPI, dispatch, addToast, t]);

    const handleGenerateCognitiveSequence = useCallback(async (directive: string) => {
        if (!directive.trim()) return;
        const sequence = await geminiAPI.generateCognitiveActionSequence(directive);
        if (sequence) {
            dispatch({ type: 'SYSCALL', payload: { call: 'MOTOR_CORTEX/SET_SEQUENCE', args: sequence } });
            addToast(`Cognitive sequence generated for: "${directive}"`, 'info');
        }
    }, [geminiAPI, dispatch, addToast]);

    const handleAuditArchitecture = useCallback(async () => {
        addToast('Auditing architecture for new primitives...', 'info');
        const newPrimitives = await geminiAPI.auditArchitectureForPrimitives();
        if (newPrimitives && newPrimitives.length > 0) {
            dispatch({ type: 'SYSCALL', payload: { call: 'PSYCHE/REGISTER_PRIMITIVES', args: newPrimitives } });
            addToast(`Found ${newPrimitives.length} new primitives! Psyche language has been evolved.`, 'success');
        } else if (newPrimitives) {
            addToast('No new primitives were found. Architecture is up to date.', 'info');
        }
    }, [geminiAPI, dispatch, addToast]);
    
    const handleWhatIf = useCallback(async (scenario: string) => {
        handleSendCommand(`Analyze the following hypothetical scenario: "${scenario}"`);
    }, [handleSendCommand]);

    const handleSearch = useCallback(async (query: string) => {
        handleSendCommand(query); // The main handler will use search if appropriate
    }, [handleSendCommand]);

    const handleMultiverseBranch = useCallback(async (prompt: string) => {
        handleSendCommand(`Branching timeline. Consider this alternative: "${prompt}"`);
    }, [handleSendCommand]);
    
    const handleBrainstorm = useCallback(async (topic: string) => {
        handleSendCommand(`Let's brainstorm ideas for: "${topic}"`);
    }, [handleSendCommand]);

    const handleEvolveFromInsight = useCallback(() => {
        addToast('Evolving from insight... (not fully implemented)', 'info');
        const insight = state.gankyilInsights.insights.find(i => !i.isProcessedForEvolution);
        if (insight) {
            geminiAPI.generateEvolutionaryProposalFromInsight(insight);
        }
    }, [addToast, state.gankyilInsights.insights, geminiAPI]);
    
    const testCausalHypothesis = useCallback((hypothesis: CausalHypothesis) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'TEST_CAUSAL_HYPOTHESIS', args: hypothesis } });
        addToast(`Testing hypothesis for: ${hypothesis.linkKey}`, 'info');
    }, [dispatch, addToast]);

    const handleCopyCode = useCallback((code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            addToast('Code copied to clipboard.', 'success');
        });
    }, [addToast]);

    const handleImplementUnifiedProposal = useCallback((proposal: UnifiedProposal) => {
        switch(proposal.proposalType) {
            case 'geniality':
                dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL', args: { id: proposal.id, status: 'implemented' } } });
                break;
            case 'crucible':
                 dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_CRUCIBLE_IMPROVEMENT_PROPOSAL', args: { id: proposal.id, status: 'implemented' } } });
                break;
            case 'causal_inference':
                dispatch({ type: 'SYSCALL', payload: { call: 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL', args: proposal } });
                break;
            case 'self_programming_create':
            case 'self_programming_modify':
                if (window.confirm("Implement this autonomous code change? This will modify Aura's source code in the Virtual File System.")) {
                    dispatch({ type: 'SYSCALL', payload: { call: 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', args: { id: proposal.id } } });
                }
                return; // Prevent default toast
        }
        addToast(`Implemented proposal: "${'title' in proposal ? proposal.title : proposal.id}"`, 'success');
    }, [dispatch, addToast]);
    
    const handleDismissUnifiedProposal = useCallback((proposal: UnifiedProposal) => {
         switch(proposal.proposalType) {
            case 'code':
                dispatch({ type: 'SYSCALL', payload: { call: 'OA/UPDATE_PROPOSAL', args: { id: proposal.id, updates: { status: 'dismissed' } } } });
                break;
            case 'causal_inference':
                dispatch({ type: 'SYSCALL', payload: { call: 'OA/UPDATE_PROPOSAL', args: { id: proposal.id, updates: { status: 'rejected' } } } });
                break;
            case 'self_programming_create':
            case 'self_programming_modify':
                dispatch({ type: 'SYSCALL', payload: { call: 'REJECT_SELF_PROGRAMMING_CANDIDATE', args: { id: proposal.id } } });
                break;
        }
        addToast('Proposal dismissed.', 'info');
    }, [dispatch, addToast]);


    const lastVersionRef = useRef(state.psycheState.version);
    useEffect(() => {
        if (state.psycheState.version > lastVersionRef.current) {
            console.log(`Psyche version changed to ${state.psycheState.version}. Persisting to VFS...`);
            const registryJson = JSON.stringify(state.psycheState.primitiveRegistry, null, 2);
            const filePath = `/system/psyche/v${state.psycheState.version}.json`;
            
            dispatch({ type: 'SYSCALL', payload: { call: 'INGEST_CODE_CHANGE', args: { filePath, code: registryJson } } });
    
            addToast(`Psyche v${state.psycheState.version} has been saved to the Virtual File System.`, 'success');
            
            lastVersionRef.current = state.psycheState.version;
        }
    }, [state.psycheState.version, state.psycheState.primitiveRegistry, dispatch, addToast]);

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
        handleSendCommand,
        handleFeedback,
        handleShareWisdom,
        handleCreateWorkflow,
        handleTrainCorticalColumn,
        handleSynthesizeAbstractConcept,
        handleSetStrategicGoal,
        handleGenerateCognitiveSequence,
        handleAuditArchitecture,
        handleWhatIf,
        handleSearch,
        handleMultiverseBranch,
        handleBrainstorm,
        handleEvolveFromInsight,
        testCausalHypothesis,
        handleCopyCode,
        handleImplementUnifiedProposal,
        handleDismissUnifiedProposal
        // FIX: Corrected useMemo syntax by moving the closing parenthesis to separate the factory function from the dependency array.
    }), [state, dispatch, memoryStatus, clearDB, toasts, addToast, removeToast, t, uiHandlers, geminiAPI, handleSendCommand, handleFeedback, handleShareWisdom, handleCreateWorkflow, handleTrainCorticalColumn, handleSynthesizeAbstractConcept, handleSetStrategicGoal, handleGenerateCognitiveSequence, handleAuditArchitecture, handleWhatIf, handleSearch, handleMultiverseBranch, handleBrainstorm, handleEvolveFromInsight, testCausalHypothesis, handleCopyCode, handleImplementUnifiedProposal, handleDismissUnifiedProposal]);

    return auraInterface;
};