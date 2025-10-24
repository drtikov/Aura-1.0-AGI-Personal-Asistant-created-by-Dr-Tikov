// components/AutonomousEvolutionModal.tsx
import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useArchitectureState } from '../context/AuraContext.tsx';
import { UnifiedProposal, SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate, ArchitecturalChangeProposal, PsycheProposal, AnalogicalHypothesisProposal } from '../types.ts';
import { HAL } from '../core/hal.ts';

const CodeSnippet = ({ code, title }: { code: string; title?: string }) => {
    const { addToast } = useAuraDispatch();
    const handleCopy = () => {
        HAL.Clipboard.writeText(code).then(() => {
            addToast('Code snippet copied to clipboard!', 'success');
        }, () => {
            addToast('Failed to copy code.', 'error');
        });
    };
    return (
        <div className="code-snippet-container vfs-viewer">
            {title && <div className="panel-subsection-title" style={{ marginTop: 0, marginBottom: '0.5rem' }}>{title}</div>}
            <pre><code>{code}</code></pre>
            <button className="copy-snippet-button" onClick={handleCopy} title="Copy Snippet">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
        </div>
    );
};

const ProposalDisplay = ({ proposal }: { proposal: UnifiedProposal }) => {
    const { t } = useLocalization();
    const { syscall, handleImplementSelfProgramming, handleLiveLoadPlugin, approveProposal } = useAuraDispatch();
    const [isSelected, setIsSelected] = useState(false);

    const handleImplement = (candidate: SelfProgrammingCandidate) => {
        if (HAL.UI.confirm("Implement this autonomous code change? This will require a seamless system reboot.")) {
            handleImplementSelfProgramming(candidate);
        }
    };

    const handleLiveLoad = (candidate: CreateFileCandidate) => {
        if (HAL.UI.confirm("Attempt to live-load this new plugin without a reboot? This is experimental.")) {
            handleLiveLoadPlugin(candidate);
        }
    }

    const handleReject = (id: string) => {
        syscall('OA/UPDATE_PROPOSAL', { id, updates: { status: 'rejected' } });
    };

    const handleApprove = (proposal: ArchitecturalChangeProposal) => {
         if (HAL.UI.confirm("Approve this architectural change? This will require a seamless system reboot.")) {
            approveProposal(proposal);
        }
    }

    const canLiveLoad = proposal.proposalType === 'self_programming_create' && !!(proposal as CreateFileCandidate).newPluginObject;

    const renderDetails = () => {
        switch(proposal.proposalType) {
            case 'self_programming_create': {
                const p = proposal as CreateFileCandidate;
                return (
                    <>
                        <CodeSnippet code={p.newFile.content} title={`${t('selfProgramming_newComponentTitle')}: ${p.newFile.path}`} />
                        {p.integrations.length > 0 && (
                            <div style={{marginTop: '1rem'}}>
                                {/* FIX: Wrap mapped component in React.Fragment to correctly handle the `key` prop. */}
                                {p.integrations.map((mod, index) => (
                                    <React.Fragment key={index}>
                                        <CodeSnippet code={mod.newContent} title={`${t('selfProgramming_modificationTitle')}: ${mod.filePath}`} />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </>
                )
            }
            case 'self_programming_modify': {
                 const p = proposal as ModifyFileCandidate;
                 return <CodeSnippet code={p.codeSnippet} title={`${t('selfProgramming_modificationTitle')}: ${p.targetFile}`} />;
            }
            case 'architecture': {
                // FIX: Cast to the correct, more specific type to access properties safely.
                const p = proposal as ArchitecturalChangeProposal;
                return <p><strong>Action:</strong> {p.action}<br/><strong>Target:</strong> {p.target}</p>;
            }
            case 'analogical_hypothesis': {
                const p = proposal as AnalogicalHypothesisProposal;
                return (
                    <div>
                        <p><strong>Analogy:</strong> <em>{p.analogy}</em></p>
                        <p><strong>Conjecture:</strong> {p.conjecture}</p>
                    </div>
                );
            }
            case 'psyche': {
                const p = proposal as PsycheProposal;
                return (
                    <div>
                        <p><strong>New Concept:</strong> {p.proposedConceptName}</p>
                        <p><strong>Sources:</strong> {p.sourceConcepts.map(s=>s.description).join(', ')}</p>
                    </div>
                );
            }
            default:
                return <p>Details not available for this proposal type.</p>;
        }
    };
    
    const renderFooter = () => {
        // FIX: Add 'simulation_failed' to status check to correctly display actions for failed simulations.
        if (proposal.status === 'proposed' || proposal.status === 'evaluated' || proposal.status === 'simulation_failed') {
            switch(proposal.proposalType) {
                case 'self_programming_create':
                case 'self_programming_modify':
                    return (
                        <div className="proposal-actions-footer">
                            <button className="control-button reject-button" onClick={() => handleReject(proposal.id)}>Reject</button>
                            {canLiveLoad && <button className="control-button" style={{borderColor: 'var(--accent-color)', color: 'var(--accent-color)'}} onClick={() => handleLiveLoad(proposal as CreateFileCandidate)}>Live Load Plugin</button>}
                            <button className="control-button implement-button" onClick={() => handleImplement(proposal as SelfProgrammingCandidate)}>Implement & Reboot</button>
                        </div>
                    );
                case 'architecture':
                case 'psyche':
                     return (
                        <div className="proposal-actions-footer">
                            <button className="control-button reject-button" onClick={() => handleReject(proposal.id)}>Reject</button>
                            {/* FIX: Cast to 'any' then to the target type to bypass strict overlap checks for union types. */}
                            <button className="control-button implement-button" onClick={() => handleApprove(proposal as any as ArchitecturalChangeProposal)}>Approve & Reboot</button>
                        </div>
                    );
                default:
                     return (
                        <div className="proposal-actions-footer">
                            <button className="control-button reject-button" onClick={() => handleReject(proposal.id)}>Reject</button>
                        </div>
                    );
            }
        }
        return null;
    };

    return (
        <div className={`proposal-card type-${proposal.proposalType}`}>
            <div className="proposal-card-header" onClick={() => setIsSelected(!isSelected)} style={{ cursor: 'pointer' }}>
                <span className={`proposal-type-badge ${proposal.proposalType}`}>{proposal.proposalType.replace(/_/g, ' ')}</span>
                <strong className={`status-${proposal.status}`}>{proposal.status.replace(/_/g, ' ')}</strong>
            </div>
            <div className="proposal-card-body">
                {/* FIX: Add a type guard to ensure 'reasoning' property exists before accessing it. */}
                {'reasoning' in proposal && <p><em>{proposal.reasoning}</em></p>}

                {/* FIX: Add 'simulation_failed' to status check to correctly display failure reasons. */}
                {proposal.status === 'simulation_failed' && (
                    <div className="failure-reason-display">
                        <strong>Simulation Failed:</strong>
                        <p>{(proposal as SelfProgrammingCandidate).failureReason || 'No specific reason provided.'}</p>
                    </div>
                )}

                {isSelected && (
                    <div className="candidate-details-container" style={{marginTop: '1rem'}}>
                        {renderDetails()}
                    </div>
                )}
            </div>
            {renderFooter()}
        </div>
    );
};

export const AutonomousEvolutionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { ontogeneticArchitectState } = useArchitectureState();

    const allProposals = [...ontogeneticArchitectState.proposalQueue].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('evolution_log')}
            className="advanced-controls-modal" // Use large modal style
        >
            <div className="advanced-controls-content">
                {allProposals.length === 0 ? (
                    <div className="kg-placeholder" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        The evolution log is empty. Autonomous systems have not generated any proposals yet.
                    </div>
                ) : (
                    allProposals.map(proposal => (
                        <React.Fragment key={proposal.id}>
                            <ProposalDisplay proposal={proposal} />
                        </React.Fragment>
                    ))
                )}
            </div>
        </Modal>
    );
};