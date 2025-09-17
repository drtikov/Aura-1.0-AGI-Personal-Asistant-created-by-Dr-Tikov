import { AuraState, Action } from '../../types';

export const memoryReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'ADD_FACT': // Stubbed
             console.log(`Action ${action.type} is not fully implemented.`);
            return {};

        case 'DELETE_FACT':
            return { knowledgeGraph: state.knowledgeGraph.filter(fact => fact.id !== action.payload) };

        case 'CLEAR_WORKING_MEMORY':
            return { workingMemory: [] };

        case 'REMOVE_FROM_WORKING_MEMORY':
            return { workingMemory: state.workingMemory.filter(item => item !== action.payload) };
            
        case 'UPDATE_FACT':
            return {
                knowledgeGraph: state.knowledgeGraph.map(fact =>
                    fact.id === action.payload.id ? { ...fact, ...action.payload.updates } : fact
                )
            };

        default:
            return {};
    }
};