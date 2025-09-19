import React from 'react';
import { ArchitecturePanel } from './ArchitecturePanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CodeEvolutionPanel } from './CodeEvolutionPanel';
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
import { EidolonEnvironmentPanel } from './EidolonEnvironmentPanel';
import { EpisodicMemoryPanel } from './EpisodicMemoryPanel';
import { EpistemicBoundaryPanel } from './EpistemicBoundaryPanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { GankyilInsightsPanel } from './GankyilInsightsPanel';
import { GenialityEnginePanel } from './GenialityEnginePanel';
import { HeuristicsForgePanel } from './HeuristicsForgePanel';
import { HumorAndIronyPanel } from './HumorAndIronyPanel';
import { InboxPanel } from './InboxPanel';
import { IngenuityPanel } from './IngenuityPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { MemoryCrystallizationViewer } from './MemoryCrystallizationViewer';
import { MetacognitiveCausalModelPanel } from './MetacognitiveCausalModelPanel';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel';
import { NoosphereInterfacePanel } from './NoosphereInterfacePanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { PsychometricSubstratePanel } from './PersonalityPanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { CognitiveShadowPanel } from './SelfAwarenessPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { TelosPanel } from './TelosPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { AuraState, ArchitecturalChangeProposal, PerformanceLogEntry, Action, CodeEvolutionProposal } from '../types';
import { ArchitecturalSelfModelPanel } from './ArchitecturalSelfModelPanel';
import { NoeticEngramPanel } from './NoeticEngramPanel';
import { ArchitecturalCruciblePanel } from './ArchitecturalCruciblePanel';
import { NoeticMultiversePanel } from './NoeticMultiversePanel';

type ComponentProps = Record<string, any>;
type StateSlices = { architecture: any; logs: any; memory: any; core: any; };
type TFunction = (key: string, options?: any) => string;

export interface PanelConfig {
    id: string;
    titleKey: string;
    component?: React.ComponentType<any>;
    defaultOpen?: boolean;
    summary?: (state: StateSlices, t: TFunction) => string;
    props?: (handlers: { [key: string]: (...args: any[]) => void }) => ComponentProps;
    children?: PanelConfig[];
}

