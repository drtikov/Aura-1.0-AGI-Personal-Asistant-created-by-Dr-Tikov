import React, { useMemo } from 'react';
import { useAura } from './hooks';
import { ToastContainer, LeftColumnComponent, ControlDeckComponent } from './components';
import { 
    AuraDispatchContext, 
    CoreStateContext,
    MemoryStateContext,
    ArchitectureStateContext,
    PlanningStateContext,
    EngineStateContext,
    LogsStateContext,
    SystemStateContext
} from './context/AuraContext';
import { ModalProvider } from './context/ModalContext';

const AppContent = () => {
    const auraInterface = useAura();
    const { state, toasts, removeToast } = auraInterface;
    
    // Combine all state slices into one memoized object to simplify context providers
    const stateSlices = useMemo(() => ({
        core: { internalState: state.internalState, internalStateHistory: state.internalStateHistory, rieState: state.rieState, userModel: state.userModel, coreIdentity: state.coreIdentity, selfAwarenessState: state.selfAwarenessState, worldModelState: state.worldModelState, curiosityState: state.curiosityState, knownUnknowns: state.knownUnknowns, theme: state.theme, limitations: state.limitations, causalSelfModel: state.causalSelfModel, developmentalHistory: state.developmentalHistory },
        memory: { knowledgeGraph: state.knowledgeGraph, workingMemory: state.workingMemory, memoryNexus: state.memoryNexus },
        architecture: { cognitiveArchitecture: state.cognitiveArchitecture, architecturalProposals: state.architecturalProposals, systemSnapshots: state.systemSnapshots, modificationLog: state.modificationLog, cognitiveForgeState: state.cognitiveForgeState },
        planning: { goalTree: state.goalTree, activeStrategicGoalId: state.activeStrategicGoalId, disciplineState: state.disciplineState },
        engines: { proactiveEngineState: state.proactiveEngineState, ethicalGovernorState: state.ethicalGovernorState, intuitionEngineState: state.intuitionEngineState, intuitiveLeaps: state.intuitiveLeaps, ingenuityState: state.ingenuityState },
        logs: { history: state.history, performanceLogs: state.performanceLogs, commandLog: state.commandLog, cognitiveModeLog: state.cognitiveModeLog, cognitiveGainLog: state.cognitiveGainLog, cognitiveRegulationLog: state.cognitiveRegulationLog },
        system: { resourceMonitor: state.resourceMonitor, metacognitiveNexus: state.metacognitiveNexus, metacognitiveCausalModel: state.metacognitiveCausalModel },
        // Add new awareness states to the context value
        awareness: {
            phenomenologicalEngine: state.phenomenologicalEngine,
            situationalAwareness: state.situationalAwareness,
            symbioticState: state.symbioticState,
        }
    }), [state]);


    return (
        <AuraDispatchContext.Provider value={auraInterface}>
        <CoreStateContext.Provider value={{...stateSlices.core, ...stateSlices.awareness}}>
        <MemoryStateContext.Provider value={stateSlices.memory}>
        <ArchitectureStateContext.Provider value={stateSlices.architecture}>
        <PlanningStateContext.Provider value={stateSlices.planning}>
        <EngineStateContext.Provider value={stateSlices.engines}>
        <LogsStateContext.Provider value={stateSlices.logs}>
        <SystemStateContext.Provider value={stateSlices.system}>
            <div className="app-container">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <LeftColumnComponent />
                <ControlDeckComponent />
            </div>
        </SystemStateContext.Provider>
        </LogsStateContext.Provider>
        </EngineStateContext.Provider>
        </PlanningStateContext.Provider>
        </ArchitectureStateContext.Provider>
        </MemoryStateContext.Provider>
        </CoreStateContext.Provider>
        </AuraDispatchContext.Provider>
    );
};

export const App = () => {
    return (
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    );
};