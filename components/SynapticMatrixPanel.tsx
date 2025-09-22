import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { SynapticLink } from '../types';

export const SynapticMatrixPanel = React.memo(() => {
    const { synapticMatrix } = useArchitectureState();
    const { t } = useLocalization();

    const strongestLinks = useMemo(() => {
        return Object.entries(synapticMatrix.links)
            .sort(([, a]: [string, SynapticLink], [, b]: [string, SynapticLink]) => (b.weight * b.confidence) - (a.weight * a.confidence))
            .slice(0, 5) as [string, SynapticLink][];
    }, [synapticMatrix.links]);

    const formatNodeName = (name: string) => {
        return name.replace('internalState.', '').replace('event.', '').replace(/([A-Z])/g, ' $1').trim();
    };

    const CausalLinkArrow = ({ causality }: { causality: number }) => {
        if (causality > 0.1) return <span className="causal-arrow excitatory" title={`Excitatory: ${causality.toFixed(2)}`}>→</span>;
        if (causality < -0.1) return <span className="causal-arrow inhibitory" title={`Inhibitory: ${causality.toFixed(2)}`}>—|</span>;
        return <span className="causal-arrow neutral" title="Associative">↔</span>;
    }

    return (
        <div className="side-panel synaptic-matrix-panel">
            {synapticMatrix.isAdapting && (
                <div className="adaptation-indicator">
                    <div className="spinner-small" />
                    <span>{t('synapticMatrix_rapidAdaptation')}</span>
                </div>
            )}
            <div className="synaptic-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_neurons')}</span>
                    <span className="metric-value">{Object.keys(synapticMatrix.nodes).length}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_synapses')}</span>
                    <span className="metric-value">{synapticMatrix.synapseCount}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_avgCausality')}</span>
                    <span className="metric-value">{synapticMatrix.avgCausality.toFixed(2)}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_avgConfidence')}</span>
                    <span className="metric-value">{(synapticMatrix.avgConfidence * 100).toFixed(0)}%</span>
                </div>
            </div>

            <div className="hormone-signals">
                <div className="hormone-item">
                    <label>{t('synapticMatrix_plasticity')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar plasticity-bar" style={{width: `${synapticMatrix.plasticity * 100}%`}}></div>
                    </div>
                </div>
                <div className="hormone-item">
                    <label>{t('synapticMatrix_efficiency')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar efficiency-bar" style={{width: `${synapticMatrix.efficiency * 100}%`}}></div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('synapticMatrix_intuitiveAlerts')}</div>
            {synapticMatrix.intuitiveAlerts.length === 0 ? (
                <div className="kg-placeholder" style={{ marginBottom: '1rem' }}>{t('synapticMatrix_noAlerts')}</div>
            ) : (
                synapticMatrix.intuitiveAlerts.map(alert => (
                    <div key={alert.id} className="rie-insight-item" style={{ background: 'rgba(255, 193, 7, 0.05)', marginBottom: '0.5rem' }}>
                        <p className="rie-insight-model-update">
                           {alert.message}
                        </p>
                    </div>
                ))
            )}
            
            <div className="panel-subsection-title">{t('synapticMatrix_strongestLinks')}</div>
            {strongestLinks.length === 0 ? (
                <div className="kg-placeholder">{t('synapticMatrix_noLinks')}</div>
            ) : (
                <div className="causal-links-list">
                    {strongestLinks.map(([key, link]) => {
                        const [nodeA, nodeB] = key.split('-');
                        const source = link.causality >= 0 ? nodeA : nodeB;
                        const target = link.causality >= 0 ? nodeB : nodeA;

                        return (
                            <div key={key} className="causal-link-item" title={`${t('memoryCrystallization_weight')}: ${link.weight.toFixed(3)}`}>
                                <span className="causal-node source">{formatNodeName(source)}</span>
                                <div className="causal-connection">
                                    <CausalLinkArrow causality={link.causality} />
                                    <div className="causal-confidence-bar" style={{'--confidence': `${link.confidence * 100}%`} as React.CSSProperties}></div>
                                    <span className="causal-confidence-text">{(link.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <span className="causal-node target">{formatNodeName(target)}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
});
