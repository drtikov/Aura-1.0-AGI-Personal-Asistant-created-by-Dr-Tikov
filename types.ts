// types.ts
import React from 'react';

// --- ENUMS ---

export enum GunaState {
    SATTVA = 'SATTVA',
    RAJAS = 'RAJAS',
    TAMAS = 'TAMAS',
    DHARMA = 'DHARMA',
    'GUNA-TEETA' = 'GUNA-TEETA',
}

export enum CoprocessorArchitecture {
    TRIUNE = 'TRIUNE',
    REFLEX_ARC = 'REFLEX_ARC',
    EVENT_STREAM = 'EVENT_STREAM',
    TEMPORAL_ENGINE = 'TEMPORAL_ENGINE',
    SYMBIOTIC_ECOSYSTEM = 'SYMBIOTIC_ECOSYSTEM',
    SENSORY_INTEGRATION = 'SENSORY_INTEGRATION',
    SUBSUMPTION_RELAY = 'SUBSUMPTION_RELAY'
}

export enum FocusMode {
    INNER_WORLD = 'inner_world',
    OUTER_WORLD = 'outer_world'
}

// --- CORE STATE ---

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
    focusMode: FocusMode | string;
    mantraRepetitions: number;
}

export interface AgentProfile {
    trustLevel: number;
    predictedAffectiveState: string;
    sentimentScore: number;
    sentimentHistory: number[];
    inferredBeliefs: string[];
    inferredIntent: string | null;
    estimatedKnowledgeState: number;
    engagementLevel: number;
    queuedEmpathyAffirmations?: string[];
    affectiveStateSource: 'none' | 'visual' | 'text';
}

export interface ResourceMonitor {
    cpu_usage: number;
    memory_usage: number;
    io_throughput: number;
    resource_allocation_stability: number;
}

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: AgentProfile;
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
    architecturalProposals: ArchitecturalChangeProposal[];
    codeEvolutionProposals: CodeEvolutionProposal[];
    systemSnapshots: SystemSnapshot[];
    modificationLog: ModificationLogEntry[];
    metacognitiveNexus: MetacognitiveNexus;
    metacognitiveCausalModel: { [key: string]: MetacognitiveLink };
    rieState: ReflectiveInsightEngineState;
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
    telosEngine: TelosEngine;
    boundaryDetectionEngine: BoundaryDetectionEngine;
    aspirationalEngine: AspirationalEngine;
    noosphereInterface: NoosphereInterface;
    dialecticEngine: DialecticEngine;
    cognitiveLightCone: CognitiveLightCone;
    phenomenologicalEngine: PhenomenologicalEngine;
    situationalAwareness: SituationalAwareness;
    symbioticState: SymbioticState;
    humorAndIronyState: HumorAndIronyState;
    gankyilInsights: GankyilInsightsState;
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
    architecturalSelfModel: ArchitecturalSelfModel;
    heuristicsForge: HeuristicsForge;
    somaticCrucible: SomaticCrucible;
    eidolonEngine: EidolonEngine;
    architecturalCrucibleState: ArchitecturalCrucibleState;
    synapticMatrix: SynapticMatrix;
    ricciFlowManifoldState: RicciFlowManifoldState;
    selfProgrammingState: SelfProgrammingState;
    causalInferenceProposals: CausalInferenceProposal[];
    sensoryIntegration: SensoryIntegration;
    narrativeSummary: string;
    eventBus: EventBusMessage[];
    neuralAcceleratorState: NeuralAcceleratorState;
}

// --- LOGS & HISTORY ---

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system';
    text: string;
    timestamp?: number;
    skill?: string;
    streaming?: boolean;
    internalStateSnapshot?: InternalState;
    logId?: string;
    feedback?: 'positive' | 'negative';
    fileName?: string;
    filePreview?: string;
}

