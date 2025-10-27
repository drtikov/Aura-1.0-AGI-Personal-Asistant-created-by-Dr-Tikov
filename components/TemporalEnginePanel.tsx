// components/TemporalEnginePanel.tsx
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';
import { SEDLDirective } from '../types.ts';

export const TemporalEnginePanel = () => {
    const { temporalEngineState } = useSystemState();
    const { t } = useLocalization();
    const { status, directive, chronicler, reactor, oracle, historian, interClusterLog } = temporalEngineState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return `${seconds}s ago`;
    };

    return (
        <div className="side-panel temporal-engine-panel">
            <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong>{status.replace(/_/g, ' ')}</strong>
            </div>

            {directive && (
                <div className="temporal-engine-directive">
                    <strong>Directive:</strong> <em>"{directive.content.substring(0, 100)}{directive.content.length > 100 ? '...' : ''}"</em>
                </div>
            )}

            <div className="temporal-engine-grid">
                {/* Chronicler (Past) */}
                <div className="temporal-cluster">
                    <div className="cluster-header chronicler-header">{t('temporal_chronicler')}</div>
                    <div className="cluster-content">
                        {chronicler.findings.map((finding, i) => (
                            <div key={i} className="log-item">
                                <span className="log-icon">📜</span>
                                <span className="log-text">{finding}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reactor (Present) */}
                <div className="temporal-cluster">
                    <div className="cluster-header reactor-header">{t('temporal_reactor')}</div>
                     <div className="cluster-content">
                        {reactor.executionLog.map((log, i) => (
                             <div key={i} className="log-item">
                                <span className={`log-icon ${log.success ? 'success' : 'failure'}`}>{log.success ? '✅' : '❌'}</span>
                                <span className="log-text">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Oracle (Future) */}
                <div className="temporal-cluster">
                    <div className="cluster-header oracle-header">{t('temporal_oracle')}</div>
                    <div className="cluster-content">
                         {oracle.simulations.map((sim, i) => (
                            <div key={i} className="log-item">
                                <span className="log-icon">🔮</span>
                                <span className="log-text">{sim}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Historian (Counterfactual) */}
                <div className="temporal-cluster">
                    <div className="cluster-header historian-header">{t('temporal_historian')}</div>
                    <div className="cluster-content">
                         {historian && historian.findings.map((finding, i) => (
                            <div key={i} className="log-item">
                                <span className="log-icon">⏳</span>
                                <span className="log-text">{finding}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('temporal_interClusterLog')}</div>
            <div className="inter-cluster-log">
                {interClusterLog.map(log => (
                    <div key={log.timestamp} className="log-item">
                        <span className="log-icon">{log.from === 'Chronicler' ? '📜' : '🔮'}</span>
                        <span className="log-text"><strong>{log.from} to {log.to}:</strong> {log.message}</span>
                        <span className="log-time">{timeAgo(log.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};