// types.ts

// FIX: Add imports for React types to resolve errors
import { ReactNode, Dispatch, SetStateAction, RefObject, ChangeEvent, ComponentType } from 'react';
// FIX: Corrected import to use '@google/genai' per guidelines
import { GoogleGenAI, GenerateContentResponse, Part, Type, GenerateContentStreamResponse, FunctionDeclaration, Content, Episode, ProposedAxiom } from '@google/genai';

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
    RUN_MARKET_ANALYSIS = 'RUN_MARKET_ANALYSIS',
    RUN_DOCUMENT_FORGE = 'RUN_DOCUMENT_FORGE',
    // FIX: Add missing KernelTaskType
    RUN_DIALECTIC_SYNTHESIS = 'RUN_DIALECTIC_SYNTHESIS',
    // Periodic autonomous tasks
    MYCELIAL_PULSE = 'MYCELIAL_PULSE',
    SEMANTIC_WEAVER_PULSE = 'SEMANTIC_WEAVER_PULSE',
    CONCEPTUAL_ENTANGLEMENT_PULSE = 'CONCEPTUAL_ENTANGLEMENT_PULSE',
    AUTONOMOUS_EVOLUTION_PULSE = 'AUTONOMOUS_EVOLUTION_PULSE',
    SCIENTIFIC_METHOD_PULSE = 'SCIENTIFIC_METHOD_PULSE',
    RAMANUJAN_PULSE = 'RAMANUJAN_PULSE',
    PROOF_ORCHESTRATION_PULSE = 'PROOF_ORCHESTRATION_PULSE',
    QUALIA_TOPOLOGY_PULSE = 'QUALIA_TOPOLOGY_PULSE',
    LEARN_FROM_SUCCESS = 'LEARN_FROM_SUCCESS',
    RUN_CAUSAL_SIMULATION = 'RUN_CAUSAL_SIMULATION',
    RUN_DEDUCTION_ANALYSIS = 'RUN_DEDUCTION_ANALYSIS',
    RUN_PATTERN_ANALYSIS = 'RUN_PATTERN_ANALYSIS',
}

export interface KernelTask {
    id: string;
    type: KernelTaskType;
    payload: any & { goalId?: string };
    timestamp: number;
    // FIX: Add missing traceId property
    traceId?: string;
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
export interface CognitiveStrategy {
    id: string;
    name: string;
    description: string;
    systemInstructionModifier: string;
}
export type CognitiveMode = 'fantasy' | 'creativity' | 'dream' | 'meditate' | 'gaze' | 'timefocus';

export interface IntrospectionLogEntry {
    id: string;
    timestamp: number;
    type: 'probe' | 'autonomous';
    injectedConcept: string | null;
    modelReport: string;
    criticVerdict: 'accurate' | 'inaccurate' | 'unverified';
    criticReasoning: string;
}

export interface IntrospectionState {
    log: IntrospectionLogEntry[];
    lastProbeResult: IntrospectionLogEntry | null;
}

export interface HarmonicEngineState {
    status: 'idle' | 'solving_2d' | 'solving_nd';
    lastResult: any | null;
    log: { timestamp: number, message: string }[];
}

export interface CognitiveRefinementState {
    status: 'idle' | 'drafting' | 'critiquing' | 'refining' | 'complete';
    originalPrompt: string | null;
    currentDraft: string | null;
    critiqueHistory: string[];
    iteration: number;
    activeTraceId: string | null;
    activeHistoryId: string | null;
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
    lastTaskDifficulty: number;
    activeCognitiveStrategyId: string | null;
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
    status: 'pending' | 'analyzing' | 'synthesizing' | 'complete';
    conflictDescription: string;
    thesis: { personaId: string, content: string, analysis?: string };
    antithesis: { personaId: string, content: string, analysis?: string };
    synthesis: { content: string; confidence: number } | null;
}

export interface DialecticEngineState {
    activeDialectics: Dialectic[];
}

export interface CausalChainSimulation {
    id: string;
    timestamp: number;
    scenario: string;
    prediction: string;
    confidence: number;
    actionTaken: string | null;
}

export interface ChronosEngineState {
    simulationLog: CausalChainSimulation[];
}

export interface GovernanceState {
    pgeLog: { timestamp: number, message: string }[];
    icmLog: { timestamp: number, message: string }[];
    ddhLog: { timestamp: number, message: string }[];
    aroLog: { timestamp: number, message: string }[];
    wceLog: { timestamp: number, message: string }[];
}

export interface WidgetConfig {
    id: string;
    component: ComponentType;
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
    type: 'clarification_request' | 'suggestion' | 'reflection_prompt' | null;
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

export interface Axiom {
    id: string;
    text: string;
    status: 'base' | 'negated' | 'removed' | 'added';
}
export interface AxiomaticGenesisForgeState {
    status: 'idle' | 'surveying' | 'inconsistent';
    baseSystemId: 'zfc' | 'peano';
    currentSystem: {
        axioms: Axiom[];
    };
    mutationLog: string[];
    surveyorResults: {
        emergentTheorems: string[];
        undecidableStatements: string[];
    };
    langlandsCandidates: ProposedAxiom[];
}


// --- Lagrange Engine ---
export interface LagrangeEngineState {
    status: 'idle' | 'running';
    symbolicEquation: string | null;
    numericalDiscretization: string | null;
    simulationLog: string[];
}

// --- Eris Engine ---
export interface ErisEngineState {
    isActive: boolean;
    chaosLevel: number;
    perturbationMode: 'contextual_mutation' | 'persona_scramble';
    log: string[];
}


// --- MEMORY SLICES ---
// FIX: Add MemoryNexus interface definition
export interface MemoryNexus {
    hyphaeConnections: any[];
}

export type KnowledgeFact = {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
    strength: number;
    lastAccessed: number;
    type?: 'fact' | 'theorem' | 'definition' | 'dependency';
};

export type MDNAVector = number[];
export type MDNASpace = Record<string, MDNAVector>;
export type ConnectionData = { weight: number };
export type ConceptConnections = Record<string, ConnectionData>;

export interface Episode {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    keyTakeaway: string;
    valence: 'positive' | 'negative' | 'neutral';
    salience: number; // Importance score from 0 to 1
    strength: number; // Memory strength from 0 to 1
    lastAccessed: number;
}

export interface EpisodicMemoryState {
    episodes: Episode[];
}

export interface MemoryConsolidationState {
    status: 'idle' | 'consolidating';
    lastConsolidation: number;
}


// --- ARCHITECTURE SLICES ---
export interface CognitiveModule {
    status: 'active' | 'inactive';
    version: string;
}
export interface Coprocessor extends CognitiveModule {
    id: string;
    name: string;
    cluster?: 'krono' | 'pali' | 'neo'; // For Triune
    layer?: 'alpha' | 'beta' | 'gamma'; // For Reflex Arc
    processorType?: 'stream_processor' | 'event_subscriber'; // For Event Stream
    temporalCluster?: 'chronicler' | 'reactor' | 'oracle'; // For Temporal Engine
    symbiont?: 'janitor' | 'weaver' | 'mycelial'; // For Symbiotic Ecosystem
    sensoryModality?: 'proprioceptive' | 'linguistic' | 'structural'; // For Sensory Integration
    metrics: { [key: string]: any };
}
export interface CognitiveArchitecture {
    components: { [skill: string]: CognitiveModule };
    coprocessors: { [id: string]: Coprocessor };
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
    gainType: 'OPTIMIZATION' | 'INNOVATION' | 'ARCHITECTURE' | 'SELF_PROGRAMMING';
    validationStatus: 'validated' | 'unvalidated' | 'refuted';
    isAutonomous: boolean;
}

export interface SynthesisCandidate {
    id: string;
    timestamp: number;
    sourceConcepts: string[];
    proposedSkill: string;
    reasoning: string;
    status: 'proposed' | 'simulating' | 'validated' | 'rejected';
}
export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    result: { success: boolean; duration: number };
}
export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: string[];
    status: 'active' | 'deprecated';
    policyWeight: number;
}
export interface CognitiveForgeState {
    isTuningPaused: boolean;
    synthesizedSkills: SynthesizedSkill[];
    synthesisCandidates: SynthesisCandidate[];
    simulationLog: SimulationLogEntry[];
}
export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}
export interface ArchitecturalSelfModel {
    components: { [name: string]: ArchitecturalComponentSelfModel };
}

