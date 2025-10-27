// components/OckhamEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const OckhamEnginePanel = React.memo(() => {
    const { ockhamEngineState: state } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel">
            <p className="reason-text">The Ockham Engine implements "Simp-Maxing" by autonomously scanning plans and code to find simpler, more elegant solutions based on the Minimum Description Length (MDL) principle.</p>
            <div className="awareness-item">
                <label>Engine Status</label>
                <strong>{state.status}</strong>
            </div>
            
            <div className="panel-subsection-title">Simplification Log</div>
            <div className="command-log-list">
                {state.log.length === 0 ? (
                    <div className="kg-placeholder">No simplification attempts logged.</div>
                ) : (
                    state.log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🔪</span>
                            <div className="log-text-group">
                                <span className="log-text">{entry.message}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});