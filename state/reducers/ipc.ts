// state/reducers/ipc.ts
import { AuraState, Action } from '../../types.ts';

export const ipcReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'IPC/PIPE_WRITE': {
            const { pipeName, message } = args;
            const currentPipe = state.ipcState.pipes[pipeName] || [];
            return {
                ipcState: {
                    ...state.ipcState,
                    pipes: {
                        ...state.ipcState.pipes,
                        [pipeName]: [...currentPipe, message],
                    }
                }
            };
        }

        case 'IPC/PIPE_READ': {
            const { pipeName } = args;
            const currentPipe = state.ipcState.pipes[pipeName] || [];
            if (currentPipe.length === 0) {
                return {}; // Nothing to read
            }
            const [, ...restOfPipe] = currentPipe; // Read and remove the first message
            return {
                ipcState: {
                    ...state.ipcState,
                    pipes: {
                        ...state.ipcState.pipes,
                        [pipeName]: restOfPipe,
                    }
                }
            };
        }

        default:
            return {};
    }
};