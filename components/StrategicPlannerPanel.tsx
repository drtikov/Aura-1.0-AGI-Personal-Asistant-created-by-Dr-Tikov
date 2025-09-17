import React from 'react';
import { usePlanningState } from '../context/AuraContext';

export const StrategicPlannerPanel = React.memo(() => {
    const { goalTree, activeStrategicGoalId: activeGoalId } = usePlanningState();
    const renderGoalNode = (goalId: string) => {
        const goal = goalTree[goalId];
        if (!goal) return null;

        return (
            <div key={goal.id} className="goal-node-wrapper">
                <div className={`goal-tree-item status-${goal.status}`}>
                    <div className="goal-tree-header">
                        <span className="goal-tree-description">{goal.description}</span>
                        <span className={`goal-status status-${goal.status}`}>{goal.status}</span>
                    </div>
                    <div className="goal-tree-progress-container">
                        <div 
                            className="goal-tree-progress-bar"
                            style={{ width: `${goal.progress * 100}%`}}
                        ></div>
                    </div>
                </div>
                {goal.children && goal.children.length > 0 && (
                    <div className="goal-children-container">
                         {goal.children.map(childId => renderGoalNode(childId))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="side-panel goals-panel">
            {activeGoalId && goalTree[activeGoalId] ? (
                <div className="goal-tree-container">
                    {renderGoalNode(activeGoalId)}
                </div>
            ) : (
                <div className="kg-placeholder">
                    No active strategic goal. Set one using the "Set Goal" cognitive trigger.
                </div>
            )}
        </div>
    );
});