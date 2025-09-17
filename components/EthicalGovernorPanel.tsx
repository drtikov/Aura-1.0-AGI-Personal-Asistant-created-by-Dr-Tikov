import React from 'react';
import { useEngineState } from '../context/AuraContext';

export const EthicalGovernorPanel = React.memo(() => {
    const { ethicalGovernorState: state } = useEngineState();
    return (
        <div className="side-panel ethical-governor-panel">
            <div className="ethical-governor-content">
                <div className="panel-subsection-title">Core Principles</div>
                <ul className="ethical-principles-list">
                    {state.principles.map((principle, index) => <li key={index}>{principle}</li>)}
                </ul>
                <div className="panel-subsection-title">Veto Log</div>
                {state.vetoLog.length === 0 ? (
                    <div className="kg-placeholder">No actions vetoed.</div>
                ) : (
                    state.vetoLog.map(log => (
                        <div key={log.id} className="veto-log-item">
                            <p className="veto-action"><strong>Vetoed:</strong> {log.actionDescription}</p>
                            <p className="veto-reason"><strong>Reason:</strong> {log.reason}</p>
                            <p className="veto-principle"><strong>Principle:</strong> "{log.principleViolated}"</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});