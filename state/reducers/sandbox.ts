// state/reducers/sandbox.ts
import { AuraState, Action } from '../../types';

export const sandboxReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SANDBOX/START_SPRINT': {
            return {
                evolutionarySandboxState: {
                    ...state.evolutionarySandboxState,
                    status: 'running',
                    sprintGoal: args.goal,
                    startTime: Date.now(),
                    log: [],
                    result: null,
                }
            };
        }

        case 'SANDBOX/LOG_STEP': {
            const newLogEntry = { timestamp: Date.now(), message: args };
            return {
                evolutionarySandboxState: {
                    ...state.evolutionarySandboxState,
                    log: [...state.evolutionarySandboxState.log, newLogEntry].slice(-100), // Keep last 100 logs
                }
            };
        }

        case 'SANDBOX/COMPLETE_SPRINT': {
            return {
                evolutionarySandboxState: {
                    ...state.evolutionarySandboxState,
                    status: 'complete',
                    result: args,
                }
            };
        }

        case 'SANDBOX/RESET': {
            return {
                evolutionarySandboxState: {
                    status: 'idle',
                    sprintGoal: null,
                    log: [],
                    startTime: null,
                    result: null,
                }
            };
        }

        default:
            return {};
    }
};