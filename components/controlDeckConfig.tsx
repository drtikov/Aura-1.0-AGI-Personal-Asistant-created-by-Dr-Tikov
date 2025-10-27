// components/controlDeckConfig.tsx
import React from 'react';

// Import all panel components
import { CoreIdentityPanel } from './CoreIdentityPanel.tsx';
import { SelfAwarenessPanel } from './SelfAwarenessPanel.tsx';
import { WorldModelPanel } from './WorldModelPanel.tsx';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel.tsx';
import { OtherAwarenessPanel } from './OtherAwarenessPanel.tsx';
import { CuriosityPanel } from './CuriosityPanel.tsx';
import { CausalSelfModelPanel } from './CausalSelfModelPanel.tsx';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel.tsx';
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel.tsx';
import { StrategicPlannerPanel } from './StrategicPlannerPanel.tsx';
import { InnerDisciplinePanel } from './InnerDisciplinePanel.tsx';
import { ProactiveEnginePanel } from './ProactiveEnginePanel.tsx';
import { EthicalGovernorPanel } from './EthicalGovernorPanel.tsx';
import { IntuitionEnginePanel } from './IntuitionEnginePanel.tsx';
import { IngenuityPanel } from './IngenuityPanel.tsx';
import { PerformanceLogPanel } from './PerformanceLogPanel.tsx';
import { CommandLogPanel } from './CommandLogPanel.tsx';
import { CognitiveModesPanel } from './CognitiveModesPanel.tsx';
import { CognitiveGainPanel } from './CognitiveGainPanel.tsx';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel.tsx';
import { ResourceMonitorPanel } from './ResourceMonitorPanel.tsx';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel.tsx';
import { PluginManagerPanel } from './PluginManagerPanel.tsx';
import { SystemInfoPanel } from './SystemInfoPanel.tsx';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel.tsx';
import { SelfModificationPanel } from './SelfModificationPanel.tsx';
import { LimitationsPanel } from './LimitationsPanel.tsx';
import { VFSExplorerPanel } from './VFSExplorerPanel.tsx';
import { CodeIngestionPanel } from './CodeIngestionPanel.tsx';
import { HeuristicsForgePanel } from './HeuristicsForgePanel.tsx';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel.tsx';
import { CognitiveForgePanel } from './CognitiveForgePanel.tsx';
import { SomaticCruciblePanel } from './SomaticCruciblePanel.tsx';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel.tsx';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel.tsx';
import { SynapticMatrixPanel } from './SynapticMatrixPanel.tsx';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel.tsx';
import { NeuralAcceleratorPanel } from './NeuralAcceleratorPanel.tsx';
import { TelosEnginePanel } from './TelosPanel.tsx';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel.tsx';
import { NoosphereInterfacePanel } from './NoosphereInterfacePanel.tsx';
import { DialecticEnginePanel } from './DialecticEnginePanel.tsx';
import { CognitiveLightConePanel } from './CognitiveLightConePanel.tsx';
import { PhenomenologyPanel } from './PhenomenologyPanel.tsx';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel.tsx';
import { SymbiosisPanel } from './SymbiosisPanel.tsx';
import { HumorAndIronyPanel } from './HumorAndIronyPanel.tsx';
import { PersonalityPanel } from './PersonalityPanel.tsx';
import { GankyilInsightsPanel } from './GankyilInsightsPanel.tsx';
import { NoeticEngramPanel } from './NoeticEngramPanel.tsx';
import { GenialityEnginePanel } from './GenialityEnginePanel.tsx';
import { NoeticMultiversePanel } from './NoeticMultiversePanel.tsx';
import { SelfAdaptationPanel } from './SelfAdaptationPanel.tsx';
import { PsychedelicIntegrationPanel } from './PsychedelicIntegrationPanel.tsx';
import { AffectiveModulatorPanel } from './AffectiveModulatorPanel.tsx';
import { PsionicDesynchronizationPanel } from './PsionicDesynchronizationPanel.tsx';
import { SatoriPanel } from './SatoriPanel.tsx';
import { DoxasticEnginePanel } from './DoxasticEnginePanel.tsx';
import { QualiaSignalProcessorPanel } from './QualiaSignalProcessorPanel.tsx';
import { SensoryIntegrationPanel } from './SensoryIntegrationPanel.tsx';
import { SocialCognitionPanel } from './SocialCognitionPanel.tsx';
import { MetaphoricalMapPanel } from './MetaphoricalMapPanel.tsx';
import { AtmanProjectorPanel } from './AtmanProjectorPanel.tsx';
import { TemporalEnginePanel } from './TemporalEnginePanel.tsx';
import { AxiomaticCruciblePanel } from './AxiomaticCruciblePanel.tsx';
import { KernelTaskPanel } from './KernelTaskPanel.tsx';
import { EventBusPanel } from './EventBusPanel.tsx';
import { CoprocessorArchitectureSwitcher } from './CoprocessorArchitectureSwitcher.tsx';
import { HostBridgePanel } from './HostBridgePanel.tsx';
import { NeuroCortexPanel } from './NeuroCortexPanel.tsx';
import { GranularCortexPanel } from './GranularCortexPanel.tsx';
import { KoniocortexSentinelPanel } from './KoniocortexSentinelPanel.tsx';
import { CognitiveTriagePanel } from './CognitiveTriagePanel.tsx';
import { PremotorPlannerPanel } from './PremotorPlannerPanel.tsx';
import { BasalGangliaPanel } from './BasalGangliaPanel.tsx';
import { CerebellumPanel } from './CerebellumPanel.tsx';
import { PsychePanel } from './PsychePanel.tsx';
import { MotorCortexPanel } from './MotorCortexPanel.tsx';
import { PraxisResonatorPanel } from './PraxisResonatorPanel.tsx';
import { EmbodiedCognitionPanel } from './EmbodiedCognitionPanel.tsx';
import { EvolutionarySandboxPanel } from './EvolutionarySandboxPanel.tsx';
import { HOVAPanel } from './HOVAPanel.tsx';
import { PraxisCorePanel } from './PraxisCorePanel.tsx';
import { SubsumptionLogPanel } from './SubsumptionLogPanel.tsx';
import { StrategicCorePanel } from './StrategicCorePanel.tsx';
import { MycelialNetworkPanel } from './MycelialNetworkPanel.tsx';
import { SemanticWeaverPanel } from './SemanticWeaverPanel.tsx';
import { AutonomousReviewBoardPanel } from './AutonomousReviewBoardPanel.tsx';
import { ATPCoprocessorPanel } from './ATP_CoprocessorPanel.tsx';
import { ProofLandscapeExplorer } from './ProofLandscapeExplorer.tsx';
import { PrometheusPanel } from './PrometheusPanel.tsx';
import { RamanujanEnginePanel } from './RamanujanEnginePanel.tsx';
import { ConceptualRosettaStonePanel } from './ConceptualRosettaStonePanel.tsx';
import { ChroniclePanel } from './ChroniclePanel.tsx';
import { SymbioticCoderPanel } from './SymbioticCoderPanel.tsx';
import { TypeScriptCompilerPanel } from './TypeScriptCompilerPanel.tsx';
import { GeometricToolsPanel } from './GeometricToolsPanel.tsx';
import { DataToolsPanel } from './DataToolsPanel.tsx';
import { SymbolicMathPanel } from './SymbolicMathPanel.tsx';
import { SelfDevelopmentPanel } from './SelfDevelopmentPanel.tsx';
import { SelfEngineeringPanel } from './SelfEngineeringPanel.tsx';
import { MetisSandboxPanel } from './MetisSandboxPanel.tsx';
import { HomeostaticPanel } from './HomeostaticPanel.tsx';
import { SynthesisPanel } from './SynthesisPanel.tsx';
import { 
    ComputerVisionPanel,
    DataSuitePanel,
    ModelRuntimePanel,
    CodeFormatterPanel,
    AdvancedVisualizationPanel,
    GameSandboxPanel,
    GeospatialPanel,
    SpeechSynthesisPanel 
} from './SDKPanels.tsx';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual.tsx';
import { PersonaManualPanel } from './PersonaManualPanel.tsx';
import { AutoCodeForgePanel } from './AutoCodeForgePanel.tsx';
import { SciFiAiCouncilPanel } from './SciFiAiCouncilPanel.tsx';
import { ResonanceFieldPanel } from './ResonanceFieldPanel.tsx';
import { DaedalusLabyrinthPanel } from './DaedalusLabyrinthPanel.tsx';
import { ErisEnginePanel } from './ErisEnginePanel.tsx';
import { LagrangeEnginePanel } from './LagrangeEnginePanel.tsx';
import { OckhamEnginePanel } from './OckhamEnginePanel.tsx';
import { BennettEnginePanel } from './BennettEnginePanel.tsx';
import { ArtificialScientistPanel } from './ArtificialScientistPanel.tsx';
import { SocraticAssessorPanel } from './SocraticAssessorPanel.tsx';
import { AxiomaticGenesisForgePanel } from './AxiomaticGenesisForgePanel.tsx';
import { MotivationPanel } from './MotivationPanel.tsx';


