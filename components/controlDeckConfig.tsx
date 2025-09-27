// components/controlDeckConfig.tsx
import React from 'react';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { CognitiveLightConePanel } from './CognitiveLightConePanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel';
import { CommandLogPanel } from './CommandLogPanel';
import { DzogchenViewPanel } from './DzogchenViewPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { DialecticEnginePanel } from './DialecticEnginePanel';
import { DoxasticEnginePanel } from './DoxasticEnginePanel';
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { EmbodiedCognitionPanel } from './EmbodiedCognitionPanel';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { GankyilInsightsPanel } from './GankyilInsightsPanel';
import { GenialityEnginePanel } from './GenialityEnginePanel';
import { GranularCortexPanel } from './GranularCortexPanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { HumorAndIronyPanel } from './HumorAndIronyPanel';
import { InboxPanel } from './InboxPanel';
import { IngenuityPanel } from './IngenuityPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { KoniocortexSentinelPanel } from './KoniocortexSentinelPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { MetacognitiveCausalModelPanel } from './MetacognitiveCausalModelPanel';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel';
import { MotorCortexPanel } from './MotorCortexPanel';
import { NeuralAcceleratorPanel } from './NeuralAcceleratorPanel';
import { NoosphereInterfacePanel } from './NoosphereInterfacePanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { PersonalityPanel } from './PersonalityPanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { PremotorPlannerPanel } from './PremotorPlannerPanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { PsychePanel } from './PsychePanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { SelfProgrammingPanel } from './SelfProgrammingPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { SocialCognitionPanel } from './SocialCognitionPanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { TelosPanel } from './TelosPanel';
import { UnifiedMemoryPanel } from './UnifiedMemoryPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { PluginManagerPanel } from './PluginManagerPanel';
// FIX: Added SelfProgrammingCandidate to imports.
import { AuraState, ProactiveSuggestion, GankyilInsight, CoprocessorArchitecture, UnifiedProposal, SynthesisCandidate, SelfProgrammingCandidate } from '../types';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { NoeticEngramPanel } from './NoeticEngramPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { NoeticMultiversePanel } from './NoeticMultiversePanel';
import { SelfAdaptationPanel } from './SelfAdaptationPanel';
import { PsychedelicIntegrationPanel } from './PsychedelicIntegrationPanel';
import { AffectiveModulatorPanel } from './AffectiveModulatorPanel';
import { PsionicDesynchronizationPanel } from './PsionicDesynchronizationPanel';
import { SatoriPanel } from './SatoriPanel';
import { RicciFlowManifoldPanel } from './RicciFlowManifoldPanel';
import { CoprocessorArchitectureSwitcher } from './CoprocessorArchitectureSwitcher';
import { EventBusPanel } from './EventBusPanel';
import { SensoryIntegrationPanel } from './SensoryIntegrationPanel';
import { SubsumptionLogPanel } from './SubsumptionLogPanel';
import { QualiaSignalProcessorPanel } from './QualiaSignalProcessorPanel';
import { VFS_Engineer_Manual } from './VFS_Engineer_Manual';
import { VFSExplorerPanel } from './VFSExplorerPanel';
import { CodeIngestionPanel } from './CodeIngestionPanel';
import { NeuroCortexPanel } from './NeuroCortexPanel';
import { BasalGangliaPanel } from './BasalGangliaPanel';
import { CerebellumPanel } from './CerebellumPanel';
import { PraxisResonatorPanel } from './PraxisResonatorPanel';

type ComponentProps = Record<string, any>;
type StateSlices = { architecture: any; logs: any; memory: any; core: any; engine: any; planning: any; system: any; };
type TFunction = (key: string, options?: any) => string;

export interface PanelConfig {
    id: string;
    titleKey: string;
    component?: React.ComponentType<any>;
    defaultOpen?: boolean;
    summary?: (state: StateSlices, t: TFunction) => string | undefined;
    hasNotifications?: (state: StateSlices) => boolean;
    props?: (handlers: { [key: string]: (...args: any[]) => void }) => ComponentProps;
    children?: PanelConfig[];
}

