import { AuraState, Action, KnowledgeFact } from '../../types';

export const memoryReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'ADD_FACT': {
            const factExists = state.knowledgeGraph.some(f => 
                f.subject === action.payload.subject && 
                f.predicate === action.payload.predicate &&
                f.object === action.payload.object
            );
            if (factExists) return {};
            const newFact: KnowledgeFact = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                confidence: 0.85, // Default confidence for single adds
                source: 'direct_add'
            };
            return { knowledgeGraph: [...state.knowledgeGraph, newFact] };
        }
        
        case 'ADD_FACTS_BATCH': {
            const newFacts = action.payload
                .filter(newFact => !state.knowledgeGraph.some(
                    existingFact => 
                        existingFact.subject.toLowerCase() === newFact.subject.toLowerCase() && 
                        existingFact.predicate.toLowerCase() === newFact.predicate.toLowerCase() &&
                        existingFact.object.toLowerCase() === newFact.object.toLowerCase()
                ))
                .map(fact => ({
                    ...fact,
                    id: self.crypto.randomUUID(),
                    source: 'ingestion'
                }));
            
            if (newFacts.length === 0) return {};

            return { knowledgeGraph: [...state.knowledgeGraph, ...newFacts] };
        }

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

        case 'ADD_EPISODE':
            return {
                ...state,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    // Add new episode and keep the last 100 most salient ones.
                    episodes: [...state.episodicMemoryState.episodes, action.payload]
                        .sort((a, b) => b.salience - a.salience)
                        .slice(0, 100),
                }
            };

        case 'UPDATE_CONSOLIDATION_STATUS':
            return {
                ...state,
                memoryConsolidationState: {
                    ...state.memoryConsolidationState,
                    status: action.payload,
                    ...(action.payload === 'idle' && { lastConsolidation: Date.now() }),
                }
            };

        default:
            return {};
    }
};