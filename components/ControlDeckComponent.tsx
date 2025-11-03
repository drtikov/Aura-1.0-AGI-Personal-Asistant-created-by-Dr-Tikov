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

const _ControlDeckComponent: React.FC = () => {
    const { t } = useLocalization();
    const modal = useModal();
    const { handleTrip, handleVisions, handleSatori, handleEvolveFromInsight, syscall } = useAuraDispatch();
    const { gankyilInsights, psychedelicIntegrationState, satoriState, internalState } = useCoreState();
    
    const unprocessedInsightsCount = gankyilInsights.insights.filter(i => !i.isProcessedForEvolution).length;

    const isProcessing = internalState.status === 'processing' || internalState.status === 'thinking';

    const handleBranch = (prompt: string) => {
        syscall('MULTIVERSE/CREATE_BRANCH', { prompt });
    };

    return (
        <div className="control-deck-container">
            <div className="control-deck-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                    <ThemeSwitcher />
                    <LocalizationPanel />
                </div>

                <div className="panel-group-header">{t('auraOS_header')}</div>
                <div className="button-grid" style={{gridTemplateColumns: '1fr'}}>
                    <button className="control-button advanced-module-button" onClick={() => modal.open('auraOS', {})}>
                        <span className="advanced-module-header">{t('auraOS_title')}</span>
                        <span className="advanced-module-summary">{t('auraOS_summary')}</span>
                    </button>
                </div>

                <ManualControlPanel />
                
                <div className="panel-group-title">{t('specialModes')}</div>
                <div className="button-grid">
                     <button className={`control-button mode-trip ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'trip' ? 'active' : ''}`} onClick={handleTrip} title={t('tip_trip')}>{t('trip')}</button>
                     <button className={`control-button mode-visions ${psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'visions' ? 'active' : ''}`} onClick={handleVisions} title={t('tip_visions')}>{t('visions')}</button>
                     <button className={`control-button mode-satori ${satoriState.isActive ? 'active' : ''}`} onClick={handleSatori} title={t('tip_satori')}>{t('satori')}</button>
                     <button className={`control-button mode-insight ${unprocessedInsightsCount > 0 ? 'has-new-insight' : ''}`} onClick={handleEvolveFromInsight} title={t('tip_insight')} disabled={unprocessedInsightsCount === 0}>{t('insight')}</button>
                     <button className="control-button mode-psi" onClick={() => modal.open('multiverseBranching', { onBranch: handleBranch, isProcessing })} title={t('tip_branch')}>{t('branch')}</button>
                     <button className="control-button mode-brainstorm" onClick={() => modal.open('brainstorm', {})} title={t('tip_brainstorm')}>{t('brainstorm')}</button>
                </div>
            </div>
        </div>
    );
};

export const ControlDeckComponent = React.memo(_ControlDeckComponent);