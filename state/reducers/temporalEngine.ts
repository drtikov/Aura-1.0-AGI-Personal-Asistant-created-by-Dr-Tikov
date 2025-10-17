// state/reducers/temporalEngine.ts
import { AuraState, Action } from '../../types';

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
        
        case 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    interClusterLog: [args, ...state.temporalEngineState.interClusterLog].slice(0, 10)
                }
            };

        case 'TEMPORAL_ENGINE/PROCESSING_COMPLETE':
            return {
                temporalEngineState: {
                    ...state.temporalEngineState,
                    status: 'complete',
                }
            };
            
        case 'TEMPORAL_ENGINE/RESET':
            return {
                temporalEngineState: {
                    status: 'idle',
                    directive: null,
// FIX: Changed status from 'idle' to 'pending' to match type definition.
                    chronicler: { status: 'pending', findings: [] },
// FIX: Changed status from 'idle' to 'pending' to match type definition.
                    reactor: { status: 'pending', finalPlan: null, executionLog: [] },
// FIX: Changed status from 'idle' to 'pending' to match type definition.
                    oracle: { status: 'pending', simulations: [] },
                    interClusterLog: [],
                }
            };

        default:
            return {};
    }
};