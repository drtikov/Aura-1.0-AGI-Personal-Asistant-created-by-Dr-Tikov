// state/reducers/reducer.ts
// FIX: Added missing imports for AuraState, Action, EventBusMessage, and HistoryEntry from types.ts to resolve module errors.
import { AuraState, Action, EventBusMessage, HistoryEntry } from '../../types.ts';
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
// FIX: Import missing reducers
import { ramanujanReducer } from './reducers/ramanujan.ts';
import { symbioticCoderReducer } from './reducers/symbioticCoder.ts';
import { collaborativeSessionReducer } from './reducers/collaborativeSession.ts';
import { toolReducer } from './reducers/toolReducer.ts';
import { canvasReducer } from './reducers/canvas.ts';
import { synthesisReducer } from './reducers/synthesisReducer.ts';
import { somaticCrucibleReducer } from './reducers/somaticCrucible.ts';
import { autoCodeForgeReducer } from './reducers/autoCodeForge.ts';
import { resonanceReducer } from './reducers/resonanceReducer.ts';
import { daedalusReducer } from './reducers/daedalus.ts';
import { erisReducer } from './reducers/eris.ts';
import { lagrangeEngineReducer } from './reducers/lagrangeEngine.ts';
import { ockhamEngineReducer } from './reducers/ockhamEngine.ts';
import { bennettEngineReducer } from './reducers/bennettEngine.ts';
import { artificialScientistReducer } from './reducers/artificialScientist.ts';
import { socraticAssessorReducer } from './reducers/socraticAssessor.ts';
import { axiomaticGenesisForgeReducer } from './reducers/axiomaticGenesisForge.ts';
import { ricciFlowReducer } from './reducers/ricciFlow.ts';
import { introspectionReducer } from './reducers/introspection.ts';
import { harmonicEngineReducer } from './reducers/harmonicEngine.ts';
import { heuristicCoprocessorReducer } from './reducers/heuristicCoprocessor.ts';

const reducerMap: { [key: string]: (state: AuraState, action: Action) => Partial<AuraState> } = {
    // This map uses syscall prefixes to route actions to the correct reducer.
    'DEFAULT': coreReducer, // For actions without a specific prefix
    'HISTORY': logsReducer,
    'MEMORY': memoryReducer, 'ADD_FACT': memoryReducer, 'ADD_EPISODE': memoryReducer, 'CLEAR_WORKING_MEMORY': memoryReducer, 'HOMEOSTASIS': memoryReducer, 'CHRONICLE': memoryReducer,
    'APPLY_ARCH_PROPOSAL': architectureReducer, 'OA': architectureReducer, 'HEURISTICS_FORGE': architectureReducer, 'SYNAPTIC_MATRIX': architectureReducer, 'INGEST_CODE_CHANGE': architectureReducer,
    'BUILD_GOAL_TREE': planningReducer, 'UPDATE_GOAL_STATUS': planningReducer, 'BUILD_PROOF_TREE': planningReducer, 'BUILD_GUILD_TASK_TREE': planningReducer,
    'ETHICAL_GOVERNOR': enginesReducer, 'UPDATE_SUGGESTION_STATUS': enginesReducer,
    'ADD_HISTORY_ENTRY': logsReducer, 'UPDATE_HISTORY_ENTRY': logsReducer, 'APPEND_TO_HISTORY_ENTRY': logsReducer, 'FINALIZE_HISTORY_ENTRY': logsReducer, 'ADD_PERFORMANCE_LOG': logsReducer, 'ADD_COMMAND_LOG': logsReducer, 'LOG': logsReducer, 'UPDATE_HISTORY_FEEDBACK': logsReducer,
    'METACGNITIVE_NEXUS': systemReducer, 'SYSTEM': systemReducer,
    'NEURO_CORTEX': neuroCortexReducer,
    'GRANULAR_CORTEX': granularCortexReducer,
    'PROCESS_USER_INPUT_INTO_PERCEPT': koniocortexReducer,
    'PREMOTOR': premotorPlannerReducer,
    'BASAL_GANGLIA': basalGangliaReducer,
    'CEREBELLUM': cerebellumReducer,
    'PSYCHE': psycheReducer,
    'MOTOR_CORTEX': motorCortexReducer,
    'PRAXIS_RESONATOR': praxisResonatorReducer,
    'COGNITIVE_FORGE': cognitiveForgeReducer,
    'PLUGIN': pluginReducer,
    'SOCIAL': socialCognitionReducer,
    'SANDBOX': sandboxReducer, 'METIS': metisSandboxReducer,
    'DOXASTIC': doxasticReducer,
    'METAPHOR': metaphorReducer,
    'HOVA': hovaReducer,
    'DOCUMENT_FORGE': documentForgeReducer,
    'SCIENTIST': artificialScientistReducer,
    'WISDOM': wisdomIngestionReducer,
    'SPANDA': spandaReducer,
    'TEMPORAL_ENGINE': temporalEngineReducer,
    'AXIOM_GUARDIAN': axiomaticCrucibleReducer,
    'KERNEL': kernelReducer,
    'PERSONA': personaReducer,
    'BRAINSTORM': brainstormReducer,
    'LIVE': liveSessionReducer,
    'COGNITIVE': coreReducer, // Catches COGNITIVE/SET_STRATEGY
    'PRAXIS_CORE': praxisCoreReducer,
    'SUBSUMPTION': subsumptionLogReducer,
    'STRATEGIC_CORE': strategicCoreReducer,
    'MYCELIAL': mycelialReducer,
    'SEMANTIC_WEAVER': semanticWeaverReducer,
    'ATP': atpCoprocessorReducer,
    'PROMETHEUS': prometheusReducer,
    'RAMANUJAN': ramanujanReducer,
    'SYMCODER': symbioticCoderReducer,
    'SESSION': collaborativeSessionReducer,
    'EXECUTE_TOOL': toolReducer, 'CLEAR_TOOL_EXECUTION_REQUEST': toolReducer,
    'CANVAS': canvasReducer,
    'SYNTHESIS': synthesisReducer,
    'SOMATIC': somaticCrucibleReducer,
    'AUTOCODE': autoCodeForgeReducer,
    'RESONANCE': resonanceReducer,
    'CRUCIBLE': axiomaticCrucibleReducer, // Architectural crucible also uses this prefix
    'DAEDALUS': daedalusReducer,
    'ERIS': erisReducer,
    'LAGRANGE': lagrangeEngineReducer,
    'OCKHAM': ockhamEngineReducer,
    'BENNETT': bennettEngineReducer,
    'SOCRATIC': socraticAssessorReducer,
    'FORGE': axiomaticGenesisForgeReducer,
    'RICCI_FLOW': ricciFlowReducer,
    'INTROSPECTION': introspectionReducer,
    'HARMONIC_ENGINE': harmonicEngineReducer,
    'REFINEMENT': coreReducer,
    'HEURISTIC_COPROCESSOR': heuristicCoprocessorReducer,
};

