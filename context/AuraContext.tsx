import { createContext, useContext } from 'react';
import { useAura } from '../hooks';
import { AuraState } from '../types';

// --- CONTEXT DEFINITIONS ---

// The dispatch context provides all actions and handlers. It's stable and won't cause re-renders.
type AuraDispatchers = Omit<ReturnType<typeof useAura>, 'state'>;
export const AuraDispatchContext = createContext<AuraDispatchers | null>(null);

// State contexts are split into logical slices to prevent unnecessary re-renders.
// Core state is expanded to include the new awareness modules.
export const CoreStateContext = createContext<Pick<AuraState, 'internalState' | 'internalStateHistory' | 'rieState' | 'userModel' | 'coreIdentity' | 'selfAwarenessState' | 'worldModelState' | 'curiosityState' | 'knownUnknowns' | 'theme' | 'limitations' | 'causalSelfModel' | 'phenomenologicalEngine' | 'situationalAwareness' | 'symbioticState' | 'developmentalHistory'> | null>(null);
export const MemoryStateContext = createContext<Pick<AuraState, 'knowledgeGraph' | 'workingMemory' | 'memoryNexus'> | null>(null);
export const ArchitectureStateContext = createContext<Pick<AuraState, 'cognitiveArchitecture' | 'architecturalProposals' | 'systemSnapshots' | 'modificationLog' | 'cognitiveForgeState'> | null>(null);
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
export const useCoreState = createUseContextHook(CoreStateContext, 'CoreState');
export const useMemoryState = createUseContextHook(MemoryStateContext, 'MemoryState');
export const useArchitectureState = createUseContextHook(ArchitectureStateContext, 'ArchitectureState');
export const usePlanningState = createUseContextHook(PlanningStateContext, 'PlanningState');
export const useEngineState = createUseContextHook(EngineStateContext, 'EngineState');
export const useLogsState = createUseContextHook(LogsStateContext, 'LogsState');
export const useSystemState = createUseContextHook(SystemStateContext, 'SystemState');