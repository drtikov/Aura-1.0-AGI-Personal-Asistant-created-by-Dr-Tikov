// hooks/useUIHandlers.ts
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { 
    AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal, 
    SelfProgrammingCandidate, GoalTree, GoalType, UseGeminiAPIResult, 
    CoCreatedWorkflow, CreateFileCandidate, Plugin, HistoryEntry, 
    UIHandlers, PsycheAdaptationProposal, DoxasticExperiment, KnowledgeFact
} from '../types';
import { migrateState } from '../state/migrations.ts';
import { CURRENT_STATE_VERSION } from '../constants.ts';
import { HAL } from '../core/hal.ts';
import { useLocalization } from '../context/AuraContext.tsx';
import { generateManifest, generateStateSchema, generateArchitectureSchema, generateSyscallSchema } from '../core/schemaGenerator';
import { VIRTUAL_FILE_SYSTEM } from '../core/vfs';

declare const JSZip: any;

type SyscallFn = (call: SyscallCall, args: any) => void;

// FIX: Corrected the return type of the `t` function from `void` to `string`.
export const useUIHandlers = (state: AuraState, dispatch: React.Dispatch<Action>, syscall: SyscallFn, addToast: (msg: string, type?: ToastType) => void, t: (key: string, options?: any) => string, clearMemoryAndState: () => Promise<void>, geminiAPI: UseGeminiAPIResult): UIHandlers => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>(null);
    const [processingState, setProcessingState] = useState({ active: false, stage: '' });
    const [isPaused, setIsPaused] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'monitor' | 'canvas'>('chat');
    const [isVisualAnalysisActive, setIsVisualAnalysisActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    const outputPanelRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const importAsCodeInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const analysisIntervalRef = useRef<number | null>(null);

    useEffect(() => { syscall('SET_THEME', state.theme); document.body.className = state.theme; }, [state.theme, syscall]);
    
    useLayoutEffect(() => {
        if (!outputPanelRef.current) return;
        const panel = outputPanelRef.current;
        // A threshold of 50px allows for some minor scrolling without breaking the "follow" behavior.
        const isScrolledToBottom = panel.scrollHeight - panel.clientHeight <= panel.scrollTop + 50;

        if (isScrolledToBottom) {
            panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
        }
    }, [state.history]);

    useEffect(() => { document.documentElement.lang = state.language; }, [state.language]);


    const handleRemoveAttachment = useCallback(() => { if (attachedFile) HAL.FileSystem.revokeObjectURL(attachedFile.previewUrl); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, [attachedFile]);
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type === 'application/pdf') {
                addToast(t('toast_pdf_chat_error'), 'warning');
                if (fileInputRef.current) fileInputRef.current.value = ''; // Clear the input
                return; // Prevent attachment
            }
            const previewUrl = HAL.FileSystem.createObjectURL(file);
            const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : file.type.startsWith('video') ? 'video' : 'other';
            setAttachedFile({ file, previewUrl, type: fileType });
        }
    }, [addToast, t]);
    const handleTogglePause = useCallback(() => { setIsPaused(p => !p); addToast(isPaused ? t('toastAutonomousResumed') : t('toastAutonomousPaused'), 'info'); }, [isPaused, addToast, t]);
    const handleMicClick = useCallback(() => {
        // FIX: Pass feature name to translation function
        addToast(t('toast_not_implemented', { feature: "Microphone input" }), 'info');
        setIsRecording(r => !r); // Toggle for UI feedback
    }, [addToast, t]);
    
    const handleClearMemory = useCallback(async () => {
        if (HAL.UI.confirm(t('toastResetConfirm'))) {
            try {
                await clearMemoryAndState();
                addToast(t('toastResetSuccess'), 'success');
                setTimeout(() => HAL.System.reload(), 1000);
            } catch (error) {
                addToast(t('toastResetFailed'), 'error');
            }
        }
    }, [t, clearMemoryAndState, addToast]);

    const handleExportState = useCallback(() => {
        try {
            const stateString = JSON.stringify(state, null, 2);
            const blob = new Blob([stateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-state-v${CURRENT_STATE_VERSION}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            addToast(t('toastExportSuccess'), 'success');
        } catch (error) {
            // FIX: Pass feature name to translation function
            addToast(t('toastExportFailed'), 'error');
        }
    }, [state, t, addToast]);

    const handleImportState = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedState = JSON.parse(event.target?.result as string);
                    let migratedState = importedState;
                    if (!importedState.version || importedState.version < CURRENT_STATE_VERSION) {
                        migratedState = migrateState(importedState);
                    }
                    dispatch({ type: 'IMPORT_STATE', payload: migratedState });
                    addToast(t('toastImportSuccess', { source: file.name }), 'success');
                } catch (error: any) {
                    // FIX: Pass feature name to translation function
                    addToast(t('toastImportFailed', { error: error.message }), 'error');
                }
            };
            reader.readAsText(file);
        }
    }, [dispatch, t, addToast]);

    const handleSaveAsCode = () => {
        const code = `export const importedAuraState = ${JSON.stringify(state, null, 2)};`;
        const blob = new Blob([code], { type: 'text/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aura-state-snapshot.ts`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleGenerateArchitecturalSchema = async () => {
        // FIX: Pass feature name to translation function
        addToast(t('toast_schemaGenerating'), 'info');
        try {
            const zip = new JSZip();

            // Generate schema files
            zip.file("manifest.json", JSON.stringify(generateManifest(state), null, 2));
            zip.file("state.schema.json", JSON.stringify(generateStateSchema(), null, 2));
            zip.file("architecture.schema.json", JSON.stringify(generateArchitectureSchema(state), null, 2));
            zip.file("syscalls.schema.json", JSON.stringify(generateSyscallSchema(), null, 2));
            
            // Add VFS
            const vfsFolder = zip.folder("VFS");
            if (vfsFolder) {
                 for (const [filePath, content] of Object.entries(VIRTUAL_FILE_SYSTEM)) {
                    // Normalize path for zipping
                    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                    vfsFolder.file(cleanPath, content);
                }
            }

            // Generate and download zip
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AURA_SCHEMA_VFS_v${CURRENT_STATE_VERSION}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // FIX: Pass feature name to translation function
            addToast(t('toast_schemaGenerated'), 'success');
        } catch (error) {
            console.error("Failed to generate architectural schema:", error);
            // FIX: Pass feature name to translation function
            addToast(t('toast_schemaFailed'), 'error');
        }
    };

    const handleToggleVisualAnalysis = useCallback(() => {
        setIsVisualAnalysisActive(prev => !prev);
    }, []);

    const handleContemplate = useCallback(() => {
        syscall('METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING', {
            finding: 'Manual introspection triggered by user.',
            severity: 'low',
            source: 'user_interface'
        });
    }, [syscall]);

    const handleStartMetisResearch = async (problem: string) => {
        const initialState = {
            status: 'analyzing',
            problemStatement: problem,
            researchLog: [{ timestamp: Date.now(), message: `Received research problem: "${problem}"`, stage: 'OBSERVE' as const }],
            findings: null,
            errorMessage: null,
        };
        syscall('METIS/SET_STATE', initialState);
    
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            syscall('METIS/SET_STATE', { 
                status: 'hypothesizing',
                researchLog: [...initialState.researchLog, { timestamp: Date.now(), message: 'Formulating initial hypothesis based on problem statement.', stage: 'HYPOTHESIZE' as const }]
            });
            
            const hypothesis = await geminiAPI.runMetisHypothesis(problem);
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            let logAfterHypothesis = [...initialState.researchLog, 
                { timestamp: Date.now(), message: 'Formulating initial hypothesis based on problem statement.', stage: 'HYPOTHESIZE' as const },
                { timestamp: Date.now(), message: `Hypothesis: ${hypothesis}`, stage: 'HYPOTHESIZE' as const }
            ];
            syscall('METIS/SET_STATE', { researchLog: logAfterHypothesis });
    
            await new Promise(resolve => setTimeout(resolve, 1500));
            let logBeforeExperiment = [...logAfterHypothesis, { timestamp: Date.now(), message: 'Designing experiment: Cross-referencing internal knowledge bases for related data.', stage: 'EXPERIMENT' as const }];
            syscall('METIS/SET_STATE', { 
                status: 'experimenting',
                researchLog: logBeforeExperiment
            });
    
            const findings = await geminiAPI.runMetisExperiment(problem, hypothesis);
    
            await new Promise(resolve => setTimeout(resolve, 2000));
            syscall('METIS/SET_STATE', {
                status: 'complete',
                findings: findings,
                researchLog: [...logBeforeExperiment, { timestamp: Date.now(), message: 'Experiment complete. Synthesizing findings.', stage: 'CONCLUSION' as const }]
            });
    
        } catch (e) {
            syscall('METIS/SET_STATE', { status: 'error', errorMessage: (e as Error).message });
        }
    };
    
    const handleRunExperiment = useCallback(async (experiment: DoxasticExperiment) => {
        if (!experiment) return;
        
        const hypothesis = state.doxasticEngineState.hypotheses.find(h => h.id === experiment.hypothesisId);
        if (!hypothesis) {
            addToast(`Hypothesis for experiment ${experiment.id} not found.`, 'error');
            return;
        }
    
        syscall('DOXASTIC/UPDATE_EXPERIMENT_STATUS', { experimentId: experiment.id, status: 'running' });
        syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: hypothesis.id, status: 'testing' });
        addToast(`Running experiment for: "${hypothesis.description.substring(0, 30)}..."`, 'info');
    
        try {
            let rawResult = '';
            const [methodType, methodArg] = experiment.method.split(': ');
            
            if (!methodType || !methodArg) {
                throw new Error(`Invalid experiment method format: ${experiment.method}`);
            }
    
            switch(methodType.trim()) {
                case 'WEBSERVICE': {
                    const searchResult = await geminiAPI.performWebSearch(methodArg);
                    rawResult = searchResult.summary;
                    break;
                }
                case 'VFS_QUERY': {
                    rawResult = state.selfProgrammingState.virtualFileSystem[methodArg] || `Error: File not found in VFS: ${methodArg}`;
                    break;
                }
                case 'KG_QUERY': {
                    const [key, value] = methodArg.split('=').map(s => s.trim());
                    if (!key || !value) {
                        rawResult = "Error: Invalid KG_QUERY format. Expected key=value.";
                    } else {
                        const results = state.knowledgeGraph.filter((fact: KnowledgeFact) => (fact as any)[key] === value);
                        rawResult = JSON.stringify(results, null, 2);
                    }
                    break;
                }
            }
            
            const evaluation = await geminiAPI.evaluateExperimentResult(hypothesis.description, experiment.method, rawResult);
            
            syscall('DOXASTIC/UPDATE_EXPERIMENT_STATUS', { experimentId: experiment.id, status: 'complete', result: rawResult });
            syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: hypothesis.id, status: evaluation.outcome });
            
            if (evaluation.outcome === 'validated') {
                addToast(`Hypothesis validated: ${hypothesis.description.substring(0,30)}...`, 'success');
                if (hypothesis.linkKey) {
                    syscall('ADD_CAUSAL_LINK', {
                        cause: hypothesis.linkKey.split('->')[0],
                        effect: hypothesis.linkKey.split('->')[1],
                        confidence: 0.7,
                        source: 'doxastic_crucible',
                    });
                }
            } else {
                addToast(`Hypothesis refuted: ${hypothesis.description.substring(0,30)}...`, 'warning');
            }
    
        } catch(e) {
            addToast(`Experiment failed: ${(e as Error).message}`, 'error');
            syscall('DOXASTIC/UPDATE_EXPERIMENT_STATUS', { experimentId: experiment.id, status: 'pending' }); // Reset on error
            if(hypothesis) {
                syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: hypothesis.id, status: 'designed' });
            }
        }
    }, [state, syscall, addToast, geminiAPI]);


    // FIX: Refactored placeholder functions to use the translation function `t` for consistency and to resolve potential type errors.
    const handleFantasy = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Fantasy' }), 'info'), [addToast, t]);
    const handleCreativity = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Creativity' }), 'info'), [addToast, t]);
    const handleDream = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Dream' }), 'info'), [addToast, t]);
    const handleMeditate = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Meditate' }), 'info'), [addToast, t]);
    const handleGaze = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Gaze' }), 'info'), [addToast, t]);
    const handleTimefocus = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Time Focus' }), 'info'), [addToast, t]);
    const handleSetTelos = useCallback((telos: string) => { syscall('SET_TELOS', telos); }, [syscall]);
    const handleCreateWorkflow = useCallback((workflowData: Omit<CoCreatedWorkflow, 'id'>) => {
        syscall('ADD_WORKFLOW_PROPOSAL', workflowData);
        // FIX: Pass feature name to translation function
        addToast(t('toast_workflowCreated'), 'success');
    }, [syscall, addToast, t]);
    const handleEvolveFromInsight = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Evolve from Insight' }), 'info'), [addToast, t]);
    const handleVisualizeInsight = async (insight: string): Promise<string | undefined> => {
        try {
            return await geminiAPI.visualizeInsight(insight);
        } catch (e) {
            console.error(e);
        }
    };
    const handleShareWisdom = useCallback(async () => {
        syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'generating' });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'ready', engram });
        } catch (e) {
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'idle' });
        }
    }, [syscall, geminiAPI]);
    const handleTrip = useCallback(() => { syscall('SET_PSYCHEDELIC_STATE', { isActive: !state.psychedelicIntegrationState.isActive, mode: 'trip' }); }, [syscall, state.psychedelicIntegrationState.isActive]);
    const handleVisions = useCallback(() => { syscall('SET_PSYCHEDELIC_STATE', { isActive: !state.psychedelicIntegrationState.isActive, mode: 'visions' }); }, [syscall, state.psychedelicIntegrationState.isActive]);
    const handleSatori = useCallback(() => { syscall('SET_SATORI_STATE', { isActive: !state.satoriState.isActive }); }, [syscall, state.satoriState.isActive]);
    const handleTrainCorticalColumn = useCallback((specialty: string, curriculum: string) => addToast(t('toast_not_implemented', { feature: 'Training Cortical Column' }), 'info'), [addToast, t]);
    const handleSynthesizeAbstractConcept = useCallback((name: string, columnIds: string[]) => addToast(t('toast_not_implemented', { feature: 'Synthesizing Abstract Concept' }), 'info'), [addToast, t]);
    const handleStartSandboxSprint = useCallback((goal: string) => { syscall('SANDBOX/START_SPRINT', { goal }); }, [syscall]);
    const handleIngestWisdom = useCallback((content: string) => { syscall('WISDOM/START_INGESTION', { content }); }, [syscall]);
    const handleProcessAxiom = useCallback((axiom: any, status: 'accepted' | 'rejected') => {
        if (status === 'accepted') {
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { axiom: axiom.axiom, source: axiom.source });
        }
        syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status });
    }, [syscall]);
    const handleApproveAllAxioms = useCallback((axioms: any[]) => {
        axioms.forEach(axiom => {
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { axiom: axiom.axiom, source: axiom.source });
            syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status: 'accepted' });
        });
    }, [syscall]);
    const handleResetWisdomIngestion = useCallback(() => { syscall('WISDOM/RESET', {}); }, [syscall]);
    const handleGenerateArchitectureDocument = useCallback(() => {
        const goal = t('archDoc_goal');
        syscall('DOCUMENT_FORGE/START_PROJECT', { goal });
        // FIX: Pass feature name to translation function
        addToast(t('archDoc_toast_started'), 'info');
    }, [syscall, t, addToast]);
    const handleStartDocumentForge = useCallback((goal: string) => { syscall('DOCUMENT_FORGE/START_PROJECT', { goal }); }, [syscall]);
    const handleGenerateDreamPrompt = async (): Promise<string | undefined> => {
        try {
            return await geminiAPI.generateDreamPrompt();
        } catch (e) {
            console.error(e);
        }
    };
    const approveProposal = useCallback((proposal: ArchitecturalChangeProposal) => { syscall('APPLY_ARCH_PROPOSAL', { proposal, snapshotId: `snap_${self.crypto.randomUUID()}`, modLogId: `mod_${self.crypto.randomUUID()}`, isAutonomous: false }); }, [syscall]);
    const handleImplementSelfProgramming = useCallback((candidate: SelfProgrammingCandidate) => { syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: candidate.id }); }, [syscall]);
    const handleLiveLoadPlugin = useCallback((candidate: CreateFileCandidate) => {
        if (candidate.newPluginObject) {
            const newPlugin: Plugin = { ...candidate.newPluginObject, status: 'enabled' };
            syscall('PLUGIN/ADD_PLUGIN', newPlugin);
        }
    }, [syscall]);
    const handleUpdateSuggestionStatus = useCallback((suggestionId: string, action: 'accepted' | 'rejected') => { syscall('UPDATE_SUGGESTION_STATUS', { id: suggestionId, status: action }); }, [syscall]);
    const handleScrollToHistory = useCallback((historyId: string) => {
        const element = document.getElementById(`history-entry-${historyId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlighted-entry');
            setTimeout(() => element.classList.remove('highlighted-entry'), 2000);
        }
    }, []);

    const handleRunCrucibleSimulation = async (proposal: ArchitecturalChangeProposal) => {
        syscall('CRUCIBLE/START_SIMULATION', { proposalId: proposal.id });
        syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulating' } });
        try {
            const results = await geminiAPI.runCrucibleSimulation(proposal);
            
            // Evolutionary Governor Logic
            const GAIN_THRESHOLD = 0.10; // 10% performance gain
            if (results.performanceGain > GAIN_THRESHOLD) {
                syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'evaluated', reasoning: `${proposal.reasoning} [Crucible Validation: ${results.summary}]` } });
                addToast(`Crucible: Proposal ${proposal.id.slice(0,8)} passed simulation with significant gains.`, 'success');
            } else {
                syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulation_failed', failureReason: `Crucible: Insufficient performance gain (${(results.performanceGain * 100).toFixed(1)}%).` } });
                addToast(`Crucible: Proposal ${proposal.id.slice(0,8)} failed simulation due to insufficient gains.`, 'warning');
            }
        } catch (e) {
            syscall('OA/UPDATE_PROPOSAL', { id: proposal.id, updates: { status: 'simulation_failed', failureReason: `Crucible simulation error: ${(e as Error).message}` } });
            addToast(`Crucible simulation failed for proposal ${proposal.id.slice(0,8)}.`, 'error');
        }
    };

    const handleApprovePsycheAdaptation = useCallback(() => addToast(t('toast_not_implemented', { feature: 'Psyche Adaptation' }), 'info'), [addToast, t]);
    const handleOrchestrateTask = useCallback(() => syscall('MODAL/OPEN', { type: 'orchestrator', payload: {} }), [syscall]);
    const handleExplainComponent = useCallback(() => syscall('MODAL/OPEN', { type: 'reflector', payload: {} }), [syscall]);
    const handleStartOptimizationLoop = useCallback((goal: string) => { syscall('TELOS/START_OPTIMIZATION', { goal }); }, [syscall]);
    const handleToggleIdleThought = useCallback(() => { syscall('TOGGLE_IDLE_THOUGHT', {}); }, [syscall]);


    return {
        currentCommand,
        setCurrentCommand,
        attachedFile,
        setAttachedFile,
        processingState,
        setProcessingState,
        isPaused,
        activeLeftTab,
        setActiveLeftTab,
        isVisualAnalysisActive,
        isRecording,
        outputPanelRef,
        importInputRef,
        fileInputRef,
        videoRef,
        handleRemoveAttachment,
        handleFileChange,
        handleTogglePause,
        handleMicClick,
        handleClearMemory,
        handleExportState,
        handleImportState,
        handleSaveAsCode,
        handleGenerateArchitecturalSchema,
        handleToggleVisualAnalysis,
        handleContemplate,
        handleFantasy,
        handleCreativity,
        handleDream,
        handleMeditate,
        handleGaze,
        handleTimefocus,
        handleSetTelos,
        handleCreateWorkflow,
        handleEvolveFromInsight,
        handleVisualizeInsight,
        handleShareWisdom,
        handleTrip,
        handleVisions,
        handleSatori,
        handleTrainCorticalColumn,
        handleSynthesizeAbstractConcept,
        handleStartSandboxSprint,
        handleIngestWisdom,
        handleProcessAxiom,
        handleResetWisdomIngestion,
        handleApproveAllAxioms,
        handleGenerateArchitectureDocument,
        handleStartDocumentForge,
        handleGenerateDreamPrompt,
        approveProposal,
        handleImplementSelfProgramming,
        handleLiveLoadPlugin,
        handleUpdateSuggestionStatus,
        handleScrollToHistory,
        handleRunCrucibleSimulation,
        handleRunExperiment,
        handleApprovePsycheAdaptation,
        handleOrchestrateTask,
        handleExplainComponent,
        handleStartMetisResearch,
        handleStartOptimizationLoop,
        handleToggleIdleThought,
    };
};