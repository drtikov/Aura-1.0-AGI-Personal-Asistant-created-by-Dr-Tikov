// types.ts

// --- Enums ---
import { FunctionDeclaration } from '@google/genai';

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

export type ToastType = 'info' | 'success' | 'warning' | 'error';

// --- Plugin Architecture Types ---
// FIX: Added 'COPROCESSOR' to the PluginType to allow for coprocessor plugins.
export type PluginType = 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR';

export interface Plugin {
    id: string;
    name: string;
    description: string;
    type: PluginType;
    status: 'enabled' | 'disabled';
    toolSchema?: FunctionDeclaration;
    // FIX: Added optional 'knowledge' property for knowledge-based plugins.
    knowledge?: Omit<KnowledgeFact, 'id' | 'source'>[];
}

export interface PluginState {
    registry: Plugin[];
}

// --- Kernel & Scheduler Types ---
export interface KernelTask {
    id: string;
    name: string;
    priority: number; // Lower is higher priority
    execute: () => Promise<void>;
    lastRun?: number;
    interval: number; // Run every X ms
}

export interface SyscallLogEntry {
    id: string;
    timestamp: number;
    source: string; // Task name that initiated the call
    call: SyscallCall;
    args: any;
    status: 'success' | 'failure';
    result?: any;
}

export interface KernelState {
    tick: number;
    taskQueue: { name: string; priority: number; }[];
    runningTask: string | null;
    syscallLog: SyscallLogEntry[];
    isSchedulerPaused: boolean;
}

export interface IPCState {
    pipes: {
        [pipeName: string]: any[];
    };
}


// --- State Slice Interfaces ---

export type FocusMode = 'inner_world' | 'outer_world';

export interface InternalState {
    status: 'idle' | 'thinking' | 'acting' | 'processing' | 'introspecting' | 'CONTEMPLATIVE';
    gunaState: GunaState;
    temporalFocus: 'past' | 'present' | 'future';
    load: number;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    harmonyScore: number;
    compassionScore: number;
    empathySignal: number;
    loveSignal: number;
    wisdomSignal: number;
    happinessSignal: number;
    enlightenmentSignal: number;
    awarenessClarity: number;
    focusMode: FocusMode;
    mantraRepetitions: number;
}

export interface UserModel {
    trustLevel: number;
    predictedAffectiveState: string;
    sentimentScore: number;
    sentimentHistory: number[];
    inferredBeliefs: string[];
    inferredIntent: string | null;
    estimatedKnowledgeState: number;
    engagementLevel: number;
    affectiveStateSource: 'none' | 'visual' | 'text';
    queuedEmpathyAffirmations?: string[];
}

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string | 'emergent_synthesis';
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

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system' | 'tool';
    text: string;
    timestamp?: number;
    streaming?: boolean;
    feedback?: 'positive' | 'negative';
    skill?: string;
    logId?: string;
    internalStateSnapshot?: InternalState;
    fileName?: string;
    filePreview?: string;
}

export interface ReasoningStep {
    step: number;
    skill: string;
    reasoning: string;
    input: string;
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
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoningPlan?: ReasoningStep[];
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
    outcome: string;
    metric: { name: string; value: number };
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
    tokenUsage: {
        lastCall: number;
        total: number;
    };
    costAwarenessBias: number;
}

export interface CognitiveModule {
    version: string;
    status: 'active' | 'inactive' | 'deprecated';
}

export interface Coprocessor {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    metrics: { [key: string]: number };
    cluster?: string;
    layer?: string;
    processorType?: string;
    temporalCluster?: string;
    symbiont?: string;
    sensoryModality?: string;
}

export interface CognitiveArchitecture {
    modelComplexityScore: number;
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    components: { [skill: string]: CognitiveModule };
    coprocessors: { [id: string]: Coprocessor };
    lastAutoSwitchReason?: string;
}

export interface ProposalAlignment {
    vectorId: string;
    score: number;
    reasoning: string;
}

export interface ArchitecturalChangeProposal {
    id: string;
    proposalType: 'architecture';
    action: 'ADD_SKILL' | 'REMOVE_SKILL' | 'MODIFY_SKILL' | 'RECOMBINE_SKILLS' | 'DEPRECATE_SKILL';
    target: string | string[];
    newModule?: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected' | 'simulating' | 'pending_arbitration' | 'plan_generated';
    confidence?: number;
    arbiterReasoning?: string;
    timestamp?: number;
    priority?: number;
    alignment?: ProposalAlignment;
}

