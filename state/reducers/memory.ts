// state/reducers/memory.ts
import { AuraState, Action, MDNASpace, ConceptConnections, KnowledgeFact, Episode, CommandLogEntry } from '../../types';
import { createRandomVector, cosineSimilarity } from '../../utils';
import { MDNA_DIMENSIONS, HEBBIAN_LEARNING_RATE, CONNECTION_DECAY_RATE, PRUNING_THRESHOLD } from '../../constants';

export const memoryReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HOMEOSTASIS/REGULATE': {
            const { reason } = args;
            const newLog: CommandLogEntry = { id: self.crypto.randomUUID(), timestamp: Date.now(), text: `Homeostatic regulation triggered: ${reason}. Pruning memory.`, type: 'info' };

            const factsToKeep = state.knowledgeGraph
                .sort((a, b) => b.strength - a.strength)
                .slice(0, Math.floor(state.knowledgeGraph.length * 0.9)); // Keep 90%

            const episodesToKeep = state.episodicMemoryState.episodes
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, Math.floor(state.episodicMemoryState.episodes.length * 0.9)); // Keep 90%

            return {
                commandLog: [newLog, ...state.commandLog].slice(0, 50),
                workingMemory: [], // Clear working memory
                knowledgeGraph: factsToKeep,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: episodesToKeep,
                }
            };
        }

        case 'MEMORY/SYNAPTIC_PROBE': {
            const concepts = Object.keys(state.mdnaSpace);
            if (concepts.length < 10) return {}; // Not enough concepts to make interesting connections

            const MAX_ATTEMPTS = 10;
            for (let i = 0; i < MAX_ATTEMPTS; i++) {
                const indexA = Math.floor(Math.random() * concepts.length);
                let indexB = Math.floor(Math.random() * concepts.length);
                if (indexA === indexB) continue;

                const conceptA = concepts[indexA];
                const conceptB = concepts[indexB];
                
                const linkKey = [conceptA, conceptB].sort().join('--');
                if (state.conceptConnections[linkKey]) continue; // Link already exists

                const vectorA = state.mdnaSpace[conceptA];
                const vectorB = state.mdnaSpace[conceptB];
                
                if (vectorA && vectorB) {
                    const similarity = cosineSimilarity(vectorA, vectorB);
                    if (similarity < 0.2) { // Only connect distant concepts
                        const newConnection = { weight: 0.01 }; // Very weak initial connection
                        
                        return {
                            conceptConnections: {
                                ...state.conceptConnections,
                                [linkKey]: newConnection,
                            },
                        };
                    }
                }
            }
            return {}; // Failed to find a suitable pair after several attempts
        }
        
        // --- Variant J: Neuro-Dynamic Memory ---
        case 'MEMORY/REINFORCE': {
            const { memoryType, memoryId } = args;
            const REINFORCEMENT_BOOST = 0.1;

            if (memoryType === 'fact') {
                return {
                    knowledgeGraph: state.knowledgeGraph.map(fact => 
                        fact.id === memoryId 
                        ? { ...fact, strength: Math.min(1, fact.strength + REINFORCEMENT_BOOST), lastAccessed: Date.now() } 
                        : fact
                    )
                };
            }
            if (memoryType === 'episode') {
                return {
                    episodicMemoryState: {
                        ...state.episodicMemoryState,
                        episodes: state.episodicMemoryState.episodes.map(ep => 
                            ep.id === memoryId 
                            ? { ...ep, strength: Math.min(1, ep.strength + REINFORCEMENT_BOOST), lastAccessed: Date.now() } 
                            : ep
                        )
                    }
                };
            }
            return {};
        }

        case 'MEMORY/DECAY': {
            const { memoryIdsToDecay } = args;
            const decayFactor = 0.99; // Each decay step reduces strength by 1%

            const decayedKg = state.knowledgeGraph.map(fact => 
                memoryIdsToDecay.kg.includes(fact.id) 
                ? { ...fact, strength: fact.strength * decayFactor } 
                : fact
            );

            const decayedEpisodes = state.episodicMemoryState.episodes.map(ep => 
                memoryIdsToDecay.episodes.includes(ep.id) 
                ? { ...ep, strength: ep.strength * decayFactor } 
                : ep
            );

            return {
                knowledgeGraph: decayedKg,
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: decayedEpisodes,
                }
            };
        }

        // --- Variant L: Hierarchical Chronicler ---
        case 'CHRONICLE/UPDATE': {
            return {
                chronicleState: {
                    ...state.chronicleState,
                    ...args,
                    lastChronicleUpdate: Date.now(),
                }
            };
        }

        // --- Original Memory Reducer Logic ---
        case 'MEMORY/INITIALIZE_MDNA_SPACE': {
            const concepts = new Set<string>();
            state.knowledgeGraph.forEach(fact => {
                concepts.add(fact.subject);
                concepts.add(fact.object);
            });

            const newMdnaSpace: MDNASpace = {};
            concepts.forEach(concept => {
                newMdnaSpace[concept] = createRandomVector(MDNA_DIMENSIONS);
            });

            return { mdnaSpace: newMdnaSpace };
        }

        case 'MEMORY/ADD_CONCEPT_VECTOR': {
            const { name, vector } = args;
            if (state.mdnaSpace[name]) return {}; // Avoid overwriting
            return {
                mdnaSpace: {
                    ...state.mdnaSpace,
                    [name]: vector,
                }
            };
        }

        case 'MEMORY/HEBBIAN_LEARN': {
            const activatedConcepts = args as string[];
            if (activatedConcepts.length < 2) return {};

            const newConnections: ConceptConnections = {};

            // 1. Decay all existing connections
            for (const key in state.conceptConnections) {
                const connection = state.conceptConnections[key];
                const newWeight = connection.weight * CONNECTION_DECAY_RATE;
                if (newWeight > PRUNING_THRESHOLD) {
                    newConnections[key] = { ...connection, weight: newWeight };
                }
            }

            // 2. Strengthen connections between co-activated concepts
            for (let i = 0; i < activatedConcepts.length; i++) {
                for (let j = i + 1; j < activatedConcepts.length; j++) {
                    const conceptA = activatedConcepts[i];
                    const conceptB = activatedConcepts[j];

                    if (!state.mdnaSpace[conceptA] || !state.mdnaSpace[conceptB]) continue;

                    const key = [conceptA, conceptB].sort().join('--');
                    const connection = newConnections[key] || { weight: 0 };
                    
                    // Increase weight with diminishing returns
                    const newWeight = connection.weight + HEBBIAN_LEARNING_RATE * (1 - connection.weight);
                    newConnections[key] = { ...connection, weight: newWeight };
                }
            }
            return { conceptConnections: newConnections };
        }

        case 'ADD_FACT': {
            const newFact: KnowledgeFact = { ...args, id: self.crypto.randomUUID(), strength: 1.0, lastAccessed: Date.now() };
            let newMdnaSpace = { ...state.mdnaSpace };
            if (!newMdnaSpace[newFact.subject]) {
                newMdnaSpace[newFact.subject] = createRandomVector(MDNA_DIMENSIONS);
            }
            if (!newMdnaSpace[newFact.object]) {
                newMdnaSpace[newFact.object] = createRandomVector(MDNA_DIMENSIONS);
            }
            return { 
                knowledgeGraph: [...state.knowledgeGraph, newFact],
                mdnaSpace: newMdnaSpace
            };
        }
        case 'ADD_FACTS_BATCH': {
            let newMdnaSpace = { ...state.mdnaSpace };
            const newFacts = args.map((fact: any) => {
                 if (!newMdnaSpace[fact.subject]) {
                    newMdnaSpace[fact.subject] = createRandomVector(MDNA_DIMENSIONS);
                }
                if (!newMdnaSpace[fact.object]) {
                    newMdnaSpace[fact.object] = createRandomVector(MDNA_DIMENSIONS);
                }
                return {
                    ...fact,
                    id: self.crypto.randomUUID(),
                    source: 'llm_extraction',
                    strength: 1.0, 
                    lastAccessed: Date.now()
                }
            });
            return { 
                knowledgeGraph: [...state.knowledgeGraph, ...newFacts],
                mdnaSpace: newMdnaSpace
            };
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

        case 'ADD_EPISODE': {
            const newEpisode: Episode = { 
                ...args, 
                id: `ep_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                strength: args.salience || 0.5, // Use salience as initial strength
                lastAccessed: Date.now(),
            };
            return {
                episodicMemoryState: {
                    ...state.episodicMemoryState,
                    episodes: [...state.episodicMemoryState.episodes, newEpisode].slice(-50) // Keep last 50 episodes
                }
            };
        }
        
        case 'MEMORY/STRENGTHEN_HYPHA_CONNECTION': {
            const { source, target } = args;
            const existingConnection = state.memoryNexus.hyphaeConnections.find(
                (h: any) => (h.source === source && h.target === target) || (h.source === target && h.target === source)
            );

            if (existingConnection) {
                const newWeight = existingConnection.weight * 0.9 + 0.1; // Reinforce existing path
                return {
                    memoryNexus: {
                        ...state.memoryNexus,
                        hyphaeConnections: state.memoryNexus.hyphaeConnections.map((h: any) =>
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
            const newFact: KnowledgeFact = { ...args, id: self.crypto.randomUUID(), source: 'emergent_synthesis', strength: 1.0, lastAccessed: Date.now() };
            return { knowledgeGraph: [...state.knowledgeGraph, newFact] };
        }
        
        case 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL': {
            const { facts } = args;
            if (!facts || !Array.isArray(facts)) return {};
            
            let newMdnaSpace = { ...state.mdnaSpace };
            const newFacts = facts.map((fact: any) => {
                 if (!newMdnaSpace[fact.subject]) {
                    newMdnaSpace[fact.subject] = createRandomVector(MDNA_DIMENSIONS);
                }
                if (!newMdnaSpace[fact.object]) {
                    newMdnaSpace[fact.object] = createRandomVector(MDNA_DIMENSIONS);
                }
                return {
                    ...fact,
                    id: self.crypto.randomUUID(),
                    source: 'symbiotic_metamorphosis',
                    strength: 1.0,
                    lastAccessed: Date.now()
                }
            });
            
            return { 
                knowledgeGraph: [...state.knowledgeGraph, ...newFacts],
                mdnaSpace: newMdnaSpace
            };
        }

        default:
            return {};
    }
};