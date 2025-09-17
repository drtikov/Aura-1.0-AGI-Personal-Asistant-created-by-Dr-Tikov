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

        default:
            return {};
    }
};