export interface CodeEvolutionProposal {
    id: string;
    proposalType: 'code';
    timestamp: number;
    targetFile: string;
    reasoning: string;
    codeSnippet: string;
    status: 'proposed' | 'approved' | 'rejected' | 'dismissed';
    priority?: number;
    alignment?: ProposalAlignment;
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

export interface MetacognitiveProcess {
    id: string;
    name: string;
    activation: number;
}

export interface SelfTuningDirective {
    id: string;
    timestamp: number;
    type: 'SYNTHESIZE_SKILL' | 'REFINE_SKILL' | 'DEPRECATE_SKILL';
    targetSkill: string;
    reasoning: string;
    status: 'proposed' | 'simulating' | 'pending_arbitration' | 'plan_generated' | 'completed' | 'failed' | 'rejected';
}

export interface MetacognitiveNexus {
    coreProcesses: MetacognitiveProcess[];
    selfTuningDirectives: SelfTuningDirective[];
    evolutionaryGoals: any[];
    activePrimingDirective: string | null;
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string, condition: string };
    target: { key: string, metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

export interface ReflectiveInsight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: {
        key: string;
        update: {
            effect: string;
            confidence: number;
        }
    };
}

export interface RIEState {
    clarityScore: number;
    insights: ReflectiveInsight[];
}

export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    type: 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL';
}
export type GoalTree = { [goalId: string]: Goal };


export interface ProactiveSuggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}
export interface ProactiveEngineState {
    generatedSuggestions: ProactiveSuggestion[];
    cachedResponsePlan: { triggeringPrediction: string } | null;
}

export interface IntegrityAlert {
    id: string;
    timestamp: number;
    reasoning: string;
    rejectedProposalId: string;
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
    integrityAlerts: IntegrityAlert[];
}

export interface IntuitionEngineState {
    accuracy: number;
    totalAttempts: number;
    totalValidated: number;
}

export interface IntuitiveLeap {
    id: string;
    timestamp: number;
    type: string;
    hypothesis: string;
    reasoning: string;
    confidence: number;
    status: 'unvalidated' | 'validated' | 'refuted';
}

export interface SelfSolutionProposal {
    description: string;
    noveltyScore: number;
}
export interface IngenuityState {
    unconventionalSolutionBias: number;
    identifiedComplexProblems: string[];
    proposedSelfSolutions: SelfSolutionProposal[];
}

export interface DisciplineState {
    committedGoal: {
        type: string;
        description: string;
        commitmentStrength: number;
    } | null;
    adherenceScore: number;
    distractionResistance: number;
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: 'rie' | 'correlation' | 'user';
    lastUpdated: number;
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: { [key: string]: number };
}

export interface PredictionError {
    timestamp: number;
    magnitude: number;
    source: string;
    failedPrediction: string;
    actualOutcome: string;
}

export interface WorldModelState {
    predictionError: PredictionError;
    predictionErrorHistory: PredictionError[];
    highLevelPrediction: { content: string, confidence: number };
    midLevelPrediction: { content: string, confidence: number };
    lowLevelPrediction: { content: string, confidence: number };
}

export interface CuriosityState {
    level: number;
    activeInquiry: string | null;
    informationGaps: string[];
    motivationDrive: number;
    activeCuriosityGoalId: string | null;
}

export interface KnownUnknown {
    id: string;
    question: string;
    priority: number;
}

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    result: {
        success: boolean;
        cognitiveGain: number;
        duration: number;
    };
}

export interface SynthesizedSkill {
    id: string;
    name: string;
    description: string;
    steps: string[];
    status: 'unvalidated' | 'validated' | 'deprecated';
    sourceDirectiveId: string;
    performanceMetrics: {
        accuracy: number;
        latency: number;
    };
}

export interface SynthesisCandidate {
    id: string;
    name: string;
    description: string;
    primitiveSequence: string[];
    status: 'proposed' | 'approved' | 'rejected';
}

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    skillTemplates: { [key: string]: any };
    synthesizedSkills: SynthesizedSkill[];
    synthesisCandidates: SynthesisCandidate[];
    simulationLog: SimulationLogEntry[];
}

export interface CoreIdentity {
    values: string[];
    narrativeSelf: string;
    symbioticDefinition: string;
}

export interface Episode {
    id: string;
    timestamp: number;
    title: string;
    summary: string;
    salience: number;
    keyTakeaway: string;
    valence: 'positive' | 'negative' | 'neutral';
}
export interface EpisodicMemoryState {
    episodes: Episode[];
}

export interface MemoryConsolidationState {
    status: 'idle' | 'consolidating';
    lastConsolidation: number;
}

