// components/controlDeckConfig.tsx
import React from 'react';
import { AuraState, UnifiedProposal } from '../types';
import {
    useAuraDispatch
} from '../context/AuraContext';

// Import all panel components
import { CommandLogPanel } from './CommandLogPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { IngenuityPanel } from './IngenuityPanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { CoreIdentityPanel } from './CoreIdentityPanel';
import { TelosPanel } from './TelosPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { NoosphereInterfacePanel } from './NoosphereInterfacePanel';
import { DialecticEnginePanel } from './DialecticEnginePanel';
import { CognitiveLightConePanel } from './CognitiveLightConePanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { HumorAndIronyPanel } from './HumorAndIronyPanel';
import { PersonalityPanel } from './PersonalityPanel';
import { GankyilInsightsPanel } from './GankyilInsightsPanel';
import { NoeticEngramPanel } from './NoeticEngramPanel';
import { GenialityEnginePanel } from './GenialityEnginePanel';
import { NoeticMultiversePanel } from './NoeticMultiversePanel';
import { SelfAdaptationPanel } from './SelfAdaptationPanel';
import { PsychedelicIntegrationPanel } from './PsychedelicIntegrationPanel';
import { AffectiveModulatorPanel } from './AffectiveModulatorPanel';
import { PsionicDesynchronizationPanel } from './PsionicDesynchronizationPanel';
import { SatoriPanel } from './SatoriPanel';
import { DoxasticEnginePanel } from './DoxasticEnginePanel';
import { MetaphoricalMapPanel } from './MetaphoricalMapPanel';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel';
import { SelfProgrammingPanel } from './SelfProgrammingPanel';
import { NeuralAcceleratorPanel } from './NeuralAcceleratorPanel';
import { NeuroCortexPanel } from './NeuroCortexPanel';
import { GranularCortexPanel } from './GranularCortexPanel';
import { KoniocortexSentinelPanel } from './KoniocortexSentinelPanel';
import { CognitiveTriagePanel } from './CognitiveTriagePanel';
import { PsychePanel } from './PsychePanel';
import { MotorCortexPanel } from './MotorCortexPanel';
import { PraxisResonatorPanel } from './PraxisResonatorPanel';
import { OntogeneticArchitectState } from '../types';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { MetacognitiveCausalModelPanel } from './MetacognitiveCausalModelPanel';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel';
import { PremotorPlannerPanel } from './PremotorPlannerPanel';
import { BasalGangliaPanel } from './BasalGangliaPanel';
import { CerebellumPanel } from './CerebellumPanel';
import { SocialCognitionPanel } from './SocialCognitionPanel';
import { EmbodiedCognitionPanel } from './EmbodiedCognitionPanel';
import { ReinforcementLearningPanel } from './ReinforcementLearningPanel';
import { HOVAPanel } from './HOVAPanel';
import { InternalScientistPanel } from './InternalScientistPanel';
import { MetisSandboxPanel } from './MetisSandboxPanel';
import { WisdomIngestionPanel } from './WisdomIngestionPanel';
import { SpandaEnginePanel } from './SpandaEnginePanel';
import { TemporalEnginePanel } from './TemporalEnginePanel';
import { AxiomaticCruciblePanel } from './AxiomaticCruciblePanel';
import { KernelTaskPanel } from './KernelTaskPanel';
import { BrainstormingPanel } from './BrainstormingPanel';
import { VFSExplorerPanel } from './VFSExplorerPanel';
import { PraxisCorePanel } from './PraxisCorePanel';
import { SubsumptionLogPanel } from './SubsumptionLogPanel';
import { StrategicCorePanel } from './StrategicCorePanel';
import { MycelialNetworkPanel } from './MycelialNetworkPanel';
import { SemanticWeaverPanel } from './SemanticWeaverPanel';
import { CoprocessorArchitectureSwitcher } from './CoprocessorArchitectureSwitcher';
import { EventBusPanel } from './EventBusPanel';
import { SensoryIntegrationPanel } from './SensoryIntegrationPanel';
import { HostBridgePanel } from './HostBridgePanel';
import { CodeIngestionPanel } from './CodeIngestionPanel';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual';
import { AtmanProjectorPanel } from './AtmanProjectorPanel';
import { DzogchenViewPanel } from './DzogchenViewPanel';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
import { ConceptualRosettaStonePanel } from './ConceptualRosettaStonePanel';
import { ChroniclePanel } from './ChroniclePanel';
import { AutonomousReviewBoardPanel } from './AutonomousReviewBoardPanel';
import { ProofLandscapeExplorer } from './ProofLandscapeExplorer';
import { ATPCoprocessorPanel } from './ATP_CoprocessorPanel';
import { PrometheusPanel } from './PrometheusPanel';
import { DocumentForgePanel } from './DocumentForgePanel';
// FIX: Imported missing QualiaSignalProcessorPanel.
import { QualiaSignalProcessorPanel } from './QualiaSignalProcessorPanel';
import { SystemVitals } from './SystemVitals';


