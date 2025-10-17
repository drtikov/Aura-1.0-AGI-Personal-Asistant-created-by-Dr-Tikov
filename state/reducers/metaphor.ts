// state/reducers/metaphor.ts
import { AuraState, Action, Metaphor } from '../../types';

export const metaphorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'METAPHOR/ADD': {
            const newMetaphor: Metaphor = {
                ...args,
                id: self.crypto.randomUUID(),
            };
            return {
                metaphoricalMapState: {
                    ...state.metaphoricalMapState,
                    metaphors: [newMetaphor, ...state.metaphoricalMapState.metaphors],
                }
            };
        }

        case 'METAPHOR/UPDATE': {
            const { id, updates } = args;
            return {
                metaphoricalMapState: {
                    ...state.metaphoricalMapState,
                    metaphors: state.metaphoricalMapState.metaphors.map(m =>
                        m.id === id ? { ...m, ...updates } : m
                    ),
                }
            };
        }

        default:
            return {};
    }
};
