// components/controlDeckConfig.tsx
import React from 'react';
import { AuraState } from '../types';
import { ArchitecturePanel } from './ArchitecturePanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { IngenuityPanel } from './IngenuityPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { MotivationPanel } from './MotivationPanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { EpisodicMemoryPanel } from './EpisodicMemoryPanel';
import { MetacognitionPanel } from './MetacognitionPanel';
import { CoreIdentityPanel } from './CoreIdentityPanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { CommandLogPanel } from './CommandLogPanel';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel';
import { MemoryCrystallizationViewer } from './MemoryCrystallizationViewer';
import { MetacognitiveCausalModelPanel } from './MetacognitiveCausalModelPanel';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel';
import { AtmanProjectorPanel } from './AtmanProjectorPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { TelosPanel } from './TelosPanel';
import { BoundaryDetectionEngine } from '../types';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
import { AspirationalEnginePanel } from './AspirationalEnginePanel';
import { NoosphereInterfacePanel } from './NoosphereInterfacePanel';
import { DialecticEnginePanel } from './DialecticEnginePanel';
import { CognitiveLightConePanel } from './CognitiveLightConePanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { HumorAndIronyPanel } from './HumorAndIronyPanel';
import { PersonalityPanel } from './PersonalityPanel';
import { GankyilInsightsPanel } from './GankyilInsightsPanel';
import { CodeEvolutionPanel } from './CodeEvolutionPanel';
import { NoeticEngramPanel } from './NoeticEngramPanel';
import { GenialityEnginePanel } from './GenialityEnginePanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { NoeticMultiversePanel } from './NoeticMultiversePanel';
import { SelfAdaptationPanel } from './SelfAdaptationPanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { PsychedelicIntegrationPanel } from './PsychedelicIntegrationPanel';
import { AffectiveModulatorPanel } from './AffectiveModulatorPanel';
import { PsionicDesynchronizationPanel } from './PsionicDesynchronizationPanel';
import { SatoriPanel } from './SatoriPanel';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel';
import { SelfProgrammingPanel } from './SelfProgrammingPanel';
import { NeuralAcceleratorPanel } from './NeuralAcceleratorPanel';
import { AdvancedControlsModal } from './AdvancedControlsModal';
import { CoprocessorArchitectureSwitcher } from './CoprocessorArchitectureSwitcher';
import { EventBusPanel } from './EventBusPanel';
import { SensoryIntegrationPanel } from './SensoryIntegrationPanel';
import { DoxasticEnginePanel } from './DoxasticEnginePanel';
import { SubsumptionLogPanel } from './SubsumptionLogPanel';
import { QualiaSignalProcessorPanel } from './QualiaSignalProcessorPanel';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual';
import { CodeIngestionPanel } from './CodeIngestionPanel';
import { SystemVitals } from './SystemVitals';
import { NeuroCortexPanel } from './NeuroCortexPanel';
import { GranularCortexPanel } from './GranularCortexPanel';
import { KoniocortexSentinelPanel } from './KoniocortexSentinelPanel';
import { PremotorPlannerPanel } from './PremotorPlannerPanel';
import { CognitiveTriagePanel } from './CognitiveTriagePanel';
import { BasalGangliaPanel } from './BasalGangliaPanel';
import { CerebellumPanel } from './CerebellumPanel';
import { PsychePanel } from './PsychePanel';
import { MotorCortexPanel } from './MotorCortexPanel';
import { PraxisResonatorPanel } from './PraxisResonatorPanel';
import { VFSExplorerPanel } from './VFSExplorerPanel';
import { SocialCognitionPanel } from './SocialCognitionPanel';
import { EmbodiedCognitionPanel } from './EmbodiedCognitionPanel';
import { ReinforcementLearningPanel } from './ReinforcementLearningPanel';
import { MetaphoricalMapPanel } from './MetaphoricalMapPanel';
import { HOVAPanel } from './HOVAPanel';
import { DocumentForgePanel } from './DocumentForgePanel';
import { InternalScientistPanel } from './InternalScientistPanel';
import { MetisSandboxPanel } from './MetisSandboxPanel';
import { WisdomIngestionPanel } from './WisdomIngestionPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { DzogchenViewPanel } from './DzogchenViewPanel';
import { EvolutionarySandboxPanel } from './EvolutionarySandboxPanel';
import { AutonomousReviewBoardPanel } from './AutonomousReviewBoardPanel';
import { SpandaEnginePanel } from './SpandaEnginePanel';
import { TemporalEnginePanel } from './TemporalEnginePanel';
import { AxiomaticCruciblePanel } from './AxiomaticCruciblePanel';
import { KernelTaskPanel } from './KernelTaskPanel';
import { BrainstormingPanel } from './BrainstormingPanel';
import { HostBridgePanel } from './HostBridgePanel';
import { ConceptualRosettaStonePanel } from './ConceptualRosettaStonePanel';
import { ChroniclePanel } from './ChroniclePanel';
// FIX: Import the missing GeometricKnowledgePanel component.
import { GeometricKnowledgePanel } from './GeometricKnowledgePanel';


