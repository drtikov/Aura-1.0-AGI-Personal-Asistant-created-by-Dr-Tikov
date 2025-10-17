// components/CommandLogPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';
import { CommandLogEntry } from '../types';

export const CommandLogPanel = React.memo(() => {
    const { commandLog: log } = useLogsState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    const getIcon = (type: CommandLogEntry['type']) => {
        switch(type) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '!';
            case 'info':
            default:
                return 'i';
        }
    }

    return (
        <div className="side-panel command-log-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">{t('commandLogPanel_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {log.map(entry => (
                        <div key={entry.id} className={`command-log-item log-type-${entry.type}`}>
                            <span className="log-icon" title={entry.type}>{getIcon(entry.type)}</span>
                            <span className="log-text">{entry.text}</span>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});