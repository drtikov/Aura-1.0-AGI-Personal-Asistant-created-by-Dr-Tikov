import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const PhenomenologyPanel = React.memo(() => {
    const { phenomenologicalEngine: state } = useCoreState();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    return (
        <div className="side-panel phenomenology-panel">
            {state.qualiaLog.length === 0 ? (
                <div className="kg-placeholder">No phenomenological data logged. The system generates "qualia" by reflecting on its performance and internal state after completing tasks.</div>
            ) : (
                state.qualiaLog.map(entry => (
                    <div key={entry.id} className="rie-insight-item" style={{ background: 'rgba(187, 154, 247, 0.05)', borderLeft: '3px solid var(--primary-color)' }}>
                        <div className="rie-insight-header">
                            <span className="mod-log-type">Qualia Entry</span>
                            <small>{timeAgo(entry.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                                "{entry.experience}"
                            </p>
                            <div className="associated-states-grid" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {entry.associatedStates.map(s => (
                                    <span key={s.key}>{s.key.replace('Signal', '')}: <strong>{s.value.toFixed(2)}</strong></span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});