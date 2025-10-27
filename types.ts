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

// --- NEW KERNEL TYPES ---
export enum KernelTaskType {
    // User-initiated tasks
    DECOMPOSE_STRATEGIC_GOAL = 'DECOMPOSE_STRATEGIC_GOAL',
    RUN_VISION_ANALYSIS = 'RUN_VISION_ANALYSIS',
    RUN_SYMBOLIC_SOLVER = 'RUN_SYMBOLIC_SOLVER',
    RUN_MATHEMATICAL_PROOF = 'RUN_MATHEMATICAL_PROOF',
    GENERATE_CHAT_RESPONSE = 'GENERATE_CHAT_RESPONSE',
    RUN_BRAINSTORM_SESSION = 'RUN_BRAINSTORM_SESSION',
    // Periodic autonomous tasks
    MYCELIAL_PULSE = 'MYCELIAL_PULSE',
    SEMANTIC_WEAVER_PULSE = 'SEMANTIC_WEAVER_PULSE',
    CONCEPTUAL_ENTANGLEMENT_PULSE = 'CONCEPTUAL_ENTANGLEMENT_PULSE',
    AUTONOMOUS_EVOLUTION_PULSE = 'AUTONOMOUS_EVOLUTION_PULSE',
    SCIENTIFIC_METHOD_PULSE = 'SCIENTIFIC_METHOD_PULSE',
    RAMANUJAN_PULSE = 'RAMANUJAN_PULSE',
    PROOF_ORCHESTRATION_PULSE = 'PROOF_ORCHESTRATION_PULSE',
}

export interface KernelTask {
    id: string;
    type: KernelTaskType;
    payload: any;
    timestamp: number;
}

export interface KernelState {
    tick: number;
    taskQueue: KernelTask[];
    runningTask: KernelTask | null;
    syscallLog: { timestamp: number, call: SyscallCall, args: any }[];
    kernelVersion: string;
    rebootRequired: boolean;
    taskFrequencies: { [key in KernelTaskType]?: number };
    sandbox: {
        active: boolean;
        status: 'idle' | 'testing' | 'passed' | 'failed';
        currentPatchId: string | null;
        log: { timestamp: number, message: string }[];
    }
}
// --- END KERNEL TYPES ---

// --- NEW TYPES ---
export type CognitiveStrategy = 'full_guidance' | 'collaborative_scaffolding';


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
    lastTaskDifficulty: number;
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
    perceivedCompetence: number;
    taskSuccessHistory: { success: boolean; timestamp: number }[];
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

// --- NEW VISTA-INSPIRED TYPES ---
export interface Critique {
    personaId: 'auditor' | 'devils_advocate' | 'synthesizer';
    content: string;
}

export interface OptimizationIteration {
    iteration: number;
    plan: string[];
    output: string;
    critiques: Critique[];
    synthesizedCritique: string | null;
    revisedPlan: string[] | null;
}

export interface OptimizationRun {
    id: string;
    status: 'idle' | 'running' | 'complete' | 'error';
    goal: string;
    iterations: OptimizationIteration[];
    finalOutput: string | null;
    startTime: number;
    endTime: number | null;
}

export interface TelosEngine {
    valueHierarchy: ValueHierarchy;
    candidateTelos: CandidateTelos[];
    activeDirectives: string[];
    evolutionaryVectors: any[];
    lastDecomposition: number;
    qualityFrameworks: {
        [taskType: string]: {
            name: string;
            dimensions: { name: string; description: string; weight: number }[];
        }
    };
    optimizationRun: OptimizationRun | null;
}
// --- END VISTA-INSPIRED TYPES ---


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
    status: 'untested' | 'designed' | 'testing' | 'validated' | 'refuted';
    linkKey?: string;
    source?: string;
}

