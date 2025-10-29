import React, { useState } from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
// FIX: Imported missing types
import { CorticalColumn, AbstractConcept, NeuroSimulation, GlobalErrorSignal, ProtoSymbol } from '../types.ts';
import { Accordion } from './Accordion.tsx';

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
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={() => modal.open('skillGenesis', {})}>{t('skillGenesis_modal_button')}</button>
            </div>
            
             <div className="panel-subsection-title">{t('neuroCortex_abstractConcepts')}</div>
            {abstractConcepts.length > 0 ? (
                 abstractConcepts.map((concept: AbstractConcept) => (
                    <div 
                        key={concept.id}
                        className="state-item neuro-cortex-item"
                        onMouseEnter={() => setHoveredConceptId(concept.id)}
                        onMouseLeave={() => setHoveredConceptId(null)}
                    >
                        <label title={concept.id}>{concept.name}</label>
                        <div className="state-bar-container">
                            <div className="state-bar" style={{ width: `${concept.activation * 100}%`, backgroundColor: 'var(--accent-color)' }}></div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('neuroCortex_noConcepts')}</div>
            )}
             <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={() => modal.open('abstractConcept', {})}>{t('abstractConcept_modal_button')}</button>
            </div>
            
             <Accordion title={t('neuroCortex_advancedViews')} defaultOpen={false}>
                 <div className="panel-subsection-title">{t('neuroCortex_simulationLog')}</div>
                {simulationLog.length > 0 ? (
                     simulationLog.map((sim: NeuroSimulation) => (
                        <div key={sim.id} className="rie-insight-item">
                             <p><strong>{t('neuroCortex_scenario')}:</strong> "{sim.scenario}"</p>
                             <p><strong>{t('neuroCortex_prediction')}:</strong> "{sim.predictedOutcome}" ({(sim.confidence * 100).toFixed(0)}%)</p>
                        </div>
                    ))
                ) : <div className="kg-placeholder">{t('neuroCortex_noSimulations')}</div>}

                <div className="panel-subsection-title">{t('neuroCortex_globalErrorMap')}</div>
                {globalErrorMap.length > 0 ? (
                    globalErrorMap.map((err: GlobalErrorSignal) => (
                        <div key={err.id} className="veto-log-item">
                           <p><strong>{t('neuroCortex_errorSource')}: {err.source}</strong></p>
                           <p>{t('neuroCortex_correctiveAction')}: {err.correctiveAction}</p>
                           <small>{timeAgo(err.timestamp)}</small>
                        </div>
                    ))
                ) : <div className="kg-placeholder">{t('neuroCortex_noErrors')}</div>}

                <div className="panel-subsection-title">{t('neuroCortex_protoSymbols')}</div>
                 {protoSymbols.length > 0 ? (
                     protoSymbols.map((sym: ProtoSymbol) => (
                         <div key={sym.id} className="state-item">
                            <label title={sym.description}>{sym.label}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${sym.activation * 100}%`, backgroundColor: 'var(--primary-color)' }}></div>
                            </div>
                        </div>
                    ))
                ) : <div className="kg-placeholder">{t('neuroCortex_noSymbols')}</div>}
             </Accordion>
        </div>
    );
});