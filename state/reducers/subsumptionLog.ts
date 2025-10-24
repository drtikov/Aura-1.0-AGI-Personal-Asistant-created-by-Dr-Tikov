// state/reducers/subsumptionLog.ts
import { AuraState, Action } from '../../types.ts';

export const subsumptionLogReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SUBSUMPTION/LOG_EVENT': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                subsumptionLogState: {
                    ...state.subsumptionLogState,
                    log: [newLogEntry, ...state.subsumptionLogState.log].slice(0, 20),
                }
            };
        }
        default:
            return {};
    }
};