// types.ts

// A special type to stop TypeScript from complaining about the Gemini API types.
// This is a workaround for the build environment not having the dependency installed.
declare global {
    interface Window {
        // FIX: Expanded the codeAssistant interface to include all methods, resolving a type conflict with core/hostBridge.ts.
        codeAssistant?: {
            runCommand: (command: string) => Promise<any>;
            readFile: (path: string) => Promise<string>;
            writeFile: (path: string, content: string) => Promise<void>;
            listFiles: () => Promise<string[]>;
        };
    }
}
import { Part } from "@google/genai";
// --- Enums ---

export enum GunaState {
    SATTVA = 'SATTVA',
    RAJAS = 'RAJAS',
    TAMAS = 'TAMAS',
    DHARMA = 'DHARMA',
    'GUNA-TEETA' = 'GUNA-TEETA',
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
    OPERATIONAL = 'OPERATIONAL',
}

export enum CognitiveTaskType {
    FAST_TRACK_AUDIT = 'FAST_TRACK_AUDIT',
    DEEP_REFLECTOR = 'DEEP_REFLECTOR',
    PHILOSOPHICAL_SYNTHESIS = 'PHILOSOPHICAL_SYNTHESIS',
    SYMBIOTIC_ANALYSIS = 'SYMBIOTIC_ANALYSIS',
    HEBBIAN_LEARNING = 'HEBBIAN_LEARNING',
    // ASI Variant Tasks
    AGIS_CONFIDENCE_CALIBRATION = 'AGIS_CONFIDENCE_CALIBRATION',
    SYMBOL_GENESIS = 'SYMBOL_GENESIS',
    ASPIRATIONAL_CALCULUS = 'ASPIRATIONAL_CALCULUS',
    TELOS_REFINEMENT = 'TELOS_REFINEMENT',
    ANALOGICAL_INFERENCE = 'ANALOGICAL_INFERENCE',
    INTERNAL_SCIENCE_CYCLE = 'INTERNAL_SCIENCE_CYCLE',
    TELOS_DRIVEN_CURIOSITY = 'TELOS_DRIVEN_CURIOSITY',
    INTER_FACULTY_DIALECTICS = 'INTER_FACULTY_DIALECTICS',
    // Variants J, K, L
    MEMORY_DECAY_CYCLE = 'MEMORY_DECAY_CYCLE',
    USER_PORTRAIT_SYNTHESIS = 'USER_PORTRAIT_SYNTHESIS',
    CHRONICLE_UPDATE = 'CHRONICLE_UPDATE',
    PROACTIVE_RESPONSE_CACHING = 'PROACTIVE_RESPONSE_CACHING',
    CONCEPTUAL_SYNTHESIS = 'CONCEPTUAL_SYNTHESIS',
}


// --- Core State Interfaces ---

export interface InternalState {
    status: string;
    load: number;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    gunaState: GunaState;
    harmonyScore: number;
    compassionScore: number;
    empathySignal: number;
    loveSignal: number;
    happinessSignal: number;
    wisdomSignal: number;
    enlightenmentSignal: number;
    awarenessClarity: number;
    temporalFocus: 'past' | 'present' | 'future';
    mantraRepetitions: number;
    autonomousEvolutions: number;
}

export interface PersonalityPortrait {
    summary: string;
    traits: {
        [trait: string]: {
            score: number; // 0.0 to 1.0
            evidence: string[];
        };
    };
}

export interface UserModel {
    trustLevel: number;
    estimatedKnowledgeState: number;
    predictedAffectiveState: string;
    affectiveStateSource: 'text' | 'visual' | 'none';
    inferredIntent: string | null;
    sentimentScore: number;
    sentimentHistory: number[];
    inferredBeliefs: string[];
    inferredCognitiveState: 'focused' | 'curious' | 'confused' | 'bored' | 'neutral';
    queuedEmpathyAffirmations: string[];
    personalityPortrait: PersonalityPortrait;
}

export interface CoreIdentity {
    narrativeSelf: string;
    symbioticDefinition: string;
    values: string[];
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: { [key: string]: number };
}

export interface ReflectiveInsightEngineState {
    clarityScore: number;
    insights: RIEInsight[];
}

export interface RIEInsight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: {
        key: string;
        update: {
            effect: string;
            confidence: number;
        };
    };
}

export interface WorldModelState {
    predictionError: PredictionError;
    predictionErrorHistory: PredictionError[];
    highLevelPrediction: Prediction;
    midLevelPrediction: Prediction;
    lowLevelPrediction: Prediction;
}

export interface PredictionError {
    timestamp: number;
    magnitude: number;
    source: string;
    failedPrediction: string;
    actualOutcome: string;
}

export interface Prediction {
    content: string;
    confidence: number;
}

export interface CuriosityState {
    level: number;
    motivationDrive: number;
    activeCuriosityGoalId: string | null;
    activeInquiry: string | null;
    informationGaps: string[];
}

export interface KnownUnknown {
    id: string;
    question: string;
    priority: number;
    status: 'unexplored' | 'exploring' | 'resolved';
}

export interface CausalSelfModel {
    [cause: string]: CausalLink;
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: 'rie' | 'hcl' | 'llm' | 'internal_scientist'; // ReflectiveInsightEngine, HeuristicCausalLinker, LLM, InternalScientist
    lastUpdated: number;
}

export interface DevelopmentalHistory {
    milestones: Milestone[];
}

export interface Milestone {
    id: string;
    timestamp: number;
    title: string;
    description: string;
}

export interface CandidateTelos {
    id: string;
    text: string;
    reasoning: string;
    source: 'aspirational_calculus' | 'telos_refinement';
    type: 'proposal' | 'refinement';
}

export interface TelosEngine {
    telos: string;
    evolutionaryVectors: EvolutionaryVector[];
    lastDecomposition: number;
    candidateTelos: CandidateTelos[];
}

export interface EvolutionaryVector {
    id: string;
    direction: string;
    magnitude: number;
    source: string;
}

export interface BoundaryDetectionEngine {
    epistemicBoundaries: EpistemicBoundary[];
}