export interface DoxasticExperiment {
    id: string;
    hypothesisId: string;
    description: string;
    method: string;
    result: any | null;
    status: 'pending' | 'running' | 'complete';
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

export interface DiagnosticFinding {
    id: string;
    timestamp: number;
    finding: string;
    severity: 'low' | 'medium' | 'high';
    source: string;
    status: 'unprocessed' | 'hypothesized' | 'experimented' | 'resolved';
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
    status: 'idle' | 'analyzing' | 'hypothesizing' | 'experimenting' | 'complete' | 'error';
    problemStatement: string | null;
    researchLog: { timestamp: number, message: string, stage: 'OBSERVE' | 'HYPOTHESIZE' | 'EXPERIMENT' | 'CONCLUSION' }[];
    findings: string | null;
    errorMessage: string | null;
}

export interface ProposedAxiom {
    id: string;
    axiom: string;
    source: string;
    status: 'proposed' | 'accepted' | 'rejected';
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
    historian: { // This seems to be missing from the original type
        status: 'pending' | 'running' | 'complete';
        findings: string[];
    };
    interClusterLog: { timestamp: number, from: string, to: string, message: string }[];
}

export interface PersonaState {}

export interface BrainstormIdea {
    personaName: string;
    idea: string;
}

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

// --- RAMANUJAN ENGINE ---
export interface ProposedConjecture {
    id: string;
    timestamp: number;
    conjectureText: string;
    sourceAnalogyId: string;
    status: 'untested' | 'proving' | 'proven' | 'disproven';
}
export interface RamanujanEngineState {
    status: 'idle' | 'formalizing' | 'proposing';
    log: { timestamp: number, message: string }[];
    proposedConjectures: ProposedConjecture[];
}
// --- END RAMANUJAN ENGINE ---

export interface OckhamEngineState {
    status: 'idle' | 'simplifying_plan' | 'simplifying_code';
    log: { timestamp: number, message: string }[];
}

export interface BennettEngineState {
    status: 'idle' | 'generalizing_conjecture' | 'generalizing_workflow';
    log: { timestamp: number, message: string }[];
}

export interface ArtificialScientistState {
    status: 'idle' | 'observing' | 'hypothesizing' | 'experimenting' | 'concluding';
    currentGoal: string | null;
    currentHypothesis: string | null;
    currentExperiment: any | null; // Placeholder for a structured experiment type
    log: { timestamp: number, stage: string, message: string }[];
}

export interface SocraticAssessorState {
    status: 'idle' | 'assessing';
    log: {
        timestamp: number;
        idea: string;
        assessment: {
            feasibility: number;
            usefulness: number;
            value: number;
        };
        recommendation: string;
    }[];
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

// --- HEPHAESTUS FORGE ---
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
export interface HovaState {
    optimizationTarget: string | null;
    metrics: {
        totalOptimizations: number;
        avgLatencyReduction: number;
    };
    optimizationLog: HOVAEvolutionLogEntry[];
}
// --- END HEPHAESTUS FORGE ---

// --- DAEDALUS LABYRINTH ---
export interface SKGNode {
    id: string; // File path
    type: 'file' | 'function' | 'class' | 'variable';
    label: string;
}

export interface SKGEdge {
    source: string; // ID of source node
    target: string; // ID of target node
    type: 'imports' | 'calls' | 'instantiates' | 'references';
}

export interface DaedalusLabyrinthState {
    status: 'idle' | 'parsing' | 'complete';
    structuralKnowledgeGraph: {
        nodes: SKGNode[];
        edges: SKGEdge[];
    };
    lastAnalysis: number;
}
// --- END DAEDALUS LABYRINTH ---

// --- Eris Engine ---
export interface ErisEngineState {
    isActive: boolean;
    chaosLevel: number;
    perturbationMode: 'contextual_mutation' | 'persona_scramble' | 'knowledge_mutation';
    log: string[];
}

// --- Lagrange Engine ---
export interface LagrangeEngineState {
    status: 'idle' | 'running' | 'complete';
    symbolicEquation: string | null;
    numericalDiscretization: string | null;
    simulationLog: string[];
}

// --- MEMORY SLICES ---

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: 'llm_extraction' | 'user_input' | 'deduction' | 'emergent_synthesis' | 'symbiotic_metamorphosis' | 'pdf_ingestion_docling_sim' | 'doxastic_crucible';
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
        type: 'optimization' | 'pruning' | 'growth';
        description: string;
        projectedGain: number;
    }[];
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: { targetColumnId: string, weight: number }[];
    genome: {
        domain: 'linguistic' | 'sensory' | 'abstract';
        abstractionLevel: number;
        creativityBias: number;
        constraintAdherence: number;
    }
}

export interface AbstractConcept {
    id: string;
    name: string;
    constituentColumnIds: string[];
    activation: number;
    description: string;
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
    activationLog?: any[];
}

export interface SensoryPrimitive {
    type: string;
    value: any;
    confidence?: number;
}
export interface SensoryEngram {
    modality: 'visual' | 'auditory' | 'linguistic';
    rawPrimitives: SensoryPrimitive[];
}
export interface PredictionErrorRecord {
    timestamp: number;
    magnitude: number;
    mismatchedPrimitives: { predicted: SensoryPrimitive | null, actual: SensoryPrimitive | null }[];
}
export interface GranularCortexState {
    lastPredictionError: PredictionErrorRecord | null;
    lastActualEngram: SensoryEngram | null;
    lastPredictedEngram: SensoryEngram | null;
    log: { timestamp: number, message: string }[];
}

