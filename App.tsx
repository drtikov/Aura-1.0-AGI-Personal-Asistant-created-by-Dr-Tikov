

import React, { useMemo, ReactNode } from 'react';
import { useAura } from './hooks';
import { ToastContainer, LeftColumnComponent, Header } from './components';
// FIX: Corrected import casing to resolve module casing conflict.
// The compiler error indicates a conflict between 'ControlDeckComponent' and 'controlDeckComponent'.
// The import path must match the filename's casing exactly.
import { ControlDeckComponent } from './components/ControlDeckComponent';
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
const StateProviders = ({ children }: { children?: ReactNode }) => {
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
        satoriState: state.satoriState,
        doxasticEngineState: state.doxasticEngineState,
        qualiaSignalProcessorState: state.qualiaSignalProcessorState,
        sensoryIntegration: state.sensoryIntegration,
        narrativeSummary: state.narrativeSummary,
        socialCognitionState: state.socialCognitionState,
    }), [
        state.internalState, state.internalStateHistory, state.rieState, state.userModel, 
        state.coreIdentity, state.selfAwarenessState, state.atmanProjector, state.worldModelState, state.curiosityState, 
        state.knownUnknowns, state.theme, state.language, state.limitations, state.causalSelfModel,
        state.developmentalHistory, state.telosEngine, state.boundaryDetectionEngine, state.aspirationalEngine,
        state.noosphereInterface, state.dialecticEngine, state.cognitiveLightCone, state.phenomenologicalEngine,
        state.situationalAwareness, state.symbioticState, state.humorAndIronyState, state.personalityState,
        state.gankyilInsights, state.noeticEngramState, state.genialityEngineState, state.noeticMultiverse,
        state.selfAdaptationState, state.psychedelicIntegrationState,
        state.affectiveModulatorState, state.psionicDesynchronizationState, state.satoriState,
        state.doxasticEngineState, state.qualiaSignalProcessorState, state.sensoryIntegration, state.narrativeSummary,
        state.socialCognitionState,
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
        selfProgrammingState: state.selfProgrammingState,
        neuralAcceleratorState: state.neuralAcceleratorState,
        neuroCortexState: state.neuroCortexState,
        granularCortexState: state.granularCortexState,
        koniocortexSentinelState: state.koniocortexSentinelState,
        cognitiveTriageState: state.cognitiveTriageState,
        psycheState: state.psycheState,
        motorCortexState: state.motorCortexState,
        praxisResonatorState: state.praxisResonatorState,
        ontogeneticArchitectState: state.ontogeneticArchitectState,
        embodiedCognitionState: state.embodiedCognitionState,
    }), [
        state.cognitiveArchitecture, state.systemSnapshots, state.modificationLog, state.cognitiveForgeState, 
        state.architecturalSelfModel, state.heuristicsForge, state.somaticCrucible, state.eidolonEngine,
        state.architecturalCrucibleState, state.synapticMatrix, state.ricciFlowManifoldState,
        state.selfProgrammingState,
        state.neuralAcceleratorState, state.neuroCortexState,
        state.granularCortexState, state.koniocortexSentinelState, state.cognitiveTriageState,
        state.psycheState, state.motorCortexState, state.praxisResonatorState,
        state.ontogeneticArchitectState, state.embodiedCognitionState,
    ]);

    const planningStateValue = useMemo(() => ({
        goalTree: state.goalTree,
        activeStrategicGoalId: state.activeStrategicGoalId,
        disciplineState: state.disciplineState,
        premotorPlannerState: state.premotorPlannerState,
        basalGangliaState: state.basalGangliaState,
        cerebellumState: state.cerebellumState,
    }), [
        state.goalTree,
        state.activeStrategicGoalId,
        state.disciplineState,
        state.premotorPlannerState,
        state.basalGangliaState,
        state.cerebellumState
    ]);

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
        metacognitiveCausalModel: state.metacognitiveCausalModel,
        pluginState: state.pluginState
    }), [state.resourceMonitor, state.metacognitiveNexus, state.metacognitiveCausalModel, state.pluginState]);


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
// It initializes the main \`useAura\` hook and sets up the top-level providers.
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