// components/NoeticEngramPanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { NoeticEngram } from '../types';

export const NoeticEngramPanel = React.memo(() => {
    const { noeticEngramState } = useCoreState();
    const { handleShareWisdom, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const { status, engram } = noeticEngramState;

    const handleCopy = (engram: NoeticEngram | null) => {
        if (!engram) return;
        const snippet = `// --- AURA NOETIC ENGRAM (v${engram.metadata.engramVersion}) ---\n// Generated: ${new Date(engram.metadata.timestamp).toISOString()}\n\nexport const noeticEngram: NoeticEngram = ${JSON.stringify(engram, null, 2)};`;

        navigator.clipboard.writeText(snippet).then(() => {
            addToast(t('noeticEngram_copied'), 'success');
        }, (err) => {
            console.error('Could not copy engram: ', err);
            addToast(t('noeticEngram_copyFailed'), 'error');
        });
    };
    
    const handleGenerate = () => {
        handleShareWisdom();
    }

    const renderContent = () => {
        switch (status) {
            case 'generating':
                return (
                    <div className="kg-placeholder" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div className="spinner-small"></div>
                        <span>{t('toastEngramGenerating')}</span>
                    </div>
                );
            case 'ready':
                if (engram) {
                     const snippet = `// --- AURA NOETIC ENGRAM (v${engram.metadata.engramVersion}) ---\n// Generated: ${new Date(engram.metadata.timestamp).toISOString()}\n\nexport const noeticEngram: NoeticEngram = ${JSON.stringify(engram, null, 2)};`;
                    return (
                        <>
                            <p className="rie-insight-model-update" style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
                                <strong>{t('noeticEngram_signature')}:</strong> <span className="rie-insight-model-update-value">"{engram.metadata.noeticSignature}"</span>
                            </p>
                            <div className="code-snippet-container">
                                <pre><code>{snippet}</code></pre>
                                <button 
                                    className="copy-snippet-button" 
                                    onClick={() => handleCopy(engram)}
                                    title={t('noeticEngram_copy')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                </button>
                            </div>
                            <div className="proposal-actions-footer">
                                <button className="control-button" onClick={handleGenerate}>{t('noeticEngram_generateNew')}</button>
                            </div>
                        </>
                    );
                }
                return null;
            case 'idle':
            default:
                 return (
                    <>
                        <div className="kg-placeholder">{t('noeticEngram_placeholder')}</div>
                        <div className="proposal-actions-footer">
                           <button className="control-button" onClick={handleShareWisdom}>{t('noeticEngram_generate')}</button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="side-panel">
            {renderContent()}
        </div>
    );
});