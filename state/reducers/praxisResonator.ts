// state/reducers/praxisResonator.ts
import { AuraState, Action } from '../../types';

export const praxisResonatorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PRAXIS/CREATE_SESSION': {
            const sessionData = args as { planId: string; chat: { model: string }; createdAt: number };
            const serializableSession = {
                planId: sessionData.planId,
                model: sessionData.chat.model, // Extract only the model name
                createdAt: sessionData.createdAt,
            };

            return {
                praxisResonatorState: {
                    ...state.praxisResonatorState,
                    activeSessions: {
                        ...state.praxisResonatorState.activeSessions,
                        [serializableSession.planId]: serializableSession,
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
