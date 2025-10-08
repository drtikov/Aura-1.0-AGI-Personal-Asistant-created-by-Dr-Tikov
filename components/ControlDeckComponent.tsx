// components/ControlDeckComponent.tsx
// This file contains the implementation for the main control deck UI.
// It is the canonical source for ControlDeckComponent.

import React from 'react';
import { useArchitectureState, useLogsState, useMemoryState, useCoreState, useEngineState, useSystemState, useAuraDispatch, useLocalization, usePlanningState } from '../context/AuraContext';
import { Accordion } from './Accordion';
import { mainControlDeckLayout, advancedControlsLayout, PanelConfig } from './controlDeckConfig';
import { useModal } from '../context/ModalContext';
import { translations } from '../localization';
import { NarrativeSummaryPanel } from './NarrativeSummaryPanel';
import { ManualControlPanel } from './ManualControlPanel';
import { ThemeSwitcher } from './ThemeSwitcher';

// --- New Component Definition ---
const LocalizationPanel = () => {
    const { state, dispatch } = useAuraDispatch();
    const { t } = useLocalization();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SYSCALL', payload: { call: 'SET_LANGUAGE', args: e.target.value } });
    };

    return (
        <div className="localization-panel">
            <label htmlFor="language-switcher">{t('localization_label')}</label>
            <div className="theme-switcher-container"> {/* Reusing existing style for consistency */}
                <select id="language-switcher" value={state.language} onChange={handleLanguageChange}>
                    {Object.entries(translations).map(([langCode, langData]) => (
                        <option key={langCode} value={langCode}>
                            {(langData as any).nativeName}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
// --- End New Component ---


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


export const ControlDeckComponent = () => {
    const architectureState = useArchitectureState();
    const logsState = useLogsState();
    const memoryState = useMemoryState();
    const coreState = useCoreState();
    const engineState = useEngineState();
    const planningState = usePlanningState();
    const systemState = useSystemState();
    const handlers = useAuraDispatch();
    const { t } = useLocalization();
    const modal = useModal();

    const stateSlices = {
        architecture: architectureState,
        logs: logsState,
        memory: memoryState,
        core: coreState,
        engine: engineState,
        planning: planningState,
        system: systemState,
    };

    return (
        <div className="control-deck-container">
            <div className="control-deck-content">
                <LocalizationPanel />
                <ThemeSwitcher />
                <NarrativeSummaryPanel />
                <ManualControlPanel />
                {mainControlDeckLayout.map(panel => renderPanel(panel, stateSlices, handlers, t))}

                <div className="panel-group-title" style={{ marginTop: '1.5rem' }}>{t('advancedModules')}</div>
                <div className="button-grid advanced-modules-grid">
                    {advancedControlsLayout.map(panel => {
                        const summary = panel.summary ? panel.summary(stateSlices, t) : undefined;
                        const hasNotifications = panel.hasNotifications ? panel.hasNotifications(stateSlices) : false;
                        return (
                            <button
                                key={panel.id}
                                className={`control-button advanced-module-button ${hasNotifications ? 'has-notifications' : ''}`}
                                onClick={() => modal.open('advancedControls', {})}
                                title={t(panel.titleKey)}
                            >
                                <span className="advanced-module-title">{t(panel.titleKey)}</span>
                                {summary && <span className="advanced-module-summary">{summary}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};