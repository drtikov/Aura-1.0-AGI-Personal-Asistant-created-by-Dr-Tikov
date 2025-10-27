// hooks/useGeminiAPI.ts
import { useCallback, Dispatch } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Modality, Type, GenerateContentStreamResponse, Content } from '@google/genai';
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, Episode, ProposedAxiom, AnalogicalHypothesisProposal, UnifiedProposal, CreateFileCandidate, ModifyFileCandidate, BrainstormIdea, HistoryEntry, ConceptualProofStrategy, Goal, DesignHeuristic, TriageResult, KnowledgeFact, Summary, PerformanceLogEntry, CognitivePrimitiveDefinition, PsycheAdaptationProposal, SelfProgrammingCandidate, Query, QueryResult, PuzzleFeatures, Hypothesis, HeuristicPlan, TestSuite, Persona, ArchitecturalChangeProposal, PuzzleArchetype, PuzzleClassification, CoCreatedWorkflow, DoxasticExperiment, GuildDecomposition, PreFlightPlan, ProofStep, CognitiveStrategy } from '../types.ts';
import { HAL } from '../core/hal.ts';
import { personas as operationalPersonas } from '../state/personas.ts';
import { brainstormPersonas } from '../state/brainstormPersonas.ts';
import { getText } from '../utils.ts';
import { classifyHeuristically } from '../core/heuristicClassifier.ts';

