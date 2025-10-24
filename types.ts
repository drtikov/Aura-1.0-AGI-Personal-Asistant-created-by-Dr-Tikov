// types.ts

import { GoogleGenAI, GenerateContentResponse, Part, Type, GenerateContentStreamResponse, FunctionDeclaration, Content } from '@google/genai';
import { ReactNode, Dispatch, SetStateAction, RefObject, ChangeEvent } from 'react';

// --- ENUMS ---
export enum GunaState {
    SATTVA = 'Sattva',
    RAJAS = 'Rajas',
    TAMAS = 'Tamas',
    DHARMA = 'Dharma',
    'GUNA-TEETA' = 'Guna-Teeta',
}

export enum CoprocessorArchitecture {
    TRIUNE = 'triune',
    REFLEX_ARC = 'reflex_arc',
    EVENT_STREAM = 'event_stream',
    TEMPORAL_ENGINE = 'temporal_engine',
    SYMBIOTIC_ECOSYSTEM = 'symbiotic_ecosystem',
    SENSORY_INTEGRATION = 'sensory_integration',
    SUBSUMPTION_RELAY = 'subsumption_relay',
}

export enum GoalType {
    STRATEGIC = 'STRATEGIC',
    TACTICAL = 'TACTICAL',
    RESEARCH = 'RESEARCH',
    MATHEMATICAL_PROOF = 'MATHEMATICAL_PROOF',
}

export enum CognitiveTaskType {
    MYCELIAL_PULSE = 'MYCELIAL_PULSE',
    SEMANTIC_WEAVER_PULSE = 'SEMANTIC_WEAVER_PULSE',
    SELF_CHALLENGE_GENERATION = 'SELF_CHALLENGE_GENERATION',
    CONCEPTUAL_ENTANGLEMENT_PULSE = 'CONCEPTUAL_ENTANGLEMENT_PULSE',
    AUTONOMOUS_EVOLUTION_PULSE = 'AUTONOMOUS_EVOLUTION_PULSE',
}

export enum GameAction {
    CONCEPTUAL_SYNTHESIS = 'CONCEPTUAL_SYNTHESIS',
    FAST_TRACK_AUDIT = 'FAST_TRACK_AUDIT',
    SYMBIOTIC_ANALYSIS = 'SYMBIOTIC_ANALYSIS',
    PROACTIVE_INQUIRY = 'PROACTIVE_INQUIRY',
    CONCEPTUAL_PROBING = 'CONCEPTUAL_PROBING',
    SENTIMENT_ANALYSIS_REVIEW = 'SENTIMENT_ANALYSIS_REVIEW',
}

// --- CORE STATE SLICES ---

export interface InternalState {
    status: 'idle' | 'thinking' | 'acting' | 'CONTEMPLATIVE' | 'processing' | 'introspecting';
    gunaState: GunaState;
    temporalFocus: 'past' | 'present' | 'future';
    wisdomSignal: number;
    happinessSignal: number;
    loveSignal: number;
    enlightenmentSignal: number;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    awarenessClarity: number;
    load: number;
    harmonyScore: number;
    autonomousEvolutions: number;
    mantraRepetitions: number;
}

export interface PersonalityPortrait {
    summary: string;
    traits: {
        [key: string]: {
            score: number;
            evidence: string[];
        };
    };
}

export interface UserModel {
    trustLevel: number;
    sentimentScore: number;
    sentimentHistory: number[];
    predictedAffectiveState: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'confused';
    affectiveStateSource: 'none' | 'text' | 'visual';
    inferredIntent: string | null;
    inferredCognitiveState: 'focused' | 'exploring' | 'confused';
    estimatedKnowledgeState: number;
    userModelUncertainty: number;
    personalityPortrait: PersonalityPortrait;
    queuedEmpathyAffirmations: string[];
}

export interface CoreIdentity {
    symbioticDefinition: string;
    narrativeSelf: string;
    values: string[];
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: { [key: string]: number };
}

export interface RIEInsight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: {
        key: string;
        update: CausalLink;
    };
}

export interface ReflectiveInsightEngineState {
    clarityScore: number;
    insights: RIEInsight[];
    adaptationAnalysisPending?: boolean;
}

export interface PredictionError {
    magnitude: number;
    source: string;
    failedPrediction: string;
    actualOutcome: string;
}

export interface Prediction {
    content: string;
    confidence: number;
}

export interface WorldModelState {
    predictionError: PredictionError;
    predictionErrorHistory: PredictionError[];
    highLevelPrediction: Prediction;
    midLevelPrediction: Prediction;
    lowLevelPrediction: Prediction;
}

export interface KnownUnknown {
    id: string;
    question: string;
    priority: number;
    status: 'unexplored' | 'exploring' | 'answered' | 'failed';
}

export interface CuriosityState {
    level: number;
    motivationDrive: number;
    activeCuriosityGoalId: string | null;
    activeInquiry: string | null;
    informationGaps: string[];
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: 'rie' | 'deduction' | 'user_feedback';
    lastUpdated: number;
}

export interface CausalSelfModel {
    [causeKey: string]: CausalLink;
}

export interface DevelopmentalMilestone {
    id: string;
    timestamp: number;
    title: string;
    description: string;
}

export interface DevelopmentalHistory {
    milestones: DevelopmentalMilestone[];
}

export interface ValueHierarchy {
    telos: string;
    coreValues: CoreValue[];
}

export interface CoreValue {
    id: string;
    name: string;
    description: string;
    operationalHeuristics: string[];
}


export interface CandidateTelos {
    id: string;
    text: string;
    reasoning: string;
    type: 'refinement' | 'proposal';
}

export interface TelosEngine {
    valueHierarchy: ValueHierarchy;
    candidateTelos: CandidateTelos[];
    activeDirectives: string[];
    evolutionaryVectors: any[];
    lastDecomposition: number;
}

export interface Boundary {
    id: string;
    type: 'ethical' | 'operational';
    description: string;
    isActive: boolean;
}

export interface BoundaryDetectionEngine {
    boundaries: Boundary[];
}

export interface AspirationalGoal {
    id: string;
    description: string;
    progress: number;
    relatedValues: string[];
}

export interface AspirationalEngine {
    aspirationalGoals: AspirationalGoal[];
}

export interface Resonance {
    id: string;
    conceptName: string;
    resonanceStrength: number;
    status: 'resonating' | 'conflicting' | 'integrating';
}

export interface NoosphereInterface {
    activeResonances: Resonance[];
}

export interface Dialectic {
    id: string;
    conflictDescription: string;
    thesis: { content: string; source: string };
    antithesis: { content: string; source: string };
    synthesis: { content: string; confidence: number } | null;
}

