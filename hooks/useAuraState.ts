import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { getInitialState } from '../state/initialState';
import { auraReducer } from '../state/reducer';
import { CURRENT_STATE_VERSION } from '../constants';
import { migrateState } from '../state/migrations';
import { HAL } from '../core/hal';

// Custom hook to manage Aura's state, including persistence via the HAL
export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState());
    const [memoryStatus, setMemoryStatus] = useState<'initializing' | 'ready' | 'saving' | 'error'>('initializing');
    const isInitialized = useRef(false);

    // Effect for loading state from Memristor on initial mount
    useEffect(() => {
        const initializeState = async () => {
            if (isInitialized.current) return;
            isInitialized.current = true;

            try {
                let loadedState = await HAL.Memristor.loadState();
                if (loadedState) {
                    if (!loadedState.version || loadedState.version < CURRENT_STATE_VERSION) {
                        console.log(`State version mismatch. Migrating from v${loadedState.version || 1} to v${CURRENT_STATE_VERSION}.`);
                        loadedState = migrateState(loadedState);
                    } else if (loadedState.version > CURRENT_STATE_VERSION) {
                        console.warn(`Loaded state is from a future version (v${loadedState.version}). Resetting to default.`);
                        loadedState = null;
                    }
                    
                    if (loadedState) {
                        dispatch({ type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: loadedState });
                        // Dispatch a separate action to log the restoration event reliably.
                        dispatch({ type: 'SYSCALL', payload: { call: 'ADD_HISTORY_ENTRY', args: { from: 'system', text: 'SYSTEM: State restored from Memristor.' } } });
                    }
                }
                setMemoryStatus('ready');
            } catch (error) {
                console.error("Failed to initialize state from Memristor:", error);
                setMemoryStatus('error');
            }
        };

        initializeState();
    }, []);

    // Effect for saving state to Memristor whenever it changes
    useEffect(() => {
        if (memoryStatus === 'ready') {
            setMemoryStatus('saving');
            HAL.Memristor.saveState(state).then(() => {
                setMemoryStatus('ready');
            }).catch(() => {
                setMemoryStatus('error');
            });
        }
    }, [state, memoryStatus]);

    const clearMemoryAndState = useCallback(async () => {
        await HAL.Memristor.clearDB();
        dispatch({ type: 'RESET_STATE' });
    }, []);

    return { state, dispatch, memoryStatus, clearMemoryAndState };
};