export interface DesignHeuristic {
    id: string;
    heuristic: string;
    source: 'puzzlesolver_success' | 'rie_analysis' | 'manual_input' | string; // Allow for other sources
    confidence: number;
    effectivenessScore: number;
    validationStatus: 'validated' | 'unvalidated' | 'refuted';
}
export interface HeuristicsForge {
    designHeuristics: DesignHeuristic[];
}

export interface ProjectedTrajectory {
    wisdom: number[];
    happiness: number[];
    harmony: number[];
}
export interface PossibleFutureSelf {
    id: string;
    name: string;
    description: string;
    status: 'designing' | 'ethical_review' | 'simulating' | 'validated' | 'rejected';
    projectedTrajectory?: ProjectedTrajectory;
    failureReason?: string | null;
}
export interface SomaticSimulationLog {
    id: string;
    pfsId: string;
    timestamp: number;
    reasoning: string;
// ...
    outcome: 'success' | 'failure';
}
export interface SomaticCrucible {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
    cognitiveFreeEnergy: number;
    energyGradient: { x: number, y: number };
    dominantForce: string;
}

export interface Eidolon {
    architectureVersion: string;
    position: { x: number; y: number; z: number } | null;
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
    simulationLog: CrucibleLogEntry[];
}

export interface SynapticLink {
    weight: number;
    confidence: number;
    causality: number; // -1 (inhibitory) to 1 (excitatory)
    lastUpdated: number;
}
export interface SynapticMatrix {
    synapseCount: number;
    plasticity: number;
    efficiency: number;
    avgConfidence: number;
    links: { [key: string]: SynapticLink };
    intuitiveAlerts: { id: string, message: string }[];
    isAdapting: boolean;
    activeConcept: string | null;
    probeLog: { timestamp: number, message: string }[];
}

export interface RicciFlowSurgeryLog {
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
    surgeryLog: RicciFlowSurgeryLog[];
}

export interface SelfProgrammingState {
    virtualFileSystem: { [filePath: string]: string };
}

export interface NeuralAcceleratorState {
    lastActivityLog: {
        id: string;
        timestamp: number;
        type: string;
        description: string;
        projectedGain: number;
    }[];
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
    failureReason?: string | null;
    resultHistoryId?: string;
    attempts?: number;
    personaId?: string;
    executionMode?: 'interactive' | 'batch';
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


// --- ENGINE SLICES ---
export interface Suggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}
export interface ProactiveEngineState {
    generatedSuggestions: Suggestion[];
    cachedResponsePlan: {
        triggeringPrediction: string;
        steps: string[];
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
    // FIX: Add missing feedbackToProcess property
    feedbackToProcess?: { historyId: string; feedback: 'positive' | 'negative' };
}

export interface IntuitiveLeap {
    id: string;
    timestamp: number;
    hypothesis: string;
    type: 'analogy' | 'pattern_completion' | 'anomaly_detection';
    confidence: number;
    reasoning: string;
    status: 'unvalidated' | 'validated' | 'refuted';
}
export interface IntuitionEngineState {
    accuracy: number;
    totalAttempts: number;
    totalValidated: number;
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
    text?: string;
    timestamp: number;
    streaming?: boolean;
    skill?: string;
    logId?: string;
    sources?: { uri: string, title: string }[];
    filePreview?: string;
    fileName?: string;
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    toolName?: string;
    args?: any;
    toolResult?: { toolName: string; result: any };
    internalStateSnapshot?: InternalState;
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
    sentiment: number;
    mycelialTrained?: boolean;
    metaphorProcessed?: boolean;
    sourceDomain?: string;
    reinforcementProcessed?: boolean;
    bridgeProcessed?: boolean;
    decisionContext?: {
        reasoning: string;
        reasoningPlan?: { step: number; skill: string; reasoning: string; input: string }[];
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
    };
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

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    trigger: string;
    action: string;
    targetState: string;
    magnitude: number;
    outcomeLogId?: string;
}


// --- SYSTEM SLICES ---
export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}
export interface MetacognitiveNexus {
    diagnosticLog: DiagnosticFinding[];
    selfTuningDirectives: any[];
}
export interface MetacognitiveLink {
    id: string;
    source: { key: string; condition: string };
    target: { key: string; metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}
export interface MetacognitiveCausalModel {
    [linkKey: string]: MetacognitiveLink;
}

export type PluginType = 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR' | 'HEURISTIC' | 'PERSONA' | 'COGNITIVE_STRATEGY' | 'PGE' | 'ICM' | 'DDH' | 'ARO' | 'WCE' | 'CHRONOS' | 'RELAY' | 'SENSOR' | 'WIDGET';

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: PluginType;
    status: 'enabled' | 'disabled';
    defaultStatus: 'enabled' | 'disabled';
    toolSchema?: FunctionDeclaration;
    knowledge?: Omit<KnowledgeFact, 'id' | 'source'>[];
    heuristics?: Omit<DesignHeuristic, 'id' | 'source'>[];
    persona?: Omit<Persona, 'journal' | 'id'>;
    cognitiveStrategy?: Omit<CognitiveStrategy, 'id'>;
    widgetId?: string;
}

