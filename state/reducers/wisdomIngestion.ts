// state/reducers/wisdomIngestion.ts
import { AuraState, Action } from '../../types';

export const wisdomIngestionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'WISDOM/START_INGESTION':
            return {
                wisdomIngestionState: {
                    ...state.wisdomIngestionState,
                    status: 'analyzing', // 'reading' is too fast, jump to analyzing
                    currentBookContent: args.content,
                    proposedAxioms: [],
                    errorMessage: null,
                }
            };

        case 'WISDOM/SET_PROPOSED_AXIOMS':
            return {
                wisdomIngestionState: {
                    ...state.wisdomIngestionState,
                    status: 'complete',
                    proposedAxioms: args.axioms,
                }
            };
        
        case 'WISDOM/ADD_PROPOSED_AXIOMS':
            return {
                wisdomIngestionState: {
                    ...state.wisdomIngestionState,
                    status: 'complete', // Set to complete to show the list
                    proposedAxioms: [...state.wisdomIngestionState.proposedAxioms, ...args.axioms],
                }
            };
            
        case 'WISDOM/PROCESS_AXIOM':
            return {
                wisdomIngestionState: {
                    ...state.wisdomIngestionState,
                    proposedAxioms: state.wisdomIngestionState.proposedAxioms.map(axiom => 
                        axiom.id === args.id ? { ...axiom, status: args.status } : axiom
                    )
                }
            };
        
        case 'WISDOM/SET_ERROR':
             return {
                wisdomIngestionState: {
                    ...state.wisdomIngestionState,
                    status: 'error',
                    errorMessage: args.error,
                }
            };

        case 'WISDOM/RESET':
            return {
                wisdomIngestionState: {
                    status: 'idle',
                    currentBookContent: null,
                    errorMessage: null,
                    proposedAxioms: [],
                }
            };

        default:
            return {};
    }
};