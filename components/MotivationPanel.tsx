import React, { useMemo } from 'react';
import { MotivationalDrives, SelfDirectedGoal } from '../types';
import { Action } from '../state/reducer';

export const MotivationPanel = React.memo(({ drives, goals, onExecuteGoal, dispatch, isProcessing, onTrace }: { drives: MotivationalDrives, goals: SelfDirectedGoal[], onExecuteGoal: (goal: SelfDirectedGoal) => void, dispatch: React.Dispatch<Action>, isProcessing?: boolean, onTrace: (logId: string) => void }) => {
    const dominantGoal = useMemo(() => goals.find(g => g.status === 'dominant'), [goals]);
    const candidateGoals = useMemo(() => goals.filter(g => g.status === 'candidate').sort((a,b) => b.priority - a.priority), [goals]);
    const goalHistory = useMemo(() => goals.filter(g => ['completed', 'failed', 'pending'].some(s => s === g.status)).sort((a,b) => b.creationTime - a.creationTime), [goals]);
    
    const renderGoal = (goal: SelfDirectedGoal) => (
         <div key={goal.id} className={`goal-item status-${goal.status}`}>
            <div className="goal-header"> <span className="goal-type">{goal.goalType.replace(/_/g, ' ')}</span> <span className={`goal-status status-${goal.status}`}>{goal.status}</span> </div>
            <div className="goal-body">
                <p className="goal-action-command">{goal.actionCommand}</p>
                {goal.status === 'completed' || goal.status === 'failed' ? (
                    <p className="goal-execution-log">{goal.executionLog}</p>
                ) : (
                    <p className="goal-prediction"> Gain: <strong>+{goal.predictedOutcomes.cognitiveGain.toFixed(2)}</strong> / Priority: <strong>{goal.priority.toFixed(2)}</strong> </p>
                )}
                 <p className="goal-source">Source: <strong>{goal.sourceSignal}</strong> (Urgency: {goal.urgency.toFixed(2)})</p>
            </div>
            <div className="goal-actions">
                {goal.status === 'dominant' && ( <button className="goal-execute-button" onClick={() => onExecuteGoal(goal)} disabled={isProcessing}>Execute</button> )}
                {goal.logId && (goal.status === 'completed' || goal.status === 'failed') && ( <button className="goal-trace-button" onClick={() => onTrace(goal.logId!)}>Trace</button> )}
                <button className="goal-delete-button" onClick={() => dispatch({ type: 'DELETE_GOAL', payload: goal.id })} title="Delete Goal">&times;</button>
            </div>
        </div>
    );
    
    return (
        <div className="side-panel goals-panel">
            <div className="goals-content">
                <div className="panel-subsection-title">Core Motivational Drives</div>
                <div className="drives-grid">
                    {Object.entries(drives).map(([key, value]) => (
                        <div className="drive-item" key={key}>
                            <label title={`${key.replace(/([A-Z])/g, ' $1')}: ${value.toFixed(2)}`}>{key.replace(/([A-Z])/g, ' $1')}</label>
                            <div className="state-bar-container"><div className="state-bar" style={{ width: `${value * 100}%` }}></div></div>
                        </div>
                    ))}
                </div>
                {dominantGoal && ( <> <div className="panel-subsection-title">Dominant Goal</div> <div className="goal-list">{renderGoal(dominantGoal)}</div> </> )}
                {candidateGoals.length > 0 && ( <> <div className="panel-subsection-title">Candidate Goals</div> <div className="goal-list">{candidateGoals.map(renderGoal)}</div> </> )}
                {goalHistory.length > 0 && ( <> <div className="panel-subsection-title">Goal History</div> <div className="goal-list">{goalHistory.slice(0, 5).map(renderGoal)}</div> </> )}
                {goals.length === 0 && ( <div className="kg-placeholder">No goals generated. Use "Introspect" to run the motivation cycle.</div> )}
            </div>
        </div>
    );
});