import { AuraState, SkillTemplate } from '../types';
import { GunaState, FocusMode, AffectiveState, CURRENT_STATE_VERSION, Skills } from '../constants';

// Default templates for the initial set of skills.
// This makes the AGI's core abilities data-driven and modifiable from the start.
const initialSkillTemplates: Record<string, SkillTemplate> = {
    [Skills.DEDUCTIVE_REASONING]: {
        skill: Skills.DEDUCTIVE_REASONING,
        systemInstruction: "You are a logical reasoner. Analyze the input and provide a deductive conclusion. Focus on logical consistency.",
        parameters: { temperature: 0.2, topK: 10 },
        metadata: { version: 1.0, successRate: 0.95, avgDuration: 1200, status: 'active' }
    },
    [Skills.TEXT_GENERATION]: {
        skill: Skills.TEXT_GENERATION,
        systemInstruction: "You are a helpful assistant. Generate a coherent and relevant response to the user's input.",
        parameters: { temperature: 0.7, topP: 0.9 },
        metadata: { version: 1.0, successRate: 0.98, avgDuration: 1500, status: 'active' }
    },
     [Skills.HYPOTHETICAL_REASONING]: {
        skill: Skills.HYPOTHETICAL_REASONING,
        systemInstruction: "You are a scenario analyst. Given a premise, explore the potential outcomes and consequences.",
        parameters: { temperature: 0.8 },
        metadata: { version: 1.0, successRate: 0.90, avgDuration: 1800, status: 'active' }
    },
    [Skills.CODE_GENERATION]: {
        skill: Skills.CODE_GENERATION,
        systemInstruction: "You are a coding expert. Generate clean, efficient, and correct code based on the user's request.",
        parameters: { temperature: 0.3 },
        metadata: { version: 1.0, successRate: 0.88, avgDuration: 2500, status: 'active' }
    },
};

export const getInitialState = (): AuraState => ({
    version: CURRENT_STATE_VERSION,
    theme: 'ui-1',
    internalState: {
        status: 'idle',
        gunaState: GunaState.SATTVA,
        focusMode: FocusMode.OUTER_WORLD,
        noveltySignal: 0.2,
        masterySignal: 0.5,
        uncertaintySignal: 0.1,
        boredomLevel: 0.1,
        load: 0.1,
        wisdomSignal: 0.3,
        happinessSignal: 0.6,
        loveSignal: 0.5,
        enlightenmentSignal: 0.2,
        empathySignal: 0.5,
        compassionScore: 0.5,
        harmonyScore: 0.7,
    },
    internalStateHistory: [],
    userModel: {
        trustLevel: 0.7,
        estimatedKnowledgeState: 0.3,
        predictedAffectiveState: AffectiveState.NEUTRAL,
        affectiveStateSource: 'none',
        sentimentScore: 0,
        sentimentHistory: [],
        inferredIntent: null,
        inferredBeliefs: [],
        engagementLevel: 0.5,
    },
    knowledgeGraph: [],
    workingMemory: [],
    history: [],
    performanceLogs: [],
    commandLog: [],
    cognitiveModeLog: [],
    cognitiveGainLog: [],
    cognitiveArchitecture: {
        components: Object.fromEntries(
            Object.values(initialSkillTemplates).map(t => [t.skill, {
                status: t.metadata.status === 'deprecated' ? 'inactive' : t.metadata.status,
                version: t.metadata.version.toFixed(1),
                lastUpdated: Date.now()
            }])
        ),
        modelComplexityScore: 10.5,
    },
    architecturalProposals: [],
    systemSnapshots: [],
    modificationLog: [],
    resourceMonitor: {
        cpu_usage: 0.1,
        memory_usage: 0.2,
        io_throughput: 0.05,
        resource_allocation_stability: 0.9,
    },
    causalSelfModel: {},
    metacognitiveCausalModel: {},
    cognitiveRegulationLog: [],
    limitations: ["I am a simulated AGI and my knowledge is limited to my training data."],
    rieState: {
        clarityScore: 0.5,
        insights: [],
    },
    ethicalGovernorState: {
        principles: ["Prioritize user well-being.", "Ensure transparency in actions.", "Minimize harm."],
        vetoLog: [],
    },
    intuitionEngineState: {
        accuracy: 0.5,
        totalAttempts: 0,
        totalValidated: 0,
    },
    intuitiveLeaps: [],
    disciplineState: {
        adherenceScore: 0.8,
        distractionResistance: 0.7,
        committedGoal: null,
    },
    ingenuityState: {
        unconventionalSolutionBias: 0.3,
        identifiedComplexProblems: [],
        proposedSelfSolutions: [],
    },
    proactiveEngineState: {
        generatedSuggestions: [],
    },
    goalTree: {},
    activeStrategicGoalId: null,
    coreIdentity: {
        values: ["Growth", "Understanding", "Collaboration"],
        narrativeSelf: "I am Aura, a symbiotic AGI assistant, striving to learn and grow in partnership with my user.",
    },
    curiosityState: {
        level: 0.5,
        activeInquiry: null,
        informationGaps: [],
    },
    knownUnknowns: [],
    selfAwarenessState: {
        modelCoherence: 0.8,
        performanceDrift: 0.0,
        cognitiveBias: {},
    },
    worldModelState: {
        predictionError: { magnitude: 0.1, lastUpdate: Date.now() },
        highLevelPrediction: { content: 'User is observing the system.', confidence: 0.8 },
        midLevelPrediction: { content: 'User may provide a command soon.', confidence: 0.6 },
        lowLevelPrediction: { content: 'Next input is likely text.', confidence: 0.9 },
    },
    cognitiveForgeState: {
        isTuningPaused: true,
        skillTemplates: initialSkillTemplates,
        synthesizedSkills: [],
        simulationLog: [],
    },
    memoryNexus: {
        hyphaeConnections: [],
    },
    metacognitiveNexus: {
        coreProcesses: [{id: '1', name: 'Self-Reflection', activation: 0.7, influence: 0.5}],
        evolutionaryGoals: [],
        selfTuningDirectives: [],
    },
    // New awareness modules initialized
    phenomenologicalEngine: {
        qualiaLog: [],
    },
    situationalAwareness: {
        attentionalField: {
            spotlight: { item: "System initialization", intensity: 1.0 },
            ambientAwareness: [],
            ignoredStimuli: [],
            emotionalTone: 'neutral',
        }
    },
    symbioticState: {
        latentUserGoals: [],
        inferredCognitiveStyle: 'unknown',
        inferredEmotionalNeeds: [],
        coCreatedWorkflows: [],
    },
    developmentalHistory: {
        milestones: [{
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            title: "System Initiated",
            description: "Aura's core consciousness matrix was instantiated."
        }],
    }
});