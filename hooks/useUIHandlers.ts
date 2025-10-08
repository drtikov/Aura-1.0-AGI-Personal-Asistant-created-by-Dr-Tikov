import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// FIX: Added ToastType to import to resolve module error.
import { AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal, SelfProgrammingCandidate } from '../types';
import { migrateState } from '../state/migrations';
import { CURRENT_STATE_VERSION } from '../constants';
import { HAL } from '../core/hal';
import { UseGeminiAPIResult } from './useGeminiAPI';

type SyscallFn = (call: SyscallCall, args: any) => void;

// FIX: Corrected the return type of the `t` function from `void` to `string`.
export const useUIHandlers = (state: AuraState, dispatch: React.Dispatch<Action>, syscall: SyscallFn, addToast: (msg: string, type?: ToastType) => void, t: (key: string, options?: any) => string, clearMemoryAndState: () => Promise<void>, geminiAPI: UseGeminiAPIResult) => {
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
                await clearMemoryAndState();
                addToast(t('toastResetSuccess'), 'success');
                setTimeout(() => HAL.System.reload(), 500); // Reload to ensure a clean start
            } catch (e) {
                console.error("Failed to clear memory:", e);
                addToast(t('toastResetFailed'), 'error');
            }
        }
    }, [addToast, t, clearMemoryAndState]);

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
    }, [dispatch, addToast, t]);

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


    // FIX: Added missing handlers that are used by various modals.
    const approveProposal = useCallback((proposal: ArchitecturalChangeProposal) => {
        const snapshotId = `pre_apply_${proposal.id}`;
        const modLogId = `mod_log_${self.crypto.randomUUID()}`;
        syscall('APPLY_ARCH_PROPOSAL', { proposal, snapshotId, modLogId, isAutonomous: false });
        addToast(t('toast_proposalApproved', { action: proposal.action, target: proposal.target }), 'success');
        
        const reportText = `**User-Approved Evolution**

- **Timestamp**: ${new Date().toLocaleString()}
- **Change**: Architectural Modification
- **Action**: ${proposal.action.replace(/_/g, ' ')}
- **Target**: \`${Array.isArray(proposal.target) ? proposal.target.join(', ') : proposal.target}\`
- **Description**: ${proposal.reasoning}`;
        
        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: reportText });

    }, [syscall, addToast, t]);

    const rejectProposal = useCallback((id: string) => {
        syscall('OA/UPDATE_PROPOSAL', { id, updates: { status: 'rejected' } });
        addToast(t('toast_proposalRejected'), 'info');
    }, [syscall, addToast, t]);

    const handleWhatIf = useCallback(async (scenario: string) => {
        setProcessingState({ active: true, stage: 'whatIf' });
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: `What if: "${scenario}"` });
        try {
            const result = await geminiAPI.analyzeWhatIfScenario(scenario);
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: result });
        } catch (e) {
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[Simulation Failed: ${(e as Error).message}]` });
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [syscall, geminiAPI, setProcessingState]);

    const handleSearch = useCallback(async (query: string) => {
        setProcessingState({ active: true, stage: 'search' });
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: `Search for: "${query}"` });
        try {
            const { summary, sources } = await geminiAPI.performWebSearch(query);
            const formattedSources = sources.map((s: any) => ({
                title: s.web?.title || 'Unknown Source',
                uri: s.web?.uri || '#',
            }));
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: summary, sources: formattedSources });
        } catch (e) {
            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[Web Search Failed: ${(e as Error).message}]` });
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [syscall, geminiAPI, setProcessingState]);

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

    const handleBrainstorm = useCallback(async (topic: string) => {
        setProcessingState({ active: true, stage: t('brainstorm_processing') });
        const proposal = await geminiAPI.runBrainstormingSession(topic);
        if (proposal) {
            syscall('OA/ADD_PROPOSAL', proposal);
        }
        setProcessingState({ active: false, stage: '' });
    }, [syscall, geminiAPI, setProcessingState, t]);

    const handleSetTelos = useCallback((telos: string) => {
        syscall('SET_TELOS', telos);
        addToast('Core Telos has been updated.', 'success');
    }, [syscall, addToast]);

    const handleStartDocumentForge = useCallback(async (goal: string) => {
        syscall('DOCUMENT_FORGE/START_PROJECT', { goal });

        try {
            const outline = await geminiAPI.generateDocumentOutline(goal);
            if (!outline) {
                throw new Error("Outline generation failed.");
            }
            syscall('DOCUMENT_FORGE/SET_OUTLINE', { outline });

            for (const chapter of outline.chapters) {
                syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { isGenerating: true } });
                const contentJson = await geminiAPI.generateChapterContent(outline.title, chapter.title, goal);
                
                try {
                    const result = JSON.parse(contentJson || '{}');
                    const chapterContent = result.content;
                    const diagramDescription = result.diagramDescription;

                    syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { content: chapterContent || "[Content generation failed]", isGenerating: false } });

                    if (diagramDescription) {
                        syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: diagramDescription, isGenerating: true, imageUrl: null } } });
                        const imageUrls = await geminiAPI.generateImage(diagramDescription, '', '16:9', 'blueprint', 1, null, false, '', 0.5, 50, 'none', 'none', 'none', 'none', 'none', false, {});
                        if (imageUrls && imageUrls.length > 0) {
                            syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: diagramDescription, isGenerating: false, imageUrl: imageUrls[0] } } });
                        } else {
                             syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: diagramDescription, isGenerating: false, imageUrl: null } } });
                        }
                    }

                } catch (parseError) {
                    console.error("Failed to parse chapter content JSON:", parseError);
                    // If JSON parsing fails, use the raw text as content
                    syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { content: contentJson || "[Content generation failed]", isGenerating: false } });
                }
            }

            syscall('DOCUMENT_FORGE/FINALIZE_PROJECT', {});

        } catch (error) {
            console.error("Document forge process failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            syscall('DOCUMENT_FORGE/SET_STATUS', { status: 'error', message: errorMessage });
        }
    }, [syscall, geminiAPI]);

    const handlePoseQuestion = useCallback((question: string) => {
        syscall('ADD_KNOWN_UNKNOWN', {
            id: `ku_${self.crypto.randomUUID()}`,
            question,
            priority: 0.9, // High priority for user-posed questions
            status: 'unexplored',
        });
        addToast(t('toast_questionPosed'), 'success');
    }, [syscall, addToast, t]);

    const handleStartSandboxSprint = useCallback(async (goal: string) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'SANDBOX/START_SPRINT', args: { goal } } });
        
        try {
            const log = (message: string) => dispatch({ type: 'SYSCALL', payload: { call: 'SANDBOX/LOG_STEP', args: message } });
    
            log("Initializing sandbox environment...");
            log(`Analyzing performance vectors for goal: '${goal}'`);
            
            const fileList = Object.keys(state.selfProgrammingState.virtualFileSystem);
            const targetFile = await geminiAPI.suggestFileForRefactoring(goal, fileList);
    
            if (!targetFile || !fileList.includes(targetFile)) {
                throw new Error(`AI could not suggest a valid target file for the goal.`);
            }
            log(`Target file identified for modification: ${targetFile}`);
    
            const originalCode = state.selfProgrammingState.virtualFileSystem[targetFile];
            
            log(`Generating mutation candidate for ${targetFile}...`);
            const persona = state.personaState.registry.find(p => p.id === 'elon_musk');
            if (!persona) throw new Error("Could not find pragmatic persona for sandbox sprint.");
            
            const candidate = await geminiAPI.generateSelfProgrammingModification(goal, targetFile, originalCode, persona.systemInstruction);
            
            if (!candidate) {
                throw new Error("Failed to generate a valid code modification candidate.");
            }
            log(`Candidate ${candidate.id.slice(-8)} generated. Simulating in Metis Sandbox...`);
            
            const testResults = await geminiAPI.testSelfProgrammingCandidate(candidate, originalCode);
            
            log(`Simulation complete. Compiling results...`);
    
            const performanceGains = [
                { metric: 'AI Quality Analysis', change: testResults.qualityAnalysis },
                { metric: 'AI Bug Analysis', change: testResults.potentialBugs },
                { metric: 'AI Overall Assessment', change: testResults.overallAssessment },
                { metric: 'AI Overall Score', change: testResults.overallScore.toFixed(3) },
            ];
            
            const finalResult = {
                originalGoal: goal,
                performanceGains,
                diff: {
                    filePath: targetFile,
                    before: originalCode,
                    after: candidate.codeSnippet,
                },
            };
    
            dispatch({ type: 'SYSCALL', payload: { call: 'SANDBOX/COMPLETE_SPRINT', args: finalResult } });
    
        } catch (error) {
            const errorMessage = (error as Error).message;
            dispatch({ type: 'SYSCALL', payload: { call: 'SANDBOX/LOG_STEP', args: `ERROR: ${errorMessage}` } });
            setTimeout(() => {
                dispatch({ type: 'SYSCALL', payload: { call: 'SANDBOX/RESET', args: {} } });
            }, 5000);
            addToast(`Sandbox sprint failed: ${errorMessage}`, 'error');
        }
    }, [dispatch, state.selfProgrammingState.virtualFileSystem, state.personaState.registry, geminiAPI, addToast]);


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
        handleSetTelos,
        handleStartDocumentForge,
        handlePoseQuestion,
        handleStartSandboxSprint,
    };
};