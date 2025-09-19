import React from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { Action } from '../types';

export const CodeEvolutionPanel = () => {
    const { codeEvolutionProposals } = useArchitectureState();
    const { addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            addToast(t('codeEvolution_copied'), 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast(t('codeEvolution_copyFailed'), 'error');
        });
    };
    
    return (
        <div className="side-panel">
            {codeEvolutionProposals.length === 0 ? (
                <div className="kg-placeholder">{t('codeEvolution_placeholder')}</div>
            ) : (
                codeEvolutionProposals.map(proposal => (
                    <div key={proposal.id} className={`rie-insight-item ${proposal.status === 'dismissed' ? 'dismissed' : ''}`}>
                        <div className="rie-insight-header">
                           <strong>{t('codeEvolution_targetFile')}:</strong> <span className="rie-insight-model-update-value">{proposal.targetFile}</span>
                           <small className={proposal.status}>{proposal.status}</small>
                        </div>
                        <p><em>{proposal.reasoning}</em></p>
                        <div className="code-snippet-container">
                            <pre><code>{proposal.codeSnippet}</code></pre>
                            <button 
                                className="copy-snippet-button" 
                                onClick={() => handleCopy(proposal.codeSnippet)}
                                title={t('codeEvolution_copy')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};