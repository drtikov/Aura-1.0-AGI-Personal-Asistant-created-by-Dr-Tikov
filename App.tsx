



import React, { useMemo, ReactNode } from 'react';
import { useAura } from './hooks/useAura';
import { ToastContainer, LeftColumnComponent, ControlDeckComponent, Header } from './components';
import { 
    AuraDispatchContext, 
    CoreStateContext,
    MemoryStateContext,
    ArchitectureStateContext,
    PlanningStateContext,
    EngineStateContext,
    LogsStateContext,
    SystemStateContext,
    LocalizationContext,
    useAuraDispatch
} from './context/AuraContext';
import { ModalProvider } from './context/ModalContext';

// This component renders the main UI layout and is guaranteed to be within all necessary contexts.
const MainLayout = () => {
    // We can now get toasts directly from the context.
    const { toasts, removeToast } = useAuraDispatch(); 
    return (
        <div className="app-wrapper">
            <Header />
            <div className="app-container">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <LeftColumnComponent />
                <ControlDeckComponent />
            </div>
        </div>
    );
};

// This component is responsible for setting up all the granular state context providers.
// It subscribes to the main state from AuraDispatchContext and splits it into slices.
// This prevents components from re-rendering due to changes in unrelated state slices.
const StateProviders = ({ children }: { children: ReactNode }) => {
    const { state } = useAuraDispatch();

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
        selfAdaptationState: state.selfAdaptationState,
        psychedelicIntegrationState: state.psychedelicIntegrationState, 
        affectiveModulatorState: state.affectiveModulatorState, 
        psionicDesynchronizationState: state.psionicDesynchronizationState,
        satoriState: state.satoriState
    }), [
        state.internalState, state.internalStateHistory, state.rieState, state.userModel, 
        state.coreIdentity, state.selfAwarenessState, state.atmanProjector, state.worldModelState, state.curiosityState, 
        state.knownUnknowns, state.theme, state.language, state.limitations, state.causalSelfModel,
        state.developmentalHistory, state.telosEngine, state.boundaryDetectionEngine, state.aspirationalEngine,
        state.noosphereInterface, state.dialecticEngine, state.cognitiveLightCone, state.phenomenologicalEngine,
        state.situationalAwareness, state.symbioticState, state.humorAndIronyState, state.personalityState,
        state.gankyilInsights, state.noeticEngramState, state.genialityEngineState, state.noeticMultiverse,
        state.selfAdaptationState, state.psychedelicIntegrationState,
        state.affectiveModulatorState, state.psionicDesynchronizationState, state.satoriState
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
        ricciFlowManifoldState: state.ricciFlowManifoldState,
        // FIX: Added missing 'selfProgrammingState' property to the object.
        selfProgrammingState: state.selfProgrammingState,
        causalInferenceProposals: state.causalInferenceProposals,
    }), [
        state.cognitiveArchitecture, state.architecturalProposals, state.codeEvolutionProposals,
        state.systemSnapshots, state.modificationLog, state.cognitiveForgeState, 
        state.architecturalSelfModel, state.heuristicsForge, state.somaticCrucible, state.eidolonEngine,
        state.architecturalCrucibleState, state.synapticMatrix, state.ricciFlowManifoldState,
        state.selfProgrammingState,
        state.causalInferenceProposals
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
        <CoreStateContext.Provider value={coreStateValue}>
            <MemoryStateContext.Provider value={memoryStateValue}>
            <ArchitectureStateContext.Provider value={architectureStateValue}>
            <PlanningStateContext.Provider value={planningStateValue}>
            <EngineStateContext.Provider value={engineStateValue}>
            <LogsStateContext.Provider value={logsStateValue}>
            <SystemStateContext.Provider value={systemStateValue}>
                {children}
            </SystemStateContext.Provider>
            </LogsStateContext.Provider>
            </EngineStateContext.Provider>
            </PlanningStateContext.Provider>
            </ArchitectureStateContext.Provider>
            </MemoryStateContext.Provider>
        </CoreStateContext.Provider>
    );
};

// The root component of the application.
// It initializes the main `useAura` hook and sets up the top-level providers.
// The provider order is critical: AuraDispatchContext must wrap ModalProvider.
export const App = () => {
    const auraInterface = useAura();
    const { t, language } = auraInterface;
    
    const localizationContextValue = useMemo(() => ({ t, language }), [t, language]);

    return (
        <LocalizationContext.Provider value={localizationContextValue}>
            <AuraDispatchContext.Provider value={auraInterface}>
                <StateProviders>
                    <ModalProvider>
                        <MainLayout />
                    </ModalProvider>
                </StateProviders>
            </AuraDispatchContext.Provider>
        </LocalizationContext.Provider>
    );
};