// state/reducers/strategicCore.ts
import { AuraState, Action } from '../../types';

export const strategicCoreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'STRATEGIC_CORE/LOG_DECISION':
            return {
                strategicCoreState: {
                    ...state.strategicCoreState,
                    log: [args, ...state.strategicCoreState.log].slice(0, 50),
                }
            };

        case 'STRATEGIC_CORE/UPDATE_LOG_ENTRY':
            return {
                strategicCoreState: {
                    ...state.strategicCoreState,
                    log: state.strategicCoreState.log.map(entry =>
                        entry.id === args.id ? { ...entry, ...args.updates } : entry
                    ),
                }
            };

        case 'STRATEGIC_CORE/ADD_TRAINING_DATA':
            return {
                strategicCoreState: {
                    ...state.strategicCoreState,
                    trainingData: [...state.strategicCoreState.trainingData, args].slice(-100),
                }
            };

        default:
            return {};
    }
};