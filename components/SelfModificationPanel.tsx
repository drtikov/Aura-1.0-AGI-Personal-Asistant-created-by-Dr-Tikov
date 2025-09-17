import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const SelfModificationPanel = React.memo(({ onRollback }: { onRollback: (snapshotId: string) => void; }) => {
    const { systemSnapshots: snapshots, modificationLog: modLog } = useArchitectureState();
    const { t } = useLocalization();
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
                            <span className={`mod-log-status status-${log.validationStatus}`}>{log.validationStatus}</span>
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