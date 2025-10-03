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
import { CognitiveOSPanel } from './CognitiveOSPanel';
import { InternalScientistPanel } from './InternalScientistPanel';
import { MetisSandboxPanel } from './MetisSandboxPanel';
import { WisdomIngestionPanel } from './WisdomIngestionPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { InboxPanel } from './InboxPanel';
import { DzogchenViewPanel } from './DzogchenViewPanel';
import { EvolutionarySandboxPanel } from './EvolutionarySandboxPanel';


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
    summary?: (state: StateSlices, t: (key: string) => string) => string;
    hasNotifications?: (state: StateSlices) => boolean;
    props?: (handlers: any) => any;
}

export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'inbox',
        titleKey: 'title_inbox',
        component: InboxPanel,
        defaultOpen: true,
        hasNotifications: (s) => (s.architecture as any).ontogeneticArchitectState.proposalQueue.some((p: any) => p.status === 'proposed' || p.status === 'evaluated'),
        summary: (s, t) => {
            const count = (s.architecture as any).ontogeneticArchitectState.proposalQueue.filter((p: any) => p.status === 'proposed' || p.status === 'evaluated').length;
            return count > 0 ? `${count} ${t('summary_new')}` : `0 ${t('summary_new')}`;
        }
    },
    {
        id: 'awareness',
        titleKey: 'title_awareness',
        defaultOpen: true,
        children: [
            { id: 'self-awareness', titleKey: 'title_selfAwareness', component: SelfAwarenessPanel },
            { id: 'other-awareness', titleKey: 'title_otherAwareness', component: OtherAwarenessPanel },
            { id: 'situational-awareness', titleKey: 'title_situationalAwareness', component: SituationalAwarenessPanel },
            { id: 'world-model', titleKey: 'title_worldModel', component: WorldModelPanel },
        ],
    },
    {
        id: 'planning-and-motivation',
        titleKey: 'title_planningAndMotivation',
        defaultOpen: false,
        children: [
            { id: 'telos', titleKey: 'title_telos', component: TelosPanel },
            { id: 'strategic-planner', titleKey: 'title_strategicPlanner', component: StrategicPlannerPanel },
            { id: 'discipline', titleKey: 'title_innerDiscipline', component: InnerDisciplinePanel },
        ]
    },
    {
        id: 'memory',
        titleKey: 'title_memory',
        defaultOpen: false,
        children: [
            { id: 'working-memory', titleKey: 'title_workingMemory', component: UnifiedMemoryPanel },
            { id: 'knowledge-graph', titleKey: 'title_knowledgeGraph', component: KnowledgeGraphPanel, props: (h) => ({ syscall: h.syscall })},
            { id: 'episodic-memory', titleKey: 'title_episodicMemory', component: EpisodicMemoryPanel },
            { id: 'memory-crystallization', titleKey: 'title_memoryCrystallization', component: MemoryCrystallizationViewer },
        ]
    },
    {
        id: 'architecture',
        titleKey: 'title_architecture',
        defaultOpen: false,
        children: [
            { id: 'cognitive-architecture', titleKey: 'title_cognitiveArchitecture', component: CognitiveArchitecturePanel },
            { id: 'self-modification', titleKey: 'title_selfModification', component: SelfModificationPanel, props: (h) => ({ onRollback: (id: string) => h.syscall('ROLLBACK_SNAPSHOT', id) }) },
            { id: 'coprocessor-switcher', titleKey: 'title_coprocessorSwitcher', component: CoprocessorArchitectureSwitcher },
        ]
    },
    {
        id: 'engines',
        titleKey: 'title_engines',
        defaultOpen: false,
        children: [
            { id: 'proactive-engine', titleKey: 'title_proactiveEngine', component: ProactiveEnginePanel, props: (h) => ({ onSuggestionAction: (id: string, status: 'accepted' | 'rejected') => h.syscall('UPDATE_SUGGESTION_STATUS', { id, status }) })},
            { id: 'intuition-engine', titleKey: 'title_intuitionEngine', component: IntuitionEnginePanel },
            { id: 'ingenuity-engine', titleKey: 'title_ingenuityEngine', component: IngenuityPanel },
            { id: 'ethical-governor', titleKey: 'title_ethicalGovernor', component: EthicalGovernorPanel },
            { id: 'rie', titleKey: 'title_rie', component: ReflectiveInsightEnginePanel },
        ]
    },
    {
        id: 'system',
        titleKey: 'title_system',
        defaultOpen: false,
        children: [
            { id: 'system-info', titleKey: 'title_systemInfo', component: SystemInfoPanel },
            { id: 'resource-monitor', titleKey: 'title_resourceMonitor', component: ResourceMonitorPanel },
            { id: 'command-log', titleKey: 'title_commandLog', component: CommandLogPanel },
        ]
    },
];

