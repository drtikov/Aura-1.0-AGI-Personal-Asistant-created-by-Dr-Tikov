// state/reducers/artificialScientist.ts
import { AuraState, Action } from '../../types.ts';

export const artificialScientistReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SCIENTIST/SET_STATE': {
            return {
                artificialScientistState: {
                    ...state.artificialScientistState,
                    ...args,
                }
            };
        }

        case 'SCIENTIST/LOG': {
            const { stage, message } = args;
            const newLogEntry = {
                timestamp: Date.now(),
                stage,
                message,
            };
            return {
                artificialScientistState: {
                    ...state.artificialScientistState,
                    log: [newLogEntry, ...state.artificialScientistState.log].slice(0, 50),
                }
            };
        }

        default:
            return {};
    }
};