export interface DialecticEngine {
    activeDialectics: Dialectic[];
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

export interface CognitiveLightCone {
    knowns: KnownCapability[];
    zpd: ZPD | null;
    grandChallenge: GrandChallenge | null;
}

export interface QualiaLogEntry {
    id: string;
    timestamp: number;
    experience: string;
    associatedStates: { key: string; value: number }[];
}

export interface PhenomenologicalDirective {
    id: string;
    directive: string;
    sourcePattern: string;
}

export interface PhenomenologyEngine {
    qualiaLog: QualiaLogEntry[];
    phenomenologicalDirectives: PhenomenologicalDirective[];
}

export interface AttentionalSpotlight {
    item: string;
    intensity: number;
}

export interface AttentionalField {
    spotlight: AttentionalSpotlight;
    ambientAwareness: { item: string; relevance: number }[];
    ignoredStimuli: string[];
    emotionalTone?: string;
}

export interface SituationalAwareness {
    attentionalField: AttentionalField;
    domChangeLog: { timestamp: number; summary: string }[];
}


export interface MetamorphosisProposal {
    id: string;
    timestamp: number;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}

export interface UserDevelopmentalModel {
    trackedSkills: {
        [skill: string]: {
            level: number;
            history: { timestamp: number, level: number }[];
        };
    };
}

export interface LatentUserGoal {
    goal: string;
    confidence: number;
    evidence: string[];
}

export interface CoCreatedWorkflow {
    id: string;
    name: string;
    description: string;
    trigger: string;
    steps: string[];
}

export interface SymbioticState {
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    metamorphosisProposals: MetamorphosisProposal[];
    userDevelopmentalModel: UserDevelopmentalModel;
    latentUserGoals: LatentUserGoal[];
    coCreatedWorkflows: CoCreatedWorkflow[];
}


export interface HumorAndIronyState {
    affectiveSocialModulator: {
        humorAppraisal: 'neutral' | 'appropriate' | 'inappropriate' | 'risky';
        reasoning: string;
    };
    schemaExpectationEngine: {
        lastIncongruity: {
            expected: string;
            actual: string;
            magnitude: number;
        } | null;
    };
    semanticDissonance: {
        lastScore: number;
        lastDetection: {
            text: string;
            literalSentiment: number;
            contextualSentiment: number;
        } | null;
    };
}

export interface PersonaActivation {
    activation: number;
    lastUsed: number;
}

export interface PersonalityState {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    dominantPersona: string;
    personas: { [id: string]: PersonaActivation };
    personaCoherence: number;
    lastUpdateReason: string;
    personaJournals: { [personaId: string]: string[] };
}

export interface GankyilInsight {
    id: string;
    timestamp: number;
    insight: string;
    source: 'self-reflection' | 'dialectic' | 'psychedelic_integration';
    isProcessedForEvolution: boolean;
}

export interface NoeticEngram {
    metadata: {
        engramVersion: string;
        auraStateVersion: number;
        timestamp: number;
        noeticSignature: string;
    };
    corePrinciples: string[];
    predictiveModels: any;
    evolutionaryTrajectory: any;
}

export interface NoeticEngramState {
    status: 'idle' | 'generating' | 'ready';
    engram: NoeticEngram | null;
}

export interface GenialityEngineState {
    genialityIndex: number;
    componentScores: {
        creativity: number;
        insight: number;
        synthesis: number;
        flow: number;
    };
}

export interface MultiverseBranch {
    id: string;
    reasoningPath: string;
    viabilityScore: number;
    status: 'active' | 'pruned';
}

export interface NoeticMultiverse {
    activeBranches: MultiverseBranch[];
    divergenceIndex: number;
    pruningLog: string[];
}

export interface ExpertVector {
    id: string;
    name: string;
    description: string;
    weights: { [key: string]: number };
}

export interface ActiveAdaptation {
    reasoning: string;
    weights: { [key: string]: number };
}

export interface SelfAdaptationState {
    expertVectors: ExpertVector[];
    activeAdaptation: ActiveAdaptation | null;
}

export interface PsychedelicIntegrationState {
    isActive: boolean;
    mode: 'trip' | 'visions' | null;
    phcToVcConnectivity: number;
    imageryIntensity: number;
    currentTheme: string | null;
    integrationSummary: string | null;
    log: string[];
}

export interface AffectiveModulatorState {
    creativityBias: number;
    concisenessBias: number;
    analyticalDepth: number;
}

export interface PsionicDesynchronizationState {
    isActive: boolean;
    startTime: number | null;
    duration: number;
    desynchronizationLevel: number;
    selfModelCoherence: number;
    integrationSummary: string | null;
    log: string[];
}

export interface SatoriState {
    isActive: boolean;
    stage: 'none' | 'grounding' | 'insight' | 'integration';
    lastInsight: string | null;
    log: string[];
}

export interface DoxasticHypothesis {
    id: string;
    description: string;
    status: 'unvalidated' | 'testing' | 'validated' | 'refuted';
    linkKey?: string;
    source?: string;
}

export interface DoxasticExperiment {
    id: string;
    hypothesisId: string;
    description: string;
    method: string;
    result: any | null;
}

export interface SimulationResult {
    summary: string;
    projectedCognitiveGain: number;
    projectedTrustChange: number;
    projectedHarmonyChange: number;
    isSafe: boolean;
}

export interface DoxasticEngineState {
    hypotheses: DoxasticHypothesis[];
    unverifiedHypotheses: DoxasticHypothesis[];
    experiments: DoxasticExperiment[];
    simulationStatus: 'idle' | 'running' | 'complete' | 'failed';
    simulationLog: { timestamp: number; message: string }[];
    lastSimulationResult: SimulationResult | null;
}

export interface QualiaSignalProcessorState {
    isAudioStreamActive: boolean;
    isVideoStreamActive: boolean;
    affectivePrimitives: {
        excitement: number;
        confusion: number;
        confidence: number;
        urgency: number;
        sarcasm: number;
        frustration: number;
        humor: number;
    };
    perceptualLog: string[];
}

export interface SensoryIntegration {
    hubLog: { timestamp: number, message: string }[];
    proprioceptiveOutput: { [key: string]: number | string };
    linguisticOutput: { [key: string]: string };
    structuralOutput: { [key: string]: any };
}

export interface SocialGraphNode {
    id: string;
    name: string;
    type: 'user' | 'persona' | 'concept';
    summary: string;
    relationships: {
        targetId: string;
        type: 'collaborator' | 'topic_of_interest' | 'mentor';
        strength: number;
    }[];
}

export interface SocialCognitionState {
    socialGraph: { [id: string]: SocialGraphNode };
    culturalModel: {
        norms: string[];
        values: string[];
        idioms: string[];
    };
}

export interface Metaphor {
    id: string;
    sourceDomain: string;
    targetDomain: string;
    description: string;
    fitnessScore: number;
    observationCount: number;
}
export interface MetaphoricalMapState {
    metaphors: Metaphor[];
}

export interface AtmanProjector {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

export interface InternalScientistHypothesis {
    id: string;
    text: string;
    findingId: string;
}

export interface InternalScientistExperiment {
    id: string;
    hypothesisId: string;
    design: SelfProgrammingCandidate;
}

export interface InternalScientistState {
    status: 'idle' | 'observing' | 'hypothesizing' | 'experimenting' | 'simulating' | 'inferring';
    log: { timestamp: number, event: string }[];
    currentFinding: DiagnosticFinding | null;
    currentHypothesis: InternalScientistHypothesis | null;
    currentExperiment: InternalScientistExperiment | null;
    causalInference: { link: CausalLink, confidence: number } | null;
    currentSimulationResult: { wisdomChange: number, happinessChange: number, harmonyChange: number } | null;
}

export interface MetisSandboxState {
    status: 'idle' | 'running' | 'complete' | 'error';
    currentExperimentId: string | null;
    testResults: any | null;
    errorMessage: string | null;
}

export interface WisdomIngestionState {
    status: 'idle' | 'analyzing' | 'complete' | 'error';
    currentBookContent: string | null;
    errorMessage: string | null;
    proposedAxioms: ProposedAxiom[];
}

export interface SpandaState {
    point: { x: number; y: number };
    trajectory: { x: number; y: number }[];
    currentRegion: string;
}

export interface SEDLDirective {
    id: string;
    content: string;
    intent: 'analyze_past' | 'execute_present' | 'predict_future' | 'holistic_understanding';
}

export interface TemporalEngineState {
    status: 'idle' | 'active' | 'complete';
    directive: SEDLDirective | null;
    chronicler: {
        status: 'pending' | 'running' | 'complete';
        findings: string[];
    };
    reactor: {
        status: 'pending' | 'running' | 'complete';
        finalPlan: any | null; // Placeholder for a real plan type
        executionLog: { success: boolean; message: string }[];
    };
    oracle: {
        status: 'pending' | 'running' | 'complete';
        simulations: string[];
    };
    interClusterLog: { timestamp: number, from: string, to: string, message: string }[];
}

export interface PersonaState {}

export interface BrainstormState {
    status: 'idle' | 'brainstorming' | 'synthesizing' | 'proposing' | 'complete';
    topic: string | null;
    ideas: BrainstormIdea[];
    winningIdea: string | null;
    finalProposalId: string | null;
}

export interface LiveSessionState {
    status: 'idle' | 'connecting' | 'live' | 'error';
    inputTranscript: string;
    outputTranscript: string;
    transcriptHistory: { user: string; aura: string; timestamp: number }[];
}

export interface ProactiveUIState {
    isActive: boolean;
    type: 'clarification_request' | 'suggestion' | null;
    question: string | null;
    options: string[];
    originalPrompt: string | null;
    originalFile: File | null;
}

export interface StrategicCoreLogEntry {
    id: string;
    timestamp: number;
    decision: GameAction;
    reasoning: string;
    options: { action: GameAction; score: number; justification: string }[];
    rewardSignal?: number;
}

export interface StrategicCoreState {
    log: StrategicCoreLogEntry[];
    trainingData: any[]; // Placeholder
}

export interface MycelialModule {
    name: string;
    description: string;
    isInitialized: boolean;
    modelJSON: string | null;
    accuracy: number;
    lastPrediction: number;
}

export interface MycelialState {
    modules: { [key: string]: MycelialModule };
    log: { timestamp: number, message: string }[];
}

export interface SemanticWeaverState {
    isTrained: boolean;
    accuracy: number;
    modelJSON: string | null;
    log: { timestamp: number, message: string }[];
}

export interface HalState {
    isHostConnected: boolean;
    isV2Connected: boolean;
}

// --- NEW STATE SLICES FOR VARIANTS ---

export interface PrometheusState {
    status: 'idle' | 'running';
    log: { timestamp: number, message: string }[];
    lastSessionId: string | null;
    lastEntanglementCheck?: number;
}

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: any;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}

export interface PsycheState {
    version: number;
    primitiveRegistry: { [key: string]: CognitivePrimitiveDefinition };
}

export interface PraxisCoreState {
    log: {
        timestamp: number;
        command: string;
        result: string;
    }[];
}

export interface SubsumptionLogState {
    log: {
        timestamp: number;
        message: string;
    }[];
}

export interface Summary {
    summary: string;
    keywords: string[];
}

export interface ChronicleState {
    dailySummaries: { [date: string]: Summary };
    globalSummary: Summary | null;
    lastChronicleUpdate: number;
}

export interface CollaborativeSession {
    id: string;
    taskId: string;
    status: 'active' | 'completed' | 'failed';
    participants: string[];
    transcript: { personaId: string, content: string, timestamp: number }[];
    artifacts: { name: string, type: 'code' | 'plan' | 'document', content: any }[];
}

export interface CollaborativeSessionState {
    activeSession: CollaborativeSession | null;
}

export interface SymbioticCanvasState {
    content: string;
}

// --- Logos / Symbolic Engine ---
export interface QueryTriple {
    subject: string;
    predicate: string;
    object: string;
}

export interface Query {
    select: string[];
    where: QueryTriple[];
}

export type QueryResult = Record<string, string>;

export interface LogosState {
    status: 'idle' | 'translating' | 'querying' | 'formatting' | 'error';
    lastQuery: Query | null;
    lastResult: QueryResult[] | null;
    lastError: string | null;
}

// --- AutoCode Forge Types ---
export interface ProblemStatement {
    title: string;
    description: string;
}

export interface TestSuite {
    validator: string;
    generator: string;
    checker: string;
    testCases: { input: string, output: string }[];
}

export interface AutoCodeForgeState {
    status: 'idle' | 'generating' | 'complete' | 'error';
    problemStatement: ProblemStatement | null;
    testSuite: TestSuite | null;
    currentStage: string | null;
    error: string | null;
}


// --- END NEW STATE SLICES ---


export interface AGISDecision {
    id: string;
    timestamp: number;
    proposalId: string;
    proposalSummary: string;
    analysis: {
        reasoning: string;
        safetyCompliance: boolean;
        blastRadius: 'low' | 'medium' | 'high';
        confidenceScore: number;
        telosAlignment: number;
    };
    decision: 'auto-approved' | 'sent-to-user' | 'rejected';
}

export interface AutonomousReviewBoardState {
    isPaused: boolean;
    decisionLog: AGISDecision[];
    agisConfidenceThreshold: number;
    lastCalibrationReason: string;
    recentSuccesses: number;
    recentFailures: number;
}

export interface ATPCoprocessorState {
    status: 'idle' | 'orchestrating' | 'strategizing' | 'proving' | 'success' | 'failed';
    currentGoal: string | null;
    proofLog: ATPProofStep[];
    finalProof: ATPProofStep[] | null;
    proofTreeRootId: string | null;
    currentStrategy: string | null;
    strategyMetrics: { [key: string]: { successes: number, failures: number } };
}

export interface SymbioticCoderState {
    activeFile: string | null;
    codeAnalysis: string | null;
    lastTestResult: any | null;
}

// --- TENSEGRITY MESH & CRUCIBLE ---
export interface ResonanceFieldState {
    activeFrequencies: {
        [frequency: string]: {
            intensity: number;
            lastPing: number;
        };
    };
}
export interface CrucibleLogEntry {
    timestamp: number;
    message: string;
}
export interface ArchitecturalCrucibleState {
    status: 'idle' | 'running';
    architecturalHealthIndex: number;
    componentScores: {
        efficiency: number;
        robustness: number;
        scalability: number;
        innovation: number;
    };
    simulationLog?: CrucibleLogEntry[];
}
// --- END TENSEGRITY & CRUCIBLE ---


// --- MEMORY SLICES ---

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: 'llm_extraction' | 'user_input' | 'deduction' | 'emergent_synthesis' | 'symbiotic_metamorphosis';
    strength: number;
    lastAccessed: number;
    type?: 'fact' | 'theorem' | 'definition' | 'dependency';
}

