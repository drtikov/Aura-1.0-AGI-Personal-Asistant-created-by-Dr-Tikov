import React from 'react';
import { MetacognitiveLink } from '../types';
import { useSystemState, useLocalization } from '../context/AuraContext';

const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

const CorrelationArrow = ({ correlation, t }: { correlation: number, t: (key: string) => string }) => {
    if (correlation > 0.1) return <span style={{ color: 'var(--success-color)' }}>↑ {t('metaCausal_increase')}</span>;
    if (correlation < -0.1) return <span style={{ color: 'var(--failure-color)' }}>↓ {t('metaCausal_decrease')}</span>;
    return <span style={{ color: 'var(--text-muted)' }}>- {t('metaCausal_noEffect')}</span>;
};

export const MetacognitiveCausalModelPanel = React.memo(() => {
    const { metacognitiveCausalModel: model } = useSystemState();
    const { t } = useLocalization();
    const links = Object.values(model).sort((a, b) => b.lastUpdated - a.lastUpdated);

    return (
        <div className="side-panel">
            {links.length === 0 ? (
                <div className="kg-placeholder">{t('metaCausal_placeholder')}</div>
            ) : (
                links.map(link => (
                    <div key={link.id} className="causal-link source-rie" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                        <div className="causal-link-header">
                            <span className="causal-cause" style={{color: 'var(--primary-color)'}}>
                                {t('metaCausal_when')} {formatKey(link.source.key)} {t('metaCausal_is')} {link.source.condition}
                            </span>
                            <span className="causal-confidence" title={`${t('causalSelfModel_confidence')}: ${link.correlation.toFixed(2)}`}>
                                ({(link.correlation * 100).toFixed(0)}%)
                            </span>
                        </div>
                        <div className="causal-effect">
                            <span className="causal-effect-arrow">→</span>
                            {t('metaCausal_performanceOf')} <strong style={{color: 'var(--accent-color)'}}>{formatKey(link.target.key)}</strong>'s {formatKey(link.target.metric)} {t('metaCausal_showsA')}...
                        </div>
                        <div className="causal-effect" style={{ marginTop: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                            <CorrelationArrow correlation={link.correlation} t={t} />
                        </div>
                         <div className="causal-link-footer">
                            {t('metaCausal_basedOn', { count: link.observationCount })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});