export const mainControlDeckLayout: PanelConfig[] = [
    {
        id: 'inbox',
        titleKey: 'title_inbox',
        component: InboxPanel,
        defaultOpen: true,
        summary: (state) => {
            const pendingProposals = state.architecture.ontogeneticArchitectState.proposalQueue.filter((p: UnifiedProposal) => p.status === 'proposed' || p.status === 'evaluated').length;
            return pendingProposals > 0 ? `${pendingProposals} Pending Review` : undefined;
        },
        hasNotifications: (state) => {
            return state.architecture.ontogeneticArchitectState.proposalQueue.some((p: UnifiedProposal) => p.status === 'proposed' || p.status === 'evaluated');
        },
    },
    {
        id: 'engines',
        titleKey: 'title_enginesGovernors',
        children: [
            { id: 'proactiveEngine', titleKey: 'title_proactiveEngine', component: ProactiveEnginePanel, props: (handlers) => ({ onSuggestionAction: handlers.handleUpdateSuggestionStatus }), hasNotifications: (state) => state.engine.proactiveEngineState.generatedSuggestions.some((s: ProactiveSuggestion) => s.status === 'suggested') },
            { id: 'ethicalGovernor', titleKey: 'title_ethicalGovernor', component: EthicalGovernorPanel },
            { id: 'intuitionEngine', titleKey: 'title_intuitionEngine', component: IntuitionEnginePanel, hasNotifications: (state) => state.engine.intuitiveLeaps.some((l: any) => l.status === 'unvalidated')},
            { id: 'ingenuityEngine', titleKey: 'title_ingenuityEngine', component: IngenuityPanel },
            { id: 'innerDiscipline', titleKey: 'title_innerDiscipline', component: InnerDisciplinePanel },
        ]
    },
    {
        id: 'memory',
        titleKey: 'title_unifiedMemory',
        component: UnifiedMemoryPanel,
        defaultOpen: true,
        summary: (state, t) => {
            const factCount = state.memory.knowledgeGraph.length;
            const episodeCount = state.memory.episodicMemoryState.episodes.length;
            return `${t('panelSummaryFacts', { count: factCount })} | ${t('panelSummaryEpisodes', { count: episodeCount })}`;
        }
    },
    {
        id: 'planning',
        titleKey: 'title_strategicPlanner',
        component: StrategicPlannerPanel,
        defaultOpen: true,
    },
    {
        id: 'architecture',
        titleKey: 'title_cognitiveArchitecture',
        children: [
            { id: 'cognitiveArchitecture', titleKey: 'title_cognitiveArchitecture', component: CognitiveArchitecturePanel },
            { id: 'selfModification', titleKey: 'title_selfModification', component: SelfModificationPanel, props: (handlers) => ({ onRollback: handlers.handleRollback })},
            { id: 'cognitiveForge', titleKey: 'title_cognitiveForge', component: CognitiveForgePanel, hasNotifications: (state) => state.architecture.cognitiveForgeState.synthesisCandidates.some((c: SynthesisCandidate) => c.status === 'proposed') },
        ]
    },
];

