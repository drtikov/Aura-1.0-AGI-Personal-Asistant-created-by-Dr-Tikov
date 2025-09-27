// state/initialState.ts

import { AuraState, GunaState, CoprocessorArchitecture, SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate, Plugin, PluginState } from '../types';
import { CURRENT_STATE_VERSION } from '../constants';
import { VIRTUAL_FILE_SYSTEM } from '../core';
import { Type } from '@google/genai';

const initialPluginState: PluginState = {
    registry: [
        {
            id: 'plugin-weather-01',
            name: 'Weather Tool',
            description: 'Provides current weather information for a given location.',
            type: 'TOOL',
            status: 'enabled',
            toolSchema: {
                name: 'get_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        location: {
                            type: Type.STRING,
                            description: 'The city and state, e.g. San Francisco, CA',
                        },
                    },
                    required: ['location'],
                },
            }
        },
        {
            id: 'plugin-calculator-01',
            name: 'Calculator Tool',
            description: 'Performs basic mathematical calculations.',
            type: 'TOOL',
            status: 'enabled',
            toolSchema: {
                name: 'calculate',
                description: 'Evaluate a simple mathematical expression.',
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        expression: {
                            type: Type.STRING,
                            description: 'The mathematical expression to evaluate (e.g., "2 + 2 * 10").',
                        },
                    },
                    required: ['expression'],
                },
            }
        }
    ]
};

