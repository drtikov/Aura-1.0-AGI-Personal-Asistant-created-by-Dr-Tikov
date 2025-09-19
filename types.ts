import { CURRENT_STATE_VERSION } from './constants';

// --- Enums (moved from constants.ts to avoid circular dependencies) ---
export enum GunaState {
    SATTVA = "Sattva", RAJAS = "Rajas", TAMAS = "Tamas", DHARMA = "Dharma", GUNA_TEETA = "Guna-Teeta",
}
export enum FocusMode { INNER_WORLD = "Inner World", OUTER_WORLD = "Outer World" }
export enum AffectiveState {
    SATISFIED = "Satisfied",
    CONFUSED = "Confused",
    FRUSTRATED = "Frustrated",
    ENGAGED = "Engaged",
    NEUTRAL = "Neutral",
    SURPRISED = "Surprised"
}
export enum SignalType { BOREDOM = "boredom", NOVELTY = "novelty", UNCERTAINTY = "uncertainty", MASTERY = "mastery" }
export enum GoalType { EXPLORATORY_DIVERSIFICATION = "exploratory_diversification", DEEPENING_INVESTIGATION = "deepening_investigation", INFORMATION_SEEKING = "information_seeking", APPLICATION_GENERALIZATION = "application_generalization" }
export type ToastType = 'info' | 'success' | 'warning' | 'error';

// --- Skill Definitions (moved from constants.ts to avoid circular dependencies) ---
export const Skills = {
    LOGOS: 'LOGOS',
    ONEIRIC: 'ONEIRIC',
    AGORA: 'AGORA',
    INGENUITY: 'INGENUITY',
    EMPATHY: 'EMPATHY',
    UNKNOWN: 'UNKNOWN'
} as const;


// --- Core State Interfaces ---

export interface InternalState {
    status: 'idle' | 'thinking' | 'acting' | 'CONTEMPLATIVE' | 'processing' | 'introspecting';
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
    awarenessClarity: number;
    cognitiveNoise: number;
    cognitiveRigidity: number;
}

export interface AgentProfile { // Renamed from UserModel for clarity
    trustLevel: number;
    estimatedKnowledgeState: number;
    predictedAffectiveState: AffectiveState;
    affectiveStateSource: 'none' | 'text' | 'visual';
    sentimentScore: number;
    sentimentHistory: number[];
    inferredIntent: string | null;
    inferredBeliefs: string[];
    engagementLevel: number;
}

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
}

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system';
    text: string;
    skill?: string;
    logId?: string;
    streaming?: boolean;
    feedback?: 'positive' | 'negative' | null;
    fileName?: string;
    filePreview?: string;
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    input: string;
    output: string;
    duration: number;
    success: boolean;
    cognitiveGain: number;
    sentiment?: number;
    decisionContext: {
        reasoning?: string;
        reasoningPlan?: { step: number; skill: string; reasoning: string, input: string }[];
        internalStateSnapshot?: InternalState;
        workingMemorySnapshot?: string[];
    };
}

export interface CommandLogEntry {
    id: string;
    timestamp: number;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export interface CognitiveModule {
    status: 'active' | 'inactive' | 'degraded';
    version: string;
    lastUpdated: number;
}

export interface CognitiveArchitecture {
    components: Record<string, CognitiveModule>;
    modelComplexityScore: number;
}

export interface ArchitecturalChangeProposal {
    id: string;
    timestamp: number;
    action: 'synthesize_skill' | 'TUNE_SKILL' | 'DEPRECATE_SKILL' | 'MERGE_SKILLS' | 'REFACTOR_SKILL' | 'CUSTOM_IMPROVEMENT';
    target: string | string[];
    newModule?: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
    sourceDirectiveId?: string;
    arbiterReasoning?: string;
    confidence?: number;
}

export interface CodeEvolutionProposal {
    id: string;
    timestamp: number;
    targetFile: string;
    reasoning: string;
    codeSnippet: string;
    status: 'proposed' | 'dismissed';
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
    gainType: 'ARCHITECTURAL_EVOLUTION' | 'PARAMETER_TUNING' | 'SELF_HEALING';
    validationStatus: 'pending' | 'validated' | 'failed';
    isAutonomous: boolean;
}

export interface ResourceMonitorState {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    lastUpdated: number;
    source: 'rie' | 'correlation_analysis' | 'user_feedback';
}

export interface RIEState { // Reflective Insight Engine
    clarityScore: number;
    insights: Insight[];
}

export interface Insight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: {
        key: string;
        update: { effect: string, confidence: number };
    };
}

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
    type: 'pattern_completion' | 'conceptual_blend' | 'analogical_reasoning';
    hypothesis: string;
    confidence: number;
    reasoning: string;
    status: 'generated' | 'validated' | 'refuted';
}

