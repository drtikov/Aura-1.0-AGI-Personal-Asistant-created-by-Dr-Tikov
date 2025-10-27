// state/reducers/semanticWeaver.ts
import { AuraState, Action } from '../../types.ts';

export const semanticWeaverReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SEMANTIC_WEAVER/SAVE_MODEL': {
            const { modelJSON, accuracy } = args;
            return {
                semanticWeaverState: {
                    ...state.semanticWeaverState,
                    isTrained: true,
                    modelJSON,
                    accuracy,
                }
            };
        }

        case 'SEMANTIC_WEAVER/LOG_TRAINING': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                semanticWeaverState: {
                    ...state.semanticWeaverState,
                    log: [newLogEntry, ...state.semanticWeaverState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};