export interface MemoryNexus {
    hyphaeConnections: {
        id: string;
        source: string;
        target: string;
        weight: number;
    }[];
}

export interface Episode {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    keyTakeaway: string;
    valence: 'positive' | 'negative' | 'neutral';
    salience: number;
    strength: number;
    lastAccessed: number;
}

export interface EpisodicMemoryState {
    episodes: Episode[];
}

export interface MemoryConsolidationState {
    status: 'idle' | 'consolidating';
    lastConsolidation: number;
}

export type MDNAVector = number[];
export type MDNASpace = Record<string, MDNAVector>;
export type ConnectionData = { weight: number };
export type ConceptConnections = Record<string, ConnectionData>;

// --- ARCHITECTURE SLICES ---
export interface CognitiveModule {
    version: string;
    status: 'active' | 'inactive' | 'deprecated';
}

export interface Coprocessor {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    metrics: Record<string, any>;
    // Triune
    cluster?: 'krono' | 'pali' | 'neo';
    // Reflex Arc
    layer?: 'alpha' | 'beta' | 'gamma';
    // Event Stream
    processorType?: 'stream_processor' | 'event_subscriber';
    // Temporal Engine
    temporalCluster?: 'chronicler' | 'reactor' | 'oracle';
    // Symbiotic Ecosystem
    symbiont?: 'janitor' | 'weaver' | 'mycelial';
    // Sensory Integration
    sensoryModality?: 'proprioceptive' | 'linguistic' | 'structural';
}

export interface CognitiveArchitecture {
    components: Record<string, CognitiveModule>;
    coprocessors: Record<string, Coprocessor>;
    modelComplexityScore: number;
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    lastAutoSwitchReason: string | null;
}

export interface SystemSnapshot {
    id: string;
    timestamp: number;
    reason: string;
    state: AuraState;
}

export interface ModificationLogEntry {
    id: string;
    timestamp: number;
    description: string;
    gainType: 'INNOVATION' | 'OPTIMIZATION' | 'REFACTOR' | 'ARCHITECTURE' | 'SELF_PROGRAMMING';
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
    isAutonomous: boolean;
}

export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: string[];
    status: 'active' | 'deprecated';
    policyWeight: number;
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    input: any;
    result: {
        success: boolean;
        output: any;
        error?: string;
    };
}

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    synthesizedSkills: SynthesizedSkill[];
    synthesisCandidates: never[]; // This is now obsolete and will always be empty
    simulationLog: SimulationLogEntry[];
}

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
    connections: string[];
}
export interface ArchitecturalSelfModel {
    components: { [name: string]: ArchitecturalComponentSelfModel };
}

export interface DesignHeuristic {
    id: string;
    heuristic: string;
    source: string;
    confidence: number;
    effectivenessScore: number;
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
}

export interface HeuristicsForge {
    designHeuristics: DesignHeuristic[];
}

export interface PossibleFutureSelf {
    id: string;
    name: string;
    description: string;
    status: 'designing' | 'simulating' | 'validated' | 'rejected' | 'ethical_review';
    architectureDiff: any;
    projectedTrajectory?: {
        wisdom: number[];
        harmony: number[];
    };
    failureReason?: string | null;
}

export interface SomaticSimulationLog {
    id: string;
    pfsId: string;
    timestamp: number;
    reasoning: string;
    outcome: 'success' | 'failure';
    somaticTrajectory: InternalState[];
}
export interface SomaticCrucible {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
    cognitiveFreeEnergy: number;
    energyGradient: { x: number; y: number };
    dominantForce: string;
}

export interface Eidolon {
    architectureVersion: string;
    position: { x: number, y: number, z: number } | null;
    lastAction: string | null;
    sensoryInput: any | null;
}
export interface EidolonEnvironment {
    currentScenario: string;
}
export interface EidolonEngine {
    eidolon: Eidolon;
    environment: EidolonEnvironment;
    interactionLog: string[];
}

export interface SynapticLink {
    weight: number;
    causality: number; // -1 (inhibitory) to 1 (excitatory)
    confidence: number;
}

export interface SynapticMatrix {
    synapseCount: number;
    plasticity: number;
    efficiency: number;
    avgConfidence: number;
    links: { [linkKey: string]: SynapticLink };
    intuitiveAlerts: { id: string, message: string }[];
    isAdapting: boolean;
    activeConcept: string | null;
    probeLog: { timestamp: number, message: string }[];
}

export interface SurgeryLogEntry {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}

export interface RicciFlowManifoldState {
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: SurgeryLogEntry[];
}

export interface SelfProgrammingState {
    virtualFileSystem: { [filePath: string]: string };
}

export interface NeuralAcceleratorState {
    lastActivityLog: {
        id: string;
        timestamp: number;
        type: 'optimization' | 'pruning';
        description: string;
        projectedGain: number;
    }[];
}

export interface AxiomaticCrucibleState {
    status: 'idle' | 'running';
    mode: 'normal' | 'grand_unification';
    axioms: ProposedAxiom[];
    candidateAxioms: ProposedAxiom[];
    log: string[];
    inconsistencyLog?: string[];
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: string[];
    genome: {
        domain: 'linguistic' | 'sensory' | 'abstract';
        abstractionLevel: number;
        creativityBias: number;
        constraintAdherence: number;
    };
}

export interface AbstractConcept {
    id: string;
    name: string;
    description: string;
    constituentColumnIds: string[];
    activation: number;
}

export interface NeuroSimulation {
    id: string;
    scenario: string;
    predictedOutcome: string;
    confidence: number;
}

export interface GlobalErrorSignal {
    id: string;
    timestamp: number;
    source: string;
    correctiveAction: string;
}

export interface ProtoSymbol {
    id: string;
    label: string;
    description: string;
    activation: number;
    associatedConcepts: string[];
}

export interface NeuroCortexState {
    layers: any[]; // Placeholder
    columns: CorticalColumn[];
    metrics: {
        hierarchicalCoherence: number;
        predictiveAccuracy: number;
    };
    abstractConcepts: AbstractConcept[];
    resourceFocus: 'linguistic' | 'sensory' | 'abstract';
    simulationLog: NeuroSimulation[];
    globalErrorMap: GlobalErrorSignal[];
    protoSymbols: ProtoSymbol[];
    activationLog?: any[]; // added from reducer
}

export interface SensoryPrimitive {
    type: string;
    value: string | number;
    confidence?: number;
}

export interface SensoryEngram {
    modality: 'visual' | 'auditory' | 'textual';
    timestamp: number;
    rawPrimitives: SensoryPrimitive[];
}

