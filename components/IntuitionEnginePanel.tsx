import React from 'react';
import { IntuitionEngineState, IntuitiveLeap } from '../types';

export const IntuitionEnginePanel = React.memo(({ state, leaps }: { state: IntuitionEngineState; leaps: IntuitiveLeap[] }) => (
    <div className="side-panel intuition-panel">
        <div className="internal-state-content">
            <div className="state-item"> <label>Engine Accuracy</label> <div className="state-bar-container"> <div className="state-bar accuracy-bar" style={{ width: `${state.accuracy * 100}%` }} title={`${(state.accuracy * 100).toFixed(1)}%`}></div> </div> </div>
            <div className="awareness-item"> <label title="Total validated leaps / Total attempts">Validation Ratio</label> <strong>{state.totalValidated} / {state.totalAttempts}</strong> </div>
            <div className="panel-subsection-title">Recent Leaps & Hypotheses</div>
            <div className="intuitive-leaps-list">
                {leaps.length === 0 ? <div className="kg-placeholder">No intuitive leaps or hypotheses generated.</div> : leaps.map(leap => (
                    <div key={leap.id} className={`intuitive-leap-item status-${leap.status} type-${leap.type}`}>
                        <div className="leap-header"> <span className="leap-type">{leap.type}</span> <span className={`leap-status status-${leap.status}`}>{leap.status}</span> </div>
                        <p className="leap-hypothesis">{leap.hypothesis}</p>
                        <div className="leap-footer"> <span title={`Reasoning: ${leap.reasoning}`}>Conf: {(leap.confidence * 100).toFixed(0)}%</span> </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
));
