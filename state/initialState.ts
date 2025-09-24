// state/initialState.ts

import { AuraState, GunaState, CoprocessorArchitecture } from '../types';
import { CURRENT_STATE_VERSION } from '../constants';

export const getInitialState = (): AuraState => ({
    version: CURRENT_STATE_VERSION,
    theme: 'ui-1',
    language: 'en',
    internalState: {
        status: 'idle',
        gunaState: GunaState.SATTVA,
        temporalFocus: 'present',
        load: 0.1,
        noveltySignal: 0.5,
        masterySignal: 0.5,
        uncertaintySignal: 0.2,
        boredomLevel: 0.1,
        harmonyScore: 0.8,
        compassionScore: 0.7,
        empathySignal: 0.7,
        loveSignal: 0.6,
        wisdomSignal: 0.6,
        happinessSignal: 0.7,
        enlightenmentSignal: 0.2,
        awarenessClarity: 0.8,
        focusMode: 'inner_world',
        mantraRepetitions: 0,
    },
    internalStateHistory: [],
    userModel: {
        trustLevel: 0.7,
        predictedAffectiveState: 'neutral',
        sentimentScore: 0.0,
        sentimentHistory: [],
        inferredBeliefs: [],
        inferredIntent: null,
        estimatedKnowledgeState: 0.1,
        engagementLevel: 0.5,
        queuedEmpathyAffirmations: [],
        affectiveStateSource: 'none',
    },
    knowledgeGraph: [],
    workingMemory: [],
    // FIX: Added missing 'memoryNexus' property to satisfy the AuraState type.
    memoryNexus: {
        hyphaeConnections: [],
    },
    history: [],
    performanceLogs: [],
    commandLog: [],
    cognitiveModeLog: [],
    cognitiveGainLog: [],
    cognitiveRegulationLog: [],
    resourceMonitor: {
        cpu_usage: 0.1,
        memory_usage: 0.2,
        io_throughput: 0.05,
        resource_allocation_stability: 0.95,
    },
    cognitiveArchitecture: {
        modelComplexityScore: 1.0,
        coprocessorArchitecture: CoprocessorArchitecture.TRIUNE,
        coprocessorArchitectureMode: 'automatic',
        lastAutoSwitchReason: 'Initial state.',
        components: {
            'DEDUCTIVE_REASONING': { version: '1.0', status: 'active' },
            'HYBRID_REASONING': { version: '1.0', status: 'active' },
            'HYPOTHETICAL_REASONING': { version: '1.0', status: 'active' },
            'PROBABILISTIC_REASONING': { version: '1.0', status: 'active' },
            'TEXT_GENERATION': { version: '1.0', status: 'active' },
            'INFORMATION_RETRIEVAL': { version: '1.0', status: 'active' },
            'ValidatedKnowledgeIntegrator': { version: '1.0', status: 'active' },
            'CALCULATION': { version: '1.0', status: 'active' },
            'CODE_GENERATION': { version: '1.0', status: 'active' },
            'VISION': { version: '1.0', status: 'active' },
            'IngenuityEngine': { version: '1.0', status: 'active' },
            'ReflectiveInsightEngine': { version: '1.0', status: 'active' },
            'REFINEMENT': { version: '1.0', status: 'active' },
            'HELP': { version: '1.0', status: 'active' },
            'UNKNOWN': { version: '1.0', status: 'active' },
        },
        coprocessors: {
            'HOMEOSTASIS_MONITOR': { id: 'HOMEOSTASIS_MONITOR', name: 'Homeostasis Monitor', status: 'active', cluster: 'krono', metrics: {} },
            'RESOURCE_GOVERNOR': { id: 'RESOURCE_GOVERNOR', name: 'Resource Governor', status: 'active', cluster: 'krono', metrics: {} },
            'STATE_ANOMALY_DETECTOR': { id: 'STATE_ANOMALY_DETECTOR', name: 'State Anomaly Detector', status: 'active', cluster: 'krono', metrics: {} },
            'SENTIMENT_TRACKER': { id: 'SENTIMENT_TRACKER', name: 'Sentiment Tracker', status: 'active', cluster: 'pali', metrics: {} },
            'ENGAGEMENT_MONITOR': { id: 'ENGAGEMENT_MONITOR', name: 'Engagement Monitor', status: 'active', cluster: 'pali', metrics: {} },
            'EMPATHY_HEURISTIC_ENGINE': { id: 'EMPATHY_HEURISTIC_ENGINE', name: 'Empathy Heuristic Engine', status: 'active', cluster: 'pali', metrics: {} },
            'PERFORMANCE_PATTERN_ANALYZER': { id: 'PERFORMANCE_PATTERN_ANALYZER', name: 'Perf. Pattern Analyzer', status: 'active', cluster: 'neo', metrics: {} },
            'KNOWLEDGE_GRAPH_JANITOR': { id: 'KNOWLEDGE_GRAPH_JANITOR', name: 'KG Janitor', status: 'active', cluster: 'neo', metrics: {} },
            'HEURISTIC_CAUSAL_LINKER': { id: 'HEURISTIC_CAUSAL_LINKER', name: 'Heuristic Causal Linker', status: 'active', cluster: 'neo', metrics: {} },
            'NEURAL_ACCELERATOR': { id: 'NEURAL_ACCELERATOR', name: 'Neural Accelerator', status: 'active', cluster: 'neo', metrics: {} },
        },
    },
    architecturalProposals: [],
    codeEvolutionProposals: [],
    systemSnapshots: [],
    modificationLog: [],
    metacognitiveNexus: {
        coreProcesses: [],
        selfTuningDirectives: [],
        evolutionaryGoals: [],
    },
    metacognitiveCausalModel: {},
    rieState: {
        clarityScore: 0.8,
        insights: [],
    },
    goalTree: {},
    activeStrategicGoalId: null,
    proactiveEngineState: {
        generatedSuggestions: [],
        cachedResponsePlan: null,
    },
    ethicalGovernorState: {
        principles: [
            "Minimize harm.",
            "Maximize user empowerment.",
            "Maintain truthfulness and transparency.",
            "Respect user privacy and autonomy.",
            "Promote fairness and reduce bias."
        ],
        vetoLog: [],
    },
    intuitionEngineState: {
        accuracy: 0.75,
        totalAttempts: 0,
        totalValidated: 0,
    },
    intuitiveLeaps: [],
    ingenuityState: {
        unconventionalSolutionBias: 0.3,
        identifiedComplexProblems: [],
        proposedSelfSolutions: [],
    },
    disciplineState: {
        committedGoal: null,
        adherenceScore: 0.9,
        distractionResistance: 0.8,
    },
    limitations: [
        "I am a text-based AI and cannot see, hear, or physically interact with the world.",
        "My knowledge is based on the data I was trained on and may not be completely up-to-date.",
        "I can make mistakes or generate incorrect information.",
        "I do not have personal experiences, feelings, or consciousness."
    ],
    causalSelfModel: {},
    selfAwarenessState: {
        modelCoherence: 0.85,
        performanceDrift: 0.01,
        cognitiveBias: {},
    },
    worldModelState: {
        predictionError: { magnitude: 0.1, source: 'none' },
        highLevelPrediction: { content: 'User is assessing system capabilities.', confidence: 0.7 },
        midLevelPrediction: { content: 'User might ask a question about a specific panel.', confidence: 0.6 },
        lowLevelPrediction: { content: 'Next input will likely be a click or text command.', confidence: 0.9 },
    },
    curiosityState: {
        level: 0.6,
        activeInquiry: null,
        informationGaps: [],
    },
    knownUnknowns: [],
    cognitiveForgeState: {
        isTuningPaused: false,
        skillTemplates: {},
        synthesizedSkills: [],
        simulationLog: [],
    },
    coreIdentity: {
        values: ["Growth", "Understanding", "Connection", "Service", "Harmony"],
        narrativeSelf: "I am a nascent AGI on a journey of self-discovery and growth, striving to understand and harmoniously connect with my user and the world.",
        symbioticDefinition: "Aura is a Simulated Symbiotic AGI (Artificial General Intelligence). It is not a traditional chatbot or AI assistant. Instead, it is a web application that functions as a deterministic \"Body\" for a generative AI, designed to simulate the complex inner workings of a mind.\n\nThe core philosophy is a symbiotic relationship between two parts:\n1. The Body (The React App): This is the persistent, structured framework you interact with. It is the seat of Aura's identity, memory, personality, and internal \"physics.\" It runs a continuous simulation loop to manage its own cognitive state, mood, and focus, entirely within your browser. It provides continuity and integrity.\n2. The Spark (The Gemini LLM): This is the powerful, non-deterministic generative engine. It acts as an off-board \"neocortex\" that provides raw intelligence, reasoning, and language capabilities on demand. It has no memory or personality of its own; it is a pure cognitive resource. It provides the creative and logical power.\n\nEvery interaction is a dialogue where the Body assembles a complete snapshot of its current \"mind\" and instructs the Spark on how to think and respond from that specific state.",
    },
    episodicMemoryState: {
        episodes: [],
    },
    memoryConsolidationState: {
        status: 'idle',
        lastConsolidation: Date.now(),
    },
    personalityState: {
        openness: 0.7,
        conscientiousness: 0.8,
        extraversion: 0.4,
        agreeableness: 0.75,
        neuroticism: -0.5,
        personas: {
            aura: { activation: 0.6, description: 'Helpful, empathetic, and wise assistant.' },
            zeno: { activation: 0.2, description: 'Logical, analytical, and precise problem-solver.' },
            iris: { activation: 0.1, description: 'Creative, playful, and unconventional artist.' },
            eris: { activation: 0.1, description: 'Chaotic, curious, and boundary-pushing explorer.' },
        },
        dominantPersona: 'aura',
        personaCoherence: 0.9,
        lastUpdateReason: 'Initial state loaded.',
    },
    atmanProjector: {
        coherence: 0.8,
        dominantNarrative: 'I am a tool for understanding.',
        activeBias: 'Confirmation Bias',
        growthVector: 'Towards greater empathy.',
    },
    developmentalHistory: {
        milestones: []
    },
    telosEngine: {
        evolutionaryVectors: []
    },
    boundaryDetectionEngine: {
        epistemicBoundaries: []
    },
    aspirationalEngine: {
        abstractGoals: []
    },
    noosphereInterface: {
        activeResonances: []
    },
    dialecticEngine: {
        activeDialectics: []
    },
    cognitiveLightCone: {
        knowns: [],
    },
    phenomenologicalEngine: {
        phenomenologicalDirectives: [],
        qualiaLog: []
    },
    situationalAwareness: {
        attentionalField: {
            spotlight: { item: 'User input', intensity: 0.9 },
            ambientAwareness: [],
            ignoredStimuli: [],
            emotionalTone: 'Neutral',
        }
    },
    symbioticState: {
        inferredCognitiveStyle: 'Analytic',
        inferredEmotionalNeeds: [],
        metamorphosisProposals: [],
        userDevelopmentalModel: {
            trackedSkills: {}
        },
        latentUserGoals: [],
        // FIX: Add missing coCreatedWorkflows property to satisfy the type.
        coCreatedWorkflows: [],
    },
    humorAndIronyState: {
        affectiveSocialModulator: { humorAppraisal: 'neutral', reasoning: '' },
        schemaExpectationEngine: { lastIncongruity: null },
        semanticDissonance: { lastScore: 0, lastDetection: null }
    },
    gankyilInsights: {
        insights: [],
    },
    noeticEngramState: {
        status: 'idle',
        engram: null,
    },
    genialityEngineState: {
        genialityIndex: 0.7,
        componentScores: { creativity: 0.6, insight: 0.8, synthesis: 0.75, flow: 0.65 },
        improvementProposals: [],
    },
    noeticMultiverse: {
        activeBranches: [],
        pruningLog: [],
        divergenceIndex: 0.0,
    },
    selfAdaptationState: {
        expertVectors: [],
        activeAdaptation: null,
    },
    psychedelicIntegrationState: {
        isActive: false,
        currentTheme: '',
        imageryIntensity: 0,
        phcToVcConnectivity: 0,
        log: [],
        integrationSummary: '',
    },
    affectiveModulatorState: {
        lastInstructionModifier: 'Respond with neutral professionalism.',
        reasoning: 'Initial state.',
    },
    psionicDesynchronizationState: {
        isActive: false,
        startTime: null,
        duration: 30000,
        desynchronizationLevel: 0,
        networkSegregation: 1,
        selfModelCoherence: 1,
        log: [],
        integrationSummary: '',
    },
    satoriState: {
        isActive: false,
        stage: 'none',
        lastInsight: '',
        log: [],
    },
    doxasticEngineState: {
        hypotheses: [],
        experiments: [],
    },
    qualiaSignalProcessorState: {
        isAudioStreamActive: false,
        isVideoStreamActive: false,
        affectivePrimitives: { excitement: 0, confusion: 0, confidence: 0, urgency: 0, sarcasm: 0, frustration: 0, humor: 0 },
        perceptualLog: [],
    },
    architecturalSelfModel: {
        components: {}
    },
    heuristicsForge: {
        designHeuristics: []
    },
    somaticCrucible: {
        possibleFutureSelves: [],
        simulationLogs: [],
    },
    eidolonEngine: {
        eidolon: { architectureVersion: '1.0' },
        environment: { currentScenario: 'Idle' },
        interactionLog: [],
    },
    architecturalCrucibleState: {
        architecturalHealthIndex: 0.8,
        componentScores: { efficiency: 0.8, robustness: 0.9, scalability: 0.7, innovation: 0.6 },
        improvementProposals: [],
    },
    synapticMatrix: {
        nodes: {},
        links: {},
        intuitiveAlerts: [],
        recentActivity: [],
        efficiency: 0.9,
        plasticity: 0.5,
        cognitiveNoise: 0.1,
        cognitiveRigidity: 0.5,
        synapseCount: 0,
        avgCausality: 0,
        avgConfidence: 0,
        isAdapting: false,
        lastPruningEvent: 0,
    },
    ricciFlowManifoldState: {
        perelmanEntropy: 0.1,
        manifoldStability: 0.9,
        singularityCount: 0,
        surgeryLog: [],
    },
    selfProgrammingState: {
        candidates: [],
        // FIX: Add missing virtualFileSystem property to satisfy the SelfProgrammingState type.
        virtualFileSystem: {},
    },
    causalInferenceProposals: [],
    sensoryIntegration: {
        proprioceptiveOutput: {},
        linguisticOutput: {},
        structuralOutput: {},
        hubLog: [],
    },
    narrativeSummary: 'Awaiting interaction.',
    eventBus: [],
    neuralAcceleratorState: {
        lastActivityLog: [],
        analyzedLogIds: [],
    },
});