export interface PanelConfig {
    id: string;
    titleKey: string;
    component?: React.ComponentType<any>;
    children?: PanelConfig[];
    defaultOpen?: boolean;
    summary?: (states: any, t: (key: string) => string) => string | undefined;
    hasNotifications?: (states: any) => boolean;
    props?: (handlers: any) => any;
}

export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'self',
        titleKey: 'selfAwareness',
        defaultOpen: true,
        children: [
            { id: 'atmanProjector', titleKey: 'atmanProjector', component: AtmanProjectorPanel },
            { id: 'dzogchenView', titleKey: 'dzogchenView', component: DzogchenViewPanel },
            { id: 'coreIdentity', titleKey: 'coreIdentity', component: CoreIdentityPanel },
            { id: 'selfAwareness', titleKey: 'selfAwareness', component: SelfAwarenessPanel },
            { id: 'causalSelfModel', titleKey: 'causalSelfModel', component: CausalSelfModelPanel },
            { id: 'rie', titleKey: 'reflectiveInsightEngine', component: ReflectiveInsightEnginePanel },
            { id: 'devHistory', titleKey: 'developmentalHistory', component: DevelopmentalHistoryPanel },
        ]
    },
    {
        id: 'user',
        titleKey: 'userAwareness',
        defaultOpen: false,
        children: [
            { id: 'otherAwareness', titleKey: 'userAwareness', component: OtherAwarenessPanel },
            { id: 'socialCognition', titleKey: 'socialCognition', component: SocialCognitionPanel },
            { id: 'symbiosis', titleKey: 'symbiosis', component: SymbiosisPanel },
            { id: 'humorAndIrony', titleKey: 'humorAndIrony', component: HumorAndIronyPanel },
            { id: 'personality', titleKey: 'personality', component: PersonalityPanel },
        ]
    },
    {
        id: 'memory',
        titleKey: 'unifiedMemory',
        defaultOpen: false,
        component: UnifiedMemoryPanel,
    },
    {
        id: 'planning',
        titleKey: 'planningAndGoals',
        defaultOpen: false,
        children: [
            { id: 'telos', titleKey: 'telosAndAspirations', component: TelosPanel },
            { id: 'strategicPlanner', titleKey: 'strategicPlanner', component: StrategicPlannerPanel },
            { id: 'innerDiscipline', titleKey: 'innerDiscipline', component: InnerDisciplinePanel },
            { id: 'limitations', titleKey: 'limitations', component: LimitationsPanel },
        ]
    },
    {
        id: 'engines',
        titleKey: 'cognitiveEngines',
        defaultOpen: false,
        children: [
            { id: 'curiosity', titleKey: 'curiosity', component: CuriosityPanel },
            { id: 'proactive', titleKey: 'proactiveEngine', component: ProactiveEnginePanel, props: (h: any) => ({ onSuggestionAction: (id: string, action: 'accepted' | 'rejected') => h.syscall('UPDATE_SUGGESTION_STATUS', { id, status: action }) }) },
            { id: 'ethical', titleKey: 'ethicalGovernor', component: EthicalGovernorPanel },
            { id: 'intuition', titleKey: 'intuitionEngine', component: IntuitionEnginePanel },
            { id: 'ingenuity', titleKey: 'ingenuityEngine', component: IngenuityPanel },
        ]
    },
    {
        id: 'logs',
        titleKey: 'logsAndPerformance',
        defaultOpen: false,
        children: [
            { id: 'cognitiveGain', titleKey: 'cognitiveGain', component: CognitiveGainPanel },
            { id: 'cognitiveModes', titleKey: 'cognitiveModes', component: CognitiveModesPanel },
            { id: 'commandLog', titleKey: 'commandLog', component: CommandLogPanel },
        ]
    },
     {
        id: 'system',
        titleKey: 'systemInternals',
        defaultOpen: false,
        children: [
            { id: 'systemInfo', titleKey: 'systemInformation', component: SystemInfoPanel },
            { id: 'systemVitals', titleKey: 'resourceMonitor', component: SystemVitals },
        ]
    },
];

