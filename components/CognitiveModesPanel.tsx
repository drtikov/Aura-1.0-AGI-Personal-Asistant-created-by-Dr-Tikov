import React from 'react';
import { CognitiveModeLogEntry } from '../types';

export const CognitiveModesPanel = React.memo(({ log }: { log: CognitiveModeLogEntry[] }) => (
    <div className="side-panel cognitive-modes-panel">
        <div className="cognitive-modes-content">
            {log.length === 0 ? <div className="kg-placeholder">No cognitive mode events logged.</div> : log.map(entry => (
                <div key={entry.id} className={`cognitive-log-item mode-${entry.mode.toLowerCase()}`}>
                    <div className="cognitive-log-header"> <span className="cognitive-log-mode">{entry.mode}</span> <span className="cognitive-log-metric">{entry.metric.name}: {entry.metric.value.toFixed(2)}</span> </div>
                    <p className="cognitive-log-outcome">{entry.outcome}</p>
                    <div className="cognitive-log-footer"> <span className="cognitive-log-trigger">Trigger: {entry.trigger.replace(/_/g, ' ')}</span> <span className={`cognitive-log-gain ${entry.gainAchieved ? 'success' : ''}`}>{entry.gainAchieved ? 'Gain Achieved' : 'No Gain'}</span> </div>
                </div>
            ))}
        </div>
    </div>
));
