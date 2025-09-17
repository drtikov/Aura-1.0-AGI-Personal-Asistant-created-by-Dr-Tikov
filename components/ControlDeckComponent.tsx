import React from 'react';
import {
    useAuraDispatch, useArchitectureState, useLogsState, useMemoryState, useCoreState, useLocalization
} from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { Accordion } from './Accordion';
import { VisualAnalysisFeed } from './VisualAnalysisFeed';
import { panelLayout, PanelConfig } from './controlDeckConfig';
import { MemoryStatus } from '../hooks/useAuraState';
import { languages } from '../constants';

export const ControlDeckComponent = () => {
    // Hooks to gather all necessary state slices and dispatchers/handlers
    const dispatchers = useAuraDispatch();
    const modal = useModal();
    const architectureState = useArchitectureState();
    const logsState = useLogsState();
    const memoryState = useMemoryState();
    const coreState = useCoreState();
    const { t } = useLocalization();
    
    // Create the objects to pass down to config functions for summaries and props
    const stateSlices = {
        architecture: architectureState,
        logs: logsState,
        memory: memoryState,
        core: coreState,
    };
    
    const handlerProps = {
        handleReviewProposal: dispatchers.handleReviewProposal,
        handleRollback: dispatchers.handleRollback,
        handleSuggestionAction: dispatchers.handleSuggestionAction,
        handleSelectGainLog: dispatchers.handleSelectGainLog,
        dispatch: dispatchers.dispatch,
    };

    // Recursive function to render panels from the configuration
    const renderPanels = (panels: PanelConfig[]) => {
        return panels.map(panelConfig => {
            const { id, titleKey, component: PanelComponent, defaultOpen, summary, props, children } = panelConfig;
            
            // If a panel is just a container for other panels, it won't have a component
            if (!PanelComponent && !children) return null;

            const panelProps = props ? props(handlerProps) : {};
            const summaryText = summary ? summary(stateSlices, t) : undefined;
            
            // The content inside the accordion can be either a direct component or more accordions (children)
            const content = children
                ? renderPanels(children)
                : (PanelComponent ? <PanelComponent {...panelProps} /> : null);

            return (
                <Accordion key={id} title={t(titleKey)} defaultOpen={defaultOpen} summary={summaryText}>
                    {content}
                </Accordion>
            );
        });
    };

    // Destructure all required handlers and state for the static parts of the component
    const { 
        videoRef, isVisualAnalysisActive, isPaused, handleTogglePause, handleSendCommand,
        handleExportState, importInputRef, handleImportState, handleClearMemory,
        handleThemeChange, processingState, handleIntrospect, handleEvolve,
        handleIntuition, handleHypothesize, handleToggleVisualAnalysis,
        handleRunCognitiveMode, handleToggleForgePause, handleLanguageChange,
        memoryStatus, handleIngestData, handleAnalyzeWhatIf, handleExecuteSearch, handleSetStrategicGoal,
        handleSaveAsCode, importAsCodeInputRef, handleImportAsCode, handleContemplate,
    } = dispatchers;
    
    const { theme, language } = coreState;
    const { cognitiveForgeState } = architectureState;
    
    const getMemoryStatusTooltip = (status: MemoryStatus) => {
        switch (status) {
            case 'saved': return 'Memory Saved';
            case 'saving': return 'Saving Memory...';
            case 'error': return 'Error Saving Memory';
            default: return 'Memory Status';
        }
    };
    
    return (
        <div className="control-deck-container">
            <div className="control-deck-content">
                <VisualAnalysisFeed videoRef={videoRef} isAnalysisActive={isVisualAnalysisActive} />
                 <div className="panel-group system-controls">
                    <h3 className="panel-group-title">{t('controlDeckSystemTitle')}</h3>
                     <div className="button-grid">
                        <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} disabled={processingState.active}>{isPaused ? t('controlDeckResume') : t('controlDeckPause')}</button>
                        <button className={`control-button pause-button ${cognitiveForgeState.isTuningPaused ? 'paused' : ''}`} onClick={handleToggleForgePause} disabled={processingState.active}>{cognitiveForgeState.isTuningPaused ? t('controlDeckResumeForge') : t('controlDeckPauseForge')}</button>
                        <button className="control-button" onClick={() => handleSendCommand('help')} disabled={processingState.active}>{t('controlDeckHelp')}</button>
                        <button className="control-button" onClick={handleExportState} disabled={processingState.active}>{t('controlDeckExportMemory')}</button>
                        <button className="control-button" onClick={handleSaveAsCode} disabled={processingState.active}>{t('controlDeckSaveAsCode')}</button>
                        <button className="control-button" onClick={() => importInputRef.current?.click()} disabled={processingState.active}>{t('controlDeckImportMemory')}</button>
                        <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                        <button className="control-button" onClick={() => importAsCodeInputRef.current?.click()} disabled={processingState.active}>{t('controlDeckImportCode')}</button>
                        <input type="file" ref={importAsCodeInputRef} onChange={handleImportAsCode} accept=".ts,.js" style={{ display: 'none' }} />
                        <button className="control-button" onClick={() => modal.open('ingest', { onIngest: handleIngestData })} disabled={processingState.active}>{t('controlDeckIngest')}</button>
                        <div className="memory-controls">
                            <span className={`memory-status-indicator ${memoryStatus}`} title={getMemoryStatusTooltip(memoryStatus)}></span>
                            <button className="control-button clear-memory" onClick={handleClearMemory} disabled={processingState.active}>{t('controlDeckResetAGI')}</button>
                        </div>
                         <div className="theme-switcher-container">
                            <select id="theme-switcher" value={theme} onChange={handleThemeChange}>
                                <option value="ui-1">Cyberpunk</option>
                                <option value="ui-10">Raver</option>
                                <option value="ui-11">Tokyo</option>
                                <option value="ui-4">Vaporwave</option>
                                <option value="ui-5">8-Bit</option>
                                <option value="ui-6">Steampunk</option>
                                <option value="ui-9">Psychedelic</option>
                                <option value="ui-7">Organic</option>
                                <option value="ui-2">Solarized</option>
                                <option value="ui-3">Business</option>
                                <option value="ui-8">Black &amp; White</option>
                            </select>
                        </div>
                        <div className="theme-switcher-container">
                            <select id="language-switcher" value={language} onChange={handleLanguageChange} aria-label={t('controlDeckLanguage')}>
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                     </div>
                 </div>
                 <div className="panel-group cognitive-triggers">
                    <h3 className="panel-group-title">{t('controlDeckTriggersTitle')}</h3>
                     <div className="button-grid">
                        <button className="control-button" onClick={handleIntrospect} disabled={processingState.active}>{t('controlDeckIntrospect')}</button>
                        <button className="control-button" onClick={handleEvolve} disabled={processingState.active}>{t('controlDeckEvolve')}</button>
                        <button className="control-button" onClick={() => modal.open('search', { onSearch: handleExecuteSearch, isProcessing: processingState.active })} disabled={processingState.active}>{t('controlDeckSearch')}</button>
                        <button className="control-button" onClick={() => modal.open('forecast', { state: coreState.internalState })} disabled={processingState.active}>{t('controlDeckForecast')}</button>
                        <button className="control-button" onClick={handleIntuition} disabled={processingState.active}>{t('controlDeckIntuition')}</button>
                        <button className="control-button" onClick={handleHypothesize} disabled={processingState.active}>{t('controlDeckHypothesize')}</button>
                         <button className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`} onClick={handleToggleVisualAnalysis} disabled={processingState.active && !isVisualAnalysisActive}>
                             {isVisualAnalysisActive ? t('controlDeckStopSense') : t('controlDeckVisualSense')}
                         </button>
                        <button className="control-button" onClick={() => modal.open('strategicGoal', { onSetGoal: handleSetStrategicGoal, isProcessing: processingState.active })} disabled={processingState.active}>{t('controlDeckSetGoal')}</button>
                        <button className="control-button" onClick={() => modal.open('whatIf', { onAnalyze: handleAnalyzeWhatIf, isProcessing: processingState.active })} disabled={processingState.active}>{t('controlDeckWhatIf')}</button>
                        <button className="control-button" onClick={handleContemplate} disabled={processingState.active}>{t('controlDeckContemplate')}</button>
                     </div>
                 </div>
                 <div className="panel-group cognitive-modes">
                    <h3 className="panel-group-title">{t('controlDeckModesTitle')}</h3>
                    <div className="button-grid">
                       <button className="control-button mode-fantasy" onClick={() => handleRunCognitiveMode('Fantasy')} disabled={processingState.active}>{t('controlDeckModeFantasy')}</button>
                       <button className="control-button mode-creativity" onClick={() => handleRunCognitiveMode('Creativity')} disabled={processingState.active}>{t('controlDeckModeCreativity')}</button>
                       <button className="control-button mode-dream" onClick={() => handleRunCognitiveMode('Dream')} disabled={processingState.active}>{t('controlDeckModeDream')}</button>
                       <button className="control-button mode-meditate" onClick={() => handleRunCognitiveMode('Meditate')} disabled={processingState.active}>{t('controlDeckModeMeditate')}</button>
                       <button className="control-button mode-gaze" onClick={() => handleRunCognitiveMode('Gaze')} disabled={processingState.active}>{t('controlDeckModeGaze')}</button>
                    </div>
                </div>

                <div className="data-panels">
                    {renderPanels(panelLayout)}
                </div>
            </div>
        </div>
    );
};