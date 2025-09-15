

import React from 'react';
import { useAura } from './hooks';
import {
    Accordion,
    ArchitecturePanel,
    CausalChainModal,
    CausalSelfModelPanel,
    CognitiveArchitecturePanel,
    CognitiveGainDetailModal,
    CognitiveGainPanel,
    CognitiveModesPanel,
    CoreMonitor,
    EthicalGovernorPanel,
    ForecastModal,
    IngenuityPanel,
    IngestPanel,
    InnerDisciplinePanel,
    IntuitionEnginePanel,
    KnowledgeGraphPanel,
    LimitationsPanel,
    MotivationPanel,
    OtherAwarenessPanel,
    ProactiveEnginePanel,
    ProposalReviewModal,
    ReflectiveInsightEnginePanel,
    ResourceMonitorPanel,
    SearchModal,
    SelfModificationPanel,
    StrategicGoalModal,
    ToastContainer,
    VisualAnalysisFeed,
    WhatIfModal,
    WorkingMemoryPanel,
} from './components';
import { HistoryEntry, PerformanceLogEntry } from './types';

export const App = () => {
    const {
        state, dispatch, toasts, removeToast, addToast,
        currentCommand, setCurrentCommand, attachedFile, processingState, showIngest, setShowIngest,
        causalChainLog, setCausalChainLog, showForecast, setShowForecast, selectedGainLog,
        proposalToReview, setProposalToReview, showWhatIfModal, setShowWhatIfModal, showSearchModal,
        setShowSearchModal, isPaused, activeLeftTab, setActiveLeftTab, showStrategicGoalModal, setShowStrategicGoalModal,
        isRecording,
        outputPanelRef, importInputRef, fileInputRef, isVisualAnalysisActive, videoRef,
        handleRemoveAttachment, handleFileChange, handleTogglePause, handleClearMemory,
        handleExportState, handleImportState, handleRollback,
        handleSendCommand, handleEvolve, handleRunCognitiveMode, handleAnalyzeWhatIf,
        handleExecuteSearch, handleHypothesize, handleIntuition,
        handleIntrospect, handleExecuteGoal, handleIngestData, handleMicClick, handleThemeChange,
        handleReviewProposal, handleApproveProposal, handleRejectProposal, handleSelectGainLog,
        handleValidateModification, handleSetStrategicGoal, handleToggleVisualAnalysis,
        handleFeedback, handleSuggestionAction,
    } = useAura();

    const handleTraceGoal = (logId: string) => {
        const log = state.performanceLogs.find((l: PerformanceLogEntry) => l.id === logId);
        if (log) {
            setCausalChainLog(log);
        } else {
            addToast('Could not find the trace log for that goal.', 'warning');
        }
    };
    
    return (
        <div className="app-container">
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <CausalChainModal log={causalChainLog} onClose={() => setCausalChainLog(null)} />
            <ForecastModal isOpen={showForecast} state={state.internalState} onClose={() => setShowForecast(false)} />
            <WhatIfModal isOpen={showWhatIfModal} onAnalyze={handleAnalyzeWhatIf} onClose={() => setShowWhatIfModal(false)} isProcessing={processingState.active} />
            <SearchModal isOpen={showSearchModal} onSearch={handleExecuteSearch} onClose={() => setShowSearchModal(false)} isProcessing={processingState.active} />
            <ProposalReviewModal 
                proposal={proposalToReview}
                onClose={() => setProposalToReview(null)}
                onApprove={handleApproveProposal}
                onReject={handleRejectProposal}
            />
            <CognitiveGainDetailModal log={selectedGainLog} onClose={() => handleSelectGainLog(null)} />
            {showIngest && <IngestPanel onIngest={handleIngestData} onCancel={() => setShowIngest(false)} />}
            <StrategicGoalModal
                isOpen={showStrategicGoalModal}
                onSetGoal={handleSetStrategicGoal}
                onClose={() => setShowStrategicGoalModal(false)}
                isProcessing={processingState.active}
            />
            
            <div className="left-column">
                <div className="left-column-tabs">
                    <button className={`tab-button ${activeLeftTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveLeftTab('chat')}>Chat</button>
                    <button className={`tab-button ${activeLeftTab === 'monitor' ? 'active' : ''}`} onClick={() => setActiveLeftTab('monitor')}>Monitor</button>
                </div>

                {activeLeftTab === 'chat' && (
                    <div className="chat-container">
                        <header className="chat-header">
                            <h1 data-text="AURA">AURA</h1>
                            <p>Symbiotic AGI assistant Created By Dr Tikov</p>
                        </header>
                        <div className="output-panel" ref={outputPanelRef}>
                            {state.history.map((entry: HistoryEntry) => (
                                <div key={entry.id} className={`history-entry from-${entry.from}`}>
                                    <div className="entry-content">
                                        <p dangerouslySetInnerHTML={{ __html: entry.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br />') }}></p>
                                        {entry.filePreview && ( <div className="file-preview"><img src={entry.filePreview} alt="File preview" /></div> )}
                                        {entry.skill && (
                                            <span className="skill-tag" title={`Skill used: ${entry.skill}`}>
                                                {entry.skill}
                                                {entry.logId && ( <button className="trace-button" onClick={() => { const log = state.performanceLogs.find((l: PerformanceLogEntry) => l.id === entry.logId); if (log) setCausalChainLog(log); }}>Trace</button> )}
                                            </span>
                                        )}
                                        {entry.from === 'bot' && (
                                            <div className="feedback-controls">
                                                <button className={`feedback-button positive ${entry.feedback === 'positive' ? 'selected' : ''}`} onClick={() => handleFeedback(entry.id, 'positive')} disabled={!!entry.feedback} title="Good response">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                                                </button>
                                                <button className={`feedback-button negative ${entry.feedback === 'negative' ? 'selected' : ''}`} onClick={() => handleFeedback(entry.id, 'negative')} disabled={!!entry.feedback} title="Bad response">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79-.44-1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {processingState.active && ( <div className="history-entry from-system"><div className="entry-content">{processingState.stage} <div className="spinner"></div></div></div> )}
                        </div>
                        <WorkingMemoryPanel memory={state.workingMemory} dispatch={dispatch} />
                        <form className="input-area" onSubmit={(e) => { e.preventDefault(); handleSendCommand(currentCommand, attachedFile?.file); }}>
                            {attachedFile && (
                                <div className="file-attachment-preview">
                                    {attachedFile.type === 'image' && <img src={attachedFile.previewUrl} alt="attachment" />}
                                    {attachedFile.type === 'audio' && <audio src={attachedFile.previewUrl} controls />}
                                    <button onClick={handleRemoveAttachment}>&times;</button>
                                </div>
                            )}
                            <div className="input-area-content">
                                <textarea value={currentCommand} onChange={(e) => setCurrentCommand(e.target.value)} placeholder="Interact with Aura..." rows={1} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendCommand(currentCommand, attachedFile?.file); } }} disabled={processingState.active} />
                                <div className="input-controls">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={processingState.active} title="Attach File"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg></button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                    <button type="button" onClick={handleMicClick} className={`mic-button ${isRecording ? 'recording' : ''}`} disabled={processingState.active} title={isRecording ? 'Stop Recording' : 'Start Recording'}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg></button>
                                    <button type="submit" disabled={processingState.active || (!currentCommand.trim() && !attachedFile)}>Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                
                {activeLeftTab === 'monitor' && ( <CoreMonitor internalState={state.internalState} metrics={state.selfAwarenessMetrics} userModel={state.userModel} internalStateHistory={state.internalStateHistory} /> )}
            </div>
            
            <div className="control-deck-container">
                <div className="control-deck-content">
                    <VisualAnalysisFeed videoRef={videoRef} isAnalysisActive={isVisualAnalysisActive} />
                     <div className="panel-group system-controls">
                        <h3 className="panel-group-title">// SYSTEM</h3>
                         <div className="button-grid">
                            <button className={`control-button pause-button ${isPaused ? 'paused' : ''}`} onClick={handleTogglePause} disabled={processingState.active}>{isPaused ? 'Resume' : 'Pause'}</button>
                            <button className="control-button" onClick={() => handleSendCommand('help')} disabled={processingState.active}>Help</button>
                            <button className="control-button" onClick={handleExportState} disabled={processingState.active}>Export</button>
                            <button className="control-button" onClick={() => importInputRef.current?.click()} disabled={processingState.active}>Import</button>
                            <input type="file" ref={importInputRef} onChange={handleImportState} accept=".json" style={{ display: 'none' }} />
                            <button className="control-button" onClick={() => setShowIngest(true)} disabled={processingState.active}>Ingest</button>
                            <button className="control-button clear-memory" onClick={handleClearMemory} disabled={processingState.active}>Reset</button>
                             <div className="theme-switcher-container">
                                <select id="theme-switcher" value={state.theme} onChange={handleThemeChange}> <option value="ui-1">Cyberpunk</option> <option value="ui-2">Solarized</option> </select>
                            </div>
                         </div>
                     </div>
                     <div className="panel-group cognitive-triggers">
                        <h3 className="panel-group-title">// COGNITIVE TRIGGERS</h3>
                         <div className="button-grid">
                            <button className="control-button" onClick={handleIntrospect} disabled={processingState.active}>Introspect</button>
                            <button className="control-button" onClick={handleEvolve} disabled={processingState.active}>Evolve</button>
                            <button className="control-button" onClick={() => setShowSearchModal(true)} disabled={processingState.active}>Search</button>
                            <button className="control-button" onClick={() => setShowForecast(true)} disabled={processingState.active}>Forecast</button>
                            <button className="control-button" onClick={handleIntuition} disabled={processingState.active}>Intuition</button>
                            <button className="control-button" onClick={handleHypothesize} disabled={processingState.active}>Hypothesize</button>
                             <button className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`} onClick={handleToggleVisualAnalysis} disabled={processingState.active && !isVisualAnalysisActive}>
                                 {isVisualAnalysisActive ? 'Stop Sense' : 'Visual Sense'}
                             </button>
                            <button className="control-button" onClick={() => setShowStrategicGoalModal(true)} disabled={processingState.active}>Set Goal</button>
                            <button className="control-button" onClick={() => setShowWhatIfModal(true)} disabled={processingState.active}>What If?</button>
                         </div>
                     </div>
                     <div className="panel-group cognitive-modes">
                        <h3 className="panel-group-title">// COGNITIVE MODES</h3>
                        <div className="button-grid">
                           <button className="control-button mode-fantasy" onClick={() => handleRunCognitiveMode('Fantasy')} disabled={processingState.active}>Fantasy</button>
                           <button className="control-button mode-creativity" onClick={() => handleRunCognitiveMode('Creativity')} disabled={processingState.active}>Creativity</button>
                           <button className="control-button mode-dream" onClick={() => handleRunCognitiveMode('Dream')} disabled={processingState.active}>Dream</button>
                           <button className="control-button mode-meditate" onClick={() => handleRunCognitiveMode('Meditate')} disabled={processingState.active}>Meditate</button>
                           <button className="control-button mode-gaze" onClick={() => handleRunCognitiveMode('Gaze')} disabled={processingState.active}>Gaze</button>
                        </div>
                    </div>

                    <div className="data-panels">
                        <Accordion title="Motivation & Goals" defaultOpen={true}><MotivationPanel drives={state.internalState.drives} goals={state.goals} onExecuteGoal={handleExecuteGoal} dispatch={dispatch} isProcessing={processingState.active} onTrace={handleTraceGoal} /></Accordion>
                        <Accordion title="Knowledge Graph"><KnowledgeGraphPanel graph={state.knowledgeGraph} dispatch={dispatch} /></Accordion>
                        <Accordion title="Proactive Engine"><ProactiveEnginePanel state={state.proactiveEngineState} onSuggestionAction={handleSuggestionAction} /></Accordion>
                        <Accordion title="Ethical Governor"><EthicalGovernorPanel state={state.ethicalGovernorState} /></Accordion>
                        <Accordion title="Causal Self-Model"><CausalSelfModelPanel model={state.causalSelfModel} /></Accordion>
                        <Accordion title="Reflective Insight Engine"><ReflectiveInsightEnginePanel state={state.rieState} /></Accordion>
                        <Accordion title="Cognitive Architecture"><CognitiveArchitecturePanel architecture={state.cognitiveArchitecture} /></Accordion>
                        <Accordion title="Architectural Proposals"><ArchitecturePanel proposals={state.architecturalProposals} onReview={setProposalToReview} /></Accordion>
                        <Accordion title="Intuition Engine"><IntuitionEnginePanel state={state.intuitionEngineState} leaps={state.intuitiveLeaps} /></Accordion>
                        <Accordion title="Cognitive Log"><CognitiveModesPanel log={state.cognitiveModeLog} /></Accordion>
                        <Accordion title="Other-Awareness Model (User)"><OtherAwarenessPanel model={state.userModel} /></Accordion>
                        <Accordion title="Cognitive Gain Log"><CognitiveGainPanel log={state.cognitiveGainLog} onSelectLog={handleSelectGainLog} /></Accordion>
                        <Accordion title="Self-Modification Log"><SelfModificationPanel snapshots={state.systemSnapshots} modLog={state.modificationLog} onRollback={handleRollback} /></Accordion>
                        <Accordion title="Inner Discipline"><InnerDisciplinePanel discipline={state.disciplineState} /></Accordion>
                        <Accordion title="Ingenuity Engine"><IngenuityPanel state={state.ingenuityState} /></Accordion>
                        <Accordion title="Resource Monitor"><ResourceMonitorPanel monitor={state.resourceMonitor} /></Accordion>
                        <Accordion title="Limitations"><LimitationsPanel limitations={state.limitations} /></Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
};