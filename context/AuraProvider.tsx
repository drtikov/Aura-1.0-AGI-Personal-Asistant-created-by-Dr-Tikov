// context/AuraProvider.tsx
import React, { useMemo, ReactNode } from 'react';
import { useAura } from '../hooks/index.ts';
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
} from './AuraContext.tsx';
import { AuraState } from '../types.ts';

export const AuraProvider = ({ children }: { children?: ReactNode }) => {
    const auraInterface = useAura();
    const { state, t, language } = auraInterface;

    // Memoized state slices to prevent unnecessary re-renders
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
        metaphoricalMapState: state.metaphoricalMapState,
        internalScientistState: state.internalScientistState,
        metisSandboxState: state.metisSandboxState,
        spandaState: state.spandaState,
        brainstormState: state.brainstormState,
        liveSessionState: state.liveSessionState,
        proactiveUI: state.proactiveUI,
        strategicCoreState: state.strategicCoreState,
        mycelialState: state.mycelialState,
        semanticWeaverState: state.semanticWeaverState,
        modalRequest: state.modalRequest,
        uiCommandRequest: state.uiCommandRequest,
        prometheusState: state.prometheusState,
        collaborativeSessionState: state.collaborativeSessionState,
        symbioticCanvasState: state.symbioticCanvasState,
        logosState: state.logosState,
        erisEngineState: state.erisEngineState,
        lagrangeEngineState: state.lagrangeEngineState,
        artificialScientistState: state.artificialScientistState,
        bennettEngineState: state.bennettEngineState,
        ockhamEngineState: state.ockhamEngineState,
        socraticAssessorState: state.socraticAssessorState,
        axiomaticGenesisForgeState: state.axiomaticGenesisForgeState,
        cognitiveRefinementState: state.cognitiveRefinementState,
        // FIX: Removed the non-existent `cognitiveStrategy` property from this object to align with the corrected `CoreState` type.
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
        state.socialCognitionState, state.metaphoricalMapState,
        state.internalScientistState, state.metisSandboxState, state.spandaState, state.personaState, state.brainstormState,
        state.liveSessionState, state.proactiveUI, state.strategicCoreState, state.mycelialState, state.semanticWeaverState, state.modalRequest, state.uiCommandRequest,
        state.prometheusState, state.erisEngineState, state.collaborativeSessionState, state.symbioticCanvasState, state.logosState,
        state.lagrangeEngineState, state.artificialScientistState, state.bennettEngineState, state.ockhamEngineState, state.socraticAssessorState,
        state.axiomaticGenesisForgeState, state.cognitiveRefinementState,
    ]);

    const memoryStateValue = useMemo(() => ({
        knowledgeGraph: state.knowledgeGraph, 
        workingMemory: state.workingMemory, 
        memoryNexus: state.memoryNexus,
        episodicMemoryState: state.episodicMemoryState,
        memoryConsolidationState: state.memoryConsolidationState,
        mdnaSpace: state.mdnaSpace,
        conceptConnections: state.conceptConnections,
        chronicleState: state.chronicleState,
    }), [state.knowledgeGraph, state.workingMemory, state.memoryNexus, state.episodicMemoryState, state.memoryConsolidationState, state.mdnaSpace, state.conceptConnections, state.chronicleState]);

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
        evolutionarySandboxState: state.evolutionarySandboxState,
        hovaState: state.hovaState,
        documentForgeState: state.documentForgeState,
        wisdomIngestionState: state.wisdomIngestionState,
        axiomaticCrucibleState: state.axiomaticCrucibleState,
        atpCoprocessorState: state.atpCoprocessorState,
        praxisCoreState: state.praxisCoreState,
        daedalusLabyrinthState: state.daedalusLabyrinthState,
        harmonicEngineState: state.harmonicEngineState,
    }), [
        state.cognitiveArchitecture, state.systemSnapshots, state.modificationLog, state.cognitiveForgeState,
        state.architecturalSelfModel, state.heuristicsForge, state.somaticCrucible, state.eidolonEngine,
        state.architecturalCrucibleState, state.synapticMatrix, state.ricciFlowManifoldState,
        state.selfProgrammingState, state.neuralAcceleratorState, state.neuroCortexState, state.granularCortexState,
        state.koniocortexSentinelState, state.cognitiveTriageState, state.psycheState, state.motorCortexState,
        state.praxisResonatorState, state.ontogeneticArchitectState, state.embodiedCognitionState,
        state.evolutionarySandboxState, state.hovaState, state.documentForgeState, state.wisdomIngestionState,
        state.axiomaticCrucibleState, state.atpCoprocessorState, state.praxisCoreState, state.daedalusLabyrinthState, state.harmonicEngineState
    ]);

    const planningStateValue = useMemo(() => ({
        goalTree: state.goalTree, 
        activeStrategicGoalId: state.activeStrategicGoalId,
        disciplineState: state.disciplineState,
        premotorPlannerState: state.premotorPlannerState,
        basalGangliaState: state.basalGangliaState,
        cerebellumState: state.cerebellumState,
    }), [state.goalTree, state.activeStrategicGoalId, state.disciplineState, state.premotorPlannerState, state.basalGangliaState, state.cerebellumState]);

    const engineStateValue = useMemo(() => ({
        proactiveEngineState: state.proactiveEngineState, 
        ethicalGovernorState: state.ethicalGovernorState, 
        intuitionEngineState: state.intuitionEngineState,
        intuitiveLeaps: state.intuitiveLeaps,
        ingenuityState: state.ingenuityState,
    }), [state.proactiveEngineState, state.ethicalGovernorState, state.intuitionEngineState, state.intuitiveLeaps, state.ingenuityState]);

    const logsStateValue = useMemo(() => ({
        history: state.history, 
        performanceLogs: state.performanceLogs, 
        commandLog: state.commandLog, 
        cognitiveModeLog: state.cognitiveModeLog,
        cognitiveGainLog: state.cognitiveGainLog,
        cognitiveRegulationLog: state.cognitiveRegulationLog,
        subsumptionLogState: state.subsumptionLogState,
        polExecutionLog: state.polExecutionLog,
    }), [state.history, state.performanceLogs, state.commandLog, state.cognitiveModeLog, state.cognitiveGainLog, state.cognitiveRegulationLog, state.subsumptionLogState, state.polExecutionLog]);

    const systemStateValue = useMemo(() => ({
        resourceMonitor: state.resourceMonitor, 
        metacognitiveNexus: state.metacognitiveNexus, 
        metacognitiveCausalModel: state.metacognitiveCausalModel,
        pluginState: state.pluginState,
        kernelState: state.kernelState,
        ipcState: state.ipcState,
        eventBus: state.eventBus,
        temporalEngineState: state.temporalEngineState,
        autonomousReviewBoardState: state.autonomousReviewBoardState,
        // FIX: Added missing systemState to the provider value
        systemState: state.systemState,
    }), [state.resourceMonitor, state.metacognitiveNexus, state.metacognitiveCausalModel, state.pluginState, state.kernelState, state.ipcState, state.eventBus, state.temporalEngineState, state.autonomousReviewBoardState, state.systemState]);

    const localizationValue = useMemo(() => ({ t, language }), [t, language]);

    return (
        <AuraDispatchContext.Provider value={auraInterface}>
            <LocalizationContext.Provider value={localizationValue}>
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
            </LocalizationContext.Provider>
        </AuraDispatchContext.Provider>
    );
};