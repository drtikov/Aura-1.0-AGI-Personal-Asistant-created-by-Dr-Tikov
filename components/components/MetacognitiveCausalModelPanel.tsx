// components/components/MetacognitiveCausalModelPanel.tsx
import React from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
import { MetacognitiveLink } from '../../types.ts';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useSystemState, useLocalization } from '../../context/AuraContext.tsx';

const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

const CorrelationArrow = ({ correlation, t }: { correlation: number, t: (key: string, options?: any) => string }) => {
    if (correlation > 0.1) return <span style={{ color: 'var(--success-color)' }}>↑ {t('metaCausal_increase')}</span>;
    if (correlation < -0.1) return <span style={{ color: 'var(--failure-color)' }}>↓ {t('metaCausal_decrease')}</span>;
    return <span style={{ color: 'var(--text-muted)' }}>- {t('metaCausal_noEffect')}</span>;
};

export const MetacognitiveCausalModelPanel = React.memo(() => {
    const { metacognitiveCausalModel: model } = useSystemState();
    const { t } = useLocalization();
    const links = Object.values(model).sort((a, b) => (b as MetacognitiveLink).lastUpdated - (a as MetacognitiveLink).lastUpdated);

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('metaCausal_description')}
            </p>
            {links.length === 0 ? (
                <div className="kg-placeholder">{t('metaCausal_placeholder')}</div>
            ) : (
                links.map(link => {
                    const typedLink = link as MetacognitiveLink;
                    return (
                        <div key={typedLink.id} className="causal-link source-rie" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                            <div className="causal-link-header">
                                <span className="causal-cause" style={{color: 'var(--primary-color)'}}>
                                    {t('metaCausal_when')} {formatKey(typedLink.source.key)} {t('metaCausal_is')} {typedLink.source.condition}
                                </span>
                                <span className="causal-confidence" title={`${t('causalSelfModel_confidence')}: ${typedLink.correlation.toFixed(2)}`}>
                                    ({(typedLink.correlation * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="causal-effect">
                                <span className="causal-effect-arrow">→</span>
                                {t('metaCausal_performanceOf')} <strong style={{color: 'var(--accent-color)'}}>{formatKey(typedLink.target.key)}</strong>'s {formatKey(typedLink.target.metric)} {t('metaCausal_showsA')}...
                            </div>
                            <div className="causal-effect" style={{ marginTop: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                                <CorrelationArrow correlation={typedLink.correlation} t={t} />
                            </div>
                            <div className="causal-link-footer">
                                {t('metaCausal_basedOn', { count: typedLink.observationCount })}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    );
});