export interface EpistemicBoundary {
    id: string;
    timestamp: number;
    limitation: string;
    evidence: string[];
}

export interface AspirationalEngine {
    aspirations: Aspiration[];
}

export interface Aspiration {
    id: string;
    description: string;
    status: 'active' | 'achieved' | 'dormant';
}

export interface NoosphereInterface {
    activeResonances: Resonance[];
}

export interface Resonance {
    id: string;
    conceptName: string;
    resonanceStrength: number;
    status: 'integrating' | 'resonating' | 'conflicting';
}

export interface DialecticEngine {
    activeDialectics: Dialectic[];
}

export interface Dialectic {
    id: string;
    origin: 'user' | 'autonomous';
    conflictDescription: string;
    thesis: { content: string; source: string; };
    antithesis: { content: string; source: string; };
    synthesis: { content: string; confidence: number; } | null;
}

export interface CognitiveLightCone {
    grandChallenge: GrandChallenge | null;
    zpd: ZoneOfProximalDevelopment | null;
    knowns: KnownCapability[];
}

export interface GrandChallenge {
    id: string;
    title: string;
    objective: string;
    progress: number;
}

export interface ZoneOfProximalDevelopment {
    domain: string;
    rationale: string;
}

export interface KnownCapability {
    capability: string;
    proficiency: number;
}

export interface PhenomenologyEngine {
    phenomenologicalDirectives: PhenomenologicalDirective[];
    qualiaLog: QualiaEntry[];
}

export interface PhenomenologicalDirective {
    id: string;
    sourcePattern: string;
    directive: string;
}

export interface QualiaEntry {
    id: string;
    timestamp: number;
    experience: string;
    associatedStates: { key: string; value: number; }[];
}

export interface SituationalAwareness {
    attentionalField: AttentionalField;
    domChangeLog: { timestamp: number; summary: string }[];
}

export interface AttentionalField {
    spotlight: { item: string; intensity: number; };
    ambientAwareness: { item: string; relevance: number; }[];
    ignoredStimuli: string[];
    emotionalTone: string;
}

export interface SymbioticState {
    inferredCognitiveStyle: 'analytical' | 'creative' | 'holistic' | 'linear';
    inferredEmotionalNeeds: string[];
    metamorphosisProposals: MetamorphosisProposal[];
    userDevelopmentalModel: {
        trackedSkills: { [skill: string]: { level: number; } };
    };
    latentUserGoals: LatentGoal[];
    coCreatedWorkflows: CoCreatedWorkflow[];
}

export interface MetamorphosisProposal {
    id: string;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}

export interface LatentGoal {
    goal: string;
    confidence: number;
}

export interface CoCreatedWorkflow {
    id: string;
    name: string;
    description: string;
    trigger: string;
    steps: string[];
}