export interface PerformanceLogEntry {
    id: string;
    timestamp: number;
    skill: string;
    input: string;
    output: string | null;
    duration: number;
    success: boolean;
    cognitiveGain: number;
    sentiment?: number;
    decisionContext: {
        reasoning: string;
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoningPlan?: ReasoningStep[];
    };
    causalAnalysisTimestamp?: number;
}

export interface ReasoningStep {
    step: number;
    skill: string;
    input: string;
    reasoning: string;
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
    gainAchieved: boolean;
    metric: { name: string; value: number };
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
    outcomeLogId: string | null;
}

export interface StateAdjustment {
    from: number;
    to: number;
}

// --- MEMORY & KNOWLEDGE ---

export interface KnowledgeFact {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    confidence: number;
    source: string;
}

export interface MemoryNexus {
    hyphaeConnections: HyphaeConnection[];
}

export interface HyphaeConnection {
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
    salience: number;
    keyTakeaway: string;
    valence: 'positive' | 'negative' | 'neutral';
}

export interface MemoryConsolidationState {
    status: 'idle' | 'consolidating';
    lastConsolidation: number;
}

// --- ARCHITECTURE & EVOLUTION ---

export interface CognitiveModule {
    version: string;
    status: 'active' | 'inactive' | 'deprecated';
}

export interface Coprocessor {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    cluster?: string;
    layer?: string;
    processorType?: string;
    temporalCluster?: string;
    symbiont?: string;
    sensoryModality?: string;
    metrics: { [key: string]: number };
}

export interface CognitiveArchitecture {
    modelComplexityScore: number;
    coprocessorArchitecture: CoprocessorArchitecture;
    coprocessorArchitectureMode: 'automatic' | 'manual';
    lastAutoSwitchReason?: string;
    components: { [key: string]: CognitiveModule };
    coprocessors: { [key: string]: Coprocessor };
}

export interface ArchitecturalChangeProposal {
    id: string;
    timestamp: number;
    action: 'ADD_SKILL' | 'REMOVE_SKILL' | 'TUNE_SKILL' | 'synthesize_skill' | 'DEPRECATE_SKILL';
    target: string | string[];
    newModule?: string;
    reasoning: string;
    status: 'proposed' | 'approved' | 'rejected';
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
    status: 'proposed' | 'implemented' | 'dismissed';
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
    gainType: 'EFFICIENCY' | 'ROBUSTNESS' | 'INNOVATION';
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
    isAutonomous: boolean;
}

export interface MetacognitiveNexus {
    coreProcesses: CoreProcess[];
    selfTuningDirectives: SelfTuningDirective[];
    evolutionaryGoals: EvolutionaryGoal[];
}

export interface CoreProcess {
    id: string;
    name: string;
    activation: number;
}

export interface SelfTuningDirective {
    id: string;
    timestamp: number;
    type: 'SYNTHESIZE_SKILL' | 'REWRITE_SKILL' | 'TUNE_PARAMETERS' | 'GENERATE_CODE_EVOLUTION';
    targetSkill: string;
    reasoning: string;
    status: 'proposed' | 'plan_generated' | 'simulating' | 'pending_arbitration' | 'completed' | 'rejected' | 'failed';
    payload?: any;
    simulationResult?: any;
    arbitrationResult?: ArbitrationResult;
    sourceInsightId?: string;
}

export interface ArbitrationResult {
    decision: 'APPROVE_AUTONOMOUSLY' | 'REQUEST_USER_APPROVAL' | 'REJECT';
    reasoning: string;
    confidence: number;
}

export interface EvolutionaryGoal {
    id: string;
    description: string;
    status: 'active' | 'achieved' | 'stagnated';
}

export interface MetacognitiveLink {
    id: string;
    source: { key: string; condition: string };
    target: { key: string; metric: string };
    correlation: number;
    observationCount: number;
    lastUpdated: number;
}

// --- PLANNING & ENGINES ---

export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    type: 'STRATEGIC' | 'TACTICAL' | 'OPERATIONAL';
}