export const advancedControlsLayout: PanelConfig[] = [
    {
        id: 'self',
        titleKey: 'title_metacognitionSelf',
        children: [
            { id: 'selfAwareness', titleKey: 'title_selfAwareness', component: SelfAwarenessPanel },
            { id: 'otherAwareness', titleKey: 'title_otherAwareness', component: OtherAwarenessPanel },
            { id: 'causalSelfModel', titleKey: 'title_causalSelfModel', component: CausalSelfModelPanel },
            { id: 'worldModel', titleKey: 'title_worldModel', component: WorldModelPanel, hasNotifications: (state) => state.core.worldModelState.predictionError.magnitude > 0.5 },
            { id: 'curiosity', titleKey: 'title_curiosity', component: CuriosityPanel, hasNotifications: (state) => !!state.core.curiosityState.activeInquiry },
            { id: 'limitations', titleKey: 'title_limitations', component: LimitationsPanel },
            { id: 'reflectiveInsightEngine', titleKey: 'title_reflectiveInsightEngine', component: ReflectiveInsightEnginePanel },
        ]
    },
    {
        id: 'system',
        titleKey: 'title_userModelSystem',
        children: [
            { id: 'symbiosis', titleKey: 'title_symbiosisModel', component: SymbiosisPanel },
            { id: 'resourceMonitor', titleKey: 'title_resourceMonitor', component: ResourceMonitorPanel },
            { id: 'systemInfo', titleKey: 'title_systemInfo', component: SystemInfoPanel },
        ]
    },
    {
        id: 'logs',
        titleKey: 'title_logs',
        children: [
            { id: 'commandLog', titleKey: 'title_commandLog', component: CommandLogPanel },
            { id: 'cognitiveModes', titleKey: 'title_cognitiveModes', component: CognitiveModesPanel },
            { id: 'cognitiveGain', titleKey: 'title_cognitiveGainLog', component: CognitiveGainPanel },
        ]
    },
    {
        id: 'metacognition',
        titleKey: 'title_metacognitiveNexus',
        component: MetacognitiveNexusPanel,
        hasNotifications: (state) => state.system.metacognitiveNexus.selfTuningDirectives.some((d: any) => d.status === 'proposed')
    },
    {
        id: 'metacognitiveCausalModel',
        titleKey: 'title_metacognitiveCausalModel',
        component: MetacognitiveCausalModelPanel,
    },
    {
        id: 'cognitiveRegulationLog',
        titleKey: 'title_cognitiveRegulationLog',
        component: CognitiveRegulationPanel,
    },
    { id: 'developmentalHistory', titleKey: 'title_developmentalHistory', component: DevelopmentalHistoryPanel },
    {
        id: 'psych-substrate',
        titleKey: 'title_psychometricSubstrate',
        children: [
            { id: 'personality', titleKey: 'title_personality', component: PersonalityPanel },
            { id: 'humorAndIrony', titleKey: 'title_humorAndIrony', component: HumorAndIronyPanel },
            { id: 'phenomenology', titleKey: 'title_phenomenology', component: PhenomenologyPanel },
            { id: 'situationalAwareness', titleKey: 'title_situationalAwareness', component: SituationalAwarenessPanel },
        ]
    },
    {
        id: 'intersubjective-evo',
        titleKey: 'title_intersubjectiveEvolution',
        children: [
            { id: 'noosphere', titleKey: 'title_noosphereInterface', component: NoosphereInterfacePanel },
            { id: 'dialectic', titleKey: 'title_dialecticEngine', component: DialecticEnginePanel, hasNotifications: (state) => state.core.dialecticEngine.activeDialectics.some((d: any) => !d.synthesis) }
        ]
    },
    {
        id: 'cognitive-expansion',
        titleKey: 'title_cognitiveExpansion',
        children: [
            { id: 'socialCognition', titleKey: 'title_socialCognition', component: SocialCognitionPanel },
            { id: 'embodiedCognition', titleKey: 'title_embodiedCognition', component: EmbodiedCognitionPanel },
        ]
    },
    {
        id: 'embodied-sim',
        titleKey: 'title_embodiedSimulation',
        children: [
            { id: 'eidolon', titleKey: 'title_eidolonEnvironment', component: EidolonEnvironmentPanel },
            { id: 'somaticCrucible', titleKey: 'title_somaticCrucible', component: SomaticCruciblePanel, hasNotifications: (state) => state.architecture.somaticCrucible.possibleFutureSelves.some((pfs: any) => pfs.status === 'validated') }
        ]
    },
     {
        id: 'agi-evo',
        titleKey: 'title_agiEvolution',
        children: [
            { id: 'telos', titleKey: 'title_telos', component: TelosPanel },
            { id: 'epistemicBoundaries', titleKey: 'title_epistemicBoundaries', component: EpistemicBoundaryPanel },
            { id: 'architecturalSelfModel', titleKey: 'title_architecturalSelfModel', component: ArchitecturalSelfModelPanel },
            { id: 'heuristicsForge', titleKey: 'title_heuristicsForge', component: HeuristicsForgePanel },
            { id: 'synapticMatrix', titleKey: 'title_synapticMatrix', component: SynapticMatrixPanel, hasNotifications: (state) => state.architecture.synapticMatrix.intuitiveAlerts.length > 0 || state.architecture.synapticMatrix.isAdapting },
            { id: 'ricciFlow', titleKey: 'title_ricciFlowManifold', component: RicciFlowManifoldPanel },
            { 
                id: 'selfProgramming', 
                titleKey: 'title_selfProgramming', 
                component: SelfProgrammingPanel, 
                hasNotifications: (state) => 
                    state.architecture.ontogeneticArchitectState.proposalQueue.some((p: UnifiedProposal) => 
                        (p.proposalType === 'self_programming_create' || p.proposalType === 'self_programming_modify') && 
                        (p.status === 'evaluated' || p.status === 'simulation_failed')
                    )
            },
            { id: 'doxasticEngine', titleKey: 'title_doxasticEngine', component: DoxasticEnginePanel, hasNotifications: (state) => state.core.doxasticEngineState.hypotheses.some((h: any) => h.status === 'untested') },
            { id: 'pluginManager', titleKey: 'title_pluginManager', component: PluginManagerPanel },
        ]
    },
    {
        id: 'frontier',
        titleKey: 'title_cognitiveFrontier',
        children: [
            { id: 'gankyil', titleKey: 'title_gankyilInsights', component: GankyilInsightsPanel, hasNotifications: (state) => state.core.gankyilInsights.insights.some((i: GankyilInsight) => !i.isProcessedForEvolution) },
            { id: 'geniality', titleKey: 'title_genialityEngine', component: GenialityEnginePanel },
            { id: 'crucible', titleKey: 'title_architecturalCrucible', component: ArchitecturalCruciblePanel },
            { id: 'cognitiveLightCone', titleKey: 'title_cognitiveLightCone', component: CognitiveLightConePanel },
            { id: 'noeticMultiverse', titleKey: 'title_noeticMultiverse', component: NoeticMultiversePanel },
        ]
    },
    {
        id: 'sharing',
        titleKey: 'title_symbiosisSharing',
        children: [
             { id: 'noeticEngram', titleKey: 'title_noeticEngram', component: NoeticEngramPanel, hasNotifications: (state) => state.core.noeticEngramState.status === 'ready' },
        ]
    },
    {
        id: 'transcendent',
        titleKey: 'title_transcendentStates',
        children: [
             { id: 'dzogchen', titleKey: 'title_dzogchenView', component: DzogchenViewPanel },
             { id: 'satori', titleKey: 'title_satori', component: SatoriPanel, hasNotifications: (state) => state.core.satoriState.isActive },
             { id: 'psionic', titleKey: 'title_psionicDesynchronization', component: PsionicDesynchronizationPanel, hasNotifications: (state) => state.core.psionicDesynchronizationState.isActive },
             { id: 'psychedelic', titleKey: 'title_psychedelicIntegration', component: PsychedelicIntegrationPanel, hasNotifications: (state) => state.core.psychedelicIntegrationState.isActive },
        ]
    },
    {
        id: 'adaptation',
        titleKey: 'title_selfAdaptation',
        children: [
            { id: 'selfAdaptation', titleKey: 'title_selfAdaptation', component: SelfAdaptationPanel },
            { id: 'affectiveModulator', titleKey: 'title_affectiveModulator', component: AffectiveModulatorPanel },
        ]
    },
    {
        id: 'coprocessor-arch',
        titleKey: 'title_coprocessorArchitecture',
        component: CoprocessorArchitectureSwitcher
    },
    {
        id: 'perception-action',
        titleKey: 'title_perceptionAction',
        children: [
            { id: 'koniocortex', titleKey: 'title_koniocortexSentinel', component: KoniocortexSentinelPanel },
            { id: 'granularcortex', titleKey: 'title_granularCortex', component: GranularCortexPanel },
            { id: 'premotor', titleKey: 'title_premotorPlanner', component: PremotorPlannerPanel },
            { id: 'basalganglia', titleKey: 'title_basalGanglia', component: BasalGangliaPanel },
            { id: 'cerebellum', titleKey: 'title_cerebellum', component: CerebellumPanel },
            { id: 'praxisresonator', titleKey: 'title_praxisResonator', component: PraxisResonatorPanel },
        ]
    },
     {
        id: 'neuro-cortex',
        titleKey: 'title_neuroCortex',
        component: NeuroCortexPanel,
    },
    {
        id: 'neural-accelerator',
        titleKey: 'title_neuralAccelerator',
        component: NeuralAcceleratorPanel,
    },
    {
        id: 'psyche-motor',
        titleKey: 'title_praxisCore',
        children: [
            { id: 'psyche', titleKey: 'title_psyche', component: PsychePanel },
            { id: 'motorCortex', titleKey: 'title_motorCortex', component: MotorCortexPanel },
        ]
    },
    {
        id: 'sensory-perception',
        titleKey: 'title_sensoryPerception',
        children: [
            { id: 'qsp', titleKey: 'title_qualiaSignalProcessor', component: QualiaSignalProcessorPanel },
        ]
    },
     {
        id: 'system-internals',
        titleKey: 'System Internals',
        children: [
            { id: 'event-bus', titleKey: 'coprocessor_eventBus_title', component: EventBusPanel },
            { id: 'subsumption-log', titleKey: 'subsumptionLog_title', component: SubsumptionLogPanel },
            { id: 'sensory-hub', titleKey: 'sensoryHub_title', component: SensoryIntegrationPanel },
        ]
    },
    {
        id: 'vfs',
        titleKey: 'title_vfsExplorer',
        children: [
            { id: 'vfs-manual', titleKey: 'title_vfs_manual', component: VFS_Engineer_Manual },
            { id: 'vfs-explorer', titleKey: 'title_vfsExplorer', component: VFSExplorerPanel },
            { id: 'vfs-ingest', titleKey: 'title_liveCodeIngestion', component: CodeIngestionPanel },
        ]
    },
];