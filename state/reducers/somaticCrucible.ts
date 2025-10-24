// state/reducers/somaticCrucible.ts
import { AuraState, Action, PossibleFutureSelf, SomaticSimulationLog } from '../../types.ts';

export const somaticCrucibleReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SOMATIC/CREATE_PFS': {
            const newPFS: PossibleFutureSelf = {
                ...args,
                id: `pfs_${self.crypto.randomUUID()}`,
                status: 'designing',
            };
            return {
                somaticCrucible: {
                    ...state.somaticCrucible,
                    possibleFutureSelves: [newPFS, ...state.somaticCrucible.possibleFutureSelves].slice(0, 10),
                }
            };
        }

        case 'SOMATIC/UPDATE_PFS_STATUS': {
            const { id, status, failureReason } = args;
            return {
                somaticCrucible: {
                    ...state.somaticCrucible,
                    possibleFutureSelves: state.somaticCrucible.possibleFutureSelves.map(pfs =>
                        pfs.id === id ? { ...pfs, status, failureReason: failureReason || null } : pfs
                    ),
                }
            };
        }

        case 'SOMATIC/LOG_SIMULATION': {
            const newLog: SomaticSimulationLog = {
                ...args,
                id: `simlog_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
            };
            return {
                somaticCrucible: {
                    ...state.somaticCrucible,
                    simulationLogs: [newLog, ...state.somaticCrucible.simulationLogs].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};