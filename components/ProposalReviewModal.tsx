import React from 'react';
import { ArchitecturalChangeProposal } from '../types';
import { Modal } from './Modal';

export const ProposalReviewModal = ({ proposal, onApprove, onReject, onClose }: { proposal: ArchitecturalChangeProposal | null, onApprove: (proposal: ArchitecturalChangeProposal) => void, onReject: (id: string) => void, onClose: () => void }) => {
    
    const footer = proposal ? (
        <>
            <button className="proposal-reject-button" onClick={() => onReject(proposal.id)}>Reject</button>
            <button className="proposal-approve-button" onClick={() => onApprove(proposal)}>Approve</button>
        </>
    ) : null;

    const renderProposalDetails = () => {
        if (!proposal) return null;
        
        return (
            <div className="proposal-details">
                <p><strong>Action:</strong> <span className="proposal-action">{proposal.action.replace(/_/g, ' ')}</span></p>
                {Array.isArray(proposal.target) ? (
                    <div>
                        <strong>Targets:</strong>
                        <ul>
                            {proposal.target.map(t => <li key={t} className="proposal-target">{t}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p><strong>Target:</strong> <span className="proposal-target">{proposal.target}</span></p>
                )}
                {proposal.newModule && proposal.action !== 'DEPRECATE_SKILL' && (
                    <p><strong>Resulting Skill:</strong> <span className="proposal-new-module">{proposal.newModule}</span></p>
                )}
            </div>
        );
    }

    return (
        <Modal
            isOpen={!!proposal}
            onClose={onClose}
            title="Architectural Evolution Proposal"
            footer={footer}
            className="proposal-modal"
        >
            {proposal && (
                <>
                    <div className="trace-section">
                        <h4>AGI's Reasoning</h4>
                        <p className="reasoning-text">"{proposal.reasoning}"</p>
                    </div>
                     {proposal.arbiterReasoning && (
                        <div className="trace-section arbiter-recommendation">
                            <h4>Cognitive Arbiter Analysis</h4>
                            <p>
                                The Cognitive Arbiter recommends <strong>user approval</strong> with <strong>{(proposal.confidence! * 100).toFixed(0)}%</strong> confidence.
                            </p>
                            <p className="reasoning-text">"{proposal.arbiterReasoning}"</p>
                        </div>
                    )}
                    <div className="trace-section">
                        <h4>Proposed Change</h4>
                        {renderProposalDetails()}
                    </div>
                </>
            )}
        </Modal>
    );
};