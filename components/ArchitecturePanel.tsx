import React from 'react';
import { ArchitecturalChangeProposal } from '../types';

export const ArchitecturePanel = React.memo(({ proposals, onReview }: { proposals: ArchitecturalChangeProposal[], onReview: (proposal: ArchitecturalChangeProposal) => void }) => (
    <div className="side-panel architecture-panel">
        <div className="architecture-content">
            {proposals.length === 0 ? <div className="kg-placeholder">No proposals. Use "Evolve" to generate new ones.</div> : proposals.map((p) => (
                <div key={p.id} className={`arch-proposal status-${p.status}`}>
                    <div className="arch-header"> <span className="arch-type">{p.action.replace('_', ' ')}</span> <span className={`arch-status status-${p.status}`}>{p.status}</span> </div>
                    <div className="arch-body"> <p><strong>Target:</strong> {p.target}</p> <p><strong>Upgrade:</strong> {p.newModule}</p> <p><strong>Reasoning:</strong> <em>{p.reasoning}</em></p> </div>
                    {p.status === 'proposed' && <div className="arch-actions"><button onClick={() => onReview(p)}>Review</button></div>}
                </div>
            ))}
        </div>
    </div>
));
