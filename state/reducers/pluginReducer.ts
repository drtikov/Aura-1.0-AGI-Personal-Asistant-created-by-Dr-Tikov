// state/reducers/pluginReducer.ts
import { AuraState, Action } from '../../types';

export const pluginReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PLUGIN/SET_STATUS': {
            const { pluginId, status } = args;
            return {
                pluginState: {
                    ...state.pluginState,
                    registry: state.pluginState.registry.map(p => 
                        p.id === pluginId ? { ...p, status } : p
                    ),
                }
            };
        }
        default:
            return {};
    }
};