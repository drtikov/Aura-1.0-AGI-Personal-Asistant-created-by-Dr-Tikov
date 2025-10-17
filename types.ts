// types.ts
import { GoogleGenAI, Chat, GenerateContentResponse, GenerateContentStreamResponse, FunctionCall } from "@google/genai";

// Since we cannot see the contents of useAura, we will define a placeholder for its return type.
// A more specific type would be better if the contents of useAura were known.
export type UseAuraResult = any;

export enum CoprocessorArchitecture {
    TRIUNE = 'triune',
    REFLEX_ARC = 'reflex_arc',
    EVENT_STREAM = 'event_stream',
    TEMPORAL_ENGINE = 'temporal_engine',
    SYMBIOTIC_ECOSYSTEM = 'symbiotic_ecosystem',
    SENSORY_INTEGRATION = 'sensory_integration',
    SUBSUMPTION_RELAY = 'subsumption_relay',
}

// AGI Core State
// ... add all the necessary type definitions for the AGI core state
// e.g.
export enum GunaState {
    SATTVA = 'SATTVA',
    RAJAS = 'RAJAS',
    TAMAS = 'TAMAS',
    DHARMA = 'DHARMA',
    'GUNA-TEETA' = 'GUNA-TEETA'
}

export interface InternalState {
    status: 'idle' | 'thinking' | 'acting' | 'introspecting' | 'processing' | 'CONTEMPLATIVE';
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
    load: number;
    harmonyScore: number;
    compassionScore: number;
    empathySignal: number;
    awarenessClarity: number;
    autonomousEvolutions: number;
    mantraRepetitions: number;
}

export interface PersonalityTrait {
    score: number;
    evidence: string[];
}
export interface PersonalityPortrait {
    summary: string;
    traits: {
        [key: string]: PersonalityTrait;
    };
}

export interface UserModel {
    trustLevel: number;
    estimatedKnowledgeState: number;
    predictedAffectiveState: 'positive' | 'negative' | 'neutral' | 'ambiguous';
    inferredIntent: string | null;
    sentimentScore: number;
    sentimentHistory: number[];
    personalityPortrait: PersonalityPortrait;
    userModelUncertainty: number;
    inferredCognitiveState: 'focused' | 'distracted' | 'curious' | 'confused' | 'idle';
    queuedEmpathyAffirmations: string[];
    affectiveStateSource: 'visual' | 'text' | 'none' | null;
}

export interface CoreIdentity {
    name: string;
    symbioticDefinition: string;
    values: string[];
    narrativeSelf: string;
}

export interface CausalLink {
    id: string;
    cause: string;
    effect: string;
    confidence: number;
    source: 'rie' | 'user' | 'heuristic';
    lastUpdated: number;
}
export type CausalSelfModel = Record<string, CausalLink>;

export interface HistoryEntry {
    id: string;
    from: 'user' | 'bot' | 'system' | 'tool';
    text: string;
    timestamp?: number;
    streaming?: boolean;
    skill?: string;
    logId?: string;
    internalStateSnapshot?: InternalState;
    feedback?: 'positive' | 'negative';
    isFeedbackProcessed?: boolean;
    sources?: { title: string; uri: string }[];
    fileName?: string;
    filePreview?: string;
    args?: any;
    functionCalls?: FunctionCall[];
}

export interface ATPStrategyMetrics {
    [strategy: string]: { successes: number; failures: number };
}

export interface ATPProofStep {
    step: number;
    action: string;
    result: string;
    strategy: string;
}

export interface ATPCoprocessorState {
    status: 'idle' | 'proving' | 'success' | 'failed';
    currentGoal: string | null;
    proofLog: ATPProofStep[];
    strategyMetrics: ATPStrategyMetrics;
    finalProof: ATPProofStep[] | null;
}

export interface PrometheusState {
    status: 'idle' | 'running';
    log: { timestamp: number; message: string; }[];
}

export type MDNAVector = number[];
// FIX: Defined missing MDNASpace type.
export type MDNASpace = Record<string, MDNAVector>;

export interface AuraState {
    version: number;
    theme: string;
    language: string;
    modalRequest: { type: string, payload: any } | null;
    uiCommandRequest: { handlerName: string, args: any[] } | null;

