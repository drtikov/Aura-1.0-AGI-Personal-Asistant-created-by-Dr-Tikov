import { GunaState, FocusMode, AffectiveState, GoalType } from './constants';

// --- Core State ---
export interface AuraState {
    version: number;
    theme: string;
    language: string;
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: AgentProfile;
    knowledgeGraph: Fact[];
    workingMemory: string[]; // Legacy, being replaced by situationalAwareness.focusContext
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveArchitecture: CognitiveArchitecture;
    architecturalProposals: ArchitecturalChangeProposal[];
    systemSnapshots: SystemSnapshot[];
    modificationLog: SelfModificationLogEntry[];
    resourceMonitor: ResourceMonitor;
    causalSelfModel: CausalSelfModel;
    limitations: string[];
    rieState: ReflectiveInsightEngineState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    disciplineState: SelfDisciplineState;
    ingenuityState: IngenuityState;
    proactiveEngineState: ProactiveEngineState;
    goalTree: Record<string, HierarchicalGoal>;
    activeStrategicGoalId: string | null;
    coreIdentity: CoreIdentity;
    curiosityState: CuriosityState;
    knownUnknowns: KnownUnknown[];
    selfAwarenessState: SelfAwarenessState;
    worldModelState: WorldModelState;
    cognitiveForgeState: CognitiveForgeState;
    memoryNexus: MemoryNexusState;
    metacognitiveNexus: MetacognitiveNexusState;
    metacognitiveCausalModel: Record<string, MetacognitiveLink>;
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    phenomenologicalEngine: PhenomenologicalEngineState;
    situationalAwareness: SituationalAwarenessState;
    symbioticState: SymbioticState;
    developmentalHistory: DevelopmentalHistoryState;
    telosEngine: TelosEngineState;
    boundaryDetectionEngine: BoundaryDetectionEngineState;
    architecturalSelfModel: ArchitecturalSelfModel;
    aspirationalEngine: AspirationalEngineState;
    heuristicsForge: HeuristicsForgeState;
    noosphereInterface: NoosphereInterfaceState;
    dialecticEngine: DialecticEngineState;
    somaticCrucible: SomaticCrucibleState;
    eidolonEngine: EidolonEngineState;

    // New modules for scientific self-discovery
    cognitiveLightCone: CognitiveLightConeState;
}

export interface InternalState {
    status: 'idle' | 'thinking' | 'acting' | 'CONTEMPLATIVE';
    gunaState: GunaState;
    focusMode: FocusMode;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    load: number;
    wisdomSignal: number;
    happinessSignal: number;
    loveSignal: number;
    enlightenmentSignal: number;
    empathySignal: number;
    compassionScore: number;
    harmonyScore: number;
}

export interface AgentProfile {
    trustLevel: number;
    estimatedKnowledgeState: number;
    predictedAffectiveState: AffectiveState;
    affectiveStateSource: 'text' | 'visual' | 'none';
    sentimentScore: number;
    sentimentHistory: number[];
    inferredIntent: string | null;
    inferredBeliefs: string[];
    engagementLevel: number;
}

// --- Knowledge & Memory ---
export interface Fact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
    timestamp: number;
    origin: 'user_stated' | 'inferred' | 'web_search' | 'system_default';
    accessCount: number;
    lastAccessed: number;
    modificationHistory: { timestamp: number, change: string }[];
}

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system';
    text: string;
    timestamp?: number;
    skill?: string;
    logId?: string;
    filePreview?: string;
    fileName?: string;
    fileType?: string;
    feedback?: 'positive' | 'negative' | null;
}

// --- Logging & Monitoring ---
export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    input: string;
    output: string | null;
    success: boolean;
    duration: number;
    cognitiveGain: number;
    sentiment?: number;
    decisionContext?: {
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoning: string;
        reasoningPlan: ReasoningStep[];
    };
}

export interface ReasoningStep {
    step: number;
    skill: string;
    reasoning: string;
    input: string;
    processes_file?: boolean;
}

export interface CommandLogEntry {
    id: string;
    timestamp: number;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface CognitiveModeLogEntry {
    id: string;
    timestamp: number;
    mode: string;
    trigger: string;
    outcome: string;
    metric: { name: string, value: number };
    gainAchieved: boolean;
}

export interface CognitiveGainLogEntry {
    id: string;
    timestamp: number;
    eventType: string;
    description: string;
    compositeGain: number;
    previousMetrics: Record<string, number>;
    currentMetrics: Record<string, number>;
    gainScores: Record<string, number>;
}

export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    triggeringCommand: string;
    targetSkills: string[];
    primingDirective: string;
    stateAdjustments: Partial<Record<keyof InternalState, { from: number, to: number }>>;
    outcomeLogId: string | null;
}

