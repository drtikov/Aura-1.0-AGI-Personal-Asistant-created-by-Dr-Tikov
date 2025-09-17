import { AuraState, Action, CommandLogEntry, InternalState } from '../../types';
import { clamp } from '../../utils';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'SET_THEME':
            return { theme: action.payload };

        case 'UPDATE_CORE_IDENTITY':
            return { coreIdentity: action.payload };
        
        case 'PROCESS_USER_FEEDBACK':
            // This is a placeholder for a more complex update logic
            // For now, it slightly adjusts harmony and happiness
            const adjustment = action.payload === 'positive' ? 0.05 : -0.05;
            return {
                internalState: {
                    ...state.internalState,
                    harmonyScore: clamp(state.internalState.harmonyScore + adjustment),
                    happinessSignal: clamp(state.internalState.happinessSignal + adjustment / 2)
                }
            };
        
        case 'PRIME_INTERNAL_STATE': {
            const newInternalState = { ...state.internalState };
            for (const key in action.payload.adjustments) {
                const k = key as keyof InternalState;
                if (typeof newInternalState[k] === 'number') {
                    (newInternalState[k] as number) = clamp((newInternalState[k] as number) + action.payload.adjustments[k]!);
                }
            }
            const newCommandLog = { id: self.crypto.randomUUID(), timestamp: Date.now(), text: `State Priming: ${action.payload.reason}`, type: 'info' } as CommandLogEntry;

            return {
                internalState: newInternalState,
                commandLog: [newCommandLog, ...state.commandLog].slice(0, 50),
            };
        }
        
        case 'SET_INTERNAL_STATUS':
            return {
                internalState: {
                    ...state.internalState,
                    status: action.payload,
                }
            };

        case 'LOG_MILESTONE':
            const newMilestone = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
            };
            return {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [newMilestone, ...state.developmentalHistory.milestones],
                }
            };

        default:
            return {};
    }
};