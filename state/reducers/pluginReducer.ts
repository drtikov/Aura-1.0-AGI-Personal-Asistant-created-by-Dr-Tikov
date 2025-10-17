// state/reducers/pluginReducer.ts
import { AuraState, Action } from '../../types';

export const pluginReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PLUGIN/ADD_PLUGIN': {
             return {
                pluginState: {
                    ...state.pluginState,
                    registry: [...state.pluginState.registry, args]
                }
            };
        }
        
        default:
            return {};
    }
};