import React, { useMemo } from 'react';
import { useArchitectureState, useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { ArchitecturalChangeProposal, CodeEvolutionProposal, GenialityImprovementProposal, ArchitecturalImprovementProposal } from '../types';

type UnifiedProposal = (ArchitecturalChangeProposal | CodeEvolutionProposal | GenialityImprovementProposal | ArchitecturalImprovementProposal) & { type: 'architecture' | 'code' | 'geniality' | 'crucible' };

const ProposalCard = ({ proposal, onReview, onDismiss, onImplement, onCopy }: { proposal: UnifiedProposal, onReview: (p: ArchitecturalChangeProposal) => void, onDismiss: (id: string) => void, onImplement: (p: GenialityImprovementProposal | ArchitecturalImprovementProposal) => void, onCopy: (code: string) => void }) => {
    const { t } = useLocalization();

    const getTitleAndReasoning = () => {
        switch(proposal.type) {
            case 'architecture': return { title: (proposal as ArchitecturalChangeProposal).action.replace(/_/g, ' '), reasoning: (proposal as ArchitecturalChangeProposal).reasoning };
            case 'code': return { title: (proposal as CodeEvolutionProposal).targetFile, reasoning: (proposal as CodeEvolutionProposal).reasoning };
            case 'geniality':
            case 'crucible': return { title: (proposal as GenialityImprovementProposal).title, reasoning: (proposal as GenialityImprovementProposal).reasoning };
            default: return { title: 'Unknown Proposal', reasoning: '' };
        }
    }
    const { title, reasoning } = getTitleAndReasoning();

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
                        <pre><code>{(proposal as CodeEvolutionProposal).codeSnippet}</code></pre>
                     </div>
                )}
            </div>
            <div className="proposal-card-footer">
                {proposal.type === 'architecture' && <button className="control-button review-button" onClick={() => onReview(proposal as ArchitecturalChangeProposal)}>{t('inbox_review')}</button>}
                {proposal.type === 'code' && (
                    <>
                        <button className="control-button" onClick={() => onCopy((proposal as CodeEvolutionProposal).codeSnippet)}>{t('codeEvolution_copy')}</button>
                        <button className="control-button dismiss-button" onClick={() => onDismiss(proposal.id)}>{t('inbox_dismiss')}</button>
                    </>
                )}
                 {(proposal.type === 'geniality' || proposal.type === 'crucible') && <button className="control-button review-button" onClick={() => onImplement(proposal as GenialityImprovementProposal)}>{t('inbox_implement')}</button>}
            </div>
        </div>
    );
};


export const InboxPanel = () => {
    const { architecturalProposals, codeEvolutionProposals, architecturalCrucibleState } = useArchitectureState();
    const { genialityEngineState } = useCoreState();
    const { handleReviewProposal, handleDismissCodeProposal, handleImplementGenialityProposal, handleImplementCrucibleProposal, handleCopyCode } = useAuraDispatch();
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
                .map((p): UnifiedProposal => ({ ...p, type: 'crucible' }))
        ];
        return combined.sort((a, b) => b.timestamp - a.timestamp);
    }, [architecturalProposals, codeEvolutionProposals, genialityEngineState.improvementProposals, architecturalCrucibleState.improvementProposals]);
    
    if (allProposals.length === 0) {
        return <div className="kg-placeholder">{t('inbox_empty')}</div>;
    }

    return (
        <div className="side-panel inbox-panel">
            {allProposals.map(proposal => (
                <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal}
                    onReview={handleReviewProposal}
                    onDismiss={handleDismissCodeProposal}
                    onImplement={proposal.type === 'geniality' ? handleImplementGenialityProposal : handleImplementCrucibleProposal}
                    onCopy={handleCopyCode}
                />
            ))}
        </div>
    );
};