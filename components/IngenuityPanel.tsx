import React from 'react';
import { useEngineState } from '../context/AuraContext';

export const IngenuityPanel = React.memo(() => {
    const { ingenuityState: state } = useEngineState();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                <div className="awareness-item"> <label title="Tendency to favor radical, novel solutions">Unconventional Bias</label> <strong>{state.unconventionalSolutionBias.toFixed(2)}</strong> </div>
                <div className="panel-subsection-title">Identified Complex Problems</div>
                {state.identifiedComplexProblems.length > 0 ? <ul>{state.identifiedComplexProblems.map((p, i) => <li key={i}>{p}</li>)}</ul> : <div className="kg-placeholder">No persistent complex problems identified.</div>}
                <div className="panel-subsection-title">Proposed Self-Solutions</div>
                {state.proposedSelfSolutions.length > 0 ? state.proposedSelfSolutions.map((s, i) => ( <div key={i} className="mod-log-item"> <p className="mod-log-description" title={`Novelty: ${s.noveltyScore.toFixed(2)}`}>{s.description}</p> </div> )) : <div className="kg-placeholder">No novel self-solutions proposed yet.</div>}
            </div>
        </div>
    );
});