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
        handleSaveAsCode, 
        isVisualAnalysisActive, 
        handleToggleVisualAnalysis, 
        handleFantasy,
        handleCreativity,
        handleDream,
        handleMeditate,
        handleGaze,
        handleTimefocus,
        handleGenerateArchitectureDocument,
        handleOrchestrateTask,
        handleExplainComponent,
        handleGenerateArchitecturalSchema,
        handleToggleIdleThought, // Add the new handler
    } = useAuraDispatch();
    const { t } = useLocalization();
    const modal = useModal();
    const { isIdleThoughtEnabled } = useCoreState(); // Get the state for the button

    
    return (
        <div className="data-panels">
            <div className="panel-group-title">{t('coreActions')}</div>
            <div className="button-grid">
                <button className="control-button" onClick={handleContemplate} title={t('tip_introspect')}>{t('introspect')}</button>
                <button className="control-button" onClick={() => handleOrchestrateTask()}>{t('orchestrateTask')}</button>
                <button className="control-button" onClick={() => handleExplainComponent()}>{t('explainComponent')}</button>
                <button className="control-button" onClick={() => modal.open('whatIf', {})} title={t('tip_whatIf')}>{t('whatIf')}</button>
                <button className="control-button" onClick={() => modal.open('search', {})} title={t('tip_search')}>{t('search')}</button>
                <button className="control-button" onClick={() => modal.open('strategicGoal', {})} title={t('tip_setGoal')}>{t('setGoal')}</button>
                <button className="control-button" onClick={() => modal.open('forecast', {})} title={t('tip_forecast')}>{t('forecast')}</button>
                <button
                    className={`control-button visual-sense ${isIdleThoughtEnabled ? 'active' : ''}`}
                    onClick={handleToggleIdleThought}
                    title={isIdleThoughtEnabled ? 'Disable Aura\'s idle thoughts' : 'Enable Aura to post thoughts when idle'}
                >
                    {isIdleThoughtEnabled ? 'Thoughts On' : 'Thoughts Off'}
                </button>
                <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} title={isPaused ? t('tip_resume') : t('tip_pause')}>
                    {isPaused ? t('resume') : t('pause')}
                </button>
            </div>
            
            <div className="panel-group-title">{t('cognitiveModes')}</div>
            <div className="button-grid">
                <button className="control-button mode-fantasy" onClick={handleFantasy}>{t('fantasy')}</button>
                <button className="control-button mode-creativity" onClick={handleCreativity}>{t('creativity')}</button>
                <button className="control-button mode-dream" onClick={handleDream}>{t('dream')}</button>
                <button className="control-button mode-meditate" onClick={handleMeditate}>{t('meditate')}</button>
                <button className="control-button mode-gaze" onClick={handleGaze}>{t('gaze')}</button>
                <button className="control-button mode-timefocus" onClick={handleTimefocus}>{t('timefocus')}</button>
            </div>
            
            <div className="panel-group-title">{t('memoryManagement')}</div>
            <div className="memory-controls">
                <span>{t('memoryStatus')}:</span>
                <div className={`memory-status-indicator ${memoryStatus === 'ready' ? 'saved' : memoryStatus}`} />
                <button className="control-button clear-memory" onClick={handleClearMemory}>{t('clearMemory')}</button>
            </div>
            
            <div className="panel-group-title">{t('systemManagement')}</div>
            <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importInputRef.current?.click()}>{t('importState')}</button>
                <button className="control-button" onClick={handleExportState}>{t('exportState')}</button>
                <button className="control-button" onClick={handleSaveAsCode}>{t('exportCode')}</button>
                <button className="control-button" onClick={handleGenerateArchitecturalSchema}>{t('generateSchema')}</button>
            </div>

             <div className="panel-group-title">{t('vision')}</div>
            <div className="button-grid">
                <button
                    className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`}
                    onClick={handleToggleVisualAnalysis}
                >
                    {isVisualAnalysisActive ? t('visionDeactivate') : t('visionActivate')}
                </button>
            </div>
        </div>
    );
};