// state/reducers/ockhamEngine.ts
import { AuraState, Action } from '../../types.ts';

export const ockhamEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'OCKHAM/SET_STATE': {
            return {
                ockhamEngineState: {
                    ...state.ockhamEngineState,
                    ...args,
                }
            };
        }

        case 'OCKHAM/LOG': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                ockhamEngineState: {
                    ...state.ockhamEngineState,
                    log: [newLogEntry, ...state.ockhamEngineState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};