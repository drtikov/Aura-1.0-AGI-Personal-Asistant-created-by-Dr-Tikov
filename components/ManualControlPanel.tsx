// components/ManualControlPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';

export const ManualControlPanel = () => {
    const { 
        memoryStatus, 
        isPaused, 
        handleTogglePause, 
        handleContemplate, 
        handleClearMemory, 
        importInputRef, 
        handleImportState, 
        handleExportState, 
        importAsCodeInputRef, 
        handleImportAsCode, 
        handleSaveAsCode, 
        isVisualAnalysisActive, 
        handleToggleVisualAnalysis, 
        handleTrip, 
        handleVisions,
        handleSatori, 
        handleEvolveFromInsight,
        addToast,
        dispatch,
        handleStartDocumentForge
    } = useAuraDispatch();
    const { gankyilInsights, psychedelicIntegrationState, satoriState } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();

    const handleSetCognitiveMode = (mode: string) => {
        dispatch({
            type: 'SYSCALL',
            payload: {
                call: 'ADD_COMMAND_LOG',
                args: { text: `Cognitive mode set to ${mode}.`, type: 'info' }
            }
        });
        addToast(`Cognitive mode set to ${mode}.`, 'info');
    };
    
    const unprocessedInsightsCount = gankyilInsights.insights.filter(i => !i.isProcessedForEvolution).length;
    
    const generateArchitectureDocument = () => {
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
    *   **The Temporal Engine:** Detail the roles of the Chronicler (Past), Oracle (Future), and Reactor (Present) clusters in processing user requests. *Please provide a text-based flowchart diagram illustrating this process from user input to final output.*
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
    };

    return (
        <div className="data-panels">
            <div className="panel-group-title">{t('coreActions')}</div>
            <div className="button-grid">
                <button className="control-button" onClick={handleContemplate} title={t('tip_introspect')}>{t('btn_introspect')}</button>
                <button className="control-button" onClick={() => modal.open('documentForge', {})} title={t('tip_documentForge')}>{t('btn_documentForge')}</button>
                <button className="control-button" onClick={generateArchitectureDocument} title={t('tip_generateArchDoc')}>{t('btn_generateArchDoc')}</button>
                <button className="control-button" onClick={() => modal.open('whatIf', {})} title={t('tip_whatIf')}>{t('btn_whatIf')}</button>
                <button className="control-button" onClick={() => modal.open('search', {})} title={t('tip_search')}>{t('btn_search')}</button>
                <button className="control-button" onClick={() => modal.open('strategicGoal', {})} title={t('tip_setGoal')}>{t('btn_setGoal')}</button>
                <button className="control-button" onClick={() => modal.open('forecast', {})} title={t('tip_forecast')}>{t('btn_forecast')}</button>
                <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} title={isPaused ? t('tip_resume') : t('tip_pause')}>
                    {isPaused ? t('btn_resume') : t('btn_pause')}
                </button>
            </div>
            
            <div className="panel-group-title">{t('cognitiveModes')}</div>
            <div className="button-grid">
                <button className="control-button mode-fantasy" onClick={() => handleSetCognitiveMode('Fantasy')}>{t('btn_fantasy')}</button>
                <button className="control-button mode-creativity" onClick={() => handleSetCognitiveMode('Creativity')}>{t('btn_creativity')}</button>
                <button className="control-button mode-dream" onClick={() => handleSetCognitiveMode('Dream')}>{t('btn_dream')}</button>
                <button className="control-button mode-meditate" onClick={() => handleSetCognitiveMode('Meditate')}>{t('btn_meditate')}</button>
                <button className="control-button mode-gaze" onClick={() => handleSetCognitiveMode('Gaze')}>{t('btn_gaze')}</button>
                <button className="control-button mode-timefocus" onClick={() => handleSetCognitiveMode('Temporal Focus')}>{t('btn_timefocus')}</button>
            </div>

            <div className="panel-group-title">{t('specialModes')}</div>
            <div className="button-grid">
                 <button className={`control-button mode-trip ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'trip' ? 'active' : ''}`} onClick={handleTrip} title={t('tip_trip')}>{t('btn_trip')}</button>
                 <button className={`control-button mode-visions ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'visions' ? 'active' : ''}`} onClick={handleVisions} title={t('tip_visions')}>{t('btn_visions')}</button>
                 <button className={`control-button mode-satori ${satoriState.isActive ? 'active' : ''}`} onClick={handleSatori} title={t('tip_satori')}>{t('btn_satori')}</button>
                 <button className={`control-button mode-insight ${unprocessedInsightsCount > 0 ? 'has-new-insight' : ''}`} onClick={handleEvolveFromInsight} title={t('tip_insight')} disabled={unprocessedInsightsCount === 0}>{t('btn_insight')}</button>
                 <button className="control-button mode-psi" onClick={() => modal.open('multiverseBranching', {})} title={t('tip_branch')}>{t('btn_branch')}</button>
                 <button className="control-button" onClick={() => modal.open('brainstorm', {})} title={t('tip_brainstorm')}>{t('btn_brainstorm')}</button>
            </div>
            
            <div className="panel-group-title">{t('memoryManagement')}</div>
            <div className="memory-controls">
                <span>{t('memoryStatus')}:</span>
                <div className={`memory-status-indicator ${memoryStatus === 'ready' ? 'saved' : memoryStatus}`} />
                <button className="control-button clear-memory" onClick={handleClearMemory}>{t('btn_clearMemory')}</button>
            </div>
            
            <div className="panel-group-title">{t('systemManagement')}</div>
            <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importInputRef.current?.click()}>{t('btn_importState')}</button>
                <button className="control-button" onClick={handleExportState}>{t('btn_exportState')}</button>
                <input type="file" ref={importAsCodeInputRef} onChange={handleImportAsCode} accept=".ts,.js" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importAsCodeInputRef.current?.click()}>{t('btn_importCode')}</button>
                <button className="control-button" onClick={handleSaveAsCode}>{t('btn_exportCode')}</button>
            </div>

             <div className="panel-group-title">{t('vision')}</div>
            <div className="button-grid">
                <button
                    className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`}
                    onClick={handleToggleVisualAnalysis}
                >
                    {isVisualAnalysisActive ? t('btn_visionDeactivate') : t('btn_visionActivate')}
                </button>
            </div>
        </div>
    );
};