import React, { useState } from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { CorticalColumn, AbstractConcept, NeuroSimulation, GlobalErrorSignal, ProtoSymbol } from '../types';
import { Accordion } from './Accordion';

export const NeuroCortexPanel = React.memo(() => {
    const { neuroCortexState } = useArchitectureState();
    const { t } = useLocalization();
    const modal = useModal();
    const { layers, columns, metrics, abstractConcepts, resourceFocus, simulationLog, globalErrorMap, protoSymbols } = neuroCortexState;
    const [hoveredConceptId, setHoveredConceptId] = useState<string | null>(null);

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    const hoveredConcept = abstractConcepts.find(c => c.id === hoveredConceptId);
    const constituentIds = hoveredConcept ? new Set(hoveredConcept.constituentColumnIds) : new Set();

    const isHighlighted = (col: CorticalColumn) => {
        if (constituentIds.has(col.id)) return true;
        switch (resourceFocus) {
            case 'linguistic':
                return col.specialty.toLowerCase().includes('linguistic');
            case 'sensory':
                return col.specialty.toLowerCase().includes('visual');
            case 'abstract':
                // In a more advanced system, we'd check if the column is part of an active abstract concept
                return col.specialty.toLowerCase().includes('music theory'); // Example
            default:
                return false;
        }
    };

    return (
        <div className="side-panel neuro-cortex-panel">
            <div className="synaptic-metrics">
                <div className="metric-item">
                    <span className="metric-label">{t('neuroCortex_coherence')}</span>
                    <span className="metric-value">{(metrics.hierarchicalCoherence * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('neuroCortex_predictiveAccuracy')}</span>
                    <span className="metric-value">{(metrics.predictiveAccuracy * 100).toFixed(1)}%</span>
                </div>
            </div>

            <div className="panel-subsection-title">{t('neuroCortex_columns')}</div>
            {columns.length > 0 ? (
                columns.map((col: CorticalColumn) => (
                    <div 
                        key={col.id} 
                        className={`state-item neuro-cortex-item ${isHighlighted(col) ? 'highlighted' : ''}`}
                    >
                        <label title={col.id}>{col.specialty}</label>
                        <div className="state-bar-container">
                            <div
                                className="state-bar"
                                style={{ width: `${col.activation * 100}%`, backgroundColor: 'var(--primary-color)' }}
                                title={`${t('neuroCortex_activation')}: ${(col.activation * 100).toFixed(0)}%`}
                            ></div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('neuroCortex_noColumns')}</div>
            )}
            
            <div className="panel-subsection-title">{t('neuroCortex_abstractConcepts')}</div>
            {abstractConcepts.length > 0 ? (
                abstractConcepts.map((concept: AbstractConcept) => (
                    <div 
                        key={concept.id}
                        className="state-item"
                        onMouseEnter={() => setHoveredConceptId(concept.id)}
                        onMouseLeave={() => setHoveredConceptId(null)}
                    >
                        <label title={`Columns: ${concept.constituentColumnIds.length}`}>{concept.name}</label>
                        <div className="state-bar-container">
                             <div
                                className="state-bar"
                                style={{ width: `${concept.activation * 100}%`, backgroundColor: 'var(--accent-color)' }}
                                title={`${t('neuroCortex_activation')}: ${(concept.activation * 100).toFixed(0)}%`}
                            ></div>
                        </div>
                    </div>
                ))
            ) : (
                 <div className="kg-placeholder">{t('neuroCortex_noConcepts')}</div>
            )}


            <div className="button-grid" style={{marginTop: '1rem', gridTemplateColumns: '1fr 1fr'}}>
                <button className="control-button" onClick={() => modal.open('skillGenesis', {})}>
                    {t('neuroCortex_specializeButton')}
                </button>
                <button className="control-button" onClick={() => modal.open('abstractConcept', {})}>
                    {t('neuroCortex_synthesizeButton')}
                </button>
            </div>
            
            <div className="panel-subsection-title">{t('neuroCortex_corticalLayers')}</div>
            <div className="layers-list">
                 {Object.entries(layers).map(([key, layer]: [string, { name: string; description: string }]) => (
                    <div key={key} className="layer-item">
                        <strong>{layer.name} ({key.replace('layer','L').replace('II_III', 'II' + '/' + 'III').replace('VII', 'VII').replace('VIII', 'VIII').replace('IX', 'IX').replace('X','X')}):</strong> <span>{layer.description}</span>
                    </div>
                ))}
            </div>

            <Accordion title="L-VII: Meta-Coordination" defaultOpen={false}>
                <div className="awareness-item">
                    <label>{t('neuroCortex_resourceFocus')}</label>
                    <strong style={{textTransform: 'capitalize'}}>{resourceFocus}</strong>
                </div>
                 <div className="state-item">
                    <label>{t('neuroCortex_systemSynchronization')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar coherence-bar" style={{ width: `${metrics.systemSynchronization * 100}%` }} />
                    </div>
                </div>
            </Accordion>

            <Accordion title="L-VIII: Simulation Log" defaultOpen={false}>
                 {simulationLog.length > 0 ? (
                    simulationLog.map((sim: NeuroSimulation) => (
                        <div key={sim.id} className="rie-insight-item" style={{background: 'rgba(0,0,0,0.1)'}}>
                             <div className="rie-insight-header">
                                <strong>"{sim.scenario}"</strong>
                                <small>{timeAgo(sim.timestamp)}</small>
                            </div>
                            <p className="rie-insight-model-update">
                                <strong>{t('neuroCortex_simOutcome')}:</strong> "{sim.predictedOutcome}" 
                                <span className="rie-insight-model-update-value"> ({(sim.confidence * 100).toFixed(0)}%)</span>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">{t('neuroCortex_noSimulations')}</div>
                )}
            </Accordion>
            
            <Accordion title="L-IX: Error Synthesis Map" defaultOpen={false}>
                 <div className="awareness-item" style={{marginBottom: '0.5rem'}}>
                    <label>{t('neuroCortex_integrationStatus')}</label>
                    <strong style={{textTransform: 'capitalize'}}>{metrics.errorIntegrationStatus}</strong>
                </div>
                 {globalErrorMap.length > 0 ? (
                    globalErrorMap.map((err: GlobalErrorSignal) => (
                        <div key={err.id} className="veto-log-item" style={{borderLeftColor: 'var(--failure-color)'}}>
                             <div className="veto-action" style={{ display: 'flex', justifyContent: 'space-between'}}>
                                <strong>{t('neuroCortex_errorSource')}: {err.source}</strong>
                                <small style={{color: 'var(--text-muted)'}}>{timeAgo(err.timestamp)}</small>
                            </div>
                            <p className="veto-reason"><strong>{t('neuroCortex_correction')}:</strong> {err.correctiveAction}</p>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">{t('neuroCortex_noErrors')}</div>
                )}
            </Accordion>
            
            <Accordion title="L-X: Emergent Symbols" defaultOpen={false}>
                 {protoSymbols.length > 0 ? (
                    protoSymbols.map((sym: ProtoSymbol) => (
                         <div key={sym.id} className="state-item">
                            <label title={sym.description}>{sym.label}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${sym.activation * 100}%`, backgroundColor: 'var(--guna-dharma)' }} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">{t('neuroCortex_noSymbols')}</div>
                )}
            </Accordion>

        </div>
    );
});