// state/reducers/praxisCore.ts
import { AuraState, Action } from '../../types';

export const praxisCoreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PRAXIS_CORE/LOG_EXECUTION': {
            const newLogEntry = {
                timestamp: Date.now(),
                ...args
            };
            return {
                praxisCoreState: {
                    ...state.praxisCoreState,
                    log: [newLogEntry, ...state.praxisCoreState.log].slice(0, 20),
                }
            };
        }
        default:
            return {};
    }
};