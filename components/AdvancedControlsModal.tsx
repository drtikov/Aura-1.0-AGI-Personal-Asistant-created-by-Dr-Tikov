
// components/AdvancedControlsModal.tsx
import React from 'react';
import { Modal } from './Modal';
// FIX: Added useSystemState to the import to resolve the current error.
import { useLocalization, useArchitectureState, useLogsState, useMemoryState, useCoreState, useEngineState, useSystemState, useAuraDispatch, usePlanningState } from '../context/AuraContext';
import { advancedControlsLayout, PanelConfig } from './controlDeckConfig';
import { Accordion } from './Accordion';

// This utility function renders a panel configuration, deciding whether it's a nested accordion or a component.
const renderPanel = (panel: PanelConfig, stateSlices: any, handlers: any, t: any) => {
    if (panel.children) {
        return (
            <Accordion
                key={panel.id}
                title={t(panel.titleKey)}
                defaultOpen={panel.defaultOpen}
                summary={panel.summary ? panel.summary(stateSlices, t) : undefined}
                hasNotifications={panel.hasNotifications ? panel.hasNotifications(stateSlices) : false}
            >
                {panel.children.map(child => renderPanel(child, stateSlices, handlers, t))}
            </Accordion>
        );
    }

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

export const AdvancedControlsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();

    // Gather all necessary state slices and handlers to pass down to the panels
    const architectureState = useArchitectureState();
    const logsState = useLogsState();
    const memoryState = useMemoryState();
    const coreState = useCoreState();
    const engineState = useEngineState();
    const planningState = usePlanningState();
    const systemState = useSystemState();
    const handlers = useAuraDispatch();

    const stateSlices = {
        architecture: architectureState,
        logs: logsState,
        memory: memoryState,
        core: coreState,
        engine: engineState,
        planning: planningState,
        // FIX: Added the 'system' property to the stateSlices object, providing data for panels like MetacognitiveNexusPanel.
        system: systemState,
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('advancedControlsModal_title')} className="advanced-controls-modal">
            <div className="advanced-controls-content">
                {advancedControlsLayout.map(panel => renderPanel(panel, stateSlices, handlers, t))}
            </div>
        </Modal>
    );
};