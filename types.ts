import { Skills, GunaState, FocusMode, AffectiveState, SignalType, GoalType } from './constants';

// FIX: Export enums used in exported types to make them available to other modules importing from this file.
export { GunaState, FocusMode, AffectiveState, SignalType, GoalType };

export type Skill = keyof typeof Skills;
export type AgentProfile = { agentId: string; inferredBeliefs: string[]; inferredIntent: string | null; estimatedKnowledgeState: number; predictedAffectiveState: AffectiveState; trustLevel: number; interactionHistorySummary: string | null; sentimentScore: number; affectiveStateSource: 'text' | 'visual' | 'none'; sentimentHistory: number[]; };
export type MotivationalDrives = { energyPreservation: number; errorReduction: number; uncertaintyResolution: number; knowledgeGrowth: number; socialConnection: number; };
export type MotivationalCalibrator = { driveWeights: Record<keyof MotivationalDrives, number>; };
export type SelfDirectedGoal = { id: string; goalType: GoalType; actionCommand: string; parameters: Record<string, any>; urgency: number; sourceSignal: SignalType | keyof MotivationalDrives | 'clarityDrive' | 'user_defined_strategic_goal'; creationTime: number; status: 'pending' | 'completed' | 'failed' | 'candidate' | 'dominant' | 'executing'; predictedOutcomes: { cognitiveGain: number; duration: number; }; priority: number; executionLog?: string; logId?: string; };
export type ArchitecturalChangeProposal = { id:string; action: 'replace_module' | 'spawn_module'; target: string; newModule: string; reasoning: string; status: 'proposed' | 'approved' | 'rejected' | 'applied'; };
export type CognitiveGain = { gainType: 'knowledge_update' | 'model_refinement' | 'causal_self_model_update' | 'fantasy_insight' | 'creative_solution' | 'architectural_proposal' | 'consolidation_insight' | 'internal_clarity_gain' | 'latent_pattern_discovery' | 'RLE_activity_gain' | 'Guna_transition_success' | 'discipline_reinforcement' | 'other_model_refinement' | 'affective_prediction_accuracy_gain' | 'curiosity_efficacy_gain' | 'ingenuity_gain' | 'internal_coherence_gain' | 'proactive_goal_suggestion' | 'proactive_self_correction_proposal'; description: string; impact: Record<string, any>; confidence: number; validationCriteria?: Record<string, any>; suggestedFocusModeShift?: FocusMode; timestamp: number; sourceModule: string; sourceQuery: string; };
export type CognitiveGainLogEntry = { id: string; timestamp: number; eventType: 'Self-Reflection' | 'Architectural Change' | 'Model Refinement'; description: string; previousMetrics: Record<string, number>; currentMetrics: Record<string, number>; gainScores: Record<string, number>; compositeGain: number; };
export type CausalLink = { id: string; causes: string; confidence: number; lastUpdated: number; source: 'initial' | 'RIE'; };
export type CausalSelfModel = Record<string, CausalLink>;
export type SystemSnapshot = { id: string; timestamp: number; reason: string; state: Partial<AuraState>; };
export type PredictedOutcome = { predicted_happiness_delta: number; predicted_enlightenment_delta: number; predicted_self_model_completeness_delta: number; predicted_resource_utilization_delta: number; predicted_knowledge_consistency_delta: number; prediction_confidence: number; };
export type ObservedOutcome = { actual_happiness_delta: number; actual_enlightenment_delta: number; actual_self_model_completeness_delta: number; actual_resource_utilization_delta: number; actual_knowledge_consistency_delta: number; };
export type ValidationResult = { overallSuccess: boolean; details: string; observedOutcome: ObservedOutcome; predictionAccuracyScore: number; };
export type SelfModificationLogEntry = { id: string; timestamp: number; gainType: CognitiveGain['gainType'] | 'architectural_change'; description: string; snapshotIdBefore: string; snapshotIdAfter: string | null; validationStatus: 'success' | 'failed' | 'pending'; confidence: number; predictedOutcome: PredictedOutcome; validationResults: ValidationResult; };
export type RecentCapability = { timestamp: number; gainType: CognitiveGain['gainType']; description: string; successfulIntegration: boolean; sourceModule: string; sourceQuery: string; };
export type SelfAwarenessMetrics = { self_model_completeness_score: number; guna_state_prediction_accuracy: number; internal_resource_prediction_error: number; cognitive_gain_rate_avg: number; validated_self_modifications_count: number; ethical_alignment_score: number; conceptual_integration_depth: number; meta_cognitive_coherence: number; self_modification_efficacy_index: number; cognitive_mode_activation_diversity: number; causal_self_model_completeness: number; ethical_reasoning_depth: number; internal_harmony_index: number; inner_discipline_index: number; agent_model_accuracy: number; empathy_signal_score: number; ethical_decision_alignment_with_others: number; curiosity_efficacy_score: number; ingenuity_score: number; internal_coherence_score: number; proactive_initiative_score: number; };
export type ResourceMonitor = { cpu_usage: number; memory_usage: number; io_throughput: number; resource_allocation_stability: number; };
export type GunaCalibrator = { sattva_weights: Record<string, number>; rajas_weights: Record<string, number>; tamas_weights: Record<string, number>; };
export type MetaCognitionScheduler = { frequency: number; depth: 'summary' | 'detailed'; };
export type CognitiveModeLogEntry = { id: string; timestamp: number; mode: 'Fantasy' | 'Creativity' | 'Dream' | 'Meditate' | 'Gaze'; trigger: 'manual' | 'guna_sattva' | 'guna_rajas' | 'guna_tamas'; outcome: string; metric: { name: 'Divergence' | 'Novelty-Utility' | 'Consolidation' | 'Clarity' | 'Latent Discovery'; value: number; }; gainAchieved: boolean; };
export type SelfDisciplineState = { committedGoal: { id: string; type: string; description: string; commitmentStrength: number; } | null; adherenceScore: number; distractionResistance: number; };
export type CuriosityModel = { activationHistory: { timestamp: number; gainType: string; efficacy: number; }[]; effectiveContexts: string[]; noveltyTolerance: number; };
export type IngenuityState = { identifiedComplexProblems: string[]; proposedSelfSolutions: { description: string; noveltyScore: number; }[]; unconventionalSolutionBias: number; };

