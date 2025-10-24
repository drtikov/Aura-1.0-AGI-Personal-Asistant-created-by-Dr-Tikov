// state/reducers/pluginReducer.ts
import { AuraState, Action, Plugin } from '../../types';

export const pluginReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PLUGIN/ADD_PLUGIN': {
            const newPlugin = args as Plugin;
            // Avoid adding duplicates
            if (state.pluginState.registry.some(p => p.id === newPlugin.id)) {
                return {};
            }
            return {
                pluginState: {
                    ...state.pluginState,
                    registry: [...state.pluginState.registry, newPlugin]
                }
            };
        }
        case 'PLUGIN/REGISTER_LIBRARY': {
             return {
                pluginState: {
                    ...state.pluginState,
                    loadedLibraries: {
                        ...state.pluginState.loadedLibraries,
                        [args.id]: { id: args.id, name: args.name, status: 'loading' }
                    }
                }
            };
        }
        case 'PLUGIN/SET_LIBRARY_STATUS': {
            const { id, status } = args;
            if (!state.pluginState.loadedLibraries || !state.pluginState.loadedLibraries[id]) return {};

            return {
                 pluginState: {
                    ...state.pluginState,
                    loadedLibraries: {
                        ...state.pluginState.loadedLibraries,
                        [id]: { ...state.pluginState.loadedLibraries[id], status }
                    }
                }
            }
        }
        default:
            return {};
    }
};
