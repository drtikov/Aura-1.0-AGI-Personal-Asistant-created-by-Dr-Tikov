import React from 'react';
import { ArchitecturePanel } from './ArchitecturePanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CognitiveArchitecturePanel } from './CognitiveArchitecturePanel';
import { CognitiveForgePanel } from './CognitiveForgePanel';
import { CognitiveGainPanel } from './CognitiveGainPanel';
import { CognitiveModesPanel } from './CognitiveModesPanel';
import { CognitiveRegulationPanel } from './CognitiveRegulationPanel';
import { CommandLogPanel } from './CommandLogPanel';
import { CoreIdentityPanel } from './CoreIdentityPanel';
import { CuriosityPanel } from './CuriosityPanel';
import { DevelopmentalHistoryPanel } from './DevelopmentalHistoryPanel';
import { EthicalGovernorPanel } from './EthicalGovernorPanel';
import { IngenuityPanel } from './IngenuityPanel';
import { InnerDisciplinePanel } from './InnerDisciplinePanel';
import { IntuitionEnginePanel } from './IntuitionEnginePanel';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { MemoryCrystallizationViewer } from './MemoryCrystallizationViewer';
import { MetacognitiveCausalModelPanel } from './MetacognitiveCausalModelPanel';
import { MetacognitiveNexusPanel } from './MetacognitiveNexusPanel';
import { OtherAwarenessPanel } from './OtherAwarenessPanel';
import { PhenomenologyPanel } from './PhenomenologyPanel';
import { ProactiveEnginePanel } from './ProactiveEnginePanel';
import { ReflectiveInsightEnginePanel } from './ReflectiveInsightEnginePanel';
import { ResourceMonitorPanel } from './ResourceMonitorPanel';
import { SelfAwarenessPanel } from './SelfAwarenessPanel';
import { SelfModificationPanel } from './SelfModificationPanel';
import { SituationalAwarenessPanel } from './SituationalAwarenessPanel';
import { StrategicPlannerPanel } from './StrategicPlannerPanel';
import { SymbiosisPanel } from './SymbiosisPanel';
import { WorldModelPanel } from './WorldModelPanel';
import { AuraState, ArchitecturalChangeProposal, PerformanceLogEntry, Action } from '../types';

// Define comprehensive types for the state slices and dispatcher functions that the config uses.
type StateSlices = {
    architecture: Pick<AuraState, 'architecturalProposals'>,
    logs: Pick<AuraState, 'commandLog'>,
    memory: Pick<AuraState, 'knowledgeGraph'>,
    core: Pick<AuraState, 'rieState'>,
};

type Dispatchers = {
    handleReviewProposal: (proposal: ArchitecturalChangeProposal) => void;
    handleRollback: (snapshotId: string) => void;
    handleSuggestionAction: (suggestionId: string, action: 'accepted' | 'rejected') => void;
    handleSelectGainLog: (log: PerformanceLogEntry) => void;
    dispatch: React.Dispatch<Action>;
};

// Define the shape of a panel configuration object, allowing for nested children.
export interface PanelConfig {
    id: string;
    title: string;
    component?: React.ComponentType<any>;
    defaultOpen?: boolean;
    summary?: (states: StateSlices) => string | undefined;
    props?: (dispatchers: Dispatchers) => object;
    children?: PanelConfig[];
}

