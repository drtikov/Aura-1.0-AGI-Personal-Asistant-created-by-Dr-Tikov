import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { AuraState, ToastType, Action } from '../types';
import { migrateState } from '../state/migrations';
import { CURRENT_STATE_VERSION } from '../constants';

export const useUIHandlers = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (msg: string, type?: ToastType) => void, t: (key: string, options?: any) => string, clearDB: () => Promise<void>) => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>(null);
    const [processingState, setProcessingState] = useState({ active: false, stage: '' });
    const [isPaused, setIsPaused] = useState(true);
    const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'monitor'>('chat');
    const [isVisualAnalysisActive, setIsVisualAnalysisActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    const outputPanelRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const importAsCodeInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const analysisIntervalRef = useRef<number | null>(null);

    useEffect(() => { dispatch({ type: 'SET_THEME', payload: state.theme }); document.body.className = state.theme; }, [state.theme, dispatch]);
    
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


    const handleRemoveAttachment = useCallback(() => { if (attachedFile) URL.revokeObjectURL(attachedFile.previewUrl); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, [attachedFile]);
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const previewUrl = URL.createObjectURL(file); const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : file.type.startsWith('video') ? 'video' : 'other'; setAttachedFile({ file, previewUrl, type: fileType }); }
    }, []);
    const handleTogglePause = useCallback(() => { setIsPaused(p => !p); addToast(isPaused ? t('toastAutonomousResumed') : t('toastAutonomousPaused'), 'info'); }, [isPaused, addToast, t]);
    const handleMicClick = useCallback(() => {
        addToast("Microphone input is not yet implemented.", 'info');
        setIsRecording(r => !r); // Toggle for UI feedback
    }, [addToast]);
    
    const handleClearMemory = useCallback(async () => {
        if (window.confirm(t('toastResetConfirm'))) {
            try {
                await clearDB(); // Clear the persistent storage first
                dispatch({ type: 'RESET_STATE' }); // Then reset the React state
                addToast(t('toastResetSuccess'), 'success');
                setTimeout(() => window.location.reload(), 1000); // Reload to ensure a clean start
            } catch (e) {
                console.error("Failed to clear memory:", e);
                addToast(t('toastResetFailed'), 'error');
            }
        }
    }, [addToast, dispatch, t, clearDB]);

    const handleExportState = useCallback(() => {
        try {
            const stateToExport = JSON.stringify(state, null, 2);
            if (!stateToExport) {
                addToast(t('placeholderNoData'), 'warning');
                return;
            }
            const blob = new Blob([stateToExport], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura_snapshot_${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
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
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aura-state-${new Date().toISOString().split('T')[0]}.ts`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addToast(t('toastExportSuccess'), 'success');
        } catch (e) {
            console.error("Failed to save state as code:", e);
            addToast(t('toastExportFailed'), 'error');
        }
    }, [state, addToast, t]);
    
    const processAndLoadState = useCallback((newState: any, source: 'file' | 'code file') => {
        if (!newState.version || typeof newState.version !== 'number') {
            throw new Error("Invalid state file: missing or invalid version property.");
        }

        if (window.confirm(`Importing this file will overwrite Aura's current state. Proceed?`)) {
            let stateToLoad = newState;
            if (newState.version < CURRENT_STATE_VERSION) {
                if (!window.confirm(`This state is from an older version (v${newState.version}). Aura will attempt to migrate it to the current version (v${CURRENT_STATE_VERSION}). This is experimental. Continue?`)) {
                    return; // User cancelled migration
                }
                try {
                    stateToLoad = migrateState(newState);
                    addToast(`State migrated from v${newState.version} to v${CURRENT_STATE_VERSION}.`, 'info');
                } catch (migrationError) {
                    console.error("Migration failed during import:", migrationError);
                    addToast('State migration failed. The import was cancelled.', 'error');
                    return;
                }
            } else if (newState.version > CURRENT_STATE_VERSION) {
                 addToast(`Cannot import state from a future version (v${newState.version}). Your application version is v${CURRENT_STATE_VERSION}.`, 'error');
                 return;
            }

            dispatch({ type: 'IMPORT_STATE', payload: stateToLoad });
            addToast(t('toastImportSuccess', { source }), 'success');
        }
    }, [dispatch, addToast, t]);

    const handleImportState = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file content");
                const newState = JSON.parse(text);
                processAndLoadState(newState, 'file');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                console.error("Failed to import state:", err);
                addToast(t('toastImportFailed', { error: errorMessage }), 'error');
            } finally {
                if (importInputRef.current) {
                    importInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    }, [processAndLoadState, t]);

    const handleImportAsCode = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file content");
                const startIndex = text.indexOf('{');
                const endIndex = text.lastIndexOf('}');
                if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
                    throw new Error("Could not find a valid state object in the file.");
                }
                const jsonString = text.substring(startIndex, endIndex + 1);
                const newState = JSON.parse(jsonString);
                processAndLoadState(newState, 'code file');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                console.error("Failed to import state from code:", err);
                addToast(t('toastImportFailed', { error: errorMessage }), 'error');
            } finally {
                if (importAsCodeInputRef.current) {
                    importAsCodeInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    }, [processAndLoadState, t]);

    const handleRollback = useCallback((snapshotId: string) => {
        const snapshot = state.systemSnapshots.find(s => s.id === snapshotId);
        if (snapshot && snapshot.state && window.confirm(`Rollback to snapshot from ${new Date(snapshot.timestamp).toLocaleString()}? This is irreversible.`)) {
            dispatch({ type: 'ROLLBACK_STATE', payload: snapshot.state });
            addToast(t('toastRollbackSuccess'), 'success');
        } else { addToast(t('toastRollbackFailed'), 'error'); }
    }, [state.systemSnapshots, dispatch, addToast, t]);
    const handleToggleForgePause = useCallback(() => {
        dispatch({ type: 'TOGGLE_COGNITIVE_FORGE_PAUSE' });
        addToast(state.cognitiveForgeState.isTuningPaused ? 'Cognitive Forge tuning resumed.' : 'Cognitive Forge tuning paused.', 'info');
    }, [dispatch, addToast, state.cognitiveForgeState.isTuningPaused]);

    const handleContemplate = useCallback(() => {
        dispatch({ type: 'SET_INTERNAL_STATUS', payload: 'CONTEMPLATIVE' });
        dispatch({ type: 'ADD_COMMAND_LOG', payload: { text: 'Contemplative cycle initiated.', type: 'info' } });
        addToast('Beginning contemplation...', 'info');
        // In a real implementation, a longer process would run here.
        // For now, we simulate a period of thought.
        setTimeout(() => {
            dispatch({ type: 'SET_INTERNAL_STATUS', payload: 'idle' });
        }, 3000);
    }, [dispatch, addToast]);


    return {
        currentCommand, setCurrentCommand, attachedFile, setAttachedFile, processingState, setProcessingState,
        isPaused, activeLeftTab, setActiveLeftTab, isRecording, setIsRecording,
        outputPanelRef, importInputRef, fileInputRef, isVisualAnalysisActive, setIsVisualAnalysisActive, videoRef, analysisIntervalRef,
        importAsCodeInputRef,
        handleRemoveAttachment, handleFileChange, handleTogglePause, handleClearMemory, handleExportState, handleSaveAsCode, handleImportState, handleRollback, handleToggleForgePause,
        handleImportAsCode, handleContemplate, handleMicClick
    };
};
