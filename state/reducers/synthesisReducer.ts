// state/reducers/synthesisReducer.ts
import { AuraState, Action } from '../../types.ts';

export const synthesisReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SYNTHESIS/ADD_IDEA': {
            const newIdea = {
                ...args,
                id: `idea_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
            };
            return {
                synthesisState: {
                    ...state.synthesisState,
                    emergentIdeas: [newIdea, ...state.synthesisState.emergentIdeas].slice(0, 20),
                }
            };
        }
        case 'GENERATE_EMERGENT_IDEA': {
            // This is handled by the autonomous system hook, but we can log it here.
            // In a more complex system, this might set a status.
            return {};
        }
        default:
            return {};
    }
};