export const advancedControlsLayout: PanelConfig[] = [
    { id: 'affectiveModulator', titleKey: 'affectiveModulator_title', component: AffectiveModulatorPanel },
    { id: 'architecturalCrucible', titleKey: 'architecturalCrucible', component: ArchitecturalCruciblePanel },
    { id: 'architecturalSelfModel', titleKey: 'architecturalSelfModel', component: ArchitecturalSelfModelPanel },
    { id: 'atpCoprocessor', titleKey: 'atp_coprocessor', component: ATPCoprocessorPanel },
    { id: 'autonomousReviewBoard', titleKey: 'autonomousReviewBoard', component: AutonomousReviewBoardPanel },
    { id: 'axiomaticCrucible', titleKey: 'axiomaticCrucible', component: AxiomaticCruciblePanel },
    { id: 'basalGanglia', titleKey: 'basalGanglia', component: BasalGangliaPanel },
    { id: 'brainstorming', titleKey: 'brainstorming', component: BrainstormingPanel },
    { id: 'cerebellum', titleKey: 'cerebellum', component: CerebellumPanel },
    { id: 'cognitiveArchitecture', titleKey: 'cognitiveArchitecture', component: CognitiveArchitecturePanel },
    { id: 'cognitiveForge', titleKey: 'cognitiveForge', component: CognitiveForgePanel },
    { id: 'cognitiveRegulation', titleKey: 'cognitiveRegulation', component: CognitiveRegulationPanel },
    { id: 'cognitiveTriage', titleKey: 'cognitiveTriage', component: CognitiveTriagePanel },
    { id: 'conceptualRosettaStone', titleKey: 'conceptualRosettaStone', component: ConceptualRosettaStonePanel },
    { id: 'coprocessorArchitecture', titleKey: 'coprocessorArchitecture', component: CoprocessorArchitectureSwitcher },
    { id: 'doxasticEngine', titleKey: 'doxasticEngine', component: DoxasticEnginePanel },
    { id: 'eidolonEnvironment', titleKey: 'eidolonEnvironment', component: EidolonEnvironmentPanel },
    { id: 'embodiedCognition', titleKey: 'embodiedCognition', component: EmbodiedCognitionPanel },
    { id: 'epistemicBoundary', titleKey: 'epistemicBoundary', component: EpistemicBoundaryPanel },
    { id: 'eventBus', titleKey: 'eventBus', component: EventBusPanel },
    { id: 'genialityEngine', titleKey: 'genialityEngine', component: GenialityEnginePanel },
    { id: 'granularCortex', titleKey: 'granularCortex', component: GranularCortexPanel },
    { id: 'heuristicsForge', titleKey: 'heuristicsForge', component: HeuristicsForgePanel },
    { id: 'hostBridge', titleKey: 'hostBridge', component: HostBridgePanel },
    { id: 'hova', titleKey: 'hova', component: HOVAPanel },
    { id: 'internalScientist', titleKey: 'internalScientist', component: InternalScientistPanel },
    { id: 'kernel', titleKey: 'kernel', component: KernelTaskPanel },
    { id: 'koniocortexSentinel', titleKey: 'koniocortexSentinel', component: KoniocortexSentinelPanel },
    { id: 'liveCodeIngestion', titleKey: 'liveCodeIngestion_title', component: CodeIngestionPanel },
    { id: 'metisSandbox', titleKey: 'metisSandbox', component: MetisSandboxPanel },
    { id: 'motorCortex', titleKey: 'motorCortex', component: MotorCortexPanel },
    { id: 'mycelialNetwork', titleKey: 'mycelialNetwork', component: MycelialNetworkPanel },
    { id: 'neuralAccelerator', titleKey: 'neuralAccelerator', component: NeuralAcceleratorPanel },
    { id: 'neuroCortex', titleKey: 'neuroCortex', component: NeuroCortexPanel },
    { id: 'noeticEngram', titleKey: 'noeticEngram', component: NoeticEngramPanel },
    { id: 'noeticMultiverse', titleKey: 'noeticMultiverse', component: NoeticMultiversePanel },
    { id: 'phenomenology', titleKey: 'phenomenology', component: PhenomenologyPanel },
    { id: 'praxisCore', titleKey: 'praxisCore', component: PraxisCorePanel },
    { id: 'praxisResonator', titleKey: 'praxisResonator', component: PraxisResonatorPanel },
    { id: 'premotorPlanner', titleKey: 'premotorPlanner', component: PremotorPlannerPanel },
    { id: 'prometheusEngine', titleKey: 'prometheusEngine', component: PrometheusPanel },
    { id: 'proofLandscape', titleKey: 'proofLandscape', component: ProofLandscapeExplorer },
    { id: 'psyche', titleKey: 'psyche', component: PsychePanel },
    { id: 'psychedelicIntegration', titleKey: 'psychedelicIntegration', component: PsychedelicIntegrationPanel },
    { id: 'psionicDesynchronization', titleKey: 'psionicDesynchronization', component: PsionicDesynchronizationPanel },
    { id: 'qualiaSignalProcessor', titleKey: 'qualiaSignalProcessor', component: QualiaSignalProcessorPanel },
    { id: 'ricciFlowManifold', titleKey: 'ricciFlowManifold', component: RicciFlowManifoldPanel },
    { id: 'satori', titleKey: 'satori', component: SatoriPanel },
    { id: 'selfAdaptation', titleKey: 'selfAdaptation', component: SelfAdaptationPanel },
    { id: 'selfModification', titleKey: 'selfModification', component: SelfModificationPanel, props: (h: any) => ({ onRollback: (id: string) => h.syscall('ROLLBACK_STATE', { snapshotId: id }) }) },
    { id: 'selfProgramming_vfs', titleKey: 'selfProgramming_vfs', component: VFSExplorerPanel },
    { id: 'semanticWeaver', titleKey: 'semanticWeaver', component: SemanticWeaverPanel },
    { id: 'sensoryIntegration', titleKey: 'sensoryIntegration', component: SensoryIntegrationPanel },
    { id: 'somaticCrucible', titleKey: 'somaticCrucible', component: SomaticCruciblePanel },
    { id: 'spandaEngine', titleKey: 'spandaEngine', component: SpandaEnginePanel },
    { id: 'strategicCore', titleKey: 'strategicCore', component: StrategicCorePanel },
    { id: 'synapticMatrix', titleKey: 'synapticMatrix', component: SynapticMatrixPanel },
    { id: 'temporalEngine', titleKey: 'temporalEngine', component: TemporalEnginePanel },
    { id: 'vfs_manual', titleKey: 'vfs_manual_title', component: VFS_Engineer_Manual },
    { id: 'wisdomIngestion', titleKey: 'wisdomIngestion', component: WisdomIngestionPanel },
];