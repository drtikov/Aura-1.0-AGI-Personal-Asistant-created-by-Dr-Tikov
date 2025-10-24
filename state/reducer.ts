// state/reducers/reducer.ts
import { AuraState, Action, EventBusMessage, HistoryEntry } from '../types.ts';
import { getInitialState } from './initialState.ts';
import { coreReducer } from './reducers/core.ts';
import { memoryReducer } from './reducers/memory.ts';
import { architectureReducer } from './reducers/architecture.ts';
import { planningReducer } from './reducers/planning.ts';
import { enginesReducer } from './reducers/engines.ts';
import { logsReducer } from './reducers/logs.ts';
import { systemReducer } from './reducers/system.ts';
import { neuroCortexReducer } from './reducers/neuroCortex.ts';
import { granularCortexReducer } from './reducers/granularCortex.ts';
import { koniocortexReducer } from './reducers/koniocortex.ts';
import { premotorPlannerReducer } from './reducers/premotor.ts';
import { basalGangliaReducer } from './reducers/basalGanglia.ts';
import { cerebellumReducer } from './reducers/cerebellum.ts';
import { psycheReducer } from './reducers/psyche.ts';
import { motorCortexReducer } from './reducers/motorCortex.ts';
import { praxisResonatorReducer } from './reducers/praxisResonator.ts';
import { cognitiveForgeReducer } from './reducers/cognitiveForge.ts';
import { pluginReducer } from './reducers/pluginReducer.ts';
import { socialCognitionReducer } from './reducers/socialCognition.ts';
import { sandboxReducer } from './reducers/sandbox.ts';
import { doxasticReducer } from './reducers/doxastic.ts';
import { metaphorReducer } from './reducers/metaphor.ts';
import { hovaReducer } from './reducers/hova.ts';
import { documentForgeReducer } from './reducers/documentForge.ts';
import { internalScientistReducer } from './reducers/internalScientist.ts';
import { metisSandboxReducer } from './reducers/metisSandbox.ts';
import { wisdomIngestionReducer } from './reducers/wisdomIngestion.ts';
import { spandaReducer } from './reducers/spanda.ts';
import { temporalEngineReducer } from './reducers/temporalEngine.ts';
import { axiomaticCrucibleReducer } from './reducers/axiomaticCrucible.ts';
import { kernelReducer } from './reducers/kernel.ts';
import { personaReducer } from './reducers/persona.ts';
import { brainstormReducer } from './reducers/brainstorm.ts';
import { liveSessionReducer } from './reducers/liveSession.ts';
import { cognitiveTriageReducer } from './reducers/cognitiveTriage.ts';
import { praxisCoreReducer } from './reducers/praxisCore.ts';
import { subsumptionLogReducer } from './reducers/subsumptionLog.ts';
import { strategicCoreReducer } from './reducers/strategicCore.ts';
import { mycelialReducer } from './reducers/mycelial.ts';
import { semanticWeaverReducer } from './reducers/semanticWeaver.ts';
import { atpCoprocessorReducer } from './reducers/atpCoprocessor.ts';
import { prometheusReducer } from './reducers/prometheus.ts';
import { symbioticCoderReducer } from './reducers/symbioticCoder.ts';
import { collaborativeSessionReducer } from './reducers/collaborativeSession.ts';
import { toolReducer } from './reducers/toolReducer.ts';
import { canvasReducer } from './reducers/canvas.ts';
import { synthesisReducer } from './reducers/synthesisReducer.ts';
import { somaticCrucibleReducer } from './reducers/somaticCrucible.ts';
import { autoCodeForgeReducer } from './reducers/autoCodeForge.ts';
import { resonanceReducer } from './reducers/resonanceReducer.ts';
import { crucibleReducer } from './reducers/crucibleReducer.ts';

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
    symbioticCoderReducer,
    collaborativeSessionReducer,
    toolReducer,
    canvasReducer,
    synthesisReducer,
    somaticCrucibleReducer,
    autoCodeForgeReducer,
    resonanceReducer,
    crucibleReducer,
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
