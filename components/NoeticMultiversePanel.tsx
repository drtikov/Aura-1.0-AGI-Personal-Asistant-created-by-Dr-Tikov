import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const NoeticMultiversePanel = React.memo(() => {
    const { noeticMultiverse: state } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel noetic-multiverse-panel">
            <div className="synaptic-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('multiverse_activeBranches')}</span>
                    <span className="metric-value">{state.activeBranches.length}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('multiverse_divergenceIndex')}</span>
                    <span className="metric-value">{state.divergenceIndex.toFixed(2)}</span>
                </div>
            </div>

            <div className="panel-subsection-title">{t('multiverse_activeBranches')}</div>
            {state.activeBranches.length === 0 ? (
                <div className="kg-placeholder">{t('multiverse_noBranches')}</div>
            ) : (
                state.activeBranches.map(branch => (
                    <div key={branch.id} className="rie-insight-item" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                        <div className="rie-insight-header">
                            <span title={branch.id}>Branch-{branch.id.substring(0, 8)}</span>
                            <strong className="rie-insight-model-update-value">{branch.status}</strong>
                        </div>
                        <div className="rie-insight-body">
                             <p>
                                <em>{branch.reasoningPath}</em>
                            </p>
                            <div className="state-item" style={{paddingTop: '0.5rem'}}>
                                <label>{t('multiverse_viability')}</label>
                                <div className="state-bar-container">
                                    <div className="state-bar" style={{ width: `${branch.viabilityScore * 100}%`, backgroundColor: 'var(--accent-color)' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}

            <div className="panel-subsection-title">{t('multiverse_pruningLog')}</div>
            {state.pruningLog.length === 0 ? (
                <div className="kg-placeholder">{t('multiverse_noPrunedInsights')}</div>
            ) : (
                <ul className="ethical-principles-list">
                    {state.pruningLog.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            )}
        </div>
    );
});