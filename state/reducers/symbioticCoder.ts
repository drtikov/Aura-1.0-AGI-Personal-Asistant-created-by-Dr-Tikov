// state/reducers/symbioticCoder.ts
import { AuraState, Action } from '../../types.ts';

export const symbioticCoderReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SYMCODER/SET_ACTIVE_FILE':
            return {
                symbioticCoderState: {
                    ...state.symbioticCoderState,
                    activeFile: args.filePath,
                }
            };

        case 'SYMCODER/SET_ANALYSIS_RESULT':
            return {
                symbioticCoderState: {
                    ...state.symbioticCoderState,
                    codeAnalysis: args.analysis,
                }
            };

        case 'SYMCODER/SET_TEST_RESULT':
            return {
                symbioticCoderState: {
                    ...state.symbioticCoderState,
                    lastTestResult: args.result,
                }
            };

        default:
            return {};
    }
};