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
                    <div className="trace-section"> <h4>Proposed Change</h4> <div className="proposal-details"> <p><strong>Action:</strong> <span className="proposal-action">{proposal.action.replace('_', ' ')}</span></p> <p><strong>Target:</strong> <span className="proposal-target">{proposal.target}</span></p> <p><strong>New Module:</strong> <span className="proposal-new-module">{proposal.newModule}</span></p> </div> </div>
                    <div className="trace-section"> <h4>Reasoning</h4> <p className="reasoning-text">"{proposal.reasoning}"</p> </div>
                </>
            )}
        </Modal>
    );
};