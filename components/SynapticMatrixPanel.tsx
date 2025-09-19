import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const SynapticMatrixPanel = React.memo(() => {
    const { synapticMatrix } = useArchitectureState();
    const { t } = useLocalization();

    const strongestLinks = useMemo(() => {
        return Object.entries(synapticMatrix.links)
            .sort(([, a], [, b]) => b.weight - a.weight)
            .slice(0, 10);
    }, [synapticMatrix.links]);

    const formatNodeName = (name: string) => {
        return name.replace('internalState.', '').replace('event.', '').replace('Signal', '').replace('Level', '');
    };

    return (
        <div className="side-panel synaptic-matrix-panel">
            <div className="synaptic-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_neurons')}</span>
                    <span className="metric-value">{Object.keys(synapticMatrix.nodes).length}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('synapticMatrix_synapses')}</span>
                    <span className="metric-value">{Object.keys(synapticMatrix.links).length}</span>
                </div>
            </div>

            <div className="panel-subsection-title">{t('synapticMatrix_intuitiveAlerts')}</div>
            {synapticMatrix.intuitiveAlerts.length === 0 ? (
                <div className="kg-placeholder" style={{ marginBottom: '1rem' }}>{t('synapticMatrix_noAlerts')}</div>
            ) : (
                synapticMatrix.intuitiveAlerts.map(alert => (
                    <div key={alert.id} className="rie-insight-item" style={{ background: 'rgba(255, 193, 7, 0.05)' }}>
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
                <div className="hypha-connections-list">
                    {strongestLinks.map(([key, link]) => (
                        <div key={key} className="hypha-connection-item" title={`${t('memoryCrystallization_weight')}: ${link.weight.toFixed(3)}`}>
                            <span className="hypha-source">{formatNodeName(key.split('-')[0])}</span>
                            <div 
                                className="hypha-weight-bar"
                                style={{ '--weight': `${Math.min(link.weight * 100, 100)}%` } as React.CSSProperties}
                            ></div>
                            <span className="hypha-target">{formatNodeName(key.split('-')[1])}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});