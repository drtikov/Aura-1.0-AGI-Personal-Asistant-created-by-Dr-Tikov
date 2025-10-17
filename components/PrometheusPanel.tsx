// components/PrometheusPanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const PrometheusPanel = () => {
    const { prometheusState } = useCoreState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const handleRunCycle = () => {
        syscall('PROMETHEUS/START_CYCLE', {});
    };

    return (
        <div className="side-panel">
            <p className="reason-text">The Prometheus Engine autonomously seeks deep structural analogies between disparate knowledge domains to formulate novel conjectures.</p>
            <div className="button-grid" style={{ margin: '1rem 0' }}>
                <button 
                    className="control-button" 
                    onClick={handleRunCycle} 
                    disabled={prometheusState.status === 'running'}
                >
                    {prometheusState.status === 'running' ? 'Seeking...' : 'Run Analogical Cycle'}
                </button>
            </div>
            <div className="panel-subsection-title">Log</div>
            <div className="command-log-list">
                {prometheusState.log.map(entry => (
                    <div key={entry.timestamp} className="command-log-item log-type-info">
                         <span className="log-icon">{prometheusState.status === 'running' && entry === prometheusState.log[0] ? <div className="spinner-small" /> : '🔥'}</span>
                        <span className="log-text">{entry.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};