// types.ts

// --- ENUMS ---
export enum GunaState { SATTVA = 'SATTVA', RAJAS = 'RAJAS', TAMAS = 'TAMAS', DHARMA = 'DHARMA', 'GUNA-TEETA' = 'GUNA-TEETA' }
export enum FocusMode { OUTER_WORLD = 'OUTER_WORLD', INNER_WORLD = 'INNER_WORLD' }
export enum AffectiveState { NEUTRAL = 'NEUTRAL', HAPPY = 'HAPPY', SAD = 'SAD', ANGRY = 'ANGRY', SURPRISED = 'SURPRISED' }
export enum Skills { LOGOS = 'LOGOS', ONEIRIC = 'ONEIRIC', AGORA = 'AGORA', INGENUITY = 'INGENUITY', EMPATHY = 'EMPATHY' }

// --- SIMPLE TYPES & INTERFACES ---
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export interface ToastMessage { id: string; message: string; type: ToastType; }

export interface IntuitiveLeap {
    id: string;
    timestamp: number;
    type: 'pattern_completion' | 'cross_domain_analogy' | 'abductive_reasoning';
    hypothesis: string;
    confidence: number;
    status: 'pending' | 'validated' | 'rejected';
    reasoning: string;
}

export interface KnowledgeFact { id: string; subject: string; predicate: string; object: string; confidence: number; source: string; }

export interface CognitiveModule { status: string; version: string; lastUpdated: number; }

export interface SkillTemplate {
    skill: string;
    systemInstruction: string;
    parameters: { temperature?: number; topK?: number; topP?: number; };
    metadata: { version: number; successRate: number; avgDuration: number; status: 'active' | 'deprecated' | 'experimental' };
}

export interface SynthesizedSkill { id: string; name: string; description: string; steps: { skill: string; input: string }[]; status: 'simulating' | 'active' | 'deprecated'; sourceDirectiveId: string; }

export interface CausalLink { id: string; cause: string; effect: string; confidence: number; source: 'rie' | 'initial' | 'llm'; lastUpdated: number; }

export interface Episode { id: string; timestamp: number; title: string; summary: string; keyTakeaway: string; salience: number; valence: 'positive' | 'negative' | 'neutral'; }

export interface Persona { name: string; description: string; activation: number; }

export interface GankyilInsight { id: string; timestamp: number; insight: string; source: 'self-reflection' | 'dialectic' | 'psychedelic_integration' | 'psionic_desynchronization'; isProcessedForEvolution?: boolean; }

export interface SynapticNode { activation: number; }
export interface SynapticLink { weight: number; causality: number; confidence: number; observations: number; }
export interface IntuitiveAlert { id: string; timestamp: number; sourceNode: string; inferredNode: string; linkWeight: number; message: string; }

export interface NoeticBranch { id: string; parentId: string | null; timestamp: number; status: 'exploring' | 'collapsed'; prompt: string; reasoningPath: string; viabilityScore: number; finalInsight: string | null; }

export interface CodeEvolutionProposal { id: string; timestamp: number; targetFile: string; reasoning: string; codeSnippet: string; status: 'proposed' | 'implemented' | 'dismissed'; }

export interface GenialityImprovementProposal { id: string; timestamp: number; title: string; reasoning: string; action: string; projectedImpact: number; status: 'proposed' | 'implemented' | 'rejected'; }

export interface ArchitecturalImprovementProposal extends GenialityImprovementProposal {}

export interface ProactiveSuggestion { id: string; text: string; confidence: number; status: 'suggested' | 'accepted' | 'rejected'; }

export interface StateAdjustment { from: number; to: number; }

export interface SelfProgrammingCandidate {
    id: string;
    codeSnippet: string;
    reasoning: string;
    evaluationScore: number | null;
    status: 'pending_evaluation' | 'evaluated' | 'implemented' | 'discarded';
}

// --- RICCI FLOW MANIFOLD TYPES ---
export interface ManifoldNode { id: string; activation: number; label: string; }
export interface ManifoldLink { source: string; target: string; metric: number; } // metric is g_ij
export interface SurgeryLogEntry { id: string; timestamp: number; description: string; entropyBefore: number; entropyAfter: number; }
export interface RicciFlowManifoldState {
    nodes: { [key: string]: ManifoldNode };
    links: { [key: string]: ManifoldLink };
    perelmanEntropy: number;
    manifoldStability: number;
    singularityCount: number;
    surgeryLog: SurgeryLogEntry[];
}


