import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { SynapticLink } from '../types';

export const SynapticMatrixPanel = React.memo(() => {
    const { synapticMatrix } = useArchitectureState();
    const { t } = useLocalization();

    return (
        <div className={`side-panel synaptic-matrix-panel ${synapticMatrix.isAdapting ? 'adapting' : ''}`}>
            
            {synapticMatrix.activeConcept && (
                 <div className="synaptic-active-concept">
                    <div className="metric-label">Active Concept</div>
                    <div className="metric-value">{synapticMatrix.activeConcept}</div>
                </div>
            )}
            
            <div className="synaptic-metrics" style={!synapticMatrix.activeConcept ? {borderTop: 'none'} : {}}>
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
                    <div key={alert.id} className="rie-insight-item emergent-insight">
                        <span className="emergent-insight-title">Emergent Insight</span>
                        <p className="rie-insight-model-update">
                           {alert.message}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
});