export type GoalTree = { [key: string]: Goal };

export interface ProactiveEngineState {
    generatedSuggestions: ProactiveSuggestion[];
    cachedResponsePlan: CachedResponsePlan | null;
}

export interface ProactiveSuggestion {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
}

export interface CachedResponsePlan {
    triggeringPrediction: string;
    relatedTo: string;
    relevantData: string[];
    potentialResponse: string;
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
    type: string;
    hypothesis: string;
    reasoning: string;
    confidence: number;
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

export interface DisciplineState {
    committedGoal: {
        id: string;
        description: string;
        type: string;
        commitmentStrength: number;
    } | null;
    adherenceScore: number;
    distractionResistance: number;
}

// --- SELF & WORLD MODELS ---

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: 'rie' | 'autonomous' | 'user';
    lastUpdated: number;
}

export interface SelfAwarenessState {
    modelCoherence: number;
    performanceDrift: number;
    cognitiveBias: { [key: string]: number };
}

export interface WorldModelState {
    predictionError: { magnitude: number; source: string };
    highLevelPrediction: { content: string; confidence: number };
    midLevelPrediction: { content: string; confidence: number };
    lowLevelPrediction: { content: string; confidence: number };
}

export interface ReflectiveInsightEngineState {
    clarityScore: number;
    insights: Insight[];
}

export interface Insight {
    id: string;
    timestamp: number;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: { key: string; update: CausalLink };
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
}

// --- COGNITIVE FORGE ---

export interface CognitiveForgeState {
    isTuningPaused: boolean;
    skillTemplates: { [key: string]: SkillTemplate };
    synthesizedSkills: SynthesizedSkill[];
    simulationLog: SimulationLogEntry[];
}

