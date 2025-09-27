// components/InboxPanel.tsx
import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { ArchitecturalChangeProposal, CodeEvolutionProposal, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal, UnifiedProposal, SelfProgrammingCandidate } from '../types';

interface ProposalCardProps {
    proposal: UnifiedProposal;
    onReview: (p: ArchitecturalChangeProposal) => void;
    onDismiss: (p: UnifiedProposal) => void;
    onImplement: (p: UnifiedProposal) => void;
    onCopy: (code: string) => void;
}

const ProposalCard = React.memo(({ proposal, onReview, onDismiss, onImplement, onCopy }: ProposalCardProps) => {
    const { t } = useLocalization();

    const getTitleAndReasoning = () => {
        switch(proposal.proposalType) {
            case 'architecture': return { title: proposal.action.replace(/_/g, ' '), reasoning: proposal.reasoning };
            case 'code': return { title: `${t('codeEvolution_targetFile')}: ${proposal.targetFile}`, reasoning: proposal.reasoning };
            case 'geniality':
            case 'crucible': return { title: proposal.title, reasoning: proposal.reasoning };
            case 'causal_inference': return { title: t('inbox_proposalType_causal_inference'), reasoning: proposal.reasoning };
            case 'self_programming_create':
            case 'self_programming_modify': return { title: proposal.type === 'CREATE' ? `New File: ${proposal.newFile.path}` : `Modify: ${proposal.targetFile}`, reasoning: proposal.reasoning };
            default: return { title: 'Unknown Proposal', reasoning: '' };
        }
    }
    const { title, reasoning } = getTitleAndReasoning();

    const formatNodeName = (name: string) => name.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

    const renderFooter = () => {
        if (proposal.status !== 'proposed' && proposal.status !== 'evaluated') {
            return <span className={`arch-status status-${proposal.status}`}>{proposal.status}</span>;
        }

        switch(proposal.proposalType) {
            case 'architecture':
                return <button className="control-button review-button" onClick={() => onReview(proposal)}>{t('inbox_review')}</button>;
            case 'code':
                return (
                    <>
                        <button className="control-button" onClick={() => onCopy(proposal.codeSnippet)}>{t('codeEvolution_copy')}</button>
                        <button className="control-button dismiss-button" onClick={() => onDismiss(proposal)}>{t('inbox_dismiss')}</button>
                    </>
                );
            case 'geniality':
            case 'crucible':
                return <button className="control-button review-button" onClick={() => onImplement(proposal)}>{t('inbox_implement')}</button>;
            case 'causal_inference':
                 return (
                    <>
                        <button className="control-button dismiss-button" onClick={() => onDismiss(proposal)}>{t('proposalReview_reject')}</button>
                        <button className="control-button review-button" onClick={() => onImplement(proposal)}>{t('inbox_implement')}</button>
                    </>
                 );
            case 'self_programming_create':
            case 'self_programming_modify':
                 return (
                    <>
                        <span className="evaluation-score" title={`${t('selfProgramming_score')}: ${proposal.evaluationScore?.toFixed(3)}`}>
                            Score: <strong>{proposal.evaluationScore! > 0 ? '+' : ''}{proposal.evaluationScore?.toFixed(2)}</strong>
                        </span>
                        <button className="control-button reject-button" onClick={() => onDismiss(proposal)}>
                            Reject
                        </button>
                        <button className="control-button implement-button" onClick={() => onImplement(proposal)}>
                            Implement
                        </button>
                    </>
                );
            default: return null;
        }
    }

    return (
        <div className="proposal-card">
            <div className="proposal-card-header">
                <span className={`proposal-type-badge ${proposal.proposalType}`}>{t(`inbox_proposalType_${proposal.proposalType}`)}</span>
                {proposal.priority !== undefined && (
                    <span className="priority-score" title="Telos Alignment Score">{proposal.priority.toFixed(2)}</span>
                )}
            </div>
            <div className="proposal-card-body">
                <p><strong>{title}</strong></p>
                <p><em>{reasoning}</em></p>
                {proposal.proposalType === 'code' && (
                     <div className="code-snippet-container"><pre><code>{proposal.codeSnippet}</code></pre></div>
                )}
                {proposal.proposalType === 'causal_inference' && (
                    <div className="causal-inference-details">
                        <span className="causal-node source">{formatNodeName(proposal.linkUpdate.sourceNode)}</span>
                        <span className="causal-arrow" style={{color: 'var(--primary-color)'}}>→</span>
                        <span className="causal-node target">{formatNodeName(proposal.linkUpdate.targetNode)}</span>
                    </div>
                )}
            </div>
            <div className="proposal-card-footer">
                {renderFooter()}
            </div>
        </div>
    );
});


export const InboxPanel = () => {
    const { ontogeneticArchitectState } = useArchitectureState();
    const { handleImplementUnifiedProposal, handleDismissUnifiedProposal, handleCopyCode } = useAuraDispatch();
    const modal = useModal();
    const { t } = useLocalization();

    const sortedProposals = useMemo(() => {
        return [...ontogeneticArchitectState.proposalQueue]
            .filter(p => p.status === 'proposed' || p.status === 'evaluated')
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }, [ontogeneticArchitectState.proposalQueue]);
    
    if (sortedProposals.length === 0) {
        return <div className="kg-placeholder">{t('inbox_empty')}</div>;
    }

    return (
        <div className="side-panel inbox-panel">
            {sortedProposals.map(proposal => (
                <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal}
                    onReview={(p) => modal.open('proposalReview', { proposal: p })}
                    onImplement={handleImplementUnifiedProposal}
                    onDismiss={handleDismissUnifiedProposal}
                    onCopy={handleCopyCode}
                />
            ))}
        </div>
    );
};