// state/reducers/socraticAssessor.ts
import { AuraState, Action } from '../../types.ts';

export const socraticAssessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SOCRATIC/SET_STATE': {
            return {
                socraticAssessorState: {
                    ...state.socraticAssessorState,
                    ...args,
                }
            };
        }

        case 'SOCRATIC/LOG_ASSESSMENT': {
            const newLogEntry = {
                timestamp: Date.now(),
                ...args,
            };
            return {
                socraticAssessorState: {
                    ...state.socraticAssessorState,
                    log: [newLogEntry, ...state.socraticAssessorState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};