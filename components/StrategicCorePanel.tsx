// components/StrategicCorePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { StrategicCoreLogEntry } from '../types';

export const StrategicCorePanel = React.memo(() => {
    const { strategicCoreState } = useCoreState();
    const { t } = useLocalization();
    const { log } = strategicCoreState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('strategicCore_description')}</p>
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('strategicCore_noLog')}</div>
            ) : (
                log.map((entry: StrategicCoreLogEntry) => (
                    <details key={entry.id} className="workflow-details">
                        <summary className="workflow-summary">
                            <div className="mod-log-header" style={{ width: '100%' }}>
                                <span className="mod-log-type">{entry.decision.replace(/_/g, ' ')}</span>
                                <span className="log-time">{timeAgo(entry.timestamp)}</span>
                            </div>
                        </summary>
                        <div className="workflow-content">
                            <p className="workflow-description"><strong>Policy Network Reasoning:</strong> <em>"{entry.reasoning}"</em></p>
                            <div className="panel-subsection-title" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Options Considered</div>
                            {entry.options.map(option => (
                                <div key={option.action} className={`mod-log-item ${option.action === entry.decision ? 'selected-option' : ''}`}>
                                    <div className="mod-log-header">
                                        <span className="mod-log-type">{option.action.replace(/_/g, ' ')}</span>
                                        <span className="mod-log-status">Score: {option.score.toFixed(2)}</span>
                                    </div>
                                    <p className="mod-log-description" style={{ fontSize: '0.75rem' }}>{option.justification}</p>
                                </div>
                            ))}
                            {entry.rewardSignal !== undefined && (
                                <div className="panel-subsection-title" style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>Reinforcement Outcome</div>
                                )}
                            {entry.rewardSignal !== undefined && (
                                <div className="metric-item">
                                    <span className="metric-label">Reward Signal</span>
                                    <span className="metric-value" style={{ color: entry.rewardSignal > 0 ? 'var(--success-color)' : 'var(--failure-color)' }}>
                                        {entry.rewardSignal > 0 ? '+' : ''}{entry.rewardSignal.toFixed(3)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </details>
                ))
            )}
        </div>
    );
});