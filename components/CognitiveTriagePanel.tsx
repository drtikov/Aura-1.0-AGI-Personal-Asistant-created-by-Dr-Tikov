// components/CognitiveTriagePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';

export const CognitiveTriagePanel = React.memo(() => {
    const { cognitiveTriageState } = useArchitectureState();
    const { t } = useLocalization();
    const { log } = cognitiveTriageState;

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
                <div className="kg-placeholder">{t('cognitiveTriage_placeholder')}</div>
            ) : (
                log.map(entry => (
                    <div key={entry.timestamp} className={`mod-log-item status-${entry.decision}`}>
                        <div className="mod-log-header">
                            <span className="mod-log-type" title={entry.percept.rawText}>
                                {entry.decision === 'fast' ? '⚡' : '🧠'} {entry.percept.intent}
                            </span>
                            <span className={`mod-log-status status-${entry.decision}`}>
                                {entry.decision.toUpperCase()} PATH
                            </span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>
                            {entry.reasoning}
                        </p>
                        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {timeAgo(entry.timestamp)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});