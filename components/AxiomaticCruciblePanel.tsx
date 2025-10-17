// components/AxiomaticCruciblePanel.tsx
import React from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { CandidateAxiom } from '../types';

export const AxiomaticCruciblePanel = () => {
    const { axiomaticCrucibleState } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const { status, log, candidateAxioms, mode } = axiomaticCrucibleState;

    const handleStartCycle = () => {
        syscall('CRUCIBLE/START_CYCLE', {});
    };

    const handleStartGrandUnification = () => {
        syscall('CRUCIBLE/START_GRAND_UNIFICATION_CYCLE', {});
    };

    return (
        <div className="side-panel axiomatic-crucible-panel">
            <p className="reason-text">{t('crucible_description')}</p>
            <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong>{status} {status === 'running' && `(${mode} mode)`}</strong>
            </div>

            <div className="button-grid" style={{ margin: '1rem 0', gridTemplateColumns: '1fr 1fr' }}>
                <button 
                    className="control-button" 
                    onClick={handleStartCycle} 
                    disabled={status === 'running'}
                >
                    {status === 'running' ? t('crucible_running') : t('crucible_beginCycle')}
                </button>
                 <button 
                    className="control-button mode-psi" 
                    onClick={handleStartGrandUnification} 
                    disabled={status === 'running'}
                    title="A highly speculative attempt to find unifying principles across all of Aura's knowledge."
                >
                    Grand Unification
                </button>
            </div>

            <div className="panel-subsection-title">{t('crucible_simulationLog')}</div>
            <div className="command-log-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {log.map((entry, index) => (
                    <div key={index} className="command-log-item log-type-info">
                        <span className="log-icon">{status === 'running' && index === log.length - 1 ? <div className="spinner-small" /> : '»'}</span>
                        <span className="log-text">{entry}</span>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('crucible_candidateAxioms')}</div>
            {candidateAxioms.length === 0 ? (
                <div className="kg-placeholder">{t('crucible_noAxioms')}</div>
            ) : (
                candidateAxioms.map((axiom: CandidateAxiom) => (
                    <div key={axiom.id} className="axiom-card" style={{ borderLeft: '3px solid var(--primary-color)' }}>
                        <p className="axiom-card-text">"{axiom.axiomText}"</p>
                        <p className="axiom-card-source"><strong>{t('crucible_evidence')}:</strong> {axiom.evidenceFromSimulation}</p>
                        <div className="proposal-actions-footer" style={{justifyContent: 'flex-start'}}>
                            <span className="skill-tag">{t('crucible_elegance')}: {axiom.eleganceScore.toFixed(3)}</span>
                            <span className="skill-tag">{t('crucible_status')}: {axiom.status}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};