// components/NoeticMultiversePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { MultiverseBranch } from '../types';

export const NoeticMultiversePanel = React.memo(() => {
    const { noeticMultiverse: state } = useCoreState();
    const { t } = useLocalization();

    const sortedBranches = [...state.activeBranches].sort((a, b) => b.viabilityScore - a.viabilityScore);
    const primaryBranch = sortedBranches.length > 0 ? sortedBranches[0] : null;

    return (
        <div className="noetic-multiverse-panel">
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

            <div className="panel-subsection-title">Probability Cone</div>
            {sortedBranches.length > 0 ? (
                <div className="multiverse-cone">
                    {sortedBranches.map(branch => (
                        <div 
                            key={branch.id} 
                            className={`multiverse-branch ${branch.id === primaryBranch?.id ? 'primary' : ''} ${branch.status === 'pruned' ? 'pruned' : ''}`}
                        >
                            <div className="branch-header">
                                <span title={branch.id}>Branch {branch.id.substring(0, 8)}...</span>
                                <span className="branch-viability">Viability: {(branch.viabilityScore * 100).toFixed(1)}%</span>
                            </div>
                            <p className="branch-path">{branch.reasoningPath}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('multiverse_noBranches')}</div>
            )}
            

            <div className="panel-subsection-title">{t('multiverse_pruningLog')}</div>
            {state.pruningLog.length > 0 ? (
                <ul className="pruning-log-list">
                    {state.pruningLog.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            ) : (
                <div className="kg-placeholder">{t('multiverse_noPrunedInsights')}</div>
            )}
        </div>
    );
});