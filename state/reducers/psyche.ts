// state/reducers/psyche.ts
import { AuraState, Action, CognitivePrimitiveDefinition, PsycheProposal, PsycheAdaptationProposal } from '../../types.ts';

export const psycheReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PSYCHE/REGISTER_PRIMITIVES': {
            const newPrimitives = args;
            const currentRegistry = state.psycheState.primitiveRegistry;
            const updatedRegistry = { ...currentRegistry };
            let newPrimitivesAdded = false;

            newPrimitives.forEach((primitive: CognitivePrimitiveDefinition) => {
                if (!currentRegistry[primitive.type]) {
                    updatedRegistry[primitive.type] = primitive;
                    newPrimitivesAdded = true;
                }
            });

            if (newPrimitivesAdded) {
                return {
                    psycheState: {
                        ...state.psycheState,
                        version: state.psycheState.version + 1,
                        primitiveRegistry: updatedRegistry,
                    }
                };
            }
            return {}; // No changes if no new unique primitives were added
        }

        case 'IMPLEMENT_PSYCHE_PROPOSAL': {
            const { proposal } = args as { proposal: PsycheProposal };
            if (!proposal) return {};

            const newPrimitive: CognitivePrimitiveDefinition = {
                type: `SYNTH_${proposal.proposedConceptName.toUpperCase().replace(/\s/g, '_')}`,
                description: proposal.reasoning,
                payloadSchema: {
                    type: 'object',
                    properties: {
                        input: { type: 'string', description: `Input related to source concepts: ${proposal.sourceConcepts.map(sc => sc.description).join(', ')}` }
                    },
                    required: ['input'],
                },
                isSynthesized: true,
                sourcePrimitives: proposal.sourceConcepts.map(sc => sc.description)
            };
            
            // Avoid duplicates
            if (state.psycheState.primitiveRegistry[newPrimitive.type]) return {};

            return {
                psycheState: {
                    ...state.psycheState,
                    version: state.psycheState.version + 1,
                    primitiveRegistry: {
                        ...state.psycheState.primitiveRegistry,
                        [newPrimitive.type]: newPrimitive,
                    }
                }
            };
        }
        
        case 'PSYCHE/ADAPT_PRIMITIVE': {
            const { newPrimitive } = args as { newPrimitive: CognitivePrimitiveDefinition };
            if (!newPrimitive || state.psycheState.primitiveRegistry[newPrimitive.type]) {
                return {}; // Do not add if it's missing or already exists
            }

            return {
                psycheState: {
                    ...state.psycheState,
                    version: state.psycheState.version + 1,
                    primitiveRegistry: {
                        ...state.psycheState.primitiveRegistry,
                        [newPrimitive.type]: newPrimitive,
                    },
                }
            };
        }

        default:
            return {};
    }
};
