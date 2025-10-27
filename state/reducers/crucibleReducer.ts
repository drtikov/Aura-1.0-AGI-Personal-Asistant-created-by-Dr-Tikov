// state/reducers/crucibleReducer.ts
import { AuraState, Action } from '../../types.ts';

export const crucibleReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'CRUCIBLE/START_SIMULATION': {
            const { proposalId } = args;
            const logEntry = { timestamp: Date.now(), message: `Crucible simulation initiated for proposal: ${proposalId}` };
            return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    status: 'running',
                    simulationLog: [logEntry],
                }
            };
        }

        case 'CRUCIBLE/LOG_STEP': {
            const newLogEntry = { timestamp: Date.now(), message: args.message };
            return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    simulationLog: [...state.architecturalCrucibleState.simulationLog, newLogEntry].slice(-20),
                }
            };
        }

        case 'CRUCIBLE/COMPLETE_SIMULATION': {
            const { results } = args;
            const logEntry = { timestamp: Date.now(), message: `Simulation complete. Performance Gain: ${results.performanceGain.toFixed(2)}, Stability Change: ${results.stabilityChange.toFixed(2)}` };
            return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    status: 'idle',
                    simulationLog: [...state.architecturalCrucibleState.simulationLog, logEntry].slice(-20),
                }
            };
        }
        
        default:
            return {};
    }
};