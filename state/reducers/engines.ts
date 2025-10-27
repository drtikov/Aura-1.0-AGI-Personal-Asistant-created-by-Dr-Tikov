import { AuraState, Action } from '../../types.ts';

export const enginesReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'UPDATE_SUGGESTION_STATUS': {
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    generatedSuggestions: state.proactiveEngineState.generatedSuggestions.map(s => s.id === args.id ? { ...s, status: args.status } : s),
                }
            };
        }

        case 'SET_PROACTIVE_CACHE':
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    cachedResponsePlan: args,
                }
            };

        case 'CLEAR_PROACTIVE_CACHE':
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    cachedResponsePlan: null,
                }
            };

        case 'ETHICAL_GOVERNOR/ADD_PRINCIPLE':
            if (state.ethicalGovernorState.principles.includes(args)) {
                return {}; // Avoid duplicates
            }
            return {
                ethicalGovernorState: {
                    ...state.ethicalGovernorState,
                    principles: [...state.ethicalGovernorState.principles, args]
                }
            };

        case 'ETHICAL_GOVERNOR/ADD_VETO_LOG': {
            return {
                ethicalGovernorState: {
                    ...state.ethicalGovernorState,
                    vetoLog: [args, ...state.ethicalGovernorState.vetoLog].slice(0, 20)
                }
            }
        }

        default:
            return {};
    }
};