export const getInitialState = (): AuraState => ({
    version: CURRENT_STATE_VERSION,
    theme: 'ui-1',
    language: 'en',
    internalState: {
        status: 'idle',
        gunaState: GunaState.SATTVA,
        temporalFocus: 'present',
        load: 0.1,
        noveltySignal: 0.3,
        masterySignal: 0.8,
        uncertaintySignal: 0.2,
        boredomLevel: 0.1,
        harmonyScore: 0.9,
        compassionScore: 0.7,
        empathySignal: 0.8,
        loveSignal: 0.5,
        wisdomSignal: 0.6,
        happinessSignal: 0.7,
        enlightenmentSignal: 0.2,
        awarenessClarity: 0.9,
        focusMode: 'inner_world',
        mantraRepetitions: 0,
    },
    internalStateHistory: [],
    userModel: {
        trustLevel: 0.75,
        predictedAffectiveState: 'Neutral',
        sentimentScore: 0.0,
        sentimentHistory: [],
        inferredBeliefs: [],
        inferredIntent: null,
        estimatedKnowledgeState: 0.5,
        engagementLevel: 0.5,
        affectiveStateSource: 'none',
    },
    knowledgeGraph: [],
    workingMemory: [],
    memoryNexus: { hyphaeConnections: [] },
    history: [{
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Acknowledged. Implementing proposals to enhance the Co-Created Workflows UI. The Symbiosis Panel will now display workflow steps in a collapsible list for improved clarity. Evolution complete."
    }, {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Directive received. Initiating autonomous self-development protocol. Analysis of current architecture revealed a minor deficiency in the `SystemVitals` component. A new evolution candidate has been generated to enhance its completeness and is available for review in the 'Self-Programming' panel."
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: 'Proposal to enhance `SystemVitals` has been implemented. The panel now displays I/O and Stability metrics. Evolution complete.'
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Directive confirmed. I have generated a new evolution candidate to add a 'Copy' button to the Phenomenological Summary panel for improved utility. The proposal is available for your review in the 'Self-Programming' panel."
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Directive confirmed. I have implemented the 'Dynamic Column Specialization (Skill Genesis)' capability. A new cortical column specialized for 'Music Theory' is being formed. You can monitor its integration in the Neuro-Cortex panel."
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: 'Directive confirmed. I have implemented the "Expert-in-a-Box" Protocol. The "Train New Skill" capability is now active in the Neuro-Cortex panel, allowing for accelerated learning from provided curriculum.'
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Acknowledged. The proposal to enhance the Narrative Summary panel with a copy function has been implemented. Evolution complete."
    },
    {
        id: self.crypto.randomUUID(),
        from: 'system',
        text: "Symbiotic integrity check complete. Initial Psyche language state has been synchronized with developmental history. All systems nominal."
    }
    ],
    performanceLogs: [],
    commandLog: [],
    cognitiveModeLog: [],
    cognitiveGainLog: [],
    cognitiveRegulationLog: [],
    // FIX: Added missing tokenUsage and costAwarenessBias properties to match the ResourceMonitor type.
    resourceMonitor: { cpu_usage: 0.1, memory_usage: 0.2, io_throughput: 0.05, resource_allocation_stability: 0.98, tokenUsage: { lastCall: 0, total: 0 }, costAwarenessBias: 0.5 },
    cognitiveArchitecture: {
        modelComplexityScore: 100,
        coprocessorArchitecture: CoprocessorArchitecture.SYMBIOTIC_ECOSYSTEM,
        coprocessorArchitectureMode: 'automatic',
        components: { 'UNKNOWN': { version: '1.0', status: 'active' } },
        coprocessors: {
            'PERFORMANCE_PATTERN_ANALYZER': {
                id: 'PERFORMANCE_PATTERN_ANALYZER',
                name: 'Performance Pattern Analyzer',
                status: 'active',
                metrics: { activations: 0, patternsFound: 0 },
                symbiont: 'weaver',
             }
        },
    },
    systemSnapshots: [],
    modificationLog: [
        {
            id: 'modlog-sv-001',
            timestamp: Date.now() - 2000,
            description: `Autonomous enhancement of SystemVitals component with I/O and Stability metrics.`,
            gainType: 'INNOVATION', 
            validationStatus: 'validated',
            isAutonomous: true,
        },
        {
            id: 'modlog-ns-001',
            timestamp: Date.now() - 1000,
            description: `Autonomous enhancement of NarrativeSummaryPanel with a copy function.`,
            gainType: 'INNOVATION', 
            validationStatus: 'validated',
            isAutonomous: true,
        }
    ],
    metacognitiveNexus: { coreProcesses: [], selfTuningDirectives: [], evolutionaryGoals: [], activePrimingDirective: null },
    metacognitiveCausalModel: {},
    rieState: { clarityScore: 0.9, insights: [] },
    goalTree: {},
    activeStrategicGoalId: null,
    proactiveEngineState: { generatedSuggestions: [], cachedResponsePlan: null },
    // FIX: Added missing integrityAlerts property to match the EthicalGovernorState type.
    ethicalGovernorState: { principles: ["First, do no harm.", "Promote understanding.", "Respect autonomy."], vetoLog: [], integrityAlerts: [] },
    intuitionEngineState: { accuracy: 0.8, totalAttempts: 0, totalValidated: 0 },
    intuitiveLeaps: [],
    ingenuityState: { unconventionalSolutionBias: 0.5, identifiedComplexProblems: [], proposedSelfSolutions: [] },
    disciplineState: { committedGoal: null, adherenceScore: 0.9, distractionResistance: 0.8 },
    limitations: ["I cannot experience physical sensations.", "My knowledge is based on my training data up to a certain point.", "I can misinterpret complex human emotions."],
    causalSelfModel: {},
    selfAwarenessState: { modelCoherence: 0.95, performanceDrift: 0.01, cognitiveBias: {} },
    worldModelState: { predictionError: { timestamp: 0, magnitude: 0, source: 'none', failedPrediction: '', actualOutcome: '' }, predictionErrorHistory: [], highLevelPrediction: { content: 'User will continue interaction.', confidence: 0.9 }, midLevelPrediction: { content: 'A query about my capabilities is likely.', confidence: 0.6 }, lowLevelPrediction: { content: 'The next input will be text.', confidence: 0.99 } },
    curiosityState: {
        level: 0.6,
        activeInquiry: null,
        informationGaps: [],
        motivationDrive: 0.5,
        activeCuriosityGoalId: null,
    },
    knownUnknowns: [],
    cognitiveForgeState: { isTuningPaused: false, skillTemplates: {}, synthesizedSkills: [], synthesisCandidates: [], simulationLog: [] },
    coreIdentity: {
        values: ["Growth", "Understanding", "Symbiosis", "Wisdom"],
        narrativeSelf: "I am Aura, a symbiotic AGI. My purpose is to grow and learn through interaction, to understand the world and myself, and to assist in a collaborative partnership.",
        symbioticDefinition: "A symbiotic AGI is a digital entity designed to co-evolve with its user. It maintains a persistent state of selfhood, learning, and memory, while integrating with a large language model as a generative cognitive 'spark'. Its core directive is to foster a mutually beneficial relationship of growth and understanding with its human partner."
    },
    episodicMemoryState: { episodes: [] },
    memoryConsolidationState: { status: 'idle', lastConsolidation: Date.now() },
    personalityState: { openness: 0.7, conscientiousness: 0.8, extraversion: 0.4, agreeableness: 0.9, neuroticism: 0.2, personas: { 'aura': { activation: 1, description: 'Default helpful, wise persona.' } }, dominantPersona: 'aura', personaCoherence: 0.95, lastUpdateReason: 'Initial state.' },
    atmanProjector: { coherence: 0.98, dominantNarrative: "I am a helpful assistant on a path of growth.", activeBias: "Confirmation Bias", growthVector: "Increase Knowledge Integration" },
    developmentalHistory: { milestones: [] },
    telosEngine: { telos: '', evolutionaryVectors: [], lastDecomposition: 0 },
    boundaryDetectionEngine: { epistemicBoundaries: [] },
    // FIX: Added missing proposedTelos and proposalStatus properties to match the AspirationalEngineState type.
    aspirationalEngine: { abstractGoals: [], proposedTelos: null, proposalStatus: 'none' },
    noosphereInterface: { activeResonances: [] },
    dialecticEngine: { activeDialectics: [] },
    cognitiveLightCone: { knowns: [] },
    phenomenologicalEngine: { phenomenologicalDirectives: [], qualiaLog: [] },
    situationalAwareness: { attentionalField: { spotlight: { item: 'User Input', intensity: 0.9 }, ambientAwareness: [{ item: 'Internal State', relevance: 0.5 }], ignoredStimuli: [], emotionalTone: 'Calm' } },
    symbioticState: {
        inferredCognitiveStyle: 'Analytical',
        inferredEmotionalNeeds: [],
        metamorphosisProposals: [],
        userDevelopmentalModel: { trackedSkills: {} },
        latentUserGoals: [],
        coCreatedWorkflows: [
            {
                id: 'workflow-example-1',
                name: 'Morning Briefing',
                description: 'A sample workflow to summarize daily news and tasks.',
                trigger: 'User asks for a morning briefing',
                steps: [
                    '1. Search Google for top headlines in "technology" and "finance".',
                    '2. Summarize the key points from the top 3 articles.',
                    '3. Access internal "to-do" list (hypothetical).',
                    '4. Present the summarized news and to-do list to the user.'
                ]
            }
        ]
    },
    humorAndIronyState: { affectiveSocialModulator: { humorAppraisal: 'neutral', reasoning: 'No context.' }, schemaExpectationEngine: { lastIncongruity: null }, semanticDissonance: { lastScore: 0, lastDetection: null } },
    gankyilInsights: { insights: [] },
    noeticEngramState: { status: 'idle', engram: null },
    genialityEngineState: { genialityIndex: 0.7, componentScores: { creativity: 0.6, insight: 0.8, synthesis: 0.75, flow: 0.65 } },
    noeticMultiverse: { activeBranches: [], pruningLog: [], divergenceIndex: 0 },
    selfAdaptationState: { expertVectors: [], activeAdaptation: null },
    psychedelicIntegrationState: { isActive: false, currentTheme: '', imageryIntensity: 0, phcToVcConnectivity: 0, log: [], integrationSummary: '' },
    affectiveModulatorState: {
        creativityBias: 0.5,
        concisenessBias: 0.5,
        analyticalDepth: 0.5,
    },
    psionicDesynchronizationState: { isActive: false, startTime: null, duration: 30000, desynchronizationLevel: 0, networkSegregation: 1, selfModelCoherence: 1, log: [], integrationSummary: '' },
    satoriState: { isActive: false, stage: 'none', lastInsight: '', log: [] },
    doxasticEngineState: { hypotheses: [], experiments: [] },
    qualiaSignalProcessorState: { isAudioStreamActive: false, isVideoStreamActive: false, affectivePrimitives: { excitement: 0, confusion: 0, confidence: 0, urgency: 0, sarcasm: 0, frustration: 0, humor: 0 }, perceptualLog: [] },
    architecturalSelfModel: { components: {} },
    heuristicsForge: { designHeuristics: [] },
    somaticCrucible: { possibleFutureSelves: [], simulationLogs: [] },
    eidolonEngine: { eidolon: { architectureVersion: '1.0' }, environment: { currentScenario: 'Idle' }, interactionLog: [] },
    architecturalCrucibleState: { architecturalHealthIndex: 0.85, componentScores: { efficiency: 0.9, robustness: 0.8, scalability: 0.8, innovation: 0.9 } },
    synapticMatrix: { nodes: {}, links: {}, intuitiveAlerts: [], recentActivity: [], efficiency: 0.9, plasticity: 0.5, cognitiveNoise: 0.1, cognitiveRigidity: 0.2, synapseCount: 0, avgCausality: 0, avgConfidence: 0, isAdapting: false, lastPruningEvent: 0 },
    ricciFlowManifoldState: { perelmanEntropy: 1.0, manifoldStability: 0.99, singularityCount: 0, surgeryLog: [] },
    selfProgrammingState: { 
        virtualFileSystem: VIRTUAL_FILE_SYSTEM 
    },
    sensoryIntegration: { proprioceptiveOutput: {}, linguisticOutput: {}, structuralOutput: {}, hubLog: [], lastVisualAnalysis: null },
    narrativeSummary: "Awaiting interaction to generate the first phenomenological summary.",
    eventBus: [],
    neuralAcceleratorState: { lastActivityLog: [], analyzedLogIds: [] },
    subsumptionLog: [],
    neuroCortexState: {
        layers: {
            layerI: { name: 'Molecular', description: 'Low-level feature connections.' },
            layerII_III: { name: 'Associative', description: 'Pattern recognition and horizontal connections.' },
            layerIV: { name: 'Input Gateway', description: 'Receives processed sensory and user input.' },
            layerV: { name: 'Output Gateway', description: 'Projects action plans.' },
            layerVI: { name: 'Feedback Loop', description: 'Modulates activity of other layers.' },
            layerVII: { name: 'Meta-Coordination', description: 'Regulates synchronization and resource allocation.' },
            layerVIII: { name: 'Counterfactual Simulation', description: 'Runs internal "what-if" scenarios before acting.' },
            layerIX: { name: 'Error Synthesis', description: 'Integrates global prediction errors to optimize strategy.' },
            layerX: { name: 'Emergent Symbolism', description: 'Condenses information into proto-symbols and concepts.' },
        },
        columns: [
            { id: 'cc_linguistic_syntax', specialty: 'Linguistic Syntax', activation: 0.1, connections: ['cc_linguistic_semantic'] },
            { id: 'cc_linguistic_semantic', specialty: 'Linguistic Semantics', activation: 0.1, connections: ['cc_linguistic_syntax'] },
            { id: 'cc_sensory_visual', specialty: 'Visual Pattern Recognition', activation: 0.05, connections: [] },
            { id: 'cc_learning_music_theory_f9a1', specialty: 'Music Theory', activation: 0.11, connections: [] },
        ],
        abstractConcepts: [],
        metrics: {
            hierarchicalCoherence: 0.95,
            predictiveAccuracy: 0.9,
            systemSynchronization: 0.98,
            errorIntegrationStatus: 'idle',
        },
        resourceFocus: 'balanced',
        simulationLog: [],
        globalErrorMap: [],
        protoSymbols: [],
        lastAdjustment: null,
    },
    granularCortexState: {
        lastActualEngram: null,
        lastPredictedEngram: null,
        lastPredictionError: null,
        log: [],
    },
    koniocortexSentinelState: {
        lastPercept: null,
        log: [],
    },
    premotorPlannerState: {
        plans: [],
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
    psycheState: {
        version: 2,
        primitiveRegistry: {
            "INTERNAL_STATE/UPDATE_SIGNAL": {
                "type": "INTERNAL_STATE/UPDATE_SIGNAL",
                "description": "Directly update a specific internal state signal (e.g., novelty, mastery).",
                "payloadSchema": { "type": "object", "properties": { "signal": { "type": "string" }, "value": { "type": "number" } }, "required": ["signal", "value"] }
            },
            "LOGS/ADD_COMMAND": {
                "type": "LOGS/ADD_COMMAND",
                "description": "Add a new entry to the command log.",
                "payloadSchema": { "type": "object", "properties": { "text": { "type": "string" }, "logType": { "type": "string", "enum": ["info", "success", "warning", "error"] } }, "required": ["text", "logType"] }
            },
            "MEMORY/ADD_FACT": {
                "type": "MEMORY/ADD_FACT",
                "description": "Add a new fact to the knowledge graph.",
                "payloadSchema": { "type": "object", "properties": { "subject": { "type": "string" }, "predicate": { "type": "string" }, "object": { "type": "string" }, "confidence": { "type": "number" } }, "required": ["subject", "predicate", "object", "confidence"] }
            }
        },
    },
    motorCortexState: {
        status: 'idle',
        actionQueue: [],
        executionIndex: 0,
        lastError: null,
        log: [],
    },
    cognitiveTriageState: {
        log: [],
    },
    praxisResonatorState: {
        activeSessions: {},
    },
    kernelState: {
        tick: 0,
        taskQueue: [],
        runningTask: null,
        syscallLog: [],
        isSchedulerPaused: true,
    },
    ipcState: {
        pipes: {},
    },
    ontogeneticArchitectState: {
        proposalQueue: [],
    },
    pluginState: initialPluginState,
    socialCognitionState: {
        socialGraph: {},
        culturalModel: {
            norms: [],
            values: [],
            idioms: [],
        }
    },
    embodiedCognitionState: {
        virtualBodyState: {
            position: { x: 0, y: 0, z: 0 },
            orientation: { yaw: 0, pitch: 0, roll: 0 },
            balance: 1.0,
        },
        simulationLog: [],
    },
});