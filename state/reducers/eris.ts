// state/reducers/eris.ts
import { AuraState, Action } from '../../types.ts';

export const erisReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ERIS/SET_ACTIVE':
            return {
                erisEngineState: {
                    ...state.erisEngineState,
                    isActive: args.isActive,
                }
            };

        case 'ERIS/SET_CHAOS_LEVEL':
            return {
                erisEngineState: {
                    ...state.erisEngineState,
                    chaosLevel: args.level,
                }
            };
            
        case 'ERIS/SET_MODE':
            return {
                erisEngineState: {
                    ...state.erisEngineState,
                    perturbationMode: args.mode,
                }
            };
            
        case 'ERIS/LOG_INTERVENTION':
            return {
                erisEngineState: {
                    ...state.erisEngineState,
                    log: [args.message, ...state.erisEngineState.log].slice(0, 20),
                }
            };
            
        default:
            return {};
    }
};