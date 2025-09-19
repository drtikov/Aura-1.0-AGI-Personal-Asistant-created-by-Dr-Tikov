import { AuraState, Action } from '../../types';

export const planningReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'BUILD_GOAL_TREE':
            return {
                goalTree: action.payload.tree,
                activeStrategicGoalId: action.payload.rootId,
            };

        case 'UPDATE_GOAL_STATUS': // Stubbed
        case 'UPDATE_GOAL_OUTCOME': // Stubbed
            console.log(`Action ${action.type} is not fully implemented.`);
            return {};

        default:
            return {};
    }
};