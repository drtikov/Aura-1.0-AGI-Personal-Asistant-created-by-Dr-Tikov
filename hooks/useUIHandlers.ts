import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal } from '../types';
import { migrateState } from '../state/migrations';
import { CURRENT_STATE_VERSION } from '../constants';
import { HAL } from '../core/hal';

type SyscallFn = (call: SyscallCall, args: any) => void;

export const useUIHandlers = (state: AuraState, syscall: SyscallFn, addToast: (msg: string, type?: ToastType) => void, t: (key: string, options?: any) => string, clearDB: () => Promise<void>) => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>(null);
    const [processingState, setProcessingState] = useState({ active: false, stage: '' });
    const [isPaused, setIsPaused] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'monitor'>('chat');
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
        if (file) { const previewUrl = HAL.FileSystem.createObjectURL(file); const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : file.type.startsWith('video') ? 'video' : 'other'; setAttachedFile({ file, previewUrl, type: fileType }); }
    }, []);
    const handleTogglePause = useCallback(() => { setIsPaused(p => !p); addToast(isPaused ? t('toastAutonomousResumed') : t('toastAutonomousPaused'), 'info'); }, [isPaused, addToast, t]);
    const handleMicClick = useCallback(() => {
        addToast("Microphone input is not yet implemented.", 'info');
        setIsRecording(r => !r); // Toggle for UI feedback
    }, [addToast]);
    
    const handleClearMemory = useCallback(async () => {
        if (HAL.UI.confirm(t('toastResetConfirm'))) {
            try {
                await clearDB(); // Clear the persistent storage first
                // This is a special case that bypasses the syscall for a full reset.
                // In a pure kernel model, this would be the only non-syscall dispatch.
                const dispatch = (action: Action) => (window as any)._auraRootDispatch(action);
                dispatch({ type: 'RESET_STATE' });
                addToast(t('toastResetSuccess'), 'success');
                setTimeout(() => HAL.System.reload(), 1000); // Reload to ensure a clean start
            } catch (e) {
                console.error("Failed to clear memory:", e);
                addToast(t('toastResetFailed'), 'error');
            }
        }
    }, [addToast, t, clearDB]);

    const handleExportState = useCallback(() => {
        try {
            const stateToExport = JSON.stringify(state, null, 2);
            if (!stateToExport) {
                addToast(t('placeholderNoData'), 'warning');
                return;
            }
            const blob = new Blob([stateToExport], { type: 'application/json' });
            const url = HAL.FileSystem.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura_snapshot_${new Date().toISOString()}.json`;
            a.click();
            HAL.FileSystem.revokeObjectURL(url);
            addToast(t('toastExportSuccess'), 'success');
        } catch (e) {
            console.error("Failed to export state:", e);
            addToast(t('toastExportFailed'), 'error');
        }
    }, [addToast, state, t]);
    const handleSaveAsCode = useCallback(() => {
        try {
            const stateString = JSON.stringify(state, null, 2);
            const fileContent = `// Aura State Snapshot - Saved on ${new Date().toISOString()}\n// This can be used for analysis or to bootstrap the application state.\n\nexport const savedAuraState = ${stateString};\n`;
            
            if (!stateString) {
                addToast(t('placeholderNoData'), 'warning');
                return;
            }
            const blob = new Blob([fileContent], { type: 'application/typescript;charset=utf-8' });
            const url = HAL.FileSystem.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-state-${new Date().toISOString().split('T')[0]}.ts`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            HAL.FileSystem.revokeObjectURL(url);
            addToast(t('toastExportSuccess'), 'success');
        } catch (e) {
            console.error("Failed to save state as code:", e);
            addToast(t('toastExportFailed'), 'error');
        }
    }, [state, addToast, t]);

    // FIX: Add missing handlers and return object to resolve multiple errors.
    const handleContemplate = useCallback(() => {
        syscall('ADD_COMMAND_LOG', { text: 'Manual introspection cycle triggered.', type: 'info' });
        syscall('UPDATE_INTERNAL_STATE', { status: 'introspecting' });
    }, [syscall]);

    const handleImportState = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    let importedState = JSON.parse(event.target?.result as string);
                    if (!importedState.version || importedState.version < CURRENT_STATE_VERSION) {
                        importedState = migrateState(importedState);
                    }
                    const dispatch = (action: Action) => (window as any)._auraRootDispatch(action);
                    dispatch({ type: 'IMPORT_STATE', payload: importedState });
                    addToast(t('toastImportSuccess', { source: file.name }), 'success');
                } catch (error) {
                    console.error("Failed to import state:", error);
                    addToast(t('toastImportFailed', { error: (error as Error).message }), 'error');
                } finally {
                    if (importInputRef.current) importInputRef.current.value = '';
                }
            };
            reader.readAsText(file);
        }
    }, [addToast, t]);

    const handleImportAsCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        addToast('Importing state from code is not yet implemented.', 'warning');
        if (importAsCodeInputRef.current) {
            importAsCodeInputRef.current.value = '';
        }
    }, [addToast]);

    const handleToggleVisualAnalysis = useCallback(() => {
        setIsVisualAnalysisActive(v => !v);
        // This is a placeholder for actual camera stream logic
        if (!isVisualAnalysisActive) {
            addToast('Visual analysis activated (simulation).', 'info');
        } else {
            addToast('Visual analysis deactivated.', 'info');
        }
    }, [isVisualAnalysisActive, addToast]);
    
    const handleTrip = useCallback(() => {
        const { isActive, mode } = state.psychedelicIntegrationState;
        const willBeActive = !isActive || mode !== 'trip';
        syscall('SET_PSYCHEDELIC_STATE', { isActive: willBeActive, mode: willBeActive ? 'trip' : null });
    }, [syscall, state.psychedelicIntegrationState]);

    const handleVisions = useCallback(() => {
        const { isActive, mode } = state.psychedelicIntegrationState;
        const willBeActive = !isActive || mode !== 'visions';
        syscall('SET_PSYCHEDELIC_STATE', { isActive: willBeActive, mode: willBeActive ? 'visions' : null });
    }, [syscall, state.psychedelicIntegrationState]);

    const handleSatori = useCallback(() => {
        const isActive = state.satoriState.isActive;
        syscall('SET_SATORI_STATE', { isActive: !isActive });
    }, [syscall, state.satoriState.isActive]);

    // Attaching the root dispatcher to the window for special cases like reset/import
    useEffect(() => {
        (window as any)._auraRootDispatch = (action: Action) => {
             // This is a temporary backdoor for global state resets. In a real OS, this would be a kernel panic/reboot.
             const rootDispatch = (state.history as any).__proto__.dispatch;
             if (rootDispatch) rootDispatch(action);
        };
    }, [state.history]);


    // FIX: Added missing handlers that are used by various modals.
    const approveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        const snapshotId = `pre_apply_${proposal.id}`;
        const modLogId = `mod_log_${self.crypto.randomUUID()}`;
        syscall('APPLY_ARCH_PROPOSAL', { proposal, snapshotId, modLogId, isAutonomous: false });
        addToast(t('toast_proposalApproved', { action: proposal.action, target: proposal.target }), 'success');
    }, [syscall, addToast, t]);

    const rejectProposal = useCallback((id: string) => {
        syscall('OA/UPDATE_PROPOSAL', { id, updates: { status: 'rejected' } });
        addToast(t('toast_proposalRejected'), 'info');
    }, [syscall, addToast, t]);

    const handleWhatIf = useCallback((scenario: string) => {
        setProcessingState({ active: true, stage: 'whatIf' });
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: `What if: "${scenario}"` });
        // In a real implementation, this would call the Gemini API.
        setTimeout(() => {
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[Simulated Outcome for "${scenario}"] The results indicate a positive trend in global cooperation.` });
            setProcessingState({ active: false, stage: '' });
        }, 2000);
    }, [syscall, setProcessingState]);

    const handleSearch = useCallback((query: string) => {
        setProcessingState({ active: true, stage: 'search' });
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: `Search for: "${query}"` });
        // In a real implementation, this would call a search tool.
        setTimeout(() => {
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[Web Search Results for "${query}"] The capital of France is Paris.` });
            setProcessingState({ active: false, stage: '' });
        }, 2000);
    }, [syscall, setProcessingState]);

    const handleSetStrategicGoal = useCallback(async (goal: string) => {
        setProcessingState({ active: true, stage: t('strategicGoal_decomposing') });
        try {
            // This is a simplified decomposition. A real one would use the Gemini API.
            const rootId = `goal_${self.crypto.randomUUID()}`;
            const child1Id = `goal_${self.crypto.randomUUID()}`;
            const tree = {
                [rootId]: { id: rootId, parentId: null, children: [child1Id], description: goal, status: 'in_progress', progress: 0, type: 'STRATEGIC' },
                [child1Id]: { id: child1Id, parentId: rootId, children: [], description: `Initial research for '${goal}'`, status: 'not_started', progress: 0, type: 'TACTICAL' },
            };
            syscall('TELOS/DECOMPOSE_AND_SET_TREE', { tree, rootId, vectors: [] });
            addToast(t('strategicGoal_successToast'), 'success');
        } catch(e) {
            addToast(t('strategicGoal_errorToast'), 'error');
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [syscall, addToast, t]);

    const handleMultiverseBranch = useCallback((prompt: string) => {
        setProcessingState({ active: true, stage: t('multiverse_branching') });
        syscall('ADD_COMMAND_LOG', { text: `User initiated multiverse branch: "${prompt}"`, type: 'info' });
        setTimeout(() => {
            setProcessingState({ active: false, stage: '' });
        }, 1500);
    }, [syscall, setProcessingState, t]);

    const handleBrainstorm = useCallback((topic: string) => {
        setProcessingState({ active: true, stage: t('brainstorm_processing') });
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: `Brainstorm ideas about: "${topic}"` });
        // In a real implementation, this would call the Gemini API.
        setTimeout(() => {
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[Brainstorming on "${topic}"]\n- Idea 1\n- Idea 2\n- Idea 3` });
            setProcessingState({ active: false, stage: '' });
        }, 2000);
    }, [syscall, setProcessingState, t]);

    const handleSetTelos = useCallback((telos: string) => {
        syscall('SET_TELOS', telos);
        addToast('Core Telos has been updated.', 'success');
    }, [syscall, addToast]);


    return {
        currentCommand, setCurrentCommand,
        attachedFile, setAttachedFile,
        processingState, setProcessingState,
        isPaused, setIsPaused,
        activeLeftTab, setActiveLeftTab,
        isVisualAnalysisActive, setIsVisualAnalysisActive,
        isRecording, setIsRecording,
        outputPanelRef,
        importInputRef,
        importAsCodeInputRef,
        fileInputRef,
        videoRef,
        analysisIntervalRef,
        handleRemoveAttachment,
        handleFileChange,
        handleTogglePause,
        handleMicClick,
        handleClearMemory,
        handleExportState,
        handleSaveAsCode,
        handleContemplate,
        handleImportState,
        handleImportAsCode,
        handleToggleVisualAnalysis,
        handleTrip,
        handleVisions,
        handleSatori,
        // Add the new handlers to the returned object
        approveProposal,
        rejectProposal,
        handleWhatIf,
        handleSearch,
        handleSetStrategicGoal,
        handleMultiverseBranch,
        handleBrainstorm,
        handleSetTelos
    };
};