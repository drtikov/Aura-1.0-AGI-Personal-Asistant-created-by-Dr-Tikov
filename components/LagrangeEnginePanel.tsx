// components/LagrangeEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { clamp } from '../utils';

export const LagrangeEnginePanel = React.memo(() => {
    const { lagrangeEngineState } = useCoreState();
    const { t } = useLocalization();
    const { status, symbolicEquation, numericalDiscretization, simulationLog } = lagrangeEngineState;

    return (
        <div className="side-panel lagrange-panel">
            <p className="reason-text">{t('lagrange_description')}</p>
            <div className="awareness-item">
                <label>Status</label>
                <strong>
                    {status}
                    {status === 'running' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>

             <div className="lagrange-manifold-container">
                <svg viewBox="-100 -100 200 200" className="lagrange-manifold-svg">
                    <line x1="-100" y1="0" x2="100" y2="0" stroke="var(--border-color)" strokeWidth="0.5" />
                    <line x1="0" y1="-100" x2="0" y2="100" stroke="var(--border-color)" strokeWidth="0.5" />
                    {status === 'running' && <circle cx="0" cy="0" r="3" fill="var(--accent-color)" className="lagrange-point"><animate attributeName="cx" values="0; 50; -30; 0" dur="4s" repeatCount="indefinite" /><animate attributeName="cy" values="0; -40; 60; 0" dur="4s" repeatCount="indefinite" /></circle>}
                </svg>
            </div>
             <div className="lagrange-axes-legend">
                <span>← Turbulent</span>
                <span>Stable →</span>
            </div>

            <div className="panel-subsection-title">{t('lagrange_symbolic')}</div>
             {symbolicEquation ? (
                <div className="code-snippet-container">
                    <pre><code>{symbolicEquation}</code></pre>
                </div>
             ) : (
                <div className="kg-placeholder">Not computed.</div>
             )}

            <div className="panel-subsection-title">{t('lagrange_numerical')}</div>
             {numericalDiscretization ? (
                <div className="code-snippet-container">
                    <pre><code>{numericalDiscretization}</code></pre>
                </div>
             ) : (
                <div className="kg-placeholder">Not computed.</div>
             )}
            
            <div className="panel-subsection-title">Simulation Log</div>
            <div className="command-log-list">
                {simulationLog.length > 0 ? (
                    simulationLog.map((log, i) => (
                        <div key={i} className="command-log-item log-type-info">
                            <span className="log-icon">⚙️</span>
                            <span className="log-text">{log}</span>
                        </div>
                    ))
                ) : (
                     <div className="kg-placeholder">No simulation steps logged.</div>
                )}
            </div>
        </div>
    );
});