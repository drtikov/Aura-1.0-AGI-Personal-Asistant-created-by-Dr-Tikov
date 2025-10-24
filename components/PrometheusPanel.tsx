// components/PrometheusPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';

export const PrometheusPanel = () => {
    const { prometheusState } = useCoreState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const modal = useModal();

    const [sourceDomain, setSourceDomain] = useState('');
    const [targetDomain, setTargetDomain] = useState('');

    const handleRunAutonomousCycle = () => {
        syscall('PROMETHEUS/START_AUTONOMOUS_CYCLE', {});
    };

    const handleRunGuidedInquiry = () => {
        if (sourceDomain.trim() && targetDomain.trim()) {
            syscall('PROMETHEUS/START_GUIDED_INQUIRY', { sourceDomain, targetDomain });
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">The Prometheus Engine autonomously seeks deep structural analogies between disparate knowledge domains to formulate novel conjectures.</p>

            <div className="panel-subsection-title">Guided Inquiry</div>
            <p className="reason-text" style={{fontSize: '0.8rem'}}>Define two conceptual domains for Prometheus to bridge.</p>
            <div className="image-gen-control-group" style={{marginTop: '0.5rem'}}>
                <input type="text" value={sourceDomain} onChange={e => setSourceDomain(e.target.value)} placeholder="Source Domain (e.g., Mycology)" disabled={prometheusState.status === 'running'} className="vfs-path-input"/>
            </div>
            <div className="image-gen-control-group" style={{marginTop: '0.5rem'}}>
                <input type="text" value={targetDomain} onChange={e => setTargetDomain(e.target.value)} placeholder="Target Domain (e.g., Software Architecture)" disabled={prometheusState.status === 'running'} className="vfs-path-input"/>
            </div>
            
            <div className="button-grid" style={{ margin: '1rem 0' }}>
                <button 
                    className="control-button" 
                    onClick={handleRunGuidedInquiry} 
                    disabled={prometheusState.status === 'running' || !sourceDomain.trim() || !targetDomain.trim()}
                >
                    Find Analogy
                </button>
                <button 
                    className="control-button" 
                    onClick={handleRunAutonomousCycle} 
                    disabled={prometheusState.status === 'running'}
                >
                    {prometheusState.status === 'running' ? 'Seeking...' : 'Run Autonomous Cycle'}
                </button>
            </div>
            
            <div className="panel-subsection-title">Log</div>
            {prometheusState.lastSessionId && (
                <div className="session-link" style={{marginBottom: '0.5rem'}}>
                    <button className="trace-button" onClick={() => modal.open('collaborativeSession', { sessionId: prometheusState.lastSessionId })}>
                        View Current Collaborative Session
                    </button>
                </div>
            )}
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