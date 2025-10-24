// hooks/useUIHandlers.ts
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// FIX: Added GoalType to import to resolve module error.
// FIX: Imported missing AuraState and Action types.
// FIX: Added PsycheAdaptationProposal to imports.
import { AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal, SelfProgrammingCandidate, GoalTree, GoalType, UseGeminiAPIResult, CoCreatedWorkflow, CreateFileCandidate, Plugin, HistoryEntry, UIHandlers, PsycheAdaptationProposal } from '../types.ts';
import { migrateState } from '../state/migrations.ts';
import { CURRENT_STATE_VERSION } from '../constants.ts';
import { HAL } from '../core/hal.ts';
import { useLocalization } from '../context/AuraContext.tsx';
import { generateManifest, generateStateSchema, generateArchitectureSchema, generateSyscallSchema } from '../core/schemaGenerator.ts';
import { VIRTUAL_FILE_SYSTEM } from '../core/vfs.ts';

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
        addToast("Microphone input is not yet implemented.", 'info');
        setIsRecording(r => !r); // Toggle for UI feedback
    }, [addToast]);
    
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

            addToast(t('toast_schemaGenerated'), 'success');
        } catch (error) {
            console.error("Failed to generate architectural schema:", error);
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

    const handleFantasy = () => { };
    const handleCreativity = () => { };
    const handleDream = () => { };
    const handleMeditate = () => { };
    const handleGaze = () => { };
    const handleTimefocus = () => { };
    const handleSetTelos = (telos: string) => syscall('SET_TELOS', telos);
    const handleCreateWorkflow = (workflowData: Omit<CoCreatedWorkflow, 'id'>) => {
        syscall('ADD_WORKFLOW_PROPOSAL', workflowData);
        addToast(t('toast_workflowCreated'), 'success');
    };
    const handleEvolveFromInsight = () => { };
    const handleVisualizeInsight = async (insight: string): Promise<string | undefined> => {
        try {
            return await geminiAPI.visualizeInsight(insight);
        } catch (e) {
            console.error(e);
        }
    };
    const handleShareWisdom = async () => {
        syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'generating' });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'ready', engram });
        } catch (e) {
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'idle' });
        }
    };
    const handleTrip = () => syscall('SET_PSYCHEDELIC_STATE', { isActive: !state.psychedelicIntegrationState.isActive, mode: 'trip' });
    const handleVisions = () => syscall('SET_PSYCHEDELIC_STATE', { isActive: !state.psychedelicIntegrationState.isActive, mode: 'visions' });
    const handleSatori = () => syscall('SET_SATORI_STATE', { isActive: !state.satoriState.isActive });
    const handleTrainCorticalColumn = (specialty: string, curriculum: string) => { };
    const handleSynthesizeAbstractConcept = (name: string, columnIds: string[]) => { };
    const handleStartSandboxSprint = (goal: string) => syscall('SANDBOX/START_SPRINT', { goal });
    const handleIngestWisdom = (content: string) => syscall('WISDOM/START_INGESTION', { content });
    const handleProcessAxiom = (axiom: any, status: 'accepted' | 'rejected') => {
        if (status === 'accepted') {
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { axiom: axiom.axiom, source: axiom.source });
        }
        syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status });
    };
    const handleApproveAllAxioms = (axioms: any[]) => {
        axioms.forEach(axiom => {
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { axiom: axiom.axiom, source: axiom.source });
            syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status: 'accepted' });
        });
    };
    const handleResetWisdomIngestion = () => syscall('WISDOM/RESET', {});
    const handleGenerateArchitectureDocument = () => {
        const goal = t('archDoc_goal');
        syscall('DOCUMENT_FORGE/START_PROJECT', { goal });
        addToast(t('archDoc_toast_started'), 'info');
    };
    const handleStartDocumentForge = (goal: string) => syscall('DOCUMENT_FORGE/START_PROJECT', { goal });
    const handleGenerateDreamPrompt = async () => {
        try {
            return await geminiAPI.generateDreamPrompt();
        } catch (e) {
            console.error(e);
        }
    };
    const approveProposal = (proposal: ArchitecturalChangeProposal) => syscall('APPLY_ARCH_PROPOSAL', { proposal, snapshotId: `snap_${self.crypto.randomUUID()}`, modLogId: `mod_${self.crypto.randomUUID()}`, isAutonomous: false });
    const handleImplementSelfProgramming = (candidate: SelfProgrammingCandidate) => syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: candidate.id });
    const handleLiveLoadPlugin = (candidate: CreateFileCandidate) => {
        if (candidate.newPluginObject) {
            const newPlugin: Plugin = { ...candidate.newPluginObject, status: 'enabled' };
            syscall('PLUGIN/ADD_PLUGIN', newPlugin);
        }
    };
    const handleUpdateSuggestionStatus = (suggestionId: string, action: 'accepted' | 'rejected') => syscall('UPDATE_SUGGESTION_STATUS', { id: suggestionId, status: action });
    const handleScrollToHistory = (historyId: string) => {
        const element = document.getElementById(`history-entry-${historyId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlighted-entry');
            setTimeout(() => element.classList.remove('highlighted-entry'), 2000);
        }
    };

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
        // FIX: Add missing handleRunCrucibleSimulation to the returned object.
        handleRunCrucibleSimulation,
        handleApprovePsycheAdaptation: () => {}, // This is now automated,
    };
};