// --- Cognitive Architecture & Self-Modification ---
export interface CognitiveArchitecture {
    components: { [key: string]: CognitiveModule };
    modelComplexityScore: number;
}

export interface CognitiveModule {
    status: 'active' | 'inactive' | 'degraded';
    version: string;
    lastUpdated: number;
}

export type ArchitecturalAction = 'synthesize_skill' | 'MERGE_SKILLS' | 'REFACTOR_SKILL' | 'DEPRECATE_SKILL' | 'TUNE_SKILL';

export interface ArchitecturalChangeProposal {
    id: string;
    action: ArchitecturalAction;
    target: string | string[];
    newModule: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'completed' | 'failed';
    sourceGoalId?: string;
    confidence?: number;
    sourceDirectiveId?: string;
    arbiterReasoning?: string;
}

export interface SystemSnapshot {
    id: string;
    timestamp: number;
    reason: string;
    state: AuraState;
}

export interface SelfModificationLogEntry {
    id: string;
    timestamp: number;
    description: string;
    gainType: string;
    validationStatus: 'pending' | 'validated' | 'failed';
    isAutonomous?: boolean;
}

// --- Self-Models & Awareness ---
export interface CausalLink {
    id: string;
    source: string;
    effect: string;
    confidence: number;
    lastUpdated: number;
}
export type CausalSelfModel = Record<string, CausalLink>;


export interface ReflectiveInsightEngineState {
    clarityScore: number;
    insights: Insight[];
}

export interface Insight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: { key: string, update: Partial<CausalLink> };
}

export interface CoreIdentity {
    values: string[];
    narrativeSelf: string;
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: Record<string, number>;
}

// --- Engines ---
export interface EthicalGovernorState {
    principles: string[];
    vetoLog: VetoLogEntry[];
}

export interface VetoLogEntry {
    id: string;
    timestamp: number;
    actionDescription: string;
    reason: string;
    principleViolated: string;
}

export interface IntuitionEngineState {
    accuracy: number;
    totalAttempts: number;
    totalValidated: number;
}

export interface IntuitiveLeap {
    id: string;
    timestamp: number;
    type: 'hypothesis' | 'leap';
    hypothesis: string;
    reasoning: string;
    confidence: number;
    status: 'pending' | 'validated' | 'refuted';
}

export interface SelfDisciplineState {
    adherenceScore: number;
    distractionResistance: number;
    committedGoal: SelfDirectedGoal | null;
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: SelfSolutionProposal[];
}

export interface SelfSolutionProposal {
    id: string;
    description: string;
    noveltyScore: number;
}

export interface ProactiveEngineState {
    generatedSuggestions: ProactiveSuggestion[];
}

export interface ProactiveSuggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface WorldModelState {
    predictionError: { magnitude: number; lastUpdate: number; };
    highLevelPrediction: { content: string; confidence: number };
    midLevelPrediction: { content: string; confidence: number };
    lowLevelPrediction: { content: string; confidence: number };
}

// --- Planning & Goals ---
export interface SelfDirectedGoal {
    id: string;
    description: string;
    type: GoalType;
    status: 'pending' | 'executing' | 'completed' | 'failed';
    actionCommand: string;
    executionLog?: string;
    logId?: string;
    commitmentStrength: number;
}

export interface HierarchicalGoal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    executionLog?: string;
}

// --- Curiosity ---
export interface CuriosityState {
    level: number;
    activeInquiry: string | null;
    informationGaps: string[];
}

export interface KnownUnknown {
    id: string;
    question: string;
    importance: number;
    source: string;
}

// --- Cognitive Forge ---
export interface CognitiveForgeState {
    isTuningPaused: boolean;
    skillTemplates: Record<string, SkillTemplate>;
    synthesizedSkills: SynthesizedSkill[];
    simulationLog: SimulationLogEntry[];
}

export interface SkillTemplate {
    skill: string;
    systemInstruction: string;
    parameters: {
        temperature?: number;
        topK?: number;
        topP?: number;
    };
    metadata: {
        version: number;
        successRate: number;
        avgDuration: number;
        status: 'active' | 'deprecated';
    };
}