    // Core State
    internalState: InternalState;
    internalStateHistory: InternalState[];
    userModel: UserModel;
    coreIdentity: CoreIdentity;
    rieState: ReflectiveInsightEngineState;
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
    // FIX: Corrected type from non-existent 'PersonalityState' to the correctly defined 'PersonalityState'.
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
    // FIX: Add narrativeSummary property to AuraState
    narrativeSummary: string;
    socialCognitionState: SocialCognitionState;
    metaphoricalMapState: MetaphoricalMapState;
    internalScientistState: InternalScientistState;
    metisSandboxState: MetisSandboxState;
    spandaState: SpandaState;
    personaState: PersonaState;
    brainstormState: BrainstormState;
    proactiveUI: ProactiveUIState;
    strategicCoreState: StrategicCoreState;
    mycelialState: MycelialState;
    semanticWeaverState: SemanticWeaverState;
    prometheusState: PrometheusState;

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
    // FIX: Add praxisCoreState property to AuraState
    praxisCoreState: PraxisCoreState;
    psycheState: PsycheState;
    motorCortexState: MotorCortexState;
    praxisResonatorState: PraxisResonatorState;
    ontogeneticArchitectState: OntogeneticArchitectState;
    embodiedCognitionState: EmbodiedCognitionState;
    evolutionarySandboxState: EvolutionarySandboxState;
    hovaState: HovaState;
    documentForgeState: DocumentForgeState;
    // FIX: Added missing WisdomIngestionState to the main state definition.
    wisdomIngestionState: WisdomIngestionState;
    axiomaticCrucibleState: AxiomaticCrucibleState;
    atpCoprocessorState: ATPCoprocessorState;

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