export interface PluginState {
    registry: Plugin[];
    loadedLibraries?: {
        [id: string]: { id: string; name: string, status: 'idle' | 'loading' | 'loaded' | 'error' }
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

// FIX: Add AxiomaticCrucibleState interface
export interface AxiomaticCrucibleState {
    status: 'idle' | 'running' | 'complete';
    mode: 'normal' | 'grand_unification';
    axioms: ProposedAxiom[];
    candidateAxioms: ProposedAxiom[];
    log: string[];
    inconsistencyLog?: string[];
}

// --- Neuro-Architecture Slices ---
export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: { toId: string, weight: number }[];
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
    magnitude: number;
    correctiveAction: string;
}
export interface ProtoSymbol {
    id: string;
    label: string;
    description: string;
    activation: number;
    vector: number[];
}
export interface NeuroCortexState {
    layers: any[];
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
    id: string;
    timestamp: number;
    modality: 'visual' | 'auditory' | 'proprioceptive' | 'linguistic';
    rawPrimitives: SensoryPrimitive[];
}
export interface GranularCortexState {
    lastPredictionError: {
        timestamp: number;
        magnitude: number;
        mismatchedPrimitives: { predicted: SensoryPrimitive | null, actual: SensoryPrimitive | null }[];
    } | null;
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

export interface TriageDecision {
    timestamp: number;
    percept: Percept;
    decision: 'fast' | 'slow';
    reasoning: string;
}
export interface CognitiveTriageState {
    log: TriageDecision[];
}

export interface TacticalPlan {
    id: string;
    timestamp: number;
    goal: string;
    type: 'motor' | 'cognitive';
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

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: any;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}
export interface PsycheState {
    version: number;
    primitiveRegistry: {
        [key: string]: CognitivePrimitiveDefinition;
    };
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
    activeSessions: {
        [planId: string]: PraxisSession;
    }
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

export interface SandboxResult {
    originalGoal: string;
    performanceGains: { metric: string; change: string }[];
    diff: {
        filePath: string;
        before: string;
        after: string;
    }
}
export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete';
    sprintGoal: string | null;
    log: { timestamp: number, message: string }[];
    startTime: number | null;
    result: SandboxResult | null;
}
export interface HOVAEvolutionLogEntry {
    id: string;
    timestamp: number;
    target: string;
    metric: string;
    status: 'success' | 'failed_incorrect' | 'failed_slower';
    performanceDelta: { before: number, after: number };
}
export interface HovaState {
    optimizationTarget: string | null;
    metrics: {
        totalOptimizations: number;
        avgLatencyReduction: number;
    };
    optimizationLog: HOVAEvolutionLogEntry[];
}
export interface DocumentChapter {
    id: string;
    title: string;
    content: string | null;
    isGenerating: boolean;
    diagram?: {
        description: string;
        isGenerating: boolean;
        imageUrl: string | null;
    }
}
export interface Document {
    title: string;
    chapters: DocumentChapter[];
}
export interface DocumentForgeState {
    isActive: boolean;
    goal: string;
    status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error';
    statusMessage: string;
    document: Document | null;
    error: string | null;
}
export interface DaedalusLabyrinthState {
    status: 'idle' | 'parsing' | 'complete';
    structuralKnowledgeGraph: {
        nodes: SKGNode[];
        edges: SKGEdge[];
    };
    lastAnalysis: number;
}
export interface SKGNode { id: string; label: string; type: 'file' | 'function' | 'import' | 'class'; filePath: string; }
export interface SKGEdge { source: string; target: string; type: 'imports' | 'calls' | 'extends' | 'instantiates'; }


export interface PraxisCoreState {
    log: { timestamp: number, command: string, result: string }[];
}

export interface SubsumptionLogState {
    log: { timestamp: number, message: string }[];
}


// --- AGIS / Review Board ---
export interface AGISAnalysis {
    reasoning: string;
    safetyCompliance: boolean;
    blastRadius: 'low' | 'medium' | 'high';
    confidenceScore: number;
    telosAlignment: number;
}
export interface AGISDecision {
    id: string;
    timestamp: number;
    proposalId: string;
    proposalSummary: string;
    decision: 'auto-approved' | 'sent-to-user' | 'rejected';
    analysis: AGISAnalysis;
}
export interface AutonomousReviewBoardState {
    isPaused: boolean;
    decisionLog: AGISDecision[];
    agisConfidenceThreshold: number;
    lastCalibrationReason: string;
    recentSuccesses: number;
    recentFailures: number;
}

// --- ATP Coprocessor ---
export interface ATPLogEntry {
    timestamp: number;
    engine: 'Euclid' | 'Hilbert' | 'Gödel';
    message: string;
}
export interface ProofStep {
    stepNumber: number;
    statement: string;
    status: 'pending' | 'proving' | 'proven' | 'failed';
    justification?: string;
    validationLog?: string;
}
export interface ProofAttempt {
    id: string;
    conjecture: string;
    status: 'planning' | 'proving' | 'proven' | 'failed';
    plan: ProofStep[];
    log: ATPLogEntry[];
}
export interface ATPCoprocessorState {
    status: 'idle' | 'orchestrating' | 'success' | 'failed';
    currentGoal: string | null;
    activeProofAttempt: ProofAttempt | null;
}

// FIX: Add SymbioticCanvasState interface
export interface SymbioticCanvasState {
    content: string;
}

// --- FULL AURA STATE ---
export interface AuraState {
    version: number;
    theme: string;
    language: string;
    isIdleThoughtEnabled: boolean;
    activeCognitiveMode: CognitiveMode | null;

    // Core
    internalState: InternalState;
    internalStateHistory: InternalState[];
    rieState: ReflectiveInsightEngineState;
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    atmanProjector: AtmanProjector;
    worldModelState: WorldModelState;
    curiosityState: CuriosityState;
    chronosEngine: ChronosEngineState;
    governanceState: GovernanceState;
    knownUnknowns: KnownUnknown[];
    limitations: string[];
    causalSelfModel: CausalSelfModel;
    developmentalHistory: DevelopmentalHistory;
    telosEngine: TelosEngine;
    boundaryDetectionEngine: BoundaryDetectionEngine;
    aspirationalEngine: AspirationalEngine;
    noosphereInterface: NoosphereInterface;
    dialecticEngine: DialecticEngineState;
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
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    spandaState: SpandaState;
    brainstormState: BrainstormState;
    liveSessionState: LiveSessionState;
    proactiveUI: ProactiveUIState;
    strategicCoreState: StrategicCoreState;
    mycelialState: MycelialState;
    semanticWeaverState: SemanticWeaverState;
    prometheusState: PrometheusState;
    erisEngineState: ErisEngineState;
    lagrangeEngineState: LagrangeEngineState;
    artificialScientistState: ArtificialScientistState;
    bennettEngineState: BennettEngineState;
    ockhamEngineState: OckhamEngineState;
    socraticAssessorState: SocraticAssessorState;
    // FIX: Added missing state slice
    axiomaticGenesisForgeState: AxiomaticGenesisForgeState;
    
    introspectionState: IntrospectionState;
    // FIX: Added missing state slice
    ramanujanEngineState: RamanujanEngineState;
    resonanceFieldState: { activeFrequencies: { [key: string]: { intensity: number; lastPing: number } } };
    harmonicEngineState: HarmonicEngineState;
    cognitiveRefinementState: CognitiveRefinementState;

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
    synthesisState: { emergentIdeas: any[] };

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
    systemState: SystemState;

    // UI/Interaction State
    modalRequest: { type: string, payload: any } | null;
    uiCommandRequest: { handlerName: string, args: any[] } | null;
    commandToProcess: { command: string, file?: File, traceId: string } | null;
    