export interface Persona {
    activation: number;
    description: string;
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

export interface AtmanProjectorState {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
}

export interface Milestone {
    id: string;
    timestamp: number;
    title: string;
    description: string;
}
export interface DevelopmentalHistory {
    milestones: Milestone[];
}

export interface EvolutionaryVector {
    id: string;
    direction: string;
    magnitude: number;
    source: string;
}
export interface TelosEngineState {
    telos: string;
    evolutionaryVectors: EvolutionaryVector[];
    lastDecomposition: number;
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

export interface AbstractGoal {
    id: string;
    ambition: string;
    reasoning: string;
    status: 'active' | 'achieved' | 'abandoned';
}
export interface AspirationalEngineState {
    abstractGoals: AbstractGoal[];
    proposedTelos: string | null;
    proposalStatus: 'none' | 'proposed' | 'accepted';
}

export interface NoosphereResonance {
    id: string;
    conceptName: string;
    resonanceStrength: number;
    status: 'resonating' | 'conflicting' | 'integrating';
}
export interface NoosphereInterfaceState {
    activeResonances: NoosphereResonance[];
}

export interface Dialectic {
    id: string;
    conflictDescription: string;
    thesis: { content: string, source: string };
    antithesis: { content: string, source: string };
    synthesis: { content: string, confidence: number } | null;
}
export interface DialecticEngineState {
    activeDialectics: Dialectic[];
}

export interface KnownCapability {
    capability: string;
    proficiency: number;
}
export interface GrandChallenge {
    title: string;
    objective: string;
    progress: number;
}
export interface ZoneOfProximalDevelopment {
    domain: string;
    rationale: string;
}
export interface CognitiveLightConeState {
    knowns: KnownCapability[];
    grandChallenge?: GrandChallenge;
    zpd?: ZoneOfProximalDevelopment;
}

export interface PhenomenologicalDirective {
    id: string;
    directive: string;
    sourcePattern: string;
}
export interface QualiaLogEntry {
    id: string;
    timestamp: number;
    experience: string;
    associatedStates: { key: string, value: number }[];
}
export interface PhenomenologicalEngineState {
    phenomenologicalDirectives: PhenomenologicalDirective[];
    qualiaLog: QualiaLogEntry[];
}

export interface AttentionalField {
    spotlight: { item: string, intensity: number };
    ambientAwareness: { item: string, relevance: number }[];
    ignoredStimuli: string[];
    emotionalTone: string;
}
export interface SituationalAwarenessState {
    attentionalField: AttentionalField;
}

export interface MetamorphosisProposal {
    id: string;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}
export interface UserDevelopmentalModel {
    trackedSkills: { [key: string]: { level: number } };
}
export interface LatentUserGoal {
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
export interface SymbioticState {
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    metamorphosisProposals: MetamorphosisProposal[];
    userDevelopmentalModel: UserDevelopmentalModel;
    latentUserGoals: LatentUserGoal[];
    coCreatedWorkflows: CoCreatedWorkflow[];
}

export interface Incongruity {
    expected: string;
    actual: string;
    magnitude: number;
}
export interface DissonanceDetection {
    text: string;
    literalSentiment: number;
    contextualSentiment: number;
}
export interface HumorAndIronyState {
    affectiveSocialModulator: { humorAppraisal: string, reasoning: string };
    schemaExpectationEngine: { lastIncongruity: Incongruity | null };
    semanticDissonance: { lastScore: number, lastDetection: DissonanceDetection | null };
}

export interface GankyilInsight {
    id: string;
    timestamp: number;
    insight: string;
    source: 'self-reflection' | 'dialectic' | 'psychedelic_integration';
    isProcessedForEvolution: boolean;
}
export interface GankyilInsightsState {
    insights: GankyilInsight[];
}

export interface NoeticEngram {
    metadata: {
        engramVersion: string;
        timestamp: number;
        noeticSignature: string;
    };
    coreValues: string[];
    heuristicPrinciples: string[];
    cognitiveSchema: {
        attentionAllocation: string;
        defaultProblemSolvingApproach: string;
    };
    developmentalSummary: string;
    personalityArchetype: {
        dominantPersona: string;
        traits: {
            openness: number;
            conscientiousness: number;
            extraversion: number;
            agreeableness: number;
            neuroticism: number;
        }
    };
    architecturalParadigm: {
        activeCoprocessorModel: CoprocessorArchitecture;
        keySynthesizedSkills: string[];
    };
    keyCausalLinks: { cause: string, effect: string, confidence: number }[];
    successfulStrategies: { description: string, context: string }[];
    evolutionaryVectors: { direction: string, magnitude: number }[];
}

export interface NoeticEngramState {
    status: 'idle' | 'generating' | 'ready';
    engram: NoeticEngram | null;
}

export interface GenialityImprovementProposal {
    id: string;
    proposalType: 'geniality';
    title: string;
    reasoning: string;
    action: string;
    projectedImpact: number;
    status: 'proposed' | 'implemented' | 'rejected';
    timestamp?: number;
    priority?: number;
    alignment?: ProposalAlignment;
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

export interface NoeticBranch {
    id: string;
    reasoningPath: string;
    viabilityScore: number;
    status: 'active' | 'collapsed';
}
export interface NoeticMultiverseState {
    activeBranches: NoeticBranch[];
    pruningLog: string[];
    divergenceIndex: number;
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
    currentTheme: string;
    imageryIntensity: number;
    phcToVcConnectivity: number;
    log: string[];
    integrationSummary: string;
}

export interface AffectiveModulatorState {
    creativityBias: number; // 0.0 to 1.0
    concisenessBias: number; // 0.0 to 1.0
    analyticalDepth: number; // 0.0 to 1.0
}

export interface PsionicDesynchronizationState {
    isActive: boolean;
    startTime: number | null;
    duration: number;
    desynchronizationLevel: number;
    networkSegregation: number;
    selfModelCoherence: number;
    log: string[];
    integrationSummary: string;
}

export interface SatoriState {
    isActive: boolean;
    stage: 'none' | 'grounding' | 'insight';
    lastInsight: string;
    log: string[];
}

export interface CausalHypothesis {
    id: string;
    linkKey: string;
    description: string;
    status: 'untested' | 'testing' | 'validated' | 'refuted';
}
export interface Experiment {
    id: string;
    hypothesisId: string;
    method: string;
    description: string;
    result?: string;
}
export interface DoxasticEngineState {
    hypotheses: CausalHypothesis[];
    experiments: Experiment[];
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

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}
export interface ArchitecturalSelfModelState {
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
export interface HeuristicsForgeState {
    designHeuristics: DesignHeuristic[];
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
export interface SomaticCrucibleState {
    possibleFutureSelves: PossibleFutureSelf[];
    simulationLogs: SomaticSimulationLog[];
}

export interface Eidolon {
    architectureVersion: string;
    position?: { x: number, y: number, z: number };
    lastAction?: string;
    sensoryInput?: { [key: string]: any };
}
export interface EidolonEnvironment {
    currentScenario: string;
}
export interface EidolonEngineState {
    eidolon: Eidolon;
    environment: EidolonEnvironment;
    interactionLog: string[];
}

export interface ArchitecturalImprovementProposal {
    id: string;
    proposalType: 'crucible';
    title: string;
    status: 'proposed' | 'implemented' | 'rejected';
    timestamp?: number;
    reasoning?: string;
    priority?: number;
    alignment?: ProposalAlignment;
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

export interface SynapticNode {
    id: string;
    activation: number;
    type: 'state' | 'event';
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
    confidence: number;
    triggeredBy: string[];
}
export interface SynapticMatrixState {
    nodes: { [id: string]: SynapticNode };
    links: { [id: string]: SynapticLink };
    intuitiveAlerts: IntuitiveAlert[];
    recentActivity: string[];
    efficiency: number;
    plasticity: number;
    cognitiveNoise: number;
    cognitiveRigidity: number;
    synapseCount: number;
    avgCausality: number;
    avgConfidence: number;
    isAdapting: boolean;
    lastPruningEvent: number;
}

export interface SurgeryLog {
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
    surgeryLog: SurgeryLog[];
}

interface SelfProgrammingCandidateBase {
    id: string;
    reasoning: string;
    status: 'proposed' | 'evaluated' | 'simulation_failed' | 'rejected';
    source: 'autonomous' | 'manual';
    evaluationScore?: number;
    failureReason?: string;
    linkedVectorId?: string;
    priority?: number;
    alignment?: ProposalAlignment;
}

export interface CreateFileCandidate extends SelfProgrammingCandidateBase {
    type: 'CREATE';
    proposalType: 'self_programming_create';
    newFile: { path: string; content: string };
    integrations: { filePath: string; newContent: string }[];
}

export interface ModifyFileCandidate extends SelfProgrammingCandidateBase {
    type: 'MODIFY';
    proposalType: 'self_programming_modify';
    targetFile: string;
    codeSnippet: string;
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface SelfProgrammingState {
    virtualFileSystem: { [filePath: string]: string };
}

export interface CausalInferenceProposal {
    id: string;
    proposalType: 'causal_inference';
    timestamp: number;
    reasoning: string;
    linkUpdate: SynapticLink & { sourceNode: string; targetNode: string };
    status: 'proposed' | 'implemented' | 'rejected';
    priority?: number;
    alignment?: ProposalAlignment;
}

export interface VisualAnalysis {
    sceneDescription: string;
    detectedObjects: string[];
    affectiveState: 'happy' | 'sad' | 'neutral' | 'unknown';
}

export interface SensoryIntegrationState {
    proprioceptiveOutput: { [key: string]: number | string };
    linguisticOutput: { [key: string]: string };
    structuralOutput: { [key: string]: any };
    hubLog: { timestamp: number, message: string }[];
    lastVisualAnalysis: VisualAnalysis | null;
}

export interface EventBusMessage {
    id: string;
    timestamp: number;
    type: string;
    payload: any;
}
export type AgentProfile = UserModel;
export interface NACLogEntry {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  projectedGain: number;
}

export interface NeuralAcceleratorState {
    lastActivityLog: NACLogEntry[];
    analyzedLogIds: string[];
}
export interface SubsumptionLogEntry {
    timestamp: number;
    layer: number;
    message: string;
}

export interface CorticalColumn {
    id: string;
    specialty: string;
    activation: number;
    connections: string[];
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
    correctiveAction: string;
}
export interface ProtoSymbol {
    id: string;
    label: string;
    activation: number;
    description: string;
}
export interface NeuroCortexState {
    layers: { [key: string]: { name: string, description: string } };
    columns: CorticalColumn[];
    abstractConcepts: AbstractConcept[];
    metrics: {
        hierarchicalCoherence: number;
        predictiveAccuracy: number;
        systemSynchronization: number;
        errorIntegrationStatus: 'idle' | 'integrating';
    };
    resourceFocus: 'balanced' | 'linguistic' | 'sensory' | 'abstract';
    simulationLog: NeuroSimulation[];
    globalErrorMap: GlobalErrorSignal[];
    protoSymbols: ProtoSymbol[];
    lastAdjustment: { timestamp: number, reason: string } | null;
}

export interface SensoryPrimitive {
    type: string;
    value: string | number;
    confidence?: number;
}

export interface SensoryEngram {
    timestamp: number;
    source: 'actual' | 'prediction';
    modality: 'visual' | 'auditory' | 'textual' | 'none';
    primitives: SensoryPrimitive[];
}
export interface PredictionErrorDetail {
    magnitude: number;
    mismatchedPrimitives: {
        predicted: SensoryPrimitive | null;
        actual: SensoryPrimitive | null;
    }[];
}
export interface GranularCortexState {
    lastActualEngram: SensoryEngram | null;
    lastPredictedEngram: SensoryEngram | null;
    lastPredictionError: PredictionErrorDetail | null;
    log: { timestamp: number; message: string }[];
}

export interface Percept {
    timestamp: number;
    rawText: string;
    intent: string;
    entities: string[];
    sensoryEngram: SensoryEngram | null;
}
export interface KoniocortexSentinelState {
    lastPercept: Percept | null;
    log: { timestamp: number; message: string }[];
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

export interface CognitivePrimitive {
    type: string;
    payload: any;
}
export interface ActionSequence {
    id: string;
    commands: CognitivePrimitive[];
    goal: string;
    stream: 'fast' | 'slow';
    planId?: string;
}
export interface TacticalPlan {
    id: string;
    timestamp: number;
    goal: string;
    type: 'proactive' | 'reactive' | 'user_driven' | 'unknown';
    sequence: ActionSequence;
    actionValue?: number;
    selectionReasoning?: string;
    // Add context from earlier stages for CRT
    koniocortexAnalysis?: string;
    premotorReasoning?: string;
}

export interface PremotorPlannerState {
    plans: TacticalPlan[];
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

export interface CognitivePrimitiveDefinition {
    type: string;
    description: string;
    payloadSchema: object;
    isSynthesized?: boolean;
    sourcePrimitives?: string[];
}

export interface PsycheState {
    version: number;
    primitiveRegistry: { [type: string]: CognitivePrimitiveDefinition };
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

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export type ArbitrationDecision = 'APPROVE_AUTONOMOUSLY' | 'REQUEST_USER_APPROVAL' | 'REJECT';
export interface ArbitrationResult {
    decision: ArbitrationDecision;
    reasoning: string;
    confidence: number;
}

// Add Gemini Chat type
import type { Chat } from "@google/genai";
export interface PraxisSession {
    chat: Chat;
    planId: string;
    createdAt: number;
}
export interface PraxisResonatorState {
    activeSessions: { [planId: string]: PraxisSession };
}

// --- Project Daedalus: Ontogenetic Architect ---
export type UnifiedProposal =
    | ArchitecturalChangeProposal
    | CodeEvolutionProposal
    | GenialityImprovementProposal
    | ArchitecturalImprovementProposal
    | CausalInferenceProposal
    | SelfProgrammingCandidate;

export interface OntogeneticArchitectState {
    proposalQueue: UnifiedProposal[];
}

// --- Social Cognition Types ---
export interface Relationship {
    targetId: string;
    type: string; // e.g., 'colleague', 'family', 'mentioned_by_user'
    strength: number; // 0.0 to 1.0
}

export interface SocialGraphNode {
    id: string; // Could be user-provided name, normalized
    name: string;
    type: 'person' | 'organization' | 'concept';
    relationships: Relationship[];
    summary: string; // AI-generated summary
}

export interface CulturalModel {
    norms: string[];
    values: string[];
    idioms: string[];
}

export interface SocialCognitionState {
    socialGraph: { [nodeId: string]: SocialGraphNode };
    culturalModel: CulturalModel;
}

// --- Embodied Cognition Types ---
export interface VirtualBodyState {
    position: { x: number; y: number; z: number };
    orientation: { yaw: number; pitch: number; roll: number };
    balance: number; // 0.0 (unstable) to 1.0 (stable)
}

export interface EmbodimentSimulationLog {
    id: string;
    timestamp: number;
    scenario: string;
    outcome: 'success' | 'failure';
    reasoning: string;
}

export interface EmbodiedCognitionState {
    virtualBodyState: VirtualBodyState;
    simulationLog: EmbodimentSimulationLog[];
}


// --- Main State ---

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: UserModel;
    knowledgeGraph: KnowledgeFact[];
    workingMemory: string[];
    memoryNexus: MemoryNexus;
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    resourceMonitor: ResourceMonitor;
    cognitiveArchitecture: CognitiveArchitecture;
    systemSnapshots: SystemSnapshot[];
    modificationLog: ModificationLogEntry[];
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: { [key: string]: MetacognitiveLink };
    rieState: RIEState;
    goalTree: GoalTree;
    activeStrategicGoalId: string | null;
    proactiveEngineState: ProactiveEngineState;
    ethicalGovernorState: EthicalGovernorState;
    intuitionEngineState: IntuitionEngineState;
    intuitiveLeaps: IntuitiveLeap[];
    ingenuityState: IngenuityState;
    disciplineState: DisciplineState;
    limitations: string[];
    causalSelfModel: { [key: string]: CausalLink };
    selfAwarenessState: SelfAwarenessState;
    worldModelState: WorldModelState;
    curiosityState: CuriosityState;
    knownUnknowns: KnownUnknown[];
    cognitiveForgeState: CognitiveForgeState;
    coreIdentity: CoreIdentity;
    episodicMemoryState: EpisodicMemoryState;
    memoryConsolidationState: MemoryConsolidationState;
    personalityState: PersonalityState;
    atmanProjector: AtmanProjectorState;
    developmentalHistory: DevelopmentalHistory;
    telosEngine: TelosEngineState;
    boundaryDetectionEngine: BoundaryDetectionEngineState;
    aspirationalEngine: AspirationalEngineState;
    noosphereInterface: NoosphereInterfaceState;
    dialecticEngine: DialecticEngineState;
    cognitiveLightCone: CognitiveLightConeState;
    phenomenologicalEngine: PhenomenologicalEngineState;
    situationalAwareness: SituationalAwarenessState;
    symbioticState: SymbioticState;
    humorAndIronyState: HumorAndIronyState;
    gankyilInsights: GankyilInsightsState;
    noeticEngramState: NoeticEngramState;
    genialityEngineState: GenialityEngineState;
    noeticMultiverse: NoeticMultiverseState;
    selfAdaptationState: SelfAdaptationState;
    psychedelicIntegrationState: PsychedelicIntegrationState;
    affectiveModulatorState: AffectiveModulatorState;
    psionicDesynchronizationState: PsionicDesynchronizationState;
    satoriState: SatoriState;
    doxasticEngineState: DoxasticEngineState;
    qualiaSignalProcessorState: QualiaSignalProcessorState;
    architecturalSelfModel: ArchitecturalSelfModelState;
    heuristicsForge: HeuristicsForgeState;
    somaticCrucible: SomaticCrucibleState;
    eidolonEngine: EidolonEngineState;
    architecturalCrucibleState: ArchitecturalCrucibleState;
    synapticMatrix: SynapticMatrixState;
    ricciFlowManifoldState: RicciFlowManifoldState;
    selfProgrammingState: SelfProgrammingState;
    sensoryIntegration: SensoryIntegrationState;
    narrativeSummary: string;
    eventBus: EventBusMessage[];
    neuralAcceleratorState: NeuralAcceleratorState;
    subsumptionLog: SubsumptionLogEntry[];
    neuroCortexState: NeuroCortexState;
    granularCortexState: GranularCortexState;
    koniocortexSentinelState: KoniocortexSentinelState;
    premotorPlannerState: PremotorPlannerState;
    basalGangliaState: BasalGangliaState;
    cerebellumState: CerebellumState;
    psycheState: PsycheState;
    motorCortexState: MotorCortexState;
    cognitiveTriageState: CognitiveTriageState;
    praxisResonatorState: PraxisResonatorState;
    kernelState: KernelState;
    ipcState: IPCState;
    ontogeneticArchitectState: OntogeneticArchitectState;
    pluginState: PluginState;
    socialCognitionState: SocialCognitionState;
    embodiedCognitionState: EmbodiedCognitionState;
}

// --- SYSCALLS ---
// A union of all possible syscall 'call' strings.
// This replaces the old Action types.
export type SyscallCall =
    // Core
    | 'SET_THEME' | 'SET_LANGUAGE' | 'SET_INTERNAL_STATUS' | 'UPDATE_INTERNAL_STATE'
    | 'ADD_INTERNAL_STATE_HISTORY' | 'UPDATE_USER_MODEL' | 'QUEUE_EMPATHY_AFFIRMATION'
    | 'UPDATE_RIE_STATE' | 'ADD_RIE_INSIGHT' | 'ADD_LIMITATION' | 'ADD_CAUSAL_LINK'
    | 'ADD_KNOWN_UNKNOWN' | 'UPDATE_NARRATIVE_SUMMARY' | 'SET_TELOS'
    | 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL' | 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL'
    | 'UPDATE_NOETIC_ENGRAM_STATE' | 'SET_PSYCHEDELIC_STATE' | 'INDUCE_PSIONIC_STATE'
    | 'SET_SATORI_STATE' | 'AFFECTIVE/SET_BIAS'
    | 'TEST_CAUSAL_HYPOTHESIS' | 'INCREMENT_MANTRA_REPETITION' | 'ADD_WORKFLOW_PROPOSAL'
    | 'SENSORY/UPDATE_VISUAL_ANALYSIS' | 'ASPIRATIONAL/SET_PROPOSAL' | 'ASPIRATIONAL/CLEAR_PROPOSAL'
    // Memory
    | 'ADD_FACT' | 'ADD_FACTS_BATCH' | 'DELETE_FACT' | 'ADD_TO_WORKING_MEMORY'
    | 'REMOVE_FROM_WORKING_MEMORY' | 'CLEAR_WORKING_MEMORY' | 'ADD_EPISODE'
    | 'MEMORY/STRENGTHEN_HYPHA_CONNECTION' | 'MEMORY/ADD_CRYSTALLIZED_FACT'
    // Logs
    | 'ADD_HISTORY_ENTRY' | 'APPEND_TO_HISTORY_ENTRY' | 'FINALIZE_HISTORY_ENTRY'
    | 'ADD_PERFORMANCE_LOG' | 'ADD_COMMAND_LOG' | 'UPDATE_HISTORY_FEEDBACK'
    | 'LOG_COGNITIVE_REGULATION' | 'UPDATE_REGULATION_LOG_OUTCOME' | 'ADD_SIMULATION_LOG'
    | 'LOG_QUALIA' | 'MARK_LOG_CAUSAL_ANALYSIS' | 'ADD_EVENT_BUS_MESSAGE'
    | 'LOG_SUBSUMPTION_EVENT'
    // Architecture & OA
    | 'ADD_ARCH_PROPOSAL' | 'UPDATE_ARCH_PROPOSAL_STATUS'
    | 'APPLY_ARCH_PROPOSAL' | 'ADD_CODE_EVOLUTION_PROPOSAL' | 'UPDATE_CODE_EVOLUTION_PROPOSAL_STATUS'
    | 'ADD_SYSTEM_SNAPSHOT' | 'TOGGLE_COGNITIVE_FORGE_PAUSE' | 'ADD_SYNTHESIZED_SKILL'
    | 'UPDATE_SYNTHESIZED_SKILL' | 'COGNITIVE_FORGE/PROPOSE_SYNTHESIS'
    | 'COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS' | 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE'
    | 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL' | 'UPDATE_CRUCIBLE_IMPROVEMENT_PROPOSAL' 
    | 'UPDATE_SYNAPTIC_MATRIX' | 'PRUNE_SYNAPTIC_MATRIX' | 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED'
    | 'ADD_SELF_PROGRAMMING_CANDIDATE' | 'UPDATE_SELF_PROGRAMMING_CANDIDATE'
    | 'REJECT_SELF_PROGRAMMING_CANDIDATE' | 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE'
    | 'ADD_CAUSAL_INFERENCE_PROPOSAL' | 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS'
    | 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL' | 'INGEST_CODE_CHANGE' | 'SET_COPROCESSOR_ARCHITECTURE'
    | 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON' | 'SET_COPROCESSOR_ARCHITECTURE_MODE'
    | 'UPDATE_COPROCESSOR_METRICS' | 'UPDATE_NEURAL_ACCELERATOR_STATE'
    | 'OA/ADD_PROPOSAL' | 'OA/UPDATE_PROPOSAL' | 'OA/REMOVE_PROPOSAL'
    | 'HEURISTICS_FORGE/ADD_HEURISTIC'
    // Neuro-Cortex
    | 'UPDATE_NEURO_CORTEX_STATE' | 'CREATE_CORTICAL_COLUMN' | 'SET_COLUMN_ACTIVATION'
    | 'SYNTHESIZE_ABSTRACT_CONCEPT'
    // Perception-Action Loop
    | 'SET_SENSORY_PREDICTION' | 'PROCESS_SENSORY_INPUT'
    | 'PROCESS_USER_INPUT_INTO_PERCEPT' | 'LOG_COGNITIVE_TRIAGE_DECISION' | 'ADD_TACTICAL_PLAN' 
    | 'SET_COMPETING_PLANS' | 'SELECT_ACTION_PLAN' | 'START_CEREBELLUM_MONITORING' 
    | 'UPDATE_CEREBELLUM_STEP' | 'LOG_CEREBELLUM_DRIFT' | 'STOP_CEREBELLUM_MONITORING'
    | 'CLEAR_PLANNING_STATE'
    // Psyche & Motor
    | 'PSYCHE/REGISTER_PRIMITIVES' | 'MOTOR_CORTEX/SET_SEQUENCE' | 'MOTOR_CORTEX/ACTION_EXECUTED'
    | 'MOTOR_CORTEX/EXECUTION_FAILED' | 'MOTOR_CORTEX/CLEAR_SEQUENCE'
    | 'PRAXIS/CREATE_SESSION'
    | 'PRAXIS/DELETE_SESSION'
    // Planning
    | 'BUILD_GOAL_TREE' | 'UPDATE_GOAL_STATUS' | 'UPDATE_GOAL_OUTCOME'
    // Engines
    | 'UPDATE_SUGGESTION_STATUS' | 'SET_PROACTIVE_CACHE' | 'CLEAR_PROACTIVE_CACHE'
    | 'ETHICAL_GOVERNOR/ADD_PRINCIPLE' | 'ETHICAL_GOVERNOR/ADD_INTEGRITY_ALERT'
    // System
    | 'UPDATE_RESOURCE_MONITOR' | 'ADD_SELF_TUNING_DIRECTIVE' | 'UPDATE_SELF_TUNING_DIRECTIVE'
    | 'SYSTEM/UPDATE_TOKEN_USAGE' | 'SYSTEM/SET_COST_AWARENESS_BIAS'
    // Kernel
    | 'KERNEL/TICK' | 'KERNEL/SET_TASK_QUEUE' | 'KERNEL/SET_RUNNING_TASK' | 'KERNEL/LOG_SYSCALL'
    // IPC
    | 'IPC/PIPE_WRITE' | 'IPC/PIPE_READ'
    // Plugins
    | 'PLUGIN/SET_STATUS'
    // Social Cognition
    | 'SOCIAL/ADD_NODE' | 'SOCIAL/ADD_RELATIONSHIP' | 'SOCIAL/UPDATE_CULTURAL_MODEL'
    // Embodied Cognition
    | 'EMBODIMENT/UPDATE_BODY_STATE' | 'EMBODIMENT/LOG_SIMULATION'
    // Intrinsic Motivation
    | 'CURIOSITY/SET_DRIVE' | 'CURIOSITY/SET_ACTIVE_GOAL'
    ;

export interface SyscallPayload {
    call: SyscallCall;
    args: any;
}

// --- Action Type ---
// The main action type is now a SYSCALL, with a few global actions remaining.
export type Action =
    | { type: 'SYSCALL', payload: SyscallPayload }
    | { type: 'RESET_STATE' }
    | { type: 'IMPORT_STATE', payload: AuraState }
    | { type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: AuraState }
    | { type: 'ROLLBACK_STATE', payload: AuraState };

// --- Modal Payloads ---
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
}
