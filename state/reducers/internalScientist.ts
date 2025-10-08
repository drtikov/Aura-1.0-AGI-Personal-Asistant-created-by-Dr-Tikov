// state/reducers/internalScientist.ts
import { AuraState, Action } from '../../types';

export const internalScientistReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SCIENTIST/UPDATE_STATE': {
            const newLogEntry = { timestamp: Date.now(), event: args.status || 'state updated' };
            
            let updates = { ...args };
            // Ensure simulation result is cleared when moving to a non-simulating state
            if (args.status && args.status !== 'simulating' && state.internalScientistState.currentSimulationResult) {
                updates.currentSimulationResult = null;
            }

            return {
                internalScientistState: {
                    ...state.internalScientistState,
                    ...updates,
                    log: [newLogEntry, ...state.internalScientistState.log].slice(0, 50),
                }
            };
        }

        default:
            return {};
    }
};