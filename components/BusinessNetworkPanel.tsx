// components/BusinessNetworkPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { KernelTaskType } from '../types.ts';

export const BusinessNetworkPanel = () => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();

    const handleActivateAnalyst = () => {
        syscall('UPDATE_PERSONALITY_STATE', { dominantPersona: 'business_analyst' });
        addToast(t('businessNetwork_analyst_activated'), 'success');
    };
    
    const handleAnalyzeMarket = () => {
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_MARKET_ANALYSIS,
            payload: {},
            timestamp: Date.now(),
        });
        addToast(t('businessNetwork_analysis_started'), 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('businessNetwork_description')}</p>

            <div className="panel-subsection-title">{t('businessNetwork_ask_analyst')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_ask_analyst_desc')}</p>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleActivateAnalyst}>
                    {t('businessNetwork_activate_analyst_button')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('businessNetwork_market_insights')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_market_insights_desc')}</p>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleAnalyzeMarket}>
                    {t('businessNetwork_analyze_market_button')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('businessNetwork_synergy_finder')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem' }}>{t('businessNetwork_synergy_finder_desc')}</p>
            <div className="synergy-proposals" style={{ marginTop: '1rem' }}>
                <div className="proposal-card">
                    <div className="proposal-card-body">
                        <p><strong>{t('businessNetwork_synergy_proposal_1_title')}</strong></p>
                        <p style={{ fontSize: '0.85rem' }}>{t('businessNetwork_synergy_proposal_1_desc')}</p>
                    </div>
                </div>
                <div className="proposal-card">
                    <div className="proposal-card-body">
                        <p><strong>{t('businessNetwork_synergy_proposal_2_title')}</strong></p>
                        <p style={{ fontSize: '0.85rem' }}>{t('businessNetwork_synergy_proposal_2_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