import { UseAuraResult } from '../types.ts';

export interface PanelConfig {
    id: string;
    titleKey: string;
    component?: React.ComponentType<any>;
    props?: (handlers: UseAuraResult) => any;
    children?: PanelConfig[];
}

export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'self',
        titleKey: 'selfAwareness',
        children: [
            { id: 'coreIdentity', titleKey: 'coreIdentity', component: CoreIdentityPanel },
            { id: 'selfAwareness', titleKey: 'selfAwareness', component: SelfAwarenessPanel },
            { id: 'worldModel', titleKey: 'worldModel', component: WorldModelPanel },
            { id: 'rie', titleKey: 'rie', component: ReflectiveInsightEnginePanel },
            { id: 'cognitiveRegulation', titleKey: 'cognitiveRegulation', component: CognitiveRegulationPanel },
        ],
    },
    {
        id: 'user',
        titleKey: 'userAwareness',
        children: [
            { id: 'otherAwareness', titleKey: 'otherAwareness', component: OtherAwarenessPanel },
            { id: 'symbioticMotivation', titleKey: 'symbiotic_motivation_panel_title', component: MotivationPanel },
            { id: 'curiosity', titleKey: 'curiosity', component: CuriosityPanel },
            { id: 'causalSelfModel', titleKey: 'causalSelfModel', component: CausalSelfModelPanel },
            { id: 'devHistory', titleKey: 'devHistory', component: DevelopmentalHistoryPanel },
        ],
    },
    {
        id: 'memory',
        titleKey: 'unifiedMemory',
        component: UnifiedMemoryPanel,
    },
    {
        id: 'planning',
        titleKey: 'planningAndGoals',
        children: [
            { id: 'strategicPlanner', titleKey: 'strategicPlanner', component: StrategicPlannerPanel },
            { id: 'innerDiscipline', titleKey: 'innerDiscipline', component: InnerDisciplinePanel },
        ],
    },
    {
        id: 'engines',
        titleKey: 'cognitiveEngines',
        children: [
            { id: 'proactive', titleKey: 'proactive', component: ProactiveEnginePanel, props: (h) => ({ onSuggestionAction: h.handleUpdateSuggestionStatus }) },
            { id: 'ethicalGovernor', titleKey: 'ethicalGovernor', component: EthicalGovernorPanel },
            { id: 'intuition', titleKey: 'intuition', component: IntuitionEnginePanel },
            { id: 'ingenuity', titleKey: 'ingenuity', component: IngenuityPanel },
            { id: 'synthesis', titleKey: 'synthesis', component: SynthesisPanel },
        ],
    },
    {
        id: 'logs',
        titleKey: 'logsAndPerformance',
        children: [
            { id: 'perfLog', titleKey: 'perfLog', component: PerformanceLogPanel },
            { id: 'commandLog', titleKey: 'commandLog', component: CommandLogPanel },
            { id: 'cogModes', titleKey: 'cogModes', component: CognitiveModesPanel },
            { id: 'cogGain', titleKey: 'cogGain', component: CognitiveGainPanel },
        ],
    },
    {
        id: 'system',
        titleKey: 'systemInternals',
        children: [
            { id: 'resourceMonitor', titleKey: 'resourceMonitor', component: ResourceMonitorPanel },
            { id: 'homeostatic', titleKey: 'homeostatic', component: HomeostaticPanel },
            { id: 'kernelTasks', titleKey: 'kernel_panel_title', component: KernelTaskPanel },
            { id: 'metacognitiveNexus', titleKey: 'metacognitiveNexus', component: MetacognitiveNexusPanel },
            { id: 'pluginManager', titleKey: 'pluginManager', component: PluginManagerPanel },
            { id: 'systemInfo', titleKey: 'systemInfo', component: SystemInfoPanel },
        ],
    },
];

