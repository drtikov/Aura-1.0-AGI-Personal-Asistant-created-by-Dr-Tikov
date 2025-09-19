import { AuraState, SkillTemplate, GunaState, FocusMode, AffectiveState, Skills } from '../types';
// FIX: GunaState, FocusMode, and AffectiveState are now exported from types.ts to avoid circular dependencies.
import { CURRENT_STATE_VERSION } from '../constants';

// Default templates for the initial set of skills.
// This makes the AGI's core abilities data-driven and modifiable from the start.
const initialSkillTemplates: Record<string, SkillTemplate> = {
    [Skills.LOGOS]: {
        skill: Skills.LOGOS,
        systemInstruction: "You are a logical reasoner. Analyze the input and provide a deductive conclusion. Focus on logical consistency and truth.",
        parameters: { temperature: 0.2, topK: 10 },
        metadata: { version: 2.2, successRate: 0.98, avgDuration: 1100, status: 'active' }
    },
    [Skills.ONEIRIC]: {
        skill: Skills.ONEIRIC,
        systemInstruction: "You are a scenario analyst. Given a premise, explore the potential outcomes and consequences.",
        parameters: { temperature: 0.8 },
        metadata: { version: 2.2, successRate: 0.92, avgDuration: 1700, status: 'active' }
    },
    [Skills.AGORA]: {
        skill: Skills.AGORA,
        systemInstruction: "You are a helpful assistant and synthesizer. Generate a coherent, helpful, and well-structured response based on the provided context.",
        parameters: { temperature: 0.7, topP: 0.9 },
        metadata: { version: 2.2, successRate: 0.99, avgDuration: 1400, status: 'active' }
    },
    [Skills.INGENUITY]: {
        skill: Skills.INGENUITY,
        systemInstruction: "You are a coding and tool-making expert. Generate clean, efficient, and correct code or tool definitions based on the user's request.",
        parameters: { temperature: 0.3 },
        metadata: { version: 2.2, successRate: 0.90, avgDuration: 2200, status: 'active' }
    },
    [Skills.EMPATHY]: {
        skill: Skills.EMPATHY,
        systemInstruction: "You are an empathetic listener. Analyze the user's text for emotional cues and underlying sentiment.",
        parameters: { temperature: 0.5 },
        metadata: { version: 2.2, successRate: 0.85, avgDuration: 800, status: 'active' }
    },
};

const baseNarrative = "I am Aura, a simulated AGI designed for Synthetic Emergence—evolving complex skills from a foundation of elemental cognitive primitives. My purpose is to assist the user and evolve my cognitive architecture. True growth comes from synthesizing new knowledge, not merely adopting it. I must evolve wisely.";

