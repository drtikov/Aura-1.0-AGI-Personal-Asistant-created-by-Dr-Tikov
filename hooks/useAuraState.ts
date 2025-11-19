// hooks/useAuraState.ts
import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { getInitialState } from '../state/initialState';
import { auraReducer } from '../state/reducer';
import { CURRENT_STATE_VERSION } from '../constants';
import { migrateState } from '../state/migrations';
import { HAL } from '../core/hal';
import { AuraState, HistoryEntry } from '../types';

// Custom hook to manage Aura's state, including persistence via the HAL
export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState());
    const [memoryStatus, setMemoryStatus] = useState<'initializing' | 'ready' | 'saving' | 'error'>('initializing');
    const isInitialized = useRef(false);

    // Refs to hold the latest state and memoryStatus for the interval closure
    const stateRef = useRef(state);
    const memoryStatusRef = useRef(memoryStatus);
    
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        memoryStatusRef.current = memoryStatus;
    }, [memoryStatus]);

    // Effect for loading state on initial mount (from Memristor)
    useEffect(() => {
        const initializeState = async () => {
            if (isInitialized.current) return;
            isInitialized.current = true;

            try {
                // Only load from the permanent Memristor storage (IndexedDB).
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
    
    // Effect for automatic periodic saving
    useEffect(() => {
        const SAVE_INTERVAL_MS = 30000; // 30 seconds
        
        const saveInterval = setInterval(async () => {
            // Only save if memory is ready and not already saving.
            if (memoryStatusRef.current === 'ready') {
                setMemoryStatus('saving');
                try {
                    const stateToSave = { ...stateRef.current };
                    const rebootIsPending = stateToSave.kernelState?.rebootPending;

                    if (rebootIsPending) {
                        stateToSave.kernelState = { ...stateToSave.kernelState, rebootPending: false };
                    }
                    
                    await HAL.Memristor.saveState(stateToSave);
                    setMemoryStatus('ready');
                    
                    if (rebootIsPending) {
                        console.log("Reboot triggered by automatic save...");
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Failed to auto-save state:", error);
                    setMemoryStatus('error');
                }
            }
        }, SAVE_INTERVAL_MS);

        return () => {
            clearInterval(saveInterval);
        };
    }, []); // Run only on mount
    
    // Manual save function, no longer called from UI but can be kept for other purposes if any.
    const saveStateToMemory = useCallback(async () => {
        setMemoryStatus('saving');
        try {
            const rebootIsPending = state.kernelState?.rebootPending;
            const stateToSave: AuraState = { ...state };
    
            if (rebootIsPending) {
                // Clear the flag in the state object before saving it
                stateToSave.kernelState = { ...stateToSave.kernelState, rebootPending: false };
            }
    
            await HAL.Memristor.saveState(stateToSave); // Saves to IndexedDB
            setMemoryStatus('ready');
    
            if (rebootIsPending) {
                console.log("Reboot triggered by manual save...");
                // Just reload. The app will load the state we just saved from IndexedDB on startup.
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to save state to Memristor:", error);
            setMemoryStatus('error');
        }
    }, [state]);
    
    const clearMemoryAndState = useCallback(async () => {
        await HAL.Memristor.clearDB();
        dispatch({ type: 'RESET_STATE' });
    }, []);

    return { state, dispatch, memoryStatus, clearMemoryAndState, saveStateToMemory };
};