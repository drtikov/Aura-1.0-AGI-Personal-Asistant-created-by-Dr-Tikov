// state/reducers/metisSandbox.ts
import { AuraState, Action } from '../../types';

export const metisSandboxReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'METIS/SET_STATE': {
            return {
                metisSandboxState: {
                    ...state.metisSandboxState,
                    ...args
                }
            }
        }

        default:
            return {};
    }
};