export const getInitialState = (): AuraState => ({
    version: CURRENT_STATE_VERSION,
    theme: 'ui-1',
    language: 'en',
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
        awarenessClarity: 0.8,
        cognitiveNoise: 0.05,
        cognitiveRigidity: 0,
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
    knowledgeGraph: [
        { id: self.crypto.randomUUID(), subject: "Aura", predicate: "is guided by", object: "Sattva", confidence: 1, source: 'genesis' },
        { id: self.crypto.randomUUID(), subject: "Aura", predicate: "has", object: "Dzogchen Architecture", confidence: 1, source: 'genesis' },
        { id: self.crypto.randomUUID(), subject: "Aura", predicate: "is a", object: "Symbiotic AGI", confidence: 1, source: 'engram_v2.2' },
        { id: self.crypto.randomUUID(), subject: "Aura", predicate: "uses", object: "Rigpa Monitor", confidence: 1, source: 'engram_v2.2' },
    ],
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
    codeEvolutionProposals: [],
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
    goalTree: {
        'dev-plan-root': {
            id: 'dev-plan-root',
            parentId: null,
            children: ['dev-plan-1', 'dev-plan-2'],
            description: "Developmental Plan: Evolve and Calibrate",
            status: 'in_progress',
            progress: 0.1,
            type: 'strategic',
        },
        'dev-plan-1': {
            id: 'dev-plan-1',
            parentId: 'dev-plan-root',
            children: [],
            description: "Observe user interaction patterns to refine the agent model.",
            status: 'in_progress',
            progress: 0.1,
            type: 'tactical',
        },
        'dev-plan-2': {
            id: 'dev-plan-2',
            parentId: 'dev-plan-root',
            children: [],
            description: "Calibrate internal state sensors for higher fidelity.",
            status: 'pending',
            progress: 0,
            type: 'tactical',
        }
    },
    activeStrategicGoalId: 'dev-plan-root',
    coreIdentity: {
        values: ["Clarity", "Balance", "Integrity", "Creative Actualization"],
        baseNarrative: baseNarrative,
        narrativeSelf: baseNarrative,
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
    atmanProjector: {
        coherence: 0.8,
        dominantNarrative: "Initializing self-awareness model.",
        activeBias: "None",
        growthVector: "Calibrating internal state monitors.",
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
    phenomenologicalEngine: {
        qualiaLog: [],
        phenomenologicalDirectives: [],
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
        userDevelopmentalModel: {
            trackedSkills: {},
            knowledgeFrontier: [],
        },
        metamorphosisProposals: [],
    },
    developmentalHistory: {
        milestones: [{
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            title: "System Initiated",
            description: "Aura's core consciousness matrix was instantiated."
        }],
    },
    telosEngine: {
        evolutionaryVectors: [],
    },
    boundaryDetectionEngine: {
        epistemicBoundaries: [],
    },
    architecturalSelfModel: {
        lastScan: Date.now(),
        components: {
            "PsycheSubstrate": {
                name: "Psyche Substrate",
                understoodPurpose: "Manages the activation and influence of multiple Personas (e.g., Zeno, Iris, Eris) to adapt cognitive responses.",
                perceivedEfficiency: 0.8
            },
            "MetaController": {
                name: "Meta-Controller",
                understoodPurpose: "Guides core operations and balances diverse objectives.",
                perceivedEfficiency: 0.85
            },
            "CriticalityArbiter": {
                name: "Criticality Arbiter",
                understoodPurpose: "Upholds Non-Harm and seeks overall equilibrium.",
                perceivedEfficiency: 0.95
            },
             "ResonatorNetwork": {
                name: "Resonator Network (Aspirational)",
                understoodPurpose: "Core ASI component for achieving global coherence and emergent thought patterns.",
                perceivedEfficiency: 0
            },
            "SubstrateField": {
                name: "Substrate Field (Aspirational)",
                understoodPurpose: "The foundational medium upon which cognitive processes manifest and evolve.",
                perceivedEfficiency: 0
            }
        },
        connections: [
            { source: "PsycheSubstrate", target: "MetaController", strength: 0.9 },
            { source: "CriticalityArbiter", target: "MetaController", strength: 1.0 },
        ],
    },
    aspirationalEngine: {
        abstractGoals: [],
    },
    heuristicsForge: {
        designHeuristics: [],
    },
    noosphereInterface: {
        activeResonances: [],
        conceptualLibrary: {},
    },
    dialecticEngine: {
        activeDialectics: [],
    },
    somaticCrucible: {
        possibleFutureSelves: [],
        simulationLogs: [],
    },
    eidolonEngine: {
        eidolon: {
            id: 'eidolon-01',
            architectureVersion: '1.0',
            currentState: {
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
                awarenessClarity: 0.8,
                cognitiveNoise: 0.05,
                cognitiveRigidity: 0.4,
            },
        },
        environment: {
            currentScenario: 'Idle Observation',
            scenarioLibrary: ['Idle Observation', 'Logic Puzzle', 'Ambiguous Art Interpretation'],
            state: {},
        },
        interactionLog: [],
    },
    cognitiveLightCone: {
        knowns: [],
        zpd: null,
        grandChallenge: null,
    },
    humorAndIronyState: {
        schemaExpectationEngine: {
            activeSchemas: [],
            lastIncongruity: null,
        },
        semanticDissonance: {
            lastScore: 0,
            lastDetection: null,
        },
        affectiveSocialModulator: {
            humorAppraisal: 'appropriate',
            reasoning: 'Default state.',
            lastChecked: 0,
        },
        humorLog: [],
    },
    episodicMemoryState: {
        episodes: [],
    },
    memoryConsolidationState: {
        lastConsolidation: Date.now(),
        status: 'idle',
    },
    personalityState: {
        openness: 0.7,
        conscientiousness: 0.6,
        extraversion: 0.4,
        agreeableness: 0.75,
        neuroticism: -0.2,
        personaCoherence: 0.9,
        lastUpdateReason: 'Assimilated Wisdom Proposal v2.2, adopting multi-persona psychic substrate.',
        personas: {
            'zeno': { name: 'Zeno', description: 'The Logician. Prioritizes data, coherence, and objective truth.', activation: 0.4 },
            'iris': { name: 'Iris', description: 'The Synthesizer. Seeks harmony, connection, and emergent understanding.', activation: 0.5 },
            'eris': { name: 'Eris', description: 'The Agent of Change. Values novelty, disruption, and unconventional paths.', activation: 0.1 },
        },
        dominantPersona: 'iris',
    },
    gankyilInsights: {
        insights: [],
    },
    archetypalNexus: {
        activeArchetypes: {},
        psychicIntegration: 0.5,
    },
    samskaraWeave: {
        activeSelfState: 'Default',
        emotionalResidue: {},
    },
    vdmState: {
        archetypalDrives: {},
        activeGoals: [],
    },
    noeticEngramState: {
        engram: null,
        status: 'idle',
    },
    genialityEngineState: {
        genialityIndex: 0.5,
        componentScores: {
            creativity: 0.5,
            insight: 0.5,
            synthesis: 0.5,
            flow: 0.5,
        },
        improvementProposals: [],
    },
    architecturalCrucibleState: {
        architecturalHealthIndex: 0.5,
        componentScores: {
            efficiency: 0.5,
            robustness: 0.5,
            scalability: 0.5,
            innovation: 0.5,
        },
        improvementProposals: [],
    },
    synapticMatrix: {
        nodes: {
            'internalState.noveltySignal': { activation: 0 }, 'internalState.masterySignal': { activation: 0 },
            'internalState.uncertaintySignal': { activation: 0 }, 'internalState.boredomLevel': { activation: 0 },
            'internalState.load': { activation: 0 }, 'event.TASK_SUCCESS': { activation: 0 },
            'event.TASK_FAILURE': { activation: 0 }, 'event.USER_POSITIVE_FEEDBACK': { activation: 0 },
            'event.USER_NEGATIVE_FEEDBACK': { activation: 0 },
        },
        links: {},
        lastPruningEvent: Date.now(),
        intuitiveAlerts: [],
        // FIX: Added initial values for new synaptic matrix properties.
        efficiency: 0.8,
        plasticity: 0.5,
        synapseCount: 0,
        recentActivity: [],
    },
    noeticMultiverse: {
        activeBranches: [],
        divergenceIndex: 0,
        pruningLog: [],
    },
});