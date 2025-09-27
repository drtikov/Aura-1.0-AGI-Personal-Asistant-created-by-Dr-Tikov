// components/ManualControlPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';

export const ManualControlPanel = () => {
    const { 
        state,
        dispatch,
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
        handleSatori, 
        handleEvolveFromInsight,
        addToast
    } = useAuraDispatch();
    const { gankyilInsights } = useCoreState();
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

    return (
        <div className="data-panels">
            <div className="panel-group-title">{t('title_coreActions')}</div>
            <div className="button-grid">
                <button className="control-button" onClick={handleContemplate} title={t('tip_introspect')}>{t('btn_introspect')}</button>
                <button className="control-button" onClick={() => addToast('Supervisor cycle manually triggered.', 'info')} title={t('tip_supervisor')}>{t('btn_supervisor')}</button>
                <button className="control-button" onClick={() => modal.open('whatIf', {})} title={t('tip_whatIf')}>{t('btn_whatIf')}</button>
                <button className="control-button" onClick={() => modal.open('search', {})} title={t('tip_search')}>{t('btn_search')}</button>
                <button className="control-button" onClick={() => modal.open('strategicGoal', {})} title={t('tip_setGoal')}>{t('btn_setGoal')}</button>
                <button className="control-button" onClick={() => modal.open('forecast', {})} title={t('tip_forecast')}>{t('tip_forecast')}</button>
                <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} title={isPaused ? t('tip_resume') : t('tip_pause')}>
                    {isPaused ? t('btn_resume') : t('btn_pause')}
                </button>
            </div>
            
            <div className="panel-group-title">{t('title_cognitiveModes')}</div>
            <div className="button-grid">
                <button className="control-button mode-fantasy" onClick={() => handleSetCognitiveMode('Fantasy')}>{t('btn_fantasy')}</button>
                <button className="control-button mode-creativity" onClick={() => handleSetCognitiveMode('Creativity')}>{t('btn_creativity')}</button>
                <button className="control-button mode-dream" onClick={() => handleSetCognitiveMode('Dream')}>{t('btn_dream')}</button>
                <button className="control-button mode-meditate" onClick={() => handleSetCognitiveMode('Meditate')}>{t('btn_meditate')}</button>
                <button className="control-button mode-gaze" onClick={() => handleSetCognitiveMode('Gaze')}>{t('btn_gaze')}</button>
                <button className="control-button mode-timefocus" onClick={() => handleSetCognitiveMode('Temporal Focus')}>{t('btn_timefocus')}</button>
            </div>

            <div className="panel-group-title">{t('title_specialModes')}</div>
            <div className="button-grid">
                 <button className={`control-button mode-trip ${state.psychedelicIntegrationState.isActive ? 'active' : ''}`} onClick={handleTrip}>{t('btn_trip')}</button>
                 <button className={`control-button mode-satori ${state.satoriState.isActive ? 'active' : ''}`} onClick={handleSatori} title={t('tip_satori')}>{t('btn_satori')}</button>
                 <button className={`control-button mode-insight ${unprocessedInsightsCount > 0 ? 'has-new-insight' : ''}`} onClick={handleEvolveFromInsight} title={t('tip_insight')} disabled={unprocessedInsightsCount === 0}>{t('btn_insight')}</button>
                 <button className="control-button mode-psi" onClick={() => modal.open('multiverseBranching', {})} title={t('tip_branch')}>{t('btn_branch')}</button>
                 <button className="control-button" onClick={() => modal.open('brainstorm', {})} title={t('tip_brainstorm')}>{t('btn_brainstorm')}</button>
            </div>
            
            <div className="panel-group-title">{t('title_memoryManagement')}</div>
            <div className="memory-controls">
                <span>{t('memoryStatus')}:</span>
                <div className={`memory-status-indicator ${memoryStatus === 'ready' ? 'saved' : memoryStatus}`} />
                <button className="control-button clear-memory" onClick={handleClearMemory}>{t('btn_clearMemory')}</button>
            </div>
            
            <div className="panel-group-title">{t('title_systemManagement')}</div>
            <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importInputRef.current?.click()}>{t('btn_importState')}</button>
                <button className="control-button" onClick={handleExportState}>{t('btn_exportState')}</button>
                <input type="file" ref={importAsCodeInputRef} onChange={handleImportAsCode} accept=".ts,.js" style={{ display: 'none' }} />
                <button className="control-button" onClick={() => importAsCodeInputRef.current?.click()}>{t('btn_importCode')}</button>
                <button className="control-button" onClick={handleSaveAsCode}>{t('btn_exportCode')}</button>
            </div>

             <div className="panel-group-title">{t('title_vision')}</div>
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