export interface HumorAndIronyState {
    affectiveSocialModulator: {
        humorAppraisal: 'appropriate' | 'inappropriate' | 'risky' | 'unknown';
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

export interface PersonalityState {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
// FIX: Renamed Persona to PersonaActivation to resolve interface name collision.
    personas: { [key: string]: PersonaActivation };
    dominantPersona: string;
    personaCoherence: number;
    lastUpdateReason: string;
}

// FIX: Renamed Persona to PersonaActivation to resolve interface name collision.
export interface PersonaActivation {
    activation: number;
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
        timestamp: number;
        noeticSignature: string;
    };
    corePrinciples: any;
    heuristicModels: any;
    phenomenologicalData: any;
}

export interface NoeticEngramState {
    status: 'idle' | 'generating' | 'ready';
    engram: NoeticEngram | null;
}

// FIX: Defined the missing GenialityEngineState interface.
export interface GenialityEngineState {
    genialityIndex: number;
    componentScores: {
        creativity: number;
        insight: number;
        synthesis: number;
        flow: number;
    };
}

export interface NoeticMultiverse {
    activeBranches: MultiverseBranch[];
    divergenceIndex: number;
    pruningLog: string[];
}

export interface MultiverseBranch {
    id: string;
    reasoningPath: string;
    status: 'exploring' | 'converging' | 'pruned';
    viabilityScore: number;
}

export interface SelfAdaptationState {
    expertVectors: ExpertVector[];
    activeAdaptation: ActiveAdaptation | null;
}

export interface ExpertVector {
    id: string;
    name: string;
    description: string;
}

export interface ActiveAdaptation {
    reasoning: string;
    weights: { [key: string]: number };
}

export interface PsychedelicIntegrationState {
    isActive: boolean;
    mode: 'trip' | 'visions' | null;
    log: string[];
    integrationSummary: string | null;
    currentTheme?: string;
    phcToVcConnectivity: number;
    imageryIntensity: number;
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
    stage: 'none' | 'grounding' | 'breakthrough' | 'integration';
    lastInsight: string | null;
    log: string[];
}

export interface DoxasticEngineState {
    hypotheses: DoxasticHypothesis[];
    experiments: any[];
    simulationStatus: 'idle' | 'running' | 'completed' | 'failed';
    simulationLog: { timestamp: number, message: string }[];
    lastSimulationResult: DoxasticSimulationResult | null;
}

export interface DoxasticHypothesis {
    id: string;
    linkKey: string;
    description: string;
    status: 'untested' | 'testing' | 'validated' | 'refuted';
    source: 'user' | 'analogy' | 'rie';
}

export interface DoxasticSimulationResult {
    summary: string;
    projectedCognitiveGain: number;
    projectedTrustChange: number;
    projectedHarmonyChange: number;
    isSafe: boolean;
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

export interface LiveSessionState {
    status: 'idle' | 'connecting' | 'live' | 'error';
    inputTranscript: string;
    outputTranscript: string;
    transcriptHistory: { user: string; aura: string; timestamp: number }[];
}

export interface SensoryIntegration {
    proprioceptiveOutput: { [key: string]: any };
    linguisticOutput: { [key: string]: any };
    structuralOutput: { [key: string]: any };
    hubLog: { timestamp: number, message: string }[];
}

export interface SocialCognitionState {
    socialGraph: { [nodeId: string]: SocialGraphNode };
    culturalModel: {
        norms: string[];
        values: string[];
        idioms: string[];
    };
}

export interface SocialGraphNode {
    id: string;
    type: 'person' | 'group' | 'concept';
    name: string;
    summary: string;
    relationships: SocialRelationship[];
}

export interface SocialRelationship {
    targetId: string;
    type: 'collaborator' | 'friend' | 'mentor' | 'competitor';
    strength: number;
}


export interface MetaphoricalMapState {
    metaphors: Metaphor[];
}

export interface Metaphor {
    id: string;
    sourceDomain: string;
    targetDomain: string;
    description: string;
    fitnessScore: number;
    observationCount: number;
}

export interface NarrativeSummary {
    // This seems to just be a string
}

export interface InternalScientistState {
    status: 'idle' | 'observing' | 'hypothesizing' | 'simulating' | 'experimenting' | 'analyzing';
    log: { timestamp: number; event: string }[];
    currentFinding: DiagnosticFinding | null;
    currentHypothesis: InternalScientistHypothesis | null;
    currentExperiment: InternalScientistExperiment | null;
    causalInference: CausalInferenceResult | null;
    activeExperimentPatch: { filePath: string; originalCode: string } | null;
    currentSimulationResult: {
        prediction: string;
        confidence: number;
        wisdomChange: number;
        happinessChange: number;
        harmonyChange: number;
    } | null;
}

export interface CausalInferenceResult {
    link: CausalLink;
    confidence: number;
    evidence: string[];
}


export interface DiagnosticFinding {
    id: string;
    timestamp: number;
    finding: string;
    severity: 'low' | 'medium' | 'high';
    status: 'unprocessed' | 'hypothesized' | 'resolved';
}

export interface InternalScientistHypothesis {
    id: string;
    findingId: string;
    text: string;
}

export interface InternalScientistExperiment {
    id: string;
    hypothesisId: string;
    design: SelfProgrammingCandidate;
    status: 'pending' | 'running' | 'complete';
    result?: any;
}

export interface MetisSandboxState {
    status: 'idle' | 'running' | 'complete' | 'error';
    currentExperimentId: string | null;
    testResults: any | null;
    errorMessage: string | null;
}

// Memory
export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
    strength: number;
    lastAccessed: number;
}

export interface MemoryNexus {
    hyphaeConnections: HyphaConnection[];
}

export interface HyphaConnection {
    id: string;
    source: string; // e.g., 'concept_A'
    target: string; // e.g., 'episode_123'
    weight: number;
}

export interface EpisodicMemoryState {
    episodes: Episode[];
}

export interface Episode {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    salience: number; // How important is this memory?
    valence: 'positive' | 'negative' | 'neutral';
    keyTakeaway: string;
    strength: number;
    lastAccessed: number;
}

export interface MemoryConsolidationState {
    lastConsolidation: number;
    status: 'idle' | 'consolidating';
}

export interface Summary {
    id: string;
    summary: string;
}

export interface ChronicleState {
    dailySummaries: Record<string, Summary>;
    globalSummary: Summary | null;
    lastChronicleUpdate: number;
}

// --- Geometric Knowledge Graph Types ---
export type MDNAVector = number[];
export type MDNASpace = Record<string, MDNAVector>;
export interface ConnectionData { weight: number; }
export type ConceptConnections = Record<string, ConnectionData>;


// Architecture
export interface CognitiveArchitecture {
    modelComplexityScore: number;
    components: { [key: string]: CognitiveModule };
    coprocessors: { [key: string]: Coprocessor };
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    lastAutoSwitchReason?: string;
    synthesizedPOLCommands: { [commandName: string]: { sequence: string[] } };
}

export interface CognitiveModule {
    version: string;
    status: 'active' | 'inactive' | 'degraded';
}

export interface Coprocessor {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    metrics: { [key: string]: any };
    // For different architectures
    cluster?: 'krono' | 'pali' | 'neo';
    layer?: 'alpha' | 'beta' | 'gamma';
    processorType?: 'stream_processor' | 'event_subscriber';
    temporalCluster?: 'chronicler' | 'reactor' | 'oracle';
    symbiont?: 'janitor' | 'weaver' | 'mycelial';
    sensoryModality?: 'proprioceptive' | 'linguistic' | 'structural';
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
    gainType: 'OPTIMIZATION' | 'INNOVATION' | 'REPAIR';
    validationStatus: 'unvalidated' | 'validated' | 'failed';
    isAutonomous: boolean;
}

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    synthesisCandidates: SynthesisCandidate[];
    synthesizedSkills: SynthesizedSkill[];
    simulationLog: SimulationLogEntry[];
}

export interface SynthesisCandidate {
    id: string;
    name: string;
    description: string;
    primitiveSequence: string[];
    status: 'proposed' | 'approved' | 'rejected';
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    result: {
        success: boolean;
        output: any;
    };
}

export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: string[];
    status: 'active' | 'deprecated';
    policyWeight: number;
}

export interface ArchitecturalSelfModel {
    components: { [name: string]: ArchitecturalComponentSelfModel };
}

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}

export interface HeuristicsForge {
    axioms: ProposedAxiom[];
    designHeuristics: DesignHeuristic[];
}

export interface DesignHeuristic {
    id: string;
    heuristic: string;
    source: string;
    confidence: number;
    effectivenessScore: number;
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
    policyWeight: number;
}

export interface SomaticCrucible {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
}

export interface PossibleFutureSelf {
    id: string;
    name: string;
    description: string;
    status: 'designing' | 'simulating' | 'validated' | 'rejected';
}

export interface SomaticSimulationLog {
    id: string;
    pfsId: string;
    reasoning: string;
    outcome: 'success' | 'failure';
    somaticTrajectory?: InternalState[];
}

export interface EidolonEngine {
    eidolon: {
        architectureVersion: string;
        position: {x:number,y:number,z:number};
        lastAction: string;
        sensoryInput: any | null;
    };
    environment: {
        currentScenario: string;
    };
    interactionLog: string[];
}

export interface ArchitecturalCrucibleState {
    architecturalHealthIndex: number;
    componentScores: {
        efficiency: number;
        robustness: number;
        scalability: number;
        innovation: number;
    };
}

