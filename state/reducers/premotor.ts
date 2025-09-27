// state/reducers/premotor.ts
import { AuraState, Action } from '../../types';

export const premotorPlannerReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ADD_TACTICAL_PLAN': {
            return {
                premotorPlannerState: {
                    ...state.premotorPlannerState,
                    planLog: [args, ...state.premotorPlannerState.planLog].slice(0, 20),
                }
            };
        }
        
        case 'SET_COMPETING_PLANS': {
            return {
                premotorPlannerState: {
                    ...state.premotorPlannerState,
                    lastCompetingSet: args,
                }
            };
        }
        
        case 'CLEAR_PLANNING_STATE': {
            return {
                premotorPlannerState: {
                    ...state.premotorPlannerState,
                    lastCompetingSet: [],
                }
            };
        }

        default:
            return {};
    }
};