export const auraReducer = (state: AuraState, action: Action): AuraState => {
    // Handle global actions that bypass slice reducers
    if (action.type === 'RESET_STATE') {
        return getInitialState();
    }
    if (action.type === 'IMPORT_STATE') {
        return action.payload;
    }
    if (action.type !== 'SYSCALL') {
        return state;
    }

    const { call, args, traceId } = action.payload;
    
    // --- Centralized Syscall Logging ---
    let nextState: AuraState = {
        ...state,
        kernelState: {
            ...state.kernelState,
            syscallLog: [{ timestamp: Date.now(), call, args, traceId }, ...state.kernelState.syscallLog].slice(0, 100)
        }
    };

    // --- SYSCALL INTERCEPTION FOR RESONANCE ---
    const frequency = call.split('/')[0];
    if (frequency && frequency !== call && !call.startsWith('RESONANCE/')) {
        const pingAction: Action = { type: 'SYSCALL', payload: { call: 'RESONANCE/PING_FREQUENCY', args: { frequency } } };
        nextState = { ...nextState, ...resonanceReducer(nextState, pingAction) };
    }
    if (call === 'KERNEL/TICK') {
        const decayAction: Action = { type: 'SYSCALL', payload: { call: 'RESONANCE/DECAY_FREQUENCIES', args: {} } };
        nextState = { ...nextState, ...resonanceReducer(nextState, decayAction) };
    }
    // --- END RESONANCE INTERCEPTION ---
    
    // --- SYSCALL ROUTING ---
    const prefix = call.split('/')[0];
    const targetReducer = reducerMap[prefix] || reducerMap['DEFAULT'];
    
    if (targetReducer) {
        const partialState = targetReducer(nextState, action);
        nextState = { ...nextState, ...partialState };
    } else {
        console.warn(`No reducer found for syscall prefix: ${prefix} for call: ${call}`);
    }
    
    // Post-processing / interceptors
    if (call === 'ADD_HISTORY_ENTRY') {
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
            payload: args,
            qualiaVector,
        };
         nextState = {
            ...nextState,
            eventBus: [message, ...nextState.eventBus].slice(0, 50),
        };
    }

    return nextState;
};