// types.ts

// A special type to stop TypeScript from complaining about the Gemini API types.
// This is a workaround for the build environment not having the dependency installed.
declare global {
    namespace google {
        namespace generativeai {
            class GoogleGenerativeAI {
                constructor(apiKey: string);
            }
        }
    }
}

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
    source: 'rie' | 'hcl' | 'llm'; // ReflectiveInsightEngine, HeuristicCausalLinker, LLM
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

export interface TelosEngine {
    telos: string;
    evolutionaryVectors: EvolutionaryVector[];
    lastDecomposition: number;
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
    personas: { [key: string]: Persona };
    dominantPersona: string;
    personaCoherence: number;
    lastUpdateReason: string;
}

export interface Persona {
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
    stage: 'grounding' | 'breakthrough' | 'integration' | 'none';
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
    name: string;
    type: 'user' | 'group' | 'concept';
    summary: string;
    relationships: SocialRelationship[];
}

export interface SocialRelationship {
    targetId: string;
    type: 'friend' | 'colleague' | 'antagonist' | 'topic_of_interest';
    strength: number;
}

export interface MetaphoricalMapState {
    metaphors: Metaphor[];
}

export interface Metaphor {
    id: string;
    description: string;
    sourceDomain: string;
    targetDomain: string;
    fitnessScore: number;
    observationCount: number;
}

export interface AtmanProjector {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

// --- Memory Interfaces ---

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
}

export interface MemoryNexus {
    hyphaeConnections: HyphaConnection[];
}

export interface HyphaConnection {
    id: string;
    source: string;
    target: string;
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
    keyTakeaway: string;
    salience: number;
    valence: 'positive' | 'negative' | 'neutral';
}

export interface MemoryConsolidationState {
    lastConsolidation: number;
    status: 'idle' | 'consolidating';
}

// --- Architecture Interfaces ---

export interface CognitiveArchitecture {
    modelComplexityScore: number;
    components: { [key: string]: CognitiveModule };
    coprocessors: { [key: string]: Coprocessor };
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    lastAutoSwitchReason?: string;
    synthesizedPOLCommands: { [key: string]: { sequence: POLCommand[] } };
}

export interface CognitiveModule {
    version: string;
    status: 'active' | 'inactive' | 'deprecated';
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
    gainType: 'OPTIMIZATION' | 'INNOVATION' | 'CORRECTION';
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
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
    result: {
        success: boolean;
        output: string;
    };
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
    axioms: any[];
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
    outcome: 'success' | 'failure';
    reasoning: string;
    somaticTrajectory: InternalState[];
}

