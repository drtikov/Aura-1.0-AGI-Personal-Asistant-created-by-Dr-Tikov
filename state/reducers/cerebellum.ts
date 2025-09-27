// state/reducers/cerebellum.ts
import { AuraState, Action } from '../../types';

export const cerebellumReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'START_CEREBELLUM_MONITORING':
            return {
                cerebellumState: {
                    ...state.cerebellumState,
                    isMonitoring: true,
                    activePlanId: args.planId,
                    currentStepIndex: 0,
                    driftLog: [], // Clear log for new plan
                }
            };

        case 'UPDATE_CEREBELLUM_STEP':
            return {
                cerebellumState: {
                    ...state.cerebellumState,
                    currentStepIndex: args.stepIndex,
                }
            };
        
        case 'LOG_CEREBELLUM_DRIFT': {
            const newLog = {
                timestamp: Date.now(),
                planId: state.cerebellumState.activePlanId!,
                stepIndex: state.cerebellumState.currentStepIndex,
                ...args,
            };
            return {
                cerebellumState: {
                    ...state.cerebellumState,
                    driftLog: [...state.cerebellumState.driftLog, newLog],
                }
            };
        }

        case 'STOP_CEREBELLUM_MONITORING':
            return {
                cerebellumState: {
                    ...state.cerebellumState,
                    isMonitoring: false,
                    activePlanId: null,
                    currentStepIndex: 0,
                }
            };

        default:
            return {};
    }
};