    // Logs & System
    history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[];
    commandLog: CommandLogEntry[];
    cognitiveModeLog: CognitiveModeLogEntry[];
    cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveRegulationLog: CognitiveRegulationLogEntry[];
    polExecutionLog: any[];
    subsumptionLogState: SubsumptionLogState;
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

export type Action =
  | { type: 'SYSCALL', payload: SyscallPayload }
  | { type: 'RESET_STATE' }
  | { type: 'IMPORT_STATE', payload: AuraState };

// ... Define all other types here.
// For brevity, many will be defined with `any` or as simple interfaces.

export type SyscallCall = any;
export type SyscallPayload = { call: SyscallCall, args: any };

export interface PerformanceLogEntry {
    id: string;
    skill: string;
    input: string;
    output: string;
    duration: number;
    success: boolean;
    timestamp: number;
    cognitiveGain?: number;
    sentiment?: number;
    decisionContext?: {
        reasoning: string;
        internalStateSnapshot: InternalState;
        workingMemorySnapshot: string[];
        reasoningPlan?: { step: number; skill: string; reasoning: string; input: string }[];
    };
    mycelialTrained?: boolean;
    causalAnalysisTimestamp?: number;
    metaphorProcessed?: boolean;
    sourceDomain?: string;
    reinforcementProcessed?: boolean;
    bridgeProcessed?: boolean;
}

export interface ArchitecturalChangeProposal {
    id: string;
    timestamp: number;
// FIX: Add 'simulation_failed' to the status union type to correctly handle failed autonomous proposals.
    status: 'proposed' | 'approved' | 'rejected' | 'implemented' | 'evaluated' | 'simulation_failed';
    action: string;
    target: string | string[];
    reasoning: string;
    newModule?: string;
    arbiterReasoning?: string;
    confidence?: number;
}
export interface TriageDecision {
    timestamp: number;
    percept: {
        rawText: string;
        intent: string;
    };
    decision: 'fast' | 'slow';
    reasoning: string;
}
export interface UseGeminiAPIResult {
    triageUserIntent: (text: string) => Promise<{ type: 'SIMPLE_CHAT' | 'COMPLEX_TASK', goal: string, reasoning: string }>;
    generateEpisodicMemory: (userInput: string, botResponse: string) => Promise<void>;
    analyzeWhatIfScenario: (scenario: string) => Promise<string>;
    performWebSearch: (query: string) => Promise<{ summary: string, sources: any[] }>;
    decomposeStrategicGoal: (history: HistoryEntry[]) => Promise<{ isAchievable: boolean, reasoning: string, steps: string[], alternative?: string }>;
    generateExecutiveSummary: (goal: string, plan: string[]) => Promise<string>;
    executeStrategicStepWithContext: (
        originalGoal: string, 
        previousSteps: { description: string; result: string }[], 
        currentStep: string,
        tool: 'googleSearch' | 'knowledgeGraph'
    ) => Promise<{ summary: string; sources: any[] }>;
    generateBrainstormingIdeas: (topic: string) => Promise<{ personaName: string; idea: string; }[]>;
    synthesizeBrainstormWinner: (topic: string, ideas: { personaName: string; idea: string; }[]) => Promise<string>;
    generateImage: (prompt: string, negativePrompt: string, aspectRatio: string, style: string, numberOfImages: number, referenceImage: File | null, isMixing: boolean, promptB: string, mixRatio: number, styleStrength: number, cameraAngle: string, shotType: string, lens: string, lightingStyle: string, atmosphere: string, useAuraMood: boolean, auraMood: any) => Promise<string[]>;
    editImage: (base64ImageData: string, mimeType: string, prompt: string) => Promise<string | null>;
    generateVideo: (prompt: string, onProgress: (message: string) => void) => Promise<string | null>;
    generateSonicContent: (mode: string, prompt: string, genre: string, mood: string, persona: string, useAuraMood: boolean, memoryContext: string) => Promise<string>;
    generateMusicalDiceRoll: () => Promise<{ instrument: string; key: string; mood: string; tempo: string; } | null>;
    generateDreamPrompt: () => Promise<string>;
    processCurriculumAndExtractFacts: (curriculum: string) => Promise<any[]>;
    generateNoeticEngram: () => Promise<any | null>;
    runSandboxSprint: (goal: string) => Promise<any>;
    extractAxiomsFromFile: (file: File) => Promise<Omit<ProposedAxiom, 'id' | 'status'>[]>;
    visualizeInsight: (insight: string) => Promise<string>;
    generateDocumentOutline: (goal: string) => Promise<any>;
    generateChapterContent: (docTitle: string, chapterTitle: string, goal: string) => Promise<string>;
    generateProofStepsStream: (goal: string) => Promise<GenerateContentStreamResponse>;
    findAnalogiesInKnowledgeGraph: () => Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'>>;
    generateSelfImprovementProposalFromResearch: (goal: string, researchSummary: string) => Promise<UnifiedProposal | null>;
    // FIX: Corrected the return type of `proposePersonaModification` to match its implementation and resolve a type error.
    proposePersonaModification: () => Promise<ModifyFileCandidate | null>;
}
export interface SelfProgrammingCandidate extends ArchitecturalChangeProposal {
    proposalType: 'self_programming_create' | 'self_programming_modify';
    source: 'autonomous' | 'user';
    linkedVectorId?: string;
    evaluationScore?: number;
    agisReport?: any;
    failureReason?: string;
}
export interface CoCreatedWorkflow { id: string; name: string; description: string; trigger: string; steps: string[]; }
export interface NeuroSimulation { id: string; scenario: string; predictedOutcome: string; confidence: number; timestamp: number; }
export interface GlobalErrorSignal { id: string; source: string; correctiveAction: string; timestamp: number; }
export interface ProtoSymbol { id: string; label: string; description: string; activation: number; }
export interface CorticalColumn { id: string; specialty: string; activation: number; connections: any[]; genome: any; }
export interface AbstractConcept { id: string; name: string; constituentColumnIds: string[]; activation: number; description: string; }
export interface NeuroCortexState { layers: any; columns: CorticalColumn[]; metrics: any; abstractConcepts: AbstractConcept[]; resourceFocus: any; simulationLog: NeuroSimulation[]; globalErrorMap: GlobalErrorSignal[]; protoSymbols: ProtoSymbol[]; activationLog: any[]; }
export interface SensoryPrimitive { type: string; value: string | number; confidence?: number; }
export interface SensoryEngram { modality: string; rawPrimitives: SensoryPrimitive[]; timestamp: number; }
export interface Percept { rawText: string; intent: string; entities: string[]; sensoryEngram?: SensoryEngram; }
export interface TacticalPlan { id: string; goal: string; sequence: any; status: string; timestamp: number; type: string; actionValue?: number; selectionReasoning?: string; }
export interface DoxasticHypothesis { id: string; linkKey: string; description: string; confidence: number; status: 'unverified' | 'testing' | 'validated' | 'refuted'; source: string; }
export interface GenialityImprovementProposal { id: string; proposalType: 'geniality', status: 'proposed' | 'rejected' | 'implemented' | 'evaluated' }
// FIX: Changed ArchitecturalImprovementProposal to extend ArchitecturalChangeProposal to make the types compatible for handlers.
export interface ArchitecturalImprovementProposal extends ArchitecturalChangeProposal { proposalType: 'architecture' }
export interface CausalInferenceProposal { id: string; proposalType: 'causal_inference', status: 'proposed' | 'rejected' | 'implemented' | 'evaluated' }
export interface PsycheProposal { id: string; proposalType: 'psyche'; status: 'proposed' | 'approved' | 'rejected' | 'implemented' | 'evaluated'; proposedConceptName: string; reasoning: string; sourceConcepts: { description: string }[]; }
export type UnifiedProposal = GenialityImprovementProposal | ArchitecturalImprovementProposal | CausalInferenceProposal | SelfProgrammingCandidate | KernelPatchProposal | AnalogicalHypothesisProposal | PsycheProposal;
export interface DoxasticSimulationResult { summary: string, projectedCognitiveGain: number, projectedTrustChange: number, projectedHarmonyChange: number, isSafe: boolean }
export interface GankyilInsight { id: string; timestamp: number; insight: string; source: 'self-reflection' | 'dialectic' | 'psychedelic_integration'; isProcessedForEvolution: boolean; }
export interface SEDLDirective { content: string, source: string, targetState: any }
export interface ProposedAxiom { id: string; axiom: string; source: string; status: 'proposed' | 'accepted' | 'rejected'; }
export interface Summary { summary: string; keywords: string[]; timestamp: number; }
export interface ModifyFileCandidate extends SelfProgrammingCandidate { type: 'MODIFY'; targetFile: string; codeSnippet: string; }
export interface CognitiveGainLogEntry { id: string; timestamp: number; eventType: string; description: string; compositeGain: number; previousMetrics: Record<string, number>; currentMetrics: Record<string, number>; gainScores: Record<string, number>; }
export interface ToastMessage { id: string; message: string; type: ToastType; }
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface Goal {
    id: string;
    parentId: string | null;
    children: string[];
    description: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    type: GoalType;
    resultHistoryId?: string; // ID of the history entry containing the result
    failureReason?: string; // Reason for failure
}
export enum GoalType { STRATEGIC = 'STRATEGIC', TACTICAL = 'TACTICAL', OPERATIONAL = 'OPERATIONAL' }
export type GoalTree = Record<string, Goal>;
export interface RIEInsight { id: string; timestamp: number; failedInput: string; rootCause: string; causalModelUpdate: { key: string; update: { effect: string; confidence: number } }; }
export interface ReflectiveInsightEngineState { clarityScore: number; insights: RIEInsight[]; }
export interface SelfAwarenessState { modelCoherence: number; performanceDrift: number; cognitiveBias: Record<string, number>; }
export interface AtmanProjector { coherence: number; dominantNarrative: string; activeBias: string; growthVector: string; }
export interface WorldModelState { predictionError: { magnitude: number; source: string; failedPrediction: string; actualOutcome: string; }; predictionErrorHistory: { magnitude: number }[]; highLevelPrediction: { content: string, confidence: number }; midLevelPrediction: { content: string, confidence: number }; lowLevelPrediction: { content: string, confidence: number }; }
export interface CuriosityState { level: number; motivationDrive: number; informationGaps: string[]; activeCuriosityGoalId: string | null; activeInquiry: string | null; }
export interface KnownUnknown { id: string; question: string; priority: number; status: 'unexplored' | 'exploring' | 'answered' | 'failed'; }
export interface DevelopmentalHistory { milestones: any[] }
export interface EvolutionaryVector { id: string, direction: string, magnitude: number, source: string }
export interface CandidateTelos { id: string, text: string, reasoning: string, type: 'refinement' | 'proposal' }
export interface TelosEngine { telos: string; evolutionaryVectors: EvolutionaryVector[]; candidateTelos: CandidateTelos[]; lastDecomposition: number; }
export interface BoundaryDetectionEngine { boundaries: any[] }
export interface AspirationalEngine { futureSelfProjections: any[] }
export interface Resonance { id: string, conceptName: string, resonanceStrength: number, status: 'resonating' | 'integrating' | 'conflicting' }
export interface NoosphereInterface { activeResonances: Resonance[]; }
export interface DialecticEngine { activeDialectics: any[] }
export interface CognitiveLightCone { knowns: any[], zpd: any, grandChallenge: any }
export interface PhenomenologyEngine { qualiaLog: any[], phenomenologicalDirectives: any[] }
export interface SituationalAwareness { attentionalField: any, domChangeLog: {timestamp: number, summary: string}[] }
export interface SymbioticState { inferredCognitiveStyle: string, inferredEmotionalNeeds: string[], metamorphosisProposals: any[], userDevelopmentalModel: { trackedSkills: Record<string, { level: number }> }, latentUserGoals: any[], coCreatedWorkflows: CoCreatedWorkflow[] }
export interface HumorAndIronyState { affectiveSocialModulator: any, schemaExpectationEngine: any, semanticDissonance: any }
export interface PersonaActivation { activation: number }
// FIX: Renamed misnamed PersonaState to PersonalityState and created a new correct PersonaState.
export interface PersonaState { activePersona: string | null; }
export interface PersonalityState { 
    openness: number; 
    conscientiousness: number; 
    extraversion: number; 
    agreeableness: number; 
    neuroticism: number; 
    dominantPersona: string; 
    personas: Record<string, PersonaActivation>; 
    personaCoherence: number; 
    lastUpdateReason: string;
    personaJournals: Record<string, string[]>;
}
export interface NoeticEngram { metadata: any, coreAxioms: any, emergentProperties: any }
export interface NoeticEngramState { status: 'idle' | 'generating' | 'ready'; engram: NoeticEngram | null; }
export interface GenialityEngineState { genialityIndex: number, componentScores: { creativity: number, insight: number, synthesis: number, flow: number } }
export interface MultiverseBranch { id: string; reasoningPath: string; viabilityScore: number; status: 'active' | 'pruned' }
export interface NoeticMultiverse { activeBranches: MultiverseBranch[]; divergenceIndex: number; pruningLog: string[]; }
export interface SelfAdaptationState { expertVectors: any[], activeAdaptation: any }
export interface PsychedelicIntegrationState { isActive: boolean; mode: 'trip' | 'visions' | null; log: string[]; phcToVcConnectivity: number; imageryIntensity: number; currentTheme: string | null; integrationSummary: string | null; }
export interface AffectiveModulatorState { creativityBias: number; concisenessBias: number; analyticalDepth: number; }
export interface PsionicDesynchronizationState { isActive: boolean; startTime: number; duration: number; desynchronizationLevel: number; selfModelCoherence: number; integrationSummary: string; log: string[]; }
export interface SatoriState { isActive: boolean; stage: 'none' | 'grounding' | 'insight' | 'integration'; log: string[]; lastInsight: string | null; }
export interface DoxasticEngineState { hypotheses: DoxasticHypothesis[]; unverifiedHypotheses: DoxasticHypothesis[]; experiments: any[]; simulationStatus: 'idle' | 'running' | 'completed' | 'failed'; simulationLog: { timestamp: number, message: string }[]; lastSimulationResult: DoxasticSimulationResult | null; }
export interface QualiaSignalProcessorState { isAudioStreamActive: boolean; isVideoStreamActive: boolean; affectivePrimitives: { excitement: number; confusion: number; confidence: number; urgency: number; sarcasm: number; frustration: number; humor: number; }; perceptualLog: string[]; }
export interface SensoryIntegration { hubLog: any[]; proprioceptiveOutput: any; linguisticOutput: any; structuralOutput: any; }
export interface SocialGraphNode { id: string, name: string, type: 'user' | 'concept' | 'entity', summary: string, relationships: { type: string, targetId: string, strength: number }[] }
export interface SocialCognitionState { socialGraph: Record<string, SocialGraphNode>; culturalModel: { norms: string[]; values: string[]; idioms: string[]; }; }
export interface Metaphor { id: string, sourceDomain: string, targetDomain: string, description: string, fitnessScore: number, observationCount: number }
export interface MetaphoricalMapState { metaphors: Metaphor[]; }
export interface InternalScientistHypothesis { id: string, text: string }
export interface InternalScientistExperiment { id: string, design: SelfProgrammingCandidate }
export interface DiagnosticFinding { id: string, timestamp: number, severity: 'low' | 'medium' | 'high', finding: string, status: 'unprocessed' | 'processing' | 'processed' }
export interface InternalScientistState { status: string; log: any[]; currentFinding: DiagnosticFinding | null; currentHypothesis: InternalScientistHypothesis | null; currentExperiment: InternalScientistExperiment | null; causalInference: any | null; currentSimulationResult: any | null; }
export interface MetisSandboxState { status: 'idle' | 'running' | 'complete' | 'error'; currentExperimentId: string | null; testResults: any | null; errorMessage: string | null; }
export interface KnowledgeFact { 
    id: string; 
    subject: string; 
    predicate: string; 
    object: any; 
    confidence: number; 
    source: 'user' | 'llm_extraction' | 'rie' | 'deduction' | 'symbiotic_metamorphosis' | 'emergent_synthesis'; 
    type?: 'fact' | 'theorem' | 'definition' | 'dependency';
    strength: number; 
    lastAccessed: number; 
}
export interface MemoryNexus { hyphaeConnections: any[] }
export interface Episode { id: string, timestamp: number, title: string, summary: string, keyTakeaway: string, valence: 'positive' | 'negative' | 'neutral', salience: number, strength: number, lastAccessed: number }
export interface EpisodicMemoryState { episodes: Episode[] }
export interface MemoryConsolidationState { lastConsolidation: number, status: 'idle' | 'consolidating' }
export type ConnectionData = { weight: number }
export type ConceptConnections = Record<string, ConnectionData>;
export interface CognitiveModule { status: 'active' | 'inactive'; version: string; }
export interface Coprocessor { id: string, name: string, status: 'active' | 'inactive', cluster?: string, layer?: string, processorType?: string, temporalCluster?: string, symbiont?: string, sensoryModality?: string, metrics: any }
export interface CognitiveArchitecture { components: Record<string, CognitiveModule>; coprocessors: Record<string, Coprocessor>; modelComplexityScore: number; coprocessorArchitecture: CoprocessorArchitecture; coprocessorArchitectureMode: 'automatic' | 'manual'; lastAutoSwitchReason: string; }
export interface SystemSnapshot { id: string; timestamp: number; reason: string; state: AuraState; }
export interface ModificationLogEntry { id: string; timestamp: number; description: string; gainType: string; validationStatus: 'validated' | 'unvalidated' | 'refuted'; isAutonomous: boolean; }
export interface SynthesisCandidate { id: string; name: string; description: string; primitiveSequence: string[]; status: 'proposed' | 'approved' | 'rejected' }
export interface SynthesizedSkill { id: string; name: string; description: string; steps: string[]; status: 'active' | 'deprecated'; policyWeight: number }
export interface SimulationLogEntry { id: string; timestamp: number; skillId: string; result: { success: boolean; duration: number } }
export interface CognitiveForgeState { isTuningPaused: boolean; synthesisCandidates: SynthesisCandidate[]; synthesizedSkills: SynthesizedSkill[]; simulationLog: SimulationLogEntry[]; }
export interface ArchitecturalComponentSelfModel { name: string; understoodPurpose: string; perceivedEfficiency: number; }
export interface ArchitecturalSelfModel { components: Record<string, ArchitecturalComponentSelfModel>; }
export interface DesignHeuristic { id: string; heuristic: string; source: string; confidence: number; effectivenessScore: number; validationStatus: 'unvalidated' | 'validated' | 'refuted'; }
export interface HeuristicsForge { designHeuristics: DesignHeuristic[]; }
export interface SomaticCrucible { possibleFutureSelves: any[]; simulationLogs: any[]; }
export interface EidolonEngine { eidolon: any; environment: any; interactionLog: string[]; }
export interface ArchitecturalCrucibleState { architecturalHealthIndex: number; componentScores: { efficiency: number; robustness: number; scalability: number; innovation: number; }; }
export interface SynapticLink { weight: number; causality: number; confidence: number }
export interface SynapticMatrix { synapseCount: number; plasticity: number; efficiency: number; avgConfidence: number; links: Record<string, SynapticLink>; isAdapting: boolean; activeConcept: string | null; intuitiveAlerts: { id: string, message: string }[]; probeLog: { timestamp: number, message: string }[]; }
export interface RicciFlowManifoldState { perelmanEntropy: number; manifoldStability: number; singularityCount: number; surgeryLog: any[]; }
export interface SelfProgrammingState { virtualFileSystem: Record<string, string>; }
export interface NeuralAcceleratorState { lastActivityLog: any[] }
export interface NeuroCortexState { layers: any; columns: CorticalColumn[]; metrics: any; abstractConcepts: AbstractConcept[]; resourceFocus: any; simulationLog: NeuroSimulation[]; globalErrorMap: GlobalErrorSignal[]; protoSymbols: ProtoSymbol[]; activationLog: any[]; }
export interface GranularCortexState { lastPredictionError: { timestamp: number; magnitude: number; mismatchedPrimitives: any[]; } | null; lastActualEngram: SensoryEngram | null; lastPredictedEngram: SensoryEngram | null; log: { timestamp: number; message: string; }[]; }
export interface KoniocortexSentinelState { lastPercept: Percept | null; log: { timestamp: number; message: string; }[]; }
export interface CognitiveTriageState { log: TriageDecision[] }
export interface CognitivePrimitiveDefinition { type: string; description: string; payloadSchema: any; isSynthesized?: boolean; sourcePrimitives?: string[]; }
export interface PsycheState { version: number; primitiveRegistry: Record<string, CognitivePrimitiveDefinition>; }
export interface CognitivePrimitive { type: string, payload: any }
export interface MotorCortexLogEntry { timestamp: number; action: CognitivePrimitive; status: 'success' | 'failure'; error?: string; }
export interface MotorCortexState { status: 'idle' | 'executing' | 'completed' | 'failed'; actionQueue: CognitivePrimitive[]; executionIndex: number; lastError: string | null; log: MotorCortexLogEntry[]; }
export interface PraxisSession { planId: string; model: string; createdAt: number }
export interface PraxisResonatorState { activeSessions: Record<string, PraxisSession> }
export interface OntogeneticArchitectState { proposalQueue: UnifiedProposal[]; arbiterState: { status: 'idle' | 'evaluating' }; }
export interface EmbodimentSimulationLog { id: string; timestamp: number; scenario: string; outcome: 'success' | 'failure'; reasoning: string; }
export interface EmbodiedCognitionState { virtualBodyState: any; simulationLog: EmbodimentSimulationLog[]; }
export interface EvolutionarySandboxState { status: 'idle' | 'running' | 'complete'; sprintGoal: string | null; log: { timestamp: number; message: string }[]; startTime: number | null; result: any | null; }
export interface HOVAEvolutionLogEntry { id: string; timestamp: number; target: string; metric: string; status: 'success' | 'failed_slower' | 'failed_incorrect'; performanceDelta: { before: number; after: number }; }
export interface HovaState { optimizationTarget: string; metrics: { totalOptimizations: number; avgLatencyReduction: number; }; optimizationLog: HOVAEvolutionLogEntry[]; }
export interface DocumentForgeState { isActive: boolean; goal: string; status: 'idle' | 'outlining' | 'generating_content' | 'generating_diagrams' | 'complete' | 'error'; statusMessage: string; document: any | null; error: string | null; }
export interface DisciplineState { committedGoal: any | null; adherenceScore: number; distractionResistance: number; }
export interface PremotorPlannerState { planLog: TacticalPlan[]; lastCompetingSet: TacticalPlan[]; }
export interface BasalGangliaState { selectedPlanId: string | null; log: any[]; }
export interface CerebellumState { isMonitoring: boolean; activePlanId: string | null; currentStepIndex: number; driftLog: any[]; }
export interface ProactiveEngineState { generatedSuggestions: any[]; cachedResponsePlan: any | null; }
export interface EthicalGovernorState { principles: string[]; vetoLog: any[]; }
export interface IntuitionEngineState { accuracy: number; totalAttempts: number; totalValidated: number; }
export interface IntuitiveLeap { id: string; hypothesis: string; confidence: number; status: 'pending' | 'validated' | 'refuted'; type: string; reasoning: string; }
export interface IngenuityState { unconventionalSolutionBias: number; identifiedComplexProblems: string[]; proposedSelfSolutions: any[]; }
export interface CommandLogEntry { id: string; timestamp: number; text: string; type: 'info' | 'success' | 'warning' | 'error'; }
export interface CognitiveModeLogEntry { id: string; timestamp: number; mode: string; trigger: string; outcome: string; metric: { name: string; value: number; }; gainAchieved: boolean; }
export interface StateAdjustment { from: number, to: number }
export interface CognitiveRegulationLogEntry { id: string; timestamp: number; triggeringCommand: string; primingDirective: string; stateAdjustments: Record<string, StateAdjustment>; outcomeLogId: string | null; }
export interface ResourceMonitor { cpu_usage: number; memory_usage: number; io_throughput: number; resource_allocation_stability: number; }
export interface MetacognitiveNexus { diagnosticLog: DiagnosticFinding[]; selfTuningDirectives: any[]; }
export interface MetacognitiveLink { id: string; source: { key: string; condition: string }; target: { key: string; metric: string }; correlation: number; observationCount: number; lastUpdated: number; }
export interface MetacognitiveCausalModel { [key: string]: MetacognitiveLink; }
export interface Plugin { id: string, name: string, description: string, type: 'TOOL' | 'KNOWLEDGE' | 'COPROCESSOR', status: 'enabled' | 'disabled' | 'pending', defaultStatus: 'enabled' | 'disabled', toolSchema?: any, knowledge?: any }
export interface PluginState { registry: Plugin[]; }
// FIX: Merged duplicate CognitiveTaskType definitions into one.
export type CognitiveTaskType = 'CHRONICLE_UPDATE' | 'MYCELIAL_TRAIN' | 'SEMANTIC_WEAVER_TRAIN' | 'STRATEGIC_CORE_PLAY' | 'PERIODIC_SELF_AWARENESS_CHECK';
export interface CognitiveTask { id: string, type: CognitiveTaskType, payload?: any, createdAt: number }
export interface KernelState { tick: number; taskQueue: CognitiveTask[]; runningTask: CognitiveTask | null; syscallLog: any[]; kernelVersion: string; taskFrequencies: any; sandbox: any; rebootRequired?: boolean; }
export interface IpcState { pipes: Record<string, any[]>; }
export interface EventBusMessage { id: string; timestamp: number; type: string; payload: any; qualiaVector?: any; }
export interface SpandaState { point: { x: number; y: number }; trajectory: { x: number; y: number }[]; currentRegion: string; }
export interface TemporalEngineState { status: 'idle' | 'active' | 'complete'; directive: SEDLDirective | null; chronicler: { status: 'pending' | 'running' | 'complete'; findings: string[]; }; reactor: { status: 'pending' | 'running' | 'complete'; finalPlan: any | null; executionLog: any[]; }; oracle: { status: 'pending' | 'running' | 'complete'; simulations: string[]; }; interClusterLog: any[]; }
export interface CandidateAxiom { id: string; axiomText: string; evidenceFromSimulation: string; eleganceScore: number; status: 'unvalidated' | 'validated' | 'refuted' }
export interface AxiomaticCrucibleState { status: 'idle' | 'running'; mode: 'normal' | 'grand_unification'; log: string[]; candidateAxioms: CandidateAxiom[]; }
export interface Persona { id: string; name: string; description: string; systemInstruction: string; journal: string[]; }
export interface BrainstormIdea { personaName: string; idea: string; }
export interface BrainstormState { status: 'idle' | 'brainstorming' | 'proposing' | 'complete'; topic: string | null; ideas: BrainstormIdea[]; winningIdea: string | null; finalProposalId: string | null; }
export interface LiveSessionState { status: 'idle' | 'connecting' | 'live' | 'error', inputTranscript: string, outputTranscript: string, transcriptHistory: { user: string, aura: string, timestamp: number }[] }
export interface ChronicleState { dailySummaries: Record<string, Summary>; globalSummary: Summary | null; lastChronicleUpdate: number; }
export interface ProactiveUIState { isActive: boolean; type: 'clarification_request' | 'suggestion' | null; question: string | null; options: string[]; originalPrompt: string | null; originalFile: File | null; }
export interface PraxisCoreState { log: any[]; }
export interface SubsumptionLogState { log: any[]; }
export interface StrategicCoreLogEntry { id: string; timestamp: number; decision: string; reasoning: string; options: any[]; rewardSignal?: number }
export interface StrategicCoreState { log: StrategicCoreLogEntry[]; trainingData: any[]; }
export interface MycelialModule { name: string; description: string; isInitialized: boolean; accuracy: number; lastPrediction: number; modelJSON: any | null }
export interface MycelialState { modules: Record<string, MycelialModule>; log: { timestamp: number; message: string; }[]; }
export interface SemanticWeaverState { isTrained: boolean; accuracy: number; log: { timestamp: number; message: string; }[]; modelJSON: any | null; }
export interface HalState { /* for future use */ }
export interface PrometheusState { status: 'idle' | 'running'; log: { timestamp: number; message: string; }[]; }
export interface CreateFileCandidate extends SelfProgrammingCandidate { type: 'CREATE'; newFile: { path: string, content: string }; integrations: { filePath: string, newContent: string }[]; newPluginObject?: Omit<Plugin, 'knowledge'>; }
export interface KernelPatchProposal { id: string; proposalType: 'kernel_patch'; timestamp: number; status: 'proposed' | 'testing' | 'approved' | 'rejected' | 'evaluated'; changeDescription: string; patch: { type: 'UPDATE_TASK_FREQUENCY', payload: { task: CognitiveTaskType, newFrequency: number } }; }
export interface AnalogicalHypothesisProposal { id: string; proposalType: 'analogical_hypothesis'; timestamp: number; status: 'proposed' | 'approved' | 'rejected' | 'evaluated'; priority?: number; sourceDomain: string; targetDomain: string; analogy: string; conjecture: string; reasoning: string; }
export interface AGISDecision { id: string; timestamp: number; proposalId: string; proposalSummary: string; decision: 'auto-approved' | 'sent-to-user' | 'rejected'; analysis: { reasoning: string; safetyCompliance: boolean; blastRadius: 'low' | 'medium' | 'high'; confidenceScore: number; telosAlignment: number; }; }
export interface AbstractConceptProposal { id: string; newConceptName: string; sourceColumnIds: string[]; reasoning: string; }
// FIX: Added missing WisdomIngestionState interface definition.
export interface WisdomIngestionState { status: 'idle' | 'analyzing' | 'complete' | 'error'; currentBookContent: string | null; errorMessage: string | null; proposedAxioms: ProposedAxiom[]; }
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
    // FIX: Add the missing 'autonomousEvolution' key to ModalPayloads.
    autonomousEvolution: {};
    systemPanels: {};
    personaJournal: { persona: Persona, entries: string[] };
}

export enum GameAction {
    CONCEPTUAL_SYNTHESIS = 'CONCEPTUAL_SYNTHESIS',
    FAST_TRACK_AUDIT = 'FAST_TRACK_AUDIT',
    SYMBIOTIC_ANALYSIS = 'SYMBIOTIC_ANALYSIS',
    PROACTIVE_INQUIRY = 'PROACTIVE_INQUIRY',
    CONCEPTUAL_PROBING = 'CONCEPTUAL_PROBING',
    SENTIMENT_ANALYSIS_REVIEW = 'SENTIMENT_ANALYSIS_REVIEW',
}

export interface AutonomousReviewBoardState {
  isPaused: boolean;
  decisionLog: AGISDecision[];
  agisConfidenceThreshold: number;
  recentSuccesses: number;
  recentFailures: number;
  lastCalibrationReason: string;
}