export interface EidolonEngine {
    eidolon: {
        architectureVersion: string;
        position: { x: number; y: number; z: number; };
        lastAction: string;
        sensoryInput: any;
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
    nodes: { [id: string]: SynapticNode };
    links: { [key: string]: SynapticLink };
    synapseCount: number;
    plasticity: number;
    efficiency: number;
    avgConfidence: number;
    avgCausality: number;
    lastPruningEvent: number;
    isAdapting: boolean;
    intuitiveAlerts: IntuitiveAlert[];
}

export interface SynapticNode {
    id: string;
    type: 'skill' | 'event' | 'state' | 'concept';
    activation: number;
}

export interface SynapticLink {
    weight: number;
    causality: number; // -1 (inhibitory) to 1 (excitatory)
    confidence: number;
    observations: number;
    crystallized?: boolean;
}

export interface IntuitiveAlert {
    id: string;
    message: string;
    timestamp: number;
}

export interface RicciFlowManifoldState {
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: RicciFlowSurgeryLog[];
}

export interface RicciFlowSurgeryLog {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}

export interface SelfProgrammingState {
    virtualFileSystem: { [filePath: string]: string };
}

export interface NeuralAcceleratorState {
    lastActivityLog: NeuralAcceleratorLogEntry[];
}

export interface NeuralAcceleratorLogEntry {
    id: string;
    timestamp: number;
    type: 'pruning' | 'reinforcement';
    description: string;
    projectedGain: number;
}

export interface NeuroCortexState {
    layers: { [key: string]: { name: string, description: string } };
    columns: CorticalColumn[];
    metrics: {
        hierarchicalCoherence: number;
        predictiveAccuracy: number;
        systemSynchronization: number;
        errorIntegrationStatus: 'idle' | 'integrating' | 'stalled';
    };
    abstractConcepts: AbstractConcept[];
    resourceFocus: 'linguistic' | 'sensory' | 'abstract';
    simulationLog: NeuroSimulation[];
    globalErrorMap: GlobalErrorSignal[];
    protoSymbols: ProtoSymbol[];
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: string[];
    genome: {
        domain: 'linguistic' | 'sensory' | 'abstract' | 'motor';
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

export interface ProtoSymbol {
    id: string;
    label: string;
    description: string;

    activation: number;
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

export interface SensoryEngram {
    modality: 'visual' | 'auditory' | 'linguistic';
    rawPrimitives: SensoryPrimitive[];
}

export interface SensoryPrimitive {
    type: string;
    value: number | string;
    confidence?: number;
}

export interface KoniocortexSentinelState {
    lastPercept: Percept | null;
    log: { timestamp: number; message: string; }[];
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

export interface Percept {
    id: string;
    timestamp: number;
    rawText: string;
    intent: string;
    entities: string[];
    sensoryEngram: SensoryEngram | null;
}

export interface PsycheState {
    version: number;
    primitiveRegistry: { [key: string]: CognitivePrimitiveDefinition };
}

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: object;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}

export interface CognitivePrimitive {
    type: string;
    payload: any;
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

export interface PraxisResonatorState {
    activeSessions: { [planId: string]: PraxisSession };
}

export interface PraxisSession {
    planId: string;
    createdAt: number;
    chat: any; // Simplified Chat object
}

export interface OntogeneticArchitectState {
    proposalQueue: UnifiedProposal[];
}

export interface EmbodiedCognitionState {
    virtualBodyState: {
        position: { x: number; y: number; z: number; };
        orientation: { yaw: number; pitch: number; roll: number; };
        balance: number;
    };
    simulationLog: EmbodimentSimulationLog[];
}

export interface EmbodimentSimulationLog {
    id: string;
    timestamp: number;
    scenario: string;
    outcome: 'success' | 'failure';
    reasoning: string;
}

export interface EvolutionarySandboxState {
    status: 'idle' | 'running' | 'complete';
    sprintGoal: string | null;
    log: { timestamp: number, message: string }[];
    startTime: number | null;
    result: {
        originalGoal: string;
        performanceGains: { metric: string, change: string }[];
        diff: {
            filePath: string;
            before: string;
            after: string;
        };
    } | null;
}

export interface HovaState {
    optimizationTarget: 'latency' | 'accuracy' | 'token_usage';
    metrics: {
        totalOptimizations: number;
        avgLatencyReduction: number;
    };
    optimizationLog: HOVAEvolutionLogEntry[];
}

export interface HOVAEvolutionLogEntry {
    id: string;
    timestamp: number;
    target: string; // e.g., a function name
    metric: 'latency';
    status: 'success' | 'failed_slower' | 'failed_incorrect';
    performanceDelta: {
        before: number;
        after: number;
    };
}

export interface DocumentForgeState {
    isActive: boolean;
    goal: string;
    status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error';
    statusMessage: string;
    document: ForgedDocument | null;
    error: string | null;
}

export interface ForgedDocument {
    title: string;
    chapters: ForgedChapter[];
}

export interface ForgedChapter {
    id: string;
    title: string;
    content: string | null;
    isGenerating: boolean;
    diagram: ForgedDiagram | null;
}

export interface ForgedDiagram {
    description: string;
    imageUrl: string | null;
    isGenerating: boolean;
}

// --- Planning Interfaces ---

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
        type: GoalType;
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
    timestamp: number;
    goal: string;
    type: 'proactive' | 'reactive' | 'goal_driven';
    selectionReasoning?: string;
    actionValue?: number;
    sequence: {
        commands: any[];
    };
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
    driftLog: CerebellumDriftLogEntry[];
}

export interface CerebellumDriftLogEntry {
    timestamp: number;
    planId: string;
    stepIndex: number;
    detectedDrift: boolean;
    correction: string;
}


// --- Engine Interfaces ---

export interface ProactiveEngineState {
    generatedSuggestions: Suggestion[];
    cachedResponsePlan: CachedPlan | null;
}

export interface Suggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface CachedPlan {
    triggeringPrediction: string;
    plan: any; // Simplified
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
    hypothesis: string;
    confidence: number;
    status: 'unverified' | 'validated' | 'refuted';
    type: 'causal' | 'associative' | 'predictive';
    reasoning: string;
}

export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: SelfSolution[];
}

export interface SelfSolution {
    description: string;
    noveltyScore: number;
}

// --- Logs & System Interfaces ---

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system';
    text: string;
    timestamp: number;
    skill?: string;
    logId?: string;
    feedback?: 'positive' | 'negative';
    streaming?: boolean;
    internalStateSnapshot?: InternalState;
    fileName?: string;
    filePreview?: string;
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
    decisionContext: {
        reasoning: string;
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoningPlan?: { step: number; skill: string; reasoning: string; input: string; }[];
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

    previousMetrics: { [key: string]: number };
    currentMetrics: { [key: string]: number };
    gainScores: { [key: string]: number };
    compositeGain: number;
}

export interface StateAdjustment {
    from: number;
    to: number;
}

export interface CognitiveRegulationLogEntry {
    id: string;
    timestamp: number;
    triggeringCommand: string;
    primingDirective: string;
    stateAdjustments: { [key: string]: StateAdjustment };
    outcomeLogId: string | null;
}

export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface MetacognitiveNexus {
    coreProcesses: MetacognitiveProcess[];
    diagnosticLog: DiagnosticFinding[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface MetacognitiveProcess {
    id: string;
    name: string;
    activation: number;
}

export interface DiagnosticFinding {
    id: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
    finding: string;
    status: 'unprocessed' | 'investigating' | 'processed';
}

export interface SelfTuningDirective {
    id: string;
    type: 'PARAMETER_ADJUSTMENT' | 'SKILL_REFINEMENT' | 'HEURISTIC_MODIFICATION';
    targetSkill: string;
    reasoning: string;
    status: 'proposed' | 'simulating' | 'plan_generated' | 'rejected' | 'completed' | 'failed';
}

export interface MetacognitiveCausalModel {
    [key: string]: MetacognitiveLink;
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string, condition: string };
    target: { key: string, metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export interface PluginState {
    registry: Plugin[];
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: 'TOOL' | 'COPROCESSOR' | 'KNOWLEDGE' | 'PERCEPTOR' | 'MODULATOR' | 'GOVERNOR' | 'SYNTHESIZER' | 'ORACLE';
    status: 'enabled' | 'disabled';
    toolSchema?: any; // Simplified FunctionDeclaration
    knowledge?: Omit<KnowledgeFact, 'id' | 'source'>[];
    defaultStatus?: 'enabled' | 'disabled';
}

export interface KernelState {
    tick: number;
    taskQueue: any[];
    runningTask: any | null;
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
    qualiaVector?: QualiaVector;
}

export interface QualiaVector {
    gunaState: GunaState;
    wisdom: number;
    happiness: number;
    love: number;
}

export interface CognitiveOSState {
    status: 'idle' | 'directive_received' | 'cluster_analysis' | 'translating_cgl' | 'ready_to_execute' | 'executing_pol' | 'complete' | 'execution_failed';
    activeDirective: SEDLDirective | null;
    activePlan: CGLPlan | null;
    commandQueue: POLCommand[][];
    currentStageIndex: number;
    currentStageCommands: POLCommand[] | null;
    completedCommands: any[];
    lastError: string | null;
    isDynamicClusterActive: boolean;
}

export interface SEDLDirective {
    id: string;
    type: 'user_prompt' | 'system_task';
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
    operation: string;
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

export interface InternalScientistState {
    status: 'idle' | 'observing' | 'hypothesizing' | 'designing_experiment' | 'running_experiment' | 'analyzing' | 'inferring';
    log: { timestamp: number, event: string }[];
    currentFinding: DiagnosticFinding | null;
    currentHypothesis: InternalScientistHypothesis | null;
    currentExperiment: InternalScientistExperiment | null;
    causalInference: { link: CausalLink, confidence: number } | null;
}

export interface InternalScientistHypothesis {
    id: string;
    text: string;
    linkedFindingId: string;
}

export interface InternalScientistExperiment {
    id: string;
    hypothesisId: string;
    design: {
        reasoning: string;
        targetFile: string;
        codeSnippet: string;
    };
}

export interface MetisSandboxState {
    status: 'idle' | 'running' | 'complete' | 'error';
    currentExperimentId: string | null;
    testResults: any | null;
    errorMessage: string | null;
}


// --- Full Aura State ---
export interface AuraState {
    version: number;
    // Core
    internalState: InternalState;
    internalStateHistory: InternalState[];
    rieState: ReflectiveInsightEngineState;
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    selfAwarenessState: SelfAwarenessState;
    worldModelState: WorldModelState;
    curiosityState: CuriosityState;
    knownUnknowns: KnownUnknown[];
    theme: string;
    language: string;
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
    socialCognitionState: SocialCognitionState;
    metaphoricalMapState: MetaphoricalMapState;
    atmanProjector: AtmanProjector;
    narrativeSummary: string;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    // Memory
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
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
    subsumptionLog: any[]; // Placeholder
    polExecutionLog: any[]; // Placeholder
    // System
    resourceMonitor: ResourceMonitor;
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: MetacognitiveCausalModel;
    pluginState: PluginState;
    kernelState: KernelState;
    ipcState: IpcState;
    eventBus: EventBusMessage[];
    cognitiveOSState: CognitiveOSState;
}

// --- UI & Actions ---

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export type SyscallCall =
    // Core
    | 'SET_THEME' | 'SET_LANGUAGE' | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE' | 'ADD_INTERNAL_STATE_HISTORY'
    | 'UPDATE_USER_MODEL' | 'QUEUE_EMPATHY_AFFIRMATION' | 'UPDATE_RIE_STATE' | 'ADD_RIE_INSIGHT' | 'ADD_LIMITATION'
    | 'ADD_CAUSAL_LINK' | 'ADD_KNOWN_UNKNOWN' | 'UPDATE_KNOWN_UNKNOWN' | 'UPDATE_NARRATIVE_SUMMARY'
    | 'SET_TELOS' | 'TELOS/DECOMPOSE_AND_SET_TREE' | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL' | 'UPDATE_NOETIC_ENGRAM_STATE' | 'SET_PSYCHEDELIC_STATE'
    | 'INDUCE_PSIONIC_STATE' | 'SET_SATORI_STATE' | 'AFFECTIVE/SET_BIAS' | 'INCREMENT_MANTRA_REPETITION'
    | 'ADD_WORKFLOW_PROPOSAL' | 'INGEST_CODE_CHANGE' | 'UPDATE_PERSONALITY_STATE' | 'SOCIAL/ADD_NODE'
    | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL' | 'CURIOSITY/SET_DRIVE' | 'CURIOSITY/SET_ACTIVE_GOAL'
    // Memory
    | 'ADD_FACT' | 'ADD_FACTS_BATCH' | 'DELETE_FACT' | 'ADD_TO_WORKING_MEMORY' | 'REMOVE_FROM_WORKING_MEMORY'
    | 'CLEAR_WORKING_MEMORY' | 'ADD_EPISODE' | 'MEMORY/STRENGTHEN_HYPHA_CONNECTION' | 'MEMORY/ADD_CRYSTALLIZED_FACT'
    // Architecture
    | 'HEURISTICS_FORGE/ADD_AXIOM' | 'COGNITIVE_ARCHITECT/FORM_CLUSTER' | 'COGNITIVE_ARCHITECT/SKIP_CLUSTER'
    | 'HEURISTICS_FORGE/ADD_HEURISTIC' | 'LOG_COGNITIVE_TRIAGE_DECISION' | 'OA/ADD_PROPOSAL' | 'OA/UPDATE_PROPOSAL'
    | 'OA/REMOVE_PROPOSAL' | 'APPLY_ARCH_PROPOSAL' | 'ADD_SYSTEM_SNAPSHOT' | 'TOGGLE_COGNITIVE_FORGE_PAUSE'
    | 'ADD_SYNTHESIZED_SKILL' | 'UPDATE_SYNTHESIZED_SKILL' | 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE'
    | 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL' | 'UPDATE_CRUCIBLE_IMPROVEMENT_PROPOSAL' | 'UPDATE_SYNAPTIC_MATRIX'
    | 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED' | 'SYNAPTIC_MATRIX/REINFORCE_LINK' | 'PRUNE_SYNAPTIC_MATRIX'
    | 'REJECT_SELF_PROGRAMMING_CANDIDATE' | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE' | 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS'
    | 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL' | 'SET_COPROCESSOR_ARCHITECTURE' | 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON'
    | 'SET_COPROCESSOR_ARCHITECTURE_MODE' | 'UPDATE_COPROCESSOR_METRICS' | 'UPDATE_NEURAL_ACCELERATOR_STATE'
    | 'EMBODIMENT/UPDATE_BODY_STATE' | 'EMBODIMENT/LOG_SIMULATION' | 'APPLY_REINFORCEMENT_LEARNING'
    | 'CREATE_CORTICAL_COLUMN' | 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL' | 'COGNITIVE_FORGE/PROPOSE_SYNTHESIS'
    | 'COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS'
    // Neuro-Cortex specific
    | 'UPDATE_NEURO_CORTEX_STATE' | 'SET_COLUMN_ACTIVATION' | 'SYNTHESIZE_ABSTRACT_CONCEPT'
    // Granular Cortex
    | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT'
    // Koniocortex
    | 'PROCESS_USER_INPUT_INTO_PERCEPT'
    // Psyche
    | 'PSYCHE/REGISTER_PRIMITIVES'
    // Motor Cortex
    | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED' | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE'
    // Praxis Resonator
    | 'PRAXIS/CREATE_SESSION' | 'PRAXIS/DELETE_SESSION'
    // Sandbox
    | 'SANDBOX/START_SPRINT' | 'SANDBOX/LOG_STEP' | 'SANDBOX/COMPLETE_SPRINT' | 'SANDBOX/RESET'
    // Document Forge
    | 'DOCUMENT_FORGE/START_PROJECT' | 'DOCUMENT_FORGE/SET_STATUS' | 'DOCUMENT_FORGE/SET_OUTLINE' | 'DOCUMENT_FORGE/UPDATE_CHAPTER'
    | 'DOCUMENT_FORGE/UPDATE_DIAGRAM' | 'DOCUMENT_FORGE/FINALIZE_PROJECT' | 'DOCUMENT_FORGE/RESET'
    // Planning
    | 'BUILD_GOAL_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_OUTCOME' | 'ADD_TACTICAL_PLAN'
    | 'SET_COMPETING_PLANS' | 'CLEAR_PLANNING_STATE' | 'SELECT_ACTION_PLAN'
    | 'START_CEREBELLUM_MONITORING' | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    // Engines
    | 'UPDATE_SUGGESTION_STATUS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE' | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE'
    | 'ETHICAL_GOVERNOR/ADD_VETO_LOG'
    // Logs
    | 'ADD_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY' | 'ADD_PERFORMANCE_LOG'
    | 'ADD_COMMAND_LOG' | 'UPDATE_HISTORY_FEEDBACK' | 'LOG_COGNITIVE_REGULATION' | 'UPDATE_REGULATION_LOG_OUTCOME'
    | 'ADD_SIMULATION_LOG' | 'LOG_QUALIA' | 'MARK_LOG_CAUSAL_ANALYSIS' | 'ADD_EVENT_BUS_MESSAGE'
    | 'LOG_SUBSUMPTION_EVENT' | 'LOG/MARK_METAPHOR_PROCESSED' | 'LOG/MARK_REINFORCEMENT_PROCESSED' | 'LOG/MARK_BRIDGE_PROCESSED'
    | 'LOG/ADD_POL_EXECUTION'
    // System
    | 'METACGNITIVE_NEXUS/ADD_DIAGNOSTIC_FINDING' | 'METACGNITIVE_NEXUS/UPDATE_DIAGNOSTIC_FINDING'
    | 'UPDATE_RESOURCE_MONITOR' | 'ADD_SELF_TUNING_DIRECTIVE' | 'UPDATE_SELF_TUNING_DIRECTIVE'
    | 'KERNEL/TICK' | 'KERNEL/SET_TASK_QUEUE' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL'
    | 'COGNITIVE_OS/EXECUTE_DIRECTIVE' | 'COGNITIVE_OS/SET_PLAN' | 'COGNITIVE_OS/ADVANCE_STAGE' | 'COGNITIVE_OS/STAGE_COMPLETE'
    | 'COGNITIVE_OS/PIPELINE_COMPLETE' | 'COGNITIVE_OS/EXECUTION_FAILED' | 'COGNITIVE_OS/CLEANUP'
    | 'PLUGIN/SET_STATUS' | 'PLUGIN/RESTORE_DEFAULTS' | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ'
    // Doxastic Engine
    | 'DOXASTIC/START_SIMULATION' | 'DOXASTIC/LOG_SIMULATION_STEP' | 'DOXASTIC/COMPLETE_SIMULATION' | 'DOXASTIC/FAIL_SIMULATION'
    | 'TEST_CAUSAL_HYPOTHESIS'
    // Metaphor
    | 'METAPHOR/ADD' | 'METAPHOR/UPDATE'
    // HOVA
    | 'HOVA/SET_TARGET' | 'HOVA/START_CYCLE' | 'HOVA/LOG_EVOLUTION'
    // Internal Scientist
    | 'SCIENTIST/UPDATE_STATE' | 'SANDBOX/TEST_PROPOSAL' | 'SANDBOX/REPORT_RESULTS';
    

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
}

export type Action =
    | { type: 'SYSCALL', payload: SyscallPayload }
    | { type: 'RESET_STATE' }
    | { type: 'IMPORT_STATE', payload: AuraState }
    | { type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: AuraState };


// --- Proposal Types ---

export interface ArchitecturalChangeProposal {
    id: string;
    proposalType: 'architecture';
    timestamp: number;
    action: 'ADD_SKILL' | 'REMOVE_SKILL' | 'DEPRECATE_SKILL' | 'SYNTHESIZE_SKILL';
    target: string | string[];
    newModule?: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    arbiterReasoning?: string;
    confidence?: number;
    priority?: number;
}

export interface CodeEvolutionProposal {
    id: string;
    proposalType: 'code';
    timestamp: number;
    targetFile: string;
    codeSnippet: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected';
    priority?: number;
}

export interface GenialityImprovementProposal {
    id: string;
    proposalType: 'geniality';
    timestamp: number;
    title: string;
    description: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected';
    priority?: number;
}

export interface ArchitecturalImprovementProposal {
    id: string;
    proposalType: 'crucible';
    timestamp: number;
    title: string;
    description: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected';
    priority?: number;
}

export interface CausalInferenceProposal {
    id: string;
    proposalType: 'causal_inference';
    timestamp: number;
    reasoning: string;
    linkUpdate: {
        sourceNode: string;
        targetNode: string;
        causality: number;
        confidence: number;
    };
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export interface CreateFileCandidate {
    id: string;
    proposalType: 'self_programming_create';
    type: 'CREATE';
    reasoning: string;
    newFile: { path: string; content: string };
    integrations: { filePath: string; newContent: string }[];
    status: 'proposed' | 'evaluated' | 'rejected' | 'implemented' | 'simulation_failed';
    evaluationScore?: number;
    failureReason?: string;
    source: 'autonomous' | 'user';
    priority?: number;
    linkedVectorId?: string;
}

export interface ModifyFileCandidate {
    id: string;
    proposalType: 'self_programming_modify';
    type: 'MODIFY';
    reasoning: string;
    targetFile: string;
    codeSnippet: string;
    status: 'proposed' | 'evaluated' | 'rejected' | 'implemented' | 'simulation_failed';
    evaluationScore?: number;
    failureReason?: string;
    source: 'autonomous' | 'user';
    priority?: number;
    linkedVectorId?: string;
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface POLCommandSynthesisProposal {
    id: string;
    proposalType: 'pol_command_synthesis';
    newCommandName: string;
    replacesSequence: POLCommand[];
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'implemented';
    priority?: number;
}

export type UnifiedProposal = 
    | ArchitecturalChangeProposal 
    | CodeEvolutionProposal 
    | GenialityImprovementProposal
    | ArchitecturalImprovementProposal
    | CausalInferenceProposal
    | SelfProgrammingCandidate
    | POLCommandSynthesisProposal;

// Modal Payloads
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
}

// --- Geniality Engine ---
export interface GenialityEngineState {
    genialityIndex: number;
    componentScores: {
        creativity: number;
        insight: number;
        synthesis: number;
        flow: number;
    };
}
