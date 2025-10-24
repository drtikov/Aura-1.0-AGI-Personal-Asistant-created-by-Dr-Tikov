// state/reducers/canvas.ts
import { AuraState, Action } from '../../types';

export const canvasReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'CANVAS/SET_CONTENT':
            return {
                symbioticCanvasState: {
                    ...state.symbioticCanvasState,
                    content: args.content,
                }
            };
        case 'CANVAS/APPEND_CONTENT':
            return {
                symbioticCanvasState: {
                    ...state.symbioticCanvasState,
                    content: state.symbioticCanvasState.content + args.content,
                }
            };
        default:
            return {};
    }
};
