// state/reducers/ricciFlow.ts
import { AuraState, Action, RicciFlowSurgeryLog } from '../../types.ts';

export const ricciFlowReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'RICCI_FLOW/LOG_SURGERY': {
            const newLog: RicciFlowSurgeryLog = {
                id: `surgery_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                description: args.description,
                entropyBefore: state.ricciFlowManifoldState.perelmanEntropy,
                entropyAfter: state.ricciFlowManifoldState.perelmanEntropy - 0.005, // Simulate a small decrease
            };
            return {
                ricciFlowManifoldState: {
                    ...state.ricciFlowManifoldState,
                    surgeryLog: [newLog, ...state.ricciFlowManifoldState.surgeryLog].slice(0, 10),
                    perelmanEntropy: newLog.entropyAfter, // Update entropy
                }
            };
        }
        default:
            return {};
    }
};