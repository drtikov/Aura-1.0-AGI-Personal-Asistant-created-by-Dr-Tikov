import React from 'react';
import { SelfModificationLogEntry, SystemSnapshot } from '../types';

export const SelfModificationPanel = React.memo(({ snapshots, modLog, onRollback }: { snapshots: SystemSnapshot[]; modLog: SelfModificationLogEntry[]; onRollback: (snapshotId: string) => void; }) => (
    <div className="side-panel self-mod-panel">
        <div className="self-mod-content">
            <div className="panel-subsection-title">Modification Log</div>
            {modLog.length === 0 ? <div className="kg-placeholder">No self-modifications logged.</div> : modLog.map(log => (
                <div key={log.id} className="mod-log-item"> <div className="mod-log-header"> <span className="mod-log-type">{log.gainType.replace(/_/g, ' ')}</span> <span className={`mod-log-status status-${log.validationStatus}`}>{log.validationStatus}</span> </div> <p className="mod-log-description">{log.description}</p> </div>
            ))}
            <div className="panel-subsection-title">System Snapshots</div>
            {snapshots.length === 0 ? <div className="kg-placeholder">No system snapshots taken.</div> : snapshots.map(snap => (
                <div key={snap.id} className="snapshot-item"> <div className="snapshot-info"> <span>{new Date(snap.timestamp).toLocaleTimeString()}</span> <span>{snap.reason}</span> </div> <button onClick={() => onRollback(snap.id)} className="snapshot-rollback-button">Rollback</button> </div>
            ))}
        </div>
    </div>
));