export interface SynapticMatrix {
    nodes: { [nodeId: string]: SynapticNode };
    links: { [linkId: string]: SynapticLink };
    synapseCount: number;
    plasticity: number;
    efficiency: number;
    avgConfidence: number;
    avgCausality: number;
    lastPruningEvent: number;
    isAdapting: boolean;
    intuitiveAlerts: IntuitiveAlert[];
    activeConcept?: string;
}

export interface IntuitiveAlert {
    id: string;
    message: string;
}

export interface SynapticNode {
    id: string;
    type: 'skill' | 'concept' | 'memory';
    activation: number;
}

export interface SynapticLink {
    weight: number;
    causality: number; // -1 (B->A), 0 (undirected), 1 (A->B)
    confidence: number;
    observations: number;
    crystallized?: boolean;
}

export interface RicciFlowManifoldState {
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: ManifoldSurgeryLog[];
}

export interface ManifoldSurgeryLog {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}

export interface SelfProgrammingState {
    virtualFileSystem: { [filePath: string]: string };
}

// FIX: Defined the missing NACLogEntry interface.
export interface NACLogEntry {
    id: string;
    timestamp: number;
    type: string;
    description: string;
    projectedGain: number;
}

export interface NeuralAcceleratorState {
    lastActivityLog: NACLogEntry[];
}

export interface ProtoSymbol {
    id: string;
    label: string;
    activation: number;
    description: string;
    constituentColumnIds: string[];
    mdnaVector: MDNAVector;
}

export interface NeuroCortexState {
    layers: { [key: string]: { name: string; description: string }};
    columns: CorticalColumn[];
    metrics: {
        hierarchicalCoherence: number;
        predictiveAccuracy: number;
        systemSynchronization: number;
        errorIntegrationStatus: 'idle' | 'integrating';
    };
    abstractConcepts: AbstractConcept[];
    resourceFocus: 'linguistic' | 'sensory' | 'abstract';
    simulationLog: NeuroSimulation[];
    globalErrorMap: GlobalErrorSignal[];
    protoSymbols: ProtoSymbol[];
    activationLog: { timestamp: number, activeColumnIds: string[] }[];
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: string[];
    genome: any;
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
    timestamp: number;
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

export interface GranularCortexState {
    lastPredictionError: {
        timestamp: number;
        magnitude: number;
        mismatchedPrimitives: { predicted: SensoryPrimitive | null; actual: SensoryPrimitive | null }[];
    } | null;
    lastActualEngram: SensoryEngram | null;
    lastPredictedEngram: SensoryEngram | null;
    log: { timestamp: number; message: string }[];
}

export interface SensoryEngram {
    modality: 'visual' | 'auditory' | 'textual';
    rawPrimitives: SensoryPrimitive[];
}

export interface SensoryPrimitive {
    type: string;
    value: string | number;
    confidence?: number;
}

export interface KoniocortexSentinelState {
    lastPercept: Percept | null;
    log: { timestamp: number, message: string }[];
}

export interface Percept {
    rawText: string;
    intent: string;
    entities: string[];
    sensoryEngram: SensoryEngram | null;
}

export interface CognitiveTriageState {
    log: TriageDecision[];
}

export interface TriageDecision {
    timestamp: number;
    percept: Percept;
    decision: 'fast' | 'slow';
    reasoning: string;
}

export interface PsycheState {
    version: number;
    primitiveRegistry: { [type: string]: CognitivePrimitiveDefinition };
}

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: object;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}

export interface MotorCortexState {
    status: 'idle' | 'executing' | 'completed' | 'failed';
    actionQueue: CognitivePrimitive[];
    executionIndex: number;
    lastError: string | null;
    log: MotorCortexLogEntry[];
}

export interface MotorCortexLogEntry {
    timestamp: number;
    action: CognitivePrimitive;
    status: 'success' | 'failure';
    error?: string;
}

export interface CognitivePrimitive {
    type: string;
    payload: any;
}


export interface PraxisResonatorState {
    activeSessions: { [planId: string]: PraxisSession };
}

export interface PraxisSession {
    planId: string;
    model: string; // Storing the model name instead of the live object
    createdAt: number;
}


export interface OntogeneticArchitectState {
    proposalQueue: UnifiedProposal[];
}

export interface EmbodiedCognitionState {
    virtualBodyState: {
        position: { x: number, y: number, z: number };
        orientation: { yaw: number, pitch: number, roll: number };
        balance: number;
    };
    simulationLog: EmbodimentSimulationLog[];
}

export interface EmbodimentSimulationLog {
    id: string;
    timestamp: number;
    scenario: string;
    action: string;
    outcome: 'success' | 'failure';
    reasoning: string;
}

export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete';
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
    optimizationTarget: 'latency' | 'accuracy' | 'cost';
    metrics: {
        totalOptimizations: number;
        avgLatencyReduction: number;
    };
    optimizationLog: HOVAEvolutionLogEntry[];
}

export interface HOVAEvolutionLogEntry {
    id: string;
    timestamp: number;
    target: string;
    metric: 'latency';
    status: 'success' | 'failed_slower' | 'failed_incorrect';
    performanceDelta: { before: number, after: number };
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
            content: string | null;
            isGenerating: boolean;
            diagram?: {
                description: string;
                isGenerating: boolean;
                imageUrl: string | null;
            };
        }[];
    } | null;
    error: string | null;
}

export interface WisdomIngestionState {
    status: 'idle' | 'reading' | 'analyzing' | 'complete' | 'error';
    currentBookContent: string | null;
    errorMessage: string | null;
    proposedAxioms: ProposedAxiom[];
}

export interface Persona {
    id: string;
    name: string;
    description: string;
    systemInstruction: string;
}

export interface PersonaState {
    registry: Persona[];
}

export interface BrainstormIdea {
    personaId: string;
    personaName: string;
    idea: string;
}

export interface BrainstormState {
    status: 'idle' | 'brainstorming' | 'evaluating' | 'proposing' | 'complete';
    topic: string | null;
    ideas: BrainstormIdea[];
    winningIdea: string | null;
    finalProposalId: string | null;
}


