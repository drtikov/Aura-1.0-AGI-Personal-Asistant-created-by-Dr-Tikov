import { AuraState, Action } from '../../types';

export const systemReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'UPDATE_META_CAUSAL_MODEL': {
            const newModel = { ...state.metacognitiveCausalModel };
            action.payload.forEach(link => {
                newModel[link.id] = link;
            });
            return { metacognitiveCausalModel: newModel };
        }
        
        case 'UPDATE_EVOLUTIONARY_GOAL_STATUS':
             return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    evolutionaryGoals: state.metacognitiveNexus.evolutionaryGoals.map(g => 
                        g.id === action.payload.id ? { ...g, status: action.payload.status } : g
                    )
                }
            };
        
        case 'ADD_SELF_TUNING_DIRECTIVE':
            return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    selfTuningDirectives: [action.payload, ...state.metacognitiveNexus.selfTuningDirectives]
                }
            };
        
        case 'UPDATE_SELF_TUNING_DIRECTIVE':
            return {
                metacognitiveNexus: {
                    ...state.metacognitiveNexus,
                    selfTuningDirectives: state.metacognitiveNexus.selfTuningDirectives.map(d => 
                        d.id === action.payload.id ? { ...d, ...action.payload.updates } : d
                    )
                }
            };

        case 'UPDATE_SITUATIONAL_AWARENESS':
            return {
                situationalAwareness: {
                    ...state.situationalAwareness,
                    ...action.payload,
                }
            };

        case 'UPDATE_SYMBIOTIC_STATE':
            return {
                symbioticState: {
                    ...state.symbioticState,
                    ...action.payload,
                }
            };
        
        case 'UPDATE_ATTENTIONAL_FIELD':
            return {
                situationalAwareness: {
                    ...state.situationalAwareness,
                    attentionalField: {
                        ...state.situationalAwareness.attentionalField,
                        ...action.payload
                    }
                }
            };
        
        case 'ADD_WORKFLOW_PROPOSAL':
            const newWorkflow = {
                ...action.payload,
                id: self.crypto.randomUUID(),
            };
            return {
                symbioticState: {
                    ...state.symbioticState,
                    coCreatedWorkflows: [...state.symbioticState.coCreatedWorkflows, newWorkflow]
                }
            };

        default:
            return {};
    }
};