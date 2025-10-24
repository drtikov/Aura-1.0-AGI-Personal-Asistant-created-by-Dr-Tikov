// components/NarrativeSummaryPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

export const NarrativeSummaryPanel = React.memo(() => {
    const { narrativeSummary } = useCoreState();
    const { addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const handleCopy = () => {
        navigator.clipboard.writeText(narrativeSummary).then(() => {
            addToast(t('narrativeSummary_copied'), 'success');
        }, () => {
            addToast(t('narrativeSummary_copyFailed'), 'error');
        });
    };
    
    return (
        <div className="standalone-panel">
            <div className="panel-group-header" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span>{t('narrativeSummary_title')}</span>
                <button 
                    className="copy-snippet-button" 
                    onClick={handleCopy}
                    title={t('narrativeSummary_copy')}
                    style={{ position: 'static', width: '28px', height: '28px' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                </button>
            </div>
            <p className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>
                {narrativeSummary || t('narrativeSummary_placeholder')}
            </p>
        </div>
    );
});
