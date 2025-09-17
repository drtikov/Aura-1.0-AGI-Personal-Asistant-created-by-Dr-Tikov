import React from 'react';
import { usePlanningState } from '../context/AuraContext';

export const InnerDisciplinePanel = React.memo(() => {
    const { disciplineState: discipline } = usePlanningState();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                {discipline.committedGoal ? (
                    <>
                        <div className="panel-subsection-title">Committed Goal</div> <div className="discipline-goal-item"> <span className="goal-type">{discipline.committedGoal.type.replace(/_/g, ' ')}</span> <p>{discipline.committedGoal.description}</p> <small>Commitment Strength: {discipline.committedGoal.commitmentStrength.toFixed(2)}</small> </div>
                        <div className="state-item"> <label>Goal Adherence Score</label> <div className="state-bar-container"> <div className="state-bar discipline-adherence-bar" style={{ width: `${discipline.adherenceScore * 100}%` }}></div> </div> </div>
                        <div className="state-item"> <label>Distraction Resistance</label> <div className="state-bar-container"> <div className="state-bar discipline-resistance-bar" style={{ width: `${discipline.distractionResistance * 100}%` }}></div> </div> </div>
                    </>
                ) : <div className="kg-placeholder">No long-term goal committed. Use "Commit to Goal" to set one.</div>}
            </div>
        </div>
    );
});