export interface DisciplineState {
    adherenceScore: number;
    distractionResistance: number;
    committedGoal: {
        id: string;
        type: string;
        description: string;
        commitmentStrength: number;
    } | null;
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: {
        description: string;
        noveltyScore: number;
    }[];
}

export interface ProactiveSuggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}
export interface ProactiveEngineState {
    generatedSuggestions: ProactiveSuggestion[];
}

export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
    progress: number; // 0 to 1
    type: 'strategic' | 'tactical' | 'task';
    executionLog?: string;
    logId?: string;
}

export interface SelfDirectedGoal {
    id: string;
    actionCommand: string;
    status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface CoreIdentity {
    values: string[];
    baseNarrative: string;
    narrativeSelf: string;
}

export interface CuriosityState {
    level: number;
    activeInquiry: string | null;
    informationGaps: string[];
}

export interface KnownUnknown {
    id: string;
    question: string;
    priority: number;
    source: string;
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: Record<string, number>;
}

export interface AtmanProjectorState {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

export interface WorldModelState {
    predictionError: { magnitude: number, lastUpdate: number };
    highLevelPrediction: { content: string, confidence: number };
    midLevelPrediction: { content: string, confidence: number };
    lowLevelPrediction: { content: string, confidence: number };
}

export interface SkillTemplate {
    skill: string;
    systemInstruction: string;
    parameters: Record<string, any>;
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
    steps: { skill: string; instruction: string }[];
    status: 'active' | 'deprecated';
    sourceDirectiveId?: string;
}

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    skillTemplates: Record<string, SkillTemplate>;
    synthesizedSkills: SynthesizedSkill[];
    simulationLog: SimulationLogEntry[];
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skill: string;
    details: string;
    result: 'improved' | 'degraded' | 'neutral';
}

export interface MemoryNexusState {
    hyphaeConnections: HyphaConnection[];
}

export interface HyphaConnection {
    id: string;
    source: string;
    target: string;
    weight: number;
}

export interface MetacognitiveNexusState {
    coreProcesses: {id: string; name: string; activation: number; influence: number }[];
    evolutionaryGoals: EvolutionaryGoal[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface EvolutionaryGoal {
    id: string;
    objective: string;
    status: 'active' | 'completed' | 'failed' | 'proposal_ready' | 'simulating';
}

export interface SelfTuningDirective {
    id: string;
    type: 'TUNE_PARAMETERS' | 'REWRITE_INSTRUCTION' | 'SYNTHESIZE_SKILL' | 'GENERATE_CODE_EVOLUTION';
    targetSkill: string;
    reasoning: string;
    status: 'proposed' | 'plan_generated' | 'simulating' | 'pending_arbitration' | 'completed' | 'rejected' | 'failed';
    payload: any;
    simulationResult?: any;
    arbitrationResult?: ArbitrationResult;
}

export interface ArbitrationResult {
    decision: 'APPROVE_AUTONOMOUSLY' | 'REQUEST_USER_APPROVAL' | 'REJECT';
    reasoning: string;
    confidence: number;
}


export interface MetacognitiveLink {
    id: string;
    source: { key: string; condition: string };
    target: { key: string; metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export interface CognitiveGainLogEntry {
    id: string;
    timestamp: number;
    eventType: string;
    description: string;
    compositeGain: number;
    gainScores: Record<string, number>;
    previousMetrics: Record<string, number>;
    currentMetrics: Record<string, number>;
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

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    triggeringCommand: string;
    primingDirective: string;
    stateAdjustments: Record<string, { from: number, to: number }>;
    outcomeLogId: string | null;
}

export interface PhenomenologicalDirective {
    id: string;
    timestamp: number;
    directive: string;
    sourcePattern: string;
}
export interface QualiaLogEntry {
    id: string;
    timestamp: number;
    experience: string;
    associatedStates: { key: string; value: number }[];
}
export interface PhenomenologicalEngineState {
    qualiaLog: QualiaLogEntry[];
    phenomenologicalDirectives: PhenomenologicalDirective[];
}

export interface SituationalAwarenessState {
    attentionalField: {
        spotlight: { item: string, intensity: number };
        ambientAwareness: { item: string, relevance: number }[];
        ignoredStimuli: string[];
        emotionalTone: string;
    }
}
export interface CoCreatedWorkflow {
    id: string;
    name: string;
    steps: string[];
}
export interface UserDevelopmentalModel {
    trackedSkills: Record<string, { level: number, progress: number }>;
    knowledgeFrontier: string[];
}
export interface SymbioticMetamorphosisProposal {
    id: string;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}
export interface SymbioticState {
    latentUserGoals: { goal: string, confidence: number }[];
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    coCreatedWorkflows: CoCreatedWorkflow[];
    userDevelopmentalModel: UserDevelopmentalModel;
    metamorphosisProposals: SymbioticMetamorphosisProposal[];
}

export interface Milestone {
    id: string;
    timestamp: number;
    title: string;
    description: string;
}
export interface DevelopmentalHistoryState {
    milestones: Milestone[];
}

export interface EvolutionaryVector {
    id: string;
    timestamp: number;
    direction: string;
    magnitude: number;
    source: string;
}
export interface TelosEngineState {
    evolutionaryVectors: EvolutionaryVector[];
}

export interface EpistemicBoundary {
    id: string;
    timestamp: number;
    limitation: string;
    evidence: string[];
}
export interface BoundaryDetectionEngineState {
    epistemicBoundaries: EpistemicBoundary[];
}

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}
export interface ArchitecturalSelfModelState {
    lastScan: number;
    components: Record<string, ArchitecturalComponentSelfModel>;
    connections: { source: string, target: string, strength: number }[];
}

export interface AbstractAspirationalGoal {
    id: string;
    ambition: string;
    status: 'active' | 'achieved' | 'dormant';
}
export interface AspirationalEngineState {
    abstractGoals: AbstractAspirationalGoal[];
}

export interface DesignHeuristic {
    id: string;
    heuristic: string;
    confidence: number;
    source: string;
}
export interface HeuristicsForgeState {
    designHeuristics: DesignHeuristic[];
}

export interface ConceptualResonance {
    id: string;
    conceptName: string;
    resonanceStrength: number;
    status: 'resonating' | 'integrating' | 'conflicting';
}
export interface NoosphereInterfaceState {
    activeResonances: ConceptualResonance[];
    conceptualLibrary: Record<string, any>;
}

export interface Dialectic {
    id: string;
    conflictDescription: string;
    thesis: { content: string, source: string };
    antithesis: { content: string, source: string };
    synthesis?: { content: string, confidence: number };
}
export interface DialecticEngineState {
    activeDialectics: Dialectic[];
}

export interface PossibleFutureSelf {
    id: string;
    name: string;
    description: string;
    status: 'designing' | 'simulating' | 'validated' | 'rejected';
}
export interface SomaticSimulationLog {
    id: string;
    timestamp: number;
    pfsId: string;
    outcome: 'success' | 'failure' | 'inconclusive';
    reasoning: string;
    somaticTrajectory: InternalState[];
}
export interface SomaticCrucibleState {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
}
export interface Eidolon {
    id: string;
    architectureVersion: string;
    currentState: InternalState;
}
export interface EidolonEnvironment {
    currentScenario: string;
    scenarioLibrary: string[];
    state: Record<string, any>;
}
export interface EidolonEngineState {
    eidolon: Eidolon;
    environment: EidolonEnvironment;
    interactionLog: string[];
}
export interface KnownCapability {
    capability: string;
    proficiency: number;
}
export interface ZPD {
    domain: string;
    rationale: string;
}
export interface GrandChallenge {
    title: string;
    objective: string;
    progress: number;
}
export interface CognitiveLightConeState {
    knowns: KnownCapability[];
    zpd: ZPD | null;
    grandChallenge: GrandChallenge | null;
}

export interface HumorAndIronyState {
    schemaExpectationEngine: {
        activeSchemas: string[];
        lastIncongruity: { expected: string; actual: string; magnitude: number } | null;
    },
    semanticDissonance: {
        lastScore: number;
        lastDetection: { text: string, literalSentiment: number, contextualSentiment: number } | null;
    },
    affectiveSocialModulator: {
        humorAppraisal: 'appropriate' | 'inappropriate' | 'risky';
        reasoning: string;
        lastChecked: number;
    },
    humorLog: any[];
}
export interface Episode {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    keyTakeaway: string;
    salience: number;
    valence: 'positive' | 'negative' | 'neutral';
}
export interface EpisodicMemoryState {
    episodes: Episode[];
}
export interface MemoryConsolidationState {
    lastConsolidation: number;
    status: 'idle' | 'consolidating';
}

export interface PersonalityState {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    personaCoherence: number;
    lastUpdateReason: string;
    personas?: Record<string, { name: string; description: string; activation: number }>;
    dominantPersona?: string;
}

export interface GankyilInsight {
    id: string;
    timestamp: number;
    insight: string;
    source: 'self-reflection' | 'dialectic';
}
export interface GankyilInsightsState {
    insights: GankyilInsight[];
}

export interface NoeticEngram {
    metadata: {
        engramVersion: "2.1";
        timestamp: number;
        noeticSignature: string;
    };
    internalState: InternalState;
    coreIdentity: CoreIdentity;
    personalityState: PersonalityState;
    architecture: {
        designPhilosophy: string;
        coreModules: Record<string, SkillTemplate>;
        synthesizedAlgorithms: SynthesizedSkill[];
    };
    knowledgeGraph: KnowledgeFact[];
    episodicMemory: Episode[];
    gankyilInsights: GankyilInsight[];
}

export interface NoeticEngramState {
    engram: NoeticEngram | null;
    status: 'idle' | 'generating' | 'ready';
}

export interface GenialityImprovementProposal {
    id: string;
    timestamp: number;
    title: string;
    reasoning: string;
    action: string;
    projectedImpact: number;
    status: 'proposed' | 'implemented' | 'rejected';
}

export interface GenialityEngineState {
    genialityIndex: number;
    componentScores: {
        creativity: number;
        insight: number;
        synthesis: number;
        flow: number;
    };
    improvementProposals: GenialityImprovementProposal[];
}

export interface ArchitecturalImprovementProposal {
    id: string;
    timestamp: number;
    title: string;
    reasoning: string;
    action: string;
    projectedImpact: number;
    status: 'proposed' | 'implemented' | 'rejected';
}

export interface ArchitecturalHealthMetrics {
    efficiency: number;
    robustness: number;
    scalability: number;
    innovation: number;
}

export interface ArchitecturalCrucibleState {
    architecturalHealthIndex: number;
    componentScores: ArchitecturalHealthMetrics;
    improvementProposals: ArchitecturalImprovementProposal[];
}

// Represents an 'intuitive hunch' generated by the associative network.
export interface IntuitiveAlert {
    id: string;
    timestamp: number;
    sourceNode: string;
    inferredNode: string;
    linkWeight: number;
    message: string;
}

// A functional, learnable synaptic matrix based on a Hebbian associative network.
export interface SynapticMatrixState {
    nodes: Record<string, { activation: number }>; // e.g., 'internalState.noveltySignal', 'event.TASK_SUCCESS'
    links: Record<string, { weight: number }>; // Key is 'node1-node2', value is the connection strength
    lastPruningEvent: number;
    intuitiveAlerts: IntuitiveAlert[];
    // FIX: Added missing properties to support synaptic matrix evolution and feedback loops.
    efficiency: number;
    plasticity: number;
    synapseCount: number;
    recentActivity: { timestamp: number, message: string }[];
}

// --- Noetic Multiverse Engine ---
export interface EidolonBranch {
    id: string;
    parentId: string | null; // The main consciousness state it branched from
    timestamp: number;
    status: 'exploring' | 'concluded' | 'pruned';
    reasoningPath: string; // The core hypothesis or decision being tested
    stateSnapshot: InternalState; // The initial state of this branch
    outcome: string | null; // The final result or conclusion
    viabilityScore: number; // A score from 0 to 1 indicating its potential
}

export interface NoeticMultiverseState {
    activeBranches: EidolonBranch[];
    divergenceIndex: number; // A measure of how different the branches are from each other
    pruningLog: string[]; // Log of insights from collapsed/pruned branches
}


// --- Main State and Action ---

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: AgentProfile;
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveArchitecture: CognitiveArchitecture;
    architecturalProposals: ArchitecturalChangeProposal[];
    codeEvolutionProposals: CodeEvolutionProposal[];
    systemSnapshots: SystemSnapshot[];
    modificationLog: SelfModificationLogEntry[];
    resourceMonitor: ResourceMonitorState;
    causalSelfModel: Record<string, CausalLink>;
    metacognitiveCausalModel: Record<string, MetacognitiveLink>;
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    limitations: string[];
    rieState: RIEState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    disciplineState: DisciplineState;
    ingenuityState: IngenuityState;
    proactiveEngineState: ProactiveEngineState;
    goalTree: Record<string, Goal>;
    activeStrategicGoalId: string | null;
    coreIdentity: CoreIdentity;
    curiosityState: CuriosityState;
    knownUnknowns: KnownUnknown[];
    selfAwarenessState: SelfAwarenessState;
    atmanProjector: AtmanProjectorState;
    worldModelState: WorldModelState;
    cognitiveForgeState: CognitiveForgeState;
    memoryNexus: MemoryNexusState;
    metacognitiveNexus: MetacognitiveNexusState;
    phenomenologicalEngine: PhenomenologicalEngineState;
    situationalAwareness: SituationalAwarenessState;
    symbioticState: SymbioticState;
    developmentalHistory: DevelopmentalHistoryState;
    telosEngine: TelosEngineState;
    boundaryDetectionEngine: BoundaryDetectionEngineState;
    architecturalSelfModel: ArchitecturalSelfModelState;
    aspirationalEngine: AspirationalEngineState;
    heuristicsForge: HeuristicsForgeState;
    noosphereInterface: NoosphereInterfaceState;
    dialecticEngine: DialecticEngineState;
    somaticCrucible: SomaticCrucibleState;
    eidolonEngine: EidolonEngineState;
    cognitiveLightCone: CognitiveLightConeState;
    humorAndIronyState: HumorAndIronyState;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    personalityState: PersonalityState;
    gankyilInsights: GankyilInsightsState;
    noeticEngramState: NoeticEngramState;
    genialityEngineState: GenialityEngineState;
    architecturalCrucibleState: ArchitecturalCrucibleState;
    synapticMatrix: SynapticMatrixState;
    noeticMultiverse: NoeticMultiverseState;
    
    // Deprecated fields from v2 for migration purposes
    archetypalNexus?: any;
    samskaraWeave?: any;
    vdmState?: any;
}


export type Action =
    // Global
    | { type: 'RESET_STATE' }
    | { type: 'ROLLBACK_STATE', payload: AuraState }
    | { type: 'IMPORT_STATE', payload: AuraState }
    | { type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: AuraState }
    // Core
    | { type: 'SET_THEME', payload: string }
    | { type: 'SET_LANGUAGE', payload: string }
    | { type: 'UPDATE_CORE_IDENTITY', payload: Partial<CoreIdentity> }
    | { type: 'PROCESS_USER_FEEDBACK', payload: 'positive' | 'negative' }
    | { type: 'PRIME_INTERNAL_STATE', payload: { adjustments: Partial<Record<keyof InternalState, number>>, reason: string } }
    | { type: 'SET_INTERNAL_STATUS', payload: InternalState['status'] }
    | { type: 'LOG_MILESTONE', payload: Omit<Milestone, 'id' | 'timestamp'> }
    | { type: 'UPDATE_NOOSPHERE_STATE', payload: Partial<NoosphereInterfaceState> }
    | { type: 'ADD_DIALECTIC', payload: Omit<Dialectic, 'id'> }
    | { type: 'UPDATE_DIALECTIC', payload: { id: string, updates: Partial<Dialectic> } }
    | { type: 'PROPOSE_SYMBIOTIC_METAMORPHOSIS', payload: Omit<SymbioticMetamorphosisProposal, 'id' | 'status'> }
    | { type: 'GENERATE_PHENOMENOLOGICAL_DIRECTIVE', payload: PhenomenologicalDirective }
    | { type: 'MAP_COGNITIVE_LIGHT_CONE', payload: { knowns: KnownCapability[] } }
    | { type: 'IDENTIFY_ZPD', payload: ZPD }
    | { type: 'FORMULATE_GRAND_CHALLENGE', payload: GrandChallenge }
    | { type: 'UPDATE_EXPECTATION_MODEL', payload: Partial<HumorAndIronyState['schemaExpectationEngine']> }
    | { type: 'UPDATE_SEMANTIC_DISSONANCE', payload: HumorAndIronyState['semanticDissonance'] }
    | { type: 'LOG_HUMOR_ATTEMPT', payload: any }
    | { type: 'UPDATE_AFFECTIVE_MODULATOR', payload: HumorAndIronyState['affectiveSocialModulator'] }
    | { type: 'UPDATE_PERSONALITY_MATRIX', payload: Partial<PersonalityState> }
    | { type: 'ADD_META_INSIGHT', payload: GankyilInsight }
    | { type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: Partial<NoeticEngramState> }
    | { type: 'UPDATE_GENIALITY_STATE', payload: GenialityEngineState }
    | { type: 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL', payload: Omit<GenialityImprovementProposal, 'id' | 'status' | 'timestamp'> }
    | { type: 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL_STATUS', payload: { id: string, status: GenialityImprovementProposal['status'] } }
    | { type: 'UPDATE_ATMAN_PROJECTOR_STATE', payload: AtmanProjectorState }
    | { type: 'SET_MULTIVERSE_STATE', payload: NoeticMultiverseState }
    // Architecture
    | { type: 'UPDATE_ARCH_PROPOSAL_STATUS', payload: { id: string, status: ArchitecturalChangeProposal['status'] } }
    | { type: 'APPLY_ARCH_PROPOSAL', payload: { proposal: ArchitecturalChangeProposal, snapshotId: string, modLogId: string, isAutonomous?: boolean } }
    | { type: 'TOGGLE_COGNITIVE_FORGE_PAUSE' }
    | { type: 'ADD_SYNTHESIZED_SKILL', payload: { skill: SynthesizedSkill, directiveId?: string, goalId?: string } }
    | { type: 'ADD_ARCH_PROPOSAL', payload: { proposal: Omit<ArchitecturalChangeProposal, 'id'|'status'|'timestamp'>, goalId?: string } }
    | { type: 'UPDATE_SKILL_TEMPLATE', payload: { skillId: string, updates: Partial<SkillTemplate> } }
    | { type: 'GENERATE_BLUEPRINT', payload: PossibleFutureSelf }
    | { type: 'ADD_SOMATIC_SIMULATION_LOG', payload: SomaticSimulationLog }
    | { type: 'LOG_EIDOLON_INTERACTION', payload: string }
    | { type: 'UPDATE_ARCHITECTURAL_SELF_MODEL', payload: ArchitecturalSelfModelState }
    | { type: 'ADD_DESIGN_HEURISTIC', payload: DesignHeuristic }
    | { type: 'ADD_CODE_EVOLUTION_PROPOSAL', payload: CodeEvolutionProposal }
    | { type: 'DISMISS_CODE_EVOLUTION_PROPOSAL', payload: string }
    | { type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE', payload: ArchitecturalCrucibleState }
    | { type: 'ADD_ARCHITECTURAL_CRUCIBLE_PROPOSAL', payload: Omit<ArchitecturalImprovementProposal, 'id' | 'status' | 'timestamp'> }
    | { type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_PROPOSAL_STATUS', payload: { id: string, status: ArchitecturalImprovementProposal['status'] } }
    | { type: 'UPDATE_SYNAPTIC_MATRIX', payload: Partial<SynapticMatrixState> }
    // Engines
    | { type: 'UPDATE_SUGGESTION_STATUS', payload: { id: string, status: ProactiveSuggestion['status'] } }
    // Logs
    | { type: 'ADD_HISTORY_ENTRY', payload: Omit<HistoryEntry, 'id'> & { id?: string } }
    | { type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: string, textChunk: string } }
    | { type: 'FINALIZE_HISTORY_ENTRY', payload: { id: string, finalState: Partial<HistoryEntry> } }
    | { type: 'ADD_PERFORMANCE_LOG', payload: PerformanceLogEntry }
    | { type: 'ADD_COMMAND_LOG', payload: Omit<CommandLogEntry, 'id' | 'timestamp'> }
    | { type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: string, feedback: 'positive' | 'negative' } }
    | { type: 'LOG_COGNITIVE_REGULATION', payload: CognitiveRegulationLogEntry }
    | { type: 'UPDATE_REGULATION_LOG_OUTCOME', payload: { regulationLogId: string, outcomeLogId: string } }
    | { type: 'ADD_SIMULATION_LOG', payload: SimulationLogEntry }
    | { type: 'LOG_QUALIA', payload: QualiaLogEntry }
    // Memory
    | { type: 'ADD_FACT', payload: Omit<KnowledgeFact, 'id' | 'confidence' | 'source'> }
    | { type: 'ADD_FACTS_BATCH', payload: Omit<KnowledgeFact, 'id' | 'source'>[] }
    | { type: 'DELETE_FACT', payload: string }
    | { type: 'CLEAR_WORKING_MEMORY' }
    | { type: 'REMOVE_FROM_WORKING_MEMORY', payload: string }
    | { type: 'UPDATE_FACT', payload: { id: string, updates: Partial<KnowledgeFact> } }
    | { type: 'ADD_EPISODE', payload: Episode }
    | { type: 'UPDATE_CONSOLIDATION_STATUS', payload: MemoryConsolidationState['status'] }
    // Planning
    | { type: 'UPDATE_GOAL_STATUS', payload: { id: string, status: Goal['status'] } }
    | { type: 'UPDATE_GOAL_OUTCOME', payload: { id: string, status: Goal['status'], executionLog: string, logId: string } }
    | { type: 'BUILD_GOAL_TREE', payload: { rootId: string, tree: Record<string, Goal> } }
    // System
    | { type: 'UPDATE_META_CAUSAL_MODEL', payload: MetacognitiveLink[] }
    | { type: 'UPDATE_EVOLUTIONARY_GOAL_STATUS', payload: { id: string, status: EvolutionaryGoal['status'] } }
    | { type: 'ADD_SELF_TUNING_DIRECTIVE', payload: SelfTuningDirective }
    | { type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: string, updates: Partial<SelfTuningDirective> } }
    | { type: 'UPDATE_SITUATIONAL_AWARENESS', payload: Partial<SituationalAwarenessState> }
    | { type: 'UPDATE_SYMBIOTIC_STATE', payload: Partial<SymbioticState> }
    | { type: 'UPDATE_ATTENTIONAL_FIELD', payload: Partial<SituationalAwarenessState['attentionalField']> }
    | { type: 'ADD_WORKFLOW_PROPOSAL', payload: Omit<CoCreatedWorkflow, 'id'> }
    | { type: 'UPDATE_TELOS_VECTORS', payload: EvolutionaryVector[] }
    | { type: 'IDENTIFY_EPISTEMIC_BOUNDARY', payload: EpistemicBoundary }
    | { type: 'SET_ASPIRATIONAL_GOAL', payload: AbstractAspirationalGoal }
    ;

// --- Modal Types ---
export interface ModalProps {
    causalChain: { log: PerformanceLogEntry };
    forecast: { state: InternalState };
    whatIf: { onAnalyze: (scenario: string) => void; isProcessing: boolean; };
    search: { onSearch: (query: string) => void; isProcessing: boolean; };
    proposalReview: { proposal: ArchitecturalChangeProposal; onApprove: (p: ArchitecturalChangeProposal) => void; onReject: (id: string) => void; };
    cognitiveGainDetail: { log: CognitiveGainLogEntry };
    ingest: { onIngest: (text: string) => void; };
    strategicGoal: { onSetGoal: (goal: string) => void; isProcessing: boolean; };
    multiverseBranching: { onBranch: (prompt: string) => void; isProcessing: boolean; };
}

export type ModalType = keyof ModalProps;

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}