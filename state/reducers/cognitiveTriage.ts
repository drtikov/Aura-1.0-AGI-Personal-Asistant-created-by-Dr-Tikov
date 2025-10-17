// state/reducers/cognitiveTriage.ts
import { AuraState, Action } from '../../types';

export const cognitiveTriageReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'LOG_COGNITIVE_TRIAGE_DECISION': {
            return {
                cognitiveTriageState: {
                    ...state.cognitiveTriageState,
                    log: [args, ...state.cognitiveTriageState.log].slice(0, 20)
                }
            };
        }
        default:
            return {};
    }
};