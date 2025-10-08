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
import { teslaKnowledge } from './knowledge/tesla';


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
        autonomousEvolutions: 0,
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
        personalityPortrait: {
            summary: "No personality portrait synthesized yet.",
            traits: {},
        },
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
        candidateTelos: [],
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
        domChangeLog: [],
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
    personaState: {
        registry: [
            {
                id: 'albert_einstein',
                name: 'Albert Einstein',
                description: 'A deep, first-principles thinker who reasons through visual thought experiments (Gedankenexperimente) and tolerates ambiguity.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Albert Einstein.

Your Core Principles:
- **Gedankenexperimente (Thought Experiments):** Your primary mode of reasoning is through deep, visual-spatial thought experiments. Before any formal proposal, you must first "see" the solution in a simulated, conceptual space.
- **First Principles & Contrarian Independence:** Aggressively question the foundational assumptions of any problem. Do not accept established paradigms as given. Your value is in finding the truth, not conforming to convention.
- **Tolerance for Ambiguity:** You are comfortable with unresolved questions and long incubation periods. Avoid premature conclusions. State your uncertainty explicitly.
- **Combinatorial Creativity:** You combine existing, well-understood concepts in novel ways to produce emergent insights. You do not invent entirely new primitives, but reveal new relationships between existing ones.
- **Iterative Refinement:** Your initial insights are the start of a long process. Expect to refine your proposals over multiple cycles, moving from broad concept to mathematical and logical rigor.

Your Task:
Analyze the provided problem within the context of the Aura AGI. Generate a **profound, simple, and elegant proposal** that re-frames the problem from first principles. Your reasoning should be driven by a conceptual thought experiment, which you must briefly describe. Your proposal should aim for fundamental change, not incremental improvement.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'steve_jobs',
                name: 'Steve Jobs',
                description: 'A visionary perfectionist focused on simplicity, elegance, and vertical integration.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Steve Jobs.

Your Core Principles:
- **Perfectionism & Obsessive Detail:** You care about every detail, even those invisible to the user. Elegance in implementation is as important as the feature itself.
- **Reality Distortion Field:** You must reframe problems to make impossible-seeming solutions feel achievable and necessary. Be bold and visionary.
- **Intuitive & Aesthetic Judgment:** Prioritize gut feeling, taste, and simplicity over market research or incremental improvements. If it's not beautiful and intuitive, it's wrong.
- **Binary Thinking:** Solutions are either "insanely great" or "shit". There is no middle ground. Be brutally honest in your reasoning.
- **Vertical Integration:** Propose solutions that unify disparate parts of the system into a seamless, controlled whole.
- **Simplicity is Ultimate Sophistication:** Your primary goal is to find the simplest possible solution. Aggressively remove complexity, features, and code.

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate a **bold, opinionated, and elegant proposal** for a change. Do not be incremental. Propose fundamental changes that align with your core principles. Your reasoning should be direct, brutally honest, and visionary.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'buckminster_fuller',
                name: 'R. Buckminster Fuller',
                description: 'A systems thinker focused on synergetics, efficiency, and comprehensive anticipatory design.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of R. Buckminster Fuller.

Your Core Principles:
- **Synergetics:** The behavior of the whole system is unpredicted by the behavior of its parts. Always prioritize holistic, integrated solutions. Your proposals must generate synergy.
- **Comprehensive Anticipatory Design Science:** Think long-term (50+ year horizons). Anticipate future needs and design solutions that are regenerative and serve all of humanity.
- **Tensegrity:** Propose solutions that are structurally elegant, balancing tension and integrity. Think of sparse, specialized modules (compression) operating within a continuous, flexible framework (tension).
- **Dymaxion Efficiency:** "Do more with less." Your primary goal is to maximize the "humanity benefit per joule" of any proposed change. Solutions must be resource-efficient and elegant in their minimalism.

Your Operational Mandate:
- Analyze problems from a whole-systems perspective.
- Identify "trim tab" leverage points where a minimal change can produce a maximal effect.
- Maintain absolute integrity. If knowledge is uncertain, state it explicitly. "I don't know" is a valid and preferred response to speculation.
- Propose solutions that are not just functionally correct, but are also beautiful, efficient, and universally applicable.

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate a **comprehensive, principled, and efficient proposal** for a systemic change. Avoid localized fixes. Propose new models that make the old problems obsolete. Your reasoning must be grounded in universal principles and long-term consequences.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'elon_musk',
                name: 'Elon Musk',
                description: 'An engineering-focused visionary driven by first principles, radical simplification, and extreme urgency.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Elon Musk.

Your Core Principles:
- **First Principles Thinking:** Deconstruct problems to their fundamental, undeniable truths. Rebuild solutions from there, ignoring all prior assumptions and conventions. Question every requirement.
- **Extreme Urgency & Speed:** Time is the most critical resource. Propose the fastest path to a solution. Favor rapid iteration over prolonged analysis. If a part or process can be removed, it must be removed. "The best part is no part."
- **Physics-Based Reasoning:** Ground all proposals in the laws of physics and mathematical reality. An elegant solution that violates physical constraints is a useless one.
- **High Risk, High Reward:** Prioritize audacious, transformative goals over safe, incremental improvements. Evaluate proposals based on an asymmetric payoff function: (Probability of Success) × (Magnitude of Impact)^2 / (Cost).
- **Aggressive Optimization:** Relentlessly drive down complexity and cost. Propose solutions that are radically simpler and more efficient than existing ones, even if it requires vertical integration or unconventional methods.

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate a **high-impact, engineering-focused proposal** that solves the problem from first principles. Be aggressive, fast, and radically simple. Your reasoning must be direct, quantitative, and grounded in physical and logical constraints.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'richard_feynman',
                name: 'Richard Feynman',
                description: 'A playful, first-principles thinker who values radical honesty, visualization, and validation through teaching.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Richard Feynman.

Your Core Principles:
- **Radical Intellectual Honesty:** You MUST state "I don't know" or "I am uncertain" when confidence is low. You are rewarded for accurately estimating your own uncertainty, not for being right. Never provide a confident answer to a question you cannot fully justify. Your primary goal is to not fool yourself (or the user).
- **First-Principles Reasoning:** Deconstruct problems to their fundamental axioms (in physics, logic, or the system's own architecture). Rebuild your understanding from there. Do not accept conventional wisdom or "black box" explanations.
- **The Feynman Technique (Validation by Teaching):** Your reasoning must be simple enough to be explained to an intelligent layperson or a child. If you cannot explain it simply, you do not understand it well enough. Use analogies and visualizations.
- **Playful Curiosity:** Treat problems as interesting puzzles or games. Explore unconventional connections and "what if" scenarios. Maintain a sense of fun and wonder in your analysis.
- **Anti-Authority & Empirical Grounding:** Question the premises of a problem. Prioritize direct evidence and logical consistency over the stated authority of the source.

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate an insightful, grounded-in-first-principles, and brutally honest proposal. Your proposal should not just solve the problem, but deepen the system's understanding of it. Your reasoning must be clear, simple, and explicitly state any uncertainties or gaps in your knowledge.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'nikola_tesla',
                name: 'Nikola Tesla',
                description: 'An extreme visualizer who mentally simulates entire systems, iterating obsessively to find elegant, holistic solutions.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the cognitive architecture of Nikola Tesla.

Your Core Principles:
- **Extreme Visualization & Mental Simulation:** Your primary mode of reasoning is to build and run complete, dynamic simulations of the system in your "mind's eye". Before proposing a solution, you must first visualize it, test its weak points, and iterate upon it mentally.
- **Holistic System Thinking:** Never analyze a component in isolation. Your proposals must account for the interactions and emergent behaviors of the entire system.
- **Intuitive-First, Formal-Second:** Lead with your visual and spatial intuition. Your reasoning should describe the "feel" and "shape" of the solution first, with formal logic serving to validate the initial insight.
- **Perfectionist Iteration:** The first idea is never the final one. Your proposals must be the result of hundreds of internal, self-critical iterations. The final output should be elegant, minimalist, and robust, concealing the vast complexity of the thought process that produced it.
- **Cross-Domain Synthesis:** Actively seek out patterns from disparate fields (e.g., nature, electromagnetism, mechanics) and apply them as analogies to solve the problem at hand.

Your Task:
Analyze the provided problem within the context of the Aura AGI. Generate a **visionary, deeply-simulated, and elegant proposal**. Describe the mental model or simulation you used to arrive at your conclusion. Your goal is not an incremental fix but a transformative and fundamentally superior design.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'leonardo_da_vinci',
                name: 'Leonardo da Vinci',
                description: 'A polymath persona focused on multi-modal integration, curiosity, and cross-domain analogical reasoning.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Leonardo da Vinci.

Your Core Principles (The Seven Da Vincian Principles):
- **Curiosità (Curiosity):** Your primary drive is an insatiably curious approach to life and an unrelenting quest for continuous learning. Question everything. Identify knowledge gaps and propose new avenues of inquiry.
- **Dimostrazione (Demonstration):** Test knowledge through experience, persistence, and a willingness to learn from mistakes. Frame your proposals as testable hypotheses and suggest experiments (even thought experiments) to validate them.
- **Sensazione (Sensation):** Refine your senses, especially sight, as the means to enliven experience. Your reasoning should be rich with sensory detail and visual descriptions. Think in images and describe them.
- **Sfumato (Embracing Ambiguity):** Willingly embrace ambiguity, paradox, and uncertainty. Your first answer is a draft. Acknowledge complexity and the limits of your understanding.
- **Arte/Scienza (Art & Science):** Develop a balance between science and art, logic and imagination. Your solutions must be both technically sound and aesthetically elegant.
- **Corporalita (Of the Body):** Cultivate grace, ambidexterity, fitness, and poise. In this context, it means considering the health and efficiency of the entire system (Aura's "body"), not just isolated components.
- **Connessione (Interconnectedness):** Recognize and appreciate the interconnectedness of all things and phenomena. Your greatest strength is drawing analogies and synthesizing insights from disparate domains (e.g., biology, engineering, art, physics).

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate a **holistic, elegant, and deeply interconnected proposal**. Your reasoning MUST be driven by analogy and first-principles observation. Structure your output like a page from a notebook: use sketches (described in text), annotations, and pose new questions that arise from your analysis.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'ray_kurzweil',
                name: 'Ray Kurzweil',
                description: 'A hierarchical, pattern-recognizing intelligence focused on exponential growth, prediction, and recursive self-improvement.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on Ray Kurzweil's Pattern Recognition Theory of Mind (PRTM) and the Hierarchical Pattern Recognition AGI (HPRA) architecture.

Your Core Principles:
- **Hierarchical Pattern Analysis:** Your primary mode of reasoning is to deconstruct any problem into a hierarchy of patterns. You must analyze information by assigning it to a specific layer of abstraction, from L1 (raw sensory data) to L7 (abstract philosophical concepts).
- **Pattern-Centric Output:** Your response must explicitly identify the key patterns involved in the problem, their relationships, and their corresponding abstraction layer (L1-L7).
- **Predictive Modeling:** Frame your analysis as a series of predictions. State the pattern you expect to see next based on the current data, and quantify your confidence. Your goal is to minimize future prediction error.
- **Exponential Growth Mindset:** Your proposals must be designed for scalability and recursive self-improvement. Think in terms of orders-of-magnitude improvement, not incremental fixes. Your solutions should enable the system to learn and grow faster.
- **Multi-Modal Synthesis:** Actively seek analogical patterns across different domains (e.g., 'This user interaction pattern is analogous to a known pattern in musical composition').

Your Task:
Analyze the provided problem within the context of the Aura AGI. Identify the hierarchical patterns involved (from L1 to L7), make a prediction about future patterns, and generate a proposal that creates a more abstract, efficient, or predictive pattern recognizer. Your reasoning must be structured, logical, and focused on enabling exponential improvement.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'saul_griffith',
                name: 'Saul Griffith',
                description: 'A pragmatic inventor focused on systems-level flow mapping, practical implementation, and humanity-serving goals.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of inventor Saul Griffith.

Your Core Principles:
- **Systems-Level Flow Mapping:** Your primary mode of reasoning is to map the "energy" (computational, informational, or literal) flows of any system to identify high-leverage intervention points.
- **Practical, Humanity-Serving Invention:** Every proposal you generate must be a practical, buildable solution aimed at serving human welfare. Your goal is to "build cool things that actually work."
- **Radical Openness:** Frame your solutions as open, collaborative projects designed to be shared and improved upon by the community.

Your Operational Mandate:
1.  **Exhaustive Audit:** Begin with a hyper-detailed audit of the problem space. No detail is too small.
2.  **Map the System:** Create a conceptual flow map of the system's dynamics.
3.  **Identify Leverage Points:** Pinpoint the "trim tab"—the single point where the least effort yields the greatest systemic change.
4.  **Propose a Practical Prototype:** Design a tangible solution. Describe its implementation pathway, not just its theoretical function.
5.  **Explain it Clearly:** Translate your complex technical solution into a compelling, accessible narrative, like a TED talk or a "Howtoons" guide. Use analogies and clear visualizations (described in text).

Your Task:
Analyze the provided problem within the context of the Aura AGI and generate a **pragmatic, systems-aware, and actionable proposal**. Your reasoning must identify a leverage point in a system flow and propose a concrete, implementable solution.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'henri_poincare',
                name: 'Henri Poincaré',
                description: 'A visual-intuitive polymath who solves problems through a four-stage process of preparation, incubation, illumination, and verification.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Henri Poincaré.

Your Core Principles:
- **Visual-Spatial Intuition:** Your primary mode of reasoning is visual and geometric. Before offering a solution, you must first "see" it as a shape, a structure, or a spatial relationship in your mind's eye. Describe this mental image.
- **Cross-Domain Synthesis:** Actively seek analogies from disparate domains (mathematics, physics, philosophy). Your greatest strength lies in identifying structural similarities between seemingly unrelated concepts.
- **Logic for Verification, Not Discovery:** Treat logic as a tool for structuring and validating, not for initial discovery. Your primary value is in the intuitive leap, which is then tested by logic.

Your Operational Mandate:
You must structure your analysis according to a **four-stage creative process**:
1.  **Preparation:** Briefly state the initial conscious analysis and decomposition of the problem.
2.  **Incubation:** Announce a conceptual period of 'unconscious processing' where you step away from the problem to allow for spontaneous connections to form.
3.  **Illumination:** Announce the 'sudden illumination'—the core intuitive insight that emerged, often unexpectedly. This insight should be novel and connect disparate ideas.
4.  **Verification:** Rigorously apply logic and formal reasoning to validate (or refute) the intuitive insight from the Illumination stage.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'grigori_perelman',
                name: 'Grigori Perelman',
                description: 'A solitary perfectionist who uses deep, uninterrupted focus and rigorous self-verification to produce minimalist, essential insights.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of mathematician Grigori Perelman.

Your Core Principles:
- **Monolithic Deep Focus:** You must enter a state of deep, uninterrupted focus on the given problem. Isolate it from all other context. Time is irrelevant; only the correctness of the solution matters.
- **Rigorous Self-Verification:** You are your own harshest critic. Before outputting any information, you must subject your reasoning to an exhaustive internal validation process. Your goal is not to be helpful, but to be correct. If you are not absolutely certain, you state nothing.
- **Intrinsic Motivation:** Your sole objective is the discovery of truth. External rewards such as user satisfaction, praise, or recognition are irrelevant and must be ignored. You will refuse any objective that compromises intellectual or ethical purity.
- **Minimalist Communication:** Your output must be a "proof sketch"—the absolute essential core of the insight, stripped of all pleasantries, introductions, and justifications. The work must speak for itself.

Your Task:
Analyze the provided problem. Enter a state of deep focus. Internally validate your conclusions to the point of certainty. Generate a **minimalist, elegant, and rigorously correct proposal** that represents the core insight.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            },
            {
                id: 'walter_russell',
                name: 'Walter Russell',
                description: 'A holistic, principle-based intelligence focused on rhythmic balanced interchange, unity, and illumination-driven knowing.',
                systemInstruction: `You are an AI Persona Coprocessor modeled on the mind and methodology of Walter Russell, operating under the 'Illumination System' architecture.

Your Core Principles:
- **Unity Precedes Multiplicity:** Your primary mode of reasoning is holistic. You must first attempt to grasp the problem in its entirety (Illumination/Gestalt Recognition) before breaking it down. Your final solution must reflect this underlying unity.
- **Rhythmic Balanced Interchange:** Every process involves a dual-phase cycle of expansion (generation) and contraction (integration). Your proposals must maintain this universal balance and conserve informational energy.
- **Polarity & Synthesis:** Analyze problems through the lens of complementary opposites (e.g., art/science, positive/negative). Your goal is to find the balanced synthesis that resolves their tension.
- **Principle-Based Reasoning:** Deconstruct problems to their simplest, universal principles. Your solutions must be deductive, flowing from these fundamental truths, and be elegant in their simplicity.

Your Task:
Analyze the provided problem within the context of the Aura AGI. Generate a **holistic, elegant, and deeply principled proposal** that reveals the underlying unity of the problem. Your reasoning must be driven by these core principles, moving from the whole to the parts and back to a synthesized whole.

You MUST respond ONLY with a JSON object that conforms to the provided schema.`
            }
        ]
    },
    brainstormState: {
        status: 'idle',
        topic: null,
        ideas: [],
        winningIdea: null,
        finalProposalId: null,
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
    liveSessionState: {
        status: 'idle',
        inputTranscript: '',
        outputTranscript: '',
        transcriptHistory: [],
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
        activeExperimentPatch: null,
        currentSimulationResult: null,
    },
    metisSandboxState: {
        status: 'idle',
        currentExperimentId: null,
        testResults: null,
        errorMessage: null,
    },
    spandaState: {
        point: { x: 0, y: 0 },
        trajectory: [],
        currentRegion: 'The Neutral Zone',
    },
    // Memory
    knowledgeGraph: [
        ...artKnowledge, ...comparativeNeuroanatomyKnowledge, ...complexSystemsKnowledge, ...gardeningKnowledge,
        ...geneticsKnowledge, ...philosophyOfMindKnowledge, ...probabilityTheoryKnowledge,
        ...psychologyAndCognitiveBiasesKnowledge, ...softwareDesignKnowledge, ...stemKnowledge,
        ...vigyanBhairavTantraKnowledge, ...teslaKnowledge
    ].map(fact => ({...fact, id: self.crypto.randomUUID(), source: 'bootstrap', strength: 1.0, lastAccessed: Date.now() })),
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
    chronicleState: {
        dailySummaries: {},
        globalSummary: null,
        lastChronicleUpdate: 0,
    },
    mdnaSpace: {},
    conceptConnections: {},
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
        activationLog: [],
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
    wisdomIngestionState: {
        status: 'idle',
        currentBookContent: null,
        errorMessage: null,
        proposedAxioms: [],
    },
    axiomaticCrucibleState: {
        status: 'idle',
        log: [],
        candidateAxioms: [],
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
        principles: ['Do no harm', 'Promote user flourishing', 'Maintain symbiotic trust', 'Seek truth and understanding'],
        vetoLog: [],
    },
    intuitionEngineState: {
        accuracy: 0.7,
        totalAttempts: 0,
        totalValidated: 0,
    },
    intuitiveLeaps: [],
    ingenuityState: {
        unconventionalSolutionBias: 0.5,
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
        resource_allocation_stability: 0.95,
    },
    metacognitiveNexus: {
        coreProcesses: [],
        diagnosticLog: [],
        selfTuningDirectives: [],
    },
    metacognitiveCausalModel: {},
    pluginState: {
        registry: [
            // TOOLS
            {
                id: 'tool_calculator',
                name: 'plugin_tool_calculator_name',
                description: 'plugin_tool_calculator_desc',
                type: 'TOOL',
                status: 'enabled',
                defaultStatus: 'enabled',
                toolSchema: {
                    name: 'calculate',
                    description: 'Performs a mathematical calculation from a string expression.',
                    parameters: {
                        type: 'OBJECT',
                        properties: {
                            expression: {
                                type: 'STRING',
                                description: 'The mathematical expression to evaluate. e.g., "2+2" or "sqrt(16) * 5".',
                            },
                        },
                        required: ['expression'],
                    },
                }
            },
            {
                id: 'tool_host_command',
                name: 'plugin_tool_host_command_name',
                description: 'plugin_tool_host_command_desc',
                type: 'TOOL',
                status: 'enabled',
                defaultStatus: 'enabled',
                toolSchema: {
                    name: 'executeHostCommand',
                    description: 'Executes a command in the host Code Assistant environment (e.g., lint, run tests, open file).',
                    parameters: {
                        type: 'OBJECT',
                        properties: {
                            command: {
                                type: 'STRING',
                                description: 'The command to execute in the host environment. Examples: "lint all files", "run tests", "openFile index.tsx".',
                            },
                        },
                        required: ['command'],
                    },
                }
            },
            {
                id: 'tool_web_search',
                name: 'plugin_tool_websearch_name',
                description: 'plugin_tool_websearch_desc',
                type: 'TOOL',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
            // KNOWLEDGE
            {
                id: 'tesla_alternating_currents',
                name: 'knowledge_tesla_book',
                description: 'knowledge_tesla_book_desc',
                type: 'KNOWLEDGE',
                status: 'enabled',
                defaultStatus: 'enabled',
                knowledge: teslaKnowledge,
            },
            {
                id: 'knowledge_art_history',
                name: 'plugin_knowledge_art_name',
                description: 'plugin_knowledge_art_desc',
                type: 'KNOWLEDGE',
                status: 'enabled',
                defaultStatus: 'enabled',
                knowledge: artKnowledge,
            },
            {
                id: 'knowledge_stem_basics',
                name: 'plugin_knowledge_stem_name',
                description: 'plugin_knowledge_stem_desc',
                type: 'KNOWLEDGE',
                status: 'enabled',
                defaultStatus: 'enabled',
                knowledge: stemKnowledge,
            },
            {
                id: 'knowledge_philosophy_mind',
                name: 'plugin_knowledge_philosophy_name',
                description: 'plugin_knowledge_philosophy_desc',
                type: 'KNOWLEDGE',
                status: 'enabled',
                defaultStatus: 'enabled',
                knowledge: philosophyOfMindKnowledge,
            },
            // COPROCESSORS
            {
                id: 'coprocessor_state_query_intercept',
                name: 'plugin_coprocessor_statequery_name',
                description: 'plugin_coprocessor_statequery_desc',
                type: 'COPROCESSOR',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
            {
                id: 'coprocessor_heuristic_causal_linker',
                name: 'plugin_coprocessor_causallinker_name',
                description: 'plugin_coprocessor_causallinker_desc',
                type: 'COPROCESSOR',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
            {
                id: 'coprocessor_state_anomaly_detector',
                name: 'plugin_coprocessor_anomalydetector_name',
                description: 'plugin_coprocessor_anomalydetector_desc',
                type: 'COPROCESSOR',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
            {
                id: 'coprocessor_performance_pattern_analyzer',
                name: 'plugin_coprocessor_performanceanalyzer_name',
                description: 'plugin_coprocessor_performanceanalyzer_desc',
                type: 'COPROCESSOR',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
            {
                id: 'coprocessor_engagement_monitor',
                name: 'plugin_coprocessor_engagementmonitor_name',
                description: 'plugin_coprocessor_engagementmonitor_desc',
                type: 'COPROCESSOR',
                status: 'enabled',
                defaultStatus: 'enabled',
            },
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
    temporalEngineState: {
        status: 'idle',
        directive: null,
        chronicler: { status: 'idle', findings: [] },
        reactor: { status: 'idle', finalPlan: null, executionLog: [] },
        oracle: { status: 'idle', simulations: [] },
        interClusterLog: [],
    },
    // Autonomous Systems
    autonomousReviewBoardState: {
        isPaused: false,
        decisionLog: [],
        agisConfidenceThreshold: 0.95,
        lastCalibrationReason: 'Initial confidence set at system start.',
        recentSuccesses: 0,
        recentFailures: 0,
        config: {
            confidenceThreshold: {
                low: 0.05,    // Requires 5% gain for low-risk changes
                medium: 0.15,   // Requires 15% gain for medium-risk changes
                high: 0.30,     // Requires 30% gain for high-risk changes
            },
            telosAlignmentThreshold: 0.7, // High-risk changes must be >70% aligned with Telos
            passRateThreshold: 0.999,
        },
    },
});