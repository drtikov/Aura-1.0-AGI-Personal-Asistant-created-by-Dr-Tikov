import { AuraState, Action } from '../../types';

export const logsReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'ADD_HISTORY_ENTRY':
            if (action.payload.from === 'system' && state.history.some(h => h.text === action.payload.text)) {
                return {};
            }
            return { history: [...state.history, { ...action.payload, id: self.crypto.randomUUID() }] };
        
        case 'ADD_PERFORMANCE_LOG':
            return { performanceLogs: [...state.performanceLogs, action.payload] };

        case 'ADD_COMMAND_LOG':
            const newLog = { ...action.payload, id: self.crypto.randomUUID(), timestamp: Date.now() };
            return { commandLog: [newLog, ...state.commandLog].slice(0, 50) };

        case 'UPDATE_HISTORY_FEEDBACK':
            return {
                history: state.history.map(entry =>
                    entry.id === action.payload.id ? { ...entry, feedback: action.payload.feedback } : entry
                ),
            };
            
        case 'LOG_COGNITIVE_REGULATION':
            return {
                cognitiveRegulationLog: [action.payload, ...state.cognitiveRegulationLog].slice(0, 50)
            };
        
        case 'UPDATE_REGULATION_LOG_OUTCOME':
            return {
                cognitiveRegulationLog: state.cognitiveRegulationLog.map(log =>
                    log.id === action.payload.regulationLogId ? { ...log, outcomeLogId: action.payload.outcomeLogId } : log
                )
            };
        
        case 'ADD_SIMULATION_LOG':
            return {
                ...state,
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    simulationLog: [action.payload, ...state.cognitiveForgeState.simulationLog].slice(0, 50),
                }
            };
            
        case 'LOG_QUALIA':
            return {
                phenomenologicalEngine: {
                    ...state.phenomenologicalEngine,
                    qualiaLog: [action.payload, ...state.phenomenologicalEngine.qualiaLog].slice(0, 50),
                }
            };

        default:
            return {};
    }
};