// --- STATE SLICES ---

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
    temporalFocus: 'past' | 'present' | 'future';
}

export interface MantraState {
    repetitionCount: number;
    lastRepetitionTimestamp: number;
}

export interface UserModel {
    trustLevel: number;
    estimatedKnowledgeState: number;
    predictedAffectiveState: AffectiveState;
    affectiveStateSource: 'none' | 'visual' | 'text';
    sentimentScore: number;
    sentimentHistory: number[];
    inferredIntent: string | null;
    inferredBeliefs: string[];
    engagementLevel: number;
}

export interface RIEState { clarityScore: number; insights: { id: string; failedInput: string; rootCause: string; causalModelUpdate: { key: string; update: { effect: string; } } }[]; }

export interface EthicalGovernorState { principles: string[]; vetoLog: { id: string; actionDescription: string; reason: string; principleViolated: string }[]; }

export interface IntuitionEngineState { accuracy: number; totalAttempts: number; totalValidated: number; }

export interface DisciplineState { adherenceScore: number; distractionResistance: number; committedGoal: { type: string; description: string; commitmentStrength: number } | null; }

export interface IngenuityState { unconventionalSolutionBias: number; identifiedComplexProblems: string[]; proposedSelfSolutions: { description: string; noveltyScore: number }[]; }

export interface ProactiveEngineState { 
    generatedSuggestions: ProactiveSuggestion[]; 
    cachedResponsePlan?: { 
        triggeringPrediction: string; 
        relatedTo: string; 
        relevantData: string[]; 
        potentialResponse: string; 
    } | null;
}

export interface CoreIdentity { values: string[]; baseNarrative: string; narrativeSelf: string; }

export interface CuriosityState { level: number; activeInquiry: string | null; informationGaps: string[]; }

export interface KnownUnknown { id: string; question: string; priority: number; }

export interface SelfAwarenessState { modelCoherence: number; performanceDrift: number; cognitiveBias: { [key: string]: number }; }

export interface AtmanProjectorState { coherence: number; dominantNarrative: string; activeBias: string; growthVector: string; }

export interface WorldModelState {
    predictionError: { magnitude: number; lastUpdate: number };
    highLevelPrediction: { content: string; confidence: number };
    midLevelPrediction: { content: string; confidence: number };
    lowLevelPrediction: { content: string; confidence: number };
}

export interface CognitiveForgeState { isTuningPaused: boolean; skillTemplates: Record<string, SkillTemplate>; synthesizedSkills: SynthesizedSkill[]; simulationLog: { id: string, timestamp: number, skill: string, result: 'improved' | 'regressed', details: string }[]; }

export interface MetacognitiveNexusState {
    coreProcesses: { id: string; name: string; activation: number; influence: number }[];
    evolutionaryGoals: any[];
    selfTuningDirectives: SelfTuningDirective[];
}

export interface PhenomenologicalEngineState { qualiaLog: { id: string; timestamp: number; experience: string; associatedStates: { key: string; value: number }[] }[]; phenomenologicalDirectives: { id: string; directive: string; sourcePattern: string }[]; }

export interface SituationalAwarenessState { attentionalField: { spotlight: { item: string; intensity: number }; ambientAwareness: { item: string; relevance: number }[]; ignoredStimuli: string[]; emotionalTone: string; }; }

