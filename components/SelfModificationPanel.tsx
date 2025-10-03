
import React from 'react';
// FIX: Corrected casing in import path from 'auraContext' to 'AuraContext' to resolve module resolution errors.
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const SelfModificationPanel = React.memo(({ onRollback }: { onRollback: (snapshotId: string) => void; }) => {
    const { systemSnapshots: snapshots, modificationLog: modLog } = useArchitectureState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
        
        if (seconds < 2) return `now`;
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return t('timeAgoHours', { count: hours });

        // If it's more than a day, show the date
        return new Date(timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="side-panel self-mod-panel">
            <div className="self-mod-content">
                <div className="panel-subsection-title">{t('selfMod_logTitle')}</div>
                {modLog.length === 0 ? <div className="kg-placeholder">{t('selfMod_noLog')}</div> : modLog.map(log => (
                    <div key={log.id} className="mod-log-item">
                        <div className="mod-log-header">
                            <span className="mod-log-type">
                                {log.isAutonomous && '🤖 '}
                                {log.gainType.replace(/_/g, ' ')}
                            </span>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                <span className={`mod-log-status status-${log.validationStatus}`}>{log.validationStatus}</span>
                                <span className="log-time">{timeAgo(log.timestamp)}</span>
                            </div>
                        </div>
                        <p className="mod-log-description" title={log.isAutonomous ? t('selfMod_autonomousTooltip') : ''}>
                            {log.description}
                        </p>
                    </div>
                ))}
                <div className="panel-subsection-title">{t('selfMod_snapshotsTitle')}</div>
                {snapshots.length === 0 ? <div className="kg-placeholder">{t('selfMod_noSnapshots')}</div> : snapshots.map(snap => (
                    <div key={snap.id} className="snapshot-item">
                        <div className="snapshot-info">
                            <span>{new Date(snap.timestamp).toLocaleTimeString()}</span>
                            <span>{snap.reason}</span>
                        </div>
                        <button onClick={() => onRollback(snap.id)} className="snapshot-rollback-button">{t('selfMod_rollback')}</button>
                    </div>
                ))}
            </div>
        </div>
    );
});