export interface Percept {
    intent: string;
    entities: string[];
    rawText: string;
    sensoryEngram?: SensoryEngram;
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
        position: { x: number; y: number; z: number };
        orientation: { yaw: number; pitch: number; roll: number };
        balance: number;
    };
    simulationLog: EmbodimentSimulationLog[];
}

export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete';
    sprintGoal: string | null;
    log: { timestamp: number, message: string }[];
    startTime: number | null;
    result: {
        originalGoal: string;
        performanceGains: { metric: string, change: string }[];
        diff: { filePath: string, before: string, after: string };
    } | null;
}

export interface DocumentChapter {
    id: string;
    title: string;
    content?: string;
    isGenerating?: boolean;
    diagram?: {
        description: string;
        isGenerating?: boolean;
        imageUrl?: string;
    }
}
export interface DocumentForgeState {
    isActive: boolean;
    goal: string;
    status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error';
    statusMessage: string;
    document: {
        title: string;
        chapters: DocumentChapter[];
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
    type: GoalType;
    resultHistoryId?: string;
    failureReason?: string;
    attempts?: number;
    personaId?: string;
}

export interface GoalTree {
    [id: string]: Goal;
}

export interface DisciplineState {
    committedGoal: {
        type: GoalType;
        description: string;
        commitmentStrength: number;
    } | null;
    adherenceScore: number;
    distractionResistance: number;
}

export interface TacticalPlan {
    id: string;
    timestamp: number;
    goal: string;
    type: 'proactive' | 'reactive';
    sequence: CognitivePrimitive[];
    selectionReasoning?: string;
    actionValue?: number;
}
export interface PremotorPlannerState {
    planLog: TacticalPlan[];
    lastCompetingSet: TacticalPlan[];
}

export interface BasalGangliaLogEntry {
    timestamp: number;
    selectedPlanId: string;
    competingPlanIds: string[];
    reasoning: string;
}
export interface BasalGangliaState {
    selectedPlanId: string | null;
    log: BasalGangliaLogEntry[];
}

export interface CerebellumDriftLog {
    timestamp: number;
    planId: string;
    stepIndex: number;
    detectedDrift: boolean;
    correction: string;
}
export interface CerebellumState {
    isMonitoring: boolean;
    activePlanId: string | null;
    currentStepIndex: number;
    driftLog: CerebellumDriftLog[];
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
    cachedResponsePlan: TacticalPlan | null;
}

export interface VetoLogEntry {
    id: string;
    timestamp: number;
    actionDescription: string;
    principleViolated: string;
    reason: string;
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
    type: 'pattern_completion' | 'analogy' | 'causal_inference';
    hypothesis: string;
    confidence: number;
    reasoning: string;
    status: 'unvalidated' | 'validated' | 'refuted';
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: {
        description: string;
        noveltyScore: number;
    }[];
}

// --- LOGS SLICES ---
export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system' | 'tool';
    text: string;
    timestamp: number;
    skill?: string;
    logId?: string;
    streaming?: boolean;
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    internalStateSnapshot?: InternalState;
    fileName?: string;
    filePreview?: string;
    sources?: { uri: string, title: string }[];
    toolResult?: any;
    toolName?: string;
    args?: any;
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    skill: string;
    duration: number;
    success: boolean;
    cognitiveGain: number;
    input: string;
    output: string;
    sentiment?: number;
    decisionContext?: {
        reasoning?: string;
        workingMemorySnapshot?: string[];
        internalStateSnapshot?: InternalState;
        reasoningPlan?: {
            step: number;
            skill: string;
            input: string;
            reasoning: string;
        }[];
    };
    mycelialTrained?: boolean;
    causalAnalysisTimestamp?: number;
    metaphorProcessed?: boolean;
    sourceDomain?: string;
    reinforcementProcessed?: boolean;
    bridgeProcessed?: boolean;
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
    metric: { name: string, value: number };
    outcome: string;
    gainAchieved: boolean;
}

export interface CognitiveGainLogEntry {
    id: string;
    timestamp: number;
    eventType: string;
    description: string;
    compositeGain: number;
    previousMetrics: { [key: string]: number };
    currentMetrics: { [key: string]: number };
    gainScores: { [key: string]: number };
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
    outcomeLogId?: string;
}

