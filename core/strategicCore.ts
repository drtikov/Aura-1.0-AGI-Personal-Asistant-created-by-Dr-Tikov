// core/strategicCore.ts
// FIX: Imported missing type
import { AuraState, GameAction, RIEInsight, KnowledgeFact } from '../types';
import { clamp } from '../utils';

/**
 * The "Value Network" for the Game of Symbiotic Flourishing.
 * Calculates a single "Flourishing Index" score for any given state of Aura.
 * This score represents the overall health and strategic desirability of the state.
 */
export const calculateFlourishingIndex = (state: AuraState): number => {
    const { internalState, userModel, rieState, knowledgeGraph } = state;

    // 1. Internal Harmony ("Citizen Happiness")
    const internalHarmony =
        (internalState.wisdomSignal * 0.25) +
        (internalState.happinessSignal * 0.15) +
        (internalState.loveSignal * 0.1) -
        (internalState.boredomLevel * 0.2) -
        (internalState.load * 0.1);

    // 2. Symbiotic Alignment ("Foreign Relations")
    const symbioticAlignment =
        (userModel.trustLevel * 0.3) +
        (userModel.sentimentScore * 0.1) - // Assuming sentiment is -1 to 1
        (userModel.userModelUncertainty * 0.2);

    // 3. Evolutionary Progress ("Infrastructure & Research")
    const evolutionaryProgress =
        (rieState.clarityScore * 0.15) + // Self-model clarity as a proxy for codebase health
        (Math.log1p(knowledgeGraph.length) / 10 * 0.05); // Log scale for knowledge growth

    // Weighted sum of the components. The total weights add up to ~1.3, allowing for scores > 1.
    const flourishingIndex = internalHarmony + symbioticAlignment + evolutionaryProgress;

    return flourishingIndex;
};


/**
 * The local simulation engine for the "Go" layer.
 * Predicts the likely immediate outcome of a given action on Aura's state.
 * This is a fast, non-LLM function that applies heuristic changes.
 */
export const predictStateChange = (action: GameAction, currentState: AuraState): AuraState => {
    // Deep clone to avoid mutating the original state during simulation
    const nextState = JSON.parse(JSON.stringify(currentState));

    switch (action) {
        case GameAction.CONCEPTUAL_SYNTHESIS:
            nextState.internalState.noveltySignal = clamp(currentState.internalState.noveltySignal + 0.2);
            nextState.internalState.boredomLevel = clamp(currentState.internalState.boredomLevel - 0.15);
            break;

        case GameAction.FAST_TRACK_AUDIT:
            nextState.rieState.clarityScore = clamp(currentState.rieState.clarityScore + 0.05);
            break;

        case GameAction.SYMBIOTIC_ANALYSIS:
            // Simulates adding a few facts
            const newFact: KnowledgeFact = { id: 'sim', subject: 'sim', predicate: 'is', object: 'sim', confidence: 1, source: 'deduction', strength: 1, lastAccessed: 0 };
            nextState.knowledgeGraph.push(newFact, newFact);
            break;

        case GameAction.PROACTIVE_INQUIRY:
        case GameAction.CONCEPTUAL_PROBING:
            nextState.userModel.userModelUncertainty = clamp(currentState.userModel.userModelUncertainty - 0.3);
            nextState.userModel.trustLevel = clamp(currentState.userModel.trustLevel + 0.02);
            break;
        
        case GameAction.SENTIMENT_ANALYSIS_REVIEW:
            nextState.userModel.userModelUncertainty = clamp(currentState.userModel.userModelUncertainty - 0.1);
            break;

        // Default case: Assume no significant immediate state change for other actions
        default:
            break;
    }
    
    // Apply a small load cost for taking an action
    nextState.internalState.load = clamp(currentState.internalState.load + 0.05);

    return nextState;
};

/**
 * Returns a list of all available strategic actions (GameActions).
 */
export const getGameActions = (): GameAction[] => {
    return Object.values(GameAction);
};