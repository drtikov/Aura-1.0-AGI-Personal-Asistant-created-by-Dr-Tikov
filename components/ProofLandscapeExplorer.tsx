// components/ProofLandscapeExplorer.tsx
import React from 'react';
import { usePlanningState, useLocalization } from '../context/AuraContext.tsx';
import { Goal } from '../types.ts';

const GoalNode = React.memo(({ goalId, goalTree }: { goalId: string; goalTree: { [id: string]: Goal } }) => {
    const goal = goalTree[goalId];
    const { t } = useLocalization();
    if (!goal) return null;

    const getStatusKey = (status: Goal['status']) => {
        switch(status) {
            case 'not_started': return 'goalStatus_not_started';
            case 'in_progress': return 'goalStatus_in_progress';
            case 'completed': return 'goalStatus_completed';
            case 'failed': return 'goalStatus_failed';
            case 'proving': return 'goalStatus_proving';
            default: return status;
        }
    };

    return (
        <div className="goal-node-wrapper">
            <div className={`goal-tree-item status-${goal.status}`}>
                <div className="goal-tree-header">
                    <span className="goal-tree-description">{goal.description}</span>
                    <span className={`goal-status status-${goal.status}`}>
                        {goal.status === 'proving' && <div className="spinner-small" style={{ display: 'inline-block', marginRight: '0.5rem' }}/>}
                        {t(getStatusKey(goal.status))}
                    </span>
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
                     {goal.children.map(childId => <GoalNode key={childId} goalId={childId} goalTree={goalTree} />)}
                </div>
            )}
        </div>
    );
});

export const ProofLandscapeExplorer = () => {
    const { goalTree, activeStrategicGoalId } = usePlanningState();
    const { t } = useLocalization();

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This panel visualizes Aura's high-level strategic plan for its current long-term research goal. It shows how a complex objective is decomposed into smaller, tactical sub-problems (lemmas).
            </p>
            {activeStrategicGoalId && goalTree[activeStrategicGoalId] ? (
                <div className="goal-tree-container">
                    <GoalNode goalId={activeStrategicGoalId} goalTree={goalTree} />
                </div>
            ) : (
                <div className="kg-placeholder">
                    No active strategic research program. Set a goal via the "ATP Coprocessor" panel to begin.
                </div>
            )}
        </div>
    );
};