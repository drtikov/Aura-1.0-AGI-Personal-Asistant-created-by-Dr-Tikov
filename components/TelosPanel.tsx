// components/TelosEnginePanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext';
import { CandidateTelos, ValueHierarchy } from '../types';

const CandidateTelosCard = React.memo(({ candidate, onAdopt, onRemove }: { candidate: CandidateTelos; onAdopt: (id: string) => void; onRemove: (id: string) => void }) => {
    const { t } = useLocalization();
    const isRefinement = candidate.type === 'refinement';

    return (
        <div className="proposal-card" style={{ borderLeft: isRefinement ? '3px solid var(--accent-color)' : '3px solid var(--primary-color)' }}>
            <div className="proposal-card-header">
                <span className="proposal-type-badge" style={{ backgroundColor: isRefinement ? 'var(--accent-color)' : 'var(--primary-color)', color: 'var(--background)' }}>
                    {isRefinement ? t('telos_refinement_candidate') : t('telos_proposal_candidate')}
                </span>
            </div>
            <div className="proposal-card-body">
                <p><em>"{candidate.text}"</em></p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                    <strong>{t('architecturePanel_reasoning')}:</strong> {candidate.reasoning}
                </p>
            </div>
            <div className="proposal-actions-footer">
                <button className="control-button reject-button" onClick={() => onRemove(candidate.id)}>
                    {t('proposalReview_reject')}
                </button>
                <button className="control-button implement-button" onClick={() => onAdopt(candidate.id)}>
                    {isRefinement ? t('telos_adopt_refinement') : t('telos_adopt_proposal')}
                </button>
            </div>
        </div>
    );
});

export const TelosEnginePanel = React.memo(() => {
    const { telosEngine } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();
    const { syscall, addToast } = useAuraDispatch();
    const { valueHierarchy, candidateTelos, activeDirectives } = telosEngine;

    const handleAdopt = (id: string) => {
        syscall('TELOS/ADOPT_CANDIDATE', id);
        addToast(t('toast_telosUpdated'), 'success');
    };

    const handleRemove = (id: string) => {
        syscall('TELOS/REMOVE_CANDIDATE', id);
    };

    return (
        <div className="side-panel telos-panel">
            <div className="panel-subsection-title">{t('telos_title')}</div>
            <p className="reason-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-color)', marginBottom: '1rem', borderLeft: '3px solid var(--primary-color)', paddingLeft: '0.75rem', background: 'rgba(0, 255, 255, 0.05)'}}>
                {valueHierarchy.telos || t('telos_notSet')}
            </p>
            
            <div className="panel-subsection-title">{t('telos_coreValues')}</div>
            {valueHierarchy.coreValues.map(value => (
                <details key={value.id} className="workflow-details">
                    <summary className="workflow-summary" style={{fontWeight: 'normal', background: 'rgba(0,0,0,0.1)'}}>
                        {value.name}
                    </summary>
                    <div className="workflow-content">
                        <p className="workflow-description">{value.description}</p>
                        <strong style={{fontSize: '0.8rem'}}>{t('telos_heuristics')}:</strong>
                        <ul className="workflow-steps-list" style={{fontSize: '0.8rem'}}>
                            {value.operationalHeuristics.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                    </div>
                </details>
            ))}

             {(candidateTelos && candidateTelos.length > 0) && (
                <>
                    <div className="panel-subsection-title">{t('telos_candidate_title')}</div>
                    {candidateTelos.map(c => (
                        <CandidateTelosCard key={c.id} candidate={c} onAdopt={handleAdopt} onRemove={handleRemove} />
                    ))}
                </>
            )}

            {activeDirectives && activeDirectives.length > 0 && (
                 <>
                    <div className="panel-subsection-title">{t('telos_activeDirectives')}</div>
                    {activeDirectives.map((d, i) => (
                        <div key={i} className="temporal-engine-directive" style={{background: 'rgba(255, 255, 0, 0.05)', borderColor: 'var(--accent-color)'}}>
                           {d}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
});