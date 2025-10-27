// state/reducers/lagrangeEngine.ts
import { AuraState, Action } from '../../types.ts';

export const lagrangeEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'LAGRANGE/SET_STATE':
            return {
                lagrangeEngineState: {
                    ...state.lagrangeEngineState,
                    ...args,
                }
            };
        case 'LAGRANGE/ADD_LOG':
            return {
                lagrangeEngineState: {
                    ...state.lagrangeEngineState,
                    simulationLog: [...state.lagrangeEngineState.simulationLog, args].slice(-10)
                }
            }
        default:
            return {};
    }
};