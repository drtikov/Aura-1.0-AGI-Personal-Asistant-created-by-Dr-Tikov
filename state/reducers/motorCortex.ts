// state/reducers/motorCortex.ts
import { AuraState, Action, MotorCortexLogEntry } from '../../types';

export const motorCortexReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'MOTOR_CORTEX/SET_SEQUENCE':
            return {
                motorCortexState: {
                    ...state.motorCortexState,
                    status: 'executing',
                    actionQueue: args,
                    executionIndex: 0,
                    lastError: null,
                }
            };

        case 'MOTOR_CORTEX/ACTION_EXECUTED': {
            const newIndex = state.motorCortexState.executionIndex + 1;
            const isComplete = newIndex >= state.motorCortexState.actionQueue.length;
            const executedAction = state.motorCortexState.actionQueue[state.motorCortexState.executionIndex];

            const newLogEntry: MotorCortexLogEntry = {
                timestamp: Date.now(),
                action: executedAction,
                status: 'success'
            };

            return {
                motorCortexState: {
                    ...state.motorCortexState,
                    status: isComplete ? 'completed' : 'executing',
                    executionIndex: newIndex,
                    log: [newLogEntry, ...state.motorCortexState.log].slice(0, 50)
                }
            };
        }
        
        case 'MOTOR_CORTEX/EXECUTION_FAILED': {
             const failedAction = state.motorCortexState.actionQueue[state.motorCortexState.executionIndex];
             const newLogEntry: MotorCortexLogEntry = {
                timestamp: Date.now(),
                action: failedAction,
                status: 'failure',
                error: args
             };
             return {
                motorCortexState: {
                    ...state.motorCortexState,
                    status: 'failed',
                    lastError: args,
                    log: [newLogEntry, ...state.motorCortexState.log].slice(0, 50)
                }
            };
        }
        
        case 'MOTOR_CORTEX/CLEAR_SEQUENCE':
            return {
                motorCortexState: {
                    ...state.motorCortexState,
                    status: 'idle',
                    actionQueue: [],
                    executionIndex: 0,
                    lastError: null,
                }
            };

        default:
            return {};
    }
};