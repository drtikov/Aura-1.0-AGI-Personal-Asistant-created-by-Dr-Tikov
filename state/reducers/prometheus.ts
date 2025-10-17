// state/reducers/prometheus.ts
import { AuraState, Action } from '../../types';

export const prometheusReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') return {};
    const { call, args } = action.payload;

    switch(call) {
        case 'PROMETHEUS/START_CYCLE':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    status: 'running',
                    log: [{ timestamp: Date.now(), message: 'Prometheus cycle initiated. Seeking analogies...' }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        case 'PROMETHEUS/LOG':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    log: [{ timestamp: Date.now(), message: args.message }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        case 'PROMETHEUS/CYCLE_COMPLETE':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    status: 'idle',
                    log: [{ timestamp: Date.now(), message: 'Prometheus cycle complete.' }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        default:
            return {};
    }
}
