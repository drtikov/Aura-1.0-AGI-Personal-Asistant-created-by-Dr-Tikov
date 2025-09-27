// context/AuraContext.tsx
import React, { createContext, useContext } from 'react';
import { useAura } from '../hooks/useAura';
import { AuraState, NeuroCortexState } from '../types';

// --- CONTEXT DEFINITIONS ---

// The dispatch context provides all actions and handlers. It's stable and won't cause re-renders.
type AuraDispatchers = ReturnType<typeof useAura>;
export const AuraDispatchContext = createContext<AuraDispatchers | null>(null);

// Localization Context
type LocalizationContextType = {
    language: string;
    t: (key: string, options?: any) => string;
};
export const LocalizationContext = createContext<LocalizationContextType | null>(null);


// State contexts are split into logical slices to prevent unnecessary re-renders.
// Core state is expanded to include the new awareness modules and evolution engines.
export const CoreStateContext = createContext<Pick<AuraState, 'internalState' | 'internalStateHistory' | 'rieState' | 'userModel' | 'coreIdentity' | 'selfAwarenessState' | 'atmanProjector' | 'worldModelState' | 'curiosityState' | 'knownUnknowns' | 'theme' | 'language' | 'limitations' | 'causalSelfModel' | 'phenomenologicalEngine' | 'situationalAwareness' | 'symbioticState' | 'developmentalHistory' | 'telosEngine' | 'boundaryDetectionEngine' | 'aspirationalEngine' | 'noosphereInterface' | 'dialecticEngine' | 'cognitiveLightCone' | 'humorAndIronyState' | 'personalityState' | 'gankyilInsights' | 'noeticEngramState' | 'genialityEngineState' | 'noeticMultiverse' | 'selfAdaptationState' | 'psychedelicIntegrationState' | 'affectiveModulatorState' | 'psionicDesynchronizationState' | 'satoriState' | 'sensoryIntegration' | 'narrativeSummary' | 'doxasticEngineState' | 'qualiaSignalProcessorState' | 'socialCognitionState'> | null>(null);
export const MemoryStateContext = createContext<Pick<AuraState, 'knowledgeGraph' | 'workingMemory' | 'memoryNexus' | 'episodicMemoryState' | 'memoryConsolidationState'> | null>(null);
export const ArchitectureStateContext = createContext<Pick<AuraState, 'cognitiveArchitecture' | 'systemSnapshots' | 'modificationLog' | 'cognitiveForgeState' | 'architecturalSelfModel' | 'heuristicsForge' | 'somaticCrucible' | 'eidolonEngine' | 'architecturalCrucibleState' | 'synapticMatrix' | 'ricciFlowManifoldState' | 'selfProgrammingState' | 'neuralAcceleratorState' | 'neuroCortexState' | 'granularCortexState' | 'koniocortexSentinelState' | 'cognitiveTriageState' | 'psycheState' | 'motorCortexState' | 'praxisResonatorState' | 'ontogeneticArchitectState' | 'embodiedCognitionState'> | null>(null);
export const PlanningStateContext = createContext<Pick<AuraState, 'goalTree' | 'activeStrategicGoalId' | 'disciplineState' | 'premotorPlannerState' | 'basalGangliaState' | 'cerebellumState'> | null>(null);
export const EngineStateContext = createContext<Pick<AuraState, 'proactiveEngineState' | 'ethicalGovernorState' | 'intuitionEngineState' | 'intuitiveLeaps' | 'ingenuityState'> | null>(null);
export const LogsStateContext = createContext<Pick<AuraState, 'history' | 'performanceLogs' | 'commandLog' | 'cognitiveModeLog' | 'cognitiveGainLog' | 'cognitiveRegulationLog'> | null>(null);
export const SystemStateContext = createContext<Pick<AuraState, 'resourceMonitor' | 'metacognitiveNexus' | 'metacognitiveCausalModel' | 'pluginState'> | null>(null);


// --- HELPER HOOKS ---

// Generic helper to avoid null checks in every component
function createUseContextHook<T>(context: React.Context<T | null>, contextName: string) {
    return () => {
        const ctx = useContext(context);
        if (ctx === null) {
            throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
        }
        return ctx;
    };
}

export const useAuraDispatch = createUseContextHook(AuraDispatchContext, 'AuraDispatch');
export const useLocalization = createUseContextHook(LocalizationContext, 'Localization');
export const useCoreState = createUseContextHook(CoreStateContext, 'CoreState');
export const useMemoryState = createUseContextHook(MemoryStateContext, 'MemoryState');
export const useArchitectureState = createUseContextHook(ArchitectureStateContext, 'ArchitectureState');
export const usePlanningState = createUseContextHook(PlanningStateContext, 'PlanningState');
export const useEngineState = createUseContextHook(EngineStateContext, 'EngineState');
export const useLogsState = createUseContextHook(LogsStateContext, 'LogsState');
export const useSystemState = createUseContextHook(SystemStateContext, 'SystemState');