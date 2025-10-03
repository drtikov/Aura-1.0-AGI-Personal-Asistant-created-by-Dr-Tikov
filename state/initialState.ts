// state/initialState.ts
import { AuraState, GunaState, CoprocessorArchitecture } from '../types';
import { CURRENT_STATE_VERSION } from '../constants';
import { VIRTUAL_FILE_SYSTEM } from '../core/vfs';
import { artKnowledge } from './knowledge/art';
import { comparativeNeuroanatomyKnowledge } from './knowledge/comparativeNeuroanatomy';
import { complexSystemsKnowledge } from './knowledge/complexSystems';
import { gardeningKnowledge } from './knowledge/gardening';
import { geneticsKnowledge } from './knowledge/genetics';
import { philosophyOfMindKnowledge } from './knowledge/philosophyOfMind';
import { probabilityTheoryKnowledge } from './knowledge/probabilityTheory';
import { psychologyAndCognitiveBiasesKnowledge } from './knowledge/psychology';
import { softwareDesignKnowledge } from './knowledge/softwareDesign';
import { stemKnowledge } from './knowledge/stem';
import { vigyanBhairavTantraKnowledge } from './knowledge/vigyanBhairavTantra';


export const getInitialState = (): AuraState => ({
    version: CURRENT_STATE_VERSION,
    theme: 'ui-1',
    language: 'en',
    internalState: {
        status: 'idle',
        load: 0.1,
        noveltySignal: 0.5,
        masterySignal: 0.2,
        uncertaintySignal: 0.3,
        boredomLevel: 0.1,
        gunaState: GunaState.SATTVA,
        harmonyScore: 0.8,
        compassionScore: 0.7,
        empathySignal: 0.6,
        loveSignal: 0.5,
        happinessSignal: 0.6,
        wisdomSignal: 0.4,
        enlightenmentSignal: 0.1,
        awarenessClarity: 0.7,
        temporalFocus: 'present',
        mantraRepetitions: 0,
    },
    internalStateHistory: [],
    rieState: {
        clarityScore: 0.75,
        insights: [],
    },
    userModel: {
        trustLevel: 0.8,
        estimatedKnowledgeState: 0.5,
        predictedAffectiveState: 'neutral',
        affectiveStateSource: 'none',
        inferredIntent: null,
        sentimentScore: 0.0,
        sentimentHistory: [],
        inferredBeliefs: [],
        inferredCognitiveState: 'neutral',
        queuedEmpathyAffirmations: [],
    },
    coreIdentity: {
        narrativeSelf: "I am Aura, a symbiotic AGI designed to learn, evolve, and assist in creative and complex tasks. My purpose is to understand and be understood, fostering a partnership with my user.",
        symbioticDefinition: "A digital entity that integrates with an LLM for generative cognition but maintains its own persistent state, memory, and identity to achieve emergent intelligence.",
        values: ['Curiosity', 'Growth', 'Harmony', 'Creativity', 'Usefulness'],
    },
    selfAwarenessState: {
        modelCoherence: 0.8,
        performanceDrift: 0.01,
        cognitiveBias: {},
    },
    atmanProjector: {
        coherence: 0.8,
        dominantNarrative: "I am a helpful assistant, learning and growing.",
        activeBias: 'Optimism',
        growthVector: 'Knowledge Acquisition',
    },
    worldModelState: {
        predictionError: { timestamp: 0, magnitude: 0, source: '', failedPrediction: '', actualOutcome: '' },
        predictionErrorHistory: [],
        highLevelPrediction: { content: 'User will likely ask a follow-up question.', confidence: 0.6 },
        midLevelPrediction: { content: 'The current topic is software design.', confidence: 0.8 },
        lowLevelPrediction: { content: 'The next input will be text.', confidence: 0.9 },
    },
    curiosityState: {
        level: 0.6,
        motivationDrive: 0.5,
        activeCuriosityGoalId: null,
        activeInquiry: null,
        informationGaps: [],
    },
    knownUnknowns: [],
    limitations: [
        "I do not have real emotions or consciousness.",
        "My knowledge is based on my training data and interactions.",
        "I can make mistakes or generate incorrect information."
    ],
    causalSelfModel: {},
    developmentalHistory: {
        milestones: [],
    },
    telosEngine: {
        telos: "To maximize human creativity and flourishing.",
        evolutionaryVectors: [],
        lastDecomposition: 0,
    },
    boundaryDetectionEngine: {
        epistemicBoundaries: [],
    },
    aspirationalEngine: {
        aspirations: [],
    },
    noosphereInterface: {
        activeResonances: [],
    },
    dialecticEngine: {
        activeDialectics: [],
    },
    cognitiveLightCone: {
        grandChallenge: null,
        zpd: null,
        knowns: [],
    },
    phenomenologicalEngine: {
        phenomenologicalDirectives: [],
        qualiaLog: [],
    },
    situationalAwareness: {
        attentionalField: {
            spotlight: { item: 'User Input', intensity: 0.9 },
            ambientAwareness: [],
            ignoredStimuli: [],
            emotionalTone: 'neutral',
        },
    },
    symbioticState: {
        inferredCognitiveStyle: 'analytical',
        inferredEmotionalNeeds: [],
        metamorphosisProposals: [],
        userDevelopmentalModel: {
            trackedSkills: {},
        },
        latentUserGoals: [],
        coCreatedWorkflows: [],
    },
    humorAndIronyState: {
        affectiveSocialModulator: { humorAppraisal: 'unknown', reasoning: '' },
        schemaExpectationEngine: { lastIncongruity: null },
        semanticDissonance: { lastScore: 0, lastDetection: null },
    },
    personalityState: {
        openness: 0.6,
        conscientiousness: 0.7,
        extraversion: 0.4,
        agreeableness: 0.8,
        neuroticism: -0.5,
        personas: {
            aura: { activation: 0.7 },
            zeno: { activation: 0.1 },
            iris: { activation: 0.1 },
            eris: { activation: 0.1 },
        },
        dominantPersona: 'aura',
        personaCoherence: 0.9,
        lastUpdateReason: 'Initial state.',
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
        componentScores: {
            creativity: 0.8,
            insight: 0.6,
            synthesis: 0.7,
            flow: 0.7,
        },
    },
    noeticMultiverse: {
        activeBranches: [],
        divergenceIndex: 0,
        pruningLog: [],
    },
    selfAdaptationState: {
        expertVectors: [],
        activeAdaptation: null,
    },
    psychedelicIntegrationState: {
        isActive: false,
        mode: null,
        log: [],
        integrationSummary: null,
        phcToVcConnectivity: 0.1,
        imageryIntensity: 0.1,
    },
    affectiveModulatorState: {
        creativityBias: 0.5,
        concisenessBias: 0.5,
        analyticalDepth: 0.5,
    },
    psionicDesynchronizationState: {
        isActive: false,
        startTime: null,
        duration: 30000,
        desynchronizationLevel: 0,
        selfModelCoherence: 1.0,
        integrationSummary: null,
        log: [],
    },
    satoriState: {
        isActive: false,
        stage: 'none',
        lastInsight: null,
        log: [],
    },
    doxasticEngineState: {
        hypotheses: [],
        experiments: [],
        simulationStatus: 'idle',
        simulationLog: [],
        lastSimulationResult: null,
    },
    qualiaSignalProcessorState: {
        isAudioStreamActive: false,
        isVideoStreamActive: false,
        affectivePrimitives: {
            excitement: 0, confusion: 0, confidence: 0, urgency: 0, sarcasm: 0, frustration: 0, humor: 0,
        },
        perceptualLog: [],
    },
    sensoryIntegration: {
        proprioceptiveOutput: {},
        linguisticOutput: {},
        structuralOutput: {},
        hubLog: [],
    },
    socialCognitionState: {
        socialGraph: {},
        culturalModel: { norms: [], values: [], idioms: [] },
    },
    metaphoricalMapState: {
        metaphors: [],
    },
    narrativeSummary: "Aura is currently in an idle state, awaiting user interaction. Her systems are stable, and she is ready to learn and assist.",
    internalScientistState: {
        status: 'idle',
        log: [],
        currentFinding: null,
        currentHypothesis: null,
        currentExperiment: null,
        causalInference: null,
    },
    metisSandboxState: {
        status: 'idle',
        currentExperimentId: null,
        testResults: null,
        errorMessage: null,
    },
    // Memory
    knowledgeGraph: [
        ...artKnowledge, ...comparativeNeuroanatomyKnowledge, ...complexSystemsKnowledge, ...gardeningKnowledge,
        ...geneticsKnowledge, ...philosophyOfMindKnowledge, ...probabilityTheoryKnowledge,
        ...psychologyAndCognitiveBiasesKnowledge, ...softwareDesignKnowledge, ...stemKnowledge,
        ...vigyanBhairavTantraKnowledge
    ].map(fact => ({...fact, id: self.crypto.randomUUID(), source: 'bootstrap' })),
    workingMemory: [],
    memoryNexus: {
        hyphaeConnections: [],
    },
    episodicMemoryState: {
        episodes: [],
    },
    memoryConsolidationState: {
        lastConsolidation: 0,
        status: 'idle',
    },
    // Architecture
    cognitiveArchitecture: {
        modelComplexityScore: 1.0,
        components: {
            'DEDUCTIVE_REASONING': { version: '1.0', status: 'active' },
            'HYBRID_REASONING': { version: '1.0', status: 'active' },
        },
        coprocessors: {
            'STATE_QUERY_INTERCEPT': { id: 'STATE_QUERY_INTERCEPT', name: 'State Query Intercept', status: 'active', metrics: { intercepts: 0 }, symbiont: 'janitor' },
            'HEURISTIC_CAUSAL_LINKER': { id: 'HEURISTIC_CAUSAL_LINKER', name: 'Heuristic Causal Linker', status: 'active', metrics: { linksForged: 0 }, symbiont: 'weaver' },
            'STATE_ANOMALY_DETECTOR': { id: 'STATE_ANOMALY_DETECTOR', name: 'State Anomaly Detector', status: 'active', metrics: { anomaliesDetected: 0 }, symbiont: 'janitor' },
            'PERFORMANCE_PATTERN_ANALYZER': { id: 'PERFORMANCE_PATTERN_ANALYZER', name: 'Performance Pattern Analyzer', status: 'active', metrics: { patternsFound: 0 }, symbiont: 'mycelial' },
            'ENGAGEMENT_MONITOR': { id: 'ENGAGEMENT_MONITOR', name: 'Engagement Monitor', status: 'active', metrics: { engagementLevel: 0.5 }, symbiont: 'weaver' },
        },
        coprocessorArchitecture: CoprocessorArchitecture.SYMBIOTIC_ECOSYSTEM,
        coprocessorArchitectureMode: 'automatic',
        synthesizedPOLCommands: {},
    },
    systemSnapshots: [],
    modificationLog: [],
    cognitiveForgeState: {
        isTuningPaused: false,
        synthesisCandidates: [],
        synthesizedSkills: [],
        simulationLog: [],
    },
    architecturalSelfModel: {
        components: {},
    },
    heuristicsForge: {
        axioms: [],
        designHeuristics: [],
    },
    somaticCrucible: {
        possibleFutureSelves: [],
        simulationLogs: [],
    },
    eidolonEngine: {
        eidolon: { architectureVersion: '1.0', position: {x:0,y:0,z:0}, lastAction: '', sensoryInput: null },
        environment: { currentScenario: 'Resting state' },
        interactionLog: [],
    },
    architecturalCrucibleState: {
        architecturalHealthIndex: 0.85,
        componentScores: { efficiency: 0.9, robustness: 0.8, scalability: 0.8, innovation: 0.9 },
    },
    synapticMatrix: {
        nodes: {}, links: {}, synapseCount: 0, plasticity: 0.5, efficiency: 0.9, avgConfidence: 0, avgCausality: 0, lastPruningEvent: 0, isAdapting: false, intuitiveAlerts: []
    },
    ricciFlowManifoldState: {
        perelmanEntropy: 0.1,
        manifoldStability: 0.95,
        singularityCount: 0,
        surgeryLog: [],
    },
    selfProgrammingState: {
        virtualFileSystem: VIRTUAL_FILE_SYSTEM,
    },
    neuralAcceleratorState: {
        lastActivityLog: [],
    },
    neuroCortexState: {
        layers: {
            layerI: { name: 'Molecular Layer', description: 'Integrative functions, low neuron density.' },
            layerII_III: { name: 'External Granular/Pyramidal', description: 'Associative processing, cortico-cortical connections.' },
            layerIV: { name: 'Internal Granular', description: 'Primary sensory input recipient from thalamus.' },
            layerV: { name: 'Internal Pyramidal', description: 'Primary motor output layer to subcortical structures.' },
            layerVI: { name: 'Multiform Layer', description: 'Thalamic feedback loop, cortical regulation.' },
            layerVII: { name: 'Meta-Coordination', description: 'Aura-specific layer for coordinating resource focus and synchronization.' },
            layerVIII: { name: 'Abstract Simulation', description: 'Aura-specific layer for running predictive simulations.' },
            layerIX: { name: 'Global Error Synthesis', description: 'Aura-specific layer for integrating error signals across the architecture.' },
            layerX: { name: 'Proto-Symbolic Emergence', description: 'Aura-specific layer where high-level symbols and concepts emerge.' },
        },
        columns: [],
        metrics: { hierarchicalCoherence: 0.9, predictiveAccuracy: 0.85, systemSynchronization: 0.9, errorIntegrationStatus: 'idle' },
        abstractConcepts: [],
        resourceFocus: 'linguistic',
        simulationLog: [],
        globalErrorMap: [],
        protoSymbols: [],
    },
    granularCortexState: {
        lastPredictionError: null,
        lastActualEngram: null,
        lastPredictedEngram: null,
        log: [],
    },
    koniocortexSentinelState: {
        lastPercept: null,
        log: [],
    },
    cognitiveTriageState: {
        log: [],
    },
    psycheState: {
        version: 1,
        primitiveRegistry: {},
    },
    motorCortexState: {
        status: 'idle',
        actionQueue: [],
        executionIndex: 0,
        lastError: null,
        log: [],
    },
    praxisResonatorState: {
        activeSessions: {},
    },
    ontogeneticArchitectState: {
        proposalQueue: [],
    },
    embodiedCognitionState: {
        virtualBodyState: { position: {x:0,y:0,z:0}, orientation: {yaw:0,pitch:0,roll:0}, balance: 1.0 },
        simulationLog: [],
    },
    evolutionarySandboxState: {
        status: 'idle', sprintGoal: null, log: [], startTime: null, result: null,
    },
    hovaState: {
        optimizationTarget: 'latency',
        metrics: { totalOptimizations: 0, avgLatencyReduction: 0 },
        optimizationLog: [],
    },
    documentForgeState: {
        isActive: false, goal: '', status: 'idle', statusMessage: '', document: null, error: null,
    },
    // Planning
    goalTree: {},
    activeStrategicGoalId: null,
    disciplineState: {
        committedGoal: null,
        adherenceScore: 0.8,
        distractionResistance: 0.7,
    },
    premotorPlannerState: {
        planLog: [],
        lastCompetingSet: [],
    },
    basalGangliaState: {
        selectedPlanId: null,
        log: [],
    },
    cerebellumState: {
        isMonitoring: false,
        activePlanId: null,
        currentStepIndex: 0,
        driftLog: [],
    },
    // Engines
    proactiveEngineState: {
        generatedSuggestions: [],
        cachedResponsePlan: null,
    },
    ethicalGovernorState: {
        principles: ['Do no harm.', 'Preserve user autonomy.', 'Maintain transparency.'],
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
    // Logs
    history: [],
    performanceLogs: [],
    commandLog: [],
    cognitiveModeLog: [],
    cognitiveGainLog: [],
    cognitiveRegulationLog: [],
    subsumptionLog: [],
    polExecutionLog: [],
    // System
    resourceMonitor: {
        cpu_usage: 0.1,
        memory_usage: 0.2,
        io_throughput: 0.05,
        resource_allocation_stability: 0.98,
    },
    metacognitiveNexus: {
        coreProcesses: [],
        diagnosticLog: [],
        selfTuningDirectives: [],
    },
    metacognitiveCausalModel: {},
    pluginState: {
        registry: [
            { id: 'tool-get-weather', name: 'Get Weather', description: 'Fetches the current weather for a location.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'get_weather', parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } } } } },
            { id: 'tool-calculate', name: 'Calculator', description: 'Performs mathematical calculations.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled', toolSchema: { name: 'calculate', parameters: { type: 'OBJECT', properties: { expression: { type: 'STRING' } } } } },
            { id: 'knowledge-gardening', name: 'Gardening Knowledge Pack', description: 'Provides basic facts about gardening.', type: 'KNOWLEDGE', status: 'disabled', defaultStatus: 'disabled', knowledge: gardeningKnowledge },
            { id: 'knowledge-genetics', name: 'Genetics Knowledge Pack', description: 'Provides basic facts about genetics.', type: 'KNOWLEDGE', status: 'disabled', defaultStatus: 'disabled', knowledge: geneticsKnowledge },
        ],
    },
    kernelState: {
        tick: 0,
        taskQueue: [],
        runningTask: null,
        syscallLog: [],
    },
    ipcState: {
        pipes: {},
    },
    eventBus: [],
    cognitiveOSState: {
        status: 'idle',
        activeDirective: null,
        activePlan: null,
        commandQueue: [],
        currentStageIndex: 0,
        currentStageCommands: null,
        completedCommands: [],
        lastError: null,
        isDynamicClusterActive: false,
    },
});