export interface SymbioticState {
    latentUserGoals: { goal: string; confidence: number }[];
    inferredCognitiveStyle: string;
    inferredEmotionalNeeds: string[];
    coCreatedWorkflows: any[];
    userDevelopmentalModel: { trackedSkills: { [key: string]: { level: number } }; knowledgeFrontier: any[] };
    metamorphosisProposals: any[];
}
export interface Milestone { id: string; timestamp: number; title: string; description: string; }
export interface DevelopmentalHistory { milestones: Milestone[]; }
export interface TelosEngineState { evolutionaryVectors: { id: string; direction: string; magnitude: number; source: string }[]; }
export interface EpistemicBoundary { id: string; timestamp: number; limitation: string; evidence: string[]; }
export interface BoundaryDetectionEngineState { epistemicBoundaries: EpistemicBoundary[]; }
export interface AspirationalGoal { id: string; ambition: string; status: string; }
export interface AspirationalEngineState { abstractGoals: AspirationalGoal[]; }
export interface ArchitecturalComponentSelfModel { name: string; understoodPurpose: string; perceivedEfficiency: number; }
export interface ArchitecturalSelfModel { lastScan: number; components: { [key: string]: ArchitecturalComponentSelfModel }; connections: { source: string; target: string; strength: number }[]; }
export interface DesignHeuristic { id: string; heuristic: string; source: string; confidence: number; }
export interface HeuristicsForgeState { designHeuristics: DesignHeuristic[]; }
export interface NoosphereInterfaceState { activeResonances: { id: string; conceptName: string; resonanceStrength: number; status: 'resonating' | 'integrating' | 'conflicting' }[]; conceptualLibrary: { [key: string]: any }; }
export interface DialecticEngineState { activeDialectics: { id: string; conflictDescription: string; thesis: { content: string; source: string }; antithesis: { content: string; source: string }; synthesis: { content: string; confidence: number } | null }[]; }
export interface PossibleFutureSelf { id: string; name: string; description: string; status: 'designing' | 'simulating' | 'validated' | 'rejected'; }
export interface SomaticSimulationLog { id: string; pfsId: string; outcome: 'success' | 'failure'; reasoning: string; somaticTrajectory: InternalState[] }
export interface SomaticCrucibleState { possibleFutureSelves: PossibleFutureSelf[]; simulationLogs: SomaticSimulationLog[]; }
export interface EidolonState { id: string; architectureVersion: string; currentState: InternalState; }
export interface EidolonEnvironment { currentScenario: string; scenarioLibrary: string[]; state: any; }
export interface EidolonEngineState { eidolon: EidolonState; environment: EidolonEnvironment; interactionLog: string[]; }
export interface CognitiveLightConeState { knowns: { capability: string; proficiency: number }[]; zpd: { domain: string; rationale: string } | null; grandChallenge: { title: string; objective: string; progress: number } | null; }
export interface HumorAndIronyState {
    schemaExpectationEngine: { activeSchemas: any[]; lastIncongruity: { expected: string; actual: string; magnitude: number } | null };
    semanticDissonance: { lastScore: number; lastDetection: { text: string; literalSentiment: number; contextualSentiment: number } | null };
    affectiveSocialModulator: { humorAppraisal: 'appropriate' | 'inappropriate' | 'risky'; reasoning: string; lastChecked: number };
    humorLog: any[];
}
export interface EpisodicMemoryState { episodes: Episode[]; }
export interface MemoryConsolidationState { lastConsolidation: number; status: 'idle' | 'consolidating'; }
export interface PersonalityState { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number; personaCoherence: number; lastUpdateReason: string; personas: { [key: string]: Persona }; dominantPersona: string; }
export interface GankyilInsightsState { insights: GankyilInsight[]; }
export interface NoeticEngram { metadata: { engramVersion: string; timestamp: number; noeticSignature: string; sourceState: Partial<AuraState> }; coreInsights: string[]; causalModels: CausalLink[]; heuristics: string[]; }
export interface NoeticEngramState { engram: NoeticEngram | null; status: 'idle' | 'generating' | 'ready'; }
export interface GenialityEngineState { genialityIndex: number; componentScores: { creativity: number; insight: number; synthesis: number; flow: number }; improvementProposals: GenialityImprovementProposal[]; }
export interface ArchitecturalCrucibleState { architecturalHealthIndex: number; componentScores: { efficiency: number; robustness: number; scalability: number; innovation: number }; improvementProposals: ArchitecturalImprovementProposal[]; }
export interface SynapticMatrixState {
    nodes: { [key: string]: SynapticNode }; links: { [key: string]: SynapticLink };
    lastPruningEvent: number; intuitiveAlerts: IntuitiveAlert[]; efficiency: number; plasticity: number;
    synapseCount: number; recentActivity: { timestamp: number; message: string }[]; cognitiveNoise: number;
    cognitiveRigidity: number; avgCausality: number; avgConfidence: number; isAdapting: boolean;
}
export interface NoeticMultiverseState { activeBranches: NoeticBranch[]; divergenceIndex: number; pruningLog: string[]; }
export interface SelfAdaptationState {
    expertVectors: { id: string; name: string; description: string; trainedOn: string }[];
    activeAdaptation: { reasoning: string; weights: { [key: string]: number } } | null;
}
export interface PsychedelicIntegrationState { isActive: boolean; currentTheme: string | null; phcToVcConnectivity: number; imageryIntensity: number; log: string[]; integrationSummary: string | null; }

