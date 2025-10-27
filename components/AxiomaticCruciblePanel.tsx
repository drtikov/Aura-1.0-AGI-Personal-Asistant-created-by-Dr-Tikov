// components/AxiomaticCruciblePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { ProposedAxiom } from '../types.ts';
import { Accordion } from './Accordion.tsx';

export const AxiomaticCruciblePanel = () => {
    const { axiomaticCrucibleState } = useArchitectureState();
    const { t } = useLocalization();
    const { axioms, inconsistencyLog } = axiomaticCrucibleState;

    return (
        <div className="side-panel axiomatic-crucible-panel">
             <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This panel stores high-level mathematical truths (Axioms) that have been formally proven by Aura's ATP Coprocessor. They form a foundational layer of verified knowledge.
            </p>

            <Accordion title="Core Axioms" defaultOpen={true}>
                {axioms.length === 0 ? (
                    <div className="kg-placeholder">No axioms have been proven and stored yet.</div>
                ) : (
                    axioms.map((axiom: ProposedAxiom) => (
                        <div key={axiom.id} className="axiom-card accepted">
                             <div className="mod-log-header">
                                <span className="mod-log-type">Validated Axiom</span>
                                <span className="mod-log-status" style={{textTransform: 'capitalize'}}>{axiom.status}</span>
                            </div>
                            <p className="axiom-card-text">"{axiom.axiom}"</p>
                            <p className="axiom-card-source"><strong>Source:</strong> "{axiom.source}"</p>
                        </div>
                    ))
                )}
            </Accordion>

            <Accordion title="Axiom Guardian Log" defaultOpen={false}>
                 {inconsistencyLog && inconsistencyLog.length > 0 ? (
                    inconsistencyLog.map((log, index) => (
                        <div key={index} className="veto-log-item" style={{ borderLeftColor: 'var(--failure-color)'}}>
                            <p className="veto-reason"><strong>Inconsistency Found:</strong> {log}</p>
                        </div>
                    ))
                 ) : (
                    <div className="kg-placeholder">No logical inconsistencies detected by the Axiom Guardian.</div>
                 )}
            </Accordion>
        </div>
    );
};