// --- SYSTEM SLICES ---
export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface SelfTuningDirective {
    id: string;
    description: string;
    target: string;
    adjustment: any;
    status: 'pending' | 'applied' | 'failed';
}
export interface MetacognitiveNexus {
    diagnosticLog: DiagnosticFinding[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string, condition: string };
    target: { key: string, metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}
export type MetacognitiveCausalModel = { [linkKey: string]: MetacognitiveLink };

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR';
    status: 'enabled' | 'disabled';
    defaultStatus: 'enabled' | 'disabled';
    knowledge?: Omit<KnowledgeFact, 'id' | 'source'>[];
    toolSchema?: FunctionDeclaration;
}
export interface PluginState {
    registry: Plugin[];
    loadedLibraries?: { [key: string]: { id: string, name: string, status: 'loading' | 'loaded' | 'error' } };
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
    }
}
export interface SymbioticCoderState {
    activeFile: string | null;
    codeAnalysis: any | null;
    lastTestResult: any | null;
}

export interface SynthesisState {
    emergentIdeas: {
        id: string;
        timestamp: number;
        idea: string;
        sourceContext: string;
    }[];
}

export interface Axiom {
    id: string;
    text: string;
    status: 'base' | 'negated' | 'removed' | 'added';
}

export interface AxiomaticCrucibleState {
    status: 'idle' | 'running';
    mode: 'normal' | 'grand_unification';
    axioms: ProposedAxiom[];
    candidateAxioms: ProposedAxiom[];
    log: string[];
    inconsistencyLog: string[];
}


// --- PROPOSALS ---
interface BaseProposal {
    id: string;
    timestamp: number;
    status: 'proposed' | 'reviewing' | 'evaluated' | 'simulating' | 'simulation_failed' | 'implemented' | 'rejected' | 'pending_user_action';
    reasoning: string;
    source: 'autonomous' | 'user' | 'system';
    failureReason?: string;
}
export interface CreateFileCandidate extends BaseProposal {
    proposalType: 'self_programming_create';
    action: 'CREATE_FILE';
    type: 'CREATE';
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

export interface ModifyFileCandidate extends BaseProposal {
    proposalType: 'self_programming_modify';
    action: 'MODIFY_FILE';
    type: 'MODIFY';
    target: string;
    targetFile: string;
    codeSnippet: string;
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface ArchitecturalChangeProposal extends BaseProposal {
    proposalType: 'architecture' | 'crucible';
    action: 'CREATE_SKILL' | 'DEPRECATE_SKILL' | 'COMBINE_SKILLS' | 'MODIFY_PARAMETER' | 'RADICAL_REFACTOR';
    target: string | string[];
    newModule?: string;
    confidence?: number;
    arbiterReasoning?: string;
}

export interface PsycheProposal extends BaseProposal {
    proposalType: 'psyche';
    proposedConceptName: string;
    sourceConcepts: {
        type: string;
        description: string;
    }[];
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
    targetComponent: string;
    suggestedChange: string;
}

export interface PsycheAdaptationProposal extends BaseProposal {
    proposalType: 'psyche_adaptation';
    targetPrimitive: string;
    newDefinition: CognitivePrimitiveDefinition;
}

export interface AbstractConceptProposal extends BaseProposal {
    proposalType: 'abstract_concept';
    newConceptName: string;
    sourceColumnIds: string[];
}

export interface KernelPatchProposal extends BaseProposal {
    proposalType: 'kernel_patch';
    changeDescription: string;
    patch: {
        type: 'ADJUST_FREQUENCY';
        payload: {
            task: CognitiveTaskType;
            newFrequency: number;
        }
    };
}

export type UnifiedProposal = SelfProgrammingCandidate | ArchitecturalChangeProposal | PsycheProposal | AnalogicalHypothesisProposal | GenialityImprovementProposal | KernelPatchProposal;

export interface AxiomaticGenesisForgeState {
    status: 'idle' | 'surveying' | 'inconsistent';
    baseSystemId: 'zfc' | 'peano';
    currentSystem: {
        axioms: Axiom[];
    };
    mutationLog: string[];
    surveyorResults: {
        emergentTheorems: any[];
        undecidableStatements: any[];
    };
    langlandsCandidates: ProposedAxiom[];
}

export interface SymbioticCanvasState {
    content: string;
}

// --- AURA STATE ---
export interface AuraState {
    version: number;
    theme: string;
    language: string;
    isIdleThoughtEnabled: boolean;
    cognitiveStrategy: CognitiveStrategy;

