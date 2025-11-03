// state/reducers/brainstorm.ts
import { AuraState, Action } from '../../types';

export const brainstormReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'BRAINSTORM/RESET':
            return {
                brainstormState: {
                    status: 'idle',
                    topic: null,
                    ideas: [],
                    winningIdea: null,
                    finalProposalId: null,
                }
            };

        case 'BRAINSTORM/START':
            return {
                brainstormState: {
                    ...state.brainstormState,
                    status: 'brainstorming',
                    topic: args.topic,
                    ideas: [],
                    winningIdea: null,
                    finalProposalId: null,
                }
            };

        case 'BRAINSTORM/SET_STATUS':
            return {
                brainstormState: {
                    ...state.brainstormState,
                    status: args.status,
                }
            };
            
        case 'BRAINSTORM/ADD_IDEA':
            return {
                brainstormState: {
                    ...state.brainstormState,
                    ideas: [...state.brainstormState.ideas, args.idea],
                }
            };

        case 'BRAINSTORM/SET_WINNER':
            return {
                brainstormState: {
                    ...state.brainstormState,
                    status: 'proposing',
                    winningIdea: args.winningIdea,
                }
            };
        
        case 'BRAINSTORM/FINALIZE':
             return {
                brainstormState: {
                    ...state.brainstormState,
                    status: 'complete',
                    finalProposalId: args.finalProposalId,
                }
            };

        default:
            return {};
    }
};