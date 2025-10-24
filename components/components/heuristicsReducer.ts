// state/reducers/heuristicsReducer.ts
import { AuraState, Action } from '../../types';

export const heuristicsReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HEURISTICS_FORGE/ADD_HEURISTIC': {
            const newHeuristic = { ...args, id: `heuristic_${self.crypto.randomUUID()}` };
            // Avoid duplicates
            if (state.heuristicsForge.designHeuristics.some(h => h.heuristic === newHeuristic.heuristic)) {
                return {};
            }
            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    designHeuristics: [newHeuristic, ...state.heuristicsForge.designHeuristics].slice(0, 50)
                }
            };
        }

        default:
            return {};
    }
};