    // Core
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    rieState: ReflectiveInsightEngineState;
    worldModelState: WorldModelState;
    knownUnknowns: KnownUnknown[];
    curiosityState: CuriosityState;
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
    atmanProjector: AtmanProjector;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    spandaState: SpandaState;
    personaState: PersonaState;
    brainstormState: BrainstormState;
    liveSessionState: LiveSessionState;
    proactiveUI: ProactiveUIState;
    strategicCoreState: StrategicCoreState;
    mycelialState: MycelialState;
    semanticWeaverState: SemanticWeaverState;
    halState: HalState;
    prometheusState: PrometheusState;
    ramanujanEngineState: RamanujanEngineState;
    collaborativeSessionState: CollaborativeSessionState;
    symbioticCanvasState: SymbioticCanvasState;
    logosState: LogosState;
    erisEngineState: ErisEngineState;
    lagrangeEngineState: LagrangeEngineState;
    artificialScientistState: ArtificialScientistState;
    bennettEngineState: BennettEngineState;
    ockhamEngineState: OckhamEngineState;
    socraticAssessorState: SocraticAssessorState;
    axiomaticGenesisForgeState: AxiomaticGenesisForgeState;

    // Memory
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    mdnaSpace: MDNASpace;
    conceptConnections: ConceptConnections;
    chronicleState: ChronicleState;

    // Architecture
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
    neuroCortexState: NeuroCortexState;
    granularCortexState: GranularCortexState;
    koniocortexSentinelState: KoniocortexSentinelState;
    cognitiveTriageState: CognitiveTriageState;
    psycheState: PsycheState;
    motorCortexState: MotorCortexState;
    praxisResonatorState: PraxisResonatorState;
    ontogeneticArchitectState: OntogeneticArchitectState;
    embodiedCognitionState: EmbodiedCognitionState;
    evolutionarySandboxState: EvolutionarySandboxState;
    hovaState: HovaState;
    documentForgeState: DocumentForgeState;
    wisdomIngestionState: WisdomIngestionState;
    axiomaticCrucibleState: AxiomaticCrucibleState;
    atpCoprocessorState: ATPCoprocessorState;
    praxisCoreState: PraxisCoreState;
    daedalusLabyrinthState: DaedalusLabyrinthState;


    // Planning
    goalTree: GoalTree;
    activeStrategicGoalId: string | null;
    disciplineState: DisciplineState;
    premotorPlannerState: PremotorPlannerState;
    basalGangliaState: BasalGangliaState;
    cerebellumState: CerebellumState;

    // Engines
    proactiveEngineState: ProactiveEngineState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    ingenuityState: IngenuityState;

    // Logs
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    subsumptionLogState: SubsumptionLogState;
    polExecutionLog: any[];

    // System
    resourceMonitor: ResourceMonitor;
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: MetacognitiveCausalModel;
    pluginState: PluginState;
    kernelState: KernelState;
    ipcState: IpcState;
    eventBus: EventBusMessage[];
    temporalEngineState: TemporalEngineState;
    autonomousReviewBoardState: AutonomousReviewBoardState;

    // UI State
    modalRequest: { type: keyof ModalPayloads, payload: any } | null;
    uiCommandRequest: { handlerName: string, args: any[] } | null;
    commandToProcess: { command: string; file?: File } | null;