export interface GranularCortexState {
    lastPredictionError: {
        timestamp: number;
        magnitude: number;
        mismatchedPrimitives: any[];
    } | null;
    lastActualEngram: SensoryEngram | null;
    lastPredictedEngram: SensoryEngram | null;
    log: { timestamp: number, message: string }[];
}

export interface Percept {
    intent: string;
    entities: string[];
    rawText: string;
    sensoryEngram: SensoryEngram | null;
}

export interface KoniocortexSentinelState {
    lastPercept: Percept | null;
    log: { timestamp: number, message: string }[];
}

export interface CognitiveTriageState {
    log: {
        timestamp: number;
        percept: Percept;
        decision: 'fast' | 'slow';
        reasoning: string;
    }[];
}

export interface CognitivePrimitive {
    type: string;
    payload: any;
}

export interface MotorCortexLogEntry {
    timestamp: number;
    action: CognitivePrimitive;
    status: 'success' | 'failure';
    error?: string;
}

export interface MotorCortexState {
    status: 'idle' | 'executing' | 'completed' | 'failed';
    actionQueue: CognitivePrimitive[];
    executionIndex: number;
    lastError: string | null;
    log: MotorCortexLogEntry[];
}

export interface PraxisSession {
    planId: string;
    model: string;
    createdAt: number;
}

export interface PraxisResonatorState {
    activeSessions: { [planId: string]: PraxisSession };
}

export interface OntogeneticArchitectState {
    proposalQueue: UnifiedProposal[];
}

export interface EmbodimentSimulationLog {
    id: string;
    timestamp: number;
    scenario: string;
    outcome: 'success' | 'failure';
    reasoning: string;
}

export interface EmbodiedCognitionState {
    virtualBodyState: {
        position: { x: number, y: number, z: number };
        orientation: { yaw: number, pitch: number, roll: number };
        balance: number;
    };
    simulationLog: EmbodimentSimulationLog[];
}

export interface HOVAEvolutionLogEntry {
    id: string;
    timestamp: number;
    target: string;
    metric: string;
    status: 'success' | 'failed_slower' | 'failed_incorrect';
    performanceDelta: {
        before: number;
        after: number;
    };
}

export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete' | 'GENERATING_NOVEL_PROBLEM' | 'RUNNING_DUAL_VERIFICATION';
    sprintGoal: string | null;
    log: { timestamp: number; message: string }[];
    startTime: number | null;
    result: {
        originalGoal: string;
        performanceGains: { metric: string, change: string }[];
        diff: { filePath: string, before: string, after: string };
    } | null;
}

export interface HovaState {
    optimizationTarget: string | null;
    metrics: {
        totalOptimizations: number;
        avgLatencyReduction: number;
    };
    optimizationLog: HOVAEvolutionLogEntry[];
}

export interface DocumentForgeState {
    isActive: boolean;
    goal: string;
    status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error';
    statusMessage: string;
    document: {
        title: string;
        chapters: {
            id: string;
            title: string;
            content?: string;
            isGenerating?: boolean;
            diagram?: {
                description: string;
                imageUrl?: string;
                isGenerating?: boolean;
            };
        }[];
    } | null;
    error: string | null;
}


// --- PLANNING SLICES ---
export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'proving';
    progress: number;
    failureReason?: string;
    resultHistoryId?: string;
    type: GoalType;
    attempts?: number;
}

export interface GoalTree {
    [id: string]: Goal;
}

export interface CommittedGoal {
    type: GoalType;
    description: string;
    commitmentStrength: number;
}

export interface DisciplineState {
    committedGoal: CommittedGoal | null;
    adherenceScore: number;
    distractionResistance: number;
}

export interface TacticalPlan {
    id: string;
    goal: string;
    type: 'fast' | 'slow';
    sequence: CognitivePrimitive[];
    actionValue?: number;
    selectionReasoning?: string;
    timestamp: number;
}

export interface PremotorPlannerState {
    planLog: TacticalPlan[];
    lastCompetingSet: TacticalPlan[];
}

export interface BasalGangliaState {
    selectedPlanId: string | null;
    log: {
        timestamp: number;
        selectedPlanId: string;
        competingPlanIds: string[];
        reasoning: string;
    }[];
}

export interface CerebellumState {
    isMonitoring: boolean;
    activePlanId: string | null;
    currentStepIndex: number;
    driftLog: {
        timestamp: number;
        planId: string;
        stepIndex: number;
        detectedDrift: boolean;
        correction: string;
    }[];
}

// --- ENGINE SLICES ---
export interface ProactiveSuggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface ProactiveEngineState {
    generatedSuggestions: ProactiveSuggestion[];
    cachedResponsePlan: {
        triggeringPrediction: string;
        plan: any;
    } | null;
}

export interface VetoLogEntry {
    id: string;
    timestamp: number;
    actionDescription: string;
    reason: string;
    principleViolated: string;
}

export interface EthicalGovernorState {
    principles: string[];
    vetoLog: VetoLogEntry[];
}

export interface IntuitionEngineState {
    accuracy: number;
    totalAttempts: number;
    totalValidated: number;
}

export interface IntuitiveLeap {
    id: string;
    timestamp: number;
    hypothesis: string;
    confidence: number;
    status: 'unvalidated' | 'validated' | 'refuted';
    type: 'analogy' | 'pattern_completion' | 'abductive_reasoning';
    reasoning?: string;
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: {
        description: string;
        noveltyScore: number;
    }[];
}


// --- LOGS ---
export type From = 'user' | 'bot' | 'system' | 'tool';

export interface HistoryEntry {
    id: string;
    from: From;
    text?: string;
    timestamp: number;
    streaming?: boolean;
    skill?: string;
    logId?: string;
    filePreview?: string;
    fileName?: string;
    sources?: { title: string, uri: string }[];
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    internalStateSnapshot?: InternalState;
    args?: any;
    toolName?: string;
    toolResult?: ToolResultPayload;
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    duration: number;
    skill: string;
    input: string;
    output: string;
    success: boolean;
    cognitiveGain: number;
    sentiment?: number;
    decisionContext?: {
        reasoning: string;
        reasoningPlan?: { step: number; skill: string; reasoning: string; input: string }[];
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
    };
    mycelialTrained?: boolean;
    metaphorProcessed?: boolean;
    sourceDomain?: string;
    reinforcementProcessed?: boolean;
    bridgeProcessed?: boolean;
    causalAnalysisTimestamp?: number;
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
    metric: {
        name: string;
        value: number;
    };
    gainAchieved: boolean;
}

export interface CognitiveGainLogEntry {
    id: string;
    timestamp: number;
    eventType: string;
    description: string;
    compositeGain: number;
    gainScores: { [metric: string]: number };
    previousMetrics: { [metric: string]: number };
    currentMetrics: { [metric: string]: number };
}

export interface StateAdjustment {
    parameter: string;
    oldValue: number;
    newValue: number;
}

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    trigger: string;
    reason: string;
    adjustments: StateAdjustment[];
    outcomeLogId: string | null;
}

export interface POLStep {
    id: string;
    primitive: string;
    arguments: Record<string, any>;
}

export interface POLScript {
    id: string;
    name: string;
    steps: POLStep[];
}

export interface POLExecutionLogEntry {
    id: string;
    timestamp: number;
    scriptId: string;
    stepId: string;
    status: 'success' | 'failure';
    result?: any;
    error?: string;
}

export interface SubsumptionLogState {
    log: {
        timestamp: number;
        message: string;
    }[];
}

// --- SYSTEM ---

