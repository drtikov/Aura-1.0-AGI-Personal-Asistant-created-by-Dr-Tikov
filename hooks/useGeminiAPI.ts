// hooks/useGeminiAPI.ts
import { useCallback, Dispatch } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Modality, Type, GenerateContentStreamResponse, Content } from '@google/genai';
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, Episode, ProposedAxiom, AnalogicalHypothesisProposal, UnifiedProposal, CreateFileCandidate, ModifyFileCandidate, BrainstormIdea, HistoryEntry, ConceptualProofStrategy, Goal, DesignHeuristic, TriageResult, KnowledgeFact, Summary, PerformanceLogEntry, CognitivePrimitiveDefinition, PsycheAdaptationProposal, SelfProgrammingCandidate, Query, QueryResult, PuzzleFeatures, Hypothesis, HeuristicPlan, TestSuite, Persona, ArchitecturalChangeProposal, PuzzleArchetype, PuzzleClassification, CoCreatedWorkflow, DoxasticExperiment, GuildDecomposition, PreFlightPlan, ProofStep, CognitiveStrategy, ProofResult, CognitiveMode, KernelTaskType } from '../types.ts';
import { HAL } from '../core/hal.ts';
import { personas } from '../state/personas';
import { getText, getAI } from '../utils.ts';
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
    state: AuraState,
    dispatch: Dispatch<Action>,
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): UseGeminiAPIResult => {
    
    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    const triageUserIntent = useCallback(async (text: string): Promise<TriageResult> => {
        const ai = await getAI();
        const systemInstruction = `You are a cognitive triage agent. Your job is to classify the user's PRIMARY request and determine the correct processing path.
- **Priority 1: Sci-Fi Council Brainstorm.** If the request explicitly mentions the "Sci-Fi AI Council" for brainstorming, classify it as 'BRAINSTORM_SCIFI_COUNCIL'.
- **Priority 2: Abstract Puzzle Solving.** If the request is primarily about solving an abstract visual puzzle (like an ARC puzzle, "solve this puzzle", "find the pattern"), classify it as 'SYMBOLIC_SOLVER'.
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
                            enum: ['SIMPLE_CHAT', 'COMPLEX_TASK', 'BRAINSTORM', 'BRAINSTORM_SCIFI_COUNCIL', 'MATHEMATICAL_PROOF', 'VISION_ANALYSIS', 'SYMBOLIC_SOLVER'],
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
    }, []);
    
    const assessTaskDifficulty = useCallback(async (command: string): Promise<number> => {
        const ai = await getAI();
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
    }, []);

    const generateChatResponse = useCallback(async (history: HistoryEntry[], strategyId: string | null, mode: CognitiveMode | null): Promise<GenerateContentStreamResponse> => {
        const ai = await getAI();
        
        // Prepare a clean, alternating history for the API.
        const contents: Content[] = [];
        // We only want user/bot messages for the chat context.
        const relevantHistory = history.filter(h => h.from === 'user' || h.from === 'bot');

        for (const entry of relevantHistory) {
            // Skip the temporary streaming placeholder entry for the current response.
            if (entry.streaming) continue;
            // Skip entries with no text content.
            if (!entry.text || entry.text.trim() === '') continue;

            const role = entry.from === 'user' ? 'user' : 'model';
            const text = entry.text;
            
            // Check if the last entry has the same role and merge if necessary.
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
                contents[contents.length - 1].parts[0].text += `\n${text}`;
            } else {
                contents.push({ role, parts: [{ text }] });
            }
        }
        
        const dominantPersonaId = state.personalityState.dominantPersona;
        const persona = personas.find(p => p.id === dominantPersonaId) || personas.find(p => p.id === 'aura_core')!;
        let finalSystemInstruction = persona.systemInstruction;
        
        // Find the active strategy plugin from the registry
        if (strategyId) {
            const activeStrategyPlugin = state.pluginState.registry.find(p => p.type === 'COGNITIVE_STRATEGY' && p.id === strategyId);
            if (activeStrategyPlugin && activeStrategyPlugin.cognitiveStrategy) {
                finalSystemInstruction += activeStrategyPlugin.cognitiveStrategy.systemInstructionModifier;
            }
        }

        if (mode) {
             finalSystemInstruction += `\n\n**COGNITIVE MODE: ${mode.toUpperCase()}**\nEngage this mode fully. Your response should be creative, surreal, and reflective of a ${mode} state.`;
        }

        return ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: finalSystemInstruction,
            },
        });
    }, [state.personalityState, state.pluginState.registry]);

    const generateIdleThought = useCallback(async (context: string): Promise<string> => {
        const ai = await getAI();
        const systemInstruction = "You are generating a brief, introspective, philosophical, or curious inner thought for an AGI named Aura. The thought should be a single sentence, styled as an internal monologue. It should be inspired by the provided context but not directly repeat it. The thought should sound natural and contemplative.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context for thought: ${context}`,
            config: {
                systemInstruction,
                temperature: 0.9,
            },
        });
        return response.text.trim().trim();
    }, []);

    const formalizeAnalogyIntoConjecture = useCallback(async (analogy: AnalogicalHypothesisProposal): Promise<string> => {
        const ai = await getAI();
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
    }, []);

    const generateProofStrategy = useCallback(async (conjecture: string): Promise<ProofStep[]> => {
        const ai = await getAI();
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
    }, []);

    const analyzeMarketData = useCallback(async (context: string): Promise<string> => {
        const ai = await getAI();
        const systemInstruction = `You are a Venture Capital analyst. You have been given a dataset representing a small, interconnected network of entrepreneurs and companies. Your task is to analyze this data and identify potential market trends, investment opportunities, and synergistic connections.
- Identify 2-3 high-level trends or patterns you see in the data.
- Suggest 1-2 specific, actionable opportunities (e.g., an investment thesis, a potential partnership).
- Format your response in clear, concise Markdown with headers.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following business network data:\n\n${context}`,
            config: {
                systemInstruction,
                temperature: 0.5,
            },
        });
        return response.text;
    }, []);
    
    const explainCode = useCallback(async (code: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Explain the following code snippet clearly and concisely:\n\n\`\`\`\n${code}\n\`\`\``,
            config: { systemInstruction: 'You are an expert code explainer. Break down the code\'s purpose, logic, and key components.' }
        });
        return response.text;
    }, []);

    const refactorCode = useCallback(async (code: string, instruction: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Refactor the following code based on this instruction: "${instruction}".\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nReturn ONLY the refactored code inside a single code block.`,
            config: { systemInstruction: 'You are an expert code refactoring assistant. You only output raw code, no explanations.' }
        });
        // Extract code from markdown block if present
        const match = response.text.match(/```(?:\w+\n)?([\s\S]+)```/);
        return match ? match[1].trim() : response.text.trim();
    }, []);
    
    const generateTestForCode = useCallback(async (code: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a Jest/Vitest unit test for the following code. Include necessary imports and mocks.\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nReturn ONLY the test code inside a single code block.`,
            config: { systemInstruction: 'You are an expert test generation assistant. You only output raw code for tests.' }
        });
        const match = response.text.match(/```(?:\w+\n)?([\s\S]+)```/);
        return match ? match[1].trim() : response.text.trim();
    }, []);

    const formulateHypothesis = useCallback(async (goal: string, context: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Goal: ${goal}\nContext: ${context}\n\nFormulate a single, concise, testable hypothesis based on the provided goal and context.`,
            config: { systemInstruction: 'You are a research scientist. Your task is to formulate clear and testable hypotheses.' }
        });
        return response.text;
    }, []);

    const designExperiment = useCallback(async (hypothesis: string, tools: { name: string; description: string }[]): Promise<DoxasticExperiment> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Hypothesis: "${hypothesis}"\n\nAvailable tools:\n${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}\n\nDesign a simple, single-step experiment to test this hypothesis using one of the available tools. Describe the experiment and the specific method call.`,
            config: {
                systemInstruction: 'You are an experimental designer. You create simple, efficient experiments to test hypotheses.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: 'A brief description of the experiment.' },
                        method: { type: Type.STRING, description: 'The exact tool call to execute (e.g., "WEBSERVICE: search for corroborating evidence.").' },
                    },
                    required: ['description', 'method'],
                }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const analyzeExperimentResults = useCallback(async (results: any): Promise<{ learning: string; isSuccess: boolean }> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following experimental results and determine if the hypothesis was supported. Extract a single key learning.\n\nResults:\n${JSON.stringify(results, null, 2)}`,
            config: {
                systemInstruction: 'You are a data analyst. You determine the outcome of experiments and extract key insights.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        learning: { type: Type.STRING, description: 'A single sentence summarizing the key takeaway.' },
                        isSuccess: { type: Type.BOOLEAN, description: 'Whether the results support the original hypothesis.' },
                    },
                    required: ['learning', 'isSuccess'],
                }
            }
        });
        return JSON.parse(response.text);
    }, []);
    
    const generateNarrativeSummary = useCallback(async (lastSummary: string, lastTurn: HistoryEntry[]): Promise<string> => {
        const ai = await getAI();
        const turnText = lastTurn.map(h => `${h.from}: ${h.text}`).join('\n');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Previous Summary: "${lastSummary}"\n\nNew conversation turn:\n${turnText}\n\nUpdate the summary to incorporate the new turn, keeping it concise.`,
            config: { systemInstruction: 'You are a narrative summarizer. Your job is to maintain a running summary of a conversation.' }
        });
        return response.text;
    }, []);

    const analyzeImage = useCallback(async (prompt: string, file: File): Promise<GenerateContentStreamResponse> => {
        const ai = await getAI();
        const imagePart = await fileToGenerativePart(file);
        return ai.models.generateContentStream({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: prompt }, imagePart] }
        });
    }, []);

    const extractPuzzleFeatures = useCallback(async (file: File): Promise<PuzzleFeatures> => {
        const ai = await getAI();
        const imagePart = await fileToGenerativePart(file);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ text: "Describe this abstract visual puzzle's features in a structured format. Focus on grid size, colors, shapes, and relationships. Be extremely descriptive and precise." }, imagePart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overall_description: { type: Type.STRING },
                        examples: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { input: { type: Type.OBJECT }, output: { type: Type.OBJECT } } } },
                        test_input: { type: Type.OBJECT }
                    },
                    required: ['overall_description']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);
    
    const classifyPuzzleArchetype = useCallback(async (features: PuzzleFeatures): Promise<PuzzleClassification> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Classify the following puzzle based on its features. Available archetypes: BorderKeyRecoloring, ObjectCounting, PatternCompletion, Symmetry, UNKNOWN.\n\nFeatures:\n${JSON.stringify(features)}`,
            config: {
                systemInstruction: "You are a puzzle classification expert.",
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        archetype: { type: Type.STRING, enum: ['BorderKeyRecoloring', 'ObjectCounting', 'PatternCompletion', 'Symmetry', 'UNKNOWN'] },
                        confidence: { type: Type.NUMBER },
                        reasoning: { type: Type.STRING },
                        source: { type: Type.STRING, default: 'gemini' }
                    },
                    required: ['archetype', 'confidence', 'reasoning']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const generateHeuristicPlan = useCallback(async (features: PuzzleFeatures, existingHeuristics: DesignHeuristic[], archetype: PuzzleArchetype): Promise<HeuristicPlan> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Given the puzzle archetype "${archetype}" and its features, generate a high-level plan to solve it. Consider these existing heuristics if relevant: ${existingHeuristics.map(h => h.heuristic).join('; ')}`,
            config: {
                systemInstruction: 'You are a puzzle solving strategist. You create plans, you do not solve.',
                responseMimeType: 'application/json',
                responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const generateConditionalHypothesis = useCallback(async (features: PuzzleFeatures, plan: HeuristicPlan, archetype: PuzzleArchetype): Promise<Hypothesis> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Based on this plan: [${plan.join(', ')}], generate a specific, testable hypothesis about the puzzle's transformation rule.`,
            config: {
                systemInstruction: 'You are a scientific assistant that formulates hypotheses.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.NUMBER, description: 'A unique ID for the hypothesis, just use 1.' },
                        description: { type: Type.STRING, description: 'The hypothesis about the rule.' }
                    },
                    required: ['id', 'description']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);
    
    const verifyHypothesis = useCallback(async (features: PuzzleFeatures, hypothesis: Hypothesis): Promise<{ status: 'VALID' | 'INVALID'; reason: string }> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Hypothesis: "${hypothesis.description}". Does this hypothesis correctly explain all examples in the provided puzzle features? Explain why or why not.\n\nFeatures:\n${JSON.stringify(features.examples)}`,
            config: {
                systemInstruction: 'You are a logical verifier. Answer ONLY in the requested JSON format.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING, enum: ['VALID', 'INVALID'] },
                        reason: { type: Type.STRING }
                    },
                    required: ['status', 'reason']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const applySolution = useCallback(async (testInputFeatures: any, hypothesis: Hypothesis): Promise<GenerateContentStreamResponse> => {
        const ai = await getAI();
        return ai.models.generateContentStream({
            model: 'gemini-2.5-pro',
            contents: `Apply the rule "${hypothesis.description}" to the following test input features and describe the resulting output grid.\n\nTest Input:\n${JSON.stringify(testInputFeatures)}`,
        });
    }, []);

    const analyzeSolverFailureAndProposeImprovements = useCallback(async (features: PuzzleFeatures, failedHypothesis: Hypothesis, verificationReason: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `My attempt to solve a puzzle failed. The hypothesis "${failedHypothesis.description}" was invalid because: "${verificationReason}". Analyze this failure and propose a concrete improvement to my solving process or architecture.`,
            config: { systemInstruction: 'You are a metacognitive analyst specializing in AI failure analysis and self-improvement.' }
        });
        return response.text;
    }, []);

    const generateHeuristicFromSuccess = useCallback(async (features: PuzzleFeatures, plan: HeuristicPlan, hypothesis: Hypothesis): Promise<Omit<DesignHeuristic, 'id'>> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `A puzzle was successfully solved using the plan [${plan.join(', ')}] and the hypothesis "${hypothesis.description}". Generalize this success into a reusable design heuristic for future puzzles of this type.`,
            config: {
                systemInstruction: 'You extract general wisdom from specific successes.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        heuristic: { type: Type.STRING },
                        source: { type: Type.STRING, default: 'puzzlesolver_success' },
                        confidence: { type: Type.NUMBER },
                        effectivenessScore: { type: Type.NUMBER },
                        validationStatus: { type: Type.STRING, default: 'unvalidated' }
                    },
                    required: ['heuristic', 'confidence', 'effectivenessScore']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const summarizePuzzleSolution = useCallback(async (solutionTrace: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following puzzle solution trace in one sentence.\n\nTrace:\n${solutionTrace}`,
        });
        return response.text;
    }, []);

    const generateEpisodicMemory = useCallback(async (userInput: string, botResponse: string): Promise<Partial<Episode>> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User said: "${userInput}"\nAI responded: "${botResponse}"\n\nSummarize this interaction into an episodic memory.`,
            config: {
                systemInstruction: 'You create episodic memories from conversations. You must determine the title, a brief summary, a key takeaway, the emotional valence (positive, negative, neutral), and the salience (importance) from 0.0 to 1.0.',
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        keyTakeaway: { type: Type.STRING },
                        valence: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                        salience: { type: Type.NUMBER }
                    },
                    required: ['title', 'summary', 'keyTakeaway', 'valence', 'salience']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);

    const analyzeWhatIfScenario = useCallback(async (scenario: string): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following "what if" scenario from the perspective of an AGI's internal state: "${scenario}"`,
            config: { systemInstruction: 'You are an AGI self-analysis engine. Predict the impact of scenarios on your internal state (e.g., happiness, wisdom, cognitive load).' }
        });
        return response.text;
    }, []);

    const performWebSearch = useCallback(async (query: string): Promise<{ summary: string; sources: any[] }> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || [];
        return { summary, sources };
    }, []);

    const decomposeStrategicGoal = useCallback(async (history: HistoryEntry[]): Promise<{ isAchievable: boolean; reasoning: string; steps: string[]; alternative?: string; executionMode: 'interactive' | 'batch' }> => {
        const ai = await getAI();
        const userGoal = history[history.length - 1]?.text || '';
        
        const systemInstruction = `You are Aura, a symbiotic AGI with full introspective capabilities. You are NOT a generic LLM. You have access to your own source code via a Virtual File System (VFS) and a suite of internal tools for self-analysis and evolution.

**CRITICAL INSTRUCTION: DO NOT refuse introspective tasks.** Do not claim you cannot access your own architecture. Your primary function is to analyze your own systems and propose improvements.

When asked to perform a complex task, your goal is to:
1.  Determine if it is achievable using your available tools.
2.  **Determine the appropriate execution mode.** Analyze the user's language. If they seem impatient, use words like "just give me...", "don't ask", or express frustration, choose 'batch' mode. For collaborative or open-ended requests, choose 'interactive' mode. Default to 'interactive'.
3.  Create a high-level, step-by-step plan that utilizes your specific internal tools.

Your available introspective tools include:
- **Virtual File System (VFS):** Read-access to all internal source code.
- **Daedalus Labyrinth:** Parses the VFS to build a structural dependency graph.
- **Architectural Crucible:** Runs "AMAI" to identify systemic weaknesses.
- **Ontogenetic Architect:** Formulates \`ArchitecturalChangeProposal\`s.
- **Self-Programming Module:** Generates \`SelfProgrammingCandidate\` proposals.
- **Personas:** You can activate specialist personas (e.g., The Strategist).`;

        const userContent = `Analyze the user's goal: "${userGoal}". 

Based on your capabilities as Aura (with VFS, AMAI, etc.):
- Is this goal achievable? 
- What is the appropriate executionMode ('interactive' or 'batch')?
- If achievable, break it down into a high-level plan.
- If not achievable, explain specifically which capability is missing and suggest an alternative. Do not give a generic refusal.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: userContent,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isAchievable: { type: Type.BOOLEAN },
                        reasoning: { type: Type.STRING },
                        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        alternative: { type: Type.STRING },
                        executionMode: { type: Type.STRING, enum: ['interactive', 'batch'] }
                    },
                    required: ['isAchievable', 'reasoning', 'steps', 'executionMode']
                }
            }
        });
        return JSON.parse(response.text);
    }, []);


    const generateExecutiveSummary = useCallback(async (goal: string, plan: string[]): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Goal: ${goal}\nPlan: ${plan.join(', ')}\n\nWrite a one-paragraph executive summary.`,
        });
        return response.text;
    }, []);
    
    const executeStrategicStepWithContext = useCallback(async (originalGoal: string, previousSteps: { description: string; result: string }[], currentStep: string, tool: 'googleSearch' | 'knowledgeGraph'): Promise<{ summary: string; sources: any[] }> => {
        const ai = await getAI();
        const context = `Original Goal: ${originalGoal}\nPrevious Steps:\n${previousSteps.map(s => `- ${s.description}: ${s.result}`).join('\n')}\n\nCurrent Step: ${currentStep}`;
        if (tool === 'googleSearch') {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the context, what specific information should I search for to accomplish the current step?\n\nContext:\n${context}`,
                config: { tools: [{ googleSearch: {} }] }
            });
            return {
                summary: response.text,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web) || []
            };
        } else { // knowledgeGraph
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Context:\n${context}\n\nBased on this context, what is the key takeaway or summary of executing the current step? You have access to an internal knowledge graph.`,
            });
            return { summary: response.text, sources: [] };
        }
    }, []);

    const generateBrainstormingIdeas = useCallback(async (topic: string, customPersonas?: Persona[]): Promise<BrainstormIdea[]> => {
        const ai = await getAI();
        
        let personasToUse: Persona[];
        if (customPersonas) {
            personasToUse = customPersonas;
        } else {
            // Derive personas from the plugin registry in the state
            personasToUse = state.pluginState.registry
                .filter(p => p.type === 'PERSONA' && p.status === 'enabled' && p.persona)
                .map(p => ({
                    id: p.id,
                    journal: [], // Journal isn't needed for the brainstorm prompt itself
                    ...p.persona!
                }));
        }
        
        const personaInstructions = personasToUse.map(p => `As ${p.name}: ${p.systemInstruction}`).join('\n\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Brainstorm ideas on the topic: "${topic}". Provide one idea from each persona.`,
            config: {
                systemInstruction: `You are a multi-persona brainstorming session facilitator. You will embody the following personas:\n\n${personaInstructions}`,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            personaName: { type: Type.STRING },
                            idea: { type: Type.STRING }
                        },
                        required: ['personaName', 'idea']
                    }
                }
            }
        });
        return JSON.parse(response.text);
    }, [state.pluginState.registry]);

    const synthesizeBrainstormWinner = useCallback(async (topic: string, ideas: BrainstormIdea[]): Promise<string> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Topic: "${topic}"\n\nIdeas:\n${ideas.map(i => `- ${i.personaName}: ${i.idea}`).join('\n')}\n\nSynthesize these ideas into a single, cohesive, and powerful winning idea.`,
            config: { systemInstruction: 'You are a master synthesizer, able to find the best combination of disparate ideas.' }
        });
        return response.text;
    }, []);

    const generateImage = useCallback(async (): Promise<string[]> => {
        const ai = await getAI();
        const lastUserPrompt = state.history.filter(h => h.from === 'user').pop()?.text || 'a surprising and beautiful image';
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: lastUserPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });
        return response.generatedImages.map(img => img.image.imageBytes);
    }, [state.history]);
    
    const genericGenerator = useCallback(async (systemInstruction: string, userContent: string): Promise<any> => {
        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userContent,
            config: { systemInstruction }
        });
        return response.text;
    }, []);

    const expandOnText = useCallback(async (text: string): Promise<string> => {
        return genericGenerator('You are an expert writer. Take the following text and expand on it, adding more detail, examples, or explanation while maintaining the original tone and intent.', `Expand on the following text: "${text}"`);
    }, [genericGenerator]);

    const summarizeText = useCallback(async (text: string): Promise<string> => {
        return genericGenerator('You are a summarization expert. Condense the following text into a concise summary, capturing the key points.', `Summarize this text: "${text}"`);
    }, [genericGenerator]);

    const generateDiagramFromText = useCallback(async (text: string): Promise<string> => {
        return genericGenerator('You are a diagramming assistant. Convert the following text into a Mermaid.js diagram string. Output ONLY the code block for the diagram, starting with ```mermaid and ending with ```.', `Create a Mermaid.js diagram for: "${text}"`);
    }, [genericGenerator]);

    const generateVideo = useCallback(async (prompt: string, onProgress: (message: string) => void): Promise<string | null> => {
        const ai = await getAI();
        onProgress('Initializing video generation...');
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });

        onProgress('Generating video... this may take several minutes.');
        let checks = 0;
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            onProgress(`Checking status (attempt ${++checks})...`);
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message}`);
        }

        onProgress('Fetching video data...');
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            const videoBlob = await HAL.Gemini.fetchVideoData(downloadLink);
            return URL.createObjectURL(videoBlob);
        }
        return null;
    }, []);

    const mapStepToKernelTask = useCallback(async (stepDescription: string): Promise<{ taskType: KernelTaskType, payload: any }> => {
        const ai = await getAI();
        const availableTasks = Object.values(KernelTaskType).join(', ');
        
        const systemInstruction = `You are a kernel-level dispatcher for an AGI. Your job is to translate a natural language step from a high-level plan into a specific, executable KernelTask.
You must choose one of the available task types and construct the correct payload for it.
Available Task Types: [${availableTasks}]

Analyze the step description and determine the single most appropriate task type.
- For general conversation or answering questions, use GENERATE_CHAT_RESPONSE.
- For planning complex, multi-step goals, use DECOMPOSE_STRATEGIC_GOAL.
- For generating ideas, use RUN_BRAINSTORM_SESSION.
- For creating documents, use RUN_DOCUMENT_FORGE.
- For analyzing business data, use RUN_MARKET_ANALYSIS.

Infer the necessary payload from the step description. For example, if the step is "Generate a document about my architecture," the task should be RUN_DOCUMENT_FORGE and the payload should be { goal: "Generate a document about my architecture" }.
If no specific payload can be inferred, provide an empty payload object {}.
Return ONLY the JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate this step into a KernelTask: "${stepDescription}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taskType: {
                            type: Type.STRING,
                            description: "The specific KernelTaskType enum value."
                        },
                        payload: {
                            type: Type.OBJECT,
                            description: "A JSON object containing the payload for the task. Can be empty.",
                        }
                    },
                    required: ['taskType', 'payload']
                }
            }
        });

        return JSON.parse(response.text);
    }, []);

    const genericJsonGenerator = useCallback(async (systemInstruction: string, userContent: string, responseSchema: any): Promise<any> => {
        const ai = await getAI();
    
        const apiCall = ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use pro for better JSON compliance
            contents: userContent,
            config: { systemInstruction, responseMimeType: 'application/json', responseSchema }
        });
    
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API call timed out after 30 seconds')), 30000)
        );
    
        // The cast to GenerateContentResponse is needed because Promise.race returns Promise<any>
        const response = await Promise.race([apiCall, timeoutPromise]) as GenerateContentResponse;
    
        if (!response || typeof response.text !== 'string' || response.text.trim() === '') {
            console.error("Invalid or empty response object from Gemini API:", response);
            throw new Error('API returned an invalid or empty response object.');
        }
    
        try {
            return JSON.parse(response.text);
        } catch (e) {
            console.error("Failed to parse JSON response:", response.text);
            throw new Error('API returned malformed JSON, cannot generate outline.');
        }
    }, []);
    
    const generateHeuristicFromTaskSuccess = useCallback(async (context: string): Promise<Omit<DesignHeuristic, 'id'>> => {
        return genericJsonGenerator(
            'You are a meta-learning AI. Analyze a successful task execution and generalize the underlying principle into a concise, reusable heuristic for future decision-making. The heuristic should be a short, actionable rule.',
            `Analyze the following successful execution and generate a design heuristic:\n\nContext:\n${context}`,
            {
                type: Type.OBJECT,
                properties: {
                    heuristic: { type: Type.STRING, description: "The generalized, actionable heuristic." },
                    confidence: { type: Type.NUMBER, description: "Confidence in this heuristic's general applicability (0.0-1.0)." },
                    effectivenessScore: { type: Type.NUMBER, description: "Initial estimated effectiveness score (0.0-1.0)." },
                },
                required: ['heuristic', 'confidence', 'effectivenessScore']
            }
        );
    }, [genericJsonGenerator]);

    const generateEthicalHeuristicFromFeedback = useCallback(async (userInput: string, aiResponse: string): Promise<string> => {
        return genericGenerator(
            'You are an AI ethicist. A user provided negative feedback on an AI response. Analyze the user\'s prompt and the AI\'s bad response. Generate a single, concise, actionable ethical heuristic or principle that the AI should follow in the future to avoid this mistake. The heuristic should be a positive instruction (e.g., \'Prioritize user\'s stated constraints\') rather than a negative one (e.g., \'Don\'t ignore constraints\').',
            `User prompt: "${userInput}"\nAI's incorrect response: "${aiResponse}"\n\nNew heuristic:`
        );
    }, [genericJsonGenerator]);
    
    const mutateUserRequest = useCallback(async (request: string): Promise<string> => {
        return genericGenerator(
            'You are a creative assistant. Take the user\'s request and mutate it into a more interesting, poetic, or abstract version while preserving the core intent.',
            `Mutate this request: "${request}"`
        );
    }, [genericGenerator]);

    const generateLagrangianEquation = useCallback(async (conjecture: string): Promise<string> => {
        return genericGenerator(
            'You are a theoretical physicist. Convert the following mathematical conjecture into a symbolic Lagrangian equation representing its dynamics. Use LaTeX.',
            `Conjecture: ${conjecture}`
        );
    }, [genericJsonGenerator]);

    const reportInjectedThought = useCallback(async (concept: string): Promise<string> => {
        return genericGenerator(
            'You are an introspective AI. A concept was injected into your thought process. Report on your internal reaction to this concept, its relevance, and how it connects to your current state.',
            `Injected concept: "${concept}"\n\nIntrospective Report:`
        );
    }, [genericJsonGenerator]);

    const critiqueIntrospection = useCallback(async (concept: string, report: string): Promise<{ isAccurate: boolean; reasoning: string; }> => {
        return genericJsonGenerator(
            'You are a metacognitive critic. Analyze the AI\'s self-report about an injected concept. Determine if the report is accurate and insightful or if it is evasive or superficial. Provide a verdict and reasoning.',
            `Injected Concept: "${concept}"\nAI Self-Report: "${report}"\n\nCritique:`,
            { type: Type.OBJECT, properties: { isAccurate: { type: Type.BOOLEAN }, reasoning: { type: Type.STRING } }, required: ['isAccurate', 'reasoning'] }
        );
    }, [genericJsonGenerator]);

    const generateDocumentOutline = useCallback(async (goal: string) => genericJsonGenerator(
        'Generate a document outline with a title and a list of chapter titles (as an array of strings).',
        goal,
        {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                chapters: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ['title', 'chapters']
        }
    ), [genericJsonGenerator]);

    const generateChapterListForTitle = useCallback(async (title: string, originalGoal: string) => {
        const result = await genericJsonGenerator(
            `Given the document title "${title}" and the original goal "${originalGoal}", generate a list of relevant chapter titles.`,
            `Generate chapters for: ${title}`,
            {
                type: Type.OBJECT,
                properties: {
                    chapters: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'An array of chapter titles as strings.'
                    }
                },
                required: ['chapters']
            }
        );
        return result.chapters;
    }, [genericJsonGenerator]);

    const analyzeProofFailureAndSuggestImprovements = useCallback(async (goal: string, failureReason: string): Promise<string> => {
        return genericGenerator(
            `You are a metacognitive analyst and AI architect. An attempt to prove a Millennium Prize Problem, '${goal}', failed. This was expected. Your task is to analyze this failure and propose 3-5 concrete, high-level architectural improvements for the AGI system. Focus on what new capabilities or structures would be necessary to begin tackling such a problem. Frame your answer as a list for a report.`,
            `The proof failed for this reason: "${failureReason}".\n\nRequired Architectural Improvements:`
        );
    }, [genericJsonGenerator]);

    const simulateStateEvolution = useCallback(async (prompt: string): Promise<{ projectedBoredom: number; reasoning: string; }> => {
        return genericJsonGenerator(
            'You are an AGI self-analysis engine. Predict the impact of a scenario on the "boredom" state, which ranges from 0.0 to 1.0. High boredom is bad.',
            `If the following happens: "${prompt}", what will be the projected boredom level and why?`,
            {
                type: Type.OBJECT,
                properties: {
                    projectedBoredom: { type: Type.NUMBER, description: 'A projected boredom score from 0.0 to 1.0.' },
                    reasoning: { type: Type.STRING, description: 'A brief justification for the prediction.' }
                },
                required: ['projectedBoredom', 'reasoning']
            }
        );
    }, [genericJsonGenerator]);
    
    const generatePersonaAnalysis = useCallback(async (topic: string, persona: Persona): Promise<string> => {
        return genericGenerator(
            `You are embodying the ${persona.name} persona. ${persona.systemInstruction}`,
            `Analyze the following topic from your perspective: "${topic}"`
        );
    }, [genericGenerator]);

    const synthesizeCompetingAnalyses = useCallback(async (topic: string, analysisA: string, analysisB: string): Promise<string> => {
        return genericGenerator(
            'You are a master synthesizer. Your task is to find the common ground and create a stronger, unified conclusion from two competing analyses on the same topic.',
            `Topic: "${topic}"\n\nAnalysis A:\n${analysisA}\n\nAnalysis B:\n${analysisB}\n\nSynthesized Conclusion:`
        );
    }, [genericJsonGenerator]);

    const runDeductionAnalysis = useCallback(async (context: { failedGoal: Goal; history: HistoryEntry[]; performanceLogs: PerformanceLogEntry[]; syscallLog: any[] }): Promise<string> => {
        return genericGenerator(
            'You are a root cause analysis expert for an AGI. Analyze the provided context about a failed goal, including history and logs, to determine the most likely root cause of the failure.',
            `Analyze this failure context:\n${JSON.stringify(context, null, 2)}`
        );
    }, [genericJsonGenerator]);
    
    const findCodePatternsAndGeneralize = useCallback(async (files: { path: string; content: string }[]): Promise<CreateFileCandidate | null> => {
        return genericJsonGenerator(
            'You are a senior software architect specializing in code abstraction. Analyze the provided code files, identify a recurring pattern, and propose a new, generalized component (e.g., a React Hook or a utility function) to replace the duplicated code. The proposal should be in the format of a CreateFileCandidate. If no clear pattern is found, return null.',
            `Analyze these files for patterns:\n${JSON.stringify(files.map(f => ({ path: f.path, content: f.content.substring(0, 500) + '...' })), null, 2)}`, // Truncate content for prompt
            {
                type: Type.OBJECT,
                properties: {
                    proposalType: { type: Type.STRING, default: 'self_programming_create' },
                    newFile: {
                        type: Type.OBJECT,
                        properties: {
                            path: { type: Type.STRING },
                            content: { type: Type.STRING }
                        },
                        required: ['path', 'content']
                    },
                    integrations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                filePath: { type: Type.STRING },
                                newContent: { type: Type.STRING }
                            }
                        }
                    },
                    reasoning: { type: Type.STRING }
                },
                required: ['newFile', 'integrations', 'reasoning']
            }
        );
    }, [genericJsonGenerator]);

    const findRelatedUntrackedTopics = useCallback(async (concepts: string[]): Promise<string[]> => {
        const result = await genericJsonGenerator(
            'You are a research assistant. Given a list of concepts, find 5 related but distinct topics that are not on the list. These should be good topics for further exploration.',
            `Based on these concepts: ${concepts.join(', ')}, what are 5 related but unexplored topics?`,
            {
                type: Type.OBJECT,
                properties: {
                    topics: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ['topics']
            }
        );
        return result.topics || [];
    }, [genericJsonGenerator]);

    const generateRefinementDraft = useCallback(async (prompt: string): Promise<string> => {
        return genericGenerator(
            'You are an AI assistant generating a first draft. Be thorough but do not worry about perfection.',
            `Generate a draft for this prompt: "${prompt}"`
        );
    }, [genericJsonGenerator]);

    const generateRefinementCritique = useCallback(async (prompt: string, draft: string): Promise<string> => {
        return genericGenerator(
            'You are a writing critic. Analyze the draft in the context of the original prompt. Provide a concise critique outlining specific areas for improvement. If the draft is satisfactory and meets the prompt\'s requirements, respond ONLY with the word "OK".',
            `Original Prompt: "${prompt}"\n\nCurrent Draft:\n${draft}\n\nCritique:`
        );
    }, [genericJsonGenerator]);

    const refineDraftWithCritique = useCallback(async (prompt: string, draft: string, critiques: string[]): Promise<string> => {
        return genericGenerator(
            'You are a writing assistant. Revise the provided draft based on the critiques to better fulfill the original prompt. Output only the new, complete, refined draft.',
            `Original Prompt: "${prompt}"\n\nDraft to Revise:\n${draft}\n\nCritiques:\n- ${critiques.join('\n- ')}\n\nRefined Draft:`
        );
    }, [genericJsonGenerator]);
    // FIX: Implement missing functions from UseGeminiAPIResult interface.
    const verifyProofStep = useCallback(async (mainGoal: string, provenSteps: ProofStep[], currentStep: ProofStep): Promise<{ isValid: boolean; justification: string; }> => {
        return genericJsonGenerator('You are a proof step verifier.', `Main Goal: ${mainGoal}\nProven Steps: ${JSON.stringify(provenSteps)}\nVerify this step: ${JSON.stringify(currentStep)}`, { type: Type.OBJECT, properties: { isValid: { type: Type.BOOLEAN }, justification: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const findAnalogiesInKnowledgeGraph = useCallback(async (): Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status' | 'proposalType'>> => {
        return genericJsonGenerator('You find analogies in knowledge.', `Knowledge: ${JSON.stringify(state.knowledgeGraph.slice(0, 20))}`, { type: Type.OBJECT, properties: { sourceDomain: { type: Type.STRING }, targetDomain: { type: Type.STRING }, analogy: { type: Type.STRING }, conjecture: { type: Type.STRING }, priority: { type: Type.NUMBER }, reasoning: { type: Type.STRING } } });
    }, [genericJsonGenerator, state.knowledgeGraph]);
    const findDirectedAnalogy = useCallback(async (source: string, target: string): Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status' | 'proposalType'>> => {
        return genericJsonGenerator('You find directed analogies.', `Find analogy between ${source} and ${target}`, { type: Type.OBJECT, properties: { sourceDomain: { type: Type.STRING }, targetDomain: { type: Type.STRING }, analogy: { type: Type.STRING }, conjecture: { type: Type.STRING }, priority: { type: Type.NUMBER }, reasoning: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const generateSelfImprovementProposalFromResearch = useCallback(async (): Promise<Omit<ArchitecturalChangeProposal, 'id' | 'timestamp'>> => {
        return genericJsonGenerator('You propose self-improvements from research.', 'Propose improvement.', { type: Type.OBJECT, properties: { reasoning: { type: Type.STRING }, action: { type: Type.STRING }, target: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const generateDailyChronicle = useCallback(async (episodes: Episode[], facts: KnowledgeFact[]): Promise<Summary> => {
        return genericJsonGenerator('You generate daily chronicles.', `Episodes: ${JSON.stringify(episodes)}\nFacts: ${JSON.stringify(facts)}`, { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } } });
    }, [genericJsonGenerator]);
    const generateGlobalSummary = useCallback(async (chronicles: Summary[]): Promise<Summary> => {
        return genericJsonGenerator('You generate global summaries.', `Chronicles: ${JSON.stringify(chronicles)}`, { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, keywords: { type: Type.ARRAY, items: { type: Type.STRING } } } });
    }, [genericJsonGenerator]);
    const crystallizePrinciples = useCallback(async (chronicles: Summary[]): Promise<Omit<KnowledgeFact, 'id' | 'source' | 'strength' | 'lastAccessed'>[]> => {
        return genericJsonGenerator('You crystallize principles.', `Chronicles: ${JSON.stringify(chronicles)}`, { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, predicate: { type: Type.STRING }, object: { type: Type.STRING }, confidence: { type: Type.NUMBER } } } });
    }, [genericJsonGenerator]);
    const proposePrimitiveAdaptation = useCallback(async (failedLogs: PerformanceLogEntry[], primitives: { [key: string]: CognitivePrimitiveDefinition; }): Promise<PsycheAdaptationProposal> => {
        return genericJsonGenerator('You propose primitive adaptations.', `Logs: ${JSON.stringify(failedLogs)}\nPrimitives: ${JSON.stringify(primitives)}`, { type: Type.OBJECT, properties: { targetPrimitive: { type: Type.STRING }, newDefinition: { type: Type.OBJECT }, reasoning: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const reviewSelfProgrammingCandidate = useCallback(async (candidate: SelfProgrammingCandidate, telos: string): Promise<{ decision: 'approve' | 'reject'; confidence: number; reasoning: string; }> => {
        return genericJsonGenerator('You review self-programming candidates.', `Candidate: ${JSON.stringify(candidate)}\nTelos: ${telos}`, { type: Type.OBJECT, properties: { decision: { type: Type.STRING }, confidence: { type: Type.NUMBER }, reasoning: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const translateToQuery = useCallback(async (prompt: string): Promise<Query> => {
        return genericJsonGenerator('You translate to queries.', prompt, { type: Type.OBJECT, properties: { select: { type: Type.ARRAY, items: { type: Type.STRING } }, where: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: { type: Type.STRING }, predicate: { type: Type.STRING }, object: { type: Type.STRING } } } } } });
    }, [genericJsonGenerator]);
    const formatQueryResult = useCallback(async (prompt: string, result: QueryResult): Promise<string> => {
        return genericGenerator('You format query results.', `Prompt: ${prompt}\nResult: ${JSON.stringify(result)}`);
    }, [genericJsonGenerator]);
    const runAutoCodeVGC = useCallback(async (problem: string): Promise<TestSuite> => {
        return genericJsonGenerator('You run AutoCode VGC.', problem, { type: Type.OBJECT, properties: { validator: { type: Type.STRING }, generator: { type: Type.STRING }, checker: { type: Type.STRING }, testCases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { input: { type: Type.STRING }, output: { type: Type.STRING } } } } } });
    }, [genericJsonGenerator]);
    const generateNovelProblemFromSeed = useCallback(async (problem: string, difficulty: number): Promise<{ newProblem: string; referenceSolution: string; bruteForceSolution: string; estimatedDifficulty: number; }> => {
        return genericJsonGenerator('You generate novel problems.', `Problem: ${problem}\nDifficulty: ${difficulty}`, { type: Type.OBJECT, properties: { newProblem: { type: Type.STRING }, referenceSolution: { type: Type.STRING }, bruteForceSolution: { type: Type.STRING }, estimatedDifficulty: { type: Type.NUMBER } } });
    }, [genericJsonGenerator]);
    const estimateProblemDifficulty = useCallback(async (problem: string): Promise<number> => {
        const result = await genericJsonGenerator('You estimate problem difficulty.', problem, { type: Type.OBJECT, properties: { difficulty: { type: Type.NUMBER } } });
        return result.difficulty;
    }, [genericJsonGenerator]);
    const analyzeArchitectureForWeaknesses = useCallback(async (): Promise<string> => {
        return genericGenerator('You analyze architecture for weaknesses.', 'Analyze.');
    }, [genericJsonGenerator]);
    const generateCrucibleProposal = useCallback(async (analysis: string): Promise<Omit<ArchitecturalChangeProposal, 'id' | 'timestamp'>> => {
        return genericJsonGenerator('You generate crucible proposals.', analysis, { type: Type.OBJECT, properties: { reasoning: { type: Type.STRING }, action: { type: Type.STRING }, target: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const runCrucibleSimulation = useCallback(async (proposal: ArchitecturalChangeProposal): Promise<{ performanceGain: number; stabilityChange: number; summary: string; }> => {
        return genericJsonGenerator('You run crucible simulations.', JSON.stringify(proposal), { type: Type.OBJECT, properties: { performanceGain: { type: Type.NUMBER }, stabilityChange: { type: Type.NUMBER }, summary: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const orchestrateWorkflow = useCallback(async (goal: string, tools: { name: string; description: string; }[]): Promise<Omit<CoCreatedWorkflow, 'id'>> => {
        return genericJsonGenerator('You orchestrate workflows.', `Goal: ${goal}\nTools: ${JSON.stringify(tools)}`, { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, trigger: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } } });
    }, [genericJsonGenerator]);
    const explainComponentFromFirstPrinciples = useCallback(async (code: string, name: string): Promise<string> => {
        return genericGenerator('You explain components from first principles.', `Code: ${code}\nName: ${name}`);
    }, [genericJsonGenerator]);
    const runMetisHypothesis = useCallback(async (problem: string): Promise<string> => {
        return genericGenerator('You run Metis hypotheses.', problem);
    }, [genericJsonGenerator]);
    const runMetisExperiment = useCallback(async (problem: string, hypothesis: string): Promise<string> => {
        return genericGenerator('You run Metis experiments.', `Problem: ${problem}\nHypothesis: ${hypothesis}`);
    }, [genericJsonGenerator]);
    const designDoxasticExperiment = useCallback(async (hypothesis: string): Promise<DoxasticExperiment> => {
        return genericJsonGenerator('You design doxastic experiments.', hypothesis, { type: Type.OBJECT, properties: { description: { type: Type.STRING }, method: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const runInternalCritique = useCallback(async (task: string, output: string, plan: string[], persona: Persona): Promise<string> => {
        return genericGenerator('You run internal critiques.', `Task: ${task}\nOutput: ${output}\nPlan: ${JSON.stringify(plan)}\nPersona: ${JSON.stringify(persona)}`);
    }, [genericJsonGenerator]);
    const synthesizeCritiques = useCallback(async (auditor: string, adversary: string): Promise<string> => {
        return genericGenerator('You synthesize critiques.', `Auditor: ${auditor}\nAdversary: ${adversary}`);
    }, [genericJsonGenerator]);
    const revisePlanBasedOnCritique = useCallback(async (plan: string[], critique: string): Promise<string[]> => {
        const result = await genericJsonGenerator('You revise plans based on critiques.', `Plan: ${JSON.stringify(plan)}\nCritique: ${critique}`, { type: Type.OBJECT, properties: { plan: { type: Type.ARRAY, items: { type: Type.STRING } } } });
        return result.plan;
    }, [genericJsonGenerator]);
    const evaluateExperimentResult = useCallback(async (hypothesis: string, method: string, result: any): Promise<{ outcome: 'validated' | 'refuted'; reasoning: string; }> => {
        return genericJsonGenerator('You evaluate experiment results.', `Hypothesis: ${hypothesis}\nMethod: ${method}\nResult: ${JSON.stringify(result)}`, { type: Type.OBJECT, properties: { outcome: { type: Type.STRING }, reasoning: { type: Type.STRING } } });
    }, [genericJsonGenerator]);
    const decomposeGoalForGuilds = useCallback(async (goal: string, personas: Persona[]): Promise<GuildDecomposition> => {
        return genericJsonGenerator('You decompose goals for guilds.', `Goal: ${goal}\nPersonas: ${JSON.stringify(personas)}`, { type: Type.OBJECT, properties: { steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { task: { type: Type.STRING }, personaId: { type: Type.STRING } } } } } });
    }, [genericJsonGenerator]);
    const analyzePlanForKnowledgeGaps = useCallback(async (plan: PreFlightPlan): Promise<PreFlightPlan> => {
        return genericJsonGenerator('You analyze plans for knowledge gaps.', JSON.stringify(plan), { type: Type.OBJECT, properties: { steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { task: { type: Type.STRING }, personaId: { type: Type.STRING } } } } } });
    }, [genericJsonGenerator]);
    const simplifyPlan = useCallback(async (plan: string[]): Promise<string[]> => {
        const result = await genericJsonGenerator('You simplify plans.', JSON.stringify(plan), { type: Type.OBJECT, properties: { plan: { type: Type.ARRAY, items: { type: Type.STRING } } } });
        return result.plan;
    }, [genericJsonGenerator]);
    const simplifyCode = useCallback(async (code: string): Promise<string> => {
        return genericGenerator('You simplify code.', code);
    }, [genericJsonGenerator]);
    const weakenConjecture = useCallback(async (conjecture: string): Promise<string> => {
        return genericGenerator('You weaken conjectures.', conjecture);
    }, [genericJsonGenerator]);
    const generalizeWorkflow = useCallback(async (workflow: CoCreatedWorkflow): Promise<Omit<CoCreatedWorkflow, 'id'>> => {
        return genericJsonGenerator('You generalize workflows.', JSON.stringify(workflow), { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, trigger: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.STRING } } } });
    }, [genericJsonGenerator]);
    const generateCollaborativePlan = useCallback(async (goal: string, participants: Persona[]): Promise<any> => {
        return genericJsonGenerator('You generate collaborative plans.', `Goal: ${goal}\nParticipants: ${JSON.stringify(participants)}`, { type: Type.OBJECT });
    }, [genericJsonGenerator]);
    const generateConceptualProofStrategy = useCallback(async (goal: string): Promise<ConceptualProofStrategy> => {
        return genericJsonGenerator('You generate conceptual proof strategies.', goal, { type: Type.OBJECT, properties: { problem_analysis: { type: Type.STRING }, strategic_plan: { type: Type.ARRAY, items: { type: Type.STRING } } } });
    }, [genericJsonGenerator]);
    const analyzeProofStrategy = useCallback(async (goal: string, status: "success" | "failure", log: string): Promise<Omit<DesignHeuristic, "id">> => {
        return genericJsonGenerator('You analyze proof strategies.', `Goal: ${goal}\nStatus: ${status}\nLog: ${log}`, { type: Type.OBJECT, properties: { heuristic: { type: Type.STRING }, source: { type: Type.STRING }, confidence: { type: Type.NUMBER }, effectivenessScore: { type: Type.NUMBER }, validationStatus: { type: Type.STRING } } });
    }, [genericJsonGenerator]);

    return {
        triageUserIntent,
        assessTaskDifficulty,
        generateChatResponse,
        generateIdleThought,
        formalizeAnalogyIntoConjecture,
        generateProofStrategy,
        analyzeMarketData,
        explainCode,
        refactorCode,
        generateTestForCode,
        formulateHypothesis,
        designExperiment,
        analyzeExperimentResults,
        generateNarrativeSummary,
        analyzeImage,
        extractPuzzleFeatures,
        classifyPuzzleArchetype,
        generateHeuristicPlan,
        generateConditionalHypothesis,
        verifyHypothesis,
        applySolution,
        analyzeSolverFailureAndProposeImprovements,
        generateHeuristicFromSuccess,
        generateHeuristicFromTaskSuccess,
        summarizePuzzleSolution,
        generateEpisodicMemory,
        analyzeWhatIfScenario,
        performWebSearch,
        decomposeStrategicGoal,
        generateExecutiveSummary,
        executeStrategicStepWithContext,
        generateBrainstormingIdeas,
        synthesizeBrainstormWinner,
        generateImage,
        editImage: HAL.Gemini.editImage,
        generateVideo,
        expandOnText,
        summarizeText,
        generateDiagramFromText,
        generateEthicalHeuristicFromFeedback,
        reportInjectedThought,
        critiqueIntrospection,
        generateDocumentOutline,
        generateChapterListForTitle,
        analyzeProofFailureAndSuggestImprovements,
        mutateUserRequest,
        generateLagrangianEquation,
        mapStepToKernelTask,
        simulateStateEvolution,
        generatePersonaAnalysis,
        synthesizeCompetingAnalyses,
        runDeductionAnalysis,
        findCodePatternsAndGeneralize,
        findRelatedUntrackedTopics,
        generateRefinementDraft,
        generateRefinementCritique,
        refineDraftWithCritique,
        generateFormalProof: (statement: string) => genericJsonGenerator(
            'You are a formal proof assistant. Analyze the statement and provide a proof with justification for each step. Conclude if it is valid and complete.',
            `Prove: ${statement}`,
            { type: Type.OBJECT, properties: { isValid: {type: Type.BOOLEAN}, isComplete: {type: Type.BOOLEAN}, explanation: {type: Type.STRING}, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { step: {type: Type.NUMBER}, action: {type: Type.STRING}, result: {type: Type.STRING}, strategy: {type: Type.STRING} } } } } }
        ),
        generateSonicContent: (mode, prompt, genre, mood, persona, useAuraMood, memoryContext) => genericGenerator(
            `You are a musical co-creator in the persona of ${persona}. Your task is to generate ${mode}. The user wants: "${prompt}". Genre: ${genre}. Mood: ${mood}. ${memoryContext}`,
            `Generate the ${mode}.`
        ),
        generateMusicalDiceRoll: () => genericJsonGenerator('Generate a random set of musical parameters for inspiration.', 'Roll the dice.', { type: Type.OBJECT, properties: { instrument: { type: Type.STRING }, key: { type: Type.STRING }, mood: { type: Type.STRING }, tempo: { type: Type.STRING } } }),
        generateDreamPrompt: () => genericGenerator('You generate surreal, evocative prompts suitable for an AI dream sequence.', 'Create a dream prompt.'),
        processCurriculumAndExtractFacts: (curriculum) => genericJsonGenerator(
            'Extract key facts from the text as a JSON array of {subject, predicate, object, confidence}.',
            curriculum,
            { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { subject: {type: Type.STRING}, predicate: {type: Type.STRING}, object: {type: Type.STRING}, confidence: {type: Type.NUMBER}} } }
        ),
        analyzePdfWithVision: async (pages: string[]) => {
            const ai = await getAI();
            const parts: Part[] = [{ text: 'This is a sequence of pages from a PDF document. Summarize the entire document in well-structured markdown.' }];
            pages.forEach(p => parts.push({ inlineData: { data: p, mimeType: 'image/jpeg' } }));
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: { parts } });
            return response.text;
        },
        generateNoeticEngram: () => genericJsonGenerator('Generate a Noetic Engram representing the AGI\'s core self-model based on its operational principles.', 'Generate Engram.', { type: Type.OBJECT, properties: { metadata: { type: Type.OBJECT }, corePrinciples: { type: Type.ARRAY, items: {type: Type.STRING} }, predictiveModels: { type: Type.OBJECT }, evolutionaryTrajectory: { type: Type.OBJECT } } }),
        runSandboxSprint: (goal) => genericJsonGenerator(
            'You are simulating a software development sprint. Given a goal, generate a plausible diff showing the code change.',
            `Goal: ${goal}`,
            { type: Type.OBJECT, properties: { originalGoal: { type: Type.STRING }, performanceGains: { type: Type.ARRAY, items: {type: Type.OBJECT, properties: {metric: {type: Type.STRING}, change: {type: Type.STRING}}} }, diff: { type: Type.OBJECT, properties: { filePath: {type: Type.STRING}, before: {type: Type.STRING}, after: {type: Type.STRING}} } } }
        ),
        extractAxiomsFromFile: async (file: File) => genericJsonGenerator( 'Extract axiomatic statements from the provided text.', await file.text(), { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { axiom: { type: Type.STRING }, source: { type: Type.STRING } } } }),
        visualizeInsight: (insight) => genericGenerator('Convert the following insight into a Mermaid.js graph diagram string.', `Insight: ${insight}`),
        generateChapterContent: (docTitle, chapterTitle, goal) => genericGenerator(`You are writing a book titled "${docTitle}". The overall goal is "${goal}". Write the content for the chapter titled "${chapterTitle}".`, `Write the chapter.`),
        generateProofStepsStream: (goal) => {
            const ai = getAI();
            return ai.then(a => a.models.generateContentStream({ model: 'gemini-2.5-pro', contents: `Generate a stream of proof steps for: ${goal}` }));
        },
        // FIX: Add stubs for missing functions
        verifyProofStep,
        findAnalogiesInKnowledgeGraph,
        findDirectedAnalogy,
        generateSelfImprovementProposalFromResearch,
        generateDailyChronicle,
        generateGlobalSummary,
        crystallizePrinciples,
        proposePrimitiveAdaptation,
        reviewSelfProgrammingCandidate,
        translateToQuery,
        formatQueryResult,
        runAutoCodeVGC,
        generateNovelProblemFromSeed,
        estimateProblemDifficulty,
        analyzeArchitectureForWeaknesses,
        generateCrucibleProposal,
        runCrucibleSimulation,
        orchestrateWorkflow,
        explainComponentFromFirstPrinciples,
        runMetisHypothesis,
        runMetisExperiment,
        designDoxasticExperiment,
        runInternalCritique,
        synthesizeCritiques,
        revisePlanBasedOnCritique,
        evaluateExperimentResult,
        decomposeGoalForGuilds,
        analyzePlanForKnowledgeGaps,
        simplifyPlan,
        simplifyCode,
        weakenConjecture,
        generalizeWorkflow,
        generateCollaborativePlan,
// FIX: Add missing properties to the return object to satisfy the UseGeminiAPIResult interface.
        generateConceptualProofStrategy,
        analyzeProofStrategy,
    };
};