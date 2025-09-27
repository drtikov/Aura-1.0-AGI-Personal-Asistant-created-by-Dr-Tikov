import React from 'react';
import { usePlanningState, useLocalization } from '../context/AuraContext';
import { Goal } from '../types';

export const StrategicPlannerPanel = React.memo(() => {
    const { goalTree, activeStrategicGoalId: activeGoalId } = usePlanningState();
    const { t } = useLocalization();
    const renderGoalNode = (goalId: string) => {
        const goal = goalTree[goalId];
        if (!goal) return null;
        
        const getStatusKey = (status: Goal['status']) => {
            switch(status) {
                case 'not_started': return 'goalStatus_not_started';
                case 'in_progress': return 'goalStatus_in_progress';
                case 'completed': return 'goalStatus_completed';
                case 'failed': return 'goalStatus_failed';
                default: return status;
            }
        }

        return (
            <div key={goal.id} className="goal-node-wrapper">
                <div className={`goal-tree-item status-${goal.status}`}>
                    <div className="goal-tree-header">
                        <span className="goal-tree-description">{goal.description}</span>
                        <span className={`goal-status status-${goal.status}`}>{t(getStatusKey(goal.status))}</span>
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
                    {t('strategicPlanner_placeholder')}
                </div>
            )}
        </div>
    );
});