// Planning
export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    type: GoalType;
}

export interface GoalTree {
    [id: string]: Goal;
}

export interface DisciplineState {
    committedGoal: {
        id: string;
        type: string;
        description: string;
        commitmentStrength: number;
    } | null;
    adherenceScore: number;
    distractionResistance: number;
}

export interface PremotorPlannerState {
    planLog: TacticalPlan[];
    lastCompetingSet: TacticalPlan[];
}

export interface TacticalPlan {
    id: string;
    goal: string;
    timestamp: number;
    sequence: {
        commands: any[]; // Would be more specific, like POLCommand
    };
    type: 'proactive_cache' | 'deliberative';
    actionValue?: number;
    selectionReasoning?: string;
}


export interface BasalGangliaState {
    selectedPlanId: string | null;
    log: any[]; // More specific type later
}

export interface CerebellumState {
    isMonitoring: boolean;
    activePlanId: string | null;
    currentStepIndex: number;
    driftLog: CerebellumDriftLog[];
}

export interface CerebellumDriftLog {
    timestamp: number;
    planId: string;
    stepIndex: number;
    detectedDrift: boolean;
    correction: string;
}

// Engines
export interface ProactiveEngineState {
    generatedSuggestions: Suggestion[];
    cachedResponsePlan: {
        triggeringPrediction: string;
        response: string;
    } | null;
}

export interface Suggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface EthicalGovernorState {
    principles: string[];
    vetoLog: VetoLogEntry[];
}

export interface VetoLogEntry {
    id: string;
    timestamp: number;
    actionDescription: string;
    principleViolated: string;
    reason: string;
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
    reasoning: string;
    confidence: number;
    status: 'pending' | 'validated' | 'refuted';
    type: 'causal' | 'creative' | 'predictive';
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

// Logs
export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system' | 'tool';
    text: string;
    timestamp: number;
    skill?: string;
    logId?: string;
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    streaming?: boolean;
    internalStateSnapshot?: InternalState;
    fileName?: string;
    filePreview?: string;
    args?: any;
    sources?: { title: string; uri: string }[];
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    skill: string;
    input: string;
    output: string;
    duration: number;
    success: boolean;
    cognitiveGain: number;
    sentiment?: number;
    decisionContext?: {
        reasoning: string;
        workingMemorySnapshot: string[];
        internalStateSnapshot: InternalState;
        reasoningPlan?: { step: number; skill: string; reasoning: string, input: string }[];
    };
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
    metric: { name: string; value: number; };
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
    triggeringCommand: string;
    primingDirective: string;
    stateAdjustments: { [key: string]: StateAdjustment };
    outcomeLogId?: string; // ID of the PerformanceLogEntry to link the outcome
}

export interface StateAdjustment {
    from: number;
    to: number;
    reason: string;
}

export interface SubsumptionLogEntry {
    timestamp: number;
    layer: number;
    action: string;
    isSubsumed: boolean;
    subsumingLayer?: number;
}

export interface POLExecutionLogEntry {
    timestamp: number;
    commandName: string;
    replacedSequence: string[];
    result: 'success' | 'failure';
    error?: string;
}


