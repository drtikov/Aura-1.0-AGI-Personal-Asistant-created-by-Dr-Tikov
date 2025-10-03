// context/AuraContext.tsx
import React, { createContext, useContext } from 'react';
import { useAura } from '../hooks/useAura';
import {
    AuraState,
    InternalState,
    UserModel,
    CoreIdentity,
    SelfAwarenessState,
    ReflectiveInsightEngineState,
    WorldModelState,
    CuriosityState,
    CausalSelfModel,
    DevelopmentalHistory,
    TelosEngine,
    BoundaryDetectionEngine,
    AspirationalEngine,
    NoosphereInterface,
    DialecticEngine,
    CognitiveLightCone,
    PhenomenologyEngine,
    SituationalAwareness,
    SymbioticState,
    HumorAndIronyState,
    PersonalityState,
    GankyilInsight,
    NoeticEngramState,
    GenialityEngineState,
    NoeticMultiverse,
    SelfAdaptationState,
    PsychedelicIntegrationState,
    AffectiveModulatorState,
    PsionicDesynchronizationState,
    SatoriState,
    DoxasticEngineState,
    QualiaSignalProcessorState,
    SensoryIntegration,
    SocialCognitionState,
    MetaphoricalMapState,
    KnowledgeFact,
    MemoryNexus,
    EpisodicMemoryState,
    MemoryConsolidationState,
    CognitiveArchitecture,
    SystemSnapshot,
    ModificationLogEntry,
    CognitiveForgeState,
    ArchitecturalSelfModel,
    HeuristicsForge,
    SomaticCrucible,
    EidolonEngine,
    ArchitecturalCrucibleState,
    SynapticMatrix,
    RicciFlowManifoldState,
    SelfProgrammingState,
    NeuralAcceleratorState,
    NeuroCortexState,
    GranularCortexState,
    KoniocortexSentinelState,
    CognitiveTriageState,
    PsycheState,
    MotorCortexState,
    PraxisResonatorState,
    OntogeneticArchitectState,
    EmbodiedCognitionState,
    EvolutionarySandboxState,
    HovaState,
    DocumentForgeState,
    Goal,
    GoalTree,
    DisciplineState,
    PremotorPlannerState,
    BasalGangliaState,
    CerebellumState,
    ProactiveEngineState,
    EthicalGovernorState,
    IntuitionEngineState,
    IntuitiveLeap,
    IngenuityState,
    HistoryEntry,
    PerformanceLogEntry,
    CommandLogEntry,
    CognitiveModeLogEntry,
    CognitiveGainLogEntry,
    CognitiveRegulationLogEntry,
    ResourceMonitor,
    MetacognitiveNexus,
    MetacognitiveCausalModel,
    PluginState,
    KernelState,
    IpcState,
    EventBusMessage,
    CognitiveOSState,
    AtmanProjector
} from '../types';

// --- Context for the main dispatcher ---
export const AuraDispatchContext = createContext<ReturnType<typeof useAura> | null>(null);
export const useAuraDispatch = () => {
    const context = useContext(AuraDispatchContext);
    if (!context) throw new Error('useAuraDispatch must be used within an AuraDispatchContext.Provider');
    return context;
};

// --- Context for granular state slices ---

// Helper to create context and hook
function createStateContext<T>(displayName: string) {
    const context = createContext<T | null>(null);
    context.displayName = displayName;
    const useHook = () => {
        const ctx = useContext(context);
        if (!ctx) throw new Error(`use${displayName} must be used within a ${displayName}.Provider`);
        return ctx;
    };
    return [context, useHook] as const;
}

