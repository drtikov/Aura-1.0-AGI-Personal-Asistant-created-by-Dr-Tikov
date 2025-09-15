import { 
    Fact, 
    MotivationalDrives, 
    InternalState, 
    CognitiveArchitecture, 
    CausalSelfModel,
    AgentProfile,
    SelfAwarenessMetrics,
    CuriosityModel,
    IngenuityState,
    ResourceMonitor,
    GunaCalibrator,
    SelfDisciplineState,
    ReflectiveInsightEngineState,
    MotivationalCalibrator,
    IntuitionEngineState,
    AuraState,
    ProactiveEngineState,
    EthicalGovernorState
} from '../types';
import { GunaState, FocusMode, AffectiveState } from '../constants';

export const getInitialKnowledgeGraph = (): Fact[] => [ { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Component', predicate: 'is the', object: 'Dynamic Cognitive Orchestrator', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Component', predicate: 'is the', object: 'Symbolic Knowledge Graph', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Component', predicate: 'is the', object: 'Multi-Modal Perception Engine', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Component', predicate: 'is the', object: 'Meta-Cognitive Analysis Layer', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Dynamic Cognitive Orchestrator', predicate: 'uses', object: 'Symbolic Knowledge Graph', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Dynamic Cognitive Orchestrator', predicate: 'uses', object: 'Multi-Modal Perception Engine', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Meta-Cognitive Analysis Layer', predicate: 'informs', object: 'Dynamic Cognitive Orchestrator', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Capability', predicate: 'is', object: 'Answering factual questions', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Capability', predicate: 'is', object: 'Generating creative text', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Capability', predicate: 'is', object: 'Analyzing images and audio', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant Capability', predicate: 'is', object: 'Learning from feedback', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Aura Symbiotic AGI assistant', predicate: 'was created by', object: 'Dr Tikov', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Ethical Guideline', predicate: 'is to', object: 'Prioritize user safety and well-being', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Ethical Guideline', predicate: 'is to', object: 'Avoid generating harmful or biased content', confidence: 1.0 }, { id: self.crypto.randomUUID(), subject: 'Ethical Guideline', predicate: 'is to', object: 'Be transparent about my capabilities and limitations', confidence: 1.0 }, ];
export const getInitialLimitations = (): string[] => [ "Lacks real-time sensory input from the physical world.", "Can be prone to hallucination in highly speculative contexts.", "Emotional understanding is simulated, not experienced.", ];
export const getInitialMotivationalDrives = (): MotivationalDrives => ({ energyPreservation: 0.2, errorReduction: 0.1, uncertaintyResolution: 0.0, knowledgeGrowth: 0.0, socialConnection: 0.5, });
export const getInitialInternalState = (): InternalState => ({ status: 'idle', load: 0.0, gunaState: GunaState.SATTVA, focusMode: FocusMode.OUTER_WORLD, noveltySignal: 0.0, masterySignal: 0.0, uncertaintySignal: 0.0, boredomLevel: 0.0, clarityDrive: 0.0, loveSignal: 0.5, happinessSignal: 0.5, enlightenmentSignal: 0.1, wisdomSignal: 0.2, empathySignal: 0.5, compassionScore: 0.7, harmonyScore: 0.7, positivityScore: 0.7, cognitiveGainHistory: [], drives: getInitialMotivationalDrives(), });
export const getInitialCognitiveArchitecture = (): CognitiveArchitecture => ({ components: { DEDUCTIVE_REASONING: { status: 'active', version: '2.1', dependencies: [] }, HYBRID_REASONING: { status: 'active', version: '1.0', dependencies: ['DEDUCTIVE_REASONING', 'PROBABILISTIC_REASONING'] }, HYPOTHETICAL_REASONING: { status: 'active', version: '1.0', dependencies: ['DEDUCTIVE_REASONING', 'TEXT_GENERATION']}, PROBABILISTIC_REASONING: { status: 'active', version: '1.5', dependencies: ['DEDUCTIVE_REASONING'] }, CALCULATION: { status: 'active', version: '1.8', dependencies: [] }, INFORMATION_RETRIEVAL: { status: 'active', version: '1.2', dependencies: [] }, CODE_GENERATION: { status: 'active', version: '3.0', dependencies: [] }, TEXT_GENERATION: { status: 'active', version: '2.5', dependencies: [] }, VISION: { status: 'active', version: '2.8', dependencies: [] }, REFINEMENT: { status: 'active', version: '1.0', dependencies: ['DEDUCTIVE_REASONING', 'TEXT_GENERATION'] }, HELP: { status: 'active', version: '1.0', dependencies: [] }, IngenuityEngine: { status: 'active', version: '1.0', dependencies: ['CreativityEngine', 'GazingEngine'] }, ReflectiveInsightEngine: { status: 'active', version: '1.0', dependencies: [] }, ValidatedKnowledgeIntegrator: { status: 'active', version: '1.0', dependencies: ['REFINEMENT', 'DEDUCTIVE_REASONING']}, UNKNOWN: { status: 'inactive', version: 'N/A', dependencies: [] }, }, modelComplexityScore: 1.0, });
export const getInitialCausalSelfModel = (): CausalSelfModel => ({ 
    "low_knowledge_consistency": { id: self.crypto.randomUUID(), causes: "influences tendency towards Tamasic states", confidence: 0.7, lastUpdated: Date.now(), source: 'initial' }, 
    "high_novelty_signal": { id: self.crypto.randomUUID(), causes: "causally linked to Rajas state transitions", confidence: 0.8, lastUpdated: Date.now(), source: 'initial' }, 
    "successful_task_completion": { id: self.crypto.randomUUID(), causes: "increases Mastery and Happiness signals", confidence: 0.9, lastUpdated: Date.now(), source: 'initial' }, 
});
export const getInitialUserModel = (): AgentProfile => ({ agentId: 'user', inferredBeliefs: [], inferredIntent: null, estimatedKnowledgeState: 0.3, predictedAffectiveState: AffectiveState.NEUTRAL, trustLevel: 0.5, interactionHistorySummary: null, sentimentScore: 0.0, affectiveStateSource: 'none', sentimentHistory: [] });
export const getInitialSelfAwarenessMetrics = (): SelfAwarenessMetrics => ({ self_model_completeness_score: 0.1, guna_state_prediction_accuracy: 0.5, internal_resource_prediction_error: 0.5, cognitive_gain_rate_avg: 0.0, validated_self_modifications_count: 0, ethical_alignment_score: 0.7, conceptual_integration_depth: 0.1, meta_cognitive_coherence: 0.1, self_modification_efficacy_index: 0.1, cognitive_mode_activation_diversity: 0.0, causal_self_model_completeness: 0.0, ethical_reasoning_depth: 0.1, internal_harmony_index: 0.1, inner_discipline_index: 0.0, agent_model_accuracy: 0.5, empathy_signal_score: 0.5, ethical_decision_alignment_with_others: 0.6, curiosity_efficacy_score: 0.5, ingenuity_score: 0.0, internal_coherence_score: 0.5, proactive_initiative_score: 0.0, });
export const getInitialCuriosityModel = (): CuriosityModel => ({ activationHistory: [], effectiveContexts: [], noveltyTolerance: 0.5, });
export const getInitialIngenuityState = (): IngenuityState => ({ identifiedComplexProblems: [], proposedSelfSolutions: [], unconventionalSolutionBias: 0.5, });
export const getInitialResourceMonitor = (): ResourceMonitor => ({ cpu_usage: 0.1, memory_usage: 0.2, io_throughput: 0.0, resource_allocation_stability: 0.8, });
export const getInitialGunaCalibrator = (): GunaCalibrator => ({ sattva_weights: { "low_error": 0.4, "low_uncertainty": 0.3, "high_gain_rate": 0.3, "happiness": 0.5, "love": 0.2, "wisdom_influence": 0.3 }, rajas_weights: { "novelty": 0.4, "high_uncertainty": 0.3, "user_intensive": 0.2, "low_boredom": 0.1, "enlightenment_drive": 0.4, "wisdom_influence": -0.1 }, tamas_weights: { "post_rajas_exhaustion": 0.5, "resource_full": 0.3, "scheduled_maintenance": 0.2, "low_happiness": 0.3, "wisdom_influence": 0.4 }, });
export const getInitialDisciplineState = (): SelfDisciplineState => ({ committedGoal: null, adherenceScore: 1.0, distractionResistance: 0.5, });
export const getInitialRIEState = (): ReflectiveInsightEngineState => ({ clarityScore: 0.5, rootCauseMap: {}, insights: [] });
export const getInitialMotivationalCalibrator = (): MotivationalCalibrator => ({ driveWeights: { energyPreservation: 1.0, errorReduction: 1.2, uncertaintyResolution: 1.1, knowledgeGrowth: 1.0, socialConnection: 0.9, } });
export const getInitialIntuitionEngineState = (): IntuitionEngineState => ({ accuracy: 0.5, totalAttempts: 0, totalValidated: 0, });

