// components/EmbodiedCognitionPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { EmbodimentSimulationLog } from '../types.ts';

export const EmbodiedCognitionPanel = React.memo(() => {
    const { embodiedCognitionState } = useArchitectureState();
    const { t } = useLocalization();
    const { virtualBodyState, simulationLog } = embodiedCognitionState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return t('timeAgoSeconds', { count: seconds });
    };

    return (
        <div className="side-panel embodied-cognition-panel">
            <div className="panel-subsection-title">{t('embodiment_title')}</div>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr', textAlign: 'left', gap: '0.2rem', marginBottom: '1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">{t('embodiment_position')}</span>
                    <span className="metric-value">({virtualBodyState.position.x.toFixed(2)}, {virtualBodyState.position.y.toFixed(2)}, {virtualBodyState.position.z.toFixed(2)})</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('embodiment_orientation')}</span>
                    <span className="metric-value">({virtualBodyState.orientation.yaw.toFixed(2)}, {virtualBodyState.orientation.pitch.toFixed(2)}, {virtualBodyState.orientation.roll.toFixed(2)})</span>
                </div>
                <div className="state-item">
                    <label>{t('embodiment_balance')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar stability-bar" style={{ width: `${virtualBodyState.balance * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('embodiment_simLog')}</div>
            {simulationLog.length === 0 ? (
                <div className="kg-placeholder">{t('embodiment_noSims')}</div>
            ) : (
                simulationLog.map((log: EmbodimentSimulationLog) => (
                    <div key={log.id} className={`mod-log-item status-${log.outcome}`} style={{marginBottom: '0.5rem'}}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{log.scenario}</span>
                            <span className={`mod-log-status status-${log.outcome}`}>{log.outcome}</span>
                        </div>
                        <p className="mod-log-description">{log.reasoning}</p>
                         <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {timeAgo(log.timestamp)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});