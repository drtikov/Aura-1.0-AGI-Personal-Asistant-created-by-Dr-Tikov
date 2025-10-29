// hooks/useAuraState.ts
import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { getInitialState } from '../state/initialState.ts';
import { auraReducer } from '../state/reducer.ts';
import { CURRENT_STATE_VERSION } from '../constants.ts';
import { migrateState } from '../state/migrations.ts';
import { HAL } from '../core/hal.ts';
import { AuraState, HistoryEntry } from '../types.ts';

const CONTINUATION_SNAPSHOT_KEY = 'auraContinuationSnapshot';

// Custom hook to manage Aura's state, including persistence via the HAL
export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState());
    const [memoryStatus, setMemoryStatus] = useState<'initializing' | 'ready' | 'saving' | 'error'>('initializing');
    const isInitialized = useRef(false);

    // Effect for loading state on initial mount (from seamless reboot or Memristor)
    useEffect(() => {
        const initializeState = async () => {
            if (isInitialized.current) return;
            isInitialized.current = true;

            try {
                // 1. Check for seamless reboot snapshot first
                const snapshot = sessionStorage.getItem(CONTINUATION_SNAPSHOT_KEY);
                if (snapshot) {
                    sessionStorage.removeItem(CONTINUATION_SNAPSHOT_KEY); // Crucial: remove after reading
                    const loadedState = JSON.parse(snapshot);
                    const systemMessage: HistoryEntry = {
                        id: self.crypto.randomUUID(),
                        from: 'system',
                        text: 'SYSTEM: Seamless reboot complete. State restored.',
                        timestamp: Date.now()
                    };
                    dispatch({ type: 'IMPORT_STATE', payload: { ...loadedState, history: [...(loadedState.history || []), systemMessage] } });
                    setMemoryStatus('ready');
                    return; // Initialization is done
                }

                // 2. If no snapshot, proceed with normal Memristor loading
                let loadedState: AuraState | null = await HAL.Memristor.loadState();
                if (loadedState) {
                    if (!loadedState.version || loadedState.version < CURRENT_STATE_VERSION) {
                        console.log(`State version mismatch. Migrating from v${loadedState.version || 1} to v${CURRENT_STATE_VERSION}.`);
                        loadedState = migrateState(loadedState);
                    } else if (loadedState.version > CURRENT_STATE_VERSION) {
                        console.warn(`Loaded state is from a future version (v${loadedState.version}). Resetting to default.`);
                        loadedState = null;
                    }
                    
                    if (loadedState) {
                        const systemMessage: HistoryEntry = {
                            id: self.crypto.randomUUID(),
                            from: 'system',
                            text: 'SYSTEM: State restored from Memristor.',
                            timestamp: Date.now()
                        };
            
                        const stateToImport: AuraState = {
                            ...loadedState,
                            history: [...loadedState.history, systemMessage]
                        };
            
                        // The redundant save operation that caused the stall has been removed.
                        // The main useEffect that saves on [state] change will now handle persisting the migrated state.
                        
                        // Now dispatch the fully prepared and saved state to the UI
                        dispatch({ type: 'IMPORT_STATE', payload: stateToImport });
                    }
                }
                setMemoryStatus('ready');
            } catch (error) {
                console.error("Failed to initialize state from Memristor:", error);
                setMemoryStatus('error');
            }
        };

        initializeState();

    }, []); // Empty dependency array ensures this runs only once
    
    // Effect for triggering a seamless reboot when required
    useEffect(() => {
        if (state.kernelState?.rebootRequired) {
            console.log("Seamless reboot triggered...");
            // Clean the flag before saving to prevent a loop
            const stateToSave = { ...state, kernelState: { ...state.kernelState, rebootRequired: false } };
            sessionStorage.setItem(CONTINUATION_SNAPSHOT_KEY, JSON.stringify(stateToSave));
            window.location.reload();
        }
    }, [state.kernelState]);
    
    // Effect for saving state to Memristor whenever it changes
    useEffect(() => {
        // Don't save during initialization or if a reboot is pending.
        if (memoryStatus !== 'ready' || state.kernelState?.rebootRequired) {
            return;
        }

        setMemoryStatus('saving');
        HAL.Memristor.saveState(state).then(() => {
            setMemoryStatus('ready');
        }).catch(() => {
            setMemoryStatus('error');
        });
    }, [state, memoryStatus]);

    const clearMemoryAndState = useCallback(async () => {
        await HAL.Memristor.clearDB();
        dispatch({ type: 'RESET_STATE' });
    }, []);

    return { state, dispatch, memoryStatus, clearMemoryAndState };
};