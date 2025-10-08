// state/reducers/persona.ts
import { AuraState, Action } from '../../types';

export const personaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        // Actions related to persona state will go here in the future
        default:
            return {};
    }
};
