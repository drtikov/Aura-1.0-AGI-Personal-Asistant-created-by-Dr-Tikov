// components/HeuristicsForgePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { DesignHeuristic } from '../types.ts';

export const HeuristicsForgePanel = React.memo(() => {
    const { heuristicsForge: state } = useArchitectureState();
    const { t } = useLocalization();

    const getStatusColor = (status: DesignHeuristic['validationStatus']) => {
        switch(status) {
            case 'validated': return 'var(--success-color)';
            case 'refuted': return 'var(--failure-color)';
            case 'unvalidated':
            default:
                return 'var(--text-muted)';
        }
    };

    return (
        <div className="side-panel heuristics-forge-panel">
             <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This panel displays strategic principles learned by the Strategic Core after analyzing past performance. These heuristics guide future decision-making.
            </p>
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
                         <div className="causal-link-footer" style={{textAlign: 'left', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span title={`Source: ${item.source}`}>
                                <strong>{t('phenomenology_source')}:</strong> {item.source.substring(0, 30)}...
                            </span>
                            <span style={{ color: getStatusColor(item.validationStatus), fontWeight: 'bold', textTransform: 'uppercase' }} title={`${t('heuristics_effectiveness')}: ${item.effectivenessScore.toFixed(2)}`}>
                                {item.validationStatus}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});