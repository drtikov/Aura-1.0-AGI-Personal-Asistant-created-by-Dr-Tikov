// components/HeuristicCoprocessorPanel.tsx
import React from 'react';
// FIX: Removed unused imports `useAuraDispatch` and `useCoreState`
import { useSystemState, useLocalization } from '../context/AuraContext.tsx';
import { HeuristicCoprocessor, Plugin } from '../types.ts';

export const HeuristicCoprocessorPanel = () => {
    const { t } = useLocalization();
    // FIX: Destructured `heuristicCoprocessorState` from `useSystemState` instead of `useCoreState`.
    const { heuristicCoprocessorState, pluginState } = useSystemState();
    const { log } = heuristicCoprocessorState;

    const coprocessors = pluginState.registry.filter(
        (p): p is Plugin & { heuristicCoprocessor: HeuristicCoprocessor } => 
            p.type === 'HEURISTIC_COPROCESSOR' && p.status === 'enabled'
    );

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel">
            <p className="reason-text">
                Heuristic Coprocessors are fast, rule-based agents that run in the background to autonomously regulate Aura's state without needing slow, expensive LLM calls. They act like "closed-form solutions" for common internal state problems.
            </p>

            <div className="panel-subsection-title">Active Coprocessors</div>
            {coprocessors.map(plugin => (
                <div key={plugin.id} className="mod-log-item">
                    <div className="mod-log-header">
                        <span className="mod-log-type">{t(plugin.name)}</span>
                    </div>
                    <p className="mod-log-description" style={{fontStyle: 'italic'}}>{t(plugin.description)}</p>
                </div>
            ))}
            
            <div className="panel-subsection-title">Activation Log</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">No activations logged yet.</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">⚡</span>
                            <div className="log-text-group">
                                <span className="log-text">{t(coprocessors.find(c => c.id === entry.coprocessorId)?.name || entry.coprocessorId)}</span>
                                <span className="log-subtext">{entry.message}</span>
                            </div>
                            <span className="log-time">{timeAgo(entry.timestamp)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};