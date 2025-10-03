// state/reducers/doxastic.ts
import { AuraState, Action } from '../../types';

export const doxasticReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'DOXASTIC/START_SIMULATION': {
            const logEntry = { timestamp: Date.now(), message: `Simulation started for proposal: ${args.proposalId}` };
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    simulationStatus: 'running',
                    simulationLog: [logEntry],
                    lastSimulationResult: null,
                }
            };
        }

        case 'DOXASTIC/LOG_SIMULATION_STEP': {
            const newLogEntry = { timestamp: Date.now(), message: args.message };
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    simulationLog: [...state.doxasticEngineState.simulationLog, newLogEntry].slice(-20),
                }
            };
        }

        case 'DOXASTIC/COMPLETE_SIMULATION': {
            const result = args.result;
            const logEntry = { timestamp: Date.now(), message: `Simulation completed successfully. Summary: ${result.summary}` };
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    simulationStatus: 'completed',
                    lastSimulationResult: result,
                    simulationLog: [...state.doxasticEngineState.simulationLog, logEntry].slice(-20),
                }
            };
        }

        case 'DOXASTIC/FAIL_SIMULATION': {
            const logEntry = { timestamp: Date.now(), message: `Simulation failed: ${args.reason}` };
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    simulationStatus: 'failed',
                    simulationLog: [...state.doxasticEngineState.simulationLog, logEntry].slice(-20),
                }
            };
        }

        case 'TEST_CAUSAL_HYPOTHESIS':
            // This would trigger a complex process. For now, we just log it.
            console.log('Testing causal hypothesis:', args);
            return {};

        default:
            return {};
    }
};