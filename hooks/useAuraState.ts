import { useReducer, useEffect } from 'react';
import { getInitialState } from '../state/initialState';
import { auraReducer } from '../state/reducer';
import { AuraState } from '../types';
import * as Keys from '../constants';

// Explicit mapping between state keys and localStorage keys for robust persistence.
const STATE_TO_STORAGE_KEY_MAP: { [key in keyof Partial<AuraState>]: string } = {
    theme: Keys.THEME_KEY,
    history: Keys.CHAT_HISTORY_KEY,
    knowledgeGraph: Keys.KNOWLEDGE_GRAPH_KEY,
    goals: Keys.GOALS_KEY,
    performanceLogs: Keys.PERFORMANCE_LOGS_KEY,
    limitations: Keys.LIMITATIONS_KEY,
    internalState: Keys.INTERNAL_STATE_KEY,
    architecturalProposals: Keys.ARCH_PROPOSALS_KEY,
    cognitiveArchitecture: Keys.COGNITIVE_ARCH_KEY,
    cognitiveGainLog: Keys.COGNITIVE_GAIN_LOG_KEY,
    causalSelfModel: Keys.CAUSAL_SELF_MODEL_KEY,
    systemSnapshots: Keys.SYSTEM_SNAPSHOTS_KEY,
    modificationLog: Keys.MODIFICATION_LOG_KEY,
    selfAwarenessMetrics: Keys.SELF_AWARENESS_METRICS_KEY,
    gunaCalibrator: Keys.GUNA_CALIBRATOR_KEY,
    cognitiveModeLog: Keys.COGNITIVE_MODE_LOG_KEY,
    disciplineState: Keys.DISCIPLINE_STATE_KEY,
    userModel: Keys.USER_MODEL_KEY,
    curiosityModel: Keys.CURIOSITY_MODEL_KEY,
    ingenuityState: Keys.INGENUITY_STATE_KEY,
    rieState: Keys.RIE_STATE_KEY,
    motivationalCalibrator: Keys.MOTIVATIONAL_CALIBRATOR_KEY,
    intuitionEngineState: Keys.INTUITION_ENGINE_KEY,
    intuitiveLeaps: Keys.INTUITIVE_LEAPS_KEY,
    resourceMonitor: Keys.RESOURCE_MONITOR_KEY,
    workingMemory: Keys.WORKING_MEMORY_KEY,
    internalStateHistory: Keys.INTERNAL_STATE_HISTORY_KEY,
    proactiveEngineState: Keys.PROACTIVE_ENGINE_KEY,
    ethicalGovernorState: Keys.ETHICAL_GOVERNOR_KEY,
};


export const useAuraState = () => {
    const [state, dispatch] = useReducer(auraReducer, getInitialState(), (initialState) => {
        try {
            const loadedState: Partial<AuraState> = {};
            for (const key in STATE_TO_STORAGE_KEY_MAP) {
                const stateKey = key as keyof AuraState;
                const storageKey = STATE_TO_STORAGE_KEY_MAP[stateKey];
                const item = localStorage.getItem(storageKey);
                if (item !== null) {
                    try {
                        (loadedState as any)[stateKey] = JSON.parse(item);
                    } catch (e) {
                        console.warn(`Could not parse localStorage item ${storageKey}, it might be corrupted.`, e);
                    }
                }
            }
             // Merge loaded state with initial state to ensure all keys are present
            return { ...initialState, ...loadedState };
        } catch (error) {
            console.error("Failed to load state from localStorage, using initial state.", error);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            for (const key in STATE_TO_STORAGE_KEY_MAP) {
                const stateKey = key as keyof AuraState;
                const storageKey = STATE_TO_STORAGE_KEY_MAP[stateKey];
                const dataToStore = state[stateKey];
                if (dataToStore !== undefined) {
                    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
                }
            }
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [state]);

    return { state, dispatch };
};