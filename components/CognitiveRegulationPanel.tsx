import React from 'react';
import { useLogsState } from '../context/AuraContext';

export const CognitiveRegulationPanel = React.memo(() => {
    const { cognitiveRegulationLog: log } = useLogsState();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="side-panel">
            {log.length === 0 ? (
                <div className="kg-placeholder">No cognitive regulation events have occurred. This system activates when Aura uses its metacognitive model to prime its internal state for a specific task.</div>
            ) : (
                log.map(entry => (
                    <div key={entry.id} className="rie-insight-item" style={{background: 'rgba(42, 161, 152, 0.05)', borderLeft: '3px solid var(--guna-dharma)'}}>
                        <div className="rie-insight-header">
                            <span title={entry.triggeringCommand}>Task: <strong>"{entry.triggeringCommand.substring(0, 40)}{entry.triggeringCommand.length > 40 ? '...' : ''}"</strong></span>
                            <small>{timeAgo(entry.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p><strong>Directive:</strong> {entry.primingDirective}</p>
                            <div className="adjustments-list" style={{marginTop: '0.5rem'}}>
                                {Object.entries(entry.stateAdjustments).map(([key, { from, to }]) => (
                                    <p key={key} className="rie-insight-model-update" style={{fontSize: '0.8rem'}}>
                                        <strong>{key.replace('Signal', '')}:</strong>
                                        <span className="rie-insight-model-update-value"> {from.toFixed(2)} → {to.toFixed(2)}</span>
                                        <span style={{color: to > from ? 'var(--success-color)' : 'var(--failure-color)', marginLeft: '0.5rem'}}>
                                            {to > from ? '▲' : '▼'}
                                        </span>
                                    </p>
                                ))}
                            </div>
                            {entry.outcomeLogId && <small style={{display: 'block', textAlign: 'right', fontStyle: 'italic', marginTop: '0.5rem', opacity: 0.7}}>Outcome Logged</small>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});