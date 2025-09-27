// state/reducers/memory.ts
import { AuraState, Action } from '../../types';

export const memoryReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ADD_FACT': {
            const newFact = { ...args, id: self.crypto.randomUUID() };
            return { knowledgeGraph: [...state.knowledgeGraph, newFact] };
        }
        case 'ADD_FACTS_BATCH': {
            const newFacts = args.map((fact: any) => ({
                ...fact,
                id: self.crypto.randomUUID(),
                source: 'llm_extraction'
            }));
            return { knowledgeGraph: [...state.knowledgeGraph, ...newFacts] };
        }
        case 'DELETE_FACT':
            return {
                knowledgeGraph: state.knowledgeGraph.filter(fact => fact.id !== args),
            };
        case 'ADD_TO_WORKING_MEMORY':
            return {
                workingMemory: [...state.workingMemory, args].slice(-10),
            };
        case 'REMOVE_FROM_WORKING_MEMORY':
            return {
                workingMemory: state.workingMemory.filter(item => item !== args),
            };
        case 'CLEAR_WORKING_MEMORY':
            return { workingMemory: [] };

        case 'ADD_EPISODE':
            return {
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: [...state.episodicMemoryState.episodes, args].slice(-50) // Keep last 50 episodes
                }
            };
        
        case 'MEMORY/STRENGTHEN_HYPHA_CONNECTION': {
            const { source, target } = args;
            const existingConnection = state.memoryNexus.hyphaeConnections.find(
                h => (h.source === source && h.target === target) || (h.source === target && h.target === source)
            );

            if (existingConnection) {
                const newWeight = existingConnection.weight * 0.9 + 0.1; // Reinforce existing path
                return {
                    memoryNexus: {
                        ...state.memoryNexus,
                        hyphaeConnections: state.memoryNexus.hyphaeConnections.map(h =>
                            h.id === existingConnection.id ? { ...h, weight: Math.min(1, newWeight) } : h
                        ),
                    }
                };
            } else {
                const newConnection = {
                    id: `${source}-${target}-${self.crypto.randomUUID()}`,
                    source,
                    target,
                    weight: 0.1, // Initial connection strength
                };
                return {
                    memoryNexus: {
                        ...state.memoryNexus,
                        hyphaeConnections: [...state.memoryNexus.hyphaeConnections, newConnection],
                    }
                };
            }
        }

        case 'MEMORY/ADD_CRYSTALLIZED_FACT': {
            const newFact = { ...args, id: self.crypto.randomUUID(), source: 'emergent_synthesis' };
            return { knowledgeGraph: [...state.knowledgeGraph, newFact] };
        }

        default:
            return {};
    }
};