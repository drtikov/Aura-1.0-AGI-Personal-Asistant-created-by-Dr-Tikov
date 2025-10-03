// state/reducers/kernel.ts
import { AuraState, Action } from '../../types';

export const kernelReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'KERNEL/TICK':
            return {
                kernelState: {
                    ...state.kernelState,
                    tick: state.kernelState.tick + 1,
                }
            };

        case 'KERNEL/SET_TASK_QUEUE':
            return {
                kernelState: {
                    ...state.kernelState,
                    taskQueue: args,
                }
            };

        case 'KERNEL/SET_RUNNING_TASK':
            return {
                kernelState: {
                    ...state.kernelState,
                    runningTask: args,
                }
            };
        
        case 'KERNEL/LOG_SYSCALL':
            return {
                kernelState: {
                    ...state.kernelState,
                    syscallLog: [args, ...state.kernelState.syscallLog].slice(0, 100),
                }
            };

        default:
            return {};
    }
};