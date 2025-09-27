// state/reducers/psyche.ts
import { AuraState, Action, CognitivePrimitiveDefinition } from '../../types';

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

        default:
            return {};
    }
};