// components/EventBusPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useArchitectureState, useSystemState } from '../context/AuraContext.tsx';
import { CoprocessorArchitecture, EventBusMessage, GunaState } from '../types.ts';

const getGunaColor = (guna: GunaState | undefined) => {
    switch(guna) {
        case GunaState.SATTVA: return 'var(--guna-sattva)';
        case GunaState.RAJAS: return 'var(--guna-rajas)';
        case GunaState.TAMAS: return 'var(--guna-tamas)';
        case GunaState.DHARMA: return 'var(--guna-dharma)';
        // FIX: Corrected enum access for key with hyphen.
        case GunaState['GUNA-TEETA']: return 'var(--guna-teeta)';
        default: return 'var(--border-color)';
    }
}

export const EventBusPanel = () => {
    const { state } = useAuraDispatch();
    const { cognitiveArchitecture } = useArchitectureState();
    const { eventBus } = useSystemState();
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
            {eventBus.length === 0 ? (
                <div className="kg-placeholder">{t('eventBus_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {eventBus.map(entry => (
                        <div key={entry.id} className="command-log-item log-type-info">
                            <span className="log-icon">
                                <span 
                                    className="qualia-dot"
                                    style={{ backgroundColor: getGunaColor(entry.qualiaVector?.gunaState) }}
                                    title={`Qualia Snapshot: ${entry.qualiaVector?.gunaState}`}
                                />
                            </span>
                            <span 
                                className="log-text" 
                                title={JSON.stringify({ payload: entry.payload, qualia: entry.qualiaVector }, null, 2)}
                            >
                                {entry.type}
                            </span>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};