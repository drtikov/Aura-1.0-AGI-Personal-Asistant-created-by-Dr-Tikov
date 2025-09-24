import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
// FIX: Corrected import path for initialState to resolve module error.
import { getInitialState } from '../state/initialState';
import { auraReducer } from '../state/reducer';
// FIX: Corrected import path for types to resolve module error.
import { AuraState, HistoryEntry } from '../types';
import { CURRENT_STATE_VERSION } from '../constants';
// FIX: Corrected import path for migrations to resolve module error.
import { migrateState } from '../state/migrations';

// --- Memristor Logic (integrated from worker) ---
const DB_NAME = 'AuraMemristorDB';
const DB_VERSION = 1;
const STORE_NAME = 'AuraStateStore';
const STATE_KEY = 'latest_aura_state';

let db: IDBDatabase | null = null;

function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => {
            console.error("Memristor: IndexedDB error:", request.error);
            reject("IndexedDB error");
        };
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME);
            }
        };
    });
}

async function saveStateToDB(state: AuraState): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const dbInstance = await getDB();
            const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put(state, STATE_KEY);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                 console.error('Memristor: Transaction error while saving state.', transaction.error);
                 reject(transaction.error);
            };
        } catch (error) {
            console.error('Memristor: Failed to save state.', error);
            reject(error);
        }
    });
}

async function loadStateFromDB(): Promise<AuraState | null> {
     return new Promise(async (resolve, reject) => {
         try {
            const dbInstance = await getDB();
            const transaction = dbInstance.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(STATE_KEY);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => {
                console.error('Memristor: Error loading state.', request.error);
                reject(request.error);
            };
        } catch (error) {
            console.error('Memristor: Failed to load state.', error);
            reject(error);
        }
     });
}

async function clearStateFromDB(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const dbInstance = await getDB();
            const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => {
                 console.error('Memristor: Transaction error while clearing state.', transaction.error);
                 reject(transaction.error);
            };
        } catch (error) {
            console.error('Memristor: Failed to clear state.', error);
            reject(error);
        }
    });
}


// --- Hook Implementation ---

export type MemoryStatus = 'saved' | 'saving' | 'error';

const initializer = (): AuraState => {
    const initialState = getInitialState();
    const message: HistoryEntry = { id: self.crypto.randomUUID(), from: 'system', text: "SYSTEM: Initializing AGI instance. Accessing Memristor..." };
    return { ...initialState, history: [...initialState.history, message] };
};

export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, null, initializer);
    const [memoryStatus, setMemoryStatus] = useState<MemoryStatus>('saved');
    const [isStateHydrated, setIsStateHydrated] = useState(false);
    
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Effect for loading the initial state from DB
    useEffect(() => {
        const hydrateState = async () => {
            try {
                const payload = await loadStateFromDB();
                if (payload && payload.version === CURRENT_STATE_VERSION) {
                    dispatch({ type: 'RESTORE_STATE_FROM_MEMRISTOR', payload });
                } else if (payload && payload.version < CURRENT_STATE_VERSION) {
                    console.warn(`Memristor state version mismatch. Found v${payload.version}, expected v${CURRENT_STATE_VERSION}. Starting migration...`);
                    try {
                        const migratedState = migrateState(payload);
                        dispatch({ type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: migratedState });
                    } catch (migrationError) {
                        console.error("State migration failed:", migrationError);
                        dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: self.crypto.randomUUID(), from: 'system', text: `SYSTEM: CRITICAL ERROR: Failed to upgrade Aura's memory. Resetting to a fresh state to prevent corruption.` } });
                    }
                } else if (payload) {
                    console.error(`Memristor state version (v${payload.version}) is newer than the application version (v${CURRENT_STATE_VERSION}). This is unsupported. Resetting state.`);
                    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: Detected a future state version. AGI has been reset.' } });
                }
            } catch (error) {
                console.error("Memristor load error:", error);
                dispatch({ type: 'ADD_HISTORY_ENTRY', payload: { id: self.crypto.randomUUID(), from: 'system', text: 'SYSTEM: Could not read from Memristor, initializing fresh AGI instance.' } });
            } finally {
                setIsStateHydrated(true);
            }
        };

        hydrateState();
    }, []); // Runs only once on mount

    // Effect for persisting state to DB periodically and on page exit
    useEffect(() => {
        if (!isStateHydrated) {
            return;
        }

        const saveState = async () => {
            // Use the ref to ensure the latest state is always saved,
            // avoiding stale closures in event listeners.
            const currentState = stateRef.current;
            if (currentState) {
                setMemoryStatus('saving');
                try {
                    await saveStateToDB(currentState);
                    setMemoryStatus('saved');
                } catch (error) {
                    console.error("Memristor save error:", error);
                    setMemoryStatus('error');
                }
            }
        };

        // Save every 5 seconds as a fallback
        const intervalId = setInterval(saveState, 5000);

        // Save when the tab is hidden or closed
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveState();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', saveState);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', saveState);
            // One final save on cleanup
            saveState();
        };
    }, [isStateHydrated]); // This effect runs only once after hydration
    
    const clearDB = useCallback(async () => {
        await clearStateFromDB();
    }, []);

    return { state, dispatch, memoryStatus, clearDB };
};