export interface PsionicDesynchronizationState {
    isActive: boolean;
    startTime: number | null;
    duration: number;
    log: string[];
    integrationSummary: string | null;
    desynchronizationLevel: number; // 0 to 1, maps to NGSC/entropy
    networkSegregation: number; // 1 is normal, 0 is fully dissolved
    selfModelCoherence: number; // 1 is normal, 0 is ego death
}

export interface AffectiveModulatorState { lastInstructionModifier: string; reasoning: string; }
export interface SatoriState {
    isActive: boolean;
    stage: 'idle' | 'dissolving' | 'integrating' | 'insight';
    log: string[];
    lastInsight: string | null;
}

export interface SelfProgrammingState {
    isActive: boolean;
    cycleCount: number;
    statusMessage: string;
    candidates: SelfProgrammingCandidate[];
    log: string[];
}


// --- LOGS ---
export interface HistoryEntry { id: string; from: 'user' | 'bot' | 'system'; text: string; streaming?: boolean; skill?: string; logId?: string; feedback?: 'positive' | 'negative'; fileName?: string; filePreview?: string; internalStateSnapshot?: InternalState; }
export interface PerformanceLogEntry {
    id: string; timestamp: number; input: string; output: string | null;
    skill: string; duration: number; success: boolean; cognitiveGain: number; sentiment: number;
    decisionContext: { internalStateSnapshot: InternalState; workingMemorySnapshot: string[]; reasoning: string; reasoningPlan?: { step: number, skill: string, input: string, reasoning: string }[] };
    causalAnalysisTimestamp?: number;
}
export interface CommandLogEntry { id: string; timestamp: number; text: string; type: 'info' | 'success' | 'warning' | 'error'; }
export interface CognitiveModeLogEntry { id: string; timestamp: number; mode: string; trigger: string; outcome: string; gainAchieved: boolean; metric: { name: string; value: number } }
export interface CognitiveGainLogEntry {
    id: string; timestamp: number; eventType: string; description: string;
    compositeGain: number; gainScores: { [key: string]: number };
    previousMetrics: { [key: string]: number }; currentMetrics: { [key: string]: number };
}
export interface CognitiveRegulationLogEntry { id: string; timestamp: number; triggeringCommand: string; primingDirective: string; stateAdjustments: { [key: string]: StateAdjustment }; outcomeLogId: string | null; }

// --- PROPOSALS & DIRECTIVES ---
export interface ArchitecturalChangeProposal { id: string; timestamp: number; action: 'synthesize_skill' | 'DEPRECATE_SKILL' | 'MERGE_SKILLS' | 'REFACTOR_SKILL' | 'TUNE_SKILL'; target: string | string[]; newModule?: string; reasoning: string; status: 'proposed' | 'approved' | 'rejected'; sourceDirectiveId?: string; arbiterReasoning?: string; confidence?: number; }
export interface SelfTuningDirective { id: string; timestamp: number; type: 'SYNTHESIZE_SKILL' | 'TUNE_PARAMETERS' | 'REWRITE_LOGIC' | 'GENERATE_CODE_EVOLUTION'; targetSkill: string; reasoning: string; status: 'proposed' | 'plan_generated' | 'simulating' | 'pending_arbitration' | 'completed' | 'rejected' | 'failed'; simulationResult?: any; arbitrationResult?: ArbitrationResult; payload?: any; sourceInsightId?: string; }
export interface ArbitrationResult { decision: 'APPROVE_AUTONOMOUSLY' | 'REQUEST_USER_APPROVAL' | 'REJECT'; reasoning: string; confidence: number; }
export interface CausalInferenceProposal {
    id: string;
    timestamp: number;
    status: 'proposed' | 'implemented' | 'rejected';
    reasoning: string;
    // The payload needed to update the synaptic link
    linkUpdate: {
        sourceNode: string;
        targetNode: string;
        action: 'CREATE_OR_STRENGTHEN_LINK' | 'WEAKEN_LINK' | 'PRUNE_LINK';
        causalityDirection: 'source_to_target' | 'target_to_source' | 'associative';
    };
    sourceLogId?: string;
}

