// state/reducers/mycelial.ts
import { AuraState, Action } from '../../types.ts';

export const mycelialReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'MYCELIAL/SAVE_MODULE': {
            const { moduleId, modelJSON, accuracy, lastPrediction } = args;
            const existingModule = state.mycelialState.modules[moduleId];
            if (!existingModule) return {};

            return {
                mycelialState: {
                    ...state.mycelialState,
                    modules: {
                        ...state.mycelialState.modules,
                        [moduleId]: {
                            ...existingModule,
                            isInitialized: true,
                            modelJSON,
                            accuracy,
                            lastPrediction,
                        }
                    }
                }
            };
        }

        case 'MYCELIAL/LOG_UPDATE': {
            const newLogEntry = {
                timestamp: Date.now(),
                message: args.message,
            };
            return {
                mycelialState: {
                    ...state.mycelialState,
                    log: [newLogEntry, ...state.mycelialState.log].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};