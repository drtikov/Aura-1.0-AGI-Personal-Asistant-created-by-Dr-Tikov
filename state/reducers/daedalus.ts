// state/reducers/daedalus.ts
import { AuraState, Action } from '../../types.ts';

export const daedalusReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'DAEDALUS/SET_STATE':
            return {
                daedalusLabyrinthState: {
                    ...state.daedalusLabyrinthState,
                    ...args,
                }
            };

        case 'DAEDALUS/SET_GRAPH':
            return {
                daedalusLabyrinthState: {
                    ...state.daedalusLabyrinthState,
                    structuralKnowledgeGraph: args.graph,
// FIX: Changed status to 'complete' which is a valid type now.
                    status: 'complete',
                    lastAnalysis: Date.now(),
                }
            };

        default:
            return {};
    }
};