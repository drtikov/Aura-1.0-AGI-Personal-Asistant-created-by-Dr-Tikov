// state/reducers/basalGanglia.ts
import { AuraState, Action } from '../../types';

export const basalGangliaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SELECT_ACTION_PLAN': {
            const logEntry = {
                timestamp: Date.now(),
                selectedPlanId: args.planId,
                competingPlanIds: args.competingPlanIds,
                reasoning: args.reasoning,
            };
            return {
                basalGangliaState: {
                    ...state.basalGangliaState,
                    selectedPlanId: args.planId,
                    log: [logEntry, ...state.basalGangliaState.log].slice(0, 20),
                }
            };
        }
        
        case 'CLEAR_PLANNING_STATE': {
            return {
                basalGangliaState: {
                    ...state.basalGangliaState,
                    selectedPlanId: null,
                }
            };
        }

        default:
            return {};
    }
};