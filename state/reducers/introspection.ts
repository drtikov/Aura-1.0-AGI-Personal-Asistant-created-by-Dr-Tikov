// state/reducers/introspection.ts
import { AuraState, Action, IntrospectionLogEntry } from '../../types.ts';

export const introspectionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'INTROSPECTION/LOG_EVENT': {
            const newLogEntry: IntrospectionLogEntry = {
                id: `intro_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                ...args,
            };

            // If it's a probe result, also store it as the last probe result
            const isProbe = newLogEntry.type === 'probe';

            return {
                introspectionState: {
                    ...state.introspectionState,
                    log: [newLogEntry, ...state.introspectionState.log].slice(0, 50),
                    lastProbeResult: isProbe ? newLogEntry : state.introspectionState.lastProbeResult,
                }
            };
        }

        default:
            return {};
    }
};