// state/reducers/prometheus.ts
import { AuraState, Action } from '../../types.ts';

export const prometheusReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') return {};
    const { call, args } = action.payload;

    switch(call) {
        case 'PROMETHEUS/START_AUTONOMOUS_CYCLE':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    status: 'running',
                    log: [{ timestamp: Date.now(), message: 'Prometheus cycle initiated. Seeking analogies...' }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        case 'PROMETHEUS/START_GUIDED_INQUIRY':
             return {
                prometheusState: {
                    ...state.prometheusState,
                    status: 'running',
                    log: [{ timestamp: Date.now(), message: `Guided inquiry started: ${args.sourceDomain} ↔ ${args.targetDomain}` }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        case 'PROMETHEUS/SET_SESSION_ID':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    lastSessionId: args.sessionId,
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
                    lastSessionId: null,
                    log: [{ timestamp: Date.now(), message: 'Prometheus cycle complete.' }, ...state.prometheusState.log].slice(0, 20)
                }
            };
        case 'PROMETHEUS/SET_STATE':
            return {
                prometheusState: {
                    ...state.prometheusState,
                    ...args
                }
            };
        default:
            return {};
    }
}