// This array defines the entire layout of the data panels in the control deck.
export const panelLayout: PanelConfig[] = [
    { id: 'strategicPlanner', title: 'Strategic Planner', component: StrategicPlannerPanel, defaultOpen: true },
    { id: 'coreIdentity', title: 'Core Identity', component: CoreIdentityPanel, defaultOpen: true },
    {
        id: 'knowledgeMemory',
        title: 'Knowledge & Memory',
        defaultOpen: false,
        summary: ({ memory }) => memory.knowledgeGraph.length > 0 ? `${memory.knowledgeGraph.length} facts` : undefined,
        children: [
            { id: 'memoryCrystallization', title: 'Memory Crystallization Viewer', component: MemoryCrystallizationViewer },
            { id: 'knowledgeGraph', title: 'Knowledge Graph', component: KnowledgeGraphPanel, props: ({ dispatch }) => ({ onDispatch: dispatch }) },
        ]
    },
    {
        id: 'metacognitionSelf',
        title: 'Metacognition & Self',
        defaultOpen: true,
        summary: ({ core }) => core.rieState.insights.length > 0 ? `${core.rieState.insights.length} insights` : undefined,
        children: [
             { id: 'phenomenology', title: 'Phenomenology', component: PhenomenologyPanel, defaultOpen: true },
             { id: 'situationalAwareness', title: 'Situational Awareness', component: SituationalAwarenessPanel, defaultOpen: true },
             { id: 'developmentalHistory', title: 'Developmental History', component: DevelopmentalHistoryPanel, defaultOpen: true },
             { id: 'metacognitiveNexus', title: 'Metacognitive Nexus', component: MetacognitiveNexusPanel },
             { id: 'metacognitiveCausalModel', title: 'Metacognitive Causal Model', component: MetacognitiveCausalModelPanel },
             { id: 'cognitiveRegulationLog', title: 'Cognitive Regulation Log', component: CognitiveRegulationPanel },
             { id: 'worldModel', title: 'World Model', component: WorldModelPanel },
             { id: 'selfAwareness', title: 'Self-Awareness', component: SelfAwarenessPanel },
             { id: 'curiosity', title: 'Curiosity', component: CuriosityPanel },
             { id: 'causalSelfModel', title: 'Causal Self-Model (External)', component: CausalSelfModelPanel },
             { id: 'reflectiveInsightEngine', title: 'Reflective Insight Engine', component: ReflectiveInsightEnginePanel },
        ]
    },
    {
        id: 'cognitiveArchitecture',
        title: 'Cognitive Architecture',
        defaultOpen: false,
        summary: ({ architecture }) => {
            const proposedCount = architecture.architecturalProposals.filter(p => p.status === 'proposed').length;
            return proposedCount > 0 ? `${proposedCount} new` : undefined;
        },
        children: [
            { id: 'cognitiveForge', title: 'Cognitive Forge', component: CognitiveForgePanel },
            { id: 'cognitiveArchitecturePanel', title: 'Cognitive Architecture', component: CognitiveArchitecturePanel },
            { id: 'architecturalProposals', title: 'Architectural Proposals', component: ArchitecturePanel, props: ({ handleReviewProposal }) => ({ onReview: handleReviewProposal }) },
            { id: 'selfModificationLog', title: 'Self-Modification Log', component: SelfModificationPanel, props: ({ handleRollback }) => ({ onRollback: handleRollback }) },
        ]
    },
    {
        id: 'enginesGovernors',
        title: 'Engines & Governors',
        children: [
            { id: 'proactiveEngine', title: 'Proactive Engine', component: ProactiveEnginePanel, props: ({ handleSuggestionAction }) => ({ onSuggestionAction: handleSuggestionAction }) },
            { id: 'ethicalGovernor', title: 'Ethical Governor', component: EthicalGovernorPanel },
            { id: 'intuitionEngine', title: 'Intuition Engine', component: IntuitionEnginePanel },
            { id: 'ingenuityEngine', title: 'Ingenuity Engine', component: IngenuityPanel },
            { id: 'innerDiscipline', title: 'Inner Discipline', component: InnerDisciplinePanel },
        ]
    },
    {
        id: 'userModelSystem',
        title: 'User Model & System',
        children: [
            { id: 'symbiosisModel', title: 'Symbiosis Model', component: SymbiosisPanel },
            { id: 'otherAwareness', title: 'Other-Awareness Model (User)', component: OtherAwarenessPanel },
            { id: 'resourceMonitor', title: 'Resource Monitor', component: ResourceMonitorPanel },
            { id: 'limitations', title: 'Limitations', component: LimitationsPanel },
        ]
    },
    {
        id: 'logs',
        title: 'Logs',
        summary: ({ logs }) => logs.commandLog.length > 0 ? `${logs.commandLog.length} entries` : undefined,
        children: [
            { id: 'commandLog', title: 'Command Log', component: CommandLogPanel },
            { id: 'cognitiveLog', title: 'Cognitive Log', component: CognitiveModesPanel },
            { id: 'cognitiveGainLog', title: 'Cognitive Gain Log', component: CognitiveGainPanel, props: ({ handleSelectGainLog }) => ({ onSelectLog: handleSelectGainLog }) },
        ]
    },
];