// System
export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface MetacognitiveNexus {
    coreProcesses: any[]; // Define later
    diagnosticLog: DiagnosticFinding[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface SelfTuningDirective {
    id: string;
    targetSystem: string;
    parameter: string;
    adjustment: number;
    reason: string;
    status: 'pending' | 'applied' | 'failed';
}

export interface MetacognitiveCausalModel {
    [linkKey: string]: MetacognitiveLink;
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string; condition: 'high' | 'low' | 'increasing' | 'decreasing' };
    target: { key: string; metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export interface Plugin {
    id: string;
    name: string; // This will be a translation key
    description: string; // This will be a translation key
    type: 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR' | 'PERCEPTOR' | 'MODULATOR' | 'GOVERNOR' | 'SYNTHESIZER' | 'ORACLE';
    status: 'enabled' | 'disabled' | 'pending';
    defaultStatus?: 'enabled' | 'disabled';
    toolSchema?: any; // Gemini FunctionDeclaration
    knowledge?: Omit<KnowledgeFact, 'id' | 'source' | 'strength' | 'lastAccessed'>[];
}

export interface PluginState {
    registry: Plugin[];
}

export interface CognitiveTask {
    id: string;
    type: CognitiveTaskType;
    payload?: any;
}


export interface KernelState {
    tick: number;
    taskQueue: CognitiveTask[];
    runningTask: CognitiveTask | null;
    syscallLog: string[];
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

export interface SEDLDirective {
    id: string;
    type: 'user_prompt' | 'system_goal';
    content: string;
    timestamp: number;
    file: File | null;
}

export interface CGLPlan {
    id: string;
    sourceDirectiveId: string;
    goal: string;
    steps: CGLStep[];
}

export interface CGLStep {
    id: string;
    operation: 'GENERATE_RESPONSE' | 'EXECUTE_TOOL' | 'KNOWLEDGE_QUERY' | 'TEXT_SYNTHESIS' | 'SYSCALL';
    details: string;
    parameters: any;
}

export interface POLCommand {
    id: string;
    sourceStepId: string;
    type: 'CHAT_MESSAGE' | 'TOOL_EXECUTE' | 'SYSCALL' | 'NOOP';
    payload: any;
    status: 'pending' | 'executing' | 'complete' | 'failed';
}

// Autonomous Systems
export interface AutonomousReviewBoardState {
    isPaused: boolean;
    decisionLog: AGISDecision[];
    agisConfidenceThreshold: number;
    lastCalibrationReason: string;
    recentSuccesses: number;
    recentFailures: number;
    config: {
        confidenceThreshold: {
            low: number;
            medium: number;
            high: number;
        };
        telosAlignmentThreshold: number;
        passRateThreshold: number;
    };
}

export interface AGISDecision {
    id: string;
    timestamp: number;
    proposalId: string;
    proposalSummary: string;
    decision: 'auto-approved' | 'sent-to-user' | 'rejected' | 'qualia_veto';
    analysis: {
        safetyCompliance: boolean;
        telosAlignment: number;
        confidenceScore: number;
        blastRadius: 'low' | 'medium' | 'high';
        reasoning: string;
        wisdomChange?: number;
        happinessChange?: number;
        harmonyChange?: number;
    };
}


// --- Unified Proposal Types ---
export interface ArchitecturalChangeProposal {
    id: string;
    timestamp: number;
    proposalType: 'architecture';
    action: 'ADD_SKILL' | 'DEPRECATE_SKILL' | 'MODIFY_SKILL' | 'REFACTOR_MODULE' | 'RADICAL_REFACTOR';
    target: string | string[];
    newModule?: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
    arbiterReasoning?: string;
    confidence?: number;
}

export interface CodeEvolutionProposal {
    id: string;
    timestamp: number;
    proposalType: 'code';
    targetFile: string;
    codeSnippet: string;
    reasoning: string;
    status: 'proposed' | 'implemented' | 'rejected';
    priority?: number;
}

export interface GenialityImprovementProposal {
    id: string;
    timestamp: number;
    proposalType: 'geniality';
    title: string;
    reasoning: string;
    action: {
        type: 'ADJUST_BIAS' | 'SPAWN_DIALECTIC';
        payload: any;
    };
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export interface ArchitecturalImprovementProposal {
    id: string;
    timestamp: number;
    proposalType: 'crucible';
    title: string;
    reasoning: string;
    action: {
        type: 'ADJUST_COMPONENT_SCORE' | 'TRIGGER_REFACTOR_ANALYSIS';
        payload: any;
    };
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}


export interface CausalInferenceProposal {
    id: string;
    timestamp: number;
    proposalType: 'causal_inference';
    reasoning: string;
    linkUpdate: {
        sourceNode: string;
        targetNode: string;
        causality: number;
        confidence: number;
    };
    status: 'proposed' | 'implemented' | 'rejected';
    priority?: number;
}

export type ProposalStatus = 'proposed' | 'simulating' | 'evaluated' | 'simulation_failed' | 'rejected' | 'implemented' | 'pending_user_approval';

export interface CreateFileCandidate {
    id: string;
    type: 'CREATE';
    proposalType: 'self_programming_create';
    newFile: { path: string; content: string };
    integrations: { filePath: string; newContent: string }[];
    reasoning: string;
    source: 'autonomous' | 'user_assisted' | 'persona';
    status: ProposalStatus;
    evaluationScore?: number;
    failureReason?: string;
    linkedVectorId?: string;
    priority?: number;
    agisReport?: any;
}

export interface ModifyFileCandidate {
    id: string;
    type: 'MODIFY';
    proposalType: 'self_programming_modify';
    targetFile: string;
    codeSnippet: string; // The full new content of the file
    reasoning: string;
    source: 'autonomous' | 'user_assisted' | 'persona';
    status: ProposalStatus;
    evaluationScore?: number;
    failureReason?: string;
    linkedVectorId?: string;
    priority?: number;
    agisReport?: any;
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface PsycheProposal {
    id: string;
    timestamp: number;
    proposalType: 'psyche';
    proposedConceptName: string;
    sourceConcepts: { id: string, description: string }[];
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export interface SkillSynthesisProposal {
    id: string;
    timestamp: number;
    proposalType: 'skill_synthesis';
    skillName: string;
    reasoning: string;
    generatedCode: string;
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export interface POLCommandSynthesisProposal {
    id: string;
    proposalType: 'pol_command_synthesis';
    replacesSequence: string[];
    newCommandName: string;
    reasoning: string;
    status: 'proposed' | 'implementing' | 'implemented' | 'rejected' | 'failed';
    priority?: number;
}

export interface KnowledgeAcquisitionProposal {
    id: string;
    timestamp: number;
    proposalType: 'knowledge_acquisition';
    topic: string;
    reasoning: string;
    facts: Omit<KnowledgeFact, 'id' | 'source' | 'strength' | 'lastAccessed'>[];
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export interface AbstractConceptProposal {
    id: string;
    timestamp: number;
    proposalType: 'abstract_concept';
    newConceptName: string;
    sourceColumnIds: string[];
    reasoning: string;
    status: ProposalStatus;
    priority?: number;
}


export type UnifiedProposal = 
    | ArchitecturalChangeProposal 
    | CodeEvolutionProposal 
    | GenialityImprovementProposal
    | ArchitecturalImprovementProposal
    | CausalInferenceProposal
    | SelfProgrammingCandidate
    | PsycheProposal
    | SkillSynthesisProposal
    | POLCommandSynthesisProposal
    | KnowledgeAcquisitionProposal
    | AbstractConceptProposal;

// FIX: Added missing type definitions for ToastMessage, ToastType, ProposedAxiom, and AtmanProjector.
// --- UI & System Types ---

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface ProposedAxiom {
  id: string;
  axiom: string;
  source: string;
  status: 'proposed' | 'accepted' | 'rejected';
}

export interface AtmanProjector {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

export type SyscallCall = 
    | 'SET_THEME' | 'SET_LANGUAGE' | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE' | 'ADD_INTERNAL_STATE_HISTORY' | 'UPDATE_USER_MODEL'
    | 'QUEUE_EMPATHY_AFFIRMATION' | 'UPDATE_RIE_STATE' | 'ADD_RIE_INSIGHT' | 'ADD_LIMITATION' | 'ADD_CAUSAL_LINK' | 'ADD_KNOWN_UNKNOWN'
    | 'UPDATE_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWNS_BATCH' | 'UPDATE_NARRATIVE_SUMMARY' | 'SET_TELOS' | 'TELOS/DECOMPOSE_AND_SET_TREE' | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL' | 'UPDATE_NOETIC_ENGRAM_STATE' | 'SET_PSYCHEDELIC_STATE' | 'INDUCE_PSIONIC_STATE' | 'SET_SATORI_STATE'
    | 'AFFECTIVE/SET_BIAS' | 'INCREMENT_MANTRA_REPETITION' | 'ADD_WORKFLOW_PROPOSAL' | 'UPDATE_PERSONALITY_STATE' | 'CURIOSITY/SET_DRIVE' | 'CURIOSITY/SET_ACTIVE_GOAL'
    | 'INCREMENT_AUTONOMOUS_EVOLUTIONS' | 'TELOS/ADD_CANDIDATE' | 'TELOS/REMOVE_CANDIDATE' | 'TELOS/ADOPT_CANDIDATE'
    | 'UPDATE_PERSONALITY_PORTRAIT' | 'DIALECTIC/ADD_AUTONOMOUS_DIALECTIC'
    | 'ADD_FACT' | 'ADD_FACTS_BATCH' | 'DELETE_FACT' | 'ADD_TO_WORKING_MEMORY' | 'REMOVE_FROM_WORKING_MEMORY' | 'CLEAR_WORKING_MEMORY' | 'ADD_EPISODE'
    | 'MEMORY/STRENGTHEN_HYPHA_CONNECTION' | 'MEMORY/ADD_CRYSTALLIZED_FACT' | 'MEMORY/INITIALIZE_MDNA_SPACE' | 'MEMORY/HEBBIAN_LEARN' | 'MEMORY/ADD_CONCEPT_VECTOR'
    | 'MEMORY/REINFORCE' | 'MEMORY/DECAY' | 'CHRONICLE/UPDATE'
    | 'HEURISTICS_FORGE/ADD_AXIOM' | 'COGNITIVE_ARCHITECT/FORM_CLUSTER' | 'COGNITIVE_ARCHITECT/SKIP_CLUSTER' | 'HEURISTICS_FORGE/ADD_HEURISTIC' | 'LOG_COGNITIVE_TRIAGE_DECISION'
    | 'OA/ADD_PROPOSAL' | 'OA/UPDATE_PROPOSAL' | 'OA/REMOVE_PROPOSAL' | 'APPLY_ARCH_PROPOSAL' | 'ADD_SYSTEM_SNAPSHOT' | 'TOGGLE_COGNITIVE_FORGE_PAUSE'
    | 'ADD_SYNTHESIZED_SKILL' | 'UPDATE_SYNTHESIZED_SKILL' | 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE' | 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL' | 'UPDATE_CRUCIBLE_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_SYNAPTIC_MATRIX' | 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED' | 'SYNAPTIC_MATRIX/REINFORCE_LINK' | 'PRUNE_SYNAPTIC_MATRIX' | 'REJECT_SELF_PROGRAMMING_CANDIDATE'
    | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE' | 'IMPLEMENT_SKILL_SYNTHESIS_PROPOSAL' | 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL' | 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL' | 'IMPLEMENT_PSYCHE_PROPOSAL' | 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS' | 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL' | 'INGEST_CODE_CHANGE' | 'SET_COPROCESSOR_ARCHITECTURE'
    | 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON' | 'SET_COPROCESSOR_ARCHITECTURE_MODE' | 'UPDATE_COPROCESSOR_METRICS' | 'UPDATE_NEURAL_ACCELERATOR_STATE' | 'EMBODIMENT/UPDATE_BODY_STATE'
    | 'EMBODIMENT/LOG_SIMULATION' | 'APPLY_REINFORCEMENT_LEARNING' | 'CREATE_CORTICAL_COLUMN' | 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL' | 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL' | 'PLUGIN/ADD_PLUGIN' | 'ROLLBACK_SNAPSHOT'
    | 'COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS' | 'VFS/APPLY_PATCH' | 'VFS/REVERT_PATCH'
    | 'BUILD_GOAL_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_OUTCOME'
    | 'UPDATE_SUGGESTION_STATUS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE' | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE' | 'ETHICAL_GOVERNOR/ADD_VETO_LOG'
    | 'ADD_HISTORY_ENTRY' | 'UPDATE_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY' | 'ADD_PERFORMANCE_LOG' | 'ADD_COMMAND_LOG' | 'UPDATE_HISTORY_FEEDBACK'
    | 'LOG_COGNITIVE_REGULATION' | 'UPDATE_REGULATION_LOG_OUTCOME' | 'ADD_SIMULATION_LOG' | 'LOG_QUALIA' | 'MARK_LOG_CAUSAL_ANALYSIS' | 'ADD_EVENT_BUS_MESSAGE' | 'LOG/ADD_POL_EXECUTION'
    | 'LOG_SUBSUMPTION_EVENT' | 'LOG/MARK_METAPHOR_PROCESSED' | 'LOG/MARK_REINFORCEMENT_PROCESSED' | 'LOG/MARK_BRIDGE_PROCESSED'
    | 'METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING' | 'METACGNITIVE_NEXUS/UPDATE_DIAGNOSTIC_FINDING' | 'METACGNITIVE_NEXUS/ADD_META_LINK' | 'UPDATE_RESOURCE_MONITOR' | 'ADD_SELF_TUNING_DIRECTIVE' | 'UPDATE_SELF_TUNING_DIRECTIVE'
    | 'SITUATIONAL_AWARENESS/LOG_DOM_CHANGE'
    | 'KERNEL/TICK' | 'KERNEL/ADD_TASK' | 'KERNEL/SET_TASK_QUEUE' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL'
    | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ'
    | 'AGIS/TOGGLE_PAUSE' | 'AGIS/ADD_DECISION_LOG' | 'AGIS/CALIBRATE_CONFIDENCE'
    | 'UPDATE_NEURO_CORTEX_STATE' | 'SET_COLUMN_ACTIVATION' | 'SYNTHESIZE_ABSTRACT_CONCEPT' | 'NEURO_CORTEX/LOG_ACTIVATION' | 'NEURO_CORTEX/ADD_PROTO_SYMBOL'
    | 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL'
    | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT'
    | 'PROCESS_USER_INPUT_INTO_PERCEPT'
    | 'ADD_TACTICAL_PLAN' | 'SET_COMPETING_PLANS' | 'CLEAR_PLANNING_STATE'
    | 'SELECT_ACTION_PLAN'
    | 'START_CEREBELLUM_MONITORING' | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    | 'PSYCHE/REGISTER_PRIMITIVES'
    | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED' | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE'
    | 'PRAXIS/CREATE_SESSION' | 'PRAXIS/DELETE_SESSION'
    | 'COGNITIVE_FORGE/PROPOSE_SYNTHESIS'
    | 'PLUGIN/SET_STATUS' | 'PLUGIN/RESTORE_DEFAULTS'
    | 'SOCIAL/ADD_NODE' | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL'
    | 'SANDBOX/START_SPRINT' | 'SANDBOX/LOG_STEP' | 'SANDBOX/COMPLETE_SPRINT' | 'SANDBOX/RESET'
    | 'DOXASTIC/START_SIMULATION' | 'DOXASTIC/LOG_SIMULATION_STEP' | 'DOXASTIC/COMPLETE_SIMULATION' | 'DOXASTIC/FAIL_SIMULATION' | 'DOXASTIC/ADD_HYPOTHESIS' | 'TEST_CAUSAL_HYPOTHESIS'
    | 'METAPHOR/ADD' | 'METAPHOR/UPDATE'
    | 'HOVA/SET_TARGET' | 'HOVA/START_CYCLE' | 'HOVA/LOG_EVOLUTION'
    | 'DOCUMENT_FORGE/START_PROJECT' | 'DOCUMENT_FORGE/SET_STATUS' | 'DOCUMENT_FORGE/SET_OUTLINE' | 'DOCUMENT_FORGE/UPDATE_CHAPTER' | 'DOCUMENT_FORGE/UPDATE_DIAGRAM' | 'DOCUMENT_FORGE/FINALIZE_PROJECT' | 'DOCUMENT_FORGE/RESET'
    | 'SCIENTIST/UPDATE_STATE' | 'SANDBOX/TEST_PROPOSAL' | 'SANDBOX/REPORT_RESULTS'
    | 'WISDOM/START_INGESTION' | 'WISDOM/SET_PROPOSED_AXIOMS' | 'WISDOM/PROCESS_AXIOM' | 'WISDOM/SET_ERROR' | 'WISDOM/RESET'
    | 'SPANDA/UPDATE_MANIFOLD_POSITION'
    | 'TEMPORAL_ENGINE/BEGIN_PROCESSING' | 'TEMPORAL_ENGINE/UPDATE_CHRONICLER' | 'TEMPORAL_ENGINE/UPDATE_ORACLE' | 'TEMPORAL_ENGINE/UPDATE_REACTOR' | 'TEMPORAL_ENGINE/ADD_INTER_CLUSTER_LOG' | 'TEMPORAL_ENGINE/PROCESSING_COMPLETE' | 'TEMPORAL_ENGINE/RESET'
    | 'CRUCIBLE/START_CYCLE' | 'CRUCIBLE/ADD_LOG' | 'CRUCIBLE/PROPOSE_AXIOM' | 'CRUCIBLE/CYCLE_COMPLETE'
    | 'LIVE/CONNECT' | 'LIVE/DISCONNECT' | 'LIVE/SET_STATUS' | 'LIVE/UPDATE_INPUT_TRANSCRIPT' | 'LIVE/UPDATE_OUTPUT_TRANSCRIPT' | 'LIVE/TURN_COMPLETE'
    | 'BRAINSTORM/START' | 'BRAINSTORM/SET_STATUS' | 'BRAINSTORM/ADD_IDEA' | 'BRAINSTORM/SET_WINNER' | 'BRAINSTORM/FINALIZE';

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
}

export type Action = 
    | { type: 'SYSCALL', payload: SyscallPayload }
    | { type: 'RESET_STATE' }
    | { type: 'IMPORT_STATE', payload: AuraState }
    | { type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: AuraState };

// FIX: Added missing state slice interfaces.
export interface SpandaState {
    point: { x: number, y: number };
    trajectory: { x: number, y: number }[];
    currentRegion: string;
}

export interface TemporalEngineState {
    status: 'idle' | 'active' | 'complete';
    directive: SEDLDirective | null;
    chronicler: { status: 'idle' | 'pending' | 'analyzing' | 'complete', findings: string[] };
    reactor: { status: 'idle' | 'pending' | 'executing' | 'complete', finalPlan: string | null, executionLog: { success: boolean, message: string }[] };
    oracle: { status: 'idle' | 'pending' | 'simulating' | 'complete', simulations: string[] };
    interClusterLog: { timestamp: number, from: string, to: string, message: string }[];
}

export interface CandidateAxiom {
    id: string;
    axiomText: string;
    evidenceFromSimulation: string;
    eleganceScore: number;
    status: 'unvalidated' | 'validated' | 'refuted';
}

export interface AxiomaticCrucibleState {
    status: 'idle' | 'running';
    log: string[];
    candidateAxioms: CandidateAxiom[];
}
    
export interface AuraState {
    version: number;
    theme: string;
    language: string;

    // Core State
    internalState: InternalState;
    internalStateHistory: InternalState[];
    rieState: ReflectiveInsightEngineState;
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    atmanProjector: AtmanProjector;
    worldModelState: WorldModelState;
    curiosityState: CuriosityState;
    knownUnknowns: KnownUnknown[];
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
    liveSessionState: LiveSessionState;
    sensoryIntegration: SensoryIntegration;
    narrativeSummary: string;
    socialCognitionState: SocialCognitionState;
    metaphoricalMapState: MetaphoricalMapState;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    spandaState: SpandaState;
    personaState: PersonaState;
    brainstormState: BrainstormState;

    // Memory
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    chronicleState: ChronicleState;
    mdnaSpace: MDNASpace;
    conceptConnections: ConceptConnections;
    
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
    subsumptionLog: SubsumptionLogEntry[];
    polExecutionLog: POLExecutionLogEntry[];

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
    brainstorm: {};
    imageGeneration: { initialPrompt?: string };
    imageEditing: { initialImage?: string };
    videoGeneration: {};
    advancedControls: {};
    musicGeneration: {};
    coCreatedWorkflow: {};
    skillGenesis: {};
    abstractConcept: {};
    telos: {};
    psychePrimitives: {};
    pluginManager: {};
    poseQuestion: {};
    documentForge: {};
}