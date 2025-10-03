// state/reducers/socialCognition.ts
import { AuraState, Action } from '../../types';

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