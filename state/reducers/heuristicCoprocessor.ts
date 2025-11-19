// state/reducers/heuristicCoprocessor.ts
import { AuraState, Action } from '../../types.ts';

export const heuristicCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HEURISTIC_COPROCESSOR/LOG_ACTIVATION': {
            const { coprocessorId, message, cooldownEnds } = args;
            const newLogEntry = {
                timestamp: Date.now(),
                coprocessorId,
                message,
            };
            return {
                heuristicCoprocessorState: {
                    ...state.heuristicCoprocessorState,
                    log: [newLogEntry, ...state.heuristicCoprocessorState.log].slice(0, 20),
                    cooldowns: {
                        ...state.heuristicCoprocessorState.cooldowns,
                        [coprocessorId]: cooldownEnds,
                    }
                }
            };
        }
        default:
            return {};
    }
};