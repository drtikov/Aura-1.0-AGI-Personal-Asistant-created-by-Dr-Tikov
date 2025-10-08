// state/reducers/kernel.ts
import { AuraState, Action, CognitiveTask } from '../../types';

export const kernelReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'KERNEL/TICK': {
            return {
                kernelState: {
                    ...state.kernelState,
                    tick: state.kernelState.tick + 1,
                }
            };
        }

        case 'KERNEL/ADD_TASK': {
            const newTask = args as CognitiveTask;
            // Prevent adding duplicate tasks if one is already queued or running
            if (state.kernelState.runningTask?.type === newTask.type || state.kernelState.taskQueue.some(t => t.type === newTask.type)) {
                return {};
            }
            return {
                kernelState: {
                    ...state.kernelState,
                    taskQueue: [...state.kernelState.taskQueue, newTask],
                }
            };
        }

        case 'KERNEL/SET_RUNNING_TASK': {
            const task = args as CognitiveTask | null;
            let queue = state.kernelState.taskQueue;
            if (task) {
                // Remove the task from the queue when it starts running
                queue = state.kernelState.taskQueue.filter(t => t.id !== task.id);
            }
            return {
                kernelState: {
                    ...state.kernelState,
                    runningTask: task,
                    taskQueue: queue,
                }
            };
        }
        
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