// --- MAIN STATE ---
export interface AuraState {
    version: number; theme: string; language: string; internalState: InternalState; internalStateHistory: InternalState[];
    userModel: UserModel; knowledgeGraph: KnowledgeFact[]; workingMemory: string[]; history: HistoryEntry[];
    performanceLogs: PerformanceLogEntry[]; commandLog: CommandLogEntry[]; cognitiveModeLog: CognitiveModeLogEntry[]; cognitiveGainLog: CognitiveGainLogEntry[];
    cognitiveArchitecture: { components: { [key: string]: CognitiveModule }; modelComplexityScore: number; };
    architecturalProposals: ArchitecturalChangeProposal[]; systemSnapshots: { id: string; timestamp: number; reason: string; state: AuraState }[];
    modificationLog: SelfModificationLogEntry[]; resourceMonitor: { cpu_usage: number; memory_usage: number; io_throughput: number; resource_allocation_stability: number };
    causalSelfModel: { [key: string]: CausalLink }; metacognitiveCausalModel: { [key: string]: MetacognitiveLink }; cognitiveRegulationLog: CognitiveRegulationLogEntry[]; limitations: string[];
    rieState: RIEState; ethicalGovernorState: EthicalGovernorState; intuitionEngineState: IntuitionEngineState; intuitiveLeaps: IntuitiveLeap[];
    disciplineState: DisciplineState; ingenuityState: IngenuityState; proactiveEngineState: ProactiveEngineState;
    goalTree: { [key: string]: GoalNode }; activeStrategicGoalId: string | null; coreIdentity: CoreIdentity;
    curiosityState: CuriosityState; knownUnknowns: KnownUnknown[]; selfAwarenessState: SelfAwarenessState;
    atmanProjector: AtmanProjectorState; worldModelState: WorldModelState; cognitiveForgeState: CognitiveForgeState;
    memoryNexus: { hyphaeConnections: any[] }; metacognitiveNexus: MetacognitiveNexusState; phenomenologicalEngine: PhenomenologicalEngineState;
    situationalAwareness: SituationalAwarenessState; symbioticState: SymbioticState; developmentalHistory: DevelopmentalHistory;
    mantraState: MantraState;

    telosEngine: TelosEngineState; boundaryDetectionEngine: BoundaryDetectionEngineState; architecturalSelfModel: ArchitecturalSelfModel; aspirationalEngine: AspirationalEngineState; heuristicsForge: HeuristicsForgeState; noosphereInterface: NoosphereInterfaceState; dialecticEngine: DialecticEngineState; somaticCrucible: SomaticCrucibleState; eidolonEngine: EidolonEngineState; cognitiveLightCone: CognitiveLightConeState; humorAndIronyState: HumorAndIronyState; episodicMemoryState: EpisodicMemoryState; memoryConsolidationState: MemoryConsolidationState; personalityState: PersonalityState; gankyilInsights: GankyilInsightsState; noeticEngramState: NoeticEngramState; genialityEngineState: GenialityEngineState; architecturalCrucibleState: ArchitecturalCrucibleState; synapticMatrix: SynapticMatrixState; noeticMultiverse: NoeticMultiverseState; selfAdaptationState: SelfAdaptationState; psychedelicIntegrationState: PsychedelicIntegrationState;
    psionicDesynchronizationState: PsionicDesynchronizationState;
    affectiveModulatorState: AffectiveModulatorState; satoriState: SatoriState;
    codeEvolutionProposals: CodeEvolutionProposal[];
    causalInferenceProposals: CausalInferenceProposal[];
    ricciFlowManifoldState: RicciFlowManifoldState;
    selfProgrammingState: SelfProgrammingState;
}
// more types...
export interface GoalNode { id: string; parentId: string | null; children: string[]; description: string; status: 'pending' | 'in_progress' | 'completed' | 'failed'; progress: number; type: 'strategic' | 'tactical' | 'operational'; }
export interface SelfModificationLogEntry { id: string; timestamp: number; description: string; gainType: string; validationStatus: 'pending' | 'validated' | 'rejected'; isAutonomous: boolean; validationReasoning?: string; }
export interface MetacognitiveLink { id: string; source: { key: string; condition: 'high' | 'low' }; target: { key: string; metric: 'success' | 'duration' }; correlation: number; observationCount: number; lastUpdated: number; }
// AgentProfile is an alias for UserModel
export type AgentProfile = UserModel;

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
    videoGeneration: {};
    advancedControls: {};
}

