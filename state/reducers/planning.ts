import { AuraState, Action } from '../../types';

export const planningReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'UPDATE_GOAL_STATUS': // Stubbed
        case 'UPDATE_GOAL_OUTCOME': // Stubbed
            console.log(`Action ${action.type} is not fully implemented.`);
            return {};

        default:
            return {};
    }
};