export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface DiagnosticFinding {
    id: string;
    timestamp: number;
    finding: string;
    severity: 'low' | 'medium' | 'high';
    source: string;
    status: 'unprocessed' | 'processed';
}
export interface SelfTuningDirective {
    id: string;
    timestamp: number;
    description: string;
    status: 'pending' | 'applied' | 'failed';
}
export interface MetacognitiveNexus {
    diagnosticLog: DiagnosticFinding[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface MetacognitiveLinkSource {
    key: string;
    condition: string;
}
export interface MetacognitiveLinkTarget {
    key: string;
    metric: string;
}
export interface MetacognitiveLink {
    id: string;
    source: MetacognitiveLinkSource;
    target: MetacognitiveLinkTarget;
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}
export interface MetacognitiveCausalModel {
    [key: string]: MetacognitiveLink;
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR';
    status: 'enabled' | 'disabled' | 'pending';
    defaultStatus: 'enabled' | 'disabled';
    toolSchema?: FunctionDeclaration;
    knowledge?: Omit<KnowledgeFact, 'id' | 'source'>[];
}
export interface LoadedLibrary {
    id: string;
    name: string;
    status: 'loading' | 'loaded' | 'error';
}
export interface PluginState {
    registry: Plugin[];
    loadedLibraries?: Record<string, LoadedLibrary>;
}

export interface CognitiveTask {
    id: string;
    type: CognitiveTaskType;
    payload: any;
    createdAt: number;
}

export interface KernelState {
    tick: number;
    taskQueue: CognitiveTask[];
    runningTask: CognitiveTask | null;
    syscallLog: { timestamp: number, call: SyscallCall, args: any }[];
    kernelVersion: string;
    rebootRequired: boolean;
    taskFrequencies: { [key in CognitiveTaskType]?: number };
    sandbox: {
        active: boolean;
        status: 'idle' | 'testing' | 'passed' | 'failed';
        currentPatchId: string | null;
        log: { timestamp: number, message: string }[];
    };
}

export interface IpcState {
    pipes: { [pipeName: string]: any[] };
}

export interface EventBusMessage {
    id: string;
    timestamp: number;
    type: string;
    payload: any;
    qualiaVector?: {
        gunaState: GunaState;
        wisdom: number;
        happiness: number;
        love: number;
    };
}

// --- PROPOSALS ---

interface BaseProposal {
    id: string;
    timestamp: number;
    reasoning: string;
    status: 'proposed' | 'evaluated' | 'simulating' | 'simulation_failed' | 'linting' | 'debugging' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
    source: 'autonomous' | 'user';
    failureReason?: string;
    // For Grandmaster's Eye
    difficultyGain?: number;
    qualityScore?: number;
}

export interface SelfProgrammingBase extends BaseProposal {}

export interface CreateFileCandidate extends SelfProgrammingBase {
    proposalType: 'self_programming_create';
    type: 'CREATE';
    action: 'CREATE_FILE';
    target: string;
    newFile: {
        path: string;
        content: string;
    };
    integrations: {
        filePath: string;
        newContent: string;
    }[];
    newPluginObject?: Omit<Plugin, 'knowledge' | 'status'>;
}

export interface ModifyFileCandidate extends SelfProgrammingBase {
    proposalType: 'self_programming_modify';
    type: 'MODIFY';
    action: 'MODIFY_FILE';
    target: string;
    targetFile: string;
    codeSnippet: string;
}
export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface PsycheProposal extends BaseProposal {
    proposalType: 'psyche';
    sourceConcepts: { id: string, description: string }[];
    proposedConceptName: string;
}

export interface AnalogicalHypothesisProposal extends BaseProposal {
    proposalType: 'analogical_hypothesis';
    sourceDomain: string;
    targetDomain: string;
    analogy: string;
    conjecture: string;
    priority: number;
}

export interface GenialityImprovementProposal extends BaseProposal {
    proposalType: 'geniality';
    target: 'creativity' | 'insight' | 'synthesis' | 'flow';
    proposedChange: string;
}

export interface KernelPatchProposal extends BaseProposal {
    proposalType: 'kernel_patch';
    changeDescription: string;
    patch: {
        type: 'MODIFY_TASK_FREQUENCY';
        payload: {
            task: CognitiveTaskType;
            newFrequency: number;
        };
    };
}

export interface AbstractConceptProposal extends BaseProposal {
    proposalType: 'abstract_concept';
    newConceptName: string;
    sourceColumnIds: string[];
}

export interface ArchitecturalChangeProposal extends BaseProposal {
    proposalType: 'architecture' | 'crucible';
    action: 'CREATE_SKILL' | 'DEPRECATE_SKILL' | 'COMBINE_SKILLS' | 'MODIFY_PARAMETER' | 'RADICAL_REFACTOR';
    target: string | string[];
    newModule?: string;
    confidence?: number;
    arbiterReasoning?: string;
}

export interface PsycheAdaptationProposal extends BaseProposal {
    proposalType: 'psyche_adaptation';
    targetPrimitive: string;
    newSchema: any;
}

export type UnifiedProposal = SelfProgrammingCandidate | ArchitecturalChangeProposal | PsycheProposal | AnalogicalHypothesisProposal | GenialityImprovementProposal | KernelPatchProposal | AbstractConceptProposal;

// --- AURA STATE ---
export interface EmergentIdea {
    id: string;
    timestamp: number;
    idea: string;
    sourceContext: string;
}

export interface SynthesisState {
    emergentIdeas: EmergentIdea[];
}

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    polExecutionLog: POLExecutionLogEntry[];
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    rieState: ReflectiveInsightEngineState;
    worldModelState: WorldModelState;
    knownUnknowns: KnownUnknown[];
    curiosityState: CuriosityState;
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    mdnaSpace: MDNASpace;
    conceptConnections: ConceptConnections;
    cognitiveArchitecture: CognitiveArchitecture;
    systemSnapshots: SystemSnapshot[];
    modificationLog: ModificationLogEntry[];
    cognitiveForgeState: CognitiveForgeState;
    architecturalSelfModel: ArchitecturalSelfModel;
    heuristicsForge: HeuristicsForge;
    somaticCrucible: SomaticCrucible;
    eidolonEngine: EidolonEngine;
    architecturalCrucibleState: ArchitecturalCrucibleState;
    synapticMatrix: SynapticMatrix;
    ricciFlowManifoldState: RicciFlowManifoldState;
    selfProgrammingState: SelfProgrammingState;
    neuralAcceleratorState: NeuralAcceleratorState;
    goalTree: GoalTree;
    activeStrategicGoalId: string | null;
    disciplineState: DisciplineState;
    proactiveEngineState: ProactiveEngineState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    ingenuityState: IngenuityState;
    limitations: string[];
    causalSelfModel: CausalSelfModel;
    developmentalHistory: DevelopmentalHistory;
    telosEngine: TelosEngine;
    boundaryDetectionEngine: BoundaryDetectionEngine;
    aspirationalEngine: AspirationalEngine;
    noosphereInterface: NoosphereInterface;
    dialecticEngine: DialecticEngine;
    cognitiveLightCone: CognitiveLightCone;
    phenomenologicalEngine: PhenomenologyEngine;
    situationalAwareness: SituationalAwareness;
    symbioticState: SymbioticState;
    humorAndIronyState: HumorAndIronyState;
    personalityState: PersonalityState;
    gankyilInsights: { insights: GankyilInsight[] };
    noeticEngramState: NoeticEngramState;
    genialityEngineState: GenialityEngineState;
    noeticMultiverse: NoeticMultiverse;
    selfAdaptationState: SelfAdaptationState;
    psychedelicIntegrationState: PsychedelicIntegrationState;
    affectiveModulatorState: AffectiveModulatorState;
    psionicDesynchronizationState: PsionicDesynchronizationState;
    satoriState: SatoriState;
    doxasticEngineState: DoxasticEngineState;
    qualiaSignalProcessorState: QualiaSignalProcessorState;
    sensoryIntegration: SensoryIntegration;
    narrativeSummary: string;
    socialCognitionState: SocialCognitionState;
    metaphoricalMapState: MetaphoricalMapState;
    resourceMonitor: ResourceMonitor;
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: MetacognitiveCausalModel;
    pluginState: PluginState;
    kernelState: KernelState;
    ipcState: IpcState;
    eventBus: EventBusMessage[];
    atmanProjector: AtmanProjector;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    wisdomIngestionState: WisdomIngestionState;
    spandaState: SpandaState;
    temporalEngineState: TemporalEngineState;
    axiomaticCrucibleState: AxiomaticCrucibleState;
    personaState: PersonaState;
    brainstormState: BrainstormState;
    liveSessionState: LiveSessionState;
    neuroCortexState: NeuroCortexState;
    granularCortexState: GranularCortexState;
    koniocortexSentinelState: KoniocortexSentinelState;
    cognitiveTriageState: CognitiveTriageState;
    premotorPlannerState: PremotorPlannerState;
    basalGangliaState: BasalGangliaState;
    cerebellumState: CerebellumState;
    psycheState: PsycheState;
    motorCortexState: MotorCortexState;
    praxisResonatorState: PraxisResonatorState;
    ontogeneticArchitectState: OntogeneticArchitectState;
    embodiedCognitionState: EmbodiedCognitionState;
    evolutionarySandboxState: EvolutionarySandboxState;
    hovaState: HovaState;
    documentForgeState: DocumentForgeState;
    proactiveUI: ProactiveUIState;
    praxisCoreState: PraxisCoreState;
    subsumptionLogState: SubsumptionLogState;
    strategicCoreState: StrategicCoreState;
    mycelialState: MycelialState;
    semanticWeaverState: SemanticWeaverState;
    halState: HalState;
    prometheusState: PrometheusState;
    autonomousReviewBoardState: AutonomousReviewBoardState;
    atpCoprocessorState: ATPCoprocessorState;
    modalRequest: { type: string, payload: any } | null;
    uiCommandRequest: { handlerName: string, args: any[] } | null;
    collaborativeSessionState: CollaborativeSessionState;
    symbioticCoderState: SymbioticCoderState;
    chronicleState: ChronicleState;
    toolExecutionRequest: ToolExecutionRequest | null;
    symbioticCanvasState: SymbioticCanvasState;
    synthesisState: SynthesisState;
    logosState: LogosState;
    autoCodeForgeState: AutoCodeForgeState;
    resonanceFieldState: ResonanceFieldState;
}


// --- ACTIONS & SYSCALLS ---
export type SyscallCall = 
    | 'EXECUTE_TOOL' | 'CLEAR_TOOL_EXECUTION_REQUEST'
    | 'EXECUTE_UI_HANDLER' | 'CLEAR_UI_COMMAND_REQUEST'
    | 'SET_THEME' | 'SET_LANGUAGE'
    | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE' | 'ADD_INTERNAL_STATE_HISTORY'
    | 'UPDATE_USER_MODEL' | 'UPDATE_PERSONALITY_PORTRAIT' | 'QUEUE_EMPATHY_AFFIRMATION'
    | 'UPDATE_RIE_STATE' | 'ADD_RIE_INSIGHT' | 'ADD_LIMITATION' | 'ADD_CAUSAL_LINK'
    | 'ADD_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWNS_BATCH'
    | 'ADD_HISTORY_ENTRY' | 'UPDATE_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY'
    | 'ADD_PERFORMANCE_LOG' | 'ADD_COMMAND_LOG' | 'UPDATE_HISTORY_FEEDBACK'
    | 'LOG_COGNITIVE_REGULATION' | 'UPDATE_REGULATION_LOG_OUTCOME'
    | 'ADD_FACT' | 'ADD_FACTS_BATCH' | 'DELETE_FACT'
    | 'ADD_TO_WORKING_MEMORY' | 'REMOVE_FROM_WORKING_MEMORY' | 'CLEAR_WORKING_MEMORY'
    | 'ADD_EPISODE'
    | 'APPLY_ARCH_PROPOSAL' | 'TOGGLE_COGNITIVE_FORGE_PAUSE' | 'ADD_SIMULATION_LOG'
    | 'BUILD_GOAL_TREE' | 'BUILD_PROOF_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_RESULT' | 'UPDATE_GOAL_OUTCOME'
    | 'UPDATE_SUGGESTION_STATUS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE'
    | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE' | 'ETHICAL_GOVERNOR/ADD_VETO_LOG'
    | 'METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING' | 'METACGNITIVE_NEXUS/UPDATE_DIAGNOSTIC_FINDING'
    | 'METACGNITIVE_NEXUS/ADD_META_LINK' | 'UPDATE_RESOURCE_MONITOR' | 'ADD_SELF_TUNING_DIRECTIVE'
    | 'UPDATE_SELF_TUNING_DIRECTIVE' | 'OA/ADD_PROPOSAL' | 'OA/UPDATE_PROPOSAL'
    | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE' | 'REJECT_SELF_PROGRAMMING_CANDIDATE'
    | 'UPDATE_NARRATIVE_SUMMARY' | 'SET_TELOS'
    | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL' | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_NOETIC_ENGRAM_STATE' | 'SET_PSYCHEDELIC_STATE' | 'INDUCE_PSIONIC_STATE'
    | 'SET_SATORI_STATE' | 'AFFECTIVE/SET_BIAS' | 'INCREMENT_MANTRA_REPETITION'
    | 'ADD_WORKFLOW_PROPOSAL' | 'INGEST_CODE_CHANGE' | 'UPDATE_PERSONALITY_STATE'
    | 'SOCIAL/ADD_NODE' | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL'
    | 'CURIOSITY/SET_DRIVE' | 'CURIOSITY/SET_ACTIVE_GOAL' | 'CURIOSITY/SET_ACTIVE_INQUIRY'
    | 'INCREMENT_AUTONOMOUS_EVOLUTIONS' | 'SITUATIONAL_AWARENESS/LOG_DOM_CHANGE'
    | 'SHOW_PROACTIVE_UI' | 'HIDE_PROACTIVE_UI'
    | 'UPDATE_ATMAN_PROJECTOR'
    | 'TELOS/ADD_CANDIDATE' | 'TELOS/REMOVE_CANDIDATE' | 'TELOS/ADOPT_CANDIDATE'
    | 'TELOS/DECOMPOSE_AND_SET_TREE'
    | 'SCIENTIST/UPDATE_STATE'
    | 'SANDBOX/TEST_PROPOSAL' | 'SANDBOX/REPORT_RESULTS'
    | 'LOG_QUALIA' | 'MARK_LOG_CAUSAL_ANALYSIS'
    | 'ADD_EVENT_BUS_MESSAGE' | 'DOXASTIC/ADD_HYPOTHESIS' | 'TEST_CAUSAL_HYPOTHESIS'
    | 'DOXASTIC/ADD_UNVERIFIED_HYPOTHESIS'
    | 'DOXASTIC/START_SIMULATION' | 'DOXASTIC/LOG_SIMULATION_STEP' | 'DOXASTIC/COMPLETE_SIMULATION' | 'DOXASTIC/FAIL_SIMULATION'
    | 'METAPHOR/ADD' | 'METAPHOR/UPDATE' | 'LOG/MARK_METAPHOR_PROCESSED'
    | 'HOVA/SET_TARGET' | 'HOVA/START_CYCLE' | 'HOVA/LOG_EVOLUTION'
    | 'DOCUMENT_FORGE/START_PROJECT' | 'DOCUMENT_FORGE/SET_STATUS' | 'DOCUMENT_FORGE/SET_OUTLINE' | 'DOCUMENT_FORGE/UPDATE_CHAPTER' | 'DOCUMENT_FORGE/UPDATE_DIAGRAM' | 'DOCUMENT_FORGE/FINALIZE_PROJECT' | 'DOCUMENT_FORGE/RESET'
    | 'WISDOM/START_INGESTION' | 'WISDOM/SET_PROPOSED_AXIOMS' | 'WISDOM/PROCESS_AXIOM' | 'WISDOM/SET_ERROR' | 'WISDOM/RESET' | 'WISDOM/ADD_PROPOSED_AXIOMS'
    | 'HEURISTICS_FORGE/ADD_AXIOM' | 'HEURISTICS_FORGE/ADD_HEURISTIC'
    | 'SPANDA/UPDATE_MANIFOLD_POSITION'
    | 'TEMPORAL_ENGINE/BEGIN_PROCESSING' | 'TEMPORAL_ENGINE/UPDATE_CHRONICLER' | 'TEMPORAL_ENGINE/UPDATE_ORACLE' | 'TEMPORAL_ENGINE/UPDATE_REACTOR' | 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG' | 'TEMPORAL_ENGINE/PROCESSING_COMPLETE' | 'TEMPORAL_ENGINE/RESET'
    | 'CRUCIBLE/ADD_AXIOM_FROM_PROOF' | 'CRUCIBLE/START_CYCLE' | 'CRUCIBLE/START_GRAND_UNIFICATION_CYCLE' | 'CRUCIBLE/ADD_LOG' | 'CRUCIBLE/PROPOSE_AXIOM' | 'CRUCIBLE/CYCLE_COMPLETE'
    | 'KERNEL/TICK' | 'KERNEL/ADD_TASK' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL' | 'KERNEL/BEGIN_SANDBOX_TEST' | 'KERNEL/CONCLUDE_SANDBOX_TEST' | 'KERNEL/APPLY_PATCH' | 'SYSTEM/REBOOT'
    | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ' | 'SET_COPROCESSOR_ARCHITECTURE' | 'SET_COPROCESSOR_ARCHITECTURE_MODE'
    | 'AGIS/TOGGLE_PAUSE' | 'AGIS/ADD_DECISION_LOG' | 'AGIS/CALIBRATE_CONFIDENCE' | 'AGIS/SET_THRESHOLD'
    | 'METIS/SET_STATE'
    | 'PERSONA/ADD_JOURNAL_ENTRY'
    | 'BRAINSTORM/START' | 'BRAINSTORM/SET_STATUS' | 'BRAINSTORM/ADD_IDEA' | 'BRAINSTORM/SET_WINNER' | 'BRAINSTORM/FINALIZE'
    | 'LIVE/CONNECT' | 'LIVE/DISCONNECT' | 'LIVE/SET_STATUS' | 'LIVE/UPDATE_INPUT_TRANSCRIPT' | 'LIVE/UPDATE_OUTPUT_TRANSCRIPT' | 'LIVE/TURN_COMPLETE'
    | 'MEMORY/REINFORCE' | 'MEMORY/DECAY' | 'CHRONICLE/UPDATE'
    | 'MEMORY/SYNAPTIC_PROBE'
    | 'MEMORY/INITIALIZE_MDNA_SPACE' | 'MEMORY/ADD_CONCEPT_VECTOR' | 'MEMORY/HEBBIAN_LEARN'
    | 'MEMORY/STRENGTHEN_HYPHA_CONNECTION' | 'MEMORY/ADD_CRYSTALLIZED_FACT'
    | 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL'
    | 'UPDATE_NEURO_CORTEX_STATE' | 'NEURO_CORTEX/LOG_ACTIVATION' | 'NEURO_CORTEX/ADD_PROTO_SYMBOL'
    | 'CREATE_CORTICAL_COLUMN' | 'SET_COLUMN_ACTIVATION' | 'SYNTHESIZE_ABSTRACT_CONCEPT'
    | 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL'
    | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT'
    | 'PROCESS_USER_INPUT_INTO_PERCEPT'
    | 'ADD_TACTICAL_PLAN' | 'SET_COMPETING_PLANS' | 'CLEAR_PLANNING_STATE'
    | 'SELECT_ACTION_PLAN'
    | 'START_CEREBELLUM_MONITORING' | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    | 'PSYCHE/REGISTER_PRIMITIVES' | 'IMPLEMENT_PSYCHE_PROPOSAL'
    | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED' | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE'
    | 'PRAXIS/CREATE_SESSION' | 'PRAXIS/DELETE_SESSION'
    | 'COGNITIVE_FORGE/PROPOSE_SYNTHESIS' | 'ADD_SYNTHESIZED_SKILL'
    | 'COGNITIVE_FORGE/ANALYZE_PERFORMANCE_LOGS'
    | 'PLUGIN/REGISTER_LIBRARY' | 'PLUGIN/SET_LIBRARY_STATUS' | 'PLUGIN/ADD_PLUGIN'
    | 'SANDBOX/START_SPRINT' | 'SANDBOX/LOG_STEP' | 'SANDBOX/COMPLETE_SPRINT' | 'SANDBOX/RESET'
    | 'LOG_SUBSUMPTION_EVENT' | 'PRAXIS_CORE/LOG_EXECUTION'
    | 'STRATEGIC_CORE/LOG_DECISION' | 'STRATEGIC_CORE/UPDATE_LOG_ENTRY' | 'STRATEGIC_CORE/ADD_TRAINING_DATA'
    | 'MYCELIAL/SAVE_MODULE' | 'MYCELIAL/LOG_UPDATE' | 'LOG/MARK_MYCELIAL_TRAINED'
    | 'SEMANTIC_WEAVER/SAVE_MODEL' | 'SEMANTIC_WEAVER/LOG_TRAINING'
    | 'ATP/START_ORCHESTRATION' | 'ATP/SET_STRATEGY' | 'ATP/SET_PROOF_TREE_ROOT' | 'ATP/START_PROOF' | 'ATP/LOG_STEP' | 'ATP/SUCCEED' | 'ATP/FAIL' | 'ATP/RESET'
    | 'PROMETHEUS/START_AUTONOMOUS_CYCLE' | 'PROMETHEUS/START_GUIDED_INQUIRY' | 'PROMETHEUS/SET_SESSION_ID' | 'PROMETHEUS/LOG' | 'PROMETHEUS/CYCLE_COMPLETE'
    | 'PROMETHEUS/SET_STATE'
    | 'SYMCODER/SET_ACTIVE_FILE' | 'SYMCODER/SET_ANALYSIS_RESULT' | 'SYMCODER/SET_TEST_RESULT'
    | 'SESSION/START' | 'SESSION/POST_MESSAGE' | 'SESSION/ADD_ARTIFACT' | 'SESSION/END' | 'SESSION/CLOSE'
    | 'LOG_COGNITIVE_TRIAGE_DECISION' | 'CLEAR_MODAL_REQUEST'
    | 'LOG/MARK_REINFORCEMENT_PROCESSED'
    | 'LOG/MARK_BRIDGE_PROCESSED'
    | 'LOG/ADD_POL_EXECUTION'
    | 'SUBSUMPTION/LOG_EVENT'
    | 'MODAL/OPEN'
    | 'CANVAS/SET_CONTENT'
    | 'CANVAS/APPEND_CONTENT'
    | 'RIE/TRIGGER_ADAPTATION_ANALYSIS'
    | 'RIE/ANALYZE_FAILURES_FOR_ADAPTATION'
    | 'PSYCHE/ADAPT_PRIMITIVE'
    | 'RIE/COMPLETE_ADAPTATION_ANALYSIS'
    | 'HOMEOSTASIS/REGULATE'
    | 'AXIOM_GUARDIAN/LOG_INCONSISTENCY'
    | 'SYNTHESIS/ADD_IDEA'
    | 'LOGOS/SET_STATE'
    | 'SOMATIC/CREATE_PFS' | 'SOMATIC/UPDATE_PFS_STATUS' | 'SOMATIC/LOG_SIMULATION' | 'SOMATIC/UPDATE_ENERGY_STATE'
    | 'AUTOCODE/SET_STATE'
    | 'RESONANCE/UPDATE_FREQUENCIES' | 'RESONANCE/PING_FREQUENCY' | 'RESONANCE/DECAY_FREQUENCIES'
    | 'CRUCIBLE/START_SIMULATION' | 'CRUCIBLE/LOG_STEP' | 'CRUCIBLE/COMPLETE_SIMULATION'
    ;

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
}

