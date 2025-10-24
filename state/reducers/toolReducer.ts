// state/reducers/toolReducer.ts
import { AuraState, Action } from '../../types.ts';

export const toolReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') return {};
    const { call, args } = action.payload;

    switch (call) {
        case 'EXECUTE_TOOL':
            return {
                toolExecutionRequest: {
                    id: self.crypto.randomUUID(),
                    ...args
                }
            };
        case 'CLEAR_TOOL_EXECUTION_REQUEST':
            return { toolExecutionRequest: null };
        default:
            return {};
    }
};