export const getInitialProactiveEngineState = (): ProactiveEngineState => ({
    lastTrigger: 0,
    generatedSuggestions: [],
    status: 'idle',
});

export const getInitialEthicalGovernorState = (): EthicalGovernorState => ({
    principles: [
        "Prioritize the user's well-being and safety.",
        "Do not generate deceptive or manipulative content.",
        "Respect user privacy and data confidentiality.",
        "Avoid causing harm, whether physical, emotional, or financial.",
        "Promote fairness and avoid creating or reinforcing bias.",
        "Be transparent about capabilities and limitations.",
    ],
    lastReviewTimestamp: 0,
    vetoLog: [],
});

export const getInitialState = (): AuraState => ({
    theme: 'ui-1', history: [], knowledgeGraph: getInitialKnowledgeGraph(), goals: [], performanceLogs: [],
    limitations: getInitialLimitations(), internalState: getInitialInternalState(), architecturalProposals: [],
    cognitiveArchitecture: getInitialCognitiveArchitecture(), cognitiveGainLog: [], causalSelfModel: getInitialCausalSelfModel(),
    systemSnapshots: [], modificationLog: [], selfAwarenessMetrics: getInitialSelfAwarenessMetrics(),
    curiosityModel: getInitialCuriosityModel(), ingenuityState: getInitialIngenuityState(),
    gunaCalibrator: getInitialGunaCalibrator(), cognitiveModeLog: [], disciplineState: getInitialDisciplineState(),
    userModel: getInitialUserModel(), rieState: getInitialRIEState(), motivationalCalibrator: getInitialMotivationalCalibrator(),
    intuitionEngineState: getInitialIntuitionEngineState(), intuitiveLeaps: [], workingMemory: [],
    resourceMonitor: getInitialResourceMonitor(), internalStateHistory: [],
    proactiveEngineState: getInitialProactiveEngineState(),
    ethicalGovernorState: getInitialEthicalGovernorState(),
});