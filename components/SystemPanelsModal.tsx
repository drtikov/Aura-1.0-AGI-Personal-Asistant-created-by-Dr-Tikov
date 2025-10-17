// components/SystemPanelsModal.tsx
import React, { useMemo } from 'react';
import { Modal } from './Modal.tsx';
import {
    useArchitectureState,
    useCoreState,
    useEngineState,
    useLocalization,
    useLogsState,
    useMemoryState,
    usePlanningState,
    useSystemState,
    useAuraDispatch
} from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { mainControlDeckLayout, PanelConfig } from './controlDeckConfig.tsx';

interface SystemPanelsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SystemPanelsModal = ({ isOpen, onClose }: SystemPanelsModalProps) => {
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

    // Flatten and sort all panels alphabetically by title
    const sortedSystemPanels = useMemo(() => {
        const allPanels: PanelConfig[] = [];
        const flatten = (panels: PanelConfig[]) => {
            for (const panel of panels) {
                // If it's a group, recurse into its children.
                // If it's a single panel with a component, add it to the list.
                if (panel.children) {
                    flatten(panel.children);
                } else if (panel.component) {
                    allPanels.push(panel);
                }
            }
        };
        flatten(mainControlDeckLayout);
        return allPanels.sort((a, b) => t(a.titleKey).localeCompare(t(b.titleKey)));
    }, [t]);

    const renderPanel = (panel: PanelConfig) => {
        if (panel.component) {
            const PanelComponent = panel.component;
            const componentProps = panel.props ? panel.props(handlers) : {};
            return (
                <Accordion
                    key={panel.id}
                    title={t(panel.titleKey)}
                    defaultOpen={panel.defaultOpen || false} // Ensure defaultOpen is not undefined
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
            title={t('systemPanelsModal_title')}
            className="advanced-controls-modal" // Use large modal style
        >
            <div className="advanced-controls-grid">
                {sortedSystemPanels.map(renderPanel)}
            </div>
        </Modal>
    );
};