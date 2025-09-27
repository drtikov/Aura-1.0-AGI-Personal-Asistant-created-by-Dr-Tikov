// components/SubsumptionLogPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useArchitectureState } from '../context/AuraContext';
import { CoprocessorArchitecture, EventBusMessage } from '../types';

export const SubsumptionLogPanel = () => {
    const { state } = useAuraDispatch();
    const { cognitiveArchitecture } = useArchitectureState();
    const { t } = useLocalization();

    // This panel is only relevant for the Subsumption Relay architecture
    if (cognitiveArchitecture.coprocessorArchitecture !== CoprocessorArchitecture.SUBSUMPTION_RELAY) {
        return (
            <div className="side-panel">
                 <div className="kg-placeholder">{t('subsumptionLog_inactive')}</div>
            </div>
        );
    }
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return `${seconds}s ago`;
    };

    const relevantLogs = state.eventBus.filter(e => 
        e.type === 'PROPOSED_ACTION' || e.type === 'VETO_ACTION' || e.type === 'EXECUTED_ACTION'
    );

    const getIcon = (type: EventBusMessage['type']) => {
        switch(type) {
            case 'PROPOSED_ACTION': return '💡';
            case 'VETO_ACTION': return '🚫';
            case 'EXECUTED_ACTION': return '✅';
            default: return '?';
        }
    }

    return (
        <div className="side-panel command-log-panel">
            {relevantLogs.length === 0 ? (
                <div className="kg-placeholder">{t('subsumptionLog_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {relevantLogs.map(entry => {
                        let text = '';
                        switch(entry.type) {
                            case 'PROPOSED_ACTION':
                                text = `[${entry.payload.proposerId}] proposed ${entry.payload.type}`;
                                break;
                            case 'VETO_ACTION':
                                text = `[${entry.payload.vetoistId}] VETOED action for ${entry.payload.proposal.proposerId}`;
                                break;
                            case 'EXECUTED_ACTION':
                                 text = `Executed ${entry.payload.type} for [${entry.payload.proposerId}]`;
                                break;
                        }

                        return (
                            <div key={entry.id} className={`command-log-item log-type-${entry.type.toLowerCase()}`}>
                                <span className="log-icon" title={entry.type}>{getIcon(entry.type)}</span>
                                <span className="log-text" title={JSON.stringify(entry.payload, null, 2)}>{text}</span>
                                <span className="log-time">{timeAgo(entry.timestamp)}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};