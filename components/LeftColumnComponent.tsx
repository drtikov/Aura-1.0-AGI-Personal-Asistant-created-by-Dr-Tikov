import React from 'react';
import { useLogsState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { CoreMonitor } from './CoreMonitor';
import { LoadingOverlay } from './LoadingOverlay';
import { SafeMarkdown } from './SafeMarkdown';
import { WorkingMemoryPanel } from './WorkingMemoryPanel';
import { HistoryEntry, PerformanceLogEntry, InternalState } from '../types';

const getChromaStyle = (state?: InternalState): React.CSSProperties => {
    if (!state) return {};

    const { wisdomSignal, happinessSignal, loveSignal, enlightenmentSignal } = state;
    
    // Create a color blend. More signals = more complex gradient.
    const colors = [
        `rgba(230, 126, 34, ${wisdomSignal})`, // Wisdom - Orange
        `rgba(255, 215, 0, ${happinessSignal})`, // Happiness - Gold
        `rgba(255, 105, 180, ${loveSignal})`, // Love - Pink
        `rgba(156, 39, 176, ${enlightenmentSignal})` // Enlightenment - Purple
    ].filter(color => !color.endsWith('0)')); // Filter out transparent colors

    if (colors.length === 0) {
        return { '--chroma-gradient': 'linear-gradient(to bottom, var(--border-color), var(--border-color))' } as React.CSSProperties;
    }

    const gradient = `linear-gradient(to bottom, ${colors.join(', ')})`;
    
    return { '--chroma-gradient': gradient } as React.CSSProperties;
};

export const LeftColumnComponent = () => {
    const { history, performanceLogs } = useLogsState();
    const {
        activeLeftTab, setActiveLeftTab, outputPanelRef, currentCommand, setCurrentCommand,
        attachedFile, handleRemoveAttachment, fileInputRef, handleFileChange, handleMicClick,
        isRecording, processingState, handleSendCommand, dispatch, handleFeedback
    } = useAuraDispatch();
    const modal = useModal();
    const { t } = useLocalization();

    return (
        <div className="left-column">
            <div className="left-column-tabs">
                <button className={`tab-button ${activeLeftTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveLeftTab('chat')}>{t('chatTab')}</button>
                <button className={`tab-button ${activeLeftTab === 'monitor' ? 'active' : ''}`} onClick={() => setActiveLeftTab('monitor')}>{t('monitorTab')}</button>
            </div>

            {activeLeftTab === 'chat' && (
                <div className="chat-container">
                    <header className="chat-header">
                        <h1 data-text="AURA">AURA</h1>
                        <p>{t('chatHeaderTagline')}</p>
                    </header>
                    <div className="output-panel" ref={outputPanelRef}>
                        {history.map((entry: HistoryEntry) => (
                            <div key={entry.id} id={`history-entry-${entry.id}`} className={`history-entry from-${entry.from} ${entry.streaming ? 'streaming' : ''}`}>
                                <div className="entry-content" style={getChromaStyle(entry.internalStateSnapshot)}>
                                    {entry.text && <SafeMarkdown text={entry.text} />}
                                    {entry.from === 'user' && entry.fileName && (
                                        <div className="file-attachment-display">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
                                            <span>{entry.fileName}</span>
                                        </div>
                                    )}
                                    {entry.filePreview && ( <div className="file-preview"><img src={entry.filePreview} alt="File preview" /></div> )}
                                    {entry.skill && (
                                        <span className="skill-tag" title={`Skill used: ${entry.skill}`}>
                                            {entry.skill}
                                            {entry.logId && ( <button className="trace-button" onClick={() => { const log = performanceLogs.find((l: PerformanceLogEntry) => l.id === entry.logId); if (log) modal.open('causalChain', { log }); }}>Trace</button> )}
                                        </span>
                                    )}
                                    {entry.from === 'bot' && !entry.streaming && entry.text && (
                                        <div className="feedback-controls">
                                            <button className={`feedback-button positive ${entry.feedback === 'positive' ? 'selected' : ''}`} onClick={() => handleFeedback(entry.id, 'positive')} disabled={!!entry.feedback} title={t('feedbackGood')} aria-label={t('feedbackGood')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                                            </button>
                                            <button className={`feedback-button negative ${entry.feedback === 'negative' ? 'selected' : ''}`} onClick={() => handleFeedback(entry.id, 'negative')} disabled={!!entry.feedback} title={t('feedbackBad')} aria-label={t('feedbackBad')}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41-.17-.79-.44-1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <WorkingMemoryPanel onDispatch={dispatch} />
                    <form className="input-area" onSubmit={(e) => { e.preventDefault(); handleSendCommand(currentCommand, attachedFile?.file); }}>
                         <LoadingOverlay isActive={processingState.active} text={processingState.stage} />
                        {attachedFile && (
                            <div className="file-attachment-preview">
                                {attachedFile.type === 'image' && <img src={attachedFile.previewUrl} alt="attachment" />}
                                {attachedFile.type === 'audio' && <audio src={attachedFile.previewUrl} controls />}
                                <button onClick={handleRemoveAttachment}>&times;</button>
                            </div>
                        )}
                        <div className="input-area-content">
                            <textarea value={currentCommand} onChange={(e) => setCurrentCommand(e.target.value)} placeholder={t('inputPlaceholder')} rows={1} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendCommand(currentCommand, attachedFile?.file); } }} disabled={processingState.active} />
                            <div className="input-controls">
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={processingState.active} title={t('inputAttachFile')} aria-label={t('inputAttachFile')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg></button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                <button type="button" onClick={handleMicClick} className={`mic-button ${isRecording ? 'recording' : ''}`} disabled={processingState.active} title={isRecording ? t('inputStopRecording') : t('inputStartRecording')} aria-label={isRecording ? t('inputStopRecording') : t('inputStartRecording')}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg></button>
                                <button type="submit" disabled={processingState.active || (!currentCommand.trim() && !attachedFile)}>{t('inputSend')}</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            
            {activeLeftTab === 'monitor' && ( <CoreMonitor /> )}
        </div>
    );
};
