// components/BennettEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const BennettEnginePanel = React.memo(() => {
    const { bennettEngineState: state } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel">
            <p className="reason-text">The Bennett Engine implements "W-Maxing" by autonomously seeking to generalize conjectures, workflows, and code by challenging and weakening their constraints.</p>
            <div className="awareness-item">
                <label>Engine Status</label>
                <strong>{state.status}</strong>
            </div>
            
            <div className="panel-subsection-title">Generalization Log</div>
            <div className="command-log-list">
                {state.log.length === 0 ? (
                    <div className="kg-placeholder">No generalization attempts logged.</div>
                ) : (
                    state.log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🌐</span>
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