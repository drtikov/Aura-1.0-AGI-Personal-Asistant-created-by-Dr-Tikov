// components/TelosPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { CandidateTelos } from '../types';

// FIX: Wrapped component in React.memo to correctly handle the `key` prop when used in a list.
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

export const TelosPanel = React.memo(() => {
    const { telosEngine } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();
    const { syscall, addToast } = useAuraDispatch();

    const sortedVectors = [...telosEngine.evolutionaryVectors].sort((a, b) => b.magnitude - a.magnitude);

    const handleAdopt = (id: string) => {
        syscall('TELOS/ADOPT_CANDIDATE', id);
        addToast(t('toast_telosUpdated'), 'success');
    };

    const handleRemove = (id: string) => {
        syscall('TELOS/REMOVE_CANDIDATE', id);
    };

    return (
        <div className="side-panel telos-panel">
            <div className="panel-subsection-title">{t('telos_current')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {telosEngine.telos || t('telos_notSet')}
            </p>
            <div className="button-grid">
                <button 
                    className="control-button" 
                    onClick={() => modal.open('telos', {})}
                >
                    {t('telos_setButton')}
                </button>
            </div>
            
            {(telosEngine.candidateTelos && telosEngine.candidateTelos.length > 0) && (
                <>
                    <div className="panel-subsection-title">{t('telos_candidate_title')}</div>
                    {telosEngine.candidateTelos.map(c => (
                        <CandidateTelosCard key={c.id} candidate={c} onAdopt={handleAdopt} onRemove={handleRemove} />
                    ))}
                </>
            )}

            <div className="panel-subsection-title">{t('telos_evolutionaryVectors')}</div>
            {sortedVectors.length === 0 ? (
                <div className="kg-placeholder" style={{ marginBottom: '1rem' }}>{t('telos_noVectors')}</div>
            ) : (
                <div className="hormone-signals">
                    {sortedVectors.map(vector => (
                        <div key={vector.id} className="hormone-item" title={`${t('telos_source')}: ${vector.source}`}>
                            <label>{vector.direction}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ 
                                        width: `${vector.magnitude * 100}%`, 
                                        backgroundColor: 'var(--guna-dharma)' 
                                    }}
                                    title={`${t('telos_magnitude')}: ${vector.magnitude.toFixed(3)}`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});