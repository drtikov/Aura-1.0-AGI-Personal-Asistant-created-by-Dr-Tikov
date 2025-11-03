// state/reducers/logs.ts
import { AuraState, Action, EventBusMessage } from '../../types';

export const logsReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HISTORY/CLEAR_PREVIOUS_BRAINSTORMS':
            return {
                history: state.history.filter(entry => !entry.text?.startsWith('## Brainstorming Session:')),
            };
        case 'ADD_HISTORY_ENTRY': {
            // The de-duplication logic for system messages has been removed for clarity.
            const newEntry = {
                ...args,
                id: args.id || self.crypto.randomUUID(),
                timestamp: Date.now(),
            };
            return { 
                history: [...state.history, newEntry],
            };
        }
        
        case 'UPDATE_HISTORY_ENTRY':
             return {
                history: state.history.map(entry =>
                    entry.id === args.id ? { ...entry, ...args.finalState } : entry
                ),
            };
            
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
                    entry.id === args.id ? { ...entry, feedback: args.feedback, isFeedbackProcessed: false } : entry
                ),
            };
            
        case 'LOG/MARK_MYCELIAL_TRAINED':
            return {
                performanceLogs: state.performanceLogs.map(log =>
                    log.id === args.logId ? { ...log, mycelialTrained: true } : log
                )
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
                subsumptionLogState: {
                    ...state.subsumptionLogState,
                    log: [args, ...state.subsumptionLogState.log].slice(0, 50),
                }
            };
        
        case 'LOG/MARK_METAPHOR_PROCESSED':
             return {
                performanceLogs: state.performanceLogs.map(log =>
                    log.id === args.logId ? { ...log, metaphorProcessed: true, sourceDomain: args.domain } : log
                )
            };

        case 'LOG/MARK_REINFORCEMENT_PROCESSED':
            return {
                performanceLogs: state.performanceLogs.map(log =>
                    log.id === args ? { ...log, reinforcementProcessed: true } : log
                )
            };
        
        case 'LOG/MARK_BRIDGE_PROCESSED':
            return {
                performanceLogs: state.performanceLogs.map(log =>
                    log.id === args ? { ...log, bridgeProcessed: true } : log
                )
            };
            
        case 'LOG/ADD_POL_EXECUTION':
            return {
                polExecutionLog: [args, ...state.polExecutionLog].slice(0, 200)
            };

        default:
            return {};
    }
};
