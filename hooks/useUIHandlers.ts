import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuraState, PerformanceLogEntry, ArchitecturalChangeProposal, CognitiveGainLogEntry, ToastType } from '../types';
import { Action } from '../state/reducer';
import { ALL_AURA_KEYS } from '../constants';


export const useUIHandlers = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (msg: string, type?: ToastType) => void) => {
    const [currentCommand, setCurrentCommand] = useState('');
    const [attachedFile, setAttachedFile] = useState<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>(null);
    const [processingState, setProcessingState] = useState({ active: false, stage: '' });
    const [showIngest, setShowIngest] = useState(false);
    const [causalChainLog, setCausalChainLog] = useState<PerformanceLogEntry | null>(null);
    const [showForecast, setShowForecast] = useState(false);
    const [selectedGainLog, setSelectedGainLog] = useState<CognitiveGainLogEntry | null>(null);
    const [proposalToReview, setProposalToReview] = useState<ArchitecturalChangeProposal | null>(null);
    const [showWhatIfModal, setShowWhatIfModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeLeftTab, setActiveLeftTab] = useState<'chat' | 'monitor'>('chat');
    const [showStrategicGoalModal, setShowStrategicGoalModal] = useState(false);
    const [isVisualAnalysisActive, setIsVisualAnalysisActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const outputPanelRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const analysisIntervalRef = useRef<number | null>(null);

    useEffect(() => { dispatch({ type: 'SET_THEME', payload: state.theme }); document.body.className = state.theme; }, [state.theme, dispatch]);
    useEffect(() => { if (outputPanelRef.current) outputPanelRef.current.scrollTop = outputPanelRef.current.scrollHeight; }, [state.history]);

    const handleRemoveAttachment = useCallback(() => { if (attachedFile) URL.revokeObjectURL(attachedFile.previewUrl); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, [attachedFile]);
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const previewUrl = URL.createObjectURL(file); const fileType = file.type.startsWith('image') ? 'image' : file.type.startsWith('audio') ? 'audio' : file.type.startsWith('video') ? 'video' : 'other'; setAttachedFile({ file, previewUrl, type: fileType }); }
    }, []);
    const handleTogglePause = useCallback(() => { setIsPaused(p => !p); addToast(isPaused ? 'Autonomous core resumed.' : 'Autonomous core paused.', 'info'); }, [isPaused, addToast]);
    const handleClearMemory = useCallback(() => {
        if (window.confirm("Are you sure you want to reset Aura? This will erase all memories and cannot be undone.")) {
            try { ALL_AURA_KEYS.forEach(key => localStorage.removeItem(key)); addToast('Aura has been reset.', 'success'); setTimeout(() => window.location.reload(), 500); } catch (e) { console.error("Failed to clear memory:", e); addToast('Failed to clear memory.', 'error'); }
        }
    }, [addToast]);
    const handleExportState = useCallback(() => {
        try { const stateData: Record<string, any> = {}; ALL_AURA_KEYS.forEach(key => { const item = localStorage.getItem(key); if (item) stateData[key] = JSON.parse(item); }); const blob = new Blob([JSON.stringify(stateData, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `aura_snapshot_${new Date().toISOString()}.json`; a.click(); URL.revokeObjectURL(url); addToast('State exported successfully.', 'success');
        } catch (e) { console.error("Failed to export state:", e); addToast('Failed to export state.', 'error'); }
    }, [addToast]);
    const handleImportState = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader();
        reader.onload = (e) => {
            try { const text = e.target?.result; if (typeof text !== 'string') throw new Error("Invalid file content"); const stateData = JSON.parse(text); if (window.confirm("Importing this file will overwrite Aura's current state. Proceed?")) { Object.keys(stateData).forEach(key => { if (ALL_AURA_KEYS.includes(key)) localStorage.setItem(key, JSON.stringify(stateData[key])); }); addToast('State imported successfully. Reloading...', 'success'); setTimeout(() => window.location.reload(), 1000); }
            } catch (err) { console.error("Failed to import state:", err); addToast('Failed to import state. File may be corrupt.', 'error'); }
        };
        reader.readAsText(file);
    }, [addToast]);
    const handleRollback = useCallback((snapshotId: string) => {
        const snapshot = state.systemSnapshots.find(s => s.id === snapshotId);
        if (snapshot && snapshot.state && window.confirm(`Rollback to snapshot from ${new Date(snapshot.timestamp).toLocaleString()}? This is irreversible.`)) {
            dispatch({ type: 'ROLLBACK_STATE', payload: snapshot.state });
            addToast('System state rolled back.', 'success');
        } else { addToast('Rollback failed: Snapshot not found or invalid.', 'error'); }
    }, [state.systemSnapshots, dispatch, addToast]);

    return {
        currentCommand, setCurrentCommand, attachedFile, setAttachedFile, processingState, setProcessingState, showIngest, setShowIngest,
        causalChainLog, setCausalChainLog, showForecast, setShowForecast, selectedGainLog, setSelectedGainLog, proposalToReview, setProposalToReview,
        showWhatIfModal, setShowWhatIfModal, showSearchModal, setShowSearchModal, isPaused, activeLeftTab, setActiveLeftTab, showStrategicGoalModal, setShowStrategicGoalModal,
        isRecording, setIsRecording,
        outputPanelRef, importInputRef, fileInputRef, isVisualAnalysisActive, setIsVisualAnalysisActive, videoRef, analysisIntervalRef,
        handleRemoveAttachment, handleFileChange, handleTogglePause, handleClearMemory, handleExportState, handleImportState, handleRollback,
    };
};