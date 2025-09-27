import { AuraState, Action, EventBusMessage } from '../../types';

export const logsReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ADD_HISTORY_ENTRY': {
            if (args.from === 'system' && state.history.some(h => h.text === args.text)) {
                return {};
            }
             const newEvent: EventBusMessage = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                type: 'SYSCALL:ADD_HISTORY_ENTRY',
                payload: args, // The history entry being added
            };
            return { 
                history: [...state.history, { ...args, id: args.id || self.crypto.randomUUID() }],
                eventBus: [newEvent, ...state.eventBus].slice(0, 50)
            };
        }
        
        case 'APPEND_TO_HISTORY_ENTRY':
            return {
                history: state.history.map(entry =>
                    entry.id === args.id ? { ...entry, text: entry.text + args.textChunk } : entry
                ),
            };

        case 'FINALIZE_HISTORY_ENTRY':
            return {
                history: state.history.map(entry =>
                    entry.id === args.id ? { ...entry, ...args.finalState, streaming: false } : entry
                ),
            };
            
        case 'ADD_PERFORMANCE_LOG':
            return { performanceLogs: [args, ...state.performanceLogs].slice(0, 100) };

        case 'ADD_COMMAND_LOG':
            const newLog = { ...args, id: self.crypto.randomUUID(), timestamp: Date.now() };
            return { commandLog: [newLog, ...state.commandLog].slice(0, 50) };

        case 'UPDATE_HISTORY_FEEDBACK':
            return {
                history: state.history.map(entry =>
                    entry.id === args.id ? { ...entry, feedback: args.feedback } : entry
                ),
            };
            
        case 'LOG_COGNITIVE_REGULATION':
            return {
                cognitiveRegulationLog: [args, ...state.cognitiveRegulationLog].slice(0, 50)
            };
        
        case 'UPDATE_REGULATION_LOG_OUTCOME':
            return {
                cognitiveRegulationLog: state.cognitiveRegulationLog.map(log =>
                    log.id === args.regulationLogId ? { ...log, outcomeLogId: args.outcomeLogId } : log
                )
            };
        
        case 'ADD_SIMULATION_LOG':
            return {
                ...state,
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    simulationLog: [args, ...state.cognitiveForgeState.simulationLog].slice(0, 50),
                }
            };
            
        case 'LOG_QUALIA':
            return {
                phenomenologicalEngine: {
                    ...state.phenomenologicalEngine,
                    qualiaLog: [args, ...state.phenomenologicalEngine.qualiaLog].slice(0, 50),
                }
            };

        case 'MARK_LOG_CAUSAL_ANALYSIS':
            return {
                performanceLogs: state.performanceLogs.map(log =>
                    log.id === args ? { ...log, causalAnalysisTimestamp: Date.now() } : log
                )
            };
        
        case 'ADD_EVENT_BUS_MESSAGE':
            return {
                eventBus: [args, ...state.eventBus].slice(0, 50)
            };

        case 'LOG_SUBSUMPTION_EVENT':
            return {
                subsumptionLog: [args, ...state.subsumptionLog].slice(0, 50)
            };

        default:
            return {};
    }
};