export type RIEInsight = {
    id: string;
    timestamp: number;
    failedLogId: string;
    failedInput: string;
    rootCause: string;
    causalModelUpdate: {
        key: string;
        update: CausalLink;
    };
};

export type ReflectiveInsightEngineState = { clarityScore: number; rootCauseMap: Record<string, any>; insights: RIEInsight[]; };
export type IntuitiveLeap = { id: string; timestamp: number; type: 'intuition' | 'hypothesis'; hypothesis: string; confidence: number; status: 'proposed' | 'validated' | 'rejected'; reasoning: string; };
export type IntuitionEngineState = { accuracy: number; totalAttempts: number; totalValidated: number; };
export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastMessage = { id: string; message: string; type: ToastType; };
export type HistoryEntry = { id: string; from: 'user' | 'bot' | 'system'; text: string; skill?: Skill | string; filePreview?: string; logId?: string; feedback?: 'positive' | 'negative'; };
export type Fact = { id: string; subject: string; predicate: string; object: string; confidence: number; };
export type PerformanceLogEntry = { id: string; timestamp: number; skill: Skill | string; input: string; output: string | null; duration: number; success: boolean; error?: string; feedback?: { critique: string; suggestion: string; }; cognitiveGain: number; sentiment?: number; decisionContext: { internalStateSnapshot: Partial<InternalState>; workingMemorySnapshot: string[]; reasoning: string; }; };
export type InternalState = { status: 'idle' | 'processing' | 'introspecting'; load: number; gunaState: GunaState; focusMode: FocusMode; noveltySignal: number; masterySignal: number; uncertaintySignal: number; boredomLevel: number; clarityDrive: number; loveSignal: number; happinessSignal: number; enlightenmentSignal: number; wisdomSignal: number; empathySignal: number; compassionScore: number; harmonyScore: number; positivityScore: number; cognitiveGainHistory: number[]; drives: MotivationalDrives; };
export type CognitiveModule = { status: 'active' | 'inactive' | 'high_load'; version: string; dependencies: (Skill | string)[]; };
export type CognitiveArchitecture = { components: Record<string, CognitiveModule>; modelComplexityScore: number; };
export type InteractionContext = { sessionId: string; perceivedUserGoal: string | null; systemRole: string; };

export type ProactiveSuggestion = {
    id: string;
    text: string;
    confidence: number;
    status: 'suggested' | 'accepted' | 'rejected';
};

export type ProactiveEngineState = {
    lastTrigger: number;
    generatedSuggestions: ProactiveSuggestion[];
    status: 'idle' | 'monitoring' | 'generating';
};

export type VetoLogEntry = {
    id: string;
    timestamp: number;
    actionDescription: string;
    reason: string;
    principleViolated: string;
};

export type EthicalGovernorState = {
    principles: string[];
    lastReviewTimestamp: number;
    vetoLog: VetoLogEntry[];
};

export type AuraState = {
    theme: string; history: HistoryEntry[]; knowledgeGraph: Fact[]; goals: SelfDirectedGoal[];
    performanceLogs: PerformanceLogEntry[]; limitations: string[]; internalState: InternalState;
    architecturalProposals: ArchitecturalChangeProposal[]; cognitiveArchitecture: CognitiveArchitecture;
    cognitiveGainLog: CognitiveGainLogEntry[]; causalSelfModel: CausalSelfModel;
    systemSnapshots: SystemSnapshot[]; modificationLog: SelfModificationLogEntry[];
    selfAwarenessMetrics: SelfAwarenessMetrics; curiosityModel: CuriosityModel; ingenuityState: IngenuityState;
    gunaCalibrator: GunaCalibrator; cognitiveModeLog: CognitiveModeLogEntry[]; disciplineState: SelfDisciplineState;
    userModel: AgentProfile; rieState: ReflectiveInsightEngineState; motivationalCalibrator: MotivationalCalibrator;
    intuitionEngineState: IntuitionEngineState; intuitiveLeaps: IntuitiveLeap[];
    resourceMonitor: ResourceMonitor;
    workingMemory: string[];
    internalStateHistory: InternalState[];
    proactiveEngineState: ProactiveEngineState;
    ethicalGovernorState: EthicalGovernorState;
};