import React from 'react';
import { useLogsState } from '../context/AuraContext';
import { CommandLogEntry } from '../types';

export const CommandLogPanel = React.memo(() => {
    const { commandLog: log } = useLogsState();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
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
                <div className="kg-placeholder">No system commands logged yet.</div>
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