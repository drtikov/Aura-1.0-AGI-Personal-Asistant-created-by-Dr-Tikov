// state/reducers/praxisResonator.ts
import { AuraState, Action } from '../../types';

export const praxisResonatorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PRAXIS/CREATE_SESSION': {
            return {
                praxisResonatorState: {
                    ...state.praxisResonatorState,
                    activeSessions: {
                        ...state.praxisResonatorState.activeSessions,
                        [args.planId]: args,
                    }
                }
            };
        }
        
        case 'PRAXIS/DELETE_SESSION': {
            const { [args.planId]: _, ...remainingSessions } = state.praxisResonatorState.activeSessions;
            return {
                praxisResonatorState: {
                    ...state.praxisResonatorState,
                    activeSessions: remainingSessions,
                }
            };
        }

        default:
            return {};
    }
};