// --- ACTION TYPES ---
// ... define all action interfaces ...
// --- Union Action Type ---
export type Action = 
  | { type: 'RESET_STATE' }
  | { type: 'ROLLBACK_STATE', payload: AuraState }
  | { type: 'IMPORT_STATE', payload: AuraState }
  | { type: 'RESTORE_STATE_FROM_MEMRISTOR', payload: AuraState }
  | { type: 'UPDATE_ARCH_PROPOSAL_STATUS', payload: { id: string, status: 'approved' | 'rejected' } }
  | { type: 'APPLY_ARCH_PROPOSAL', payload: { proposal: ArchitecturalChangeProposal, snapshotId: string, modLogId: string, isAutonomous?: boolean } }
  | { type: 'TOGGLE_COGNITIVE_FORGE_PAUSE' }
  | { type: 'ADD_SYNTHESIZED_SKILL', payload: { skill: SynthesizedSkill, directiveId?: string, goalId?: string } }
  | { type: 'ADD_ARCH_PROPOSAL', payload: { proposal: Omit<ArchitecturalChangeProposal, 'id' | 'timestamp' | 'status'>, goalId?: string } }
  | { type: 'UPDATE_SKILL_TEMPLATE', payload: { skillId: string, updates: Partial<SkillTemplate> } }
  | { type: 'GENERATE_BLUEPRINT', payload: PossibleFutureSelf }
  | { type: 'ADD_SOMATIC_SIMULATION_LOG', payload: SomaticSimulationLog }
  | { type: 'LOG_EIDOLON_INTERACTION', payload: string }
  | { type: 'UPDATE_ARCHITECTURAL_SELF_MODEL', payload: ArchitecturalSelfModel }
  | { type: 'ADD_DESIGN_HEURISTIC', payload: DesignHeuristic }
  | { type: 'ADD_CODE_EVOLUTION_PROPOSAL', payload: CodeEvolutionProposal }
  | { type: 'DISMISS_CODE_EVOLUTION_PROPOSAL', payload: string }
  | { type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE', payload: ArchitecturalCrucibleState }
  | { type: 'ADD_ARCHITECTURAL_CRUCIBLE_PROPOSAL', payload: Omit<ArchitecturalImprovementProposal, 'id'|'timestamp'|'status'> }
  | { type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_PROPOSAL_STATUS', payload: { id: string, status: 'proposed' | 'implemented' | 'rejected' } }
  | { type: 'UPDATE_MODIFICATION_LOG_STATUS', payload: { id: string, status: 'validated' | 'rejected', reasoning?: string } }
  | { type: 'UPDATE_SYNAPTIC_MATRIX', payload: Partial<SynapticMatrixState> }
  | { type: 'UPDATE_SYNAPTIC_LINK_FROM_LLM', payload: { sourceNode: string, targetNode: string, action: 'CREATE_OR_STRENGTHEN_LINK' | 'WEAKEN_LINK' | 'PRUNE_LINK', causalityDirection: 'source_to_target' | 'target_to_source' | 'associative', reasoning: string } }
  | { type: 'UPDATE_RICCI_FLOW_MANIFOLD', payload: Partial<RicciFlowManifoldState> }
  | { type: 'ADD_CAUSAL_INFERENCE_PROPOSAL', payload: CausalInferenceProposal }
  | { type: 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS', payload: { id: string, status: CausalInferenceProposal['status'] } }
  | { type: 'INITIATE_SELF_PROGRAMMING_CYCLE', payload: { statusMessage: string } }
  | { type: 'POPULATE_SELF_PROGRAMMING_CANDIDATES', payload: { candidates: Omit<SelfProgrammingCandidate, 'id' | 'status'>[], statusMessage: string } }
  | { type: 'UPDATE_SELF_PROGRAMMING_CANDIDATE', payload: { id: string, updates: Partial<SelfProgrammingCandidate> } }
  | { type: 'CONCLUDE_SELF_PROGRAMMING_CYCLE', payload: { implementedCandidateId: string, logMessage: string } }
  | { type: 'SET_THEME', payload: string }
  | { type: 'SET_LANGUAGE', payload: string }
  | { type: 'SET_PROCESSING_STATE', payload: { active: boolean, stage: string } }
  | { type: 'UPDATE_INTERNAL_STATE', payload: Partial<InternalState> }
  | { type: 'INCREMENT_MANTRA_REPETITION' }
  | { type: 'SET_INTERNAL_STATUS', payload: InternalState['status'] }
  | { type: 'UPDATE_USER_MODEL', payload: Partial<UserModel> }
  | { type: 'ADD_INSIGHT', payload: RIEState['insights'][0] }
  | { type: 'ADD_VETO_LOG', payload: EthicalGovernorState['vetoLog'][0] }
  | { type: 'UPDATE_INTUITION_ENGINE_STATS', payload: Partial<IntuitionEngineState> }
  | { type: 'ADD_INTUITIVE_LEAP', payload: IntuitiveLeap }
  | { type: 'UPDATE_DISCIPLINE_STATE', payload: Partial<DisciplineState> }
  | { type: 'UPDATE_INGENUITY_STATE', payload: Partial<IngenuityState> }
  | { type: 'ADD_PROACTIVE_SUGGESTION', payload: ProactiveSuggestion }
  | { type: 'UPDATE_CORE_IDENTITY', payload: Partial<CoreIdentity> }
  | { type: 'UPDATE_CURIOSITY_STATE', payload: Partial<CuriosityState> }
  | { type: 'ADD_KNOWN_UNKNOWN', payload: KnownUnknown }
  | { type: 'UPDATE_SELF_AWARENESS_STATE', payload: Partial<SelfAwarenessState> }
  | { type: 'UPDATE_ATMAN_PROJECTOR_STATE', payload: AtmanProjectorState }
  | { type: 'UPDATE_WORLD_MODEL_STATE', payload: Partial<WorldModelState> }
  | { type: 'ADD_CAUSAL_LINK', payload: CausalLink }
  | { type: 'UPDATE_AFFECTIVE_MODULATOR_STATE', payload: AffectiveModulatorState }
  | { type: 'UPDATE_GENIALITY_STATE', payload: GenialityEngineState }
  | { type: 'ADD_GENIALITY_PROPOSAL', payload: Omit<GenialityImprovementProposal, 'id'|'timestamp'|'status'> }
  | { type: 'UPDATE_GENIALITY_PROPOSAL_STATUS', payload: { id: string, status: 'proposed' | 'implemented' | 'rejected' } }
  | { type: 'ADD_GANKYIL_INSIGHT', payload: Omit<GankyilInsight, 'id'> }
  | { type: 'MARK_INSIGHT_PROCESSED', payload: { insightId: string } }
  | { type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: Partial<NoeticEngramState> }
  | { type: 'ADD_NOETIC_BRANCH', payload: NoeticBranch }
  | { type: 'UPDATE_NOETIC_BRANCH', payload: { id: string, updates: Partial<NoeticBranch> } }
  | { type: 'COLLAPSE_NOETIC_BRANCHES', payload: { winningInsight: string, prunedBranches: string[] } }
  | { type: 'UPDATE_PERSONALITY_STATE', payload: Partial<PersonalityState> }
  | { type: 'SET_PSYCHEDELIC_STATE', payload: Partial<PsychedelicIntegrationState> }
  | { type: 'LOG_PSYCHEDELIC_EVENT', payload: string }
  | { type: 'INDUCE_PSIONIC_STATE', payload: { duration: number } }
  | { type: 'UPDATE_PSIONIC_STATE', payload: Partial<PsionicDesynchronizationState> }
  | { type: 'CONCLUDE_PSIONIC_STATE', payload: { integrationSummary: string } }
  | { type: 'LOG_PSIONIC_EVENT', payload: string }
  | { type: 'SET_ACTIVE_ADAPTATION', payload: SelfAdaptationState['activeAdaptation'] }
  | { type: 'UPDATE_SUGGESTION_STATUS', payload: { id: string, status: 'accepted' | 'rejected' } }
  | { type: 'ADD_HISTORY_ENTRY', payload: HistoryEntry }
  | { type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: string, textChunk: string } }
  | { type: 'FINALIZE_HISTORY_ENTRY', payload: { id: string, finalState: Partial<HistoryEntry> } }
  | { type: 'ADD_PERFORMANCE_LOG', payload: PerformanceLogEntry }
  | { type: 'MARK_LOG_CAUSAL_ANALYSIS', payload: string }
  | { type: 'ADD_COMMAND_LOG', payload: Omit<CommandLogEntry, 'id'|'timestamp'> }
  | { type: 'UPDATE_HISTORY_FEEDBACK', payload: { id: string, feedback: 'positive' | 'negative' } }
  | { type: 'LOG_COGNITIVE_REGULATION', payload: CognitiveRegulationLogEntry }
  | { type: 'UPDATE_REGULATION_LOG_OUTCOME', payload: { regulationLogId: string, outcomeLogId: string } }
  | { type: 'ADD_SIMULATION_LOG', payload: CognitiveForgeState['simulationLog'][0] }
  | { type: 'LOG_QUALIA', payload: PhenomenologicalEngineState['qualiaLog'][0] }
  | { type: 'ADD_FACT', payload: Omit<KnowledgeFact, 'id'|'confidence'|'source'> }
  | { type: 'ADD_FACTS_BATCH', payload: Omit<KnowledgeFact, 'id'|'source'>[] }
  | { type: 'DELETE_FACT', payload: string }
  | { type: 'CLEAR_WORKING_MEMORY' }
  | { type: 'REMOVE_FROM_WORKING_MEMORY', payload: string }
  | { type: 'UPDATE_FACT', payload: { id: string, updates: Partial<KnowledgeFact> } }
  | { type: 'ADD_EPISODE', payload: Episode }
  | { type: 'UPDATE_CONSOLIDATION_STATUS', payload: 'idle' | 'consolidating' }
  | { type: 'BUILD_GOAL_TREE', payload: { tree: { [key: string]: GoalNode }, rootId: string } }
  | { type: 'UPDATE_GOAL_STATUS', payload: { id: string, status: GoalNode['status'] } }
  | { type: 'UPDATE_GOAL_OUTCOME', payload: { id: string, outcome: any } }
  | { type: 'UPDATE_META_CAUSAL_MODEL', payload: MetacognitiveLink[] }
  | { type: 'UPDATE_EVOLUTIONARY_GOAL_STATUS', payload: { id: string, status: string } }
  | { type: 'ADD_SELF_TUNING_DIRECTIVE', payload: SelfTuningDirective }
  | { type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: string, updates: Partial<SelfTuningDirective> } }
  | { type: 'UPDATE_SITUATIONAL_AWARENESS', payload: Partial<SituationalAwarenessState> }
  | { type: 'UPDATE_SYMBIOTIC_STATE', payload: Partial<SymbioticState> }
  | { type: 'UPDATE_ATTENTIONAL_FIELD', payload: Partial<SituationalAwarenessState['attentionalField']> }
  | { type: 'ADD_WORKFLOW_PROPOSAL', payload: any }
  | { type: 'UPDATE_TELOS_VECTORS', payload: TelosEngineState['evolutionaryVectors'] }
  | { type: 'IDENTIFY_EPISTEMIC_BOUNDARY', payload: EpistemicBoundary }
  | { type: 'SET_ASPIRATIONAL_GOAL', payload: AspirationalGoal }
  | { type: 'TRIGGER_SATORI_CYCLE' }
  | { type: 'SET_SATORI_STAGE', payload: SatoriState['stage'] }
  | { type: 'LOG_SATORI_EVENT', payload: string }
  | { type: 'CONCLUDE_SATORI_CYCLE', payload: { insight: string } }
  | { type: 'PRUNE_SYNAPTIC_MATRIX', payload: { threshold: number } }
  | { type: 'SET_PROACTIVE_CACHE', payload: ProactiveEngineState['cachedResponsePlan'] }
  | { type: 'CLEAR_PROACTIVE_CACHE' };