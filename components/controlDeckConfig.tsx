// components/controlDeckConfig.tsx
import React from 'react';

// Import all panel components
import { CoreIdentityPanel } from './CoreIdentityPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { IngenuityPanel } from './IngenuityPanel';
import { PerformanceLogPanel } from './PerformanceLogPanel';
import { CommandLogPanel } from './CommandLogPanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel';
import { PluginManagerPanel } from './PluginManagerPanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { VFSExplorerPanel } from './VFSExplorerPanel';
import { CodeIngestionPanel } from './CodeIngestionPanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel';
import { NeuralAcceleratorPanel } from './NeuralAcceleratorPanel';
import { TelosEnginePanel } from './TelosPanel';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
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
import { QualiaSignalProcessorPanel } from './QualiaSignalProcessorPanel';
import { SensoryIntegrationPanel } from './SensoryIntegrationPanel';
import { SocialCognitionPanel } from './SocialCognitionPanel';
import { MetaphoricalMapPanel } from './MetaphoricalMapPanel';
import { AtmanProjectorPanel } from './AtmanProjectorPanel';
import { TemporalEnginePanel } from './TemporalEnginePanel';
import { AxiomaticCruciblePanel } from './AxiomaticCruciblePanel';
import { KernelTaskPanel } from './KernelTaskPanel';
import { EventBusPanel } from './EventBusPanel';
import { CoprocessorArchitectureSwitcher } from './CoprocessorArchitectureSwitcher';
import { HostBridgePanel } from './HostBridgePanel';
import { NeuroCortexPanel } from './NeuroCortexPanel';
import { GranularCortexPanel } from './GranularCortexPanel';
import { KoniocortexSentinelPanel } from './KoniocortexSentinelPanel';
import { CognitiveTriagePanel } from './CognitiveTriagePanel';
import { PremotorPlannerPanel } from './PremotorPlannerPanel';
import { BasalGangliaPanel } from './BasalGangliaPanel';
import { CerebellumPanel } from './CerebellumPanel';
import { PsychePanel } from './PsychePanel';
import { MotorCortexPanel } from './MotorCortexPanel';
import { PraxisResonatorPanel } from './PraxisResonatorPanel';
import { EmbodiedCognitionPanel } from './EmbodiedCognitionPanel';
import { EvolutionarySandboxPanel } from './EvolutionarySandboxPanel';
import { HOVAPanel } from './HOVAPanel';
import { PraxisCorePanel } from './PraxisCorePanel';
import { SubsumptionLogPanel } from './SubsumptionLogPanel';
import { StrategicCorePanel } from './StrategicCorePanel';
import { MycelialNetworkPanel } from './MycelialNetworkPanel';
import { SemanticWeaverPanel } from './SemanticWeaverPanel';
import { AutonomousReviewBoardPanel } from './AutonomousReviewBoardPanel';
import { ATPCoprocessorPanel } from './ATP_CoprocessorPanel';
import { ProofLandscapeExplorer } from './ProofLandscapeExplorer';
import { PrometheusPanel } from './PrometheusPanel';
import { RamanujanEnginePanel } from './RamanujanEnginePanel';
import { ConceptualRosettaStonePanel } from './ConceptualRosettaStonePanel';
import { ChroniclePanel } from './ChroniclePanel';
import { SymbioticCoderPanel } from './SymbioticCoderPanel';
import { TypeScriptCompilerPanel } from './TypeScriptCompilerPanel';
import { GeometricToolsPanel } from './GeometricToolsPanel';
import { DataToolsPanel } from './DataToolsPanel';
import { SymbolicMathPanel } from './SymbolicMathPanel';
import { SelfDevelopmentPanel } from './SelfDevelopmentPanel';
import { SelfEngineeringPanel } from './SelfEngineeringPanel';
import { MetisSandboxPanel } from './MetisSandboxPanel';
import { HomeostaticPanel } from './HomeostaticPanel';
import { SynthesisPanel } from './SynthesisPanel';
import { 
    ComputerVisionPanel,
    DataSuitePanel,
    ModelRuntimePanel,
    CodeFormatterPanel,
    AdvancedVisualizationPanel,
    GameSandboxPanel,
    GeospatialPanel,
    SpeechSynthesisPanel 
} from './SDKPanels';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual';
import { PersonaManualPanel } from './PersonaManualPanel';
import { AutoCodeForgePanel } from './AutoCodeForgePanel';
import { SciFiAiCouncilPanel } from './SciFiAiCouncilPanel';
import { ResonanceFieldPanel } from './ResonanceFieldPanel';
import { DaedalusLabyrinthPanel } from './DaedalusLabyrinthPanel';
import { ErisEnginePanel } from './ErisEnginePanel';
import { LagrangeEnginePanel } from './LagrangeEnginePanel';
import { OckhamEnginePanel } from './OckhamEnginePanel';
import { BennettEnginePanel } from './BennettEnginePanel';
import { ArtificialScientistPanel } from './ArtificialScientistPanel';
import { SocraticAssessorPanel } from './SocraticAssessorPanel';
import { AxiomaticGenesisForgePanel } from './AxiomaticGenesisForgePanel';
import { MotivationPanel } from './MotivationPanel';
import { SDKStatusPanel } from './SDKStatusPanel';
import { SoftwareAgencyPanel } from './SoftwareAgencyPanel';
import { BusinessNetworkPanel } from './BusinessNetworkPanel';
import { MarketAnalyzerPanel } from './MarketAnalyzerPanel';
import { MortgageCalculatorPanel } from './MortgageCalculatorPanel';
import { CompsFinderPanel } from './CompsFinderPanel';
import { ListingGeneratorPanel } from './ListingGeneratorPanel';
import { InvestmentCalculatorPanel } from './InvestmentCalculatorPanel';
import { NeighborhoodExplorerPanel } from './NeighborhoodExplorerPanel';
import { AffordabilityCalculatorPanel } from './AffordabilityCalculatorPanel';
import { HomeBuyingGuidePanel } from './HomeBuyingGuidePanel';
import { IdeaCartographerPanel } from './IdeaCartographerPanel';
import { HeuristicCoprocessorPanel } from './HeuristicCoprocessorPanel';


