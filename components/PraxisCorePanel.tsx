// components/PraxisCorePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';

export const PraxisCorePanel = React.memo(() => {
    const { praxisCoreState } = useArchitectureState();
    const { t } = useLocalization();
    const { log } = praxisCoreState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel command-log-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('praxisCore_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">⚙️</span>
                            <span className="log-text" title={entry.result}>{entry.command}</span>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});