// NOTE: This is the original hierarchical structure. The AuraOSModal currently flattens this.
export const advancedControlsLayout: PanelConfig[] = [
    {
        id: 'evolution',
        titleKey: 'evolution_group_title',
        children: [
            { id: 'selfDevelopment', titleKey: 'self_development_panel_title', component: SelfDevelopmentPanel },
            { id: 'selfEngineering', titleKey: 'self_engineering_panel_title', component: SelfEngineeringPanel },
            { id: 'autonomousReviewBoard', titleKey: 'reviewBoard', component: AutonomousReviewBoardPanel },
            { id: 'metisSandbox', titleKey: 'metis_sandbox_title', component: MetisSandboxPanel },
            { id: 'hova', titleKey: 'hova_panel_title', component: HOVAPanel },
            { id: 'daedalus', titleKey: 'daedalus_panel_title', component: DaedalusLabyrinthPanel },
        ]
    },
    {
        id: 'scientificMethod',
        titleKey: 'scientific_method_group_title',
        children: [
            { id: 'artificialScientist', titleKey: 'artificial_scientist_panel_title', component: ArtificialScientistPanel },
            { id: 'socraticAssessor', titleKey: 'socratic_assessor_panel_title', component: SocraticAssessorPanel },
            { id: 'ockhamEngine', titleKey: 'ockham_engine_panel_title', component: OckhamEnginePanel },
            { id: 'bennettEngine', titleKey: 'bennett_engine_panel_title', component: BennettEnginePanel },
        ]
    },
    {
        id: 'softwareEngineering',
        titleKey: 'software_engineering_group_title',
        children: [
            { id: 'autoCodeForge', titleKey: 'autocode_forge_panel_title', component: AutoCodeForgePanel,
            },
        ]
    },
    {
        id: 'metaphysicalEngines',
        titleKey: 'metaphysical_engines_group_title',
        children: [
             { id: 'synapticMatrix', titleKey: 'synaptic_matrix_panel_title', component: SynapticMatrixPanel },
             { id: 'mycelialNetwork', titleKey: 'mycelial_network_panel_title', component: MycelialNetworkPanel },
             { id: 'semanticWeaver', titleKey: 'semantic_weaver_panel_title', component: SemanticWeaverPanel },
             { id: 'lagrangeEngine', titleKey: 'lagrange_engine_panel_title', component: LagrangeEnginePanel },
             { id: 'resonanceField', titleKey: 'resonanceField_panel_title', component: ResonanceFieldPanel },
             { id: 'architecturalCrucible', titleKey: 'archCrucible_panel_title', component: ArchitecturalCruciblePanel },
             { id: 'erisEngine', titleKey: 'eris_engine_panel_title', component: ErisEnginePanel },
             { id: 'axiomaticCrucible', titleKey: 'axiomatic_crucible_panel_title', component: AxiomaticCruciblePanel },
             { id: 'phenomenology', titleKey: 'phenomenology_panel_title', component: PhenomenologyPanel },
             { id: 'prometheus', titleKey: 'prometheus_panel_title', component: PrometheusPanel },
        ]
    },
    {
        id: 'computationalArchitecture',
        titleKey: 'computational_architecture_group_title',
        children: [
             { id: 'kernelTasks', titleKey: 'kernel_panel_title', component: KernelTaskPanel },
             { id: 'hostBridge', titleKey: 'host_bridge_panel_title', component: HostBridgePanel },
        ]
    },
     {
        id: 'interfaceLayer',
        titleKey: 'interface_layer_group_title',
        children: [
             { id: 'koniocortex', titleKey: 'koniocortex_panel_title', component: KoniocortexSentinelPanel },
             { id: 'motorCortex', titleKey: 'motor_cortex_panel_title', component: MotorCortexPanel },
        ]
    },
    {
        id: 'mathematicalResearch',
        titleKey: 'mathematical_research_group_title',
        children: [
            { id: 'ramanujanEngine', titleKey: 'ramanujan_engine_panel_title', component: RamanujanEnginePanel },
            { id: 'axiomaticGenesisForge', titleKey: 'axiomatic_genesis_forge_panel_title', component: AxiomaticGenesisForgePanel },
        ]
    },
    {
        id: 'guilds',
        titleKey: 'guilds_and_councils_group_title',
        children: [
            { id: 'sciFiAiCouncil', titleKey: 'sciFiAiCouncil_panel_title', component: SciFiAiCouncilPanel },
        ]
    }
];