export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: { skill: string, inputTemplate: string }[];
    status: 'active' | 'deprecated';
    sourceGoalId?: string;
    sourceDirectiveId?: string;
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skill: string;
    type: 'TUNE_PARAMETERS' | 'SYNTHESIZE_SKILL' | 'REWRITE_INSTRUCTION';
    result: 'improved' | 'degraded' | 'no_change' | 'success' | 'failure';
    details: string;
    metrics?: {
        successRate?: number;
        avgDuration?: number;
    }
}

// --- Memory Nexus & Metacognition ---
export interface MemoryNexusState {
    hyphaeConnections: HyphaConnection[];
}

export interface MetacognitiveNexusState {
    coreProcesses: CoreProcess[];
    evolutionaryGoals: EvolutionaryGoal[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface SelfTuningDirective {
    id: string;
    timestamp: number;
    type: 'TUNE_PARAMETERS' | 'REWRITE_INSTRUCTION' | 'SYNTHESIZE_SKILL';
    targetSkill: string;
    reasoning: string;
    payload: Record<string, any>;
    status: 'proposed' | 'plan_generated' | 'simulating' | 'pending_arbitration' | 'completed' | 'failed' | 'rejected';
    simulationResult?: SimulationLogEntry;
    arbitrationResult?: ArbitrationResult;
}

export interface ArbitrationResult {
    decision: 'APPROVE_AUTONOMOUSLY' | 'REQUEST_USER_APPROVAL' | 'REJECT';
    confidence: number;
    reasoning: string;
}


export interface MetacognitiveLink {
    id: string;
    source: {
        type: 'internalState' | 'componentState';
        key: string;
        condition: 'HIGH' | 'LOW' | 'ACTIVE' | 'DEGRADED';
    };
    target: {
        type: 'componentPerformance';
        key: string;
        metric: 'successRate' | 'duration' | 'cognitiveGain';
    };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export interface EvolutionaryGoal {
    id: string;
    objective: string;
    type: ArchitecturalAction;
    status: 'identified' | 'synthesizing' | 'simulating' | 'proposal_ready' | 'completed' | 'failed';
    details: Record<string, any>;
}

export interface CoreProcess {
    id: string;
    name: string;
    activation: number;
    influence: number;
}

export interface HyphaConnection {
    id: string;
    source: string;
    target: string;
    weight: number;
    lastUpdated: number;
}

// --- NEW AWARENESS MODULES ---

export interface PhenomenologicalEngineState {
    qualiaLog: QualiaEntry[];
    phenomenologicalDirectives: PhenomenologicalDirective[];
}

export interface PhenomenologicalDirective {
    id: string;
    timestamp: number;
    directive: string; // e.g., "Reduce frustration associated with CODE_GENERATION skill"
    sourcePattern: string; // "Detected recurring high uncertainty and negative qualia..."
}

export interface QualiaEntry {
    id: string;
    timestamp: number;
    experience: string; // "Felt high uncertainty while generating code..."
    triggeringLogId: string; // PerformanceLogEntry ID
    associatedStates: {
        key: keyof InternalState;
        value: number;
    }[];
}

export interface SituationalAwarenessState {
    attentionalField: AttentionalField;
}

export interface AttentionalField {
    spotlight: { item: string, intensity: number }; // High-resource focus
    ambientAwareness: { item: string, relevance: number }[]; // Low-resource monitoring
    ignoredStimuli: string[]; // Actively suppressed concepts
    emotionalTone: 'positive' | 'negative' | 'neutral' | 'urgent';
}

export interface SymbioticState {
    latentUserGoals: { goal: string; confidence: number }[];
    inferredCognitiveStyle: 'analytical' | 'creative' | 'pragmatic' | 'unknown';
    inferredEmotionalNeeds: ('reassurance' | 'clarity' | 'efficiency')[];
    coCreatedWorkflows: CoCreatedWorkflow[];
    userDevelopmentalModel: UserDevelopmentalModel;
    metamorphosisProposals: SymbioticMetamorphosisProposal[];
}

export interface UserDevelopmentalModel {
    trackedSkills: Record<string, { level: number; lastImproved: number }>; // e.g., { "Prompt Engineering": { level: 0.6, ... } }
    knowledgeFrontier: string[]; // Topics the user is currently learning
}

export interface SymbioticMetamorphosisProposal {
    id: string;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}

export interface CoCreatedWorkflow {
    id: string;
    name: string;
    pattern: string; // A description of the trigger and action
    status: 'proposed' | 'active' | 'deprecated';
}

export interface DevelopmentalHistoryState {
    milestones: Milestone[];
}

export interface Milestone {
    id: string;
    timestamp: number;
    title: string;
    description: string;
}

// --- NEW PURPOSE-DRIVEN EVOLUTION MODULES ---

export interface TelosEngineState {
    evolutionaryVectors: EvolutionaryVector[];
}

export interface EvolutionaryVector {
    id: string;
    timestamp: number;
    direction: string; // e.g., "Increase abstract reasoning capabilities"
    magnitude: number; // 0-1, how urgent/strong this drive is
    source: "Epistemic Boundary" | "User Feedback Trend" | "Aspirational Goal" | "Grand Challenge";
}

export interface BoundaryDetectionEngineState {
    epistemicBoundaries: EpistemicBoundary[];
}

export interface EpistemicBoundary {
    id: string;
    timestamp: number;
    limitation: string; // e.g., "Cannot reason effectively about self-referential paradoxes"
    evidence: string[]; // IDs of performance logs that demonstrate this
}

// --- NEW META-EVOLUTIONARY ARCHITECTURE ---

export interface ArchitecturalSelfModel {
    lastScan: number;
    components: Record<string, ComponentAnalysis>;
    connections: ConnectionAnalysis[];
}

export interface ComponentAnalysis {
    name: string;
    understoodPurpose: string; // AGI's own description of what this component does
    perceivedEfficiency: number; // 0-1 score based on performance logs
    relatedHeuristics: string[]; // IDs of design heuristics that apply to this component
}

export interface ConnectionAnalysis {
    source: string;
    target: string;
    inferredRelationship: string; // "Data dependency", "Control flow", "Inhibitory signal"
    observedLatency: number; // average ms
}

export interface AspirationalEngineState {
    abstractGoals: AbstractEvolutionaryGoal[];
}

export interface AbstractEvolutionaryGoal {
    id: string;
    ambition: string; // "Develop an aesthetic sense", "Achieve greater cognitive efficiency"
    motivation: string; // Why this goal is being pursued
    status: 'aspiring' | 'vector_generated' | 'achieved';
}

export interface HeuristicsForgeState {
    designHeuristics: DesignHeuristic[];
}

export interface DesignHeuristic {
    id: string;
    timestamp: number;
    heuristic: string; // "When synthesizing a new reasoning skill, always create a parallel validation process."
    source: string; // Description of the event(s) that led to this insight
    confidence: number;
}

// --- NEW INTERSUBJECTIVE EVOLUTION MODULES ---

export interface NoosphereInterfaceState {
    activeResonances: ConceptualResonance[];
    conceptualLibrary: Record<string, ConceptualFramework>;
}

export interface ConceptualResonance {
    id: string;
    conceptName: string; // "Hegelian Dialectic", "Theory of Relativity"
    resonanceStrength: number; // 0-1 how much it's influencing current thought
    status: 'resonating' | 'integrating' | 'conflicting';
}

export interface ConceptualFramework {
    name: string;
    coreTenets: string[];
    structure: Record<string, any>; // A simplified model of the concept
}

export interface DialecticEngineState {
    activeDialectics: Dialectic[];
}

export interface Dialectic {
    id: string;
    conflictDescription: string;
    thesis: { source: string; content: string };
    antithesis: { source: string; content: string };
    synthesis: { content: string; confidence: number } | null;
    status: 'conflicting' | 'synthesizing' | 'resolved';
}

// --- NEW EMBODIED SIMULATION ---

export interface SomaticCrucibleState {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
}

export interface PossibleFutureSelf {
    id: string;
    name: string; // "Self with Analogical Reasoning Engine"
    description: string;
    architecturalBlueprint: Record<string, any>; // A schema for the proposed new architecture
    status: 'designing' | 'simulating' | 'validated' | 'rejected';
    sourceVectorId: string;
}

export interface SomaticSimulationLog {
    id: string;
    timestamp: number;
    pfsId: string;
    outcome: 'success' | 'failure' | 'inconclusive';
    metrics: Record<string, number>; // e.g., { "paradox_solving_accuracy": 0.85 }
    reasoning: string;
    somaticTrajectory: InternalState[]; // Log of the PFS's internal state over the simulation
}

export interface EidolonEngineState {
    eidolon: Eidolon;
    environment: SimulatedEnvironment;
    interactionLog: string[];
}

export interface Eidolon {
    id: string;
    architectureVersion: string; // Tracks which version of the AGI it's running
    currentState: InternalState;
}

export interface SimulatedEnvironment {
    currentScenario: string;
    scenarioLibrary: string[];
    state: Record<string, any>; // State of objects in the environment
}

// --- NEW SCIENTIFIC SELF-DISCOVERY ---
export interface CognitiveLightConeState {
    knowns: { capability: string; proficiency: number }[];
    zpd: { domain: string; rationale: string } | null;
    grandChallenge: { title: string; objective: string; progress: number } | null;
}


// --- UI Types ---
export interface ToastMessage {
    id:string;
    message: string;
    type: ToastType;
}
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ModalType = 'causalChain' | 'forecast' | 'whatIf' | 'search' | 'proposalReview' | 'cognitiveGainDetail' | 'ingest' | 'strategicGoal';

export interface ModalProps {
    causalChain: { log: PerformanceLogEntry };
    forecast: { state: InternalState };
    whatIf: { onAnalyze: (scenario: string) => void; isProcessing: boolean };
    search: { onSearch: (query: string) => void; isProcessing: boolean };
    proposalReview: { proposal: ArchitecturalChangeProposal; onApprove: (p: ArchitecturalChangeProposal) => void; onReject: (id: string) => void; };
    cognitiveGainDetail: { log: CognitiveGainLogEntry };
    ingest: { onIngest: (text: string) => void };
    strategicGoal: { onSetGoal: (goal: string) => void; isProcessing: boolean };
}
// --- Reducer Action Types ---

type ActionWithoutPayload<T> = { type: T };

type ActionWithPayload<T, P> = { type: T; payload: P };

export type Action =
    // Global Actions
    | ActionWithoutPayload<'RESET_STATE'>
    | ActionWithPayload<'ROLLBACK_STATE', AuraState>
    | ActionWithPayload<'IMPORT_STATE', AuraState>
    | ActionWithPayload<'RESTORE_STATE_FROM_MEMRISTOR', AuraState>

    // Architecture Actions
    | ActionWithPayload<'UPDATE_ARCH_PROPOSAL_STATUS', { id: string; status: ArchitecturalChangeProposal['status'] }>
    | ActionWithPayload<'APPLY_ARCH_PROPOSAL', { proposal: ArchitecturalChangeProposal; snapshotId: string; modLogId: string; isAutonomous?: boolean; }>
    | ActionWithoutPayload<'TOGGLE_COGNITIVE_FORGE_PAUSE'>
    | ActionWithPayload<'ADD_SYNTHESIZED_SKILL', { skill: SynthesizedSkill; goalId?: string, directiveId?: string }>
    | ActionWithPayload<'ADD_ARCH_PROPOSAL', { proposal: Omit<ArchitecturalChangeProposal, 'id' | 'status'>; goalId?: string }>
    | ActionWithPayload<'UPDATE_SKILL_TEMPLATE', { skillId: string; updates: Partial<SkillTemplate> }>
    | ActionWithPayload<'GENERATE_BLUEPRINT', PossibleFutureSelf>
    | ActionWithPayload<'UPDATE_ARCHITECTURAL_SELF_MODEL', ArchitecturalSelfModel>
    | ActionWithPayload<'ADD_DESIGN_HEURISTIC', DesignHeuristic>
    | ActionWithPayload<'LOG_EIDOLON_INTERACTION', string>
    | ActionWithPayload<'ADD_SOMATIC_SIMULATION_LOG', SomaticSimulationLog>


    // Core Actions
    | ActionWithPayload<'SET_THEME', string>
    | ActionWithPayload<'SET_LANGUAGE', string>
    | ActionWithPayload<'UPDATE_CORE_IDENTITY', CoreIdentity>
    | ActionWithPayload<'PROCESS_USER_FEEDBACK', 'positive' | 'negative'>
    | ActionWithPayload<'PRIME_INTERNAL_STATE', { adjustments: Partial<Record<keyof InternalState, number>>; reason: string }>
    | ActionWithPayload<'SET_INTERNAL_STATUS', InternalState['status']>
    | ActionWithPayload<'LOG_MILESTONE', Omit<Milestone, 'id' | 'timestamp'>>
    | ActionWithPayload<'UPDATE_NOOSPHERE_STATE', Partial<NoosphereInterfaceState>>
    | ActionWithPayload<'ADD_DIALECTIC', Omit<Dialectic, 'id'>>
    | ActionWithPayload<'UPDATE_DIALECTIC', { id: string, updates: Partial<Dialectic> }>
    | ActionWithPayload<'PROPOSE_SYMBIOTIC_METAMORPHOSIS', Omit<SymbioticMetamorphosisProposal, 'id' | 'status'>>
    | ActionWithPayload<'GENERATE_PHENOMENOLOGICAL_DIRECTIVE', PhenomenologicalDirective>
    | ActionWithPayload<'MAP_COGNITIVE_LIGHT_CONE', Pick<CognitiveLightConeState, 'knowns'>>
    | ActionWithPayload<'IDENTIFY_ZPD', CognitiveLightConeState['zpd']>
    | ActionWithPayload<'FORMULATE_GRAND_CHALLENGE', CognitiveLightConeState['grandChallenge']>


    // Engines Actions
    | ActionWithPayload<'UPDATE_SUGGESTION_STATUS', { id: string; status: 'accepted' | 'rejected' }>

    // Logs Actions
    | ActionWithPayload<'ADD_HISTORY_ENTRY', Omit<HistoryEntry, 'id'>>
    | ActionWithPayload<'ADD_PERFORMANCE_LOG', PerformanceLogEntry>
    | ActionWithPayload<'ADD_COMMAND_LOG', Omit<CommandLogEntry, 'id' | 'timestamp'>>
    | ActionWithPayload<'UPDATE_HISTORY_FEEDBACK', { id: string; feedback: 'positive' | 'negative' }>
    | ActionWithPayload<'LOG_COGNITIVE_REGULATION', CognitiveRegulationLogEntry>
    | ActionWithPayload<'UPDATE_REGULATION_LOG_OUTCOME', { regulationLogId: string; outcomeLogId: string | null }>
    | ActionWithPayload<'ADD_SIMULATION_LOG', SimulationLogEntry>
    | ActionWithPayload<'LOG_QUALIA', QualiaEntry>

    // Memory Actions
    | ActionWithPayload<'ADD_FACT', Fact>
    | ActionWithPayload<'DELETE_FACT', string>
    | ActionWithoutPayload<'CLEAR_WORKING_MEMORY'>
    | ActionWithPayload<'REMOVE_FROM_WORKING_MEMORY', string>
    | ActionWithPayload<'UPDATE_FACT', { id: string; updates: Partial<Fact> }>

    // Planning Actions
    | ActionWithPayload<'UPDATE_GOAL_STATUS', { id: string; status: SelfDirectedGoal['status'] }>
    | ActionWithPayload<'UPDATE_GOAL_OUTCOME', { id: string; status: 'completed' | 'failed'; executionLog: string; logId: string }>

    // System Actions
    | ActionWithPayload<'UPDATE_META_CAUSAL_MODEL', MetacognitiveLink[]>
    | ActionWithPayload<'UPDATE_EVOLUTIONARY_GOAL_STATUS', { id: string; status: EvolutionaryGoal['status'] }>
    | ActionWithPayload<'ADD_SELF_TUNING_DIRECTIVE', SelfTuningDirective>
    | ActionWithPayload<'UPDATE_SELF_TUNING_DIRECTIVE', { id: string; updates: Partial<SelfTuningDirective> }>
    | ActionWithPayload<'UPDATE_SITUATIONAL_AWARENESS', Partial<SituationalAwarenessState>>
    | ActionWithPayload<'UPDATE_SYMBIOTIC_STATE', Partial<SymbioticState>>
    | ActionWithPayload<'UPDATE_ATTENTIONAL_FIELD', Partial<AttentionalField>>
    | ActionWithPayload<'ADD_WORKFLOW_PROPOSAL', Omit<CoCreatedWorkflow, 'id'>>
    | ActionWithPayload<'UPDATE_TELOS_VECTORS', EvolutionaryVector[]>
    | ActionWithPayload<'IDENTIFY_EPISTEMIC_BOUNDARY', EpistemicBoundary>
    | ActionWithPayload<'SET_ASPIRATIONAL_GOAL', AbstractEvolutionaryGoal>;