export const advancedControlsLayout: PanelConfig[] = [
    { id: 'core-identity', titleKey: 'title_coreIdentity', component: CoreIdentityPanel },
    { id: 'personality', titleKey: 'title_personality', component: PersonalityPanel },
    { id: 'causal-self-model', titleKey: 'title_causalSelfModel', component: CausalSelfModelPanel },
    { id: 'metacognitive-causal-model', titleKey: 'title_metacognitiveCausalModel', component: MetacognitiveCausalModelPanel },
    { id: 'cognitive-regulation', titleKey: 'title_cognitiveRegulation', component: CognitiveRegulationPanel },
    { id: 'metacognitive-nexus', titleKey: 'title_metacognitiveNexus', component: MetacognitiveNexusPanel },
    { id: 'curiosity-drive', titleKey: 'title_curiosityDrive', component: CuriosityPanel },
    { id: 'cognitive-gains', titleKey: 'title_cognitiveGains', component: CognitiveGainPanel },
    { id: 'cognitive-modes', titleKey: 'title_cognitiveModes', component: CognitiveModesPanel },
    { id: 'developmental-history', titleKey: 'title_developmentalHistory', component: DevelopmentalHistoryPanel },
    { id: 'epistemic-boundaries', titleKey: 'title_epistemicBoundaries', component: EpistemicBoundaryPanel },
    { id: 'aspirational-engine', titleKey: 'title_aspirationalEngine', component: AspirationalEnginePanel },
    { id: 'noosphere-interface', titleKey: 'title_noosphereInterface', component: NoosphereInterfacePanel },
    { id: 'dialectic-engine', titleKey: 'title_dialecticEngine', component: DialecticEnginePanel },
    { id: 'cognitive-light-cone', titleKey: 'title_cognitiveLightCone', component: CognitiveLightConePanel },
    { id: 'phenomenology-engine', titleKey: 'title_phenomenologyEngine', component: PhenomenologyPanel },
    { id: 'symbiosis-engine', titleKey: 'title_symbiosisEngine', component: SymbiosisPanel },
    { id: 'humor-irony-engine', titleKey: 'title_humorAndIrony', component: HumorAndIronyPanel },
    { id: 'gankyil-insights', titleKey: 'title_gankyilInsights', component: GankyilInsightsPanel },
    { id: 'noetic-engram', titleKey: 'title_noeticEngram', component: NoeticEngramPanel },
    { id: 'geniality-engine', titleKey: 'title_genialityEngine', component: GenialityEnginePanel },
    { id: 'atman-projector', titleKey: 'title_atmanProjector', component: AtmanProjectorPanel },
    { id: 'dzogchen-view', titleKey: 'title_dzogchenView', component: DzogchenViewPanel },
    { id: 'noetic-multiverse', titleKey: 'title_noeticMultiverse', component: NoeticMultiversePanel },
    { id: 'self-adaptation-engine', titleKey: 'title_selfAdaptationEngine', component: SelfAdaptationPanel },
    { id: 'psychedelic-integration', titleKey: 'title_psychedelicIntegration', component: PsychedelicIntegrationPanel },
    { id: 'affective-modulator', titleKey: 'title_affectiveModulator', component: AffectiveModulatorPanel },
    { id: 'psionic-desynchronization', titleKey: 'title_psionicDesynchronization', component: PsionicDesynchronizationPanel },
    { id: 'satori-engine', titleKey: 'title_satoriEngine', component: SatoriPanel },
    { id: 'doxastic-engine', titleKey: 'title_doxasticEngine', component: DoxasticEnginePanel },
    { id: 'qualia-processor', titleKey: 'title_qualiaProcessor', component: QualiaSignalProcessorPanel },
    { id: 'sensory-hub', titleKey: 'title_sensoryHub', component: SensoryIntegrationPanel },
    { id: 'social-cognition', titleKey: 'title_socialCognition', component: SocialCognitionPanel },
    { id: 'metaphor-map', titleKey: 'title_metaphorMap', component: MetaphoricalMapPanel },
    { id: 'cognitive-os', titleKey: 'title_cognitiveOS', component: CognitiveOSPanel },
    { id: 'internal-scientist', titleKey: 'title_internalScientist', component: InternalScientistPanel },
    { id: 'metis-sandbox', titleKey: 'title_metisSandbox', component: MetisSandboxPanel },
    { id: 'wisdom-ingestion', titleKey: 'title_wisdomIngestion', component: WisdomIngestionPanel },
    { id: 'synaptic-matrix', titleKey: 'title_synapticMatrix', component: SynapticMatrixPanel },
    { id: 'ricci-flow-manifold', titleKey: 'title_ricciFlowManifold', component: RicciFlowManifoldPanel },
    { id: 'cognitive-forge', titleKey: 'title_cognitiveForge', component: CognitiveForgePanel },
    { id: 'self-programming-engine', titleKey: 'title_selfProgrammingEngine', component: SelfProgrammingPanel },
    { id: 'architectural-self-model', titleKey: 'title_architecturalSelfModel', component: ArchitecturalSelfModelPanel },
    { id: 'heuristics-forge', titleKey: 'title_heuristicsForge', component: HeuristicsForgePanel },
    { id: 'somatic-crucible', titleKey: 'title_somaticCrucible', component: SomaticCruciblePanel },
    { id: 'eidolon-environment', titleKey: 'title_eidolonEnvironment', component: EidolonEnvironmentPanel },
    { id: 'architectural-crucible', titleKey: 'title_architecturalCrucible', component: ArchitecturalCruciblePanel },
    { id: 'neural-accelerator', titleKey: 'title_neuralAccelerator', component: NeuralAcceleratorPanel },
    { id: 'neuro-cortex', titleKey: 'title_neuroCortex', component: NeuroCortexPanel },
    { id: 'granular-cortex', titleKey: 'title_granularCortex', component: GranularCortexPanel },
    { id: 'koniocortex-sentinel', titleKey: 'title_koniocortexSentinel', component: KoniocortexSentinelPanel },
    { id: 'cognitive-triage', titleKey: 'title_cognitiveTriage', component: CognitiveTriagePanel },
    { id: 'premotor-planner', titleKey: 'title_premotorPlanner', component: PremotorPlannerPanel },
    { id: 'basal-ganglia', titleKey: 'title_basalGanglia', component: BasalGangliaPanel },
    { id: 'cerebellum', titleKey: 'title_cerebellum', component: CerebellumPanel },
    { id: 'psyche-language', titleKey: 'title_psycheLanguage', component: PsychePanel },
    { id: 'motor-cortex', titleKey: 'title_motorCortex', component: MotorCortexPanel },
    { id: 'praxis-resonator', titleKey: 'title_praxisResonator', component: PraxisResonatorPanel },
    { id: 'embodied-cognition', titleKey: 'title_embodiedCognition', component: EmbodiedCognitionPanel },
    { id: 'reinforcement-learning', titleKey: 'title_reinforcementLearning', component: ReinforcementLearningPanel },
    { id: 'evolutionary-sandbox', titleKey: 'title_evolutionarySandbox', component: EvolutionarySandboxPanel },
    { id: 'hova', titleKey: 'title_hova', component: HOVAPanel },
    { id: 'document-forge', titleKey: 'title_documentForge', component: DocumentForgePanel },
    { id: 'event-bus-log', titleKey: 'title_eventBusLog', component: EventBusPanel },
    { id: 'subsumption-log', titleKey: 'title_subsumptionLog', component: SubsumptionLogPanel },
    { id: 'vfs-explorer', titleKey: 'title_vfsExplorer', component: VFSExplorerPanel },
    { id: 'vfs-engineer-manual', titleKey: 'title_vfsEngineerManual', component: VFS_Engineer_Manual },
    { id: 'live-code-ingestion', titleKey: 'title_liveCodeIngestion', component: CodeIngestionPanel },
];
