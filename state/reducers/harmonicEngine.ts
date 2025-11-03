// state/reducers/harmonicEngine.ts
import { AuraState, Action } from '../../types';

export const harmonicEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HARMONIC_ENGINE/SET_STATE': {
            return {
                harmonicEngineState: {
                    ...state.harmonicEngineState,
                    ...args,
                }
            };
        }
        default:
            return {};
    }
};