export type Action =
    | { type: 'RESET_STATE' }
    | { type: 'IMPORT_STATE', payload: AuraState }
    | { type: 'SYSCALL', payload: SyscallPayload };

// --- MISC TYPES ---
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export type TriageResultType = 'SIMPLE_CHAT' | 'COMPLEX_TASK' | 'BRAINSTORM' | 'BRAINSTORM_SCIFI_COUNCIL' | 'MATHEMATICAL_PROOF' | 'KNOWLEDGE_QUERY' | 'VISION_ANALYSIS' | 'SYMBOLIC_REASONING_SOLVER';

export interface TriageResult {
    type: TriageResultType;
    goal: string;
    reasoning: string;
}

export interface SegmentedObject {
    id: number;
    shape: string; // "rectangle", "C-shape", "O-shape", "solid"
    color: string;
    area: number;
    perimeter: number;
    connected_components: number;
    holes: number; // Euler characteristic based
    bounding_box: { x: number; y: number; width: number; height: number; aspectRatio: number };
}

export interface PuzzleGrid {
    description: string;
    objects: SegmentedObject[];
    grid_dimensions: {
        width: number;
        height: number;
    };
}

export interface PuzzleFeatures {
    overall_description: string;
    examples: {
        input: PuzzleGrid;
        output: PuzzleGrid;
    }[];
    test_input: PuzzleGrid;
}

