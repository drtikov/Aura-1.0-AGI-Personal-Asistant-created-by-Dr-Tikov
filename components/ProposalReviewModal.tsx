// components/ProposalReviewModal.tsx
import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { ArchitecturalChangeProposal } from '../types.ts';
import { Modal } from './Modal.tsx';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useLocalization } from '../context/AuraContext.tsx';

export const ProposalReviewModal = ({ proposal, onApprove, onReject, onClose }: { proposal: ArchitecturalChangeProposal | null, onApprove: (proposal: ArchitecturalChangeProposal) => void, onReject: (id: string) => void, onClose: () => void }) => {
    const { t } = useLocalization();
    
    const footer = proposal ? (
        <>
            <button className="proposal-reject-button" onClick={() => onReject(proposal.id)}>{t('proposalReview_reject')}</button>
            <button className="proposal-approve-button" onClick={() => onApprove(proposal)}>{t('proposalReview_approve')}</button>
        </>
    ) : null;

    const renderProposalDetails = () => {
        if (!proposal) return null;
        
        return (
            <div className="proposal-details">
                <p><strong>{t('proposalReview_action')}:</strong> <span className="proposal-action">{proposal.action.replace(/_/g, ' ')}</span></p>
                {Array.isArray(proposal.target) ? (
                    <div>
                        <strong>{t('proposalReview_targets')}:</strong>
                        <ul>
                            {proposal.target.map(t => <li key={t} className="proposal-target">{t}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p><strong>{t('architecturePanel_target')}:</strong> <span className="proposal-target">{proposal.target}</span></p>
                )}
                {/* FIX: Removed impossible condition. 'DEPRECATE_SKILL' is not a valid action. */}
                {proposal.newModule && (
                    <p><strong>{t('proposalReview_resultingSkill')}:</strong> <span className="proposal-new-module">{proposal.newModule}</span></p>
                )}
            </div>
        );
    }

    return (
        <Modal
            isOpen={!!proposal}
            onClose={onClose}
            title={t('proposalReview')}
            footer={footer}
            className="proposal-modal"
        >
            {proposal && (
                <>
                    <div className="trace-section">
                        <h4>{t('proposalReview_agiReasoning')}</h4>
                        <p className="reasoning-text">"{proposal.reasoning}"</p>
                    </div>
                     {proposal.arbiterReasoning && (
                        <div className="trace-section arbiter-recommendation">
                            <h4>{t('proposalReview_arbiterAnalysis')}</h4>
                            <p>
                                {t('proposalReview_arbiterRecommendation', { confidence: (proposal.confidence! * 100).toFixed(0) })}
                            </p>
                            <p className="reasoning-text">"{proposal.arbiterReasoning}"</p>
                        </div>
                    )}
                    <div className="trace-section">
                        <h4>{t('proposalReview_proposedChange')}</h4>
                        {renderProposalDetails()}
                    </div>
                </>
            )}
        </Modal>
    );
};