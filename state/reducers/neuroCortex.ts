// state/reducers/neuroCortex.ts
import { AuraState, Action } from '../../types';

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

        case 'CREATE_CORTICAL_COLUMN': {
            const newColumn = {
                id: args.id,
                specialty: args.specialty,
                activation: 0.05, // Initial low activation
                connections: [],
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
        
        default:
            return {};
    }
};