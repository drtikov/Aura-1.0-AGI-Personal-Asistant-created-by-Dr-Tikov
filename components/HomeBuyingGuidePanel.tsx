// components/HomeBuyingGuidePanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';

export const HomeBuyingGuidePanel = () => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const modal = useModal();
    
    const handleStartGuide = (process: 'buying' | 'selling') => {
        const goal = process === 'buying' ? 'Guide me through the process of buying a home.' : 'Guide me through the process of selling my home.';
        
        // We'll use the strategic goal modal to confirm and kick off the decomposition
        modal.open('strategicGoal', { initialGoal: goal });

        addToast(`Home ${process} guide initiated. Check the Planning & Goals panel.`, 'success');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('homeBuyingGuide_description')}</p>
            <div className="button-grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr' }}>
                <button className="control-button" onClick={() => handleStartGuide('buying')}>
                    {t('homeBuyingGuide_start_buying')}
                </button>
                 <button className="control-button" onClick={() => handleStartGuide('selling')}>
                    {t('homeBuyingGuide_start_selling')}
                </button>
            </div>
             <p className="reason-text" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                {t('homeBuyingGuide_note')}
            </p>
        </div>
    );
};