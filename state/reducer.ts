// FIX: Corrected import path for types to resolve module error.
import { AuraState, Action } from '../types';
// FIX: Corrected import path for initialState to resolve module error.
import { getInitialState } from './initialState';
// FIX: Corrected import path for architecture reducer to resolve module error.
import { architectureReducer } from './reducers/architecture';
// FIX: Corrected import path for core reducer to resolve module error.
import { coreReducer } from './reducers/core';
// FIX: Corrected import path for engines reducer to resolve module error.
import { enginesReducer } from './reducers/engines';
// FIX: Corrected import path for logs reducer to resolve module error.
import { logsReducer } from './reducers/logs';
// FIX: Corrected import path for memory reducer to resolve module error.
import { memoryReducer } from './reducers/memory';
// FIX: Corrected import path for planning reducer to resolve module error.
import { planningReducer } from './reducers/planning';
// FIX: Corrected import path for system reducer to resolve module error.
import { systemReducer } from './reducers/system';

/**
 * The root reducer for the Aura application.
 * It handles global actions that affect the entire state object, such as resetting or importing.
 * For all other actions, it delegates to domain-specific sub-reducers and merges their results.
 */
export const auraReducer = (state: AuraState, action: Action): AuraState => {
    switch (action.type) {
        // Handle global actions that replace the whole state
        case 'RESET_STATE':
            return {
                ...getInitialState(),
                history: [{ id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: AGI has been reset to its initial state.' }]
            };
        
        case 'ROLLBACK_STATE':
            return {
                ...action.payload,
                history: [...action.payload.history, { id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: State successfully rolled back.' }]
            };

        case 'IMPORT_STATE':
            return {
                ...action.payload,
                history: [...action.payload.history, { id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: State successfully imported from file.' }]
            };

        case 'RESTORE_STATE_FROM_MEMRISTOR':
            return {
                ...action.payload,
                history: [...action.payload.history, { id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: State restored from Memristor.' }]
            };

        // For all other actions, delegate to sub-reducers and merge their partial state updates.
        default:
            const updatedState: AuraState = {
                ...state,
                ...architectureReducer(state, action),
                ...coreReducer(state, action),
                ...enginesReducer(state, action),
                ...logsReducer(state, action),
                ...memoryReducer(state, action),
                ...planningReducer(state, action),
                ...systemReducer(state, action),
            };
            return updatedState;
    }
};
