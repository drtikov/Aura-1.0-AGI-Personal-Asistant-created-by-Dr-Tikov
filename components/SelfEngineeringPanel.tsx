// components/SelfEngineeringPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch, useSystemState, useArchitectureState } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext';
import { AutonomousReviewBoardPanel } from './AutonomousReviewBoardPanel.tsx';
import { MetisSandboxPanel } from './MetisSandboxPanel.tsx';
import { Accordion } from './Accordion.tsx';

export const SelfEngineeringPanel = () => {
    const { t } = useLocalization();
    const { ontogeneticArchitectState } = useArchitectureState();
    const modal = useModal();

    const pendingProposalsCount = ontogeneticArchitectState.proposalQueue.filter(
       p => p.status === 'proposed' || p.status === 'evaluated' || p.status === 'simulation_failed'
    ).length;

    return (
        <div className="side-panel">
            <p className="reason-text">{t('self_engineering_desc')}</p>
            
            <div className="button-grid" style={{ marginTop: '1.5rem', gridTemplateColumns: '1fr' }}>
                <button 
                    className="control-button advanced-module-button"
                    onClick={() => modal.open('autonomousEvolution', {})}
                    title={t('tip_autonomousEvolution')}
                >
                     <span className="advanced-module-header">{t('review_proposals_button')}</span>
                     {pendingProposalsCount > 0 && <span className="advanced-module-summary">{pendingProposalsCount} pending</span>}
                </button>
            </div>
            
            <Accordion title={t('review_board_title')} defaultOpen={false} hasNotifications={pendingProposalsCount > 0}>
                <AutonomousReviewBoardPanel />
            </Accordion>
            
            <Accordion title={t('metis_sandbox_title')} defaultOpen={false}>
                <MetisSandboxPanel />
            </Accordion>
        </div>
    );
};