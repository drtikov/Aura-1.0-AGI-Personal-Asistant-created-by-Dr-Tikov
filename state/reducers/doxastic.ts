// state/reducers/doxastic.ts
import { AuraState, Action } from '../../types';

export const doxasticReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'DOXASTIC/ADD_UNVERIFIED_HYPOTHESIS':
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    unverifiedHypotheses: [args, ...state.doxasticEngineState.unverifiedHypotheses],
                }
            };
            
        case 'DOXASTIC/ADD_HYPOTHESIS':
            // New hypotheses now start as 'untested'
            const newHypothesis = { ...args, status: 'untested' };
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    hypotheses: [newHypothesis, ...state.doxasticEngineState.hypotheses],
                }
            };
        
        case 'DOXASTIC/DESIGN_EXPERIMENT': {
            const { hypothesisId, experiment } = args;
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    hypotheses: state.doxasticEngineState.hypotheses.map(h => 
                        h.id === hypothesisId ? { ...h, status: 'designed' } : h
                    ),
                    experiments: [...state.doxasticEngineState.experiments, { id: `exp_${self.crypto.randomUUID()}`, hypothesisId, status: 'pending', ...experiment }],
                }
            };
        }

        case 'DOXASTIC/UPDATE_HYPOTHESIS_STATUS': {
            const { hypothesisId, status } = args;
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    hypotheses: state.doxasticEngineState.hypotheses.map(h => 
                        h.id === hypothesisId ? { ...h, status } : h
                    ),
                }
            };
        }
        
        case 'DOXASTIC/UPDATE_EXPERIMENT_STATUS': {
            const { experimentId, status, result } = args;
            return {
                doxasticEngineState: {
                    ...state.doxasticEngineState,
                    experiments: state.doxasticEngineState.experiments.map(e => 
                        e.id === experimentId ? { ...e, status, ...(result && { result }) } : e
                    ),
                }
            };
        }


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
                    simulationStatus: 'complete',
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
