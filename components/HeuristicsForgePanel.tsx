import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const HeuristicsForgePanel = React.memo(() => {
    const { heuristicsForge: state } = useArchitectureState();
    const { t } = useLocalization();

    return (
        <div className="side-panel heuristics-forge-panel">
            {state.designHeuristics.length === 0 ? (
                <div className="kg-placeholder">
                    {t('heuristics_placeholder')}
                </div>
            ) : (
                state.designHeuristics.map(item => (
                    <div key={item.id} className="causal-link source-rie" style={{ background: 'rgba(147, 112, 219, 0.05)', borderLeftColor: 'var(--guna-dharma)'}}>
                         <div className="causal-link-header">
                            <span className="causal-cause" style={{color: 'var(--guna-dharma)'}}>{t('heuristics_learnedHeuristic')}</span>
                             <span className="causal-confidence" title={`${t('causalSelfModel_confidence')}: ${item.confidence.toFixed(2)}`}>
                                ({(item.confidence * 100).toFixed(0)}%)
                            </span>
                        </div>
                        <div className="causal-effect" style={{ fontStyle: 'italic', marginTop: '0.25rem' }}>
                           "{item.heuristic}"
                        </div>
                         <div className="causal-link-footer" style={{textAlign: 'left', marginTop: '0.5rem'}}>
                            <strong>{t('phenomenology_source')}:</strong> {item.source}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});