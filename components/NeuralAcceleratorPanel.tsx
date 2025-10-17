import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';

export const NeuralAcceleratorPanel = React.memo(() => {
    const { neuralAcceleratorState: state } = useArchitectureState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel command-log-panel">
            {state.lastActivityLog.length === 0 ? (
                <div className="kg-placeholder">{t('nac_placeholder')}</div>
            ) : (
                <div className="command-log-list">
                    {state.lastActivityLog.map(entry => (
                        <div key={entry.id} className="mod-log-item" style={{ marginBottom: '0.75rem' }}>
                            <div className="mod-log-header">
                                <span className="mod-log-type" style={{textTransform: 'capitalize'}}>{entry.type}</span>
                                <span className={`mod-log-status ${entry.projectedGain < 0 ? 'status-success' : 'status-failed'}`}>
                                    Gain: {(entry.projectedGain * 100).toFixed(1)}%
                                </span>
                            </div>
                            <p className="mod-log-description">{entry.description}</p>
                            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {timeAgo(entry.timestamp)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});