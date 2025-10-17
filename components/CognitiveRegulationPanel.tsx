// components/CognitiveRegulationPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';
import { StateAdjustment } from '../types';

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
        <div className="side-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('cogRegulation_placeholder')}</div>
            ) : (
                log.map(entry => (
                    <div key={entry.id} className="rie-insight-item" style={{background: 'rgba(42, 161, 152, 0.05)', borderLeft: '3px solid var(--guna-dharma)'}}>
                        <div className="rie-insight-header">
                            <span title={entry.triggeringCommand}>{t('cogRegulation_task')}: <strong>"{entry.triggeringCommand.substring(0, 40)}{entry.triggeringCommand.length > 40 ? '...' : ''}"</strong></span>
                            <small>{timeAgo(entry.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p><strong>{t('cogRegulation_directive')}:</strong> {entry.primingDirective}</p>
                            <div className="adjustments-list" style={{marginTop: '0.5rem'}}>
                                {Object.entries(entry.stateAdjustments).map(([key, adjustment]: [string, StateAdjustment]) => (
                                    <p key={key} className="rie-insight-model-update" style={{fontSize: '0.8rem'}}>
                                        <strong>{key.replace('Signal', '')}:</strong>
                                        <span className="rie-insight-model-update-value"> {adjustment.from.toFixed(2)} → {adjustment.to.toFixed(2)}</span>
                                        <span style={{color: adjustment.to > adjustment.from ? 'var(--success-color)' : 'var(--failure-color)', marginLeft: '0.5rem'}}>
                                            {adjustment.to > adjustment.from ? '▲' : '▼'}
                                        </span>
                                    </p>
                                ))}
                            </div>
                            {entry.outcomeLogId && <small style={{display: 'block', textAlign: 'right', fontStyle: 'italic', marginTop: '0.5rem', opacity: 0.7}}>{t('cogRegulation_outcomeLogged')}</small>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});