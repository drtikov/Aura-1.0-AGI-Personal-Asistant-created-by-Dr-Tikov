// state/reducers/planning.ts
import { AuraState, Action, GoalTree, Goal, GoalType, ConceptualProofStrategy, PreFlightPlan } from '../../types.ts';

const updateParentProgress = (tree: GoalTree, childId: string): GoalTree => {
    const child = tree[childId];
    if (!child || !child.parentId) {
        return tree;
    }

    const parent = tree[child.parentId];
    if (!parent) {
        return tree;
    }

    const siblings = parent.children.map(id => tree[id]);
    const completedSiblings = siblings.filter(s => s.status === 'completed');
    const newProgress = siblings.length > 0 ? completedSiblings.length / siblings.length : 0;
    
    const updatedParent = { ...parent, progress: newProgress };
    const newTree = { ...tree, [parent.id]: updatedParent };

    // If parent is now complete, recurse
    if (newProgress === 1 && parent.status !== 'completed') {
        const completedParent = { ...updatedParent, status: 'completed' as const };
        const treeWithCompletedParent = { ...newTree, [parent.id]: completedParent };
        return updateParentProgress(treeWithCompletedParent, parent.id);
    }
    
    return newTree;
};


export const planningReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'BUILD_GUILD_TASK_TREE': {
            const { plan, rootGoal } = args as { plan: PreFlightPlan, rootGoal: string };
            if (!plan || !rootGoal) return {};
            
            const rootId = `goal_${self.crypto.randomUUID()}`;
            const newTree: GoalTree = {};
            
            const childrenIds = plan.steps.map(step => {
                const childId = `goal_${self.crypto.randomUUID()}`;
                newTree[childId] = {
                    id: childId,
                    parentId: rootId,
                    children: [],
                    description: step.task,
                    status: 'not_started',
                    progress: 0,
                    type: step.type === 'Research' ? GoalType.RESEARCH : GoalType.TACTICAL,
                    personaId: step.personaId || undefined,
                };
                return childId;
            });

            newTree[rootId] = {
                id: rootId,
                parentId: null,
                children: childrenIds,
                description: rootGoal,
                status: 'in_progress',
                progress: 0,
                type: GoalType.STRATEGIC,
            };

            const newCommittedGoal = {
                type: GoalType.STRATEGIC,
                description: rootGoal,
                commitmentStrength: 0.9,
            };

            return {
                goalTree: newTree,
                activeStrategicGoalId: rootId,
                disciplineState: {
                    ...state.disciplineState,
                    committedGoal: newCommittedGoal,
                }
            };
        }

        case 'BUILD_GOAL_TREE': {
            const { decomposition, rootGoal } = args;
            if (!decomposition || !rootGoal) return {};

            const rootId = `goal_${self.crypto.randomUUID()}`;
            const newTree: GoalTree = {};

            const childrenIds = decomposition.steps.map((step: string) => {
                const childId = `goal_${self.crypto.randomUUID()}`;
                newTree[childId] = {
                    id: childId,
                    parentId: rootId,
                    children: [],
                    description: step,
                    status: 'not_started',
                    progress: 0,
                    type: GoalType.TACTICAL,
                };
                return childId;
            });

            newTree[rootId] = {
                id: rootId,
                parentId: null,
                children: childrenIds,
                description: rootGoal,
                status: 'in_progress',
                progress: 0,
                type: GoalType.STRATEGIC,
            };
            
            const newCommittedGoal = {
                type: GoalType.STRATEGIC,
                description: rootGoal,
                commitmentStrength: 0.9,
            };

            return {
                goalTree: newTree,
                activeStrategicGoalId: rootId,
                disciplineState: {
                    ...state.disciplineState,
                    committedGoal: newCommittedGoal,
                    adherenceScore: 1.0, 
                    distractionResistance: 0.5 
                }
            };
        }
        
        case 'BUILD_PROOF_TREE': {
            const { strategy, rootGoal } = args as { strategy: ConceptualProofStrategy, rootGoal: string };
            if (!strategy || !rootGoal) return {};

            const rootId = `goal_${self.crypto.randomUUID()}`;
            const newTree: GoalTree = {};

            const childrenIds = strategy.strategic_plan.map((step: string) => {
                const childId = `goal_${self.crypto.randomUUID()}`;
                newTree[childId] = {
                    id: childId,
                    parentId: rootId,
                    children: [],
                    description: step, // The step is a lemma to prove
                    status: 'not_started',
                    progress: 0,
                    type: GoalType.TACTICAL,
                    attempts: 0,
                };
                return childId;
            });

            newTree[rootId] = {
                id: rootId,
                parentId: null,
                children: childrenIds,
                description: rootGoal,
                status: 'in_progress',
                progress: 0,
                type: GoalType.MATHEMATICAL_PROOF,
                attempts: 1,
            };

            return {
                goalTree: newTree,
                activeStrategicGoalId: rootId,
            };
        }

        case 'UPDATE_GOAL_STATUS': {
            const { id, status, failureReason } = args;
            const goal = state.goalTree[id];
            if (!goal || goal.status === status) {
                return {};
            }

            const progress = status === 'completed' ? 1 : goal.progress;
            // When a proof fails, reset its status to 'not_started' to allow for another attempt
            const finalStatus = status === 'failed' && goal.type === GoalType.MATHEMATICAL_PROOF ? 'not_started' : status;
            
            const updatedGoal = { 
                ...goal, 
                status: finalStatus, 
                progress, 
                failureReason: failureReason || null,
                // Increment attempts on failure, reset on other transitions
                attempts: status === 'failed' ? (goal.attempts || 0) + 1 : goal.attempts,
            };
            let newTree = { ...state.goalTree, [id]: updatedGoal };

            if (status === 'completed') {
                newTree = updateParentProgress(newTree, id);
            }
            
            // If the root goal is completed, clear the active goal
            let activeStrategicGoalId = state.activeStrategicGoalId;
            const rootGoal = newTree[state.activeStrategicGoalId || ''];
            if (rootGoal?.status === 'completed') {
                activeStrategicGoalId = null;
            }


            return {
                goalTree: newTree,
                activeStrategicGoalId,
            };
        }

        case 'UPDATE_GOAL_RESULT': {
            const { id, historyId } = args;
            const goal = state.goalTree[id];
            if (!goal) return {};
            const updatedGoal = { ...goal, resultHistoryId: historyId };
            return {
                goalTree: {
                    ...state.goalTree,
                    [id]: updatedGoal,
                }
            };
        }

        case 'UPDATE_GOAL_OUTCOME': // Stubbed
            console.log(`Action ${call} is not fully implemented.`);
            return {};

        default:
            return {};
    }
};