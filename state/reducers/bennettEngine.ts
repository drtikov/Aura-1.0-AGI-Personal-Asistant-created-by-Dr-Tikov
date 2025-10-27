// state/reducers/bennettEngine.ts
import { AuraState, Action } from '../../types.ts';

export const bennettEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'BENNETT/SET_STATE': {
            return {
                bennettEngineState: {
                    ...state.bennettEngineState,
                    ...args,
                }
            };
        }

        case 'BENNETT/LOG': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                bennettEngineState: {
                    ...state.bennettEngineState,
                    log: [newLogEntry, ...state.bennettEngineState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};