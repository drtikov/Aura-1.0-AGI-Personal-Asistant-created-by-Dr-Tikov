import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { getInitialState } from '../state/initialState';
import { auraReducer } from '../state/reducer';
import { AuraState, HistoryEntry } from '../types';
import { CURRENT_STATE_VERSION } from '../constants';
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
        request.onupgradeneeded = () => {
            const dbInstance = request.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME);
            }
        };
    });
}

function saveState(state: AuraState): Promise<void> {
    return new Promise((resolve, reject) => {
        getDB().then(dbInstance => {
            const transaction = dbInstance.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(state, STATE_KEY);
            request.onsuccess = () => resolve();
            request.onerror = () => {
                console.error("Memristor: Save failed:", request.error);
                reject("Save failed");
            };
        });
    });
}

function loadState(): Promise<AuraState | null> {
    return new Promise((resolve) => {
        getDB().then(dbInstance => {
            try {
                const transaction = dbInstance.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(STATE_KEY);
                request.onsuccess = () => {
                    resolve(request.result || null);
                };
                request.onerror = () => {
                    console.error("Memristor: Load failed:", request.error);
                    resolve(null);
                };
            } catch (error) {
                console.error("Memristor: Error during transaction", error);
                resolve(null);
            }
        });
    });
}

function clearDB(): Promise<void> {
    return new Promise((resolve, reject) => {
        getDB().then(dbInstance => {
            const transaction = dbInstance.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => {
                console.error("Memristor: Clear failed:", request.error);
                reject("Clear failed");
            };
        });
    });
}

// Custom hook to manage Aura's state, including persistence
export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState());
    const [memoryStatus, setMemoryStatus] = useState<'initializing' | 'ready' | 'saving' | 'error'>('initializing');
    const isInitialized = useRef(false);

    // Effect for loading state from IndexedDB on initial mount
    useEffect(() => {
        const initializeState = async () => {
            if (isInitialized.current) return;
            isInitialized.current = true;

            try {
                let loadedState = await loadState();
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

    // Effect for saving state to IndexedDB whenever it changes
    useEffect(() => {
        if (memoryStatus === 'ready') {
            setMemoryStatus('saving');
            saveState(state).then(() => {
                setMemoryStatus('ready');
            }).catch(() => {
                setMemoryStatus('error');
            });
        }
    }, [state, memoryStatus]);

    const handleClearDB = useCallback(async () => {
        await clearDB();
    }, []);

    return { state, dispatch, memoryStatus, clearDB: handleClearDB };
};
