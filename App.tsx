import React, { useMemo, useCallback } from 'react';
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
    SystemStateContext,
    LocalizationContext
} from './context/AuraContext';
import { ModalProvider } from './context/ModalContext';

const AppContent = () => {
    const auraInterface = useAura();
    const { state, toasts, removeToast, t, language } = auraInterface;

    const localizationContextValue = useMemo(() => ({
        t,
        language,
    }), [t, language]);
    
    // Performance Optimization: Create memoized values for each state slice individually.
    // This ensures that a context provider's value only changes if its specific slice of state has changed,
    // preventing unnecessary re-renders of large parts of the component tree.

    const coreStateValue = useMemo(() => ({
        internalState: state.internalState, 
        internalStateHistory: state.internalStateHistory, 
        rieState: state.rieState, 
        userModel: state.userModel, 
        coreIdentity: state.coreIdentity, 
        selfAwarenessState: state.selfAwarenessState, 
        atmanProjector: state.atmanProjector,
        worldModelState: state.worldModelState, 
        curiosityState: state.curiosityState, 
        knownUnknowns: state.knownUnknowns, 
        theme: state.theme, 
        language: state.language,
        limitations: state.limitations, 
        causalSelfModel: state.causalSelfModel, 
        developmentalHistory: state.developmentalHistory,
        telosEngine: state.telosEngine,
        boundaryDetectionEngine: state.boundaryDetectionEngine,
        aspirationalEngine: state.aspirationalEngine,
        noosphereInterface: state.noosphereInterface,
        dialecticEngine: state.dialecticEngine,
        cognitiveLightCone: state.cognitiveLightCone,
        phenomenologicalEngine: state.phenomenologicalEngine,
        situationalAwareness: state.situationalAwareness,
        symbioticState: state.symbioticState,
        humorAndIronyState: state.humorAndIronyState,
        personalityState: state.personalityState,
        gankyilInsights: state.gankyilInsights,
        noeticEngramState: state.noeticEngramState,
        genialityEngineState: state.genialityEngineState,
        noeticMultiverse: state.noeticMultiverse,
    }), [
        state.internalState, state.internalStateHistory, state.rieState, state.userModel, 
        state.coreIdentity, state.selfAwarenessState, state.atmanProjector, state.worldModelState, state.curiosityState, 
        state.knownUnknowns, state.theme, state.language, state.limitations, state.causalSelfModel,
        state.developmentalHistory, state.telosEngine, state.boundaryDetectionEngine, state.aspirationalEngine,
        state.noosphereInterface, state.dialecticEngine, state.cognitiveLightCone, state.phenomenologicalEngine,
        state.situationalAwareness, state.symbioticState, state.humorAndIronyState, state.personalityState,
        state.gankyilInsights, state.noeticEngramState, state.genialityEngineState, state.noeticMultiverse
    ]);

    const memoryStateValue = useMemo(() => ({
        knowledgeGraph: state.knowledgeGraph, 
        workingMemory: state.workingMemory, 
        memoryNexus: state.memoryNexus,
        episodicMemoryState: state.episodicMemoryState,
        memoryConsolidationState: state.memoryConsolidationState,
    }), [state.knowledgeGraph, state.workingMemory, state.memoryNexus, state.episodicMemoryState, state.memoryConsolidationState]);

    const architectureStateValue = useMemo(() => ({
        cognitiveArchitecture: state.cognitiveArchitecture, 
        architecturalProposals: state.architecturalProposals, 
        codeEvolutionProposals: state.codeEvolutionProposals,
        systemSnapshots: state.systemSnapshots, 
        modificationLog: state.modificationLog, 
        cognitiveForgeState: state.cognitiveForgeState,
        architecturalSelfModel: state.architecturalSelfModel,
        heuristicsForge: state.heuristicsForge,
        somaticCrucible: state.somaticCrucible,
        eidolonEngine: state.eidolonEngine,
        architecturalCrucibleState: state.architecturalCrucibleState,
        synapticMatrix: state.synapticMatrix,
    }), [
        state.cognitiveArchitecture, state.architecturalProposals, state.codeEvolutionProposals,
        state.systemSnapshots, state.modificationLog, state.cognitiveForgeState, 
        state.architecturalSelfModel, state.heuristicsForge, state.somaticCrucible, state.eidolonEngine,
        state.architecturalCrucibleState, state.synapticMatrix
    ]);

    const planningStateValue = useMemo(() => ({
        goalTree: state.goalTree, 
        activeStrategicGoalId: state.activeStrategicGoalId, 
        disciplineState: state.disciplineState 
    }), [state.goalTree, state.activeStrategicGoalId, state.disciplineState]);

    const engineStateValue = useMemo(() => ({
        proactiveEngineState: state.proactiveEngineState, 
        ethicalGovernorState: state.ethicalGovernorState, 
        intuitionEngineState: state.intuitionEngineState, 
        intuitiveLeaps: state.intuitiveLeaps, 
        ingenuityState: state.ingenuityState 
    }), [
        state.proactiveEngineState, state.ethicalGovernorState, state.intuitionEngineState, 
        state.intuitiveLeaps, state.ingenuityState
    ]);

    const logsStateValue = useMemo(() => ({
        history: state.history, 
        performanceLogs: state.performanceLogs, 
        commandLog: state.commandLog, 
        cognitiveModeLog: state.cognitiveModeLog, 
        cognitiveGainLog: state.cognitiveGainLog, 
        cognitiveRegulationLog: state.cognitiveRegulationLog 
    }), [
        state.history, state.performanceLogs, state.commandLog, state.cognitiveModeLog, 
        state.cognitiveGainLog, state.cognitiveRegulationLog
    ]);

    const systemStateValue = useMemo(() => ({
        resourceMonitor: state.resourceMonitor, 
        metacognitiveNexus: state.metacognitiveNexus, 
        metacognitiveCausalModel: state.metacognitiveCausalModel 
    }), [state.resourceMonitor, state.metacognitiveNexus, state.metacognitiveCausalModel]);


    return (
        <LocalizationContext.Provider value={localizationContextValue}>
            <AuraDispatchContext.Provider value={auraInterface}>
            <CoreStateContext.Provider value={coreStateValue}>
            <MemoryStateContext.Provider value={memoryStateValue}>
            <ArchitectureStateContext.Provider value={architectureStateValue}>
            <PlanningStateContext.Provider value={planningStateValue}>
            <EngineStateContext.Provider value={engineStateValue}>
            <LogsStateContext.Provider value={logsStateValue}>
            <SystemStateContext.Provider value={systemStateValue}>
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
        </LocalizationContext.Provider>
    );
};

export const App = () => {
    return (
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    );
};