// state/reducer.ts
import { AuraState, Action, EventBusMessage, HistoryEntry } from '../types';
import { getInitialState } from './initialState';
import { coreReducer } from './reducers/core';
import { memoryReducer } from './reducers/memory';
import { architectureReducer } from './reducers/architecture';
import { planningReducer } from './reducers/planning';
import { enginesReducer } from './reducers/engines';
import { logsReducer } from './reducers/logs';
import { systemReducer } from './reducers/system';
import { neuroCortexReducer } from './reducers/neuroCortex';
import { granularCortexReducer } from './reducers/granularCortex';
import { koniocortexReducer } from './reducers/koniocortex';
import { premotorPlannerReducer } from './reducers/premotor';
import { basalGangliaReducer } from './reducers/basalGanglia';
import { cerebellumReducer } from './reducers/cerebellum';
import { psycheReducer } from './reducers/psyche';
import { motorCortexReducer } from './reducers/motorCortex';
import { praxisResonatorReducer } from './reducers/praxisResonator';
import { cognitiveForgeReducer } from './reducers/cognitiveForge';
import { pluginReducer } from './reducers/pluginReducer';
import { socialCognitionReducer } from './reducers/socialCognition';
import { sandboxReducer } from './reducers/sandbox';
import { doxasticReducer } from './reducers/doxastic';
import { metaphorReducer } from './reducers/metaphor';
import { hovaReducer } from './reducers/hova';
import { documentForgeReducer } from './reducers/documentForge';
import { internalScientistReducer } from './reducers/internalScientist';
import { metisSandboxReducer } from './reducers/metisSandbox';
import { wisdomIngestionReducer } from './reducers/wisdomIngestion';
import { spandaReducer } from './reducers/spanda';
import { temporalEngineReducer } from './reducers/temporalEngine';
import { axiomaticCrucibleReducer } from './reducers/axiomaticCrucible';
import { kernelReducer } from './reducers/kernel';
import { personaReducer } from './reducers/persona';
import { brainstormReducer } from './reducers/brainstorm';
import { liveSessionReducer } from './reducers/liveSession';
import { cognitiveTriageReducer } from './reducers/cognitiveTriage';
import { praxisCoreReducer } from './reducers/praxisCore';
import { subsumptionLogReducer } from './reducers/subsumptionLog';
import { strategicCoreReducer } from './reducers/strategicCore';
import { mycelialReducer } from './reducers/mycelial';
import { semanticWeaverReducer } from './reducers/semanticWeaver';
import { atpCoprocessorReducer } from './reducers/atpCoprocessor';
import { prometheusReducer } from './reducers/prometheus';

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
    atpCoprocessorReducer,
    prometheusReducer,
];

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