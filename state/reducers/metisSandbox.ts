// state/reducers/metisSandbox.ts
import { AuraState, Action } from '../../types';

export const metisSandboxReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SANDBOX/TEST_PROPOSAL': {
            const { experimentId } = args;
            return {
                metisSandboxState: {
                    ...state.metisSandboxState,
                    status: 'running',
                    currentExperimentId: experimentId,
                    testResults: null,
                    errorMessage: null,
                }
            };
        }

        case 'SANDBOX/REPORT_RESULTS': {
            const { results, error } = args;
            return {
                metisSandboxState: {
                    ...state.metisSandboxState,
                    status: error ? 'error' : 'complete',
                    testResults: results,
                    errorMessage: error,
                }
            };
        }

        default:
            return {};
    }
};
