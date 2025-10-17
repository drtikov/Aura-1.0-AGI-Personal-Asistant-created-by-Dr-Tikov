// state/reducers/atpCoprocessor.ts
import { AuraState, Action } from '../../types';

export const atpCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ATP/START_PROOF':
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'proving',
                    currentGoal: args.goal,
                    proofLog: [],
                    finalProof: null,
                }
            };

        case 'ATP/LOG_STEP': {
            const newStep = args;
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    proofLog: [...state.atpCoprocessorState.proofLog, newStep],
                }
            };
        }

        case 'ATP/SUCCEED': {
            const { proof, strategy } = args;
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'success',
                    finalProof: proof,
                    strategyMetrics: {
                        ...state.atpCoprocessorState.strategyMetrics,
                        [strategy]: {
                            ...state.atpCoprocessorState.strategyMetrics[strategy],
                            successes: state.atpCoprocessorState.strategyMetrics[strategy].successes + 1,
                        }
                    }
                }
            };
        }

        case 'ATP/FAIL': {
            const { reason, strategy } = args;
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'failed',
                    proofLog: [...state.atpCoprocessorState.proofLog, { step: -1, action: 'Failure', result: reason, strategy }],
                    strategyMetrics: {
                        ...state.atpCoprocessorState.strategyMetrics,
                        [strategy]: {
                            ...state.atpCoprocessorState.strategyMetrics[strategy],
                            failures: state.atpCoprocessorState.strategyMetrics[strategy].failures + 1,
                        }
                    }
                }
            };
        }

        case 'ATP/RESET':
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'idle',
                    currentGoal: null,
                    proofLog: [],
                    finalProof: null,
                }
            };

        default:
            return {};
    }
};