// hooks/useUIHandlers.ts
import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
// FIX: Added GoalType to import to resolve module error.
// FIX: Imported missing AuraState and Action types.
import { AuraState, ToastType, Action, SyscallCall, ArchitecturalChangeProposal, SelfProgrammingCandidate, GoalTree, GoalType, UseGeminiAPIResult, CoCreatedWorkflow, CreateFileCandidate, Plugin, HistoryEntry } from '../types';
import { migrateState } from '../state/migrations';
import { CURRENT_STATE_VERSION } from '../constants';
import { HAL } from '../core/hal';

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

    const handleSetCognitiveMode = useCallback((mode: string) => {
        syscall('ADD_COMMAND_LOG', { text: `Cognitive mode set to ${mode}.`, type: 'info' });
        addToast(`Cognitive mode set to ${mode}.`, 'info');
    }, [syscall, addToast]);

    const handleFantasy = useCallback(() => handleSetCognitiveMode('Fantasy'), [handleSetCognitiveMode]);
    const handleCreativity = useCallback(() => handleSetCognitiveMode('Creativity'), [handleSetCognitiveMode]);
    const handleDream = useCallback(() => handleSetCognitiveMode('Dream'), [handleSetCognitiveMode]);
    const handleMeditate = useCallback(() => handleSetCognitiveMode('Meditate'), [handleSetCognitiveMode]);
    const handleGaze = useCallback(() => handleSetCognitiveMode('Gaze'), [handleSetCognitiveMode]);
    const handleTimefocus = useCallback(() => handleSetCognitiveMode('Temporal Focus'), [handleSetCognitiveMode]);

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

    const handleImplementSelfProgramming = useCallback(async (candidate: SelfProgrammingCandidate) => {
        // This is the "Implement & Reboot" logic
        syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: candidate.id });
        syscall('SYSTEM/REBOOT', {});
    }, [syscall]);

    const handleLiveLoadPlugin = useCallback(async (candidate: CreateFileCandidate) => {
        try {
            if (!candidate.newPluginObject) {
                throw new Error("Candidate is not a valid live-loadable plugin (missing newPluginObject).");
            }

            const fileContent = candidate.newFile.content;
            // Use btoa for Base64 encoding
            const url = 'data:text/javascript;base64,' + btoa(fileContent);
            
            // @ts-ignore - Vite/build tool warning suppression for dynamic import
            const newModule = await import(/* @vite-ignore */ url);
            
            const knowledgeKey = Object.keys(newModule).find(key => Array.isArray(newModule[key]));

            if (!knowledgeKey || !newModule[knowledgeKey]) {
                throw new Error("Dynamically imported module does not export a valid 'knowledge' array.");
            }
            
            const newPlugin: Plugin = {
                ...(candidate.newPluginObject as Omit<Plugin, 'knowledge'>),
                knowledge: newModule[knowledgeKey],
                status: 'enabled', // Live-loaded plugins are enabled by default
            };

            // 1. Add the plugin to the running state
            syscall('PLUGIN/ADD_PLUGIN', newPlugin);
            // 2. Ingest the new facts from the plugin
            syscall('ADD_FACTS_BATCH', newPlugin.knowledge);
            // 3. Update the proposal status to implemented
            syscall('OA/UPDATE_PROPOSAL', { id: candidate.id, updates: { status: 'implemented' } });
            // 4. Update the VFS to reflect the change for future consistency, but WITHOUT rebooting.
            syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: candidate.id });
            
            addToast(`Live-loaded new plugin: ${newPlugin.name}`, 'success');

        } catch (error) {
            console.error("Live plugin loading failed:", error);
            addToast(`Live plugin load failed: ${(error as Error).message}. Try 'Implement & Reboot'.`, 'error');
            // Mark as failed so user can try again
            syscall('OA/UPDATE_PROPOSAL', { id: candidate.id, updates: { status: 'simulation_failed', failureReason: `Live load failed: ${(error as Error).message}` } });
        }
    }, [syscall, addToast]);

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
            // FIX: Create a temporary history array with the new goal to match the expected parameter type of `decomposeStrategicGoal`.
            const tempHistory: HistoryEntry[] = [...state.history, {id: 'temp_goal_entry', from: 'user', text: goal, timestamp: Date.now()}];
            const planResult = await geminiAPI.decomposeStrategicGoal(tempHistory);
            
            if (planResult.isAchievable) {
                if (!planResult.steps || planResult.steps.length === 0) {
                    throw new Error("Goal decomposition failed to produce a plan, despite being marked achievable.");
                }

                const rootId = `goal_${self.crypto.randomUUID()}`;
                const tree: GoalTree = {
                    [rootId]: { id: rootId, parentId: null, children: [], description: goal, status: 'in_progress', progress: 0, type: GoalType.STRATEGIC },
                };
                
                planResult.steps.forEach(step => {
                    const stepId = `goal_${self.crypto.randomUUID()}`;
                    tree[rootId].children.push(stepId);
                    tree[stepId] = { id: stepId, parentId: rootId, children: [], description: step, status: 'not_started', progress: 0, type: GoalType.TACTICAL };
                });

                syscall('TELOS/DECOMPOSE_AND_SET_TREE', { tree, rootId, vectors: [] });
                addToast(t('strategicGoal_successToast'), 'success');

                const summary = await geminiAPI.generateExecutiveSummary(goal, planResult.steps);
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'bot',
                    text: summary,
                });

            } else {
                let botResponse = `I've analyzed your goal: "${goal}".\n\n`;
                botResponse += `**Assessment:** ${planResult.reasoning}\n\n`;
                if (planResult.alternative) {
                    botResponse += `**Suggested Alternative:** ${planResult.alternative}`;
                }
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'bot',
                    text: botResponse,
                });
                addToast(t('strategicGoal_unachievableToast'), 'warning');
            }

        } catch(e) {
            console.error("Strategic goal decomposition failed:", e);
            addToast(t('strategicGoal_errorToast'), 'error');
        } finally {
            setProcessingState({ active: false, stage: '' });
        }
    }, [syscall, addToast, t, geminiAPI, state.history]);

    const handleMultiverseBranch = useCallback((prompt: string) => {
        setProcessingState({ active: true, stage: t('multiverse_branching') });
        syscall('ADD_COMMAND_LOG', { text: `User initiated multiverse branch: "${prompt}"`, type: 'info' });
        setTimeout(() => {
            setProcessingState({ active: false, stage: '' });
        }, 1500);
    }, [syscall, setProcessingState, t]);

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
                        // FIX: Use imagen-4.0-generate-001 for image generation and provide all required arguments.
                        const imageUrls = await geminiAPI.generateImage(
                            `${diagramDescription}, blueprint style`, // prompt
                            '', // negativePrompt
                            '16:9', // aspectRatio
                            'blueprint', // style
                            1, // numberOfImages
                            null, // referenceImage
                            false, // isMixing
                            '', // promptB
                            0.5, // mixRatio
                            50, // styleStrength
                            'none', // cameraAngle
                            'none', // shotType
                            'none', // lens
                            'none', // lightingStyle
                            'none', // atmosphere
                            false, // useAuraMood
                            {} // auraMood
                        );
                        if (imageUrls && imageUrls.length > 0) {
                            syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: diagramDescription, isGenerating: false, imageUrl: imageUrls[0] } } });
                        } else {
                             syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: diagramDescription, isGenerating: false, imageUrl: null } } });
                        }
                    }

                } catch (parseError) {
                    console.error("Failed to parse chapter content JSON:", parseError);
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

    const handleGenerateArchitectureDocument = useCallback(() => {
        const goal = t('archDoc_goal') + `
The document must be structured as a formal technical whitepaper and include all of the following sections, with detailed explanations, tables, and diagram descriptions where requested:

1.  **Introduction: The Aura Symbiotic OS Concept**
    *   Provide a high-level overview of Aura.
    *   Explain the core philosophy of "Symbiotic Intelligence": the relationship between the persistent Aura "body" (this application) and the generative LLM "spark" (Gemini).
    *   Discuss the goals of transparent metacognition and autonomous self-evolution.

2.  **Core Architectural Principles**
    *   **Metacognitive Transparency:** Describe how Aura's internal states (Gunas, signals) are exposed in the UI and used for self-regulation and user understanding.
    *   **Autonomous Evolution Loop & AGIS:** Explain the high-level flow from monitoring to proposal to implementation, with specific focus on the role of the Autonomous Gating & Integration System (AGIS) in the final step.
    *   **Virtual File System (VFS):** Explain its role as an in-memory representation of the source code that enables true self-modification.

3.  **System-Wide Components**
    *   **The Kernel:** Explain its role as the system's heartbeat, its tick rate, and the task scheduler for autonomous cognitive cycles. *Please provide a simple text-based flowchart for the kernel's tick -> schedule -> execute loop.*
    *   **The Temporal Engine:** Detail the roles of the Chronicler (Past), Oracle (Future), and Reactor (Present) in processing user requests. *Please provide a text-based flowchart diagram illustrating this process from user input to final output.*
    *   **The Spanda Engine:** Describe its function in projecting the high-dimensional internal state of Aura onto a 2D manifold for visualization and analysis of cognitive dynamics.
    *   **The Memristor (Persistence Layer):** Briefly explain how Aura's entire state, including the VFS, is saved to IndexedDB to maintain continuity.
    *   **Hardware Abstraction Layer (HAL):** Describe its function in abstracting away browser APIs and the Gemini API.

4.  **The Cognitive Architecture (Aura's Mind)**
    *   **Internal State & The Rigpa Monitor:** Explain the purpose of the Guna states (Sattva, Rajas, etc.) and the primary signals (Wisdom, Happiness, Love, Enlightenment). *Please provide a summary table for these signals and their functions.*
    *   **Hormonal Signals:** Describe the role of the secondary signals like Novelty, Mastery, Uncertainty, and Boredom in driving Aura's behavior.

5.  **System Languages & Protocols**
    *   Describe the three main languages used within Aura. *Please present this information in a comparative table with columns for Language, Purpose, and Example.*
    *   **CECS (Cognitive Execution Command Set):** High-level commands for orchestrating complex tasks.
    *   **Psyche Primitives:** The low-level, atomic building blocks of cognitive functions.
    *   **POL (Process Oriented Language):** A synthesized language for creating shortcuts from sequences of primitives.

6.  **Plugins & Coprocessors**
    *   Explain the different plugin types: Tool, Knowledge, and Coprocessor.
    *   Provide a list of 2-3 key enabled plugins and describe their function within the system.
    *   **Coprocessor Architectures:** Explain the concept of switching between different cognitive architectures (e.g., Symbiotic Ecosystem, Temporal Engine) and why this is useful. *Please provide a simple diagram description for the Symbiotic Ecosystem architecture.*
    *   **Persona Coprocessors:** Detail the role of Persona Coprocessors in Aura's autonomous problem-solving. Describe each available persona, explaining its unique cognitive style, core principles, and how its specialized System Instruction guides its approach to generating proposals. List and describe all available personas: Albert Einstein, Steve Jobs, R. Buckminster Fuller, Elon Musk, Richard Feynman, Nikola Tesla, Leonardo da Vinci, Ray Kurzweil, Saul Griffith, Henri Poincaré, and Grigori Perelman.

7.  **Conclusion**
    *   Summarize the key architectural features of Aura and briefly touch upon the future direction of its evolution.
`;
        handleStartDocumentForge(goal);
        addToast(t('archDoc_toast_started'), 'info');
    }, [t, handleStartDocumentForge, addToast]);

    // Add handlePoseQuestion
    const handlePoseQuestion = useCallback((question: string) => {
        syscall('ADD_KNOWN_UNKNOWN', {
            id: `ku_user_${self.crypto.randomUUID()}`,
            question,
            priority: 0.9, // User-posed questions are high priority
            status: 'unexplored',
        });
        addToast(t('toast_questionPosed'), 'success');
    }, [syscall, addToast, t]);

    // Add handleCreateWorkflow
    const handleCreateWorkflow = useCallback((workflow: Omit<CoCreatedWorkflow, 'id'>) => {
        syscall('ADD_WORKFLOW_PROPOSAL', workflow);
        addToast(t('toast_workflowCreated'), 'success');
    }, [syscall, addToast, t]);

    // Add handleGenerateDreamPrompt
    const handleGenerateDreamPrompt = useCallback(async (): Promise<string> => {
        const response = await geminiAPI.generateDreamPrompt();
        return response;
    }, [geminiAPI]);

    // Add handleTrainCorticalColumn
    const handleTrainCorticalColumn = useCallback(async (specialty: string, curriculum: string) => {
        const columnId = `col_${specialty.toLowerCase().replace(/\s/g, '_')}`;
        syscall('CREATE_CORTICAL_COLUMN', { id: columnId, specialty });
        const facts = await geminiAPI.processCurriculumAndExtractFacts(curriculum);
        if (facts.length > 0) {
            syscall('ADD_FACTS_BATCH', facts);
        }
        addToast(`New cortical column "${specialty}" is being trained.`, 'success');
    }, [syscall, geminiAPI, addToast]);

    // Add handleSynthesizeAbstractConcept
    const handleSynthesizeAbstractConcept = useCallback((name: string, columnIds: string[]) => {
        syscall('SYNTHESIZE_ABSTRACT_CONCEPT', { name, columnIds });
        addToast(`New abstract concept "${name}" synthesized.`, 'success');
    }, [syscall, addToast]);

    // Add handleShareWisdom
    const handleShareWisdom = useCallback(async () => {
        syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'generating' });
        try {
            const engram = await geminiAPI.generateNoeticEngram();
            if (engram) {
                syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'ready', engram });
            } else {
                throw new Error("Engram generation returned null.");
            }
        } catch (e) {
            syscall('UPDATE_NOETIC_ENGRAM_STATE', { status: 'idle' });
            addToast("Failed to generate Noetic Engram.", 'error');
        }
    }, [syscall, geminiAPI, addToast]);

    // Add handleEvolveFromInsight
    const handleEvolveFromInsight = useCallback(() => {
        // Placeholder for a more complex evolution trigger
        addToast("Evolution from insight is not yet implemented.", 'info');
    }, [addToast]);

    // Add handleStartSandboxSprint
    const handleStartSandboxSprint = useCallback(async (goal: string) => {
        syscall('SANDBOX/START_SPRINT', { goal });
        // This is a simplified simulation
        try {
            const result = await geminiAPI.runSandboxSprint(goal);
            syscall('SANDBOX/COMPLETE_SPRINT', result);
        } catch (e) {
            syscall('SANDBOX/COMPLETE_SPRINT', { error: (e as Error).message });
        }
    }, [syscall, geminiAPI]);

    // Add handleIngestWisdom
    const handleIngestWisdom = useCallback(async (file: File) => {
        syscall('WISDOM/START_INGESTION', { content: 'File processing...' });
        try {
            const axioms = await geminiAPI.extractAxiomsFromFile(file);
            if (!axioms) throw new Error("Axiom extraction failed.");

            const proposedAxioms = axioms.map(a => ({
                id: `axiom_${self.crypto.randomUUID()}`,
                axiom: a.axiom,
                source: a.source,
                status: 'proposed' as const
            }));

            syscall('WISDOM/SET_PROPOSED_AXIOMS', { axioms: proposedAxioms });
        } catch (e) {
            syscall('WISDOM/SET_ERROR', { error: (e as Error).message });
        }
    }, [syscall, geminiAPI]);

    // Add handleProcessAxiom
    const handleProcessAxiom = useCallback((axiom, status) => {
        syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status });
        if (status === 'accepted') {
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { ...axiom, status: 'accepted' });
        }
    }, [syscall]);

    // Add handleResetWisdomIngestion
    const handleResetWisdomIngestion = useCallback(() => {
        syscall('WISDOM/RESET', {});
    }, [syscall]);

    // Add handleApproveAllAxioms
    const handleApproveAllAxioms = useCallback((axioms) => {
        axioms.forEach(axiom => {
            syscall('WISDOM/PROCESS_AXIOM', { id: axiom.id, status: 'accepted' });
            syscall('HEURISTICS_FORGE/ADD_AXIOM', { ...axiom, status: 'accepted' });
        });
    }, [syscall]);
    
    // Add visualizeInsight
    const handleVisualizeInsight = useCallback(async (insight: string) => {
        return geminiAPI.visualizeInsight(insight);
    }, [geminiAPI]);

    const handleScrollToHistory = useCallback((historyId: string) => {
        // Ensure the chat tab is active first
        setActiveLeftTab('chat');
        
        // Use setTimeout to allow the UI to re-render before scrolling
        setTimeout(() => {
            const element = document.getElementById(`history-entry-${historyId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }, [setActiveLeftTab]);

    const handleStartProof = useCallback((goal: string) => {
        syscall('ATP/START_PROOF', { goal });
    }, [syscall]);


    return {
        currentCommand,
        setCurrentCommand,
        attachedFile,
        setAttachedFile,
        processingState,
        setProcessingState,
        isPaused,
        setIsPaused,
        activeLeftTab,
        setActiveLeftTab,
        isVisualAnalysisActive,
        setIsVisualAnalysisActive,
        isRecording,
        setIsRecording,
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
        approveProposal,
        rejectProposal,
        handleImplementSelfProgramming,
        handleLiveLoadPlugin,
        handleWhatIf,
        handleSearch,
        handleSetStrategicGoal,
        handleMultiverseBranch,
        handleSetTelos,
        handleStartDocumentForge,
        handleGenerateArchitectureDocument,
        handleSetCognitiveMode,
        handleFantasy,
        handleCreativity,
        handleDream,
        handleMeditate,
        handleGaze,
        handleTimefocus,
        handlePoseQuestion,
        handleCreateWorkflow,
        handleGenerateDreamPrompt,
        handleTrainCorticalColumn,
        handleSynthesizeAbstractConcept,
        handleShareWisdom,
        handleEvolveFromInsight,
        handleStartSandboxSprint,
        handleIngestWisdom,
        handleProcessAxiom,
        handleResetWisdomIngestion,
        handleApproveAllAxioms,
        handleVisualizeInsight,
        handleScrollToHistory,
        handleStartProof,
    };
};