import { UseAuraResult } from '../types';

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
            { id: 'sdkStatus', titleKey: 'sdk_status_panel_title', component: SDKStatusPanel },
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
            { id: 'noeticMultiverse', titleKey: 'noetic_multiverse_panel_title', component: NoeticMultiversePanel },
            { id: 'ideaCartographer', titleKey: 'idea_cartographer_title', component: IdeaCartographerPanel },
        ]
    },
    {
        id: 'autonomousRegulation',
        titleKey: 'autonomous_regulation_group_title',
        children: [
            { id: 'heuristicCoprocessors', titleKey: 'heuristic_coprocessor_panel_title', component: HeuristicCoprocessorPanel },
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
            { id: 'softwareAgencyPersonas', titleKey: 'software_agency_members_panel_title', component: SoftwareAgencyPanel },
            { id: 'autoCodeForge', titleKey: 'autocode_forge_panel_title', component: AutoCodeForgePanel,
            },
        ]
    },
     {
        id: 'business',
        titleKey: 'business_network_group_title',
        children: [
            { id: 'businessNetwork', titleKey: 'business_network_panel_title', component: BusinessNetworkPanel },
        ]
    },
    {
        id: 'real_estate_suite',
        titleKey: 'realEstateSuite_group',
        children: [
            { id: 'marketAnalyzer', titleKey: 'marketAnalyzer_panel_title', component: MarketAnalyzerPanel },
            { id: 'mortgageCalculator', titleKey: 'mortgageCalculator_panel_title', component: MortgageCalculatorPanel },
            { id: 'compsFinder', titleKey: 'compsFinder_panel_title', component: CompsFinderPanel },
            { id: 'listingGenerator', titleKey: 'listingGenerator_panel_title', component: ListingGeneratorPanel },
            { id: 'investmentCalculator', titleKey: 'investmentCalculator_panel_title', component: InvestmentCalculatorPanel },
            { id: 'neighborhoodExplorer', titleKey: 'neighborhoodExplorer_panel_title', component: NeighborhoodExplorerPanel },
            { id: 'affordabilityCalculator', titleKey: 'affordabilityCalculator_panel_title', component: AffordabilityCalculatorPanel },
            { id: 'homeBuyingGuide', titleKey: 'homeBuyingGuide_panel_title', component: HomeBuyingGuidePanel },
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
             { id: 'satori', titleKey: 'satori_panel_title', component: SatoriPanel },
             { id: 'ricciFlowManifold', titleKey: 'ricciFlow_panel_title', component: RicciFlowManifoldPanel },
             { id: 'axiomaticGenesisForge', titleKey: 'axiomatic_genesis_forge_panel_title', component: AxiomaticGenesisForgePanel },
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