// state/reducers/socialCognition.ts
import { AuraState, Action } from '../../types.ts';

export const socialCognitionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SOCIAL/ADD_NODE': {
            const newNode = args;
            if (state.socialCognitionState.socialGraph[newNode.id]) return {};
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    socialGraph: {
                        ...state.socialCognitionState.socialGraph,
                        [newNode.id]: newNode,
                    }
                }
            };
        }

        case 'SOCIAL/UPDATE_NODE': {
            const { id, updates } = args;
            const nodeToUpdate = state.socialCognitionState.socialGraph[id];
            if (!nodeToUpdate) return {};

            // Special handling for dossier to append rather than overwrite
            const newDossier = updates.dossier 
                ? [...new Set([...nodeToUpdate.dossier, ...updates.dossier])] // Append and deduplicate
                : nodeToUpdate.dossier;

            const updatedNode = {
                ...nodeToUpdate,
                ...updates,
                dossier: newDossier,
            };

            return {
                 socialCognitionState: {
                    ...state.socialCognitionState,
                    socialGraph: {
                        ...state.socialCognitionState.socialGraph,
                        [id]: updatedNode,
                    }
                }
            }
        }

        case 'SOCIAL/ADD_RELATIONSHIP': {
            const { sourceId, relationship } = args;
            const sourceNode = state.socialCognitionState.socialGraph[sourceId];
            if (!sourceNode) return {};
            const updatedNode = {
                ...sourceNode,
                relationships: [...sourceNode.relationships, relationship],
            };
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    socialGraph: {
                        ...state.socialCognitionState.socialGraph,
                        [sourceId]: updatedNode,
                    }
                }
            };
        }
        
        case 'SOCIAL/UPDATE_CULTURAL_MODEL': {
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    culturalModel: {
                        ...state.socialCognitionState.culturalModel,
                        ...args,
                    }
                }
            };
        }

        default:
            return {};
    }
};