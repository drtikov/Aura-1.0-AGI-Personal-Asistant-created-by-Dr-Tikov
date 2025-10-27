// state/reducers/hova.ts
import { AuraState, Action, HOVAEvolutionLogEntry } from '../../types';

export const hovaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HOVA/SET_TARGET':
            return {
                hovaState: {
                    ...state.hovaState,
                    optimizationTarget: args.target,
                }
            };
        
        case 'HOVA/START_CYCLE':
            // This would typically set a status to 'optimizing'
            // For now, it's just a trigger for the autonomous system hook
            return {};

        case 'HOVA/LOG_EVOLUTION': {
            const newLog = args as Omit<HOVAEvolutionLogEntry, 'id' | 'timestamp'>;
            const logEntry: HOVAEvolutionLogEntry = {
                ...newLog,
                id: `hova_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
            };
            
            let updatedMetrics = { ...state.hovaState.metrics };
            if (logEntry.status === 'success') {
                const latencyReduction = logEntry.performanceDelta.before - logEntry.performanceDelta.after;
                const newTotalOptimizations = updatedMetrics.totalOptimizations + 1;
                const newTotalReduction = (updatedMetrics.avgLatencyReduction * updatedMetrics.totalOptimizations) + latencyReduction;
                
                updatedMetrics = {
                    totalOptimizations: newTotalOptimizations,
                    avgLatencyReduction: newTotalReduction / newTotalOptimizations,
                };
            }

            return {
                hovaState: {
                    ...state.hovaState,
                    optimizationLog: [logEntry, ...state.hovaState.optimizationLog].slice(0, 50),
                    metrics: updatedMetrics,
                }
            };
        }

        default:
            return {};
    }
};