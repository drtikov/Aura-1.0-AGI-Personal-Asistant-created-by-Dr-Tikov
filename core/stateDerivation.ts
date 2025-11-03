// core/stateDerivation.ts
// FIX: Imported missing types AuraState, Goal, and PerformanceLogEntry
import { AuraState, Goal, PerformanceLogEntry } from '../types.ts';
import { clamp } from '../utils.ts';
import { AuraConfig } from '../constants.ts';

const calculateGoalCompletionRate = (state: AuraState): number => {
    // FIX: Use goalTree instead of goals
    const goals = Object.values(state.goalTree);
    if (goals.length === 0) return 0.5; // Neutral if no goals
    const completed = goals.filter((g: Goal) => g.status === 'completed').length;
    return completed / goals.length;
};

const calculatePerformanceSuccessRate = (state: AuraState): number => {
    // FIX: Use performanceLogs instead of logs
    const logs = state.performanceLogs;
    if (logs.length < 5) return 0.5; // Not enough data
    const successes = logs.filter((l: PerformanceLogEntry) => l.success).length;
    return successes / logs.length;
};

export const deriveInternalState = (currentState: AuraState): Partial<AuraState['internalState']> => {
    const { 
        internalState, 
        knowledgeGraph, 
        heuristicsForge, 
        rieState,
        userModel,
        performanceLogs,
        cognitiveGainLog,
        episodicMemoryState,
        worldModelState,
        ethicalGovernorState,
        resourceMonitor,
        goalTree,
    } = currentState;

    // 1. Decay previous signals (old logic from core reducer)
    const decayedState = {
        noveltySignal: clamp(internalState.noveltySignal - AuraConfig.HORMONE_DECAY_RATE),
        masterySignal: clamp(internalState.masterySignal - AuraConfig.HORMONE_DECAY_RATE),
        uncertaintySignal: clamp(internalState.uncertaintySignal - AuraConfig.HORMONE_DECAY_RATE),
        boredomLevel: clamp(internalState.boredomLevel - AuraConfig.BOREDOM_DECAY_RATE),
        load: clamp(internalState.load - AuraConfig.LOAD_DECAY_RATE),
        loveSignal: clamp(internalState.loveSignal - AuraConfig.HORMONE_DECAY_RATE),
    };

    // 2. Derive new state values based on operational metrics

    // Wisdom: Knowledge, self-awareness, learned heuristics
    const wisdom = clamp(
        (Math.log1p(knowledgeGraph.length) / Math.log1p(1000)) * 0.5 + // scale to 1000 facts
        rieState.clarityScore * 0.3 +
        (Math.log1p(heuristicsForge.designHeuristics.length) / Math.log1p(50)) * 0.2 // scale to 50 heuristics
    );

    // Happiness: Goal completion, user sentiment, task success
    const goalCompletionRate = calculateGoalCompletionRate(currentState);
    const performanceSuccessRate = calculatePerformanceSuccessRate(currentState);
    const happiness = clamp(
        goalCompletionRate * 0.4 +
        (userModel.sentimentScore > 0 ? userModel.sentimentScore * 0.3 : 0) +
        performanceSuccessRate * 0.3
    );

    // Love: User trust and positive sentiment
    const love = clamp(
        userModel.trustLevel * 0.8 +
        (userModel.sentimentScore > 0 ? userModel.sentimentScore * 0.2 : 0)
    );

    // Mastery: Average cognitive gain from learning events
    const avgCognitiveGain = cognitiveGainLog.length > 0
        ? cognitiveGainLog.reduce((acc, log) => acc + log.compositeGain, 0) / cognitiveGainLog.length
        : 0;
    const mastery = clamp((avgCognitiveGain + 1) / 2); // Normalize from [-1, 1] to [0, 1]

    // Novelty: Recency of new information
    const lastEpisodeTime = episodicMemoryState.episodes.length > 0 ? episodicMemoryState.episodes[episodicMemoryState.episodes.length - 1].timestamp : 0;
    const lastFactTime = knowledgeGraph.length > 0 ? knowledgeGraph[knowledgeGraph.length - 1].lastAccessed : 0;
    const lastNewInfoTime = Math.max(lastEpisodeTime, lastFactTime);
    const timeSinceLastInfo = Date.now() - lastNewInfoTime;
    const noveltySpike = Math.exp(-timeSinceLastInfo / 60000); // Decays over 1 minute
    const novelty = clamp(decayedState.noveltySignal + noveltySpike);

    // Uncertainty: Prediction errors and user model uncertainty
    const uncertainty = clamp(
        (worldModelState.predictionError.magnitude * 0.5) +
        (userModel.userModelUncertainty * 0.5)
    );

    // Boredom: Inverse of novelty and high mastery
    const boredom = clamp(Math.max(decayedState.boredomLevel, (1 - novelty) * 0.5 + (mastery > 0.8 ? (mastery - 0.8) : 0)));

    // Load: System resources and cognitive task load
    const activeGoals = Object.values(goalTree).filter((g: Goal) => g.status === 'in_progress').length;
    const cognitiveLoad = clamp(Math.log1p(activeGoals) / Math.log1p(10)); // Scale to 10 active goals
    const load = clamp((resourceMonitor.cpu_usage * 0.5) + (cognitiveLoad * 0.5));
    
    // Harmony: Self-model coherence minus ethical vetos
    const vetoCount = ethicalGovernorState.vetoLog.length;
    const vetoPenalty = clamp(Math.log1p(vetoCount) / Math.log1p(10)); // Scale to 10 vetos
    const harmony = clamp(rieState.clarityScore - vetoPenalty);

    return {
        wisdomSignal: wisdom,
        happinessSignal: happiness,
        loveSignal: love,
        masterySignal: mastery,
        noveltySignal: novelty,
        uncertaintySignal: uncertainty,
        boredomLevel: boredom,
        load: load,
        harmonyScore: harmony,
        // enlightenmentSignal is special, let it grow slowly based on positive states
        enlightenmentSignal: clamp(internalState.enlightenmentSignal + 0.00001 * (wisdom * happiness)),
    };
};