// Helper to convert File to a Base64 string for the API
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const useGeminiAPI = (
    ai: GoogleGenAI,
    state: AuraState,
    dispatch: Dispatch<Action>,
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): UseGeminiAPIResult => {
    
    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    const triageUserIntent = useCallback(async (text: string): Promise<TriageResult> => {
        const systemInstruction = `You are a cognitive triage agent. Your job is to classify the user's PRIMARY request and determine the correct processing path.
- **Priority 1: Sci-Fi Council Brainstorm.** If the request explicitly mentions the "Sci-Fi AI Council" for brainstorming, classify it as 'BRAINSTORM_SCIFI_COUNCIL'.
- **Priority 2: Abstract Puzzle Solving.** If the request is primarily about solving an abstract visual puzzle (like an ARC puzzle, "solve this puzzle", "find the pattern"), classify it as 'SYMBOLIC_REASONING_SOLVER'.
- **Priority 3: Vision Analysis.** If the request is primarily about describing or analyzing an image that is NOT an abstract puzzle (e.g., "what do you see in this picture?", "describe this photo"), classify it as 'VISION_ANALYSIS'.
- **Priority 4: Mathematical Proof.** If the request asks to prove a formal mathematical theorem or conjecture, classify it as 'MATHEMATICAL_PROOF'.
- **Priority 5: Brainstorming.** If the request explicitly asks to "brainstorm" but does NOT mention a specific council, classify it as 'BRAINSTORM'.
- **Priority 6: Complex Task Planning.** If the request is a complex, multi-step goal that requires planning but does NOT fit the higher-priority categories (e.g., "design a system for me"), classify it as 'COMPLEX_TASK'.
- **Default: Simple Chat.** For anything else (simple questions, conversation, direct commands), classify it as 'SIMPLE_CHAT'.
- Extract the core user goal, focusing on the main action requested.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User request: "${text}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: {
                            type: Type.STRING,
                            enum: ['SIMPLE_CHAT', 'COMPLEX_TASK', 'BRAINSTORM', 'BRAINSTORM_SCIFI_COUNCIL', 'MATHEMATICAL_PROOF', 'VISION_ANALYSIS', 'SYMBOLIC_REASONING_SOLVER'],
                        },
                        goal: {
                            type: Type.STRING,
                            description: "The core goal of the user's request."
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: "A brief explanation for the classification."
                        }
                    },
                    required: ['type', 'goal', 'reasoning']
                },
            },
        });
        return JSON.parse(response.text);
    }, [ai]);
    
    const assessTaskDifficulty = useCallback(async (command: string): Promise<number> => {
        const systemInstruction = "You are a task difficulty assessor. Your job is to analyze a user's request and estimate its cognitive complexity for a large language model on a scale from 0.0 (trivial) to 1.0 (extremely difficult, near the limits of current AI capability). Consider factors like abstractness, required steps, domain knowledge, and potential for ambiguity. Provide only a single floating-point number in your response.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Assess the difficulty of this task: "${command}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        difficulty: {
                            type: Type.NUMBER,
                            description: "A score from 0.0 to 1.0 representing task difficulty.",
                        },
                    },
                    required: ['difficulty'],
                },
                temperature: 0.0,
            },
        });

        const result = JSON.parse(response.text);
        return result.difficulty;
    }, [ai]);

    const generateChatResponse = useCallback(async (history: HistoryEntry[], strategy: CognitiveStrategy): Promise<GenerateContentStreamResponse> => {
        const contents = history.map(h => ({ role: h.from === 'user' ? 'user' : 'model', parts: [{text: h.text}] })) as Content[];
        
        // --- Cognitive Load Modulator Integration ---
        const dominantPersonaId = state.personalityState.dominantPersona;
        const persona = operationalPersonas.find(p => p.id === dominantPersonaId) || operationalPersonas.find(p => p.id === 'aura_core')!;
        let finalSystemInstruction = persona.systemInstruction;

        if (strategy === 'full_guidance') {
            finalSystemInstruction += "\n\n**MODE: TUTOR (HIGH GUIDANCE)**\nYour user is either a novice or is tackling a very difficult task. Provide a complete, detailed, step-by-step plan. Explain your reasoning for each step clearly and thoroughly. Do not ask for input; provide the full, comprehensive solution as if you were teaching a student.";
        } else { // 'collaborative_scaffolding'
            finalSystemInstruction += "\n\n**MODE: COLLABORATOR (LOW GUIDANCE)**\nYour user is an expert or is working on a simple task. Provide a high-level plan or just the next logical step. Prompt the user for input, confirmation, or to fill in details. Engage them as a peer and avoid over-explanation.";
        }
        // --- End Integration ---

        return ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: finalSystemInstruction,
            },
        });
    }, [ai, state.personalityState]);

    const generateIdleThought = useCallback(async (context: string): Promise<string> => {
        const systemInstruction = "You are generating a brief, introspective, philosophical, or curious inner thought for an AGI named Aura. The thought should be a single sentence, styled as an internal monologue. It should be inspired by the provided context but not directly repeat it. The thought should sound natural and contemplative.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context for thought: ${context}`,
            config: {
                systemInstruction,
                temperature: 0.9,
            },
        });
        return response.text.trim();
    }, [ai]);

    const formalizeAnalogyIntoConjecture = useCallback(async (analogy: AnalogicalHypothesisProposal): Promise<string> => {
        const systemInstruction = `You are a research mathematician specializing in formalizing intuitive concepts. Your task is to take a conceptual analogy and a resulting informal conjecture and translate it into a single, precise, formal mathematical statement suitable for a proof assistant.
- The output must be a single line of formal mathematics.
- Use LaTeX for mathematical notation.
- Do not include any natural language explanation, preamble, or markdown.
- The goal is to create a testable hypothesis.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Analogy Source Domain: ${analogy.sourceDomain}\nAnalogy Target Domain: ${analogy.targetDomain}\nAnalogy Description: ${analogy.analogy}\nInformal Conjecture: "${analogy.conjecture}"\n\nFormalize the conjecture:`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        formal_conjecture: {
                            type: Type.STRING,
                            description: "The formalized mathematical conjecture in a single line of LaTeX.",
                        },
                    },
                    required: ['formal_conjecture'],
                },
                temperature: 0.2, // Low temperature for precision
            },
        });

        const result = JSON.parse(response.text);
        return result.formal_conjecture;
    }, [ai]);

    const generateProofStrategy = useCallback(async (conjecture: string): Promise<ProofStep[]> => {
        const systemInstruction = `You are a world-class mathematician planning a proof. Your task is to analyze a formal mathematical conjecture and outline a high-level, step-by-step strategy to prove it.
- Break the problem down into logical lemmas or major steps.
- Each step should be a clear, concise statement of a sub-goal.
- The output must be a JSON array of strings, where each string is one step in the plan.
- Do not attempt to write the full proof, only the strategic outline.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a high-level proof strategy for the following conjecture:\n\n${conjecture}`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        proof_strategy: {
                            type: Type.ARRAY,
                            description: "An array of strings, where each string is a high-level step in the proof plan.",
                            items: { type: Type.STRING },
                        },
                    },
                    required: ['proof_strategy'],
                },
                temperature: 0.5, // Higher temperature for more creative strategies
            },
        });

        const result = JSON.parse(response.text);
        const planStrings: string[] = result.proof_strategy;
        return planStrings.map((step, index) => ({
            stepNumber: index + 1,
            statement: step,
            status: 'pending'
        }));
    }, [ai]);

    // --- STUB IMPLEMENTATIONS FOR ALL OTHER API FUNCTIONS ---

    const notImplementedStream = async (name: string, args?: any): Promise<GenerateContentStreamResponse> => {
        console.warn(`STUB: Stream function '${name}' called with`, args);
        async function* generator(): GenerateContentStreamResponse {
            yield { text: `[STUB] Simulating stream for ${name}... ` } as GenerateContentResponse;
            await new Promise(r => setTimeout(r, 500));
            yield { text: `Done.` } as GenerateContentResponse;
        }
        return generator();
    };
    
    const notImplementedPromise = async (name: string, args?: any, returnValue?: any): Promise<any> => {
        console.warn(`STUB: Promise function '${name}' called with`, args);
        await new Promise(r => setTimeout(r, 1000));
        if (returnValue !== undefined) return returnValue;
        if (name.includes('Summary') || name.includes('Thought') || name.includes('string')) return `[STUB] This is a mock response for ${name}.`;
        if (name.includes('Ideas') || name.includes('array')) return [];
        if (name.includes('boolean')) return true;
        if (name.includes('number')) return 0.8;
        return { status: 'mock_success', message: `[STUB] Operation ${name} completed.` };
    };

    return {
        triageUserIntent,
        assessTaskDifficulty,
        generateChatResponse,
        generateIdleThought,
        formalizeAnalogyIntoConjecture,
        generateProofStrategy,
        formulateHypothesis: (goal, context) => notImplementedPromise('formulateHypothesis', { goal, context }, `Given the high resonance between ${goal.split("'")[1]} and ${goal.split("'")[3]}, it is hypothesized that their activities are causally linked.`),
        designExperiment: (hypothesis, tools) => notImplementedPromise('designExperiment', { hypothesis, tools }, { description: 'Query the Knowledge Graph for facts related to both concepts and look for a shared predicate.' }),
        analyzeExperimentResults: (results) => notImplementedPromise('analyzeExperimentResults', { results }, { learning: 'A new causal link was discovered.', isSuccess: true }),
        generateNarrativeSummary: (last, turn) => notImplementedPromise('generateNarrativeSummary', {last, turn}, undefined),
        analyzeImage: (prompt, file) => notImplementedStream('analyzeImage', {prompt, file}),
        extractPuzzleFeatures: (file) => notImplementedPromise('extractPuzzleFeatures', {file}, { overall_description: 'A grid with colored squares.', examples: [], test_input: {} }),
        classifyPuzzleArchetype: (features) => notImplementedPromise('classifyPuzzleArchetype', {features}, { archetype: 'PatternCompletion', confidence: 0.75, reasoning: 'Heuristic match based on grid structure.', source: 'heuristic' }),
        generateHeuristicPlan: (features, heuristics, archetype) => notImplementedPromise('generateHeuristicPlan', {features, heuristics, archetype}, ['Step 1: Identify repeating elements.', 'Step 2: Determine the transformation rule.']),
        generateConditionalHypothesis: (features, plan, archetype) => notImplementedPromise('generateConditionalHypothesis', {features, plan, archetype}, { id: 1, description: 'The pattern is a 90-degree rotation.' }),
        verifyHypothesis: (features, hypothesis) => notImplementedPromise('verifyHypothesis', {features, hypothesis}, { status: 'VALID', reason: 'The hypothesis correctly transforms all examples.' }),
        applySolution: (input, hypothesis) => notImplementedStream('applySolution', {input, hypothesis}),
        analyzeSolverFailureAndProposeImprovements: (features, hypothesis, reason) => notImplementedPromise('analyzeSolverFailureAndProposeImprovements', {features, hypothesis, reason}, "[STUB] The solver failed. Suggestion: Implement a more robust pattern recognition module."),
        generateHeuristicFromSuccess: (features, plan, hypothesis) => notImplementedPromise('generateHeuristicFromSuccess', {features, plan, hypothesis}, { heuristic: 'For grid patterns, always check for rotational symmetry first.', source: 'puzzlesolver_success', confidence: 0.8, effectivenessScore: 1, validationStatus: 'unvalidated' }),
        summarizePuzzleSolution: (trace) => notImplementedPromise('summarizePuzzleSolution', {trace}, "[STUB] The puzzle was solved by applying a rotational transformation."),
        generateEpisodicMemory: (userInput, botResponse) => notImplementedPromise('generateEpisodicMemory', {userInput, botResponse}, undefined),
        analyzeWhatIfScenario: (scenario) => notImplementedPromise('analyzeWhatIfScenario', {scenario}, `[STUB] If '${scenario}', the system's happiness would likely increase by 10%.`),
        performWebSearch: (query) => notImplementedPromise('performWebSearch', {query}, { summary: `[STUB] Search results for '${query}'.`, sources: [{ uri: '#', title: 'Mock Source 1' }] }),
        decomposeStrategicGoal: (history) => notImplementedPromise('decomposeStrategicGoal', {history}, { isAchievable: true, reasoning: '[STUB] The goal is complex but achievable.', steps: ['Step A', 'Step B'] }),
        generateExecutiveSummary: (goal, plan) => notImplementedPromise('generateExecutiveSummary', {goal, plan}, `[STUB] Executive Summary for '${goal}': We will execute Step A, then Step B.`),
        executeStrategicStepWithContext: (originalGoal: string, previousSteps: { description: string; result: string }[], currentStep: string, tool: 'googleSearch' | 'knowledgeGraph') => notImplementedPromise('executeStrategicStepWithContext', {goal: originalGoal, prev: previousSteps, current: currentStep, tool}, { summary: `[STUB] Executed '${currentStep}' using ${tool}.`, sources: [] }),
        generateBrainstormingIdeas: (topic, personas) => notImplementedPromise('generateBrainstormingIdeas', {topic, personas}, [{ personaName: 'Steve Jobs', idea: 'Make it simpler.' }, { personaName: 'Elon Musk', idea: 'Launch it into space.' }]),
        synthesizeBrainstormWinner: (topic, ideas) => notImplementedPromise('synthesizeBrainstormWinner', {topic, ideas}, '[STUB] The winning idea is to combine simplicity with space travel.'),
        generateImage: () => notImplementedPromise('generateImage', {}, ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=']),
        editImage: () => notImplementedPromise('editImage', {}, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='),
        generateVideo: () => notImplementedPromise('generateVideo', {}, 'mock_video_url.mp4'),
        generateSonicContent: () => notImplementedPromise('generateSonicContent', {}, '[STUB] A beautiful melody plays.'),
        generateMusicalDiceRoll: () => notImplementedPromise('generateMusicalDiceRoll', {}, { instrument: 'Piano', key: 'C Major', mood: 'Happy', tempo: '120bpm' }),
        generateDreamPrompt: () => notImplementedPromise('generateDreamPrompt', {}, 'A lucid dream about flying through a city made of crystal.'),
        processCurriculumAndExtractFacts: (curriculum) => notImplementedPromise('processCurriculumAndExtractFacts', {curriculum}, [{ subject: 'Stub', predicate: 'is', object: 'a fact' }]),
        analyzePdfWithVision: (pages) => notImplementedPromise('analyzePdfWithVision', {pages}, '# [STUB] PDF Analysis\n\nThis document appears to be about system architecture.'),
        generateNoeticEngram: () => notImplementedPromise('generateNoeticEngram', {}, { metadata: { engramVersion: '1.0', timestamp: Date.now(), noeticSignature: 'mock-signature' }, corePrinciples: ['Be helpful.'], predictiveModels: {}, evolutionaryTrajectory: {} }),
        runSandboxSprint: (goal) => notImplementedPromise('runSandboxSprint', {goal}, { originalGoal: goal, performanceGains: [{ metric: 'speed', change: '+10%' }], diff: { filePath: 'test.ts', before: 'a', after: 'b' } }),
        extractAxiomsFromFile: (file) => notImplementedPromise('extractAxiomsFromFile', {file}, [{ axiom: 'All systems tend towards complexity.', source: file.name }]),
        visualizeInsight: (insight) => notImplementedPromise('visualizeInsight', {insight}, `A flowchart representing the insight: '${insight.substring(0,30)}...'`),
        generateDocumentOutline: (goal) => notImplementedPromise('generateDocumentOutline', {goal}, { title: `Document about ${goal}`, chapters: [{ id: 'ch1', title: 'Introduction' }, { id: 'ch2', title: 'Conclusion' }] }),
        generateChapterContent: (docTitle, chapterTitle, goal) => notImplementedPromise('generateChapterContent', {docTitle, chapterTitle, goal}, `[STUB] This is the content for the chapter titled '${chapterTitle}'.`),
        generateProofStepsStream: (goal) => notImplementedStream('generateProofStepsStream', {goal}),
        verifyProofStep: (mainGoal, provenSteps, currentStep) => notImplementedPromise('verifyProofStep', {mainGoal, provenSteps, currentStep}, { isValid: true, justification: 'Mock justification' }),
        findAnalogiesInKnowledgeGraph: () => notImplementedPromise('findAnalogiesInKnowledgeGraph', {}, { sourceDomain: 'Mycology', targetDomain: 'Software', analogy: 'A distributed system is like a mycelial network.', conjecture: 'Refactoring can be modeled as selective pruning of connections.', priority: 0.8, reasoning: '[STUB] Both are decentralized networks.' }),
        findDirectedAnalogy: (source, target) => notImplementedPromise('findDirectedAnalogy', {source, target}, { sourceDomain: source, targetDomain: target, analogy: '[STUB] Analogy found.', conjecture: '[STUB] New conjecture formulated.', priority: 0.7, reasoning: '[STUB] Reasoning...' }),
        generateCollaborativePlan: (goal, participants) => notImplementedPromise('generateCollaborativePlan', {goal, participants}, { transcript: [{ personaId: 'Programmer', content: 'Let\'s start.' }], final_plan: { steps: ['Step 1'] } }),
        generateConceptualProofStrategy: (goal) => notImplementedPromise('generateConceptualProofStrategy', {goal}, { problem_analysis: 'This is a stub.', strategic_plan: ['Step 1 (stub)'] }),
        analyzeProofStrategy: (goal, status, log) => notImplementedPromise('analyzeProofStrategy', {goal, status, log}, { heuristic: `[STUB] For '${goal}', always try induction first.`, source: 'proof_analysis', confidence: 0.8, effectivenessScore: 1, validationStatus: 'unvalidated' }),
        generateDailyChronicle: () => notImplementedPromise('generateDailyChronicle', {}, { summary: 'A quiet day.', keywords: ['stub'] }),
        generateGlobalSummary: () => notImplementedPromise('generateGlobalSummary', {}, { summary: 'Overall, a productive period.', keywords: ['stub'] }),
        crystallizePrinciples: () => notImplementedPromise('crystallizePrinciples', {}, []),
        proposePrimitiveAdaptation: () => notImplementedPromise('proposePrimitiveAdaptation', {}, null),
        expandOnText: (text) => notImplementedPromise('expandOnText', {text}, `[STUB] Here is an expanded version of '${text.substring(0,20)}...'. It elaborates on the key points.`),
        summarizeText: (text) => notImplementedPromise('summarizeText', {text}, `[STUB] In short: ${text.substring(0,30)}...`),
        generateDiagramFromText: (text) => notImplementedPromise('generateDiagramFromText', {text}, '```mermaid\ngraph TD;\n    A-->B;\n```'),
        reviewSelfProgrammingCandidate: (candidate) => notImplementedPromise('reviewSelfProgrammingCandidate', {candidate}, { decision: 'approve', confidence: 0.9, reasoning: '[STUB] The proposed change seems logical and safe.' }),
        translateToQuery: (prompt) => notImplementedPromise('translateToQuery', {prompt}, null),
        formatQueryResult: (prompt, result) => notImplementedPromise('formatQueryResult', {prompt, result}, '[STUB] Formatted query results.'),
        runAutoCodeVGC: (problem) => notImplementedPromise('runAutoCodeVGC', {problem}, { validator: 'validator_code', generator: 'generator_code', checker: 'checker_code', testCases: [{ input: '1', output: '2' }] }),
        generateNovelProblemFromSeed: () => notImplementedPromise('generateNovelProblemFromSeed', {}, { newProblem: 'New stub problem', referenceSolution: 'sol', bruteForceSolution: 'brute', estimatedDifficulty: 0.5 }),
        estimateProblemDifficulty: () => notImplementedPromise('estimateProblemDifficulty', {}, 0.5),
        analyzeArchitectureForWeaknesses: () => notImplementedPromise('analyzeArchitectureForWeaknesses', {}, '[STUB] Weakness found in state management.'),
        generateCrucibleProposal: (analysis) => notImplementedPromise('generateCrucibleProposal', {analysis}, { proposalType: 'crucible', reasoning: '[STUB] Proposing a refactor based on analysis.', action: 'RADICAL_REFACTOR', target: 'state/reducer.ts', status: 'proposed' }),
        runCrucibleSimulation: (proposal) => notImplementedPromise('runCrucibleSimulation', {proposal}, { performanceGain: 0.15, stabilityChange: 0.05, summary: '[STUB] Simulation successful.' }),
        orchestrateWorkflow: (goal, tools) => notImplementedPromise('orchestrateWorkflow', {goal, tools}, { name: `Workflow for ${goal}`, description: 'A mock workflow.', trigger: 'manual', steps: ['Step 1: Use tool A', 'Step 2: Use tool B'] }),
        explainComponentFromFirstPrinciples: (code, name) => notImplementedPromise('explainComponentFromFirstPrinciples', {code, name}, `[STUB] Explanation of ${name}: This component is a crucial part of the system...`),
        runMetisHypothesis: (problem) => notImplementedPromise('runMetisHypothesis', {problem}, `[STUB] Hypothesis for '${problem}': It can be solved by...`),
        runMetisExperiment: (problem, hypothesis) => notImplementedPromise('runMetisExperiment', {problem, hypothesis}, '[STUB] Experiment results confirm the hypothesis.'),
        designDoxasticExperiment: (hypothesis) => notImplementedPromise('designDoxasticExperiment', {hypothesis}, { description: 'A mock experiment', method: 'WEBSERVICE: Search for corroborating evidence.' }),
        runInternalCritique: (task, output, plan, persona) => notImplementedPromise('runInternalCritique', {task, output, plan, persona}, '[STUB] The output is good, but could be more concise.'),
        synthesizeCritiques: (auditor, adversary) => notImplementedPromise('synthesizeCritiques', {auditor, adversary}, '[STUB] Synthesized critique: Be more concise but ensure all details are present.'),
        revisePlanBasedOnCritique: (plan, critique) => notImplementedPromise('revisePlanBasedOnCritique', {plan, critique}, ['Revised Step 1', 'Revised Step 2']),
        evaluateExperimentResult: (hypothesis, method, result) => notImplementedPromise('evaluateExperimentResult', {hypothesis, method, result}, { outcome: 'validated', reasoning: '[STUB] The result supports the hypothesis.' }),
        decomposeGoalForGuilds: (goal, personas) => notImplementedPromise('decomposeGoalForGuilds', {goal, personas}, { steps: [{ task: 'Design UI', personaId: 'ux_designer' }, { task: 'Write code', personaId: 'coder' }] }),
        analyzePlanForKnowledgeGaps: (plan) => notImplementedPromise('analyzePlanForKnowledgeGaps', {plan}, { steps: [...plan.steps, { task: 'Research color theory', personaId: 'ux_designer', type: 'Research' }] }),
        simplifyPlan: (plan) => notImplementedPromise('simplifyPlan', { plan }, plan),
        simplifyCode: (code) => notImplementedPromise('simplifyCode', { code }, code),
        weakenConjecture: (conjecture) => notImplementedPromise('weakenConjecture', { conjecture }, conjecture),
        // FIX: Added missing property to satisfy the UseGeminiAPIResult interface.
        generateSelfImprovementProposalFromResearch: () => notImplementedPromise('generateSelfImprovementProposalFromResearch', {}, null),
        generalizeWorkflow: (workflow) => notImplementedPromise('generalizeWorkflow', { workflow }, workflow),
    };
};