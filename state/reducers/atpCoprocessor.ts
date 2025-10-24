// state/reducers/atpCoprocessor.ts
import { AuraState, Action } from '../../types.ts';

export const atpCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ATP/START_ORCHESTRATION':
             return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'orchestrating',
                    currentGoal: args.goal,
                    proofLog: [],
                    finalProof: null,
                    proofTreeRootId: null,
                    currentStrategy: null,
                }
            };

        case 'ATP/SET_STRATEGY':
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'orchestrating',
                    currentStrategy: args.strategy,
                }
            };

        case 'ATP/SET_PROOF_TREE_ROOT':
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    proofTreeRootId: args.rootId,
                }
            };

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
            const currentMetrics = state.atpCoprocessorState.strategyMetrics[strategy] || { successes: 0, failures: 0 };
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'success',
                    finalProof: proof,
                    strategyMetrics: {
                        ...state.atpCoprocessorState.strategyMetrics,
                        [strategy]: {
                            ...currentMetrics,
                            successes: currentMetrics.successes + 1,
                        }
                    }
                }
            };
        }

        case 'ATP/FAIL': {
            const { reason, strategy } = args;
            const currentMetrics = state.atpCoprocessorState.strategyMetrics[strategy] || { successes: 0, failures: 0 };
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'failed',
                    proofLog: [...state.atpCoprocessorState.proofLog, { step: -1, action: 'Failure', result: reason, strategy }],
                    strategyMetrics: {
                        ...state.atpCoprocessorState.strategyMetrics,
                        [strategy]: {
                            ...currentMetrics,
                            failures: currentMetrics.failures + 1,
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
                    proofTreeRootId: null,
                    currentStrategy: null,
                }
            };

        default:
            return {};
    }
};