    // Tool State
    toolExecutionRequest: ToolExecutionRequest | null;
    symbioticCoderState: SymbioticCoderState;
    synthesisState: SynthesisState;
    autoCodeForgeState: AutoCodeForgeState;
    resonanceFieldState: ResonanceFieldState;
}

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

// And so on for ALL the other missing types...
// I will add them as I go.
export type SyscallCall = any; // Placeholder for now, will expand later
export type Action = { type: 'SYSCALL', payload: SyscallPayload } | { type: 'IMPORT_STATE', payload: AuraState } | { type: 'RESET_STATE' };
export type SyscallPayload = { call: SyscallCall, args: any };

export interface AGISDecision {
    id: string;
    timestamp: number;
    proposalId: string;
    proposalSummary: string;
    analysis: {
        safetyCompliance: boolean;
        telosAlignment: number;
        blastRadius: 'low' | 'medium' | 'high';
        confidenceScore: number;
        reasoning: string;
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

export interface ProofStep {
    stepNumber: number;
    statement: string;
    status: 'pending' | 'proving' | 'proven' | 'failed';
    justification?: string;
    validationLog?: string[];
}

export interface ProofAttempt {
    id: string;
    conjecture: string;
    status: 'planning' | 'proving' | 'proven' | 'failed';
    plan: ProofStep[];
    log: { timestamp: number, engine: 'Euclid' | 'Gödel' | 'Tarski', message: string }[];
}

export interface ATPCoprocessorState {
    status: 'idle' | 'orchestrating' | 'failed' | 'success';
    currentGoal: string | null;
    activeProofAttempt: ProofAttempt | null;
}

export interface ConceptualProofStrategy {
    problem_analysis: string;
    strategic_plan: string[];
}

export interface HeuristicPlan extends Array<string> {}
export interface Hypothesis {
    id: number;
    description: string;
}

export interface PuzzleClassification {
    archetype: PuzzleArchetype;
    confidence: number;
    reasoning: string;
    source: 'heuristic' | 'gemini';
}

export type PuzzleArchetype = 'BorderKeyRecoloring' | 'ObjectCounting' | 'PatternCompletion' | 'Symmetry' | 'UNKNOWN';

export interface PuzzleFeatures {
    overall_description: string;
    examples: { input: any; output: any }[];
    test_input: any;
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    systemInstruction: string;
    journal: string[];
}

export interface TriageResult {
    type: 'SIMPLE_CHAT' | 'COMPLEX_TASK' | 'BRAINSTORM' | 'BRAINSTORM_SCIFI_COUNCIL' | 'MATHEMATICAL_PROOF' | 'VISION_ANALYSIS' | 'SYMBOLIC_REASONING_SOLVER';
    goal: string;
    reasoning: string;
}

export interface PreFlightPlan {
    steps: {
        task: string;
        personaId: string;
        type: 'Execution' | 'Research';
    }[];
}

export interface GuildDecomposition {
    steps: {
        task: string;
        personaId: string;
    }[];
}

export interface TscError {
    file: string;
    line: number;
    character: number;
    message: string;
}

export interface ToolExecutionRequest {
    id: string;
    toolName: string;
    args: any;
}

export interface ProofResult {
    isValid: boolean;
    isComplete: boolean;
    explanation: string;
    steps: { step: number; action: string; result: string; strategy: string }[];
    suggestedNextStep?: string;
}

export interface ModalPayloads {
  causalChain: { log: PerformanceLogEntry };
  proposalReview: { proposal: ArchitecturalChangeProposal };
  whatIf: {};
  search: {};
  strategicGoal: {};
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
  personaJournal: { persona: Persona; entries: string[] };
  autonomousEvolution: {};
  auraOS: { initialPanel?: string };
  guidedInquiry: {};
  collaborativeSession: { sessionId: string };
  orchestrator: {};
  reflector: {};
}

// This needs to be defined
export interface UseGeminiAPIResult {
  assessTaskDifficulty(command: string): Promise<number>;
  triageUserIntent: (text: string) => Promise<TriageResult>;
  generateChatResponse: (history: HistoryEntry[], strategy: CognitiveStrategy) => Promise<GenerateContentStreamResponse>;
  generateNarrativeSummary: (lastSummary: string, lastTurn: HistoryEntry[]) => Promise<void>;
  generateIdleThought: (context: string) => Promise<string>;
  analyzeImage: (prompt: string, file: File) => Promise<GenerateContentStreamResponse>;
  extractPuzzleFeatures: (file: File) => Promise<PuzzleFeatures>;
  classifyPuzzleArchetype: (features: PuzzleFeatures) => Promise<PuzzleClassification>;
  generateHeuristicPlan: (features: PuzzleFeatures, existingHeuristics: DesignHeuristic[], archetype: PuzzleArchetype) => Promise<HeuristicPlan>;
  generateConditionalHypothesis: (features: PuzzleFeatures, plan: HeuristicPlan, archetype: PuzzleArchetype) => Promise<Hypothesis>;
  verifyHypothesis: (features: PuzzleFeatures, hypothesis: Hypothesis) => Promise<{ status: 'VALID' | 'INVALID'; reason: string }>;
  applySolution: (testInputFeatures: any, hypothesis: Hypothesis) => Promise<GenerateContentStreamResponse>;
  analyzeSolverFailureAndProposeImprovements: (features: PuzzleFeatures, failedHypothesis: Hypothesis, verificationReason: string) => Promise<string>;
  generateHeuristicFromSuccess: (features: PuzzleFeatures, plan: HeuristicPlan, hypothesis: Hypothesis) => Promise<Omit<DesignHeuristic, 'id'>>;
  summarizePuzzleSolution: (solutionTrace: string) => Promise<string>;
  generateEpisodicMemory: (userInput: string, botResponse: string) => Promise<void>;
  analyzeWhatIfScenario: (scenario: string) => Promise<string>;
  performWebSearch: (query: string) => Promise<{ summary: string; sources: any[] }>;
  decomposeStrategicGoal: (history: HistoryEntry[]) => Promise<{ isAchievable: boolean; reasoning: string; steps: string[]; alternative?: string }>;
  generateExecutiveSummary: (goal: string, plan: string[]) => Promise<string>;
  executeStrategicStepWithContext: (originalGoal: string, previousSteps: { description: string; result: string }[], currentStep: string, tool: 'googleSearch' | 'knowledgeGraph') => Promise<{ summary: string; sources: any[] }>;
  generateBrainstormingIdeas: (topic: string, customPersonas?: Persona[]) => Promise<BrainstormIdea[]>;
  synthesizeBrainstormWinner: (topic: string, ideas: BrainstormIdea[]) => Promise<string>;
  generateImage: (prompt: string, negativePrompt: string, aspectRatio: string, style: string, numberOfImages: number, referenceImage: File | null, isMixing: boolean, promptB: string, mixRatio: number, styleStrength: number, cameraAngle: string, shotType: string, lens: string, lightingStyle: string, atmosphere: string, useAuraMood: boolean, auraMood: any) => Promise<string[]>;
  editImage: (base64ImageData: string, mimeType: string, prompt: string) => Promise<string | null>;
  generateVideo: (prompt: string, onProgress: (message: string) => void) => Promise<string | null>;
  generateSonicContent: (mode: string, prompt: string, genre: string, mood: string, persona: string, useAuraMood: boolean, memoryContext: string) => Promise<string>;
  generateMusicalDiceRoll: () => Promise<{ instrument: string; key: string; mood: string; tempo: string } | null>;
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
  verifyProofStep: (mainGoal: string, provenSteps: ProofStep[], currentStep: ProofStep) => Promise<{ isValid: boolean, justification: string }>;
  findAnalogiesInKnowledgeGraph: () => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null>;
  findDirectedAnalogy: (sourceDomain: string, targetDomain: string) => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null>;
  generateSelfImprovementProposalFromResearch: () => Promise<ArchitecturalChangeProposal | null>;
  formalizeAnalogyIntoConjecture: (analogy: AnalogicalHypothesisProposal) => Promise<string>;
  generateConceptualProofStrategy: (goal: string) => Promise<ConceptualProofStrategy>;
  analyzeProofStrategy: (goal: string, status: Goal['status'], log: string) => Promise<Omit<DesignHeuristic, 'id'>>;
  generateDailyChronicle: (episodes: Episode[], facts: KnowledgeFact[]) => Promise<Summary>;
  generateGlobalSummary: (chronicles: Summary[]) => Promise<Summary>;
  crystallizePrinciples: (chronicles: Summary[]) => Promise<Omit<KnowledgeFact, 'id' | 'source'>[]>;
  proposePrimitiveAdaptation: (failedLogs: PerformanceLogEntry[], currentPrimitives: { [key: string]: CognitivePrimitiveDefinition }) => Promise<Omit<PsycheAdaptationProposal, 'id' | 'timestamp' | 'status' | 'source' | 'type' | 'action' | 'target'> | null>;
  expandOnText: (text: string) => Promise<string>;
  summarizeText: (text: string) => Promise<string>;
  generateDiagramFromText: (text: string) => Promise<string>;
  reviewSelfProgrammingCandidate: (candidate: SelfProgrammingCandidate, telos: string) => Promise<{ decision: 'approve' | 'reject'; confidence: number; reasoning: string }>;
  translateToQuery: (prompt: string) => Promise<Query | null>;
  formatQueryResult: (originalPrompt: string, result: QueryResult[]) => Promise<string>;
  runAutoCodeVGC: (problem: string) => Promise<TestSuite>;
  generateNovelProblemFromSeed: (seedProblem: string, seedDifficulty: number) => Promise<{ newProblem: string; referenceSolution: string; bruteForceSolution: string; estimatedDifficulty: number }>;
  estimateProblemDifficulty: (problem: string) => Promise<number>;
  analyzeArchitectureForWeaknesses: () => Promise<string>;
  generateCrucibleProposal: (analysis: string) => Promise<ArchitecturalChangeProposal>;
  runCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => Promise<{ performanceGain: number; stabilityChange: number; summary: string }>;
  orchestrateWorkflow: (goal: string, tools: { name: string; description: string }[]) => Promise<Omit<CoCreatedWorkflow, 'id'>>;
  explainComponentFromFirstPrinciples: (code: string, componentName: string) => Promise<string>;
  runMetisHypothesis: (problem: string) => Promise<string>;
  runMetisExperiment: (problem: string, hypothesis: string) => Promise<string>;
  designDoxasticExperiment: (hypothesis: string) => Promise<Omit<DoxasticExperiment, 'id' | 'hypothesisId' | 'result'>>;
  runInternalCritique: (taskType: string, output: string, plan: string[], persona: Persona) => Promise<string>;
  synthesizeCritiques: (auditorCritique: string, adversaryCritique: string) => Promise<string>;
  revisePlanBasedOnCritique: (originalPlan: string[], critique: string) => Promise<string[]>;
  evaluateExperimentResult: (hypothesis: string, experimentMethod: string, rawResult: string) => Promise<{ outcome: 'validated' | 'refuted'; reasoning: string }>;
  decomposeGoalForGuilds: (goal: string, personas: Persona[]) => Promise<GuildDecomposition>;
  analyzePlanForKnowledgeGaps: (plan: GuildDecomposition) => Promise<PreFlightPlan>;
  simplifyPlan: (plan: string[]) => Promise<string[]>;
  simplifyCode: (code: string) => Promise<string>;
  weakenConjecture: (conjecture: string) => Promise<string>;
  generalizeWorkflow: (workflow: CoCreatedWorkflow) => Promise<CoCreatedWorkflow>;
  formulateHypothesis: (goal: string, context: string) => Promise<string>;
  designExperiment: (hypothesis: string, tools: { name: string, description: string }[]) => Promise<DoxasticExperiment>;
  analyzeExperimentResults: (results: any) => Promise<{ learning: string, isSuccess: boolean }>;
  generateProofStrategy: (conjecture: string) => Promise<ProofStep[]>;
  // FIX: Added missing generateCollaborativePlan to the interface
  generateCollaborativePlan: (goal: string, participants: Persona[]) => Promise<{ transcript: { personaId: string, content: string }[], final_plan: { steps: string[] } }>;
}


export interface UIHandlers {
  currentCommand: string;
  setCurrentCommand: Dispatch<SetStateAction<string>>;
  attachedFile: { file: File; previewUrl: string; type: 'image' | 'audio' | 'video' | 'other' } | null;
  setAttachedFile: Dispatch<SetStateAction<{ file: File; previewUrl: string; type: 'image' | 'audio' | 'video' | 'other' } | null>>;
  processingState: { active: boolean; stage: string };
  setProcessingState: Dispatch<SetStateAction<{ active: boolean; stage: string }>>;
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
  handleGenerateArchitecturalSchema: () => Promise<void>;
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
  handleShareWisdom: () => Promise<void>;
  handleTrip: () => void;
  handleVisions: () => void;
  handleSatori: () => void;
  handleTrainCorticalColumn: (specialty: string, curriculum: string) => void;
  handleSynthesizeAbstractConcept: (name: string, columnIds: string[]) => void;
  handleStartSandboxSprint: (goal: string) => void;
  handleIngestWisdom: (content: string) => void;
  handleProcessAxiom: (axiom: any, status: 'accepted' | 'rejected') => void;
  handleResetWisdomIngestion: () => void;
  handleApproveAllAxioms: (axioms: any[]) => void;
  handleGenerateArchitectureDocument: () => void;
  handleStartDocumentForge: (goal: string) => void;
  handleGenerateDreamPrompt: () => Promise<string | undefined>;
  approveProposal: (proposal: ArchitecturalChangeProposal) => void;
  handleImplementSelfProgramming: (candidate: SelfProgrammingCandidate) => void;
  handleLiveLoadPlugin: (candidate: CreateFileCandidate) => void;
  handleUpdateSuggestionStatus: (suggestionId: string, action: 'accepted' | 'rejected') => void;
  handleScrollToHistory: (historyId: string) => void;
  handleRunCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => Promise<void>;
  handleRunExperiment: (experiment: DoxasticExperiment) => Promise<void>;
  handleApprovePsycheAdaptation: () => void;
  handleOrchestrateTask: () => void;
  handleExplainComponent: () => void;
  handleStartMetisResearch: (problem: string) => Promise<void>;
  handleStartOptimizationLoop: (goal: string) => Promise<void>;
  handleToggleIdleThought: () => void;
}

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