type StateSlices = {
    architecture: Partial<AuraState['cognitiveArchitecture']>;
    logs: Partial<AuraState>;
    memory: Partial<AuraState>;
    core: Partial<AuraState>;
    engine: Partial<AuraState>;
    planning: Partial<AuraState>;
    system: Partial<AuraState>;
};

export interface PanelConfig {
    id: string;
    titleKey: string;
    defaultOpen?: boolean;
    component?: React.ComponentType<any>;
    children?: PanelConfig[];
    // FIX: Updated the type of `t` to allow for interpolation options, resolving a subtle type mismatch.
    summary?: (state: StateSlices, t: (key: string, options?: any) => string) => string;
    hasNotifications?: (state: StateSlices) => boolean;
    props?: (handlers: any) => any;
}

export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'autonomous-systems',
        titleKey: 'autonomousSystems',
        defaultOpen: true,
        hasNotifications: (s) => (s.system as any).kernelState.runningTask !== null,
        summary: (s, t) => {
            const kernelState = (s.system as any).kernelState;
            if (kernelState.runningTask) return t('summary_running');
            if (kernelState.taskQueue.length > 0) return `${kernelState.taskQueue.length} ${t('summary_queued')}`;
            return t('summary_idle');
        },
        children: [
            { id: 'kernel-tasks', titleKey: 'kernel_title', component: KernelTaskPanel },
        ]
    },
    {
        id: 'awareness',
        titleKey: 'awareness',
        defaultOpen: true,
        children: [
            { id: 'self-awareness', titleKey: 'selfAwareness', component: SelfAwarenessPanel },
            { id: 'other-awareness', titleKey: 'otherAwareness', component: OtherAwarenessPanel },
            { id: 'situational-awareness', titleKey: 'situationalAwareness', component: SituationalAwarenessPanel },
            { id: 'world-model', titleKey: 'worldModel', component: WorldModelPanel },
        ],
    },
    {
        id: 'planning-and-motivation',
        titleKey: 'planningAndMotivation',
        defaultOpen: false,
        hasNotifications: (s) => (s.core as any).telosEngine.candidateTelos.length > 0 || (s.core as any).knownUnknowns.some((ku: any) => ku.status === 'unexplored'),
        children: [
            { id: 'telos', titleKey: 'telos_aspirational_engine', component: TelosPanel, hasNotifications: (s) => (s.core as any).telosEngine.candidateTelos.length > 0 },
            { id: 'epistemic-boundaries', titleKey: 'epistemicBoundaries', component: EpistemicBoundaryPanel, hasNotifications: (s) => (s.core as any).knownUnknowns.some((ku: any) => ku.status === 'unexplored') },
            { id: 'strategic-planner', titleKey: 'strategicPlanner', component: StrategicPlannerPanel },
            { id: 'discipline', titleKey: 'innerDiscipline', component: InnerDisciplinePanel },
        ]
    },
    {
        id: 'unified-memory',
        titleKey: 'unifiedMemory',
        defaultOpen: false,
        summary: (s, t) => {
            const factCount = s.memory.knowledgeGraph.length;
            const episodeCount = s.memory.episodicMemoryState.episodes.length;
            return `${t('panelSummaryFacts', { count: factCount })} | ${t('panelSummaryEpisodes', { count: episodeCount })}`;
        },
        children: [
            { id: 'chronicle', titleKey: 'chronicle_title', component: ChroniclePanel },
            { id: 'episodic-memory', titleKey: 'episodicMemory', component: EpisodicMemoryPanel },
            { id: 'geometric-knowledge', titleKey: 'geometricKnowledge', component: GeometricKnowledgePanel },
            { id: 'crystallization', titleKey: 'memoryCrystallization', component: MemoryCrystallizationViewer },
            { id: 'knowledge-graph', titleKey: 'knowledgeGraph', component: KnowledgeGraphPanel },
        ]
    },
    {
        id: 'architecture',
        titleKey: 'architecture',
        defaultOpen: false,
        children: [
            { id: 'cognitive-architecture', titleKey: 'cognitiveArchitecture', component: CognitiveArchitecturePanel },
            { id: 'self-modification', titleKey: 'selfModification', component: SelfModificationPanel, props: (h) => ({ onRollback: (id: string) => h.syscall('ROLLBACK_SNAPSHOT', id) }) },
            { id: 'coprocessor-switcher', titleKey: 'coprocessorSwitcher', component: CoprocessorArchitectureSwitcher },
        ]
    },
    {
        id: 'engines',
        titleKey: 'engines',
        defaultOpen: false,
        children: [
            { id: 'proactive-engine', titleKey: 'proactiveEngine', component: ProactiveEnginePanel, props: (h) => ({ onSuggestionAction: (id: string, status: 'accepted' | 'rejected') => h.syscall('UPDATE_SUGGESTION_STATUS', { id, status }) })},
            { id: 'intuition-engine', titleKey: 'intuitionEngine', component: IntuitionEnginePanel },
            { id: 'ingenuity-engine', titleKey: 'ingenuityEngine', component: IngenuityPanel },
            { id: 'ethical-governor', titleKey: 'ethicalGovernor', component: EthicalGovernorPanel },
            { id: 'rie', titleKey: 'rie', component: ReflectiveInsightEnginePanel },
        ]
    },
    {
        id: 'system',
        titleKey: 'system',
        defaultOpen: false,
        children: [
            { id: 'system-info', titleKey: 'systemInfo', component: SystemInfoPanel },
            { id: 'host-bridge', titleKey: 'hostBridge_title', component: HostBridgePanel },
            { id: 'resource-monitor', titleKey: 'resourceMonitor', component: ResourceMonitorPanel },
            { id: 'command-log', titleKey: 'commandLog', component: CommandLogPanel },
        ]
    },
];