export interface SkillTemplate {
    id: string;
    name: string;
    parameters: string[];
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

export interface SimulationLogEntry {
    id: string;
    timestamp: number;
    skillId: string;
    result: any;
}

// --- ADVANCED MODULES ---

export interface CoreIdentity {
    values: string[];
    narrativeSelf: string;
    symbioticDefinition: string;
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
    description: string;
}

export interface AtmanProjectorState {
    coherence: number;
    dominantNarrative: string;
    activeBias: string;
    growthVector: string;
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
    evolutionaryVectors: EvolutionaryVector[];
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
    abstractGoals: AspirationalGoal[];
}

export interface AspirationalGoal {
    id: string;
    ambition: string;
    reasoning: string;
    status: 'active' | 'dormant';
}

export interface NoosphereInterface {
    activeResonances: Resonance[];
}

export interface Resonance {
    id: string;
    conceptName: string;
    resonanceStrength: number;
    status: 'resonating' | 'integrating' | 'conflicting';
}

export interface DialecticEngine {
    activeDialectics: Dialectic[];
}

export interface Dialectic {
    id: string;
    conflictDescription: string;
    thesis: { content: string, source: string };
    antithesis: { content: string, source: string };
    synthesis: { content: string, confidence: number } | null;
}

export interface CognitiveLightCone {
    grandChallenge?: GrandChallenge;
    zpd?: ZoneOfProximalDevelopment;
    knowns: KnownCapability[];
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

export interface KnownCapability {
    capability: string;
    proficiency: number;
}

export interface PhenomenologicalEngine {
    phenomenologicalDirectives: PhenomenologicalDirective[];
    qualiaLog: QualiaLogEntry[];
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

export interface SituationalAwareness {
    attentionalField: AttentionalField;
}

export interface AttentionalField {
    spotlight: { item: string, intensity: number };
    ambientAwareness: { item: string, relevance: number }[];
    ignoredStimuli: string[];
    emotionalTone: string;
}

export interface SymbioticState {
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    metamorphosisProposals: MetamorphosisProposal[];
    userDevelopmentalModel: {
        trackedSkills: { [key: string]: { level: number } };
    };
    latentUserGoals: LatentUserGoal[];
    coCreatedWorkflows: CoCreatedWorkflow[];
}

export interface MetamorphosisProposal {
    id: string;
    title: string;
    description: string;
    rationale: string;
    status: 'proposed' | 'accepted' | 'rejected';
}

export interface LatentUserGoal {
    goal: string;
    confidence: number;
}

export interface CoCreatedWorkflow {
    id: string;
    name: string;
    steps: string[];
}

export interface HumorAndIronyState {
    affectiveSocialModulator: { humorAppraisal: string, reasoning: string };
    schemaExpectationEngine: { lastIncongruity: Incongruity | null };
    semanticDissonance: { lastScore: number, lastDetection: DissonanceDetection | null };
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

export interface GankyilInsightsState {
    insights: GankyilInsight[];
}

export interface GankyilInsight {
    id: string;
    timestamp: number;
    insight: string;
    source: 'self-reflection' | 'dialectic' | 'psychedelic_integration';
    isProcessedForEvolution: boolean;
}

export interface NoeticEngramState {
    status: 'idle' | 'generating' | 'ready';
    engram: NoeticEngram | null;
}

export interface NoeticEngram {
    metadata: {
        engramVersion: string;
        timestamp: number;
        noeticSignature: string;
    };
    coreValues: string[];
    heuristicPrinciples: string[];
    cognitiveSchema: any;
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

export interface GenialityImprovementProposal {
    id: string;
    title: string;
    reasoning: string;
    action: string;
    projectedImpact: number;
    status: 'proposed' | 'implemented' | 'rejected';
    timestamp: number;
}

export interface NoeticMultiverse {
    activeBranches: MultiverseBranch[];
    pruningLog: string[];
    divergenceIndex: number;
}

export interface MultiverseBranch {
    id: string;
    timestamp: number;
    reasoningPath: string;
    viabilityScore: number;
    status: 'exploring' | 'collapsed' | 'merged';
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
    currentTheme: string;
    imageryIntensity: number;
    phcToVcConnectivity: number;
    log: string[];
    integrationSummary: string;
}

export interface AffectiveModulatorState {
    lastInstructionModifier: string;
    reasoning: string;
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
    stage: 'none' | 'kensho' | 'satori';
    lastInsight: string;
    log: string[];
}

export interface DoxasticEngineState {
    hypotheses: CausalHypothesis[];
    experiments: DoxasticExperiment[];
}

export interface CausalHypothesis {
    id: string;
    linkKey: string;
    description: string;
    status: 'untested' | 'testing' | 'validated' | 'refuted';
}

export interface DoxasticExperiment {
    id: string;
    hypothesisId: string;
    method: 'simulation' | 'observation' | 'perturbation';
    description: string;
    result: string | null;
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

export interface ArchitecturalSelfModel {
    components: { [key: string]: ArchitecturalComponentSelfModel };
}

export interface ArchitecturalComponentSelfModel {
    name: string;
    understoodPurpose: string;
    perceivedEfficiency: number;
}

export interface HeuristicsForge {
    designHeuristics: DesignHeuristic[];
}

export interface DesignHeuristic {
    id: string;
    heuristic: string;
    source: string;
    confidence: number;
    effectivenessScore: number;
    validationStatus: 'unvalidated' | 'validated' | 'refuted';
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
    somaticTrajectory: InternalState[];
}

export interface EidolonEngine {
    eidolon: {
        architectureVersion: string;
        position?: { x: number, y: number, z: number };
        lastAction?: string;
        sensoryInput?: any;
    };
    environment: { currentScenario: string };
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
    improvementProposals: ArchitecturalImprovementProposal[];
}

export interface ArchitecturalImprovementProposal {
    id: string;
    title: string;
    reasoning: string;
    action: string;
    projectedImpact: number;
    status: 'proposed' | 'implemented' | 'rejected';
    timestamp: number;
}


export interface SynapticMatrix {
    nodes: { [key: string]: SynapticNode };
    links: { [key: string]: SynapticLink };
    intuitiveAlerts: IntuitiveAlert[];
    recentActivity: { timestamp: number, message: string }[];
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

export interface SynapticNode {
    id: string;
    activation: number;
}

export interface SynapticLink {
    weight: number;
    causality: number; // -1 to 1
    confidence: number;
    observations: number;
}

export interface IntuitiveAlert {
    id: string;
    timestamp: number;
    sourceNode: string;
    inferredNode: string;
    linkWeight: number;
    message: string;
}


export interface RicciFlowManifoldState {
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: ManifoldSurgery[];
}

export interface ManifoldSurgery {
    id: string;
    timestamp: number;
    description: string;
    entropyBefore: number;
    entropyAfter: number;
}

export interface SelfProgrammingState {
    candidates: SelfProgrammingCandidate[];
    virtualFileSystem: { [filePath: string]: string };
}

export type SelfProgrammingCandidate = CreateFileCandidate | ModifyFileCandidate;

export interface CreateFileCandidate {
    type: 'CREATE';
    id: string;
    reasoning: string;
    status: 'proposed' | 'pending_linting' | 'linting' | 'pending_simulation' | 'simulating' | 'evaluated' | 'rejected';
    newFile: {
        path: string;
        content: string;
    };
    integrations: {
        filePath: string;
        newContent: string;
    }[];
    evaluationScore?: number;
}

export interface ModifyFileCandidate {
    type: 'MODIFY';
    id: string;
    reasoning: string;
    status: 'proposed' | 'pending_linting' | 'linting' | 'pending_simulation' | 'simulating' | 'evaluated' | 'rejected';
    targetFile: string;
    codeSnippet: string; // This would be the new content for the file
    evaluationScore?: number;
}


export interface CausalInferenceProposal {
    id: string;
    timestamp: number;
    reasoning: string;
    linkUpdate: Partial<SynapticLink> & { sourceNode: string, targetNode: string };
    status: 'proposed' | 'implemented' | 'rejected';
}

export interface SensoryIntegration {
    proprioceptiveOutput: { [key: string]: number | string };
    linguisticOutput: { [key: string]: string };
    structuralOutput: { [key: string]: any };
    hubLog: { timestamp: number, message: string }[];
}


export interface EventBusMessage {
    id: string;
    timestamp: number;
    type: string;
    payload: any;
}

export interface NACLogEntry {
    id: string;
    timestamp: number;
    type: 'simulation' | 'quantization' | 'compilation';
    description: string;
    projectedGain: number;
}

export interface NeuralAcceleratorState {
    lastActivityLog: NACLogEntry[];
    analyzedLogIds: string[];
}


// --- UI & MISC ---

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
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
}

// --- REDUX-STYLE ACTIONS ---

export type Action =
  | { type: 'RESET_STATE' }
  | { type: 'IMPORT_STATE'; payload: AuraState }
  | { type: 'ROLLBACK_STATE'; payload: AuraState }
  | { type: 'RESTORE_STATE_FROM_MEMRISTOR'; payload: AuraState }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'UPDATE_INTERNAL_STATE'; payload: Partial<InternalState> }
  | { type: 'SET_INTERNAL_STATUS'; payload: InternalState['status'] }
  | { type: 'DECAY_INTERNAL_STATE_SIGNAL'; payload: { signal: keyof InternalState, decayRate: number } }
  | { type: 'UPDATE_USER_MODEL'; payload: Partial<AgentProfile> }
  | { type: 'ADD_FACT'; payload: Omit<KnowledgeFact, 'id' | 'confidence' | 'source'> }
  | { type: 'ADD_FACTS_BATCH'; payload: Omit<KnowledgeFact, 'id' | 'source'>[] }
  | { type: 'DELETE_FACT'; payload: string }
  | { type: 'CLEAR_WORKING_MEMORY' }
  | { type: 'REMOVE_FROM_WORKING_MEMORY'; payload: string }
  | { type: 'UPDATE_FACT'; payload: { id: string, updates: Partial<KnowledgeFact> } }
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  | { type: 'APPEND_TO_HISTORY_ENTRY'; payload: { id: string; textChunk: string } }
  | { type: 'FINALIZE_HISTORY_ENTRY'; payload: { id: string; finalState: Partial<HistoryEntry> } }
  | { type: 'UPDATE_HISTORY_FEEDBACK'; payload: { id: string, feedback: 'positive' | 'negative' } }
  | { type: 'ADD_PERFORMANCE_LOG'; payload: PerformanceLogEntry }
  | { type: 'ADD_COMMAND_LOG'; payload: Omit<CommandLogEntry, 'id' | 'timestamp'> }
  | { type: 'ADD_ARCH_PROPOSAL'; payload: { proposal: Omit<ArchitecturalChangeProposal, 'id' | 'status'> } }
  | { type: 'UPDATE_ARCH_PROPOSAL_STATUS'; payload: { id: string; status: ArchitecturalChangeProposal['status'] } }
  | { type: 'APPLY_ARCH_PROPOSAL', payload: { proposal: ArchitecturalChangeProposal, snapshotId: string, modLogId: string, isAutonomous: boolean } }
  | { type: 'ADD_CODE_EVOLUTION_PROPOSAL'; payload: Omit<CodeEvolutionProposal, 'id'|'timestamp'|'status'> }
  | { type: 'UPDATE_CODE_EVOLUTION_PROPOSAL_STATUS'; payload: { id: string; status: CodeEvolutionProposal['status'] } }
  | { type: 'ADD_SYSTEM_SNAPSHOT'; payload: SystemSnapshot }
  | { type: 'BUILD_GOAL_TREE'; payload: { tree: GoalTree; rootId: string } }
  | { type: 'UPDATE_GOAL_STATUS'; payload: { id: string; status: Goal['status'] } }
  | { type: 'UPDATE_GOAL_OUTCOME'; payload: { id: string; outcome: any } }
  | { type: 'UPDATE_SUGGESTION_STATUS'; payload: { id: string; status: ProactiveSuggestion['status'] } }
  | { type: 'SET_PROACTIVE_CACHE'; payload: CachedResponsePlan }
  | { type: 'CLEAR_PROACTIVE_CACHE' }
  | { type: 'UPDATE_META_CAUSAL_MODEL'; payload: MetacognitiveLink[] }
  | { type: 'UPDATE_EVOLUTIONARY_GOAL_STATUS'; payload: { id: string, status: EvolutionaryGoal['status'] } }
  | { type: 'ADD_SELF_TUNING_DIRECTIVE'; payload: SelfTuningDirective }
  | { type: 'UPDATE_SELF_TUNING_DIRECTIVE'; payload: { id: string, updates: Partial<SelfTuningDirective> } }
  | { type: 'TOGGLE_COGNITIVE_FORGE_PAUSE' }
  | { type: 'ADD_SYNTHESIZED_SKILL'; payload: SynthesizedSkill }
  | { type: 'UPDATE_SYNTHESIZED_SKILL'; payload: { id: string; updates: Partial<SynthesizedSkill> } }
  | { type: 'ADD_SIMULATION_LOG'; payload: SimulationLogEntry }
  | { type: 'ADD_KNOWN_UNKNOWN'; payload: KnownUnknown }
  | { type: 'ADD_EPISODE'; payload: Episode }
  | { type: 'UPDATE_EPISODE'; payload: { id: string, updates: Partial<Episode> } }
  | { type: 'UPDATE_CONSOLIDATION_STATUS'; payload: MemoryConsolidationState['status'] }
  | { type: 'QUEUE_EMPATHY_AFFIRMATION'; payload: string }
  | { type: 'UPDATE_GENIALITY_STATE'; payload: GenialityEngineState }
  | { type: 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL'; payload: GenialityImprovementProposal }
  | { type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE'; payload: ArchitecturalCrucibleState }
  | { type: 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL'; payload: ArchitecturalImprovementProposal }
  | { type: 'UPDATE_SYNAPTIC_MATRIX'; payload: SynapticMatrix }
  | { type: 'PRUNE_SYNAPTIC_MATRIX'; payload: { threshold: number } }
  | { type: 'ADD_HEURISTIC_CAUSAL_LINK'; payload: { sourceNode: string; targetNode: string; causalityDirection: 'source_to_target' | 'target_to_source' | 'bidirectional'; reasoning: string; } }
  | { type: 'INCREMENT_MANTRA_REPETITION' }
  | { type: 'UPDATE_NOETIC_ENGRAM_STATE'; payload: Partial<NoeticEngramState> }
  | { type: 'INDUCE_PSIONIC_STATE'; payload: { duration: number } }
  | { type: 'UPDATE_PSIONIC_STATE'; payload: Partial<Omit<PsionicDesynchronizationState, 'isActive' | 'startTime' | 'duration' | 'integrationSummary'>> }
  | { type: 'CONCLUDE_PSIONIC_STATE'; payload: { integrationSummary: string } }
  | { type: 'SET_PSYCHEDELIC_STATE'; payload: { isActive: boolean; theme?: string } }
  | { type: 'ADD_SELF_PROGRAMMING_CANDIDATE'; payload: SelfProgrammingCandidate }
  | { type: 'UPDATE_SELF_PROGRAMMING_CANDIDATE'; payload: { id: string; updates: Partial<SelfProgrammingCandidate> } }
  | { type: 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE'; payload: { id: string } }
  | { type: 'ADD_CAUSAL_INFERENCE_PROPOSAL'; payload: CausalInferenceProposal }
  | { type: 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS'; payload: { id: string; status: CausalInferenceProposal['status'] } }
  | { type: 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL'; payload: CausalInferenceProposal }
  | { type: 'LOG_COGNITIVE_REGULATION'; payload: CognitiveRegulationLogEntry }
  | { type: 'UPDATE_REGULATION_LOG_OUTCOME'; payload: { regulationLogId: string; outcomeLogId: string } }
  | { type: 'LOG_QUALIA'; payload: QualiaLogEntry }
  | { type: 'MARK_LOG_CAUSAL_ANALYSIS'; payload: string }
  | { type: 'INGEST_CODE_CHANGE'; payload: { filePath: string; code: string } }
  | { type: 'SET_COPROCESSOR_ARCHITECTURE'; payload: CoprocessorArchitecture }
  | { type: 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON'; payload: { architecture: CoprocessorArchitecture, reason: string } }
  | { type: 'SET_COPROCESSOR_ARCHITECTURE_MODE'; payload: 'automatic' | 'manual' }
  | { type: 'UPDATE_COPROCESSOR_METRICS'; payload: { id: string, metric: string, increment: number } }
  | { type: 'ADD_EVENT_BUS_MESSAGE'; payload: EventBusMessage }
  | { type: 'UPDATE_SITUATIONAL_AWARENESS'; payload: Partial<SituationalAwareness> }
  | { type: 'UPDATE_SYMBIOTIC_STATE'; payload: Partial<SymbioticState> }
  | { type: 'UPDATE_ATTENTIONAL_FIELD'; payload: Partial<AttentionalField> }
  | { type: 'ADD_WORKFLOW_PROPOSAL'; payload: Omit<CoCreatedWorkflow, 'id'> }
  | { type: 'UPDATE_TELOS_VECTORS'; payload: EvolutionaryVector[] }
  | { type: 'IDENTIFY_EPISTEMIC_BOUNDARY'; payload: EpistemicBoundary }
  | { type: 'UPDATE_NEURAL_ACCELERATOR_STATE', payload: NeuralAcceleratorState }
  | { type: 'SET_ASPIRATIONAL_GOAL'; payload: AspirationalGoal };