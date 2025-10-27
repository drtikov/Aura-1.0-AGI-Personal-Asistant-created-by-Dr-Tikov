// state/reducers/autoCodeForge.ts
import { AuraState, Action } from '../../types.ts';

export const autoCodeForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'AUTOCODE/SET_STATE':
            return {
                autoCodeForgeState: {
                    ...state.autoCodeForgeState,
                    ...args,
                }
            };

        default:
            return {};
    }
};