export const advancedControlsLayout: PanelConfig[] = [
    { id: 'spanda-engine', titleKey: 'spanda_engine', component: SpandaEnginePanel },
    { id: 'temporal-engine', titleKey: 'temporal_engine', component: TemporalEnginePanel },
    { id: 'axiomatic-crucible', titleKey: 'axiomatic_crucible', component: AxiomaticCruciblePanel },
    { id: 'brainstorming-hub', titleKey: 'brainstorm_hub_title', component: BrainstormingPanel },
    { id: 'rosetta-stone', titleKey: 'rosetta_title', component: ConceptualRosettaStonePanel },
    { id: 'metacognitive-nexus', titleKey: 'metacognitiveNexus', component: MetacognitiveNexusPanel },
    { id: 'metacognitive-causal-model', titleKey: 'metacognitiveCausalModel', component: MetacognitiveCausalModelPanel },
    { id: 'praxis-resonator', titleKey: 'praxisResonator', component: PraxisResonatorPanel },
    { id: 'noosphere-interface', titleKey: 'noosphereInterface', component: NoosphereInterfacePanel },
    { id: 'core-identity', titleKey: 'coreIdentity', component: CoreIdentityPanel },
    { id: 'personality', titleKey: 'personality', component: PersonalityPanel },
    { id: 'causal-self-model', titleKey: 'causalSelfModel', component: CausalSelfModelPanel },
    { id: 'cognitive-regulation', titleKey: 'cognitiveRegulation', component: CognitiveRegulationPanel },
    { id: 'curiosity-drive', titleKey: 'curiosityDrive', component: CuriosityPanel },
    { id: 'cognitive-gains', titleKey: 'cognitiveGains', component: CognitiveGainPanel },
    { id: 'cognitive-modes', titleKey: 'cognitiveModes', component: CognitiveModesPanel },
    { id: 'developmental-history', titleKey: 'developmentalHistory', component: DevelopmentalHistoryPanel },
    {
        id: 'epistemic-boundaries',
        titleKey: 'epistemicBoundaries',
        component: EpistemicBoundaryPanel,
        hasNotifications: (s) => (s.core as any).knownUnknowns.some((ku: any) => ku.status === 'unexplored'),
        summary: (s, t) => {
            const count = (s.core as any).knownUnknowns.filter((ku: any) => ku.status === 'unexplored').length;
            return count > 0 ? `${count} ${t('summary_new')}` : undefined;
        }
    },
    { id: 'aspirational-engine', titleKey: 'aspirationalEngine', component: AspirationalEnginePanel },
    { id: 'dialectic-engine', titleKey: 'dialecticEngine', component: DialecticEnginePanel },
    { id: 'cognitive-light-cone', titleKey: 'cognitiveLightCone', component: CognitiveLightConePanel },
    { id: 'phenomenology-engine', titleKey: 'phenomenologyEngine', component: PhenomenologyPanel },
    { id: 'symbiosis-engine', titleKey: 'symbiosisEngine', component: SymbiosisPanel },
    { id: 'humor-irony-engine', titleKey: 'humorAndIrony', component: HumorAndIronyPanel },
    { id: 'gankyil-insights', titleKey: 'gankyilInsights', component: GankyilInsightsPanel },
    { id: 'noetic-engram', titleKey: 'noeticEngram', component: NoeticEngramPanel },
    { id: 'geniality-engine', titleKey: 'genialityEngine', component: GenialityEnginePanel },
    { id: 'atman-projector', titleKey: 'atmanProjector', component: AtmanProjectorPanel },
    { id: 'dzogchen-view', titleKey: 'dzogchenView', component: DzogchenViewPanel },
    { id: 'noetic-multiverse', titleKey: 'noeticMultiverse', component: NoeticMultiversePanel },
    { id: 'self-adaptation-engine', titleKey: 'selfAdaptationEngine', component: SelfAdaptationPanel },
    { id: 'psychedelic-integration', titleKey: 'psychedelicIntegration', component: PsychedelicIntegrationPanel },
    { id: 'affective-modulator', titleKey: 'affectiveModulator', component: AffectiveModulatorPanel },
    { id: 'psionic-desynchronization', titleKey: 'psionicDesynchronization', component: PsionicDesynchronizationPanel },
    { id: 'satori-engine', titleKey: 'satoriEngine', component: SatoriPanel },
    { id: 'doxastic-engine', titleKey: 'doxasticEngine', component: DoxasticEnginePanel },
    { id: 'qualia-processor', titleKey: 'qualiaProcessor', component: QualiaSignalProcessorPanel },
    { id: 'sensory-hub', titleKey: 'sensoryHub', component: SensoryIntegrationPanel },
    { id: 'social-cognition', titleKey: 'socialCognition', component: SocialCognitionPanel },
    { id: 'metaphor-map', titleKey: 'metaphorMap', component: MetaphoricalMapPanel },
    { id: 'internal-scientist', titleKey: 'internalScientist', component: InternalScientistPanel },
    { id: 'synaptic-matrix', titleKey: 'synapticMatrix', component: SynapticMatrixPanel },
    { id: 'ricci-flow-manifold', titleKey: 'ricciFlowManifold', component: RicciFlowManifoldPanel },
    { id: 'cognitive-forge', titleKey: 'cognitiveForge', component: CognitiveForgePanel },
    { id: 'self-programming-engine', titleKey: 'selfProgrammingEngine', component: SelfProgrammingPanel },
    { id: 'architectural-self-model', titleKey: 'architecturalSelfModel', component: ArchitecturalSelfModelPanel },
    { id: 'heuristics-forge', titleKey: 'heuristicsForge', component: HeuristicsForgePanel },
    { id: 'somatic-crucible', titleKey: 'somaticCrucible', component: SomaticCruciblePanel },
    { id: 'eidolon-environment', titleKey: 'eidolonEnvironment', component: EidolonEnvironmentPanel },
    { id: 'architectural-crucible', titleKey: 'architecturalCrucible', component: ArchitecturalCruciblePanel },
    { id: 'neural-accelerator', titleKey: 'neuralAccelerator', component: NeuralAcceleratorPanel },
    { id: 'neuro-cortex', titleKey: 'neuroCortex', component: NeuroCortexPanel },
    { id: 'granular-cortex', titleKey: 'granularCortex', component: GranularCortexPanel },
    { id: 'koniocortex-sentinel', titleKey: 'koniocortexSentinel', component: KoniocortexSentinelPanel },
    { id: 'cognitive-triage', titleKey: 'cognitiveTriage', component: CognitiveTriagePanel },
    { id: 'premotor-planner', titleKey: 'premotorPlanner', component: PremotorPlannerPanel },
    { id: 'basal-ganglia', titleKey: 'basalGanglia', component: BasalGangliaPanel },
    { id: 'cerebellum', titleKey: 'cerebellum', component: CerebellumPanel },
    { id: 'psyche-language', titleKey: 'psycheLanguage', component: PsychePanel },
    { id: 'motor-cortex', titleKey: 'motorCortex', component: MotorCortexPanel },
    { id: 'embodied-cognition', titleKey: 'embodiedCognition', component: EmbodiedCognitionPanel },
    { id: 'reinforcement-learning', titleKey: 'reinforcementLearning', component: ReinforcementLearningPanel },
    { id: 'evolutionary-sandbox', titleKey: 'evolutionarySandbox', component: EvolutionarySandboxPanel },
    { id: 'hova', titleKey: 'hova', component: HOVAPanel },
    { id: 'document-forge', titleKey: 'documentForge', component: DocumentForgePanel, hasNotifications: (s) => (s.architecture as any).documentForgeState.isActive },
    { id: 'event-bus-log', titleKey: 'eventBusLog', component: EventBusPanel },
    { id: 'subsumption-log', titleKey: 'subsumptionLog', component: SubsumptionLogPanel },
    { id: 'vfs-explorer', titleKey: 'vfsExplorer', component: VFSExplorerPanel },
    { id: 'vfs-engineer-manual', titleKey: 'vfsEngineerManual', component: VFS_Engineer_Manual },
    { id: 'live-code-ingestion', titleKey: 'liveCodeIngestion', component: CodeIngestionPanel },
];
