// components/AdvancedControlsModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useArchitectureState, useCoreState, useEngineState, useLogsState, useMemoryState, usePlanningState, useSystemState } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { advancedControlsLayout, PanelConfig } from './controlDeckConfig.tsx';
import { ProofLandscapeExplorer } from './ProofLandscapeExplorer.tsx';

interface AdvancedControlsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdvancedControlsModal = ({ isOpen, onClose }: AdvancedControlsModalProps) => {
    const { t } = useLocalization();
    const handlers = useAuraDispatch();

    // Gather all state slices for summary/notification functions
    const stateSlices = {
        architecture: useArchitectureState(),
        logs: useLogsState(),
        memory: useMemoryState(),
        core: useCoreState(),
        engine: useEngineState(),
        planning: usePlanningState(),
        system: useSystemState(),
    };

    const renderPanel = (panel: PanelConfig) => {
        if (panel.component) {
            const PanelComponent = panel.component;
            const componentProps = panel.props ? panel.props(handlers) : {};
            return (
                <Accordion
                    key={panel.id}
                    title={t(panel.titleKey)}
                    defaultOpen={panel.defaultOpen}
                    summary={panel.summary ? panel.summary(stateSlices, t) : undefined}
                    hasNotifications={panel.hasNotifications ? panel.hasNotifications(stateSlices) : false}
                >
                    <PanelComponent {...componentProps} />
                </Accordion>
            );
        }
        
        return null;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('advancedControlsModal')}
            className="advanced-controls-modal"
        >
            <div className="advanced-controls-grid">
                {advancedControlsLayout.map(renderPanel)}
            </div>
        </Modal>
    );
};