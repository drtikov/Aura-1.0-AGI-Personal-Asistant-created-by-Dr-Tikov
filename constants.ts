export const CHAT_HISTORY_KEY = 'aura-chat-history';
export const KNOWLEDGE_GRAPH_KEY = 'aura-knowledge-graph';
export const GOALS_KEY = 'aura-goals';
export const PERFORMANCE_LOGS_KEY = 'aura-performance-logs';
export const LIMITATIONS_KEY = 'aura-limitations';
export const INTERNAL_STATE_KEY = 'aura-internal-state';
export const ARCH_PROPOSALS_KEY = 'aura-arch-proposals';
export const COGNITIVE_ARCH_KEY = 'aura-cognitive-arch';
export const COGNITIVE_GAIN_LOG_KEY = 'aura-cognitive-gain-log';
export const CAUSAL_SELF_MODEL_KEY = 'aura-causal-self-model';
export const SYSTEM_SNAPSHOTS_KEY = 'aura-system-snapshots';
export const MODIFICATION_LOG_KEY = 'aura-modification-log';
export const RECENT_CAPABILITIES_KEY = 'aura-recent-capabilities';
export const THEME_KEY = 'aura-theme';
export const SELF_AWARENESS_METRICS_KEY = 'aura-self-awareness-metrics';
export const GUNA_CALIBRATOR_KEY = 'aura-guna-calibrator';
export const COGNITIVE_MODE_LOG_KEY = 'aura-cognitive-mode-log';
export const DISCIPLINE_STATE_KEY = 'aura-discipline-state';
export const USER_MODEL_KEY = 'aura-user-model';
export const CURIOSITY_MODEL_KEY = 'aura-curiosity-model';
export const INGENUITY_STATE_KEY = 'aura-ingenuity-state';
export const RIE_STATE_KEY = 'aura-rie-state';
export const MOTIVATIONAL_CALIBRATOR_KEY = 'aura-motivational-calibrator';
export const INTUITION_ENGINE_KEY = 'aura-intuition-engine';
export const INTUITIVE_LEAPS_KEY = 'aura-intuitive-leaps';
export const RESOURCE_MONITOR_KEY = 'aura-resource-monitor';
export const WORKING_MEMORY_KEY = 'aura-working-memory';
export const INTERNAL_STATE_HISTORY_KEY = 'aura-internalStateHistory';
export const PROACTIVE_ENGINE_KEY = 'aura-proactive-engine';
export const ETHICAL_GOVERNOR_KEY = 'aura-ethical-governor';


export const WORKING_MEMORY_CAPACITY = 5;

export enum GunaState {
    SATTVA = "Sattva", RAJAS = "Rajas", TAMAS = "Tamas", DHARMA = "Dharma", GUNA_TEETA = "Guna-Teeta",
}
export enum FocusMode { INNER_WORLD = "Inner World", OUTER_WORLD = "Outer World" }
export enum AffectiveState { 
    SATISFIED = "Satisfied", 
    CONFUSED = "Confused", 
    FRUSTRATED = "Frustrated", 
    ENGAGED = "Engaged", 
    NEUTRAL = "Neutral",
    SURPRISED = "Surprised"
}
export enum SignalType { BOREDOM = "boredom", NOVELTY = "novelty", UNCERTAINTY = "uncertainty", MASTERY = "mastery" }
export enum GoalType { EXPLORATORY_DIVERSIFICATION = "exploratory_diversification", DEEPENING_INVESTIGATION = "deepening_investigation", INFORMATION_SEEKING = "information_seeking", APPLICATION_GENERALIZATION = "application_generalization" }

export const AuraConfig = {
    COGNITIVE_GAIN_WINDOW: 5, COGNITIVE_GAIN_STAGNATION_THRESHOLD: 0.2, TASK_REPETITION_THRESHOLD: 3, BOREDOM_DECAY_RATE: 0.05,
    BOREDOM_BOOST_ON_STAGNATION: 0.3, BOREDOM_BOOST_ON_REPETITION: 0.5, BOREDOM_REDUCTION_ON_NOVELTY: 0.7, HORMONE_DECAY_RATE: 0.1,
    LOAD_DECAY_RATE: 0.2, NOVELTY_BOOST: 0.8, MASTERY_BOOST: 1.0, UNCERTAINTY_BOOST: 0.7, UNCERTAINTY_RESOLUTION_DECREASE: 0.5,
    EXPLORATION_THRESHOLD: 0.6, CONSOLIDATION_THRESHOLD: 0.7, INQUIRY_THRESHOLD: 0.5, BOREDOM_ACTION_THRESHOLD: 0.4,
    RAJAS_TURBULENCE_LOAD: 0.7, RAJAS_TURBULENCE_FAILURE_RATE: 0.5, POST_RAJAS_EXHAUSTION: 0.9, TAMASIC_INERTIA_UNCERTAINTY: 0.7,
    LOW_HAPPINESS_THRESHOLD: 0.5, LOW_LOVE_THRESHOLD: 0.5, LOW_ENLIGHTENMENT_THRESHOLD: 0.4, LOW_WISDOM_THRESHOLD: 0.6,
};

export const InternalStateEvents = {
    NEW_INFO_PROCESSED: "new_info_processed", TASK_COMPLETED_SUCCESSFULLY: "task_completed_successfully", UNCERTAINTY_DETECTED: "uncertainty_detected",
    UNCERTAINTY_RESOLVED: "uncertainty_resolved", TASK_REPETITION_DETECTED: "task_repetition_detected", GOAL_DRIVEN_NOVELTY: "goal_driven_novelty",
};

export const Skills = {
    DEDUCTIVE_REASONING: 'DEDUCTIVE_REASONING', HYBRID_REASONING: 'HYBRID_REASONING', HYPOTHETICAL_REASONING: 'HYPOTHETICAL_REASONING',
    PROBABILISTIC_REASONING: 'PROBABILISTIC_REASONING', CALULATION: 'CALCULATION', INFORMATION_RETRIEVAL: 'INFORMATION_RETRIEVAL',
    CODE_GENERATION: 'CODE_GENERATION', TEXT_GENERATION: 'TEXT_GENERATION', VISION: 'VISION', REFINEMENT: 'REFINEMENT', HELP: 'HELP', UNKNOWN: 'UNKNOWN'
} as const;

export const ALL_AURA_KEYS = [ CHAT_HISTORY_KEY, KNOWLEDGE_GRAPH_KEY, GOALS_KEY, PERFORMANCE_LOGS_KEY, LIMITATIONS_KEY, INTERNAL_STATE_KEY, ARCH_PROPOSALS_KEY, COGNITIVE_ARCH_KEY, COGNITIVE_GAIN_LOG_KEY, CAUSAL_SELF_MODEL_KEY, SYSTEM_SNAPSHOTS_KEY, MODIFICATION_LOG_KEY, RECENT_CAPABILITIES_KEY, THEME_KEY, SELF_AWARENESS_METRICS_KEY, GUNA_CALIBRATOR_KEY, COGNITIVE_MODE_LOG_KEY, DISCIPLINE_STATE_KEY, USER_MODEL_KEY, CURIOSITY_MODEL_KEY, INGENUITY_STATE_KEY, RIE_STATE_KEY, MOTIVATIONAL_CALIBRATOR_KEY, INTUITION_ENGINE_KEY, INTUITIVE_LEAPS_KEY, RESOURCE_MONITOR_KEY, INTERNAL_STATE_HISTORY_KEY, WORKING_MEMORY_KEY, PROACTIVE_ENGINE_KEY, ETHICAL_GOVERNOR_KEY ];