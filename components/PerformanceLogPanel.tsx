// components/PerformanceLogPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';
import { PerformanceLogEntry } from '../types.ts';
import { useModal } from '../context/ModalContext.tsx';

export const PerformanceLogPanel = React.memo(() => {
    const { performanceLogs } = useLogsState();
    const { t } = useLocalization();
    const modal = useModal();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    const handleTraceClick = (log: PerformanceLogEntry) => {
        modal.open('causalChain', { log });
    };

    return (
        <div className="side-panel command-log-panel">
            {performanceLogs.length === 0 ? (
                <div className="kg-placeholder">{t('performanceLog_placeholder', { defaultValue: 'No performance logs recorded yet.' })}</div>
            ) : (
                <div className="command-log-list">
                    {performanceLogs.map(entry => (
                        <div key={entry.id} className={`command-log-item log-type-${entry.success ? 'success' : 'error'}`}>
                            <span className="log-icon" title={entry.success ? 'Success' : 'Failure'}>{entry.success ? '✓' : '✗'}</span>
                            <div className="log-text-group">
                                <span className="log-text">{entry.skill}</span>
                                <span className="log-subtext">{t('performanceLog_duration', { defaultValue: 'Duration' })}: {entry.duration}ms | {t('performanceLog_gain', { defaultValue: 'Gain' })}: {entry.cognitiveGain.toFixed(2)}</span>
                            </div>
                            {entry.decisionContext && (
                                <button className="trace-button" onClick={() => handleTraceClick(entry)}>Trace</button>
                            )}
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
