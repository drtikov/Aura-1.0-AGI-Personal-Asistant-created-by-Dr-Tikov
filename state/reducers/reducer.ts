// state/reducers/reducer.ts
// FIX: Import missing AuraState and Action types.
import { AuraState, Action, EventBusMessage, HistoryEntry } from '../../types';
import { getInitialState } from '../initialState';
import { coreReducer } from './core';
import { memoryReducer } from './memory';
import { architectureReducer } from './architecture';
import { planningReducer } from './planning';
import { enginesReducer } from './engines';
import { logsReducer } from './logs';
import { systemReducer } from './system';
import { neuroCortexReducer } from './neuroCortex';
import { granularCortexReducer } from './granularCortex';
import { koniocortexReducer } from './koniocortex';
import { premotorPlannerReducer } from './premotor';
import { basalGangliaReducer } from './basalGanglia';
import { cerebellumReducer } from './cerebellum';
import { psycheReducer } from './psyche';
import { motorCortexReducer } from './motorCortex';
import { praxisResonatorReducer } from './praxisResonator';
import { cognitiveForgeReducer } from './cognitiveForge';
import { pluginReducer } from './pluginReducer';
import { socialCognitionReducer } from './socialCognition';
import { sandboxReducer } from './sandbox';
import { doxasticReducer } from './doxastic';
import { metaphorReducer } from './metaphor';
import { hovaReducer } from './hova';
import { documentForgeReducer } from './documentForge';
import { internalScientistReducer } from './internalScientist';
import { metisSandboxReducer } from './metisSandbox';
import { wisdomIngestionReducer } from './wisdomIngestion';
import { spandaReducer } from './spanda';
import { temporalEngineReducer } from './temporalEngine';
import { axiomaticCrucibleReducer } from './axiomaticCrucible';
import { kernelReducer } from './kernel';
import { personaReducer } from './persona';
import { brainstormReducer } from './brainstorm';
import { liveSessionReducer } from './liveSession';
import { cognitiveTriageReducer } from './cognitiveTriage';
import { praxisCoreReducer } from './praxisCore';
import { subsumptionLogReducer } from './subsumptionLog';
import { strategicCoreReducer } from './strategicCore';
import { mycelialReducer } from './mycelial';
import { semanticWeaverReducer } from './semanticWeaver';

const reducers = [
    coreReducer,
    memoryReducer,
    architectureReducer,
    planningReducer,
    enginesReducer,
    logsReducer,
    systemReducer,
    neuroCortexReducer,
    granularCortexReducer,
    koniocortexReducer,
    premotorPlannerReducer,
    basalGangliaReducer,
    cerebellumReducer,
    psycheReducer,
    motorCortexReducer,
    praxisResonatorReducer,
    cognitiveForgeReducer,
    pluginReducer,
    socialCognitionReducer,
    sandboxReducer,
    doxasticReducer,
    metaphorReducer,
    hovaReducer,
    documentForgeReducer,
    internalScientistReducer,
    metisSandboxReducer,
    wisdomIngestionReducer,
    spandaReducer,
    temporalEngineReducer,
    axiomaticCrucibleReducer,
    kernelReducer,
    personaReducer,
    brainstormReducer,
    liveSessionReducer,
    cognitiveTriageReducer,
    praxisCoreReducer,
    subsumptionLogReducer,
    strategicCoreReducer,
    mycelialReducer,
    semanticWeaverReducer,
];

// FIX: Implemented the full reducer function to resolve the "must return a value" error from a truncated file.
export const auraReducer = (state: AuraState, action: Action): AuraState => {
    // Handle global actions that bypass slice reducers
    if (action.type === 'RESET_STATE') {
        return getInitialState();
    }
    if (action.type === 'IMPORT_STATE') {
        return action.payload;
    }

    // Process the action through all slice reducers, accumulating changes
    let nextState = state;
    for (const reducer of reducers) {
        // Reducers now return partial state, so we merge them.
        const partialState = reducer(nextState, action);
        nextState = { ...nextState, ...partialState };
    }
    
    // Post-processing / interceptors can go here
    // Example: The qualiaVector logic mentioned in a comment in logs.ts
    if (action.type === 'SYSCALL' && action.payload.call === 'ADD_HISTORY_ENTRY') {
        const { internalState } = nextState;
        const qualiaVector = {
            gunaState: internalState.gunaState,
            wisdom: internalState.wisdomSignal,
            happiness: internalState.happinessSignal,
            love: internalState.loveSignal,
        };
        const message: EventBusMessage = {
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'HISTORY_ENTRY_ADDED',
            payload: action.payload.args,
            qualiaVector,
        };
         nextState = {
            ...nextState,
            eventBus: [message, ...nextState.eventBus].slice(0, 50),
        };
    }
    
    // Handle Prometheus Engine state changes
    if (action.type === 'SYSCALL' && action.payload.call === 'PROMETHEUS/SET_STATE') {
        nextState = {
            ...nextState,
            prometheusState: {
                ...nextState.prometheusState,
                ...action.payload.args,
            },
        };
    }
    if (action.type === 'SYSCALL' && action.payload.call === 'PROMETHEUS/LOG') {
        const newLogEntry = { timestamp: Date.now(), message: action.payload.args.message };
        nextState = {
            ...nextState,
            prometheusState: {
                ...nextState.prometheusState,
                log: [newLogEntry, ...nextState.prometheusState.log].slice(0, 20),
            },
        };
    }

    return nextState;
};
