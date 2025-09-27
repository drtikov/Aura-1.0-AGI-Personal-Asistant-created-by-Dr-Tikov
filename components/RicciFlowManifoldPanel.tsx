import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const RicciFlowManifoldPanel = React.memo(() => {
    const { ricciFlowManifoldState: state } = useArchitectureState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel ricci-flow-panel">
            <div className="entropy-display">
                <div className="entropy-value" title={t('ricciFlow_entropyTooltip')}>
                    {state.perelmanEntropy.toFixed(4)}
                </div>
                <div className="entropy-label">{t('ricciFlow_perelmanEntropy')}</div>
            </div>

            <div className="manifold-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('ricciFlow_stability')}</span>
                    <span className="metric-value">{(state.manifoldStability * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('ricciFlow_singularities')}</span>
                    <span className="metric-value">{state.singularityCount}</span>
                </div>
            </div>

            <div className="panel-subsection-title">{t('ricciFlow_surgeryLog')}</div>
            <div className="surgery-log-list">
                {state.surgeryLog.length === 0 ? (
                    <div className="kg-placeholder">{t('ricciFlow_noSurgeries')}</div>
                ) : (
                    state.surgeryLog.map(log => (
                        <div key={log.id} className="surgery-log-item">
                            <div className="surgery-icon">🛠️</div>
                            <div className="surgery-details">
                                <p className="surgery-description">{log.description}</p>
                                <div className="surgery-footer">
                                    <span>ΔW: {(log.entropyAfter - log.entropyBefore).toFixed(3)}</span>
                                    <span>{timeAgo(log.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});