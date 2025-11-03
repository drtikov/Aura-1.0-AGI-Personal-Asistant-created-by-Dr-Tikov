// state/reducers/temporalEngine.ts
import { AuraState, Action } from '../../types.ts';

export const temporalEngineReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'TEMPORAL_ENGINE/BEGIN_PROCESSING':
            return {
                temporalEngineState: {
                    status: 'active',
                    directive: args.directive,
                    chronicler: { status: 'pending', findings: [] },
                    reactor: { status: 'pending', finalPlan: null, executionLog: [] },
                    oracle: { status: 'pending', simulations: [] },
                    historian: { status: 'pending', findings: [] },
                    interClusterLog: [],
                }
            };

        case 'TEMPORAL_ENGINE/UPDATE_CHRONICLER':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    chronicler: { ...state.temporalEngineState.chronicler, ...args }
                }
            };

        case 'TEMPORAL_ENGINE/UPDATE_ORACLE':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    oracle: { ...state.temporalEngineState.oracle, ...args }
                }
            };
            
        case 'TEMPORAL_ENGINE/UPDATE_REACTOR':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    reactor: { ...state.temporalEngineState.reactor, ...args }
                }
            };

        case 'TEMPORAL_ENGINE/UPDATE_HISTORIAN':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    historian: { ...state.temporalEngineState.historian, ...args }
                }
            };

        case 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    interClusterLog: [...state.temporalEngineState.interClusterLog, args].slice(-20),
                }
            };

        case 'TEMPORAL_ENGINE/PROCESSING_COMPLETE':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    status: 'complete'
                }
            };

        case 'TEMPORAL_ENGINE/RESET':
            return {
                temporalEngineState: {
                    status: 'idle',
                    directive: null,
                    chronicler: { status: 'pending', findings: [] },
                    reactor: { status: 'pending', finalPlan: null, executionLog: [] },
                    oracle: { status: 'pending', simulations: [] },
                    historian: { status: 'pending', findings: [] },
                    interClusterLog: [],
                }
            };

        default:
            return {};
    }
};
