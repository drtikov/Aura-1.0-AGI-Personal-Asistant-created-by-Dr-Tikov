import { AuraState, Action, GoalTree } from '../../types';

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
        case 'BUILD_GOAL_TREE':
            return {
                goalTree: args.tree,
                activeStrategicGoalId: args.rootId,
            };

        case 'UPDATE_GOAL_STATUS': {
            const { id, status } = args;
            const goal = state.goalTree[id];
            if (!goal || goal.status === status) {
                return {};
            }

            const updatedGoal = { ...goal, status, progress: status === 'completed' ? 1 : goal.progress };
            let newTree = { ...state.goalTree, [id]: updatedGoal };

            if (status === 'completed') {
                newTree = updateParentProgress(newTree, id);
            }
            
            return {
                goalTree: newTree,
            };
        }

        case 'UPDATE_GOAL_OUTCOME': // Stubbed
            console.log(`Action ${call} is not fully implemented.`);
            return {};

        default:
            return {};
    }
};