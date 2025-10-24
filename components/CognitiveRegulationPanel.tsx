// components/CognitiveRegulationPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';
import { StateAdjustment, CognitiveRegulationLogEntry } from '../types';

export const CognitiveRegulationPanel = React.memo(() => {
    const { cognitiveRegulationLog: log } = useLogsState();
    const { t } = useLocalization();
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    return (
        <div className="side-panel command-log-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('cogRegulationPanel_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {log.map((entry: CognitiveRegulationLogEntry) => (
                        <details key={entry.id} className="workflow-details">
                            <summary className="workflow-summary">
                                <div className="mod-log-header" style={{ width: '100%' }}>
                                    <span className="mod-log-type" title={entry.reason}>
                                        {entry.trigger}
                                    </span>
                                    <span className="log-time">{timeAgo(entry.timestamp)}</span>
                                </div>
                            </summary>
                            <div className="workflow-content">
                                <p className="workflow-description"><strong>Reason:</strong> <em>"{entry.reason}"</em></p>
                                <ul className="adjustments-list">
                                    {/* FIX: Inlined the AdjustmentItem component JSX to resolve typing error with the 'key' prop. */}
                                    {entry.adjustments.map((adj, i) => (
                                        <li key={i} className="adjustment-item">
                                            <span className="param">{adj.parameter.replace(/Signal|Level/g, '')}</span>
                                            <span className="values">{adj.oldValue.toFixed(2)} → {adj.newValue.toFixed(2)}</span>
                                            <span className={`change ${adj.newValue > adj.oldValue ? 'positive' : 'negative'}`}>
                                                ({adj.newValue > adj.oldValue ? '+' : ''}{(adj.newValue - adj.oldValue).toFixed(2)})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
});