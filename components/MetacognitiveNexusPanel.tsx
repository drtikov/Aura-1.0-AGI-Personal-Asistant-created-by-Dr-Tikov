import React from 'react';
import { useSystemState } from '../context/AuraContext';
import { SelfTuningDirective } from '../types';

const getStatusColor = (status: SelfTuningDirective['status']) => {
    switch(status) {
        case 'completed': return 'var(--success-color)';
        case 'failed':
        case 'rejected':
            return 'var(--failure-color)';
        case 'simulating':
        case 'pending_arbitration':
        case 'plan_generated':
            return 'var(--warning-color)';
        case 'proposed':
        default:
            return 'var(--text-muted)';
    }
};

export const MetacognitiveNexusPanel = React.memo(() => {
    const { metacognitiveNexus: state } = useSystemState();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                 <div className="panel-subsection-title">Core Processes</div>
                 {(!state || !state.coreProcesses || state.coreProcesses.length === 0) ? (
                    <div className="kg-placeholder">No core processes data available.</div>
                ) : (
                    state.coreProcesses.map(process => (
                        <div key={process.id} className="awareness-item">
                            <label>{process.name}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${process.activation * 100}%` }} title={`Activation: ${process.activation.toFixed(2)}`}></div>
                            </div>
                        </div>
                    ))
                )}
                <div className="panel-subsection-title">Self-Tuning Directives</div>
                 {(!state || !state.selfTuningDirectives || state.selfTuningDirectives.length === 0) ? (
                    <div className="kg-placeholder">No active self-tuning directives.</div>
                ) : (
                    state.selfTuningDirectives.map(d => (
                         <div key={d.id} className="gde-status" style={{ borderLeftColor: getStatusColor(d.status)}}>
                             <p title={d.reasoning}>
                                <strong>[{d.type.replace(/_/g, ' ')}]</strong> on {d.targetSkill}
                             </p>
                            <small>Status: <span style={{ color: getStatusColor(d.status), fontWeight: 'bold' }}>{d.status}</span></small>
                         </div>
                    ))
                )}
            </div>
        </div>
    );
});