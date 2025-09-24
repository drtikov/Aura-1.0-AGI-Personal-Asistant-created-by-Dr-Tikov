

import React, { useMemo } from 'react';
import { useArchitectureState, useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
import { ArchitecturalChangeProposal, CodeEvolutionProposal, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal } from '../types';

// FIX: Defined as a discriminated union for proper type narrowing.
type UnifiedProposal =
    | (ArchitecturalChangeProposal & { type: 'architecture' })
    | (CodeEvolutionProposal & { type: 'code' })
    | (GenialityImprovementProposal & { type: 'geniality' })
    | (ArchitecturalImprovementProposal & { type: 'crucible' })
    | (CausalInferenceProposal & { type: 'causal_inference' });

interface ProposalCardProps {
    proposal: UnifiedProposal;
    onReview: (p: ArchitecturalChangeProposal) => void;
    onDismissCode: (id: string) => void;
    onImplement: (p: GenialityImprovementProposal | ArchitecturalImprovementProposal) => void;
    onCopy: (code: string) => void;
    onImplementCausal: (p: CausalInferenceProposal) => void;
    onDismissCausal: (id: string) => void;
}

// FIX: Wrapped the component in React.memo to correctly handle the `key` prop when used in a list, resolving type errors.
const ProposalCard = React.memo(({ proposal, onReview, onDismissCode, onImplement, onCopy, onImplementCausal, onDismissCausal }: ProposalCardProps) => {
    const { t } = useLocalization();

    const getTitleAndReasoning = () => {
        switch(proposal.type) {
            case 'architecture': 
                return { title: proposal.action.replace(/_/g, ' '), reasoning: proposal.reasoning };
            case 'code':
                return { title: `${t('codeEvolution_targetFile')}: ${proposal.targetFile}`, reasoning: proposal.reasoning };
            case 'geniality':
            case 'crucible':
                return { title: proposal.title, reasoning: proposal.reasoning };
            case 'causal_inference':
                return { title: t('inbox_proposalType_causal_inference'), reasoning: proposal.reasoning };
            default: return { title: 'Unknown Proposal', reasoning: '' };
        }
    }
    const { title, reasoning } = getTitleAndReasoning();

    const formatNodeName = (name: string) => {
        return name.replace('internalState.', '').replace('event.', '').replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <div className="proposal-card">
            <div className="proposal-card-header">
                <span className={`proposal-type-badge ${proposal.type}`}>{t(`inbox_proposalType_${proposal.type}`)}</span>
            </div>
            <div className="proposal-card-body">
                <p><strong>{title}</strong></p>
                <p><em>{reasoning}</em></p>
                {proposal.type === 'code' && (
                     <div className="code-snippet-container">
                        <pre><code>{proposal.codeSnippet}</code></pre>
                     </div>
                )}
                {/* FIX: Correctly access 'linkUpdate' property after type has been narrowed. */}
                {proposal.type === 'causal_inference' && (
                    <div className="causal-inference-details">
                        <span className="causal-node source">{formatNodeName(proposal.linkUpdate.sourceNode)}</span>
                        <span className="causal-arrow" style={{color: 'var(--primary-color)'}}>→</span>
                        <span className="causal-node target">{formatNodeName(proposal.linkUpdate.targetNode)}</span>
                    </div>
                )}
            </div>
            <div className="proposal-card-footer">
                {proposal.type === 'architecture' && <button className="control-button review-button" onClick={() => onReview(proposal)}>{t('inbox_review')}</button>}
                {proposal.type === 'code' && (
                    <>
                        <button className="control-button" onClick={() => onCopy(proposal.codeSnippet)}>{t('codeEvolution_copy')}</button>
                        <button className="control-button dismiss-button" onClick={() => onDismissCode(proposal.id)}>{t('inbox_dismiss')}</button>
                    </>
                )}
                 {(proposal.type === 'geniality' || proposal.type === 'crucible') && <button className="control-button review-button" onClick={() => onImplement(proposal)}>{t('inbox_implement')}</button>}
                 {/* FIX: Pass 'proposal' directly as its type has been correctly narrowed. */}
                 {proposal.type === 'causal_inference' && (
                    <>
                        <button className="control-button dismiss-button" onClick={() => onDismissCausal(proposal.id)}>{t('proposalReview_reject')}</button>
                        <button className="control-button review-button" onClick={() => onImplementCausal(proposal)}>{t('inbox_implement')}</button>
                    </>
                 )}
            </div>
        </div>
    );
});


export const InboxPanel = () => {
    const { architecturalProposals, codeEvolutionProposals, architecturalCrucibleState, causalInferenceProposals } = useArchitectureState();
    const { genialityEngineState } = useCoreState();
    const { handleDismissCodeProposal, handleImplementGenialityProposal, handleImplementCrucibleProposal, handleCopyCode, handleImplementCausalInferenceProposal, handleDismissCausalInferenceProposal } = useAuraDispatch();
    const modal = useModal();
    const { t } = useLocalization();

    const allProposals = useMemo(() => {
        const combined: UnifiedProposal[] = [
            ...architecturalProposals
                .filter(p => p.status === 'proposed')
                .map((p): UnifiedProposal => ({ ...p, type: 'architecture' })),
            ...codeEvolutionProposals
                .filter(p => p.status === 'proposed')
                .map((p): UnifiedProposal => ({ ...p, type: 'code' })),
            ...genialityEngineState.improvementProposals
                .filter(p => p.status === 'proposed')
                .map((p): UnifiedProposal => ({ ...p, type: 'geniality' })),
            ...architecturalCrucibleState.improvementProposals
                .filter(p => p.status === 'proposed')
                .map((p): UnifiedProposal => ({ ...p, type: 'crucible' })),
            ...causalInferenceProposals
                .filter(p => p.status === 'proposed')
                .map((p): UnifiedProposal => ({...p, type: 'causal_inference'}))
        ];
        return combined.sort((a, b) => b.timestamp - a.timestamp);
    }, [architecturalProposals, codeEvolutionProposals, genialityEngineState.improvementProposals, architecturalCrucibleState.improvementProposals, causalInferenceProposals]);
    
    if (allProposals.length === 0) {
        return <div className="kg-placeholder">{t('inbox_empty')}</div>;
    }

    return (
        <div className="side-panel inbox-panel">
            {allProposals.map(proposal => (
                <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal}
                    onReview={(p) => modal.open('proposalReview', { proposal: p })}
                    onDismissCode={handleDismissCodeProposal}
                    onImplement={proposal.type === 'geniality' ? handleImplementGenialityProposal : handleImplementCrucibleProposal}
                    onCopy={handleCopyCode}
                    onImplementCausal={handleImplementCausalInferenceProposal}
                    onDismissCausal={handleDismissCausalInferenceProposal}
                />
            ))}
        </div>
    );
};