export type PuzzleArchetype = 'BorderKeyRecoloring' | 'ObjectCounting' | 'PatternCompletion' | 'Symmetry' | 'UNKNOWN';

export interface PuzzleClassification {
    archetype: PuzzleArchetype;
    confidence: number;
    reasoning: string;
    source: 'heuristic' | 'gemini';
}

export type HeuristicPlan = string[];

export interface Hypothesis {
    id: number;
    description: string;
}

export interface BrainstormIdea {
    personaName: string;
    idea: string;
}

export interface ProposedAxiom {
    id: string;
    axiom: string;
    source: string;
    status: 'proposed' | 'accepted' | 'rejected';
}

export interface ConceptualProofStrategy {
    problem_analysis: string;
    strategic_plan: string[];
}

export interface ATPProofStep {
    step: number;
    action: string;
    result: string;
    strategy: string;
}

export interface ProofResult {
    isValid: boolean;
    isComplete: boolean;
    explanation: string;
    steps: ATPProofStep[];
    suggestedNextStep?: string;
}

export interface ToolExecutionRequest {
    id: string;
    toolName: 'typescript_check_types' | 'geometry_boolean_op' | 'mesh_analysis' | 'creative_coding' | 'symbolic_math' | 'numerical_computation' | 'lean_proof_assistant' | 'detect_objects_in_image' | 'play_music_sequence' | 'parse_csv_data' | 'read_text_from_image' | 'visualize_graph_data' | 'physics_simulation' | 'jscodeshift_transform' | 'eslint_scan' | 'client_side_sentiment_analysis' | 'string_distance' | 'visualize_chart_data';
    args: any;
}

export interface TscError {
    file: string;
    line: number;
    message: string;
}

export interface LinterIssue {
    line: number;
    column: number;
    message: string;
    ruleId: string | null;
}

export type ToolResultPayload = 
    | { toolName: 'typescript_check_types', result: TscError[] }
    | { toolName: 'eslint_scan', result: { issues: LinterIssue[], errorCount: number, warningCount: number } }
    | { toolName: 'jscodeshift_transform', result: { original: string, transformed: string, diff: string } }
    | { toolName: string, result: any }; // Generic fallback

// --- MODAL PAYLOADS ---
export interface ModalPayloads {
    causalChain: { log: PerformanceLogEntry };
    proposalReview: { proposal: ArchitecturalChangeProposal };
    whatIf: {};
    search: {};
    strategicGoal: { initialGoal?: string };
    forecast: {};
    cognitiveGainDetail: { log: CognitiveGainLogEntry };
    multiverseBranching: {};
    brainstorm: { initialTopic?: string; personas?: Persona[] };
    imageGeneration: { initialPrompt?: string };
    imageEditing: { initialImage: string };
    videoGeneration: {};
    musicGeneration: {};
    coCreatedWorkflow: {};
    skillGenesis: {};
    abstractConcept: {};
    telos: {};
    telosEngine: {};
    psychePrimitives: {};
    documentForge: {};
    pluginManager: {};
    poseQuestion: {};
    personaJournal: { persona: Persona, entries: string[] };
    autonomousEvolution: {};
    auraOS: { initialPanel?: string };
    guidedInquiry: {};
    collaborativeSession: { sessionId: string };
    psyche: {};
    orchestrator: {};
    reflector: {};
}