// Core State
type CoreState = Pick<AuraState, 
    | 'internalState' | 'internalStateHistory' | 'rieState' | 'userModel' | 'coreIdentity' | 'selfAwarenessState' 
    | 'worldModelState' | 'curiosityState' | 'knownUnknowns' | 'theme' | 'language' | 'limitations' | 'causalSelfModel' 
    | 'developmentalHistory' | 'telosEngine' | 'boundaryDetectionEngine' | 'aspirationalEngine' | 'noosphereInterface' 
    | 'dialecticEngine' | 'cognitiveLightCone' | 'phenomenologicalEngine' | 'situationalAwareness' | 'symbioticState' 
    | 'humorAndIronyState' | 'personalityState' | 'gankyilInsights' | 'noeticEngramState' | 'genialityEngineState' 
    | 'noeticMultiverse' | 'selfAdaptationState' | 'psychedelicIntegrationState' | 'affectiveModulatorState' 
    | 'psionicDesynchronizationState' | 'satoriState' | 'doxasticEngineState' | 'qualiaSignalProcessorState' 
    | 'sensoryIntegration' | 'narrativeSummary' | 'socialCognitionState' | 'metaphoricalMapState' | 'atmanProjector'
    | 'internalScientistState' | 'metisSandboxState'
>;
export const [CoreStateContext, useCoreState] = createStateContext<CoreState>('CoreStateContext');

// Memory State
type MemoryState = Pick<AuraState, 'knowledgeGraph' | 'workingMemory' | 'memoryNexus' | 'episodicMemoryState' | 'memoryConsolidationState'>;
export const [MemoryStateContext, useMemoryState] = createStateContext<MemoryState>('MemoryStateContext');

// Architecture State
type ArchitectureState = Pick<AuraState, 
    | 'cognitiveArchitecture' | 'systemSnapshots' | 'modificationLog' | 'cognitiveForgeState' | 'architecturalSelfModel' 
    | 'heuristicsForge' | 'somaticCrucible' | 'eidolonEngine' | 'architecturalCrucibleState' | 'synapticMatrix' 
    | 'ricciFlowManifoldState' | 'selfProgrammingState' | 'neuralAcceleratorState' | 'neuroCortexState' 
    | 'granularCortexState' | 'koniocortexSentinelState' | 'cognitiveTriageState' | 'psycheState' | 'motorCortexState' 
    | 'praxisResonatorState' | 'ontogeneticArchitectState' | 'embodiedCognitionState' | 'evolutionarySandboxState'
    | 'hovaState' | 'documentForgeState'
>;
export const [ArchitectureStateContext, useArchitectureState] = createStateContext<ArchitectureState>('ArchitectureStateContext');

// Planning State
type PlanningState = Pick<AuraState, 'goalTree' | 'activeStrategicGoalId' | 'disciplineState' | 'premotorPlannerState' | 'basalGangliaState' | 'cerebellumState'>;
export const [PlanningStateContext, usePlanningState] = createStateContext<PlanningState>('PlanningStateContext');

// Engine State
type EngineState = Pick<AuraState, 'proactiveEngineState' | 'ethicalGovernorState' | 'intuitionEngineState' | 'intuitiveLeaps' | 'ingenuityState'>;
export const [EngineStateContext, useEngineState] = createStateContext<EngineState>('EngineStateContext');

// Logs State
type LogsState = Pick<AuraState, 'history' | 'performanceLogs' | 'commandLog' | 'cognitiveModeLog' | 'cognitiveGainLog' | 'cognitiveRegulationLog'>;
export const [LogsStateContext, useLogsState] = createStateContext<LogsState>('LogsStateContext');

// System State
type SystemState = Pick<AuraState, 'resourceMonitor' | 'metacognitiveNexus' | 'metacognitiveCausalModel' | 'pluginState' | 'kernelState' | 'ipcState' | 'eventBus' | 'cognitiveOSState'>;
export const [SystemStateContext, useSystemState] = createStateContext<SystemState>('SystemStateContext');

// Localization Context
interface Localization {
    t: (key: string, options?: any) => string;
    language: string;
}
export const [LocalizationContext, useLocalization] = createStateContext<Localization>('LocalizationContext');
