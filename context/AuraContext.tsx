// context/AuraContext.tsx
// FIX: Added import for React to resolve 'Cannot find namespace React' error.
import React, { createContext, useContext } from 'react';
// FIX: Corrected import path for useAura hook.
import { useAura } from '../hooks/useAura';
// FIX: Corrected import path for types.
import { AuraState } from '../types';

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
export const CoreStateContext = createContext<Pick<AuraState, 'internalState' | 'internalStateHistory' | 'rieState' | 'userModel' | 'coreIdentity' | 'selfAwarenessState' | 'atmanProjector' | 'worldModelState' | 'curiosityState' | 'knownUnknowns' | 'theme' | 'language' | 'limitations' | 'causalSelfModel' | 'phenomenologicalEngine' | 'situationalAwareness' | 'symbioticState' | 'developmentalHistory' | 'telosEngine' | 'boundaryDetectionEngine' | 'aspirationalEngine' | 'noosphereInterface' | 'dialecticEngine' | 'cognitiveLightCone' | 'humorAndIronyState' | 'personalityState' | 'gankyilInsights' | 'noeticEngramState' | 'genialityEngineState' | 'noeticMultiverse' | 'selfAdaptationState' | 'psychedelicIntegrationState' | 'affectiveModulatorState' | 'psionicDesynchronizationState' | 'satoriState' | 'sensoryIntegration' | 'narrativeSummary' | 'doxasticEngineState' | 'qualiaSignalProcessorState'> | null>(null);
export const MemoryStateContext = createContext<Pick<AuraState, 'knowledgeGraph' | 'workingMemory' | 'memoryNexus' | 'episodicMemoryState' | 'memoryConsolidationState'> | null>(null);
// FIX: Added 'selfProgrammingState' to the context type to make it available to consumers.
export const ArchitectureStateContext = createContext<Pick<AuraState, 'cognitiveArchitecture' | 'architecturalProposals' | 'systemSnapshots' | 'modificationLog' | 'cognitiveForgeState' | 'architecturalSelfModel' | 'heuristicsForge' | 'somaticCrucible' | 'eidolonEngine' | 'codeEvolutionProposals' | 'architecturalCrucibleState' | 'synapticMatrix' | 'ricciFlowManifoldState' | 'causalInferenceProposals' | 'selfProgrammingState' | 'neuralAcceleratorState'> | null>(null);
export const PlanningStateContext = createContext<Pick<AuraState, 'goalTree' | 'activeStrategicGoalId' | 'disciplineState'> | null>(null);
export const EngineStateContext = createContext<Pick<AuraState, 'proactiveEngineState' | 'ethicalGovernorState' | 'intuitionEngineState' | 'intuitiveLeaps' | 'ingenuityState'> | null>(null);
export const LogsStateContext = createContext<Pick<AuraState, 'history' | 'performanceLogs' | 'commandLog' | 'cognitiveModeLog' | 'cognitiveGainLog' | 'cognitiveRegulationLog'> | null>(null);
export const SystemStateContext = createContext<Pick<AuraState, 'resourceMonitor' | 'metacognitiveNexus' | 'metacognitiveCausalModel'> | null>(null);


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