// components/ControlDeckComponent.tsx
import React from 'react';
import {
    useLocalization,
    useAuraDispatch,
    useCoreState
} from '../context/AuraContext.tsx';
import { ThemeSwitcher } from './ThemeSwitcher.tsx';
import { ManualControlPanel } from './ManualControlPanel.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { LocalizationPanel } from './LocalizationPanel.tsx';
import { NarrativeSummaryPanel } from './NarrativeSummaryPanel.tsx';

const _ControlDeckComponent: React.FC = () => {
    const { t } = useLocalization();
    const modal = useModal();
    const { handleTrip, handleVisions, handleSatori, handleEvolveFromInsight } = useAuraDispatch();
    const { gankyilInsights, psychedelicIntegrationState, satoriState } = useCoreState();
    
    const unprocessedInsightsCount = gankyilInsights.insights.filter(i => !i.isProcessedForEvolution).length;

    return (
        <div className="control-deck-container">
            <div className="control-deck-content">
                <div className="panel-group-header">{t('auraOS_header')}</div>
                <div className="button-grid" style={{gridTemplateColumns: '1fr'}}>
                    <button className="control-button advanced-module-button" onClick={() => modal.open('auraOS', {})}>
                        <span className="advanced-module-header">{t('auraOS_title')}</span>
                        <span className="advanced-module-summary">{t('auraOS_summary')}</span>
                    </button>
                </div>

                <NarrativeSummaryPanel />

                <ManualControlPanel />
                
                <div className="panel-group-title">{t('specialModes')}</div>
                <div className="button-grid">
                     <button className={`control-button mode-trip ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'trip' ? 'active' : ''}`} onClick={handleTrip} title={t('tip_trip')}>{t('trip')}</button>
                     <button className={`control-button mode-visions ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'visions' ? 'active' : ''}`} onClick={handleVisions} title={t('tip_visions')}>{t('visions')}</button>
                     <button className={`control-button mode-satori ${satoriState.isActive ? 'active' : ''}`} onClick={handleSatori} title={t('tip_satori')}>{t('satori')}</button>
                     <button className={`control-button mode-insight ${unprocessedInsightsCount > 0 ? 'has-new-insight' : ''}`} onClick={handleEvolveFromInsight} title={t('tip_insight')} disabled={unprocessedInsightsCount === 0}>{t('insight')}</button>
                     <button className="control-button mode-psi" onClick={() => modal.open('multiverseBranching', {})} title={t('tip_branch')}>{t('branch')}</button>
                     <button className="control-button mode-brainstorm" onClick={() => modal.open('brainstorm', {})} title={t('tip_brainstorm')}>{t('brainstorm')}</button>
                </div>

                <ThemeSwitcher />
                <LocalizationPanel />
            </div>
        </div>
    );
};

export const ControlDeckComponent = React.memo(_ControlDeckComponent);
