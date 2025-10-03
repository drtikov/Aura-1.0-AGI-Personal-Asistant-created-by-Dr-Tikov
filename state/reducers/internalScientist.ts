// state/reducers/internalScientist.ts
import { AuraState, Action } from '../../types';

export const internalScientistReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SCIENTIST/UPDATE_STATE': {
            const newLogEntry = { timestamp: Date.now(), event: args.status };
            return {
                internalScientistState: {
                    ...state.internalScientistState,
                    ...args,
                    log: [newLogEntry, ...state.internalScientistState.log].slice(0, 50),
                }
            };
        }

        default:
            return {};
    }
};