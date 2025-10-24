// components/components/CommandLogPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../../context/AuraContext.tsx';
// FIX: Added '.ts' extension to satisfy module resolution.
import { CommandLogEntry } from '../../types.ts';
import { formatTimestamp } from '../../utils.ts';

export const CommandLogPanel = React.memo(() => {
    const { commandLog: log } = useLogsState();
    const { t } = useLocalization();

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
                            <span className="log-time" title={new Date(entry.timestamp).toLocaleString()}>{formatTimestamp(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});