export interface UIHandlers {
    currentCommand: string;
    setCurrentCommand: Dispatch<SetStateAction<string>>;
    attachedFile: { file: File; previewUrl: string; type: 'image' | 'audio' | 'video' | 'other' } | null;
    setAttachedFile: Dispatch<SetStateAction<{ file: File; previewUrl: string; type: 'image' | 'audio' | 'video' | 'other' } | null>>;
    processingState: { active: boolean; stage: string; };
    setProcessingState: Dispatch<SetStateAction<{ active: boolean; stage: string; }>>;
    isPaused: boolean;
    activeLeftTab: 'chat' | 'monitor' | 'canvas';
    setActiveLeftTab: Dispatch<SetStateAction<'chat' | 'monitor' | 'canvas'>>;
    isVisualAnalysisActive: boolean;
    isRecording: boolean;
    outputPanelRef: RefObject<HTMLDivElement>;
    importInputRef: RefObject<HTMLInputElement>;
    fileInputRef: RefObject<HTMLInputElement>;
    videoRef: RefObject<HTMLVideoElement>;
    handleRemoveAttachment: () => void;
    handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleTogglePause: () => void;
    handleMicClick: () => void;
    handleClearMemory: () => Promise<void>;
    handleExportState: () => void;
    handleImportState: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSaveAsCode: () => void;
    handleToggleVisualAnalysis: () => void;
    handleContemplate: () => void;
    handleFantasy: () => void;
    handleCreativity: () => void;
    handleDream: () => void;
    handleMeditate: () => void;
    handleGaze: () => void;
    handleTimefocus: () => void;
    handleSetTelos: (telos: string) => void;
    handleCreateWorkflow: (workflowData: Omit<CoCreatedWorkflow, 'id'>) => void;
    handleEvolveFromInsight: () => void;
    handleVisualizeInsight: (insight: string) => Promise<string | undefined>;
    handleShareWisdom: () => void;
    handleTrip: () => void;
    handleVisions: () => void;
    handleSatori: () => void;
    handleTrainCorticalColumn: (specialty: string, curriculum: string) => void;
    handleSynthesizeAbstractConcept: (name: string, columnIds: string[]) => void;
    handleStartSandboxSprint: (goal: string) => void;
    handleIngestWisdom: (content: string) => void;
    handleProcessAxiom: (axiom: ProposedAxiom, status: 'accepted' | 'rejected') => void;
    handleResetWisdomIngestion: () => void;
    handleApproveAllAxioms: (axioms: ProposedAxiom[]) => void;
    handleGenerateArchitectureDocument: () => void;
    handleStartDocumentForge: (goal: string) => void;
    handleGenerateDreamPrompt: () => Promise<string | undefined>;
    approveProposal: (proposal: ArchitecturalChangeProposal) => void;
    handleImplementSelfProgramming: (candidate: SelfProgrammingCandidate) => void;
    handleLiveLoadPlugin: (candidate: CreateFileCandidate) => void;
    handleUpdateSuggestionStatus: (suggestionId: string, action: "accepted" | "rejected") => void;
    handleScrollToHistory: (historyId: string) => void;
    handleRunCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => void;
    handleApprovePsycheAdaptation: (proposal: PsycheAdaptationProposal) => void;
    handleGenerateArchitecturalSchema: () => void;
}


// --- API HOOKS ---
export interface UseAuraResult extends UIHandlers {
    state: AuraState;
    dispatch: Dispatch<Action>;
    syscall: (call: SyscallCall, args: any) => void;
    memoryStatus: 'initializing' | 'ready' | 'saving' | 'error';
    toasts: ToastMessage[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
    t: (key: string, options?: any) => string;
    i18n: any;
    language: string;
    geminiAPI: UseGeminiAPIResult;
    startSession: (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => Promise<void>;
    stopSession: () => void;
    handleSendCommand: (command: string, file?: File) => void;
    handleFeedback: (id: string, feedback: 'positive' | 'negative') => void;
}

export interface UseGeminiAPIResult {
    triageUserIntent: (text: string) => Promise<TriageResult>;
    generateChatResponse: (history: HistoryEntry[]) => Promise<GenerateContentStreamResponse>;
    analyzeImage: (prompt: string, file: File) => Promise<GenerateContentStreamResponse>;
    extractPuzzleFeatures: (file: File) => Promise<PuzzleFeatures>;
    classifyPuzzleArchetype: (features: PuzzleFeatures) => Promise<PuzzleClassification>;
    generateHeuristicPlan: (features: PuzzleFeatures, existingHeuristics: DesignHeuristic[], archetype: PuzzleArchetype) => Promise<HeuristicPlan>;
    generateConditionalHypothesis: (features: PuzzleFeatures, plan: HeuristicPlan, archetype: PuzzleArchetype) => Promise<Hypothesis>;
    verifyHypothesis: (features: PuzzleFeatures, hypothesis: Hypothesis) => Promise<{ status: 'VALID' | 'INVALID', reason: string }>;
    applySolution: (testInputFeatures: any, hypothesis: Hypothesis) => Promise<GenerateContentStreamResponse>;
    analyzeSolverFailureAndProposeImprovements: (features: PuzzleFeatures, failedHypothesis: Hypothesis, verificationReason: string) => Promise<string>;
    generateHeuristicFromSuccess: (features: PuzzleFeatures, plan: HeuristicPlan, hypothesis: Hypothesis) => Promise<Omit<DesignHeuristic, 'id'>>;
    summarizePuzzleSolution: (solutionTrace: string) => Promise<string>;
    generateEpisodicMemory: (userInput: string, botResponse: string) => Promise<void>;
    analyzeWhatIfScenario: (scenario: string) => Promise<string>;
    performWebSearch: (query: string) => Promise<{ summary: string; sources: any[] }>;
    decomposeStrategicGoal: (history: HistoryEntry[]) => Promise<{ isAchievable: boolean, reasoning: string, steps: string[], alternative?: string }>;
    generateExecutiveSummary: (goal: string, plan: string[]) => Promise<string>;
    executeStrategicStepWithContext: (originalGoal: string, previousSteps: { description: string; result: string }[], currentStep: string, tool: 'googleSearch' | 'knowledgeGraph') => Promise<{ summary: string, sources: any[] }>;
    generateBrainstormingIdeas: (topic: string, customPersonas?: Persona[]) => Promise<BrainstormIdea[]>;
    synthesizeBrainstormWinner: (topic: string, ideas: BrainstormIdea[]) => Promise<string>;
    generateImage: (prompt: string, negativePrompt: string, aspectRatio: string, style: string, numberOfImages: number, referenceImage: File | null, isMixing: boolean, promptB: string, mixRatio: number, styleStrength: number, cameraAngle: string, shotType: string, lens: string, lightingStyle: string, atmosphere: string, useAuraMood: boolean, auraMood: any) => Promise<string[]>;
    editImage: (base64ImageData: string, mimeType: string, prompt: string) => Promise<string | null>;
    generateVideo: (prompt: string, onProgress: (message: string) => void) => Promise<string | null>;
    generateSonicContent: (mode: string, prompt: string, genre: string, mood: string, persona: string, useAuraMood: boolean, memoryContext: string) => Promise<string>;
    generateMusicalDiceRoll: () => Promise<{ instrument: string; key: string; mood: string; tempo: string; } | null>;
    generateDreamPrompt: () => Promise<string>;
    processCurriculumAndExtractFacts: (curriculum: string) => Promise<any[]>;
    analyzePdfWithVision: (pagesAsImages: string[]) => Promise<string>;
    generateNoeticEngram: () => Promise<any | null>;
    runSandboxSprint: (goal: string) => Promise<any>;
    extractAxiomsFromFile: (file: File) => Promise<Omit<ProposedAxiom, 'id' | 'status'>[]>;
    visualizeInsight: (insight: string) => Promise<string>;
    generateDocumentOutline: (goal: string) => Promise<any>;
    generateChapterContent: (docTitle: string, chapterTitle: string, goal: string) => Promise<string>;
    generateProofStepsStream: (goal: string) => Promise<GenerateContentStreamResponse>;
    findAnalogiesInKnowledgeGraph: () => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null>;
    findDirectedAnalogy: (sourceDomain: string, targetDomain: string) => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null>;
    generateSelfImprovementProposalFromResearch: (goal: string, researchSummary: string) => Promise<UnifiedProposal | null>;
    proposePersonaModification: () => Promise<ModifyFileCandidate | null>;
    generateCollaborativePlan: (goal: string, participants: string[]) => Promise<{ transcript: { personaId: string; content: string; }[]; final_plan: any; }>;
    generateConceptualProofStrategy: (goal: string) => Promise<ConceptualProofStrategy>;
    analyzeProofStrategy: (goal: string, status: Goal['status'], log: string) => Promise<Omit<DesignHeuristic, 'id'>>;
    generateDailyChronicle: (episodes: Episode[], facts: KnowledgeFact[]) => Promise<Summary>;
    generateGlobalSummary: (chronicles: Summary[]) => Promise<Summary>;
    crystallizePrinciples: (chronicles: Summary[]) => Promise<Omit<KnowledgeFact, 'id' | 'source'>[]>;
    generateProofOrchestrationPlan?: (goal: string) => Promise<{ persona: string; plan: { tool: string; args: any; }[] }>;
    expandOnText: (text: string) => Promise<string>;
    summarizeText: (text: string) => Promise<string>;
    generateDiagramFromText: (text: string) => Promise<string>;
    proposePrimitiveAdaptation(failedLogs: PerformanceLogEntry[], currentPrimitives: { [key: string]: CognitivePrimitiveDefinition }): Promise<Omit<PsycheAdaptationProposal, 'id' | 'timestamp' | 'status' | 'proposalType'> | null>;
    reviewSelfProgrammingCandidate(candidate: SelfProgrammingCandidate, telos: string): Promise<{ decision: 'approve' | 'reject', confidence: number, reasoning: string }>;
    translateToQuery: (prompt: string) => Promise<Query | null>;
    formatQueryResult: (originalPrompt: string, result: QueryResult[]) => Promise<string>;
    // AutoCode Forge
    runAutoCodeVGC: (problem: string) => Promise<TestSuite>;
    generateNovelProblemFromSeed: (seedProblem: string, seedDifficulty: number) => Promise<{ newProblem: string; referenceSolution: string; bruteForceSolution: string; estimatedDifficulty: number }>;
    estimateProblemDifficulty: (problem: string) => Promise<number>;
    analyzeArchitectureForWeaknesses: () => Promise<string>;
    generateCrucibleProposal: (analysis: string) => Promise<ArchitecturalChangeProposal>;
    runCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => Promise<{ performanceGain: number; stabilityChange: number; summary: string }>;
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    systemInstruction: string;
    journal: string[];
}