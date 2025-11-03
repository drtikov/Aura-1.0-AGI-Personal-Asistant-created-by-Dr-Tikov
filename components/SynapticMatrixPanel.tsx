// components/SynapticMatrixPanel.tsx
import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { SynapticLink } from '../types';

export const SynapticMatrixPanel = React.memo(() => {
    const { synapticMatrix } = useArchitectureState();
    const { t } = useLocalization();

    const strongestLinks = useMemo(() => {
        return Object.entries(synapticMatrix.links)
            .map(([key, link]) => ({ key, ...link as SynapticLink }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 10);
    }, [synapticMatrix.links]);
    
    const getCausalityArrow = (causality: number) => {
        if (causality > 0.1) return { arrow: '→', class: 'excitatory', title: 'Excitatory' };
        if (causality < -0.1) return { arrow: '—|', class: 'inhibitory', title: 'Inhibitory' };
        return { arrow: '↔', class: 'neutral', title: 'Correlated' };
    };
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className={`side-panel synaptic-matrix-panel ${synapticMatrix.isAdapting ? 'adapting' : ''}`}>
            <div className="synaptic-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('synaptic_synapses', {defaultValue: 'Synapses'})}</span>
                    <span className="metric-value">{synapticMatrix.synapseCount}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('synaptic_plasticity', {defaultValue: 'Plasticity'})}</span>
                    <span className="metric-value">{(synapticMatrix.plasticity * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('synaptic_efficiency', {defaultValue: 'Efficiency'})}</span>
                    <span className="metric-value">{(synapticMatrix.efficiency * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('synaptic_avgConfidence', {defaultValue: 'Avg. Confidence'})}</span>
                    <span className="metric-value">{synapticMatrix.avgConfidence.toFixed(2)}</span>
                </div>
            </div>

            {synapticMatrix.isAdapting && (
                <div className="adaptation-indicator">
                    <div className="spinner-small"></div>
                    <span>{t('synaptic_adapting', {defaultValue: 'Adapting Synapses...'})}</span>
                </div>
            )}
            
            {synapticMatrix.activeConcept && (
                <div className="synaptic-active-concept">
                    <span className="metric-label">{t('synaptic_activeConcept', {defaultValue: 'Active Concept'})}</span>
                    <div className="metric-value">{synapticMatrix.activeConcept}</div>
                </div>
            )}
            
            <div className="panel-subsection-title">{t('synaptic_strongestLinks', {defaultValue: 'Strongest Causal Links'})}</div>
            <div className="causal-links-list">
                {strongestLinks.length > 0 ? (
                    strongestLinks.map(link => {
                        const [source, target] = link.key.split('--');
                        const causalityInfo = getCausalityArrow(link.causality);
                        return (
                            <div key={link.key} className="causal-link-item">
                                <div className="causal-node source">{source}</div>
                                <div className="causal-connection" title={`${causalityInfo.title}, Weight: ${link.weight.toFixed(2)}`}>
                                    <span className={`causal-arrow ${causalityInfo.class}`}>{causalityInfo.arrow}</span>
                                    <div className="causal-confidence-bar" style={{'--confidence': `${link.confidence * 100}%`} as React.CSSProperties}></div>
                                    <span className="causal-confidence-text">{(link.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="causal-node target">{target}</div>
                            </div>
                        )
                    })
                ) : (
                    <div className="kg-placeholder">{t('synaptic_noLinks', {defaultValue: 'No causal links learned yet.'})}</div>
                )}
            </div>

            <div className="panel-subsection-title">{t('synaptic_intuitiveAlerts', {defaultValue: 'Intuitive Alerts'})}</div>
            {synapticMatrix.intuitiveAlerts.length > 0 ? (
                synapticMatrix.intuitiveAlerts.map(alert => (
                    <div key={alert.id} className="causal-link emergent-insight">
                        <span className="emergent-insight-title">{t('synaptic_emergentInsight', {defaultValue: 'Emergent Insight'})}</span>
                        <p>{alert.message}</p>
                    </div>
                ))
            ) : (
                 <div className="kg-placeholder">{t('synaptic_noAlerts', {defaultValue: 'No intuitive alerts active.'})}</div>
            )}

            <div className="panel-subsection-title">{t('synaptic_probeLog_title', {defaultValue: 'Curiosity Probes'})}</div>
            <div className="command-log-list">
                {synapticMatrix.probeLog.length > 0 ? (
                    synapticMatrix.probeLog.map(log => (
                        <div key={log.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">💡</span>
                            <span className="log-text" title={log.message}>{log.message}</span>
                            <span className="log-time">{timeAgo(log.timestamp)}</span>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">{t('synaptic_probeLog_placeholder', {defaultValue: 'No synaptic probes have been initiated.'})}</div>
                )}
            </div>
        </div>
    );
});