export const panelLayout: PanelConfig[] = [
    {
        id: 'inbox',
        titleKey: 'panelInbox',
        component: InboxPanel,
        defaultOpen: true,
        summary: (state, t) => {
             const archCount = state.architecture.architecturalProposals.filter((p: ArchitecturalChangeProposal) => p.status === 'proposed').length;
             const codeCount = state.architecture.codeEvolutionProposals.filter((p: CodeEvolutionProposal) => p.status === 'proposed').length;
             const genialityCount = state.core.genialityEngineState.improvementProposals.filter((p: any) => p.status === 'proposed').length;
             const crucibleCount = state.architecture.architecturalCrucibleState.improvementProposals.filter((p: any) => p.status === 'proposed').length;
             const total = archCount + codeCount + genialityCount + crucibleCount;
             return total > 0 ? t('inbox_summary', { count: total }) : undefined;
        }
    },
    {
        id: 'planner',
        titleKey: 'panelStrategicPlanner',
        component: StrategicPlannerPanel,
        defaultOpen: true,
    },
    {
        id: 'dzogchenView',
        titleKey: 'panelDzogchenView',
        component: DzogchenViewPanel,
    },
     {
        id: 'sharing',
        titleKey: 'panelSymbiosisSharing',
        defaultOpen: false,
        children: [
            {
                id: 'noeticEngram',
                titleKey: 'panelNoeticEngram',
                component: NoeticEngramPanel,
            }
        ]
    },
    {
        id: 'cognitiveFrontier',
        titleKey: 'panelCognitiveFrontier',
        children: [
            {
                id: 'cognitiveLightCone',
                titleKey: 'panelCognitiveLightCone',
                component: CognitiveLightConePanel,
            },
            {
                id: 'noeticMultiverse',
                titleKey: 'panelNoeticMultiverse',
                component: NoeticMultiversePanel,
            },
        ]
    },
    {
        id: 'agiEvolution',
        titleKey: 'panelAgiEvolution',
        children: [
            { id: 'architecturalCrucible', titleKey: 'panelArchitecturalCrucible', component: ArchitecturalCruciblePanel },
            { id: 'telos', titleKey: 'panelTelos', component: TelosPanel },
            { id: 'epistemicBoundaries', titleKey: 'panelEpistemicBoundaries', component: EpistemicBoundaryPanel },
            { id: 'architecturalSelfModel', titleKey: 'panelArchitecturalSelfModel', component: ArchitecturalSelfModelPanel },
            { id: 'heuristicsForge', titleKey: 'panelHeuristicsForge', component: HeuristicsForgePanel },
            { id: 'synapticMatrix', titleKey: 'panelSynapticMatrix', component: SynapticMatrixPanel },
            { 
                id: 'codeEvolution', 
                titleKey: 'panelCodeEvolution', 
                component: CodeEvolutionPanel,
            },
        ],
    },
    {
        id: 'embodiedSimulation',
        titleKey: 'panelEmbodiedSimulation',
        children: [
            { id: 'eidolonEnvironment', titleKey: 'panelEidolonEnvironment', component: EidolonEnvironmentPanel },
            { id: 'somaticCrucible', titleKey: 'panelSomaticCrucible', component: SomaticCruciblePanel },
        ]
    },
    {
        id: 'intersubjectiveEvolution',
        titleKey: 'panelIntersubjectiveEvolution',
        children: [
            { id: 'noosphereInterface', titleKey: 'panelNoosphereInterface', component: NoosphereInterfacePanel },
            { id: 'dialecticEngine', titleKey: 'panelDialecticEngine', component: DialecticEnginePanel },
        ]
    },
    {
        id: 'knowledge',
        titleKey: 'panelKnowledgeMemory',
        children: [
             {
                id: 'episodicMemory',
                titleKey: 'panelEpisodicMemory',
                component: EpisodicMemoryPanel,
                summary: (state, t) => t('panelSummaryEpisodes', { count: state.memory.episodicMemoryState.episodes.length }),
            },
            {
                id: 'memoryCrystallization',
                titleKey: 'panelMemoryCrystallization',
                component: MemoryCrystallizationViewer,
            },
            {
                id: 'knowledgeGraph',
                titleKey: 'panelKnowledgeGraph',
                component: KnowledgeGraphPanel,
                summary: (state, t) => t('panelSummaryFacts', { count: state.memory.knowledgeGraph.length }),
                props: handlers => ({ onDispatch: handlers.dispatch }),
            },
        ],
    },
    {
        id: 'metacognition',
        titleKey: 'panelMetacognitionSelf',
        children: [
            { id: 'genialityEngine', titleKey: 'panelGenialityEngine', component: GenialityEnginePanel },
            { id: 'psychometricSubstrate', titleKey: 'panelPsychometricSubstrate', component: PsychometricSubstratePanel },
            { id: 'gankyilInsights', titleKey: 'panelGankyilInsights', component: GankyilInsightsPanel, summary: (state, t) => t('panelSummaryInsights', { count: state.core.gankyilInsights.insights.length }) },
            { id: 'humorAndIrony', titleKey: 'panelHumorAndIrony', component: HumorAndIronyPanel },
            { id: 'phenomenology', titleKey: 'panelPhenomenology', component: PhenomenologyPanel },
            { id: 'situationalAwareness', titleKey: 'panelSituationalAwareness', component: SituationalAwarenessPanel },
            { id: 'developmentalHistory', titleKey: 'panelDevelopmentalHistory', component: DevelopmentalHistoryPanel },
            { id: 'metacognitiveNexus', titleKey: 'panelMetacognitiveNexus', component: MetacognitiveNexusPanel },
            { id: 'metacognitiveCausalModel', titleKey: 'panelMetacognitiveCausalModel', component: MetacognitiveCausalModelPanel },
            { id: 'cognitiveRegulationLog', titleKey: 'panelCognitiveRegulationLog', component: CognitiveRegulationPanel },
            { id: 'worldModel', titleKey: 'panelWorldModel', component: WorldModelPanel },
            { id: 'cognitiveShadow', titleKey: 'panelCognitiveShadow', component: CognitiveShadowPanel },
            { id: 'curiosity', titleKey: 'panelCuriosity', component: CuriosityPanel },
            { id: 'causalSelfModel', titleKey: 'panelCausalSelfModel', component: CausalSelfModelPanel },
            { id: 'rie', titleKey: 'panelReflectiveInsightEngine', component: ReflectiveInsightEnginePanel, summary: (state, t) => t('panelSummaryInsights', { count: state.core.rieState.insights.length }) },
        ],
    },
    {
        id: 'architecture',
        titleKey: 'panelCognitiveArchitecture',
        children: [
            { id: 'cognitiveArchitecture', titleKey: 'panelCognitiveArchitecture', component: CognitiveArchitecturePanel },
            { id: 'cognitiveForge', titleKey: 'panelCognitiveForge', component: CognitiveForgePanel, },
            {
                id: 'proposals',
                titleKey: 'panelArchitecturalProposals',
                component: ArchitecturePanel,
                summary: (state, t) => t('panelSummaryPendingProposals', { count: state.architecture.architecturalProposals.length }),
            },
            {
                id: 'modLog',
                titleKey: 'panelSelfModificationLog',
                component: SelfModificationPanel,
                props: handlers => ({ onRollback: handlers.handleRollback }),
            },
        ],
    },
    {
        id: 'engines',
        titleKey: 'panelEnginesGovernors',
        children: [
            {
                id: 'proactive',
                titleKey: 'panelProactiveEngine',
                component: ProactiveEnginePanel,
                props: handlers => ({ onSuggestionAction: handlers.handleSuggestionAction, }),
            },
            { id: 'governor', titleKey: 'panelEthicalGovernor', component: EthicalGovernorPanel },
            { id: 'intuition', titleKey: 'panelIntuitionEngine', component: IntuitionEnginePanel },
            { id: 'ingenuity', titleKey: 'panelIngenuityEngine', component: IngenuityPanel },
            { id: 'discipline', titleKey: 'panelInnerDiscipline', component: InnerDisciplinePanel },
        ],
    },
    {
        id: 'userModel',
        titleKey: 'panelUserModelSystem',
        children: [
            { id: 'symbiosis', titleKey: 'panelSymbiosisModel', component: SymbiosisPanel },
            { id: 'otherAwareness', titleKey: 'panelOtherAwareness', component: OtherAwarenessPanel, summary: (state, t) => t('panelSummaryTrust', { percent: (state.core.userModel.trustLevel * 100).toFixed(0) }) },
            { id: 'resource', titleKey: 'panelResourceMonitor', component: ResourceMonitorPanel },
            { id: 'limitations', titleKey: 'panelLimitations', component: LimitationsPanel, summary: (state, t) => t('panelSummaryLimitations', { count: state.core.limitations.length }) },
        ],
    },
    {
        id: 'logs',
        titleKey: 'panelLogs',
        children: [
            { id: 'commandLog', titleKey: 'panelCommandLog', component: CommandLogPanel, summary: (state, t) => t('panelSummaryCommandLog', { count: state.logs.commandLog.length }) },
            {
                id: 'cognitiveGainLog',
                titleKey: 'panelCognitiveGainLog',
                component: CognitiveGainPanel,
                props: handlers => ({ onSelectLog: handlers.handleSelectGainLog, }),
            },
        ],
    },
];