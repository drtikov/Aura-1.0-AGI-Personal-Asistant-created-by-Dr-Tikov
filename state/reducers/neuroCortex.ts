// state/reducers/neuroCortex.ts
import { AuraState, Action, CorticalColumn, AbstractConcept, AbstractConceptProposal } from '../../types';

export const neuroCortexReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'UPDATE_NEURO_CORTEX_STATE':
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    ...args,
                }
            };

        case 'NEURO_CORTEX/LOG_ACTIVATION':
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    activationLog: [...state.neuroCortexState.activationLog, args].slice(-100) // Keep last 100 activations
                }
            };

        case 'NEURO_CORTEX/ADD_PROTO_SYMBOL':
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    protoSymbols: [...state.neuroCortexState.protoSymbols, args]
                }
            };

        case 'CREATE_CORTICAL_COLUMN': {
            const newColumn: CorticalColumn = {
                id: args.id,
                specialty: args.specialty,
                activation: 0.05, // Initial low activation
                connections: [],
                genome: {
                    domain: 'linguistic', // default
                    abstractionLevel: 0.5,
                    creativityBias: 0.5,
                    constraintAdherence: 0.7,
                }
            };
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    columns: [...state.neuroCortexState.columns, newColumn]
                }
            };
        }

        case 'SET_COLUMN_ACTIVATION':
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    columns: state.neuroCortexState.columns.map(c =>
                        c.id === args.id ? { ...c, activation: args.activation } : c
                    )
                }
            };

        case 'SYNTHESIZE_ABSTRACT_CONCEPT': {
            const newConcept = {
                id: `ac_${args.name.toLowerCase().replace(/\s+/g, '_')}`,
                name: args.name,
                constituentColumnIds: args.columnIds,
                activation: 0, // Will be calculated by coprocessor
                description: `A synthesized concept representing ${args.name}.`,
            };
            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    abstractConcepts: [...state.neuroCortexState.abstractConcepts, newConcept]
                }
            };
        }
        
        case 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL': {
            const { proposal } = args as { proposal: AbstractConceptProposal };
            if (!proposal) return {};

            // Check if concept already exists
            if (state.neuroCortexState.abstractConcepts.some(c => c.name === proposal.newConceptName)) {
                return {};
            }

            const newConcept: AbstractConcept = {
                id: `ac_${proposal.newConceptName.toLowerCase().replace(/\s/g, '_')}`,
                name: proposal.newConceptName,
                constituentColumnIds: proposal.sourceColumnIds,
                activation: 0,
                description: proposal.reasoning,
            };

            return {
                neuroCortexState: {
                    ...state.neuroCortexState,
                    abstractConcepts: [...state.neuroCortexState.abstractConcepts, newConcept]
                }
            };
        }
        
        default:
            return {};
    }
};