    // New UI states
    symbioticCoderState: { activeFile: string | null; codeAnalysis: any | null; lastTestResult: any | null };
    collaborativeSessionState: { activeSession: CollaborativeSession | null };
    symbioticCanvasState: SymbioticCanvasState;
    logosState: { status: 'idle' | 'querying'; lastQuery: any | null; lastResult: any | null; lastError: string | null; };
    autoCodeForgeState: { status: 'idle' | 'generating' | 'complete' | 'error', problemStatement: string | null, testSuite: TestSuite | null, error: string | null };
    

    // Tool Execution
    toolExecutionRequest: ToolExecutionRequest | null;
}

export interface SystemState {
    isApiKeyInvalidated: boolean;
}

// ... other types ...
export interface Action {
    type: 'SYSCALL' | 'IMPORT_STATE' | 'RESET_STATE';
    payload?: any;
}
export type SyscallCall = 
    | 'ADD_HISTORY_ENTRY' | 'UPDATE_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY' | 'UPDATE_HISTORY_FEEDBACK'
    | 'ADD_PERFORMANCE_LOG' | 'ADD_COMMAND_LOG'
    | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE' | 'ADD_INTERNAL_STATE_HISTORY'
    | 'UPDATE_USER_MODEL' | 'QUEUE_EMPATHY_AFFIRMATION' | 'UPDATE_PERSONALITY_PORTRAIT'
    | 'UPDATE_RIE_STATE' | 'ADD_RIE_INSIGHT'
    | 'ADD_LIMITATION' | 'ADD_CAUSAL_LINK' | 'ADD_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWNS_BATCH'
    | 'UPDATE_NARRATIVE_SUMMARY'
    | 'ADD_FACT' | 'DELETE_FACT' | 'ADD_TO_WORKING_MEMORY' | 'REMOVE_FROM_WORKING_MEMORY' | 'CLEAR_WORKING_MEMORY'
    | 'ADD_EPISODE' | 'MEMORY/REINFORCE' | 'MEMORY/DECAY'
    | 'APPLY_ARCH_PROPOSAL' | 'TOGGLE_COGNITIVE_FORGE_PAUSE' | 'COGNITIVE_FORGE/ANALYZE_PERFORMANCE_LOGS' | 'ADD_SIMULATION_LOG' | 'ADD_SYNTHESIZED_SKILL'
    | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE' | 'REJECT_SELF_PROGRAMMING_CANDIDATE'
    | 'BUILD_GOAL_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_RESULT' | 'UPDATE_GOAL_OUTCOME'
    | 'UPDATE_SUGGESTION_STATUS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE'
    // FIX: Add missing syscall
    | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE' | 'ETHICAL_GOVERNOR/ADD_VETO_LOG' | 'ETHICAL_GOVERNOR/LEARN_FROM_FEEDBACK'
    | 'EXECUTE_TOOL' | 'CLEAR_TOOL_EXECUTION_REQUEST'
    | 'SET_THEME' | 'SET_LANGUAGE'
    | 'UPDATE_RESOURCE_MONITOR'
    | 'METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING' | 'METACGNITIVE_NEXUS/UPDATE_DIAGNOSTIC_FINDING'
    | 'METACGNITIVE_NEXUS/ADD_META_LINK'
    | 'ADD_SELF_TUNING_DIRECTIVE' | 'UPDATE_SELF_TUNING_DIRECTIVE'
    | 'PLUGIN/ADD_PLUGIN' | 'PLUGIN/REGISTER_LIBRARY' | 'PLUGIN/SET_LIBRARY_STATUS'
    | 'KERNEL/TICK' | 'KERNEL/QUEUE_TASK' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL'
    | 'KERNEL/BEGIN_SANDBOX_TEST' | 'KERNEL/CONCLUDE_SANDBOX_TEST' | 'KERNEL/APPLY_PATCH'
    | 'SYSTEM/REBOOT'
    | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ'
    | 'ADD_EVENT_BUS_MESSAGE'
    | 'SET_TELOS' | 'TELOS/ADD_CANDIDATE' | 'TELOS/REMOVE_CANDIDATE' | 'TELOS/ADOPT_CANDIDATE' | 'TELOS/DECOMPOSE_AND_SET_TREE'
    | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL' | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_NOETIC_ENGRAM_STATE'
    | 'SET_PSYCHEDELIC_STATE' | 'INDUCE_PSIONIC_STATE' | 'SET_SATORI_STATE'
    | 'AFFECTIVE/SET_BIAS'
    | 'INCREMENT_MANTRA_REPETITION'
    | 'ADD_WORKFLOW_PROPOSAL'
    | 'INGEST_CODE_CHANGE'
    | 'UPDATE_PERSONALITY_STATE' | 'PERSONA/ADD_JOURNAL_ENTRY'
    | 'ADD_GANKYIL_INSIGHT' | 'PROCESS_GANKYIL_INSIGHT'
    | 'MULTIVERSE/SET_BRANCHES' | 'MULTIVERSE/LOG_PRUNING' | 'MULTIVERSE/CREATE_BRANCH'
    | 'SELF_ADAPTATION/SET_ACTIVE'
    | 'SITUATIONAL_AWARENESS/UPDATE_FIELD' | 'SITUATIONAL_AWARENESS/LOG_DOM_CHANGE'
    | 'DOXASTIC/ADD_UNVERIFIED_HYPOTHESIS' | 'DOXASTIC/ADD_HYPOTHESIS' | 'DOXASTIC/UPDATE_HYPOTHESIS_STATUS' | 'DOXASTIC/DESIGN_EXPERIMENT' | 'DOXASTIC/UPDATE_EXPERIMENT_STATUS'
    | 'DOXASTIC/START_SIMULATION' | 'DOXASTIC/LOG_SIMULATION_STEP' | 'DOXASTIC/COMPLETE_SIMULATION' | 'DOXASTIC/FAIL_SIMULATION'
    | 'TEST_CAUSAL_HYPOTHESIS'
    | 'SOCIAL/ADD_NODE' | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL'
    | 'METAPHOR/ADD' | 'METAPHOR/UPDATE'
    | 'SCIENTIST/UPDATE_STATE'
    | 'METIS/SET_STATE'
    | 'WISDOM/START_INGESTION' | 'WISDOM/SET_PROPOSED_AXIOMS' | 'WISDOM/PROCESS_AXIOM' | 'WISDOM/SET_ERROR' | 'WISDOM/RESET' | 'WISDOM/ADD_PROPOSED_AXIOMS'
    | 'SPANDA/UPDATE_MANIFOLD_POSITION'
    | 'TEMPORAL_ENGINE/BEGIN_PROCESSING' | 'TEMPORAL_ENGINE/UPDATE_CHRONICLER' | 'TEMPORAL_ENGINE/UPDATE_ORACLE' | 'TEMPORAL_ENGINE/UPDATE_REACTOR' | 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG' | 'TEMPORAL_ENGINE/PROCESSING_COMPLETE' | 'TEMPORAL_ENGINE/RESET'
    | 'AXIOM_GUARDIAN/LOG_INCONSISTENCY' | 'CRUCIBLE/ADD_AXIOM_FROM_PROOF' | 'CRUCIBLE/START_CYCLE' | 'CRUCIBLE/ADD_LOG' | 'CRUCIBLE/PROPOSE_AXIOM' | 'CRUCIBLE/CYCLE_COMPLETE' | 'CRUCIBLE/START_GRAND_UNIFICATION_CYCLE'
    | 'UPDATE_NEURO_CORTEX_STATE' | 'CREATE_CORTICAL_COLUMN' | 'SET_COLUMN_ACTIVATION' | 'SYNTHESIZE_ABSTRACT_CONCEPT'
    | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT'
    | 'PROCESS_USER_INPUT_INTO_PERCEPT'
    | 'ADD_TACTICAL_PLAN' | 'SET_COMPETING_PLANS' | 'CLEAR_PLANNING_STATE'
    | 'SELECT_ACTION_PLAN'
    | 'START_CEREBELLUM_MONITORING' | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    | 'PSYCHE/REGISTER_PRIMITIVES' | 'IMPLEMENT_PSYCHE_PROPOSAL' | 'PSYCHE/ADAPT_PRIMITIVE'
    | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED' | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE'
    | 'PRAXIS/CREATE_SESSION' | 'PRAXIS/DELETE_SESSION'
    | 'LOG_COGNITIVE_TRIAGE_DECISION'
    | 'PRAXIS_CORE/LOG_EXECUTION'
    | 'SUBSUMPTION/LOG_EVENT'
    | 'STRATEGIC_CORE/LOG_DECISION' | 'STRATEGIC_CORE/UPDATE_LOG_ENTRY' | 'STRATEGIC_CORE/ADD_TRAINING_DATA'
    | 'MYCELIAL/SAVE_MODULE' | 'MYCELIAL/LOG_UPDATE'
    | 'SEMANTIC_WEAVER/SAVE_MODEL' | 'SEMANTIC_WEAVER/LOG_TRAINING'
    | 'AGIS/TOGGLE_PAUSE' | 'AGIS/ADD_DECISION_LOG' | 'AGIS/SET_THRESHOLD' | 'AGIS/CALIBRATE_CONFIDENCE'
    | 'ATP/START_PROOF_ATTEMPT' | 'ATP/SET_PROOF_PLAN' | 'ATP/UPDATE_STEP_STATUS' | 'ATP/ADD_LOG_ENTRY' | 'ATP/CONCLUDE_ATTEMPT' | 'ATP/RESET'
    | 'PROMETHEUS/START_AUTONOMOUS_CYCLE' | 'PROMETHEUS/SET_STATE' | 'PROMETHEUS/LOG' | 'PROMETHEUS/CYCLE_COMPLETE' | 'PROMETHEUS/START_GUIDED_INQUIRY' | 'PROMETHEUS/SET_SESSION_ID'
    | 'RAMANUJAN/SET_STATE' | 'RAMANUJAN/ADD_LOG' | 'RAMANUJAN/PROPOSE_CONJECTURE' | 'RAMANUJAN/UPDATE_CONJECTURE_STATUS'
    | 'SYMCODER/SET_ACTIVE_FILE' | 'SYMCODER/SET_ANALYSIS_RESULT' | 'SYMCODER/SET_TEST_RESULT'
    | 'SESSION/START' | 'SESSION/POST_MESSAGE' | 'SESSION/ADD_ARTIFACT' | 'SESSION/END' | 'SESSION/CLOSE'
    | 'CANVAS/SET_CONTENT' | 'CANVAS/APPEND_CONTENT'
    | 'SYNTHESIS/ADD_IDEA'
    | 'SOMATIC/CREATE_PFS' | 'SOMATIC/UPDATE_PFS_STATUS' | 'SOMATIC/LOG_SIMULATION' | 'SOMATIC/UPDATE_ENERGY_STATE'
    | 'AUTOCODE/SET_STATE'
    | 'RESONANCE/PING_FREQUENCY' | 'RESONANCE/DECAY_FREQUENCIES'
    | 'CRUCIBLE/START_SIMULATION' | 'CRUCIBLE/LOG_STEP' | 'CRUCIBLE/COMPLETE_SIMULATION'
    | 'DAEDALUS/SET_STATE' | 'DAEDALUS/SET_GRAPH'
    | 'ERIS/SET_ACTIVE' | 'ERIS/SET_CHAOS_LEVEL' | 'ERIS/SET_MODE' | 'ERIS/LOG_INTERVENTION'
    | 'LAGRANGE/SET_STATE' | 'LAGRANGE/ADD_LOG'
    | 'OCKHAM/SET_STATE' | 'OCKHAM/LOG'
    | 'BENNETT/SET_STATE' | 'BENNETT/LOG'
    | 'SCIENTIST/SET_STATE' | 'SCIENTIST/LOG'
    | 'SOCRATIC/SET_STATE' | 'SOCRATIC/LOG_ASSESSMENT'
    | 'FORGE/LOAD_BASE_SYSTEM' | 'FORGE/APPLY_MUTATION' | 'FORGE/SET_SURVEYOR_RESULTS' | 'FORGE/UPDATE_LANGLANDS_CANDIDATES'
    | 'LOG_COGNITIVE_REGULATION' | 'UPDATE_REGULATION_LOG_OUTCOME'
    | 'LOG_QUALIA'
    | 'MARK_LOG_CAUSAL_ANALYSIS'
    | 'LOG/MARK_MYCELIAL_TRAINED' | 'LOG/MARK_METAPHOR_PROCESSED' | 'LOG/MARK_REINFORCEMENT_PROCESSED' | 'LOG/MARK_BRIDGE_PROCESSED' | 'LOG/ADD_POL_EXECUTION'
    | 'ADD_EVENT_BUS_MESSAGE'
    | 'OA/ADD_PROPOSAL' | 'OA/UPDATE_PROPOSAL'
    // FIX: Add missing syscall
    | 'HEURISTICS_FORGE/ADD_HEURISTIC'
    | 'HOMEOSTASIS/REGULATE'
    | 'MEMORY/SYNAPTIC_PROBE' | 'MEMORY/INITIALIZE_MDNA_SPACE' | 'MEMORY/ADD_CONCEPT_VECTOR' | 'MEMORY/HEBBIAN_LEARN'
    | 'ADD_FACTS_BATCH'
    | 'CHRONICLE/UPDATE'
    | 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL'
    | 'SYNAPTIC_MATRIX/UPDATE_METRICS' | 'SYNAPTIC_MATRIX/SET_ADAPTING' | 'SYNAPTIC_MATRIX/SET_ACTIVE_CONCEPT' | 'SYNAPTIC_MATRIX/ADD_INTUITIVE_ALERT' | 'SYNAPTIC_MATRIX/LOG_PROBE'
    | 'RICCI_FLOW/LOG_SURGERY'
    | 'NEURO_CORTEX/LOG_ACTIVATION' | 'NEURO_CORTEX/ADD_PROTO_SYMBOL'
    | 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL'
    | 'USER_MODEL/LOG_TASK_SUCCESS'
    | 'BUILD_GUILD_TASK_TREE' | 'BUILD_PROOF_TREE'
    | 'TELOS/START_OPTIMIZATION'
    | 'MODAL/OPEN' | 'MODAL/CLOSE' | 'CLEAR_MODAL_REQUEST'
    | 'SHOW_PROACTIVE_UI' | 'HIDE_PROACTIVE_UI'
    | 'EXECUTE_UI_HANDLER' | 'CLEAR_UI_COMMAND_REQUEST'
    | 'PROCESS_COMMAND' | 'CLEAR_COMMAND_TO_PROCESS'
    | 'COGNITIVE/SET_STRATEGY'
    | 'TOGGLE_IDLE_THOUGHT'
    | 'SET_COGNITIVE_MODE' | 'CLEAR_COGNITIVE_MODE'
    | 'SYSTEM/API_KEY_INVALIDATED' | 'SYSTEM/CLEAR_API_KEY_INVALIDATED'
    | 'INTROSPECTION/RUN_PROBE' | 'INTROSPECTION/LOG_EVENT'
    | 'DOCUMENT_FORGE/START_PROJECT' | 'DOCUMENT_FORGE/SET_STATUS' | 'DOCUMENT_FORGE/SET_OUTLINE' | 'DOCUMENT_FORGE/UPDATE_CHAPTER' | 'DOCUMENT_FORGE/UPDATE_DIAGRAM' | 'DOCUMENT_FORGE/FINALIZE_PROJECT' | 'DOCUMENT_FORGE/RESET'
    // FIX: Add missing syscall
    | 'SANDBOX/START_SPRINT'
    | 'HARMONIC_ENGINE/SET_STATE'
    // FIX: Add BRAINSTORM syscalls
    | 'BRAINSTORM/START' | 'BRAINSTORM/ADD_IDEA' | 'BRAINSTORM/SET_WINNER' | 'BRAINSTORM/FINALIZE' | 'BRAINSTORM/RESET'
    | 'CHRONOS/LOG_SIMULATION'
    // FIX: Add missing DIALECTIC syscall
    | 'DIALECTIC/START' | 'DIALECTIC/ADD_ANALYSIS' | 'DIALECTIC/SET_SYNTHESIS'
    | 'GOVERNANCE/LOG'
    | 'REFINEMENT/START' | 'REFINEMENT/SET_DRAFT' | 'REFINEMENT/ADD_CRITIQUE_AND_REFINE' | 'REFINEMENT/FINALIZE' | 'REFINEMENT/RESET'
    // FIX: Add missing syscall from error
    | 'HISTORY/CLEAR_PREVIOUS_BRAINSTORMS'
    ;

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
    traceId?: string;
}
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface UseAuraResult {
  state: AuraState;
  dispatch: Dispatch<Action>;
  syscall: (call: SyscallCall, args: any, traceId?: string) => void;
  memoryStatus: 'initializing' | 'ready' | 'saving' | 'error';
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  t: (key: string, options?: any) => string;
  i18n: any;
  language: string;
  geminiAPI: UseGeminiAPIResult;

  // UI Handlers
  currentCommand: string;
  setCurrentCommand: Dispatch<SetStateAction<string>>;
  attachedFile: { file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null;
  setAttachedFile: Dispatch<SetStateAction<{ file: File, previewUrl: string, type: 'image' | 'audio' | 'video' | 'other' } | null>>;
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
  handleGenerateArchitecturalSchema: () => void;
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
  handleApprovePsycheAdaptation: (proposal: PsycheAdaptationProposal) => void;
  handleOrchestrateTask: () => void;
  handleExplainComponent: () => void;
  handleStartMetisResearch: (problem: string) => Promise<void>;
  handleStartOptimizationLoop: (goal: string) => void;
  handleToggleIdleThought: () => void;
  handleStartDialectic: (topic: string) => void;
  
  // Live Session Handlers
  startSession: (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => Promise<void>;
  stopSession: () => void;
  
  // Command Handler
  handleSendCommand: (command: string, file?: File) => void;
  handleFeedback: (id: string, feedback: 'positive' | 'negative') => void;
}

export interface UseGeminiAPIResult {
  triageUserIntent: (text: string) => Promise<TriageResult>;
  assessTaskDifficulty: (command: string) => Promise<number>;
  generateChatResponse: (history: HistoryEntry[], strategyId: string, mode: CognitiveMode | null) => Promise<GenerateContentStreamResponse>;
  generateIdleThought: (context: string) => Promise<string>;
  formalizeAnalogyIntoConjecture: (analogy: AnalogicalHypothesisProposal) => Promise<string>;
  generateProofStrategy: (conjecture: string) => Promise<ProofStep[]>;
  verifyProofStep: (mainGoal: string, provenSteps: ProofStep[], currentStep: ProofStep) => Promise<{ isValid: boolean; justification: string; }>;
  analyzeMarketData: (context: string) => Promise<string>;
  explainCode: (code: string) => Promise<string>;
  refactorCode: (code: string, instruction: string) => Promise<string>;
  generateTestForCode: (code: string) => Promise<string>;
  formulateHypothesis: (goal: string, context: string) => Promise<string>;
  designExperiment: (hypothesis: string, tools: { name: string; description: string }[]) => Promise<DoxasticExperiment>;
  analyzeExperimentResults: (results: any) => Promise<{ learning: string, isSuccess: boolean }>;
  generateNarrativeSummary: (lastSummary: string, lastTurn: HistoryEntry[]) => Promise<string>;
  analyzeImage: (prompt: string, file: File) => Promise<GenerateContentStreamResponse>;
  extractPuzzleFeatures: (file: File) => Promise<PuzzleFeatures>;
  classifyPuzzleArchetype: (features: PuzzleFeatures) => Promise<PuzzleClassification>;
  generateHeuristicPlan: (features: PuzzleFeatures, existingHeuristics: DesignHeuristic[], archetype: PuzzleArchetype) => Promise<HeuristicPlan>;
  generateConditionalHypothesis: (features: PuzzleFeatures, plan: HeuristicPlan, archetype: PuzzleArchetype) => Promise<Hypothesis>;
  verifyHypothesis: (features: PuzzleFeatures, hypothesis: Hypothesis) => Promise<{ status: 'VALID' | 'INVALID'; reason: string }>;
  applySolution: (testInputFeatures: any, hypothesis: Hypothesis) => Promise<GenerateContentStreamResponse>;
  analyzeSolverFailureAndProposeImprovements: (features: PuzzleFeatures, failedHypothesis: Hypothesis, verificationReason: string) => Promise<string>;
  generateHeuristicFromSuccess: (features: PuzzleFeatures, plan: HeuristicPlan, hypothesis: Hypothesis) => Promise<Omit<DesignHeuristic, 'id'>>;
  generateHeuristicFromTaskSuccess: (context: string) => Promise<Omit<DesignHeuristic, 'id'>>;
  summarizePuzzleSolution: (solutionTrace: string) => Promise<string>;
  generateEpisodicMemory: (userInput: string, botResponse: string) => Promise<Partial<Episode>>;
  analyzeWhatIfScenario: (scenario: string) => Promise<string>;
  performWebSearch: (query: string) => Promise<{ summary: string; sources: any[] }>;
  decomposeStrategicGoal: (history: HistoryEntry[]) => Promise<{ isAchievable: boolean; reasoning: string; steps: string[]; alternative?: string; executionMode: 'interactive' | 'batch' }>;
  generateExecutiveSummary: (goal: string, plan: string[]) => Promise<string>;
  executeStrategicStepWithContext: (originalGoal: string, previousSteps: { description: string; result: string }[], currentStep: string, tool: 'googleSearch' | 'knowledgeGraph') => Promise<{ summary: string; sources: any[] }>;
  generateBrainstormingIdeas: (topic: string, customPersonas?: Persona[]) => Promise<BrainstormIdea[]>;
  synthesizeBrainstormWinner: (topic: string, ideas: BrainstormIdea[]) => Promise<string>;
  generateImage: () => Promise<string[]>;
  editImage: (base64ImageData: string, mimeType: string, prompt: string) => Promise<string | null>;
  generateVideo: (prompt: string, onProgress: (message: string) => void) => Promise<string | null>;
  expandOnText: (text: string) => Promise<string>;
  summarizeText: (text: string) => Promise<string>;
  generateDiagramFromText: (text: string) => Promise<string>;
  generateFormalProof: (statement: string) => Promise<ProofResult>;
  generateSonicContent: (mode: string, prompt: string, genre: string, mood: string, persona: string, useAuraMood: boolean, memoryContext: string) => Promise<any>;
  generateMusicalDiceRoll: () => Promise<any>;
  generateDreamPrompt: () => Promise<string>;
  processCurriculumAndExtractFacts: (curriculum: string) => Promise<KnowledgeFact[]>;
  analyzePdfWithVision: (pages: string[]) => Promise<string>;
  generateNoeticEngram: () => Promise<NoeticEngram>;
  runSandboxSprint: (goal: string) => Promise<SandboxResult>;
  extractAxiomsFromFile: (file: File) => Promise<ProposedAxiom[]>;
  visualizeInsight: (insight: string) => Promise<string>;
  generateDocumentOutline: (goal: string) => Promise<any>;
  generateChapterListForTitle: (title: string, originalGoal: string) => Promise<string[]>;
  generateChapterContent: (docTitle: string, chapterTitle: string, goal: string) => Promise<string>;
  generateProofStepsStream: (goal: string) => Promise<GenerateContentStreamResponse>;
  findAnalogiesInKnowledgeGraph: () => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status' | 'proposalType'>>;
  findDirectedAnalogy: (source: string, target: string) => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status' | 'proposalType'>>;
  generateSelfImprovementProposalFromResearch: () => Promise<Omit<ArchitecturalChangeProposal, 'id' | 'timestamp'>>;
  generateConceptualProofStrategy: (goal: string) => Promise<ConceptualProofStrategy>;
  analyzeProofStrategy: (goal: string, status: 'success' | 'failure', log: string) => Promise<Omit<DesignHeuristic, 'id'>>;
  generateDailyChronicle: (episodes: Episode[], facts: KnowledgeFact[]) => Promise<Summary>;
  generateGlobalSummary: (chronicles: Summary[]) => Promise<Summary>;
  crystallizePrinciples: (chronicles: Summary[]) => Promise<Omit<KnowledgeFact, 'id' | 'source' | 'strength' | 'lastAccessed'>[]>;
  proposePrimitiveAdaptation: (failedLogs: PerformanceLogEntry[], primitives: { [key: string]: CognitivePrimitiveDefinition }) => Promise<PsycheAdaptationProposal>;
  reviewSelfProgrammingCandidate: (candidate: SelfProgrammingCandidate, telos: string) => Promise<{ decision: 'approve' | 'reject'; confidence: number; reasoning: string }>;
  translateToQuery: (prompt: string) => Promise<Query>;
  formatQueryResult: (prompt: string, result: QueryResult) => Promise<string>;
  runAutoCodeVGC: (problem: string) => Promise<TestSuite>;
  generateNovelProblemFromSeed: (problem: string, difficulty: number) => Promise<{ newProblem: string; referenceSolution: string; bruteForceSolution: string; estimatedDifficulty: number }>;
  estimateProblemDifficulty: (problem: string) => Promise<number>;
  analyzeArchitectureForWeaknesses: () => Promise<string>;
  generateCrucibleProposal: (analysis: string) => Promise<Omit<ArchitecturalChangeProposal, 'id' | 'timestamp'>>;
  runCrucibleSimulation: (proposal: ArchitecturalChangeProposal) => Promise<{ performanceGain: number; stabilityChange: number; summary: string }>;
  orchestrateWorkflow: (goal: string, tools: { name: string; description: string }[]) => Promise<Omit<CoCreatedWorkflow, 'id'>>;
  explainComponentFromFirstPrinciples: (code: string, name: string) => Promise<string>;
  runMetisHypothesis: (problem: string) => Promise<string>;
  runMetisExperiment: (problem: string, hypothesis: string) => Promise<string>;
  designDoxasticExperiment: (hypothesis: string) => Promise<DoxasticExperiment>;
  runInternalCritique: (task: string, output: string, plan: string[], persona: Persona) => Promise<string>;
  synthesizeCritiques: (auditor: string, adversary: string) => Promise<string>;
  revisePlanBasedOnCritique: (plan: string[], critique: string) => Promise<string[]>;
  evaluateExperimentResult: (hypothesis: string, method: string, result: any) => Promise<{ outcome: 'validated' | 'refuted'; reasoning: string }>;
  decomposeGoalForGuilds: (goal: string, personas: Persona[]) => Promise<GuildDecomposition>;
  analyzePlanForKnowledgeGaps: (plan: PreFlightPlan) => Promise<PreFlightPlan>;
  simplifyPlan: (plan: string[]) => Promise<string[]>;
  simplifyCode: (code: string) => Promise<string>;
  weakenConjecture: (conjecture: string) => Promise<string>;
  generalizeWorkflow: (workflow: CoCreatedWorkflow) => Promise<Omit<CoCreatedWorkflow, 'id'>>;
  generateCollaborativePlan: (goal: string, participants: Persona[]) => Promise<any>;
  mutateUserRequest: (request: string) => Promise<string>;
  generateLagrangianEquation: (conjecture: string) => Promise<string>;
  generateEthicalHeuristicFromFeedback: (userInput: string, aiResponse: string) => Promise<string>;
  // FIX: Add missing properties
  reportInjectedThought: (concept: string) => Promise<string>;
  critiqueIntrospection: (concept: string, report: string) => Promise<{ isAccurate: boolean; reasoning: string }>;
  analyzeProofFailureAndSuggestImprovements: (goal: string, failureReason: string) => Promise<string>;
  mapStepToKernelTask: (stepDescription: string) => Promise<{ taskType: KernelTaskType, payload: any }>;
  simulateStateEvolution: (prompt: string) => Promise<{ projectedBoredom: number; reasoning: string; }>;
  generatePersonaAnalysis: (topic: string, persona: Persona) => Promise<string>;
  synthesizeCompetingAnalyses: (topic: string, analysisA: string, analysisB: string) => Promise<string>;
  runDeductionAnalysis: (context: { failedGoal: Goal; history: HistoryEntry[]; performanceLogs: PerformanceLogEntry[]; syscallLog: any[] }) => Promise<string>;
  findCodePatternsAndGeneralize: (files: { path: string; content: string }[]) => Promise<CreateFileCandidate | null>;
  findRelatedUntrackedTopics: (concepts: string[]) => Promise<string[]>;
  generateRefinementDraft: (prompt: string) => Promise<string>;
  generateRefinementCritique: (prompt: string, draft: string) => Promise<string>;
  refineDraftWithCritique: (prompt: string, draft: string, critiques: string[]) => Promise<string>;
}

export type UIHandlers = Omit<UseAuraResult, 'state' | 'dispatch' | 'memoryStatus' | 'toasts' | 'addToast' | 'removeToast' | 't' | 'i18n' | 'language' | 'geminiAPI' | 'handleSendCommand' | 'handleFeedback' | 'startSession' | 'stopSession'>;

// FIX: Added PsycheAdaptationProposal to the UnifiedProposal union type.
export type UnifiedProposal = ArchitecturalChangeProposal | SelfProgrammingCandidate | PsycheProposal | AnalogicalHypothesisProposal | GenialityImprovementProposal | KernelPatchProposal | PsycheAdaptationProposal;
export type ArchitecturalChangeProposal = { id: string, timestamp: number, proposalType: 'architecture' | 'crucible', reasoning: string; action: 'ADD_COMPONENT' | 'REMOVE_COMPONENT' | 'MODIFY_COMPONENT_LOGIC' | 'REFACTOR' | 'RADICAL_REFACTOR'; target: string | string[]; status: 'proposed' | 'approved' | 'rejected' | 'implemented' | 'simulating' | 'evaluated' | 'simulation_failed'; failureReason?: string; arbiterReasoning?: string; confidence?: number; newModule?: string; };
export type SelfProgrammingCandidate = (CreateFileCandidate | ModifyFileCandidate) & { id: string, timestamp: number, status: 'proposed' | 'approved' | 'rejected' | 'implemented' | 'simulating' | 'evaluated' | 'simulation_failed', source: 'autonomous' | 'user', reasoning: string; failureReason?: string; };
export type CreateFileCandidate = { proposalType: 'self_programming_create', newFile: { path: string; content: string }, integrations: { filePath: string; newContent: string }[], newPluginObject?: Omit<Plugin, 'status'> };
export type ModifyFileCandidate = { proposalType: 'self_programming_modify', targetFile: string, codeSnippet: string };
export type PsycheProposal = { id: string, timestamp: number, proposalType: 'psyche', status: 'proposed' | 'approved' | 'rejected' | 'implemented', sourceConcepts: { id: string; description: string }[], proposedConceptName: string, reasoning: string };
export type AnalogicalHypothesisProposal = { id: string, timestamp: number, proposalType: 'analogical_hypothesis', status: 'proposed' | 'approved' | 'rejected' | 'implemented', sourceDomain: string; targetDomain: string; analogy: string; conjecture: string; priority: number; reasoning: string };
export type GenialityImprovementProposal = { id: string, timestamp: number, proposalType: 'geniality', status: 'proposed' | 'approved' | 'rejected' | 'implemented', area: 'creativity' | 'insight' | 'synthesis'; suggestion: string; reasoning: string; };
export type KernelPatchProposal = { id: string, timestamp: number, proposalType: 'kernel_patch', status: 'proposed' | 'testing' | 'passed' | 'failed' | 'applied', changeDescription: string, patch: { type: 'SET_FREQUENCY', payload: { task: KernelTaskType, newFrequency: number } } };

export interface ModalPayloads {
  causalChain: { log: PerformanceLogEntry };
  proposalReview: { proposal: ArchitecturalChangeProposal };
  whatIf: {};
  search: { initialQuery?: string };
  strategicGoal: { initialGoal?: string };
  forecast: {};
  cognitiveGainDetail: { log: CognitiveGainLogEntry };
  multiverseBranching: {};
  brainstorm: { initialTopic?: string, personas?: Persona[] };
  imageGeneration: { initialPrompt?: string };
  imageEditing: { initialImage?: string };
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
  orchestrator: {};
  reflector: {};
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    systemInstruction: string;
    journal: string[];
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
    transcript: { personaId: string; content: string; timestamp: number }[];
    artifacts: { name: string; type: 'plan' | 'code' | 'document'; content: any }[];
}
export interface Query {
    select: string[];
    where: { subject: string; predicate: string; object: string }[];
}
export interface QueryResult {
    [key: string]: any[];
}
export interface TestSuite {
    validator: string;
    generator: string;
    checker: string;
    testCases: { input: string; output: string }[];
}
export interface GuildDecomposition {
    steps: {
        task: string;
        personaId: string;
        type?: 'Research' | 'Action';
    }[];
}
export interface PreFlightPlan {
    steps: {
        task: string;
        personaId: string;
        type?: 'Research' | 'Action';
    }[];
}
export interface ProofResult {
    isValid: boolean;
    isComplete: boolean;
    explanation: string;
    steps: {
        step: number;
        action: string;
        result: string;
        strategy: string;
    }[];
    suggestedNextStep?: string;
}

// --- Puzzle Solving Types ---
export interface PuzzleFeatures {
    overall_description: string;
    examples: { input: any; output: any }[];
    test_input: any;
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
export interface TscError {
    file: string;
    line: number;
    character: number;
    message: string;
}
export type CognitivePrimitive = { type: string, payload: any };
export type AbstractConceptProposal = { id: string, timestamp: number, proposalType: 'abstract_concept', status: 'proposed' | 'approved' | 'rejected' | 'implemented', sourceColumnIds: string[], newConceptName: string, reasoning: string };
export type PsycheAdaptationProposal = { id: string, timestamp: number, proposalType: 'psyche_adaptation', status: 'proposed' | 'approved' | 'rejected' | 'implemented', targetPrimitive: string, newDefinition: CognitivePrimitiveDefinition, reasoning: string };
export interface RicciFlowSurgeryLog {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}
export interface ToolExecutionRequest {
    id: string;
    toolName: string;
    args: any;
}
export type TriageResult = {
    type: 'SIMPLE_CHAT' | 'COMPLEX_TASK' | 'BRAINSTORM' | 'BRAINSTORM_SCIFI_COUNCIL' | 'MATHEMATICAL_PROOF' | 'VISION_ANALYSIS' | 'SYMBOLIC_SOLVER';
    goal: string;
    reasoning: string;
};
export interface ConceptualProofStrategy {
    problem_analysis: string;
    strategic_plan: string[];
}
