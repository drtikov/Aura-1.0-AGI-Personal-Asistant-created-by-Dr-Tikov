// state/reducers/koniocortex.ts
import { AuraState, Action } from '../../types';

export const koniocortexReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PROCESS_USER_INPUT_INTO_PERCEPT': {
            const logMessage = `New percept generated. Intent: ${args.intent}.`;
            return {
                koniocortexSentinelState: {
                    ...state.koniocortexSentinelState,
                    lastPercept: args,
                    log: [{ timestamp: Date.now(), message: logMessage }, ...state.koniocortexSentinelState.log].slice(0, 20),
                }
            };
        }
        default:
            return {};
    }
};