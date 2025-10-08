// state/reducers/liveSession.ts
import { AuraState, Action } from '../../types';

export const liveSessionReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'LIVE/CONNECT':
        case 'LIVE/SET_STATUS':
            return {
                liveSessionState: {
                    ...state.liveSessionState,
                    status: args.status,
                }
            };
        case 'LIVE/DISCONNECT':
             return {
                liveSessionState: {
                    ...state.liveSessionState,
                    status: 'idle',
                    inputTranscript: '',
                    outputTranscript: '',
                }
            };
            
        case 'LIVE/UPDATE_INPUT_TRANSCRIPT':
            return {
                liveSessionState: {
                    ...state.liveSessionState,
                    inputTranscript: state.liveSessionState.inputTranscript + args.text,
                }
            };

        case 'LIVE/UPDATE_OUTPUT_TRANSCRIPT':
            return {
                liveSessionState: {
                    ...state.liveSessionState,
                    outputTranscript: state.liveSessionState.outputTranscript + args.text,
                }
            };
            
        case 'LIVE/TURN_COMPLETE': {
            const { inputTranscript, outputTranscript, transcriptHistory } = state.liveSessionState;
            // Don't add empty turns to history
            if (!inputTranscript.trim() && !outputTranscript.trim()) {
                return {
                    liveSessionState: {
                        ...state.liveSessionState,
                        inputTranscript: '',
                        outputTranscript: '',
                    }
                };
            }
            const newHistoryEntry = {
                user: inputTranscript,
                aura: outputTranscript,
                timestamp: Date.now()
            };
            return {
                liveSessionState: {
                    ...state.liveSessionState,
                    inputTranscript: '',
                    outputTranscript: '',
                    transcriptHistory: [newHistoryEntry, ...transcriptHistory].slice(0, 50),
                }
            };
        }

        default:
            return {};
    }
};