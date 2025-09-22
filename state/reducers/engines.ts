import { AuraState, Action } from '../../types';

export const enginesReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'UPDATE_SUGGESTION_STATUS': {
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    generatedSuggestions: state.proactiveEngineState.generatedSuggestions.map(s => s.id === action.payload.id ? { ...s, status: action.payload.status } : s),
                }
            };
        }

        case 'SET_PROACTIVE_CACHE':
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    cachedResponsePlan: action.payload,
                }
            };

        case 'CLEAR_PROACTIVE_CACHE':
            return {
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    cachedResponsePlan: null,
                }
            };

        default:
            return {};
    }
};