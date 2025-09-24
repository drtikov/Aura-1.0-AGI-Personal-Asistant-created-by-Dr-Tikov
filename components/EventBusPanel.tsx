import React from 'react';
import { useAuraDispatch, useLocalization, useArchitectureState } from '../context/AuraContext';
import { CoprocessorArchitecture } from '../types';

export const EventBusPanel = () => {
    const { state } = useAuraDispatch();
    const { cognitiveArchitecture } = useArchitectureState();
    const { t } = useLocalization();

    // This panel is only relevant for the Event Stream architecture
    if (cognitiveArchitecture.coprocessorArchitecture !== CoprocessorArchitecture.EVENT_STREAM) {
        return (
            <div className="side-panel">
                 <div className="kg-placeholder">{t('eventBus_inactive')}</div>
            </div>
        );
    }
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return `${seconds}s ago`;
    };

    return (
        <div className="side-panel command-log-panel">
            {state.eventBus.length === 0 ? (
                <div className="kg-placeholder">{t('eventBus_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {state.eventBus.map(entry => (
                        <div key={entry.id} className="command-log-item log-type-info">
                            <span className="log-icon" title={entry.type}>!</span>
                            <span className="log-text" title={JSON.stringify(entry.payload, null, 2)}>{entry.type}</span>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};