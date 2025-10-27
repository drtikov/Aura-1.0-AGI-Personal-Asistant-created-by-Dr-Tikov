// components/RamanujanEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { ProposedConjecture } from '../types.ts';
import { SafeMarkdown } from './SafeMarkdown.tsx';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

const getStatusInfo = (status: ProposedConjecture['status']) => {
    switch (status) {
        case 'proven':
            return { color: 'var(--success-color)', icon: '✅' };
        case 'disproven':
            return { color: 'var(--failure-color)', icon: '❌' };
        case 'proving':
            return { color: 'var(--warning-color)', icon: <div className="spinner-small" /> };
        case 'untested':
        default:
            return { color: 'var(--text-muted)', icon: '?' };
    }
};

export const RamanujanEnginePanel = React.memo(() => {
    const { ramanujanEngineState } = useCoreState();
    const { t } = useLocalization();
    const { status, log, proposedConjectures } = ramanujanEngineState;

    return (
        <div className="side-panel ramanujan-engine-panel">
            <p className="reason-text">{t('ramanujan_description')}</p>

            <div className="awareness-item" style={{ marginBottom: '1rem' }}>
                <label>Engine Status</label>
                <strong style={{ textTransform: 'capitalize' }}>
                    {status}
                    {status !== 'idle' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>

            <div className="panel-subsection-title">Proposed Conjectures</div>
            {proposedConjectures.length === 0 ? (
                <div className="kg-placeholder">No conjectures have been formulated yet.</div>
            ) : (
                proposedConjectures.map(conjecture => {
                    const statusInfo = getStatusInfo(conjecture.status);
                    return (
                        <div key={conjecture.id} className="axiom-card" style={{ borderLeftColor: statusInfo.color }}>
                            <div className="mod-log-header">
                                <span className="mod-log-type" title={`Source Analogy: ${conjecture.sourceAnalogyId}`}>Conjecture</span>
                                <span className="mod-log-status" style={{ color: statusInfo.color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {statusInfo.icon}
                                    {conjecture.status}
                                </span>
                            </div>
                            <div className="axiom-card-text">
                                <SafeMarkdown text={`$${conjecture.conjectureText}$`} />
                            </div>
                        </div>
                    )
                })
            )}
            
            <div className="panel-subsection-title">Engine Log</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">No log entries.</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🧠</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});