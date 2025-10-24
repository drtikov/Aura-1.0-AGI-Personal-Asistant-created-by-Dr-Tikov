// state/reducers/reducer.ts
import { AuraState, Action, EventBusMessage, HistoryEntry } from '../../types.ts';
import { getInitialState } from './initialState.ts';
import { coreReducer } from './core.ts';
import { memoryReducer } from './memory.ts';
import { architectureReducer } from './architecture.ts';
import { planningReducer } from './planning.ts';
import { enginesReducer } from './engines.ts';
import { logsReducer } from './logs.ts';
import { systemReducer } from './system.ts';
import { neuroCortexReducer } from './neuroCortex.ts';
import { granularCortexReducer } from './granularCortex.ts';
import { koniocortexReducer } from './koniocortex.ts';
import { premotorPlannerReducer } from './premotor.ts';
import { basalGangliaReducer } from './basalGanglia.ts';
import { cerebellumReducer } from './cerebellum.ts';
import { psycheReducer } from './psyche.ts';
import { motorCortexReducer } from './motorCortex.ts';
import { praxisResonatorReducer } from './praxisResonator.ts';
import { cognitiveForgeReducer } from './cognitiveForge.ts';
import { pluginReducer } from './pluginReducer.ts';
import { socialCognitionReducer } from './socialCognition.ts';
import { sandboxReducer } from './sandbox.ts';
import { doxasticReducer } from './doxastic.ts';
import { metaphorReducer } from './metaphor.ts';
import { hovaReducer } from './hova.ts';
import { documentForgeReducer } from './documentForge.ts';
import { internalScientistReducer } from './internalScientist.ts';
import { metisSandboxReducer } from './metisSandbox.ts';
import { wisdomIngestionReducer } from './wisdomIngestion.ts';
import { spandaReducer } from './spanda.ts';
import { temporalEngineReducer } from './temporalEngine.ts';
import { axiomaticCrucibleReducer } from './axiomaticCrucible.ts';
import { kernelReducer } from './kernel.ts';
import { personaReducer } from './persona.ts';
import { brainstormReducer } from './brainstorm.ts';
import { liveSessionReducer } from './liveSession.ts';
import { cognitiveTriageReducer } from './cognitiveTriage.ts';
import { praxisCoreReducer } from './praxisCore.ts';
import { subsumptionLogReducer } from './subsumptionLog.ts';
import { strategicCoreReducer } from './strategicCore.ts';
import { mycelialReducer } from './mycelial.ts';
import { semanticWeaverReducer } from './semanticWeaver.ts';
import { atpCoprocessorReducer } from './atpCoprocessor.ts';
import { prometheusReducer } from './prometheus.ts';
import { symbioticCoderReducer } from './symbioticCoder.ts';
import { collaborativeSessionReducer } from './collaborativeSession.ts';
import { toolReducer } from './toolReducer.ts';
import { canvasReducer } from './canvas.ts';
import { synthesisReducer } from './synthesisReducer.ts';
import { somaticCrucibleReducer } from './somaticCrucible.ts';
import { autoCodeForgeReducer } from './autoCodeForge.ts';
import { resonanceReducer } from './resonanceReducer.ts';
import { crucibleReducer } from './crucibleReducer.ts';

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

    let intermediateState = state;

    // --- SYSCALL INTERCEPTION FOR RESONANCE ---
    if (action.type === 'SYSCALL') {
        const { call } = action.payload;
        const frequency = call.split('/')[0];

        // Dispatch resonance pings for relevant syscalls
        if (frequency && frequency !== call && !call.startsWith('RESONANCE/')) {
            const pingAction: Action = {
                type: 'SYSCALL',
                payload: { call: 'RESONANCE/PING_FREQUENCY', args: { frequency } }
            };
            intermediateState = { ...intermediateState, ...resonanceReducer(intermediateState, pingAction) };
        }

        // Dispatch decay on kernel tick
        if (call === 'KERNEL/TICK') {
            const decayAction: Action = {
                type: 'SYSCALL',
                payload: { call: 'RESONANCE/DECAY_FREQUENCIES', args: {} }
            };
            intermediateState = { ...intermediateState, ...resonanceReducer(intermediateState, decayAction) };
        }
    }
    // --- END RESONANCE INTERCEPTION ---
    
    // Process the action through all slice reducers, accumulating changes
    let nextState = intermediateState;
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