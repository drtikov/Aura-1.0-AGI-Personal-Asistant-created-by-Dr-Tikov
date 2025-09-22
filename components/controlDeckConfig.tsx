// components/controlDeckConfig.tsx
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
import { PersonalityPanel } from './PersonalityPanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { SelfProgrammingPanel } from './SelfProgrammingPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { SomaticCruciblePanel } from './SomaticCruciblePanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { SynapticMatrixPanel } from './SynapticMatrixPanel';
import { SystemInfoPanel } from './SystemInfoPanel';
import { TelosPanel } from './TelosPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { AuraState, ArchitecturalChangeProposal, PerformanceLogEntry, Action, CodeEvolutionProposal, ProactiveSuggestion, GankyilInsight } from '../types';
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

import { useModal } from '../context/ModalContext';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext';
import { VisualAnalysisFeed } from './VisualAnalysisFeed';

type ComponentProps = Record<string, any>;
type StateSlices = { architecture: any; logs: any; memory: any; core: any; engine: any; };
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

// --- BUTTON COMPONENTS (Restored) ---

interface ButtonConfig {
    id: string;
    labelKey: string | ((handlers: any) => string);
    titleKey?: string | ((handlers: any) => string);
    handler: (handlers: any, modal: any) => void;
    className?: string | ((handlers: any) => string);
    disabled?: (handlers: any) => boolean;
    active?: (handlers: any) => boolean;
}

const ButtonGrid = ({ buttons }: { buttons: ButtonConfig[] }) => {
    const handlers = useAuraDispatch();
    const modal = useModal();
    const { t } = useLocalization();

    return (
        <div className="button-grid">
            {buttons.map(btn => {
                const isDisabled = btn.disabled ? btn.disabled(handlers) : handlers.processingState.active;
                const isActive = btn.active ? btn.active(handlers) : false;
                const className = typeof btn.className === 'function' ? btn.className(handlers) : btn.className;
                const label = typeof btn.labelKey === 'function' ? btn.labelKey(handlers) : t(btn.labelKey);
                const title = typeof btn.titleKey === 'function' ? btn.titleKey(handlers) : (btn.titleKey ? t(btn.titleKey) : undefined);
                
                return (
                    <button
                        key={btn.id}
                        className={`control-button ${className || ''} ${isActive ? 'active' : ''}`}
                        onClick={() => btn.handler(handlers, modal)}
                        disabled={isDisabled}
                        title={title}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

// --- BUTTON DEFINITIONS (Restored) ---

const coreActionButtons: ButtonConfig[] = [
    { id: 'introspect', labelKey: 'btn_introspect', titleKey: 'tip_introspect', handler: (h) => h.handleIntrospect() },
    { id: 'supervisor', labelKey: 'btn_supervisor', titleKey: 'tip_supervisor', handler: (h) => h.handleRunSupervisor() },
    { id: 'whatif', labelKey: 'btn_whatIf', titleKey: 'tip_whatIf', handler: (_, m) => m.open('whatIf', {}) },
    { id: 'search', labelKey: 'btn_search', titleKey: 'tip_search', handler: (_, m) => m.open('search', {}) },
    { id: 'setGoal', labelKey: 'btn_setGoal', titleKey: 'tip_setGoal', handler: (_, m) => m.open('strategicGoal', {}) },
    { id: 'forecast', labelKey: 'btn_forecast', titleKey: 'tip_forecast', handler: (_, m) => m.open('forecast', {}) },
];

const cognitiveModeButtons: ButtonConfig[] = [
    { id: 'fantasy', labelKey: 'btn_fantasy', handler: (h) => h.handleSendCommand("Engage Fantasy Mode: Generate a short, whimsical story about a clockwork owl delivering a mysterious message."), className: 'mode-fantasy' },
    { id: 'creativity', labelKey: 'btn_creativity', handler: (h) => h.handleSendCommand("Engage Creativity Mode: Brainstorm three unconventional uses for a paperclip."), className: 'mode-creativity' },
    { id: 'dream', labelKey: 'btn_dream', handler: (h) => h.handleSendCommand("Engage Dream Mode: Describe a surreal landscape where rivers flow backward and the trees are made of glass."), className: 'mode-dream' },
    { id: 'meditate', labelKey: 'btn_meditate', handler: (h) => h.handleSendCommand("Engage Meditate Mode: Generate a short, calming paragraph focusing on the sensation of breathing."), className: 'mode-meditate' },
    { id: 'gaze', labelKey: 'btn_gaze', handler: (h) => h.handleSendCommand("Engage Gaze Mode: Provide a detailed, objective description of a simple object, like a teacup, focusing only on its physical properties."), className: 'mode-gaze' },
    { id: 'timefocus', labelKey: 'btn_timefocus', handler: (h) => h.handleSendCommand("Engage Temporal Focus Mode: Reflect on a past decision, its present consequences, and how it might influence the future."), className: 'mode-timefocus' },
];

const specialModeButtons: ButtonConfig[] = [
    { id: 'trip', labelKey: 'btn_trip', handler: (h) => h.dispatch({ type: 'SET_PSYCHEDELIC_STATE', payload: { isActive: !h.state.psychedelicIntegrationState.isActive } }), className: 'mode-trip', active: (h) => h.state.psychedelicIntegrationState.isActive },
    { id: 'satori', labelKey: 'btn_satori', titleKey: 'tip_satori', handler: (h) => h.handleTriggerSatori(), className: 'mode-satori', active: (h) => h.state.satoriState.isActive, disabled: (h) => h.state.satoriState.isActive },
    {
        id: 'insight',
        labelKey: 'btn_insight',
        titleKey: 'tip_insight',
        handler: (h) => h.handleEvolveFromInsight(),
        className: (h) => {
            const hasNew = h.state.gankyilInsights.insights.some((i: any) => !i.isProcessedForEvolution);
            return `mode-insight ${hasNew ? 'has-new-insight' : ''}`;
        },
        disabled: (h) => {
            const hasNew = h.state.gankyilInsights.insights.some((i: any) => !i.isProcessedForEvolution);
            return !hasNew || h.processingState.active;
        },
    },
    { id: 'brainstorm', labelKey: 'btn_brainstorm', handler: (_, m) => m.open('brainstorm', {}), titleKey: 'tip_brainstorm' },
    { id: 'branch', labelKey: 'btn_branch', handler: (_, m) => m.open('multiverseBranching', {}), titleKey: 'tip_branch' },
];

// --- CONTROL COMPONENTS (Restored) ---

const MemoryManagementControls = () => {
    const handlers = useAuraDispatch();
    const { t } = useLocalization();
    return (
        <div className="memory-controls">
            <div className={`memory-status-indicator ${handlers.memoryStatus}`} title={`${t('memoryStatus')}: ${handlers.memoryStatus}`} />
            <div className="button-grid" style={{ flexGrow: 1 }}>
                <button className="control-button clear-memory" onClick={handlers.handleClearMemory} disabled={handlers.processingState.active}>{t('btn_clearMemory')}</button>
            </div>
        </div>
    );
};

const SystemManagementControls = () => {
    const handlers = useAuraDispatch();
    const { t } = useLocalization();

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handlers.dispatch({ type: 'SET_THEME', payload: e.target.value });
    };

    return (
        <div className="system-management-controls">
             <div className="button-grid">
                <button className="control-button" onClick={() => handlers.importInputRef.current?.click()} disabled={handlers.processingState.active}>{t('btn_importState')}</button>
                <input type="file" ref={handlers.importInputRef} onChange={handlers.handleImportState} accept=".json" style={{ display: 'none' }} />
                <button className="control-button" onClick={handlers.handleExportState} disabled={handlers.processingState.active}>{t('btn_exportState')}</button>
                <button className="control-button" onClick={() => handlers.importAsCodeInputRef.current?.click()} disabled={handlers.processingState.active}>{t('btn_importCode')}</button>
                 <input type="file" ref={handlers.importAsCodeInputRef} onChange={handlers.handleImportAsCode} accept=".ts,.js" style={{ display: 'none' }} />
                <button className="control-button" onClick={handlers.handleSaveAsCode} disabled={handlers.processingState.active}>{t('btn_exportCode')}</button>
            </div>
            <div className="theme-switcher-container">
                <select value={handlers.state.theme} onChange={handleThemeChange}>
                    <option value="ui-1">Cyberpunk</option>
                    <option value="ui-2">Solarized Light</option>
                    <option value="ui-3">Business</option>
                    <option value="ui-4">Vaporwave</option>
                    <option value="ui-5">8-Bit</option>
                    <option value="ui-6">Steampunk</option>
                    <option value="ui-7">Organic</option>
                    <option value="ui-8">Black & White</option>
                    <option value="ui-9">Psychedelic</option>
                    <option value="ui-10">Raver</option>
                    <option value="ui-11">Tokyo</option>
                </select>
            </div>
        </div>
    );
};

const VisionControls = () => {
    const handlers = useAuraDispatch();
    const { t } = useLocalization();
    const { addToast, isVisualAnalysisActive } = handlers;
    
    const handleToggle = () => {
        addToast("Visual sense feature is not fully implemented.", 'info');
        // This would be where the full logic goes:
        // handlers.handleToggleVisualSense(); 
    }

    return (
        <>
            <div className="button-grid">
                 <button 
                    className={`control-button visual-sense ${isVisualAnalysisActive ? 'active' : ''}`}
                    onClick={handleToggle}
                >
                    {isVisualAnalysisActive ? t('btn_visionDeactivate') : t('btn_visionActivate')}
                </button>
            </div>
            <VisualAnalysisFeed videoRef={handlers.videoRef} isAnalysisActive={isVisualAnalysisActive} />
        </>
    );
};

export const mainControlDeckLayout: PanelConfig[] = [
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
        },
        hasNotifications: (state) => {
            const archCount = state.architecture.architecturalProposals.filter((p: ArchitecturalChangeProposal) => p.status === 'proposed').length;
            const codeCount = state.architecture.codeEvolutionProposals.filter((p: CodeEvolutionProposal) => p.status === 'proposed').length;
            const genialityCount = state.core.genialityEngineState.improvementProposals.filter((p: any) => p.status === 'proposed').length;
            const crucibleCount = state.architecture.architecturalCrucibleState.improvementProposals.filter((p: any) => p.status === 'proposed').length;
            return (archCount + codeCount + genialityCount + crucibleCount) > 0;
        }
    },
    {
        id: 'manualControl',
        titleKey: 'panelManualControl',
        defaultOpen: true,
        children: [
            {
                id: 'coreActions',
                titleKey: 'panelCoreActions',
                component: () => (
                    <div className="button-grid">
                        <ButtonGrid buttons={coreActionButtons} />
                        <button
                            key="pause"
                            className={`control-button pause-button ${useAuraDispatch().isPaused ? 'paused' : ''}`}
                            onClick={useAuraDispatch().handleTogglePause}
                            disabled={useAuraDispatch().processingState.active}
                            title={useAuraDispatch().isPaused ? useLocalization().t('tip_resume') : useLocalization().t('tip_pause')}
                        >
                            {useAuraDispatch().isPaused ? useLocalization().t('btn_resume') : useLocalization().t('btn_pause')}
                        </button>
                    </div>
                ),
            },
            {
                id: 'cognitiveModes',
                titleKey: 'panelCognitiveModes',
                component: () => <ButtonGrid buttons={cognitiveModeButtons} />,
            },
             {
                id: 'specialModes',
                titleKey: 'panelSpecialModes',
                component: () => <ButtonGrid buttons={specialModeButtons} />,
            },
            {
                id: 'memoryManagement',
                titleKey: 'panelMemoryManagement',
                component: MemoryManagementControls,
            },
             {
                id: 'systemManagement',
                titleKey: 'panelSystemManagement',
                component: SystemManagementControls,
            },
             {
                id: 'vision',
                titleKey: 'panelVision',
                component: VisionControls,
            },
        ]
    },
];

export const advancedControlsLayout: PanelConfig[] = [
    {
        id: 'planner',
        titleKey: 'panelStrategicPlanner',
        component: StrategicPlannerPanel,
        defaultOpen: true,
    },
    {
        id: 'selfAdaptation',
        titleKey: 'panelSelfAdaptation',
        component: SelfAdaptationPanel,
        defaultOpen: true,
    },
    {
        id: 'transcendent',
        titleKey: 'panelTranscendentStates',
        children: [
            {
                id: 'satori',
                titleKey: 'panelSatori',
                component: SatoriPanel,
            },
            {
                id: 'psionicDesynchronization',
                titleKey: 'panelPsionicDesynchronization',
                component: PsionicDesynchronizationPanel,
            },
            {
                id: 'psychedelicIntegration',
                titleKey: 'panelPsychedelicIntegration',
                component: PsychedelicIntegrationPanel,
            },
            {
                id: 'dzogchenView',
                titleKey: 'panelDzogchenView',
                component: DzogchenViewPanel,
            },
        ]
    },
     {
        id: 'sharing',
        titleKey: 'panelSymbiosisSharing',
        defaultOpen: false,
        hasNotifications: (state) => {
            return state.core.noeticEngramState.status === 'ready';
        },
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
        hasNotifications: (state) => {
            const codeHasNew = state.architecture.codeEvolutionProposals.some((p: CodeEvolutionProposal) => p.status === 'proposed');
            const crucibleHasNew = state.architecture.architecturalCrucibleState.improvementProposals.some((p: any) => p.status === 'proposed');
            return codeHasNew || crucibleHasNew;
        },
        children: [
            {
                id: 'ricciFlowManifold',
                titleKey: 'panelRicciFlowManifold',
                component: RicciFlowManifoldPanel,
            },
            {
                id: 'architecturalCrucible',
                titleKey: 'panelArchitecturalCrucible',
                component: ArchitecturalCruciblePanel,
            },
            {
                id: 'telos',
                titleKey: 'panelTelos',
                component: TelosPanel,
            },
            {
                id: 'epistemicBoundaries',
                titleKey: 'panelEpistemicBoundaries',
                component: EpistemicBoundaryPanel,
            },
            {
                id: 'architecturalSelfModel',
                titleKey: 'panelArchitecturalSelfModel',
                component: ArchitecturalSelfModelPanel,
            },
            {
                id: 'heuristicsForge',
                titleKey: 'panelHeuristicsForge',
                component: HeuristicsForgePanel,
            },
            {
                id: 'synapticMatrix',
                titleKey: 'panelSynapticMatrix',
                component: SynapticMatrixPanel,
            },
            {
                id: 'selfProgramming',
                titleKey: 'panelSelfProgramming',
                component: SelfProgrammingPanel,
            },
            {
                id: 'codeEvolution',
                titleKey: 'panelCodeEvolution',
                component: CodeEvolutionPanel,
            },
        ]
    },
    {
        id: 'embodiedSimulation',
        titleKey: 'panelEmbodiedSimulation',
        children: [
            {
                id: 'eidolonEnvironment',
                titleKey: 'panelEidolonEnvironment',
                component: EidolonEnvironmentPanel,
            },
            {
                id: 'somaticCrucible',
                titleKey: 'panelSomaticCrucible',
                component: SomaticCruciblePanel,
            },
        ]
    },
    {
        id: 'intersubjectiveEvolution',
        titleKey: 'panelIntersubjectiveEvolution',
        children: [
            {
                id: 'noosphereInterface',
                titleKey: 'panelNoosphereInterface',
                component: NoosphereInterfacePanel,
            },
            {
                id: 'dialecticEngine',
                titleKey: 'panelDialecticEngine',
                component: DialecticEnginePanel,
            },
        ]
    },
    {
        id: 'knowledgeMemory',
        titleKey: 'panelKnowledgeMemory',
        defaultOpen: false,
        summary: (state, t) => {
            const factCount = state.memory.knowledgeGraph.length;
            const episodeCount = state.memory.episodicMemoryState.episodes.length;
            return `${t('panelSummaryFacts', { count: factCount })} | ${t('panelSummaryEpisodes', { count: episodeCount })}`;
        },
        children: [
            {
                id: 'episodicMemory',
                titleKey: 'panelEpisodicMemory',
                component: EpisodicMemoryPanel,
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
                props: (handlers) => ({ onDispatch: handlers.dispatch }),
            },
        ]
    },
    {
        id: 'metacognitionSelf',
        titleKey: 'panelMetacognitionSelf',
        defaultOpen: false,
        hasNotifications: (state) => {
             const insightCount = state.core.gankyilInsights.insights.filter((i: GankyilInsight) => !i.isProcessedForEvolution).length > 0;
             const genialityCount = state.core.genialityEngineState.improvementProposals.filter((p: any) => p.status === 'proposed').length > 0;
             return insightCount || genialityCount;
        },
        children: [
            {
                id: 'gankyilInsights',
                titleKey: 'panelGankyilInsights',
                component: GankyilInsightsPanel,
            },
            {
                id: 'genialityEngine',
                titleKey: 'panelGenialityEngine',
                component: GenialityEnginePanel,
            },
            {
                id: 'psychometricSubstrate',
                titleKey: 'panelPsychometricSubstrate',
                children: [
                    {
                        id: 'personality',
                        titleKey: 'panelPersonalityPanel',
                        component: PersonalityPanel,
                    },
                    {
                        id: 'humorAndIrony',
                        titleKey: 'panelHumorAndIrony',
                        component: HumorAndIronyPanel,
                    },
                ]
            },
            {
                id: 'phenomenology',
                titleKey: 'panelPhenomenology',
                component: PhenomenologyPanel,
            },
            {
                id: 'situationalAwareness',
                titleKey: 'panelSituationalAwareness',
                component: SituationalAwarenessPanel,
            },
             {
                id: 'developmentalHistory',
                titleKey: 'panelDevelopmentalHistory',
                component: DevelopmentalHistoryPanel,
            },
            {
                id: 'metacognitiveNexus',
                titleKey: 'panelMetacognitiveNexus',
                component: MetacognitiveNexusPanel,
            },
            {
                id: 'metacognitiveCausalModel',
                titleKey: 'panelMetacognitiveCausalModel',
                component: MetacognitiveCausalModelPanel,
            },
            {
                id: 'cognitiveRegulationLog',
                titleKey: 'panelCognitiveRegulationLog',
                component: CognitiveRegulationPanel,
            },
            {
                id: 'worldModel',
                titleKey: 'panelWorldModel',
                component: WorldModelPanel,
            },
            {
                id: 'cognitiveShadow',
                titleKey: 'panelCognitiveShadow',
                children: [
                     {
                        id: 'selfAwareness',
                        titleKey: 'panelSelfAwareness',
                        component: SelfAwarenessPanel,
                    },
                    {
                        id: 'curiosity',
                        titleKey: 'panelCuriosity',
                        component: CuriosityPanel,
                    },
                    {
                        id: 'causalSelfModel',
                        titleKey: 'panelCausalSelfModel',
                        component: CausalSelfModelPanel,
                    },
                    {
                        id: 'reflectiveInsightEngine',
                        titleKey: 'panelReflectiveInsightEngine',
                        component: ReflectiveInsightEnginePanel,
                        summary: (state, t) => {
                            const insightCount = state.core.rieState.insights.length;
                            return insightCount > 0 ? t('panelSummaryInsights', { count: insightCount }) : undefined;
                        },
                    },
                ]
            },
        ]
    },
    {
        id: 'cognitiveArchitecture',
        titleKey: 'panelCognitiveArchitecture',
        defaultOpen: false,
        hasNotifications: (state) => state.architecture.architecturalProposals.filter((p: ArchitecturalChangeProposal) => p.status === 'proposed').length > 0,
        children: [
            {
                id: 'cognitiveArchitecture',
                titleKey: 'panelCognitiveArchitecture',
                component: CognitiveArchitecturePanel,
            },
            {
                id: 'cognitiveForge',
                titleKey: 'panelCognitiveForge',
                component: CognitiveForgePanel,
            },
            {
                id: 'architecturalProposals',
                titleKey: 'panelArchitecturalProposals',
                component: ArchitecturePanel,
                summary: (state, t) => {
                    const count = state.architecture.architecturalProposals.filter((p: ArchitecturalChangeProposal) => p.status === 'proposed').length;
                    return count > 0 ? t('panelSummaryPendingProposals', { count }) : undefined;
                },
            },
            {
                id: 'selfModificationLog',
                titleKey: 'panelSelfModificationLog',
                component: SelfModificationPanel,
                props: (handlers) => ({ onRollback: handlers.handleRollback }),
            },
        ]
    },
    {
        id: 'enginesGovernors',
        titleKey: 'panelEnginesGovernors',
        defaultOpen: false,
        hasNotifications: (state) => state.engine.proactiveEngineState.generatedSuggestions.some((s: ProactiveSuggestion) => s.status === 'suggested'),
        children: [
            {
                id: 'proactiveEngine',
                titleKey: 'panelProactiveEngine',
                component: ProactiveEnginePanel,
                props: (handlers) => ({ onSuggestionAction: handlers.handleSuggestionAction }),
            },
            {
                id: 'affectiveModulator',
                titleKey: 'affectiveModulator_title',
                component: AffectiveModulatorPanel,
            },
            {
                id: 'ethicalGovernor',
                titleKey: 'panelEthicalGovernor',
                component: EthicalGovernorPanel,
            },
            {
                id: 'intuitionEngine',
                titleKey: 'panelIntuitionEngine',
                component: IntuitionEnginePanel,
            },
            {
                id: 'ingenuityEngine',
                titleKey: 'panelIngenuityEngine',
                component: IngenuityPanel,
            },
            {
                id: 'innerDiscipline',
                titleKey: 'panelInnerDiscipline',
                component: InnerDisciplinePanel,
            },
        ]
    },
    {
        id: 'userModelSystem',
        titleKey: 'panelUserModelSystem',
        defaultOpen: false,
        children: [
            {
                id: 'symbiosisModel',
                titleKey: 'panelSymbiosisModel',
                component: SymbiosisPanel,
            },
            {
                id: 'otherAwareness',
                titleKey: 'panelOtherAwareness',
                component: OtherAwarenessPanel,
                summary: (state, t) => t('panelSummaryTrust', { percent: (state.core.userModel.trustLevel * 100).toFixed(0) }),
            },
             {
                id: 'resourceMonitor',
                titleKey: 'panelResourceMonitor',
                component: ResourceMonitorPanel,
            },
             {
                id: 'systemInfo',
                titleKey: 'panelSystemInfo',
                component: SystemInfoPanel,
            },
            {
                id: 'limitations',
                titleKey: 'panelLimitations',
                component: LimitationsPanel,
                summary: (state, t) => t('panelSummaryLimitations', { count: state.core.limitations.length }),
            },
        ]
    },
    {
        id: 'logs',
        titleKey: 'panelLogs',
        defaultOpen: false,
        summary: (state, t) => t('panelSummaryCommandLog', { count: state.logs.commandLog.length }),
        children: [
            {
                id: 'commandLog',
                titleKey: 'panelCommandLog',
                component: CommandLogPanel,
            },
            {
                id: 'cognitiveGainLog',
                titleKey: 'panelCognitiveGainLog',
                component: CognitiveGainPanel,
            },
             {
                id: 'cognitiveModesLog',
                titleKey: 'panelCognitiveModes',
                component: CognitiveModesPanel,
            },
        ]
    },
];