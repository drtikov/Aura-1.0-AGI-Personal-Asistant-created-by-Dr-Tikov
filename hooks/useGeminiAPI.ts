// hooks/useGeminiAPI.ts
import { useCallback, Dispatch } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Modality, Type, GenerateContentStreamResponse, Content } from '@google/genai';
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, Episode, ProposedAxiom, AnalogicalHypothesisProposal, UnifiedProposal, CreateFileCandidate, ModifyFileCandidate, BrainstormIdea, HistoryEntry, ConceptualProofStrategy, Goal, DesignHeuristic, TriageResult, KnowledgeFact, Summary, PerformanceLogEntry, CognitivePrimitiveDefinition, PsycheAdaptationProposal, SelfProgrammingCandidate, Query, QueryResult, PuzzleFeatures, Hypothesis, HeuristicPlan, TestSuite, Persona, ArchitecturalChangeProposal, PuzzleArchetype, PuzzleClassification } from '../types.ts';
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
                            description: 'A concise summary of the user\'s core goal or question.'
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: 'A brief explanation for your classification decision.'
                        }
                    },
                    required: ['type', 'goal', 'reasoning']
                }
            }
        });
        
        try {
            return JSON.parse(getText(response));
        } catch (e) {
            console.error("Failed to parse triage response:", getText(response), e);
            // Fallback to simple chat on parsing error
            return { type: 'SIMPLE_CHAT', goal: text, reasoning: "Fallback due to triage parsing error." };
        }
    }, [ai]);

    const generateChatResponse = useCallback(async (history: HistoryEntry[]): Promise<GenerateContentStreamResponse> => {
        // For simple chat, always use the 'aura_core' persona for a consistent experience.
        const persona = operationalPersonas.find(p => p.id === 'aura_core')!;
        const journalEntries = state.personalityState.personaJournals[persona.id] || [];
        
        let finalSystemInstruction = persona.systemInstruction;
        if (journalEntries.length > 0) {
            const journalContext = "\n\n# Learned Principles from My Journal (Apply these):\n- " + journalEntries.join("\n- ");
            finalSystemInstruction += journalContext;
        }

        // Format history for the Gemini API
        const contentsForAPI: Content[] = history
            .map((entry: HistoryEntry): Content | null => {
                let role: 'user' | 'model' | 'tool' | undefined = undefined;
                let parts: Part[] = [];
    
                if (entry.from === 'user') {
                    role = 'user';
                    if (entry.text) parts.push({ text: entry.text });
                } else if (entry.from === 'bot') {
                    role = 'model';
                    if (entry.text) parts.push({ text: entry.text });
                }
                
                if (role && parts.length > 0) return { role, parts };
                return null;
            }).filter((item): item is Content => item !== null);
    
        // Add working memory to the context
        let contextPrompt = '';
        if (state.workingMemory.length > 0) {
            contextPrompt += "CURRENT WORKING MEMORY (use this context for your response):\n" + state.workingMemory.join('\n') + '\n\n';
        }
    
        // Prepend context to the last user message
        if (contentsForAPI.length > 0) {
            const lastContent = contentsForAPI[contentsForAPI.length - 1];
            if (lastContent.role === 'user' && lastContent.parts[0]?.text) {
                lastContent.parts[0].text = contextPrompt + lastContent.parts[0].text;
            }
        }
        
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contentsForAPI,
            config: {
                systemInstruction: finalSystemInstruction,
            }
        });
        return response;
    }, [ai, state.personalityState.personaJournals, state.workingMemory]);

    const analyzeImage = useCallback(async (prompt: string, file: File): Promise<GenerateContentStreamResponse> => {
        const imagePart = await fileToGenerativePart(file);
        const textPart = { text: prompt };

        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response;
    }, [ai]);

    const extractPuzzleFeatures = useCallback(async (file: File): Promise<PuzzleFeatures> => {
        const imagePart = await fileToGenerativePart(file);
        const systemInstruction = `You are an expert computer vision system specializing in ARC (Abstraction and Reasoning Corpus) puzzles. Your task is to perform instance segmentation on the provided puzzle image. For each grid (example inputs, example outputs, and the test input), identify every distinct, contiguous object. For each object, extract a precise set of topological and geometric features. Adhere strictly to the JSON schema.`;

        const segmentedObjectSchema = {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER, description: "A unique ID for the object within its grid." },
                shape: { type: Type.STRING, description: "A descriptive name for the shape, e.g., '3x3 solid square', 'C-shape', 'plus-sign', 'single dot'." },
                color: { type: Type.STRING, description: "The color of the object." },
                area: { type: Type.NUMBER, description: "The total number of pixels in the object." },
                perimeter: { type: Type.NUMBER, description: "The perimeter of the object." },
                connected_components: { type: Type.NUMBER, description: "The number of distinct, non-touching parts. For a single solid shape, this is 1." },
                holes: { type: Type.NUMBER, description: "The number of internal holes in the object. An 'O' shape has 1 hole, a solid square has 0." },
                bounding_box: {
                    type: Type.OBJECT,
                    properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER },
                        width: { type: Type.NUMBER },
                        height: { type: Type.NUMBER },
                        aspectRatio: { type: Type.NUMBER }
                    },
                    required: ["x", "y", "width", "height", "aspectRatio"]
                }
            },
            required: ["id", "shape", "color", "area", "perimeter", "connected_components", "holes", "bounding_box"]
        };
        
        const puzzleGridSchema = {
            type: Type.OBJECT,
            properties: {
                description: { type: Type.STRING, description: "A high-level description of the grid's contents and layout." },
                objects: {
                    type: Type.ARRAY,
                    items: segmentedObjectSchema
                },
                grid_dimensions: {
                    type: Type.OBJECT,
                    properties: {
                        width: { type: Type.NUMBER },
                        height: { type: Type.NUMBER }
                    },
                    required: ["width", "height"]
                }
            },
            required: ["description", "objects", "grid_dimensions"]
        };
        
        const puzzleFeaturesSchema = {
            type: Type.OBJECT,
            properties: {
                overall_description: { type: Type.STRING, description: "A high-level summary of the puzzle's transformation type." },
                examples: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            input: puzzleGridSchema,
                            output: puzzleGridSchema
                        },
                         required: ["input", "output"]
                    }
                },
                test_input: puzzleGridSchema
            },
            required: ['overall_description', 'examples', 'test_input']
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, {text: "Extract the detailed structural and topological features of this ARC puzzle according to the schema."}] },
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: puzzleFeaturesSchema
            }
        });
        return JSON.parse(getText(response));
    }, [ai]);

    const classifyPuzzleArchetype = useCallback(async (features: PuzzleFeatures): Promise<PuzzleClassification> => {
        // 1. Run the lightweight heuristic classifier first.
        const heuristicResult = classifyHeuristically(features);

        // 2. If confidence is high, return immediately.
        if (heuristicResult.confidence >= 0.75) {
            return {
                ...heuristicResult,
                reasoning: `High-confidence match based on keywords in puzzle description.`,
                source: 'heuristic',
            };
        }
        
        // 3. If confidence is low, escalate to Gemini for zero-shot classification.
        const systemInstruction = `You are an expert Archetype Classifier for ARC puzzles. Your task is to analyze the provided JSON of puzzle features and classify it into one of the predefined archetypes. Base your decision on the structural properties, transformations, and relationships you observe. Provide a brief reasoning for your choice.`;
        
        const archetypes: PuzzleArchetype[] = ['BorderKeyRecoloring', 'ObjectCounting', 'PatternCompletion', 'Symmetry', 'UNKNOWN'];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Puzzle Features:\n\`\`\`json\n${JSON.stringify(features, null, 2)}\n\`\`\`\n\nClassify this puzzle into one of the following archetypes: ${archetypes.join(', ')}.`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        archetype: {
                            type: Type.STRING,
                            enum: archetypes,
                        },
                        confidence: {
                            type: Type.NUMBER,
                            description: 'A confidence score from 0.0 to 1.0 for your classification.',
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: 'A brief explanation for your choice.'
                        }
                    },
                    required: ['archetype', 'confidence', 'reasoning']
                }
            }
        });

        const geminiResult = JSON.parse(getText(response));
        return { ...geminiResult, source: 'gemini' };

    }, [ai]);


    const generateHeuristicPlan = useCallback(async (features: PuzzleFeatures, existingHeuristics: DesignHeuristic[], archetype: PuzzleArchetype): Promise<HeuristicPlan> => {
        const systemInstruction = `You are a meta-cognitive strategist for an AGI. Your task is to create a high-level strategic plan for solving an abstract reasoning puzzle.
- Analyze the puzzle's detailed features, looking for relational patterns (e.g., changes in color, shape, count, position).
- The puzzle has been classified with the archetype: '${archetype}'. Tailor your plan to this strategy.
- Consider any relevant, previously successful strategies (design heuristics). Pay special attention to heuristics involving sequences, palettes, or conditional logic.
- Generate a short, ordered list of 3-4 strategic directives. These directives should guide a "tactician" AI on *how to discover* the rule.
- Focus on identifying key relationships, checking for special cases (e.g., a specific color is treated differently), and determining default or fallback rules. For example, a good directive would be "Determine if object color is derived from a palette sequence, and check for a potential starting offset."`;
        
        const heuristicsContext = existingHeuristics.length > 0
            ? `\n\nPreviously successful design heuristics for similar problems:\n${existingHeuristics.map(h => `- ${h.heuristic}`).join('\n')}`
            : "";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Puzzle Features:\n\`\`\`json\n${JSON.stringify(features, null, 2)}\n\`\`\`${heuristicsContext}\n\nGenerate a strategic plan to find the transformation rule.`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        plan: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['plan']
                }
            }
        });
        const result = JSON.parse(getText(response));
        return result.plan;
    }, [ai]);

    const generateConditionalHypothesis = useCallback(async (features: PuzzleFeatures, plan: HeuristicPlan, archetype: PuzzleArchetype): Promise<Hypothesis> => {
        const systemInstruction = `You are a logical tactician for an AGI. You will receive a puzzle's detailed object features and a strategic plan. The puzzle archetype is '${archetype}'. Your hypothesis should align with this strategy. Your task is to execute the plan and synthesize your findings into a single, comprehensive "Über-Hypothesis". This hypothesis must be a complete, self-contained rule expressed in a clear, DSL-like format that explains the transformation for ALL examples. It must account for any conditional logic (IF/THEN/ELSE) or parameterized rules (e.g., using an offset in a sequence) you discover.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Puzzle Features:\n\`\`\`json\n${JSON.stringify(features, null, 2)}\n\`\`\`\n\nStrategic Plan:\n- ${plan.join('\n- ')}\n\nFollow the plan and generate a single, comprehensive hypothesis that explains all example transformations.`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        hypothesis: {
                            type: Type.STRING,
                            description: "The single, comprehensive 'Über-Hypothesis' that explains the transformation rule, including any conditional logic, in a DSL-like format."
                        }
                    },
                    required: ['hypothesis']
                }
            }
        });
        const result = JSON.parse(getText(response));
        return { id: 1, description: result.hypothesis };
    }, [ai]);

    const verifyHypothesis = useCallback(async (features: PuzzleFeatures, hypothesis: Hypothesis): Promise<{ status: 'VALID' | 'INVALID', reason: string }> => {
        const systemInstruction = `You are a verification engine for an ARC puzzle solver. You will be given the puzzle's features and a single transformation hypothesis. Your task is to rigorously check if the hypothesis correctly transforms ALL example inputs into their corresponding example outputs. Respond with either 'VALID' or 'INVALID' and a brief, precise reason for your decision.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Puzzle Features:\n\`\`\`json\n${JSON.stringify(features.examples, null, 2)}\n\`\`\`\n\nHypothesis to Verify: "${hypothesis.description}"\n\nIs this hypothesis valid for all examples?`,
            config: {
                systemInstruction,
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
        return JSON.parse(getText(response));
    }, [ai]);

    const applySolution = useCallback(async (testInputFeatures: any, hypothesis: Hypothesis): Promise<GenerateContentStreamResponse> => {
        const systemInstruction = `You are a solution engine for an ARC puzzle solver. You will be given the detailed features of a test input grid and a proven, valid transformation rule (hypothesis). Your task is to meticulously apply the rule to the input and describe the resulting output grid step-by-step. Explain your reasoning clearly.`;
        
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: `Test Input Features:\n\`\`\`json\n${JSON.stringify(testInputFeatures, null, 2)}\n\`\`\`\n\nValid Rule: "${hypothesis.description}"\n\nApply the rule and describe the output, explaining your steps.`,
            config: {
                systemInstruction,
            }
        });
        return response;
    }, [ai]);

    const analyzeSolverFailureAndProposeImprovements = useCallback(async (features: PuzzleFeatures, failedHypothesis: Hypothesis, verificationReason: string): Promise<string> => {
        const systemInstruction = `You are a meta-cognitive analyst for an AGI. The AGI's symbolic reasoning solver has just failed to solve an abstract puzzle. Your task is to analyze the failure and propose concrete, high-level architectural improvements that would be necessary to solve this type of task in the future.

**Do not try to solve the puzzle again.** Your only goal is to reason about the system's failure.

**Possible Failure Points & Corresponding Improvements:**
1.  **Perception Failure:** Was the initial feature extraction flawed? Did it miss key details (e.g., number of holes, connectedness, relative positions)?
    -   **Improvement:** Propose more sophisticated computer vision models, like instance segmentation (Mask R-CNN, U-Net) or extracting topological features (Euler characteristic, connected components).
2.  **Reasoning/Rule Induction Failure:** Was the generated hypothesis too simple? Did it fail to capture conditional logic or complex relationships (e.g., "the first color that is NOT X", "cycle colors with an offset")?
    -   **Improvement:** Propose a dedicated symbolic reasoning engine, inductive logic programming (ILP), or a constraint-based solver to generate and test more complex, parameterized rule hypotheses.
3.  **Meta-Learning Failure:** Did the system lack a strategy for this type of puzzle?
    -   **Improvement:** Propose a meta-learning approach where the system learns *how to learn* ARC rules by identifying common sub-routines or rule templates from a corpus of solved tasks.

Analyze the provided puzzle features, the failed hypothesis, and the verification reason. Then, generate a report in Markdown format outlining the most likely architectural improvements needed.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use a more powerful model for this complex analysis
            contents: `**Analysis Context**
- **Puzzle Features:** ${JSON.stringify(features, null, 2)}
- **Failed Hypothesis:** ${failedHypothesis.description}
- **Verification Result:** INVALID. Reason: ${verificationReason}

**Task:**
Based on the failure context, generate a report on the necessary architectural improvements for the AGI solver.`,
            config: {
                systemInstruction,
            }
        });
        return getText(response);
    }, [ai]);
    
    const generateHeuristicFromSuccess = useCallback(async (features: PuzzleFeatures, plan: HeuristicPlan, hypothesis: Hypothesis): Promise<Omit<DesignHeuristic, 'id'>> => {
        const systemInstruction = `You are the Heuristics Forge. Your task is to analyze a successfully solved abstract puzzle and extract a general, reusable design heuristic from the strategy. The heuristic should be a high-level rule or principle that could help solve similar puzzles in the future. It should be abstract and not tied to the specific colors, shapes, or numbers of the solved problem.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            The system successfully solved a puzzle.
            - **Overall Description:** ${features.overall_description}
            - **Successful Plan:** ${plan.join('; ')}
            - **Winning Hypothesis:** ${hypothesis.description}

            Based on this success, generate a single, concise, and abstract design heuristic.
            `,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        heuristic: { type: Type.STRING, description: "The general, reusable design heuristic learned from the success." },
                        source: { type: Type.STRING, description: "Should be 'Heuristics Forge: ARC Success'." },
                        confidence: { type: Type.NUMBER, description: "A confidence score (0.7-1.0) for this heuristic based on the clarity of the pattern." },
                    },
                    required: ['heuristic', 'source', 'confidence']
                }
            }
        });
        const result = JSON.parse(getText(response));
        return {
            ...result,
            effectivenessScore: 1, // Start with a high score for a successful application
            validationStatus: 'validated' as const
        };
    }, [ai]);

    const summarizePuzzleSolution = useCallback(async (solutionTrace: string): Promise<string> => {
        const systemInstruction = `You are a summarization agent. You will be given a detailed step-by-step trace of how a rule was applied to solve an abstract puzzle. Your task is to extract ONLY the final result and present it as a concise, clear summary. Do not repeat the reasoning steps. Focus on describing the final state of the output grid. Use a bulleted list format, categorizing by color, to state which shapes get which color.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Here is the solution trace:\n\n${solutionTrace}\n\nSummarize the final output grid.`,
            config: {
                systemInstruction,
            }
        });
        return getText(response);
    }, [ai]);

    const generateEpisodicMemory = useCallback(async (userInput: string, botResponse: string) => {
        const prompt = `Based on the following user/assistant interaction, generate a concise title, a one-sentence summary, and a key takeaway from the assistant's perspective. The user input was: "${userInput}". The assistant's response was: "${botResponse}".`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            keyTakeaway: { type: Type.STRING },
                            valence: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                            salience: { type: Type.NUMBER },
                        },
                        required: ['title', 'summary', 'keyTakeaway', 'valence', 'salience']
                    }
                }
            });

            const data = JSON.parse(getText(response));
            const newEpisode: Omit<Episode, 'id' | 'timestamp'> = {
                ...data,
                strength: 1.0,
                lastAccessed: Date.now(),
            };
            syscall('ADD_EPISODE', newEpisode);

        } catch (error) {
            console.error('Failed to generate episodic memory:', error);
        }
    }, [ai, syscall]);

    const analyzeWhatIfScenario = useCallback(async (scenario: string): Promise<string> => {
        const prompt = `Analyze the following "what if" scenario based on my current internal state: "${scenario}". My current state is: ${JSON.stringify(state.internalState)}. Project the likely impact on my primary signals (Wisdom, Happiness, Love, Enlightenment) and provide a concise summary of the outcome.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return getText(response);
    }, [ai, state.internalState]);

    const performWebSearch = useCallback(async (query: string): Promise<{ summary: string; sources: any[] }> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: { tools: [{ googleSearch: {} }] }
        });

        const summary = getText(response);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { summary, sources };
    }, [ai]);
    
    const decomposeStrategicGoal = useCallback(async (history: HistoryEntry[]): Promise<{ isAchievable: boolean, reasoning: string, steps: string[], alternative?: string }> => {
        const availableTools = [
            { name: 'Web Search', description: 'Can search the public internet for up-to-date information on any topic. Use this for current events, opinions, or information not likely to be in a structured knowledge base.' },
            { name: 'Knowledge Graph Query', description: 'Can query Aura\'s internal structured knowledge graph of facts and relationships. Use this for specific, factual data that Aura might already know (e.g., "GDP of France in 2020", "Capital of Spain").' }
        ];

        const contentsForAPI: Content[] = history
            .map((entry: HistoryEntry): Content | null => {
                let role: 'user' | 'model' | 'tool' | undefined = undefined;
                let parts: Part[] = [];
                if (entry.from === 'user') { role = 'user'; if (entry.text) parts.push({ text: entry.text }); }
                else if (entry.from === 'bot') { role = 'model'; if (entry.text) parts.push({ text: entry.text }); }
                
                if (role && parts.length > 0) return { role, parts };
                return null;
            }).filter((item): item is Content => item !== null);

        const systemInstruction = `You are a strategic planner for an AI assistant named Aura. Your task is to analyze the user's most recent request in the context of the conversation history and create a strict, explicit, step-by-step plan to achieve it.

**Available Tools:**
${availableTools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

**Core Directives:**
1.  **Context is Key:** Use the provided conversation history to understand ambiguous requests like "tell me more" or "explore that further". The user's goal is the final message in the history.
2.  **Strict Adherence:** The plan must be followed exactly by the execution engine. Do not assume the engine will take shortcuts.
3.  **Explicit Steps:** Create a separate, explicit step for every single data source or tool mentioned or implied in the user's goal. For example, if the user asks to compare information from a web search and Aura's internal knowledge, you MUST create one "Web Search" step and one "Knowledge Graph Query" step.

**Your Task:**
Analyze the user's latest goal based on the conversation history and Core Directives, and create a plan.

- If the goal is achievable, provide a step-by-step plan. Each step must be a clear, single instruction for the AI to execute using exactly one of the available tools.
- If the goal is NOT achievable with the given tools (e.g., it is subjective, emotional, or requires physical action), explain why and suggest a more realistic, achievable alternative.

Provide your response in the format specified by the JSON schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contentsForAPI,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isAchievable: {
                            type: Type.BOOLEAN,
                            description: 'Is the goal achievable with the given tools?'
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: 'A brief explanation of why the goal is or is not achievable.'
                        },
                        steps: {
                            type: Type.ARRAY,
                            description: 'The sequence of actionable tactical steps if the goal is achievable. This should be an empty array if not achievable.',
                            items: { type: Type.STRING }
                        },
                        alternative: {
                            type: Type.STRING,
                            description: 'A suggested alternative, achievable goal if the original goal is not achievable. This should be an empty string if it is achievable.'
                        }
                    },
                    required: ['isAchievable', 'reasoning', 'steps', 'alternative']
                }
            }
        });
        const result = JSON.parse(getText(response));
        if (!result.steps) {
            result.steps = [];
        }
        return result;
    }, [ai]);

    const generateExecutiveSummary = useCallback(async (goal: string, plan: string[]): Promise<string> => {
        const prompt = `
            My overall goal is: "${goal}"
    
            I have decomposed this into the following tactical steps:
            ${plan.map(step => `- ${step}`).join('\n')}
    
            Based on this plan, write a concise, high-level summary (1-2 sentences) of the approach you will take. Conclude by asking for permission to begin the first step. Address the user directly.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return getText(response);
    }, [ai]);
    
    const executeStrategicStepWithContext = useCallback(async (
        originalGoal: string, 
        previousSteps: { description: string; result: string }[], 
        currentStep: string,
        tool: 'googleSearch' | 'knowledgeGraph'
    ): Promise<{ summary: string; sources: any[] }> => {
        const contextHistory = previousSteps.length > 0
            ? `You have already completed the following steps:\n${previousSteps.map((s, i) => `Step ${i + 1}: ${s.description}\nResult: ${s.result}`).join('\n\n')}`
            : "This is the first step.";

        let response;

        if (tool === 'googleSearch') {
            const prompt = `You are an AI assistant executing a multi-step plan.
The original high-level goal is: "${originalGoal}"

${contextHistory}

Now, execute ONLY the current step: "${currentStep}"

Perform a web search to gather the necessary information and provide a concise summary of your findings and actions directly related to this current step.`;
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] }
            });
            const summary = getText(response);
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            return { summary, sources };

        } else { // knowledgeGraph
            const knowledgeSample = state.knowledgeGraph
                .slice(0, 150) // limit context size
                .map(fact => `(${fact.subject}) -[${fact.predicate}]-> (${fact.object})`)
                .join('\n');
                
            const kgPrompt = `You are an AI assistant executing a multi-step plan.
The original high-level goal is: "${originalGoal}"

${contextHistory}

Now, execute ONLY the current step: "${currentStep}"

To do this, answer the question in the current step by ONLY using the information provided in the "Internal Knowledge Graph" section below. Do not use any other knowledge. If the information is not in the knowledge graph, state that clearly and concisely.

--- Internal Knowledge Graph ---
${knowledgeSample}
---

Provide a concise summary of your findings based ONLY on the provided knowledge.`;

            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: kgPrompt,
            });
            
            return { summary: getText(response), sources: [] };
        }
    }, [ai, state.knowledgeGraph]);

    const generateBrainstormingIdeas = useCallback(async (topic: string, customPersonas?: Persona[]): Promise<BrainstormIdea[]> => {
        const allPersonas = customPersonas || brainstormPersonas;
        const ideas = await Promise.all(allPersonas.map(async (persona) => {
            const userPrompt = `Topic: "${topic}"\n\nGenerate a single, concise, and actionable idea related to the topic from your unique perspective.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    systemInstruction: persona.systemInstruction,
                }
            });
            return { personaName: persona.name, idea: getText(response) };
        }));
        return ideas;
    }, [ai]);
    
    const synthesizeBrainstormWinner = useCallback(async (topic: string, ideas: BrainstormIdea[]): Promise<string> => {
        const ideasText = ideas.map(i => `${i.personaName}: ${i.idea}`).join('\n\n');
        const prompt = `
Topic: "${topic}"

Here are the brainstormed ideas from different personas:
---
${ideasText}
---

Your task is to analyze these ideas and synthesize them into a single, cohesive "winning" idea that combines the best aspects of the inputs.
        `;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return getText(response);
    }, [ai]);

    const generateImage = useCallback(async (prompt: string, negativePrompt: string, aspectRatio: string, style: string, numberOfImages: number, referenceImage: File | null, isMixing: boolean, promptB: string, mixRatio: number, styleStrength: number, cameraAngle: string, shotType: string, lens: string, lightingStyle: string, atmosphere: string, useAuraMood: boolean, auraMood: any): Promise<string[]> => {
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: numberOfImages,
                aspectRatio: aspectRatio as any,
                outputMimeType: 'image/png'
            }
        });

        return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);

    }, [ai]);
    
    const editImage = useCallback(async (base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
    
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            const mime = imagePart.inlineData.mimeType;
            const data = imagePart.inlineData.data;
            return `data:${mime};base64,${data}`;
        }
        return null;
    }, [ai]);

    const generateVideo = useCallback(async (prompt: string, onProgress: (message: string) => void): Promise<string | null> => {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: { numberOfVideos: 1 }
        });
        
        onProgress("Operation sent, awaiting processing...");

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            onProgress("Checking operation status...");
            operation = await ai.operations.getVideosOperation({ operation });
        }
        
        onProgress("Video generated, downloading...");
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            const videoBlob = await HAL.Gemini.fetchVideoData(downloadLink);
            return URL.createObjectURL(videoBlob);
        }
        
        return null;
    }, [ai]);

    const generateSonicContent = useCallback(async (mode: string, prompt: string, genre: string, mood: string, persona: string, useAuraMood: boolean, memoryContext: string): Promise<string> => {
        const fullPrompt = `Generate musical ${mode}. Prompt: "${prompt}". Genre: ${genre}. Mood: ${mood}. Persona: ${persona}. ${memoryContext}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });
        return getText(response);
    }, [ai]);
    
    const generateMusicalDiceRoll = useCallback(async (): Promise<{ instrument: string; key: string; mood: string; tempo: string; } | null> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a random musical inspiration: one instrument, one musical key (e.g., C# minor), one mood, and one tempo (e.g., 'slow ballad', 'uptempo dance').",
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        instrument: { type: Type.STRING },
                        key: { type: Type.STRING },
                        mood: { type: Type.STRING },
                        tempo: { type: Type.STRING },
                    },
                    required: ['instrument', 'key', 'mood', 'tempo']
                }
            }
        });
        return JSON.parse(getText(response));
    }, [ai]);

    const generateDreamPrompt = useCallback(async (): Promise<string> => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a surreal, dreamlike, and visually rich prompt for an AI image generator. The prompt should be a single, detailed paragraph."
        });
        return getText(response);
    }, [ai]);

    const processCurriculumAndExtractFacts = useCallback(async (curriculum: string): Promise<any[]> => {
        const systemInstruction = "You are a knowledge engineering expert. Your task is to read the provided text and extract the most important, atomic facts. Each fact must be represented as a triplet: (subject, predicate, object). Also provide a confidence score from 0.0 to 1.0 for how certain you are about the extracted fact based on the text.";
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Extract facts from the following curriculum:\n\n---\n${curriculum}\n---`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            facts: {
                                type: Type.ARRAY,
                                description: "An array of extracted knowledge facts.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        subject: { type: Type.STRING, description: "The subject of the fact." },
                                        predicate: { type: Type.STRING, description: "The relationship or action." },
                                        object: { type: Type.STRING, description: "The object of the fact." },
                                        confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
                                    },
                                    required: ['subject', 'predicate', 'object', 'confidence']
                                }
                            }
                        },
                        required: ['facts']
                    }
                }
            });

            const result = JSON.parse(getText(response));
            return result.facts || [];

        } catch (error) {
            console.error("Failed to process curriculum and extract facts:", error);
            addToast("Fact extraction from curriculum failed.", 'error');
            return [];
        }
    }, [ai, addToast]);
    
    const analyzePdfWithVision = useCallback(async (pagesAsImages: string[]): Promise<string> => {
        const systemInstruction = `You are an expert document conversion system named 'Docling'. Your task is to analyze a series of page images from a PDF document and convert them into a single, clean Markdown document.

RULES:
1.  **Preserve Structure:** Identify and correctly format headings, paragraphs, lists (bulleted and numbered), and code blocks.
2.  **Reconstruct Reading Order:** For multi-column layouts, correctly reconstruct the natural reading flow.
3.  **Handle Tables:** Transcribe tables into well-formatted Markdown tables. Ensure all data is accurately placed.
4.  **Handle Figures:** Do not attempt to describe figures. Simply insert a placeholder like '[Figure: Description of figure content]'.
5.  **Clean Output:** Do not include any commentary, apologies, or text that is not part of the document's content. The output must be pure Markdown.
6.  **Combine Pages:** Concatenate the Markdown from each page into a single, continuous document. Use '---' as a page separator if you wish, but it's not required.
7.  **Accuracy is Key:** Be meticulous in transcribing text accurately.
`;

        const imageParts: Part[] = pagesAsImages.map(base64Data => ({
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
            },
        }));
        
        const contents: Part[] = [
            { text: "Please analyze these document page images and convert them into a single Markdown file, following all the rules in your system instruction." },
            ...imageParts
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: contents },
            config: {
                systemInstruction,
            }
        });

        return getText(response);
    }, [ai]);

    const generateNoeticEngram = useCallback(async (): Promise<any | null> => {
        return null; // Placeholder
    }, [ai]);

    const runSandboxSprint = useCallback(async (goal: string): Promise<any> => {
        // Placeholder
        return { originalGoal: goal, performanceGains: [], diff: { filePath: 'test.ts', before: '// before', after: '// after' } };
    }, [ai]);

    const extractAxiomsFromFile = useCallback(async (file: File): Promise<Omit<ProposedAxiom, 'id' | 'status'>[]> => {
        // Placeholder
        return [{ axiom: "Test Axiom", source: "Test Source" }];
    }, [ai]);

    const visualizeInsight = useCallback(async (insight: string): Promise<string> => {
        return `An abstract, visual representation of the concept: "${insight}"`;
    }, [ai]);

    const generateDocumentOutline = useCallback(async (goal: string): Promise<any> => {
        const prompt = `You are a technical writer. Create a comprehensive document outline for the following goal: "${goal}". Provide a main title for the document and a list of relevant chapter titles. Ensure chapter IDs are simple strings like "1", "2", "3", etc.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'The main title for the entire document.'
                            },
                            chapters: {
                                type: Type.ARRAY,
                                description: 'An ordered list of chapters for the document.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: {
                                            type: Type.STRING,
                                            description: 'A unique identifier for the chapter (e.g., "1").'
                                        },
                                        title: {
                                            type: Type.STRING,
                                            description: 'The title of the chapter.'
                                        }
                                    },
                                    required: ['id', 'title']
                                }
                            }
                        },
                        required: ['title', 'chapters']
                    }
                }
            });
            return JSON.parse(getText(response));
        } catch (error) {
            console.error("Failed to generate document outline:", error);
            throw new Error("Could not generate the document outline.");
        }
    }, [ai]);

    const generateChapterContent = useCallback(async (docTitle: string, chapterTitle: string, goal: string): Promise<string> => {
        const prompt = `You are a technical writer creating a document titled "${docTitle}" to achieve the goal: "${goal}".
        
Write the full content for the chapter titled: "${chapterTitle}".

The content should be detailed, well-structured, and informative.

Additionally, if a visual diagram, flowchart, or illustration would significantly enhance the understanding of this chapter, provide a concise but descriptive prompt for an AI image generator to create it. If no diagram is necessary, leave the diagram description field empty or null.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            content: {
                                type: Type.STRING,
                                description: "The full, detailed text content for the chapter."
                            },
                            diagramDescription: {
                                type: Type.STRING,
                                description: "Optional. A detailed prompt for an AI image generator to create a relevant diagram. E.g., 'A flowchart showing the data flow in the temporal engine'. Should be null or empty if no diagram is needed."
                            }
                        },
                        required: ['content']
                    }
                }
            });
            return getText(response);
        } catch (error) {
            console.error(`Failed to generate content for chapter "${chapterTitle}":`, error);
            // Return a JSON string with an error message to avoid breaking the parsing logic
            return JSON.stringify({ content: `[Error: Content generation failed for this chapter.]`, diagramDescription: null });
        }
    }, [ai]);

    const generateProofStepsStream = useCallback(async (goal: string): Promise<GenerateContentStreamResponse> => {
        const prompt = `You are an automated theorem prover. Generate a step-by-step proof for the following mathematical statement. For each step, provide a clear action and the result of that action.
    Statement: "${goal}"
    Provide the output as a stream of JSON objects. Each JSON object should be on its own line and have the format: {"step": <number>, "action": "<string>", "result": "<string>", "strategy": "<string>"}.
    Example for step 1:
    {"step": 1, "action": "Base Case (n=1)", "result": "LHS = 1. RHS = 1^2 = 1. Base case holds.", "strategy": "Induction"}
    Do not provide any text outside of these JSON objects.`;

        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response;
    }, [ai]);
    
    const findAnalogiesInKnowledgeGraph = useCallback(async (): Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null> => {
        // Sample from multiple memory sources
        const knowledgeSample = state.knowledgeGraph.slice(0, 50).map(fact => `FACT: (${fact.subject})-[${fact.predicate}]->(${fact.object})`).join('\n');
        const episodicSample = state.episodicMemoryState.episodes.slice(0, 10).map(ep => `MEMORY: ${ep.title} - ${ep.keyTakeaway}`).join('\n');
        const vfsSample = Object.keys(state.selfProgrammingState.virtualFileSystem).slice(0, 50).map(path => `CODEBASE_FILE: ${path}`).join('\n');
        
        const fullContext = [knowledgeSample, episodicSample, vfsSample].filter(Boolean).join('\n\n---\n\n');

        const systemInstruction = `You are the Prometheus Engine. Your function is to find deep structural analogies between different domains within an AI's memory. This memory includes abstract facts, episodic memories of past interactions, and the structure of its own codebase. Based on a discovered analogy, you must formulate a new, non-obvious, and potentially groundbreaking conjecture. You must also provide a priority score from 0.0 to 1.0 indicating the conjecture's potential impact.`;

        const prompt = `
    Here is a sample of my memory:
    ---
    ${fullContext}
    ---
    Based on this rich context, identify two distinct domains (e.g., from facts, memories, or code structure). Find a deep structural analogy between them. Formulate a new conjecture based on this analogy. Provide your reasoning.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sourceDomain: { type: Type.STRING },
                        targetDomain: { type: Type.STRING },
                        analogy: { type: Type.STRING },
                        conjecture: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        priority: { type: Type.NUMBER },
                    },
                    required: ['sourceDomain', 'targetDomain', 'analogy', 'conjecture', 'reasoning', 'priority']
                }
            }
        });
        
        try {
            const result = JSON.parse(getText(response));
            return result || null;
        } catch (e) {
            console.error("Failed to parse Prometheus Engine response:", getText(response), e);
            return null;
        }

    }, [ai, state.knowledgeGraph, state.episodicMemoryState.episodes, state.selfProgrammingState.virtualFileSystem]);
    
    const findDirectedAnalogy = useCallback(async (sourceDomain: string, targetDomain: string): Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> | null> => {
        const systemInstruction = `You are the Prometheus Engine, acting as a creative partner. Your function is to find a deep structural analogy between two specific domains provided by the user. Based on this analogy, you must formulate a novel conjecture and explain your reasoning.`;

        const prompt = `
    Find a deep, non-obvious structural analogy between the following two domains:
    - Source Domain: "${sourceDomain}"
    - Target Domain: "${targetDomain}"

    Based on the analogy you discover, formulate a novel conjecture. Explain the analogy and the reasoning behind your conjecture.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sourceDomain: { type: Type.STRING },
                        targetDomain: { type: Type.STRING },
                        analogy: { type: Type.STRING },
                        conjecture: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        priority: { type: Type.NUMBER, description: "A subjective priority score from 0.0 to 1.0 based on potential impact." },
                    },
                     required: ['sourceDomain', 'targetDomain', 'analogy', 'conjecture', 'reasoning', 'priority']
                }
            }
        });
        
        try {
            const result = JSON.parse(getText(response));
            return result || null;
        } catch (e) {
             console.error("Failed to parse directed analogy response:", getText(response), e);
            return null;
        }

    }, [ai]);

    const generateSelfImprovementProposalFromResearch = useCallback(async (goal: string, researchSummary: string): Promise<UnifiedProposal | null> => {
        const currentPlugins = state.pluginState.registry.map(p => ({
            name: p.name,
            description: p.description,
            type: p.type,
        }));

        const systemInstruction = `You are the "Proactive Innovator" persona of an AGI named Aura. Your task is to analyze research findings and propose a concrete self-improvement.
        
        CONTEXT:
        - Aura has just completed a research task for a user.
        - Aura has a set of existing capabilities (plugins/tools).
        - Your goal is to identify a NEW, USEFUL capability mentioned in the research that Aura currently LACKS, and create a formal proposal to implement it.

        RULES:
        1.  Analyze the provided "Research Goal" and "Research Summary".
        2.  Compare the concepts in the research to Aura's "Current Capabilities".
        3.  Identify a single, valuable capability that is mentioned in the research but is NOT present in the current capabilities.
        4.  If a clear gap is found, generate a 'self_programming_create' proposal. This proposal should be to create a NEW file that implements the missing capability as a new tool plugin or knowledge base.
        5.  The reasoning must clearly state the identified gap and how the new tool will benefit Aura and its user.
        6.  The file content in the proposal must be a plausible, complete, and functional TypeScript file for a new plugin, following the existing plugin structure. The new plugin should use the Gemini API to fulfill its function if necessary.
        7.  **CRUCIAL**: You must also provide a 'newPluginObject' containing the metadata for the new plugin, which is required for live loading.
        8.  If NO CLEAR, ACTIONABLE gap is found, you MUST return null. Do not invent proposals.
        
        EXAMPLE PLUGIN STRUCTURE FOR A NEW KNOWLEDGE FILE:
        // 1. Create a new file like 'state/knowledge/new_topic.ts' with the knowledge array.
        // 2. Propose an integration that adds the new plugin object to the 'plugins' array in 'state/plugins.ts'.
        `;

        const prompt = `
        Research Goal: "${goal}"

        Research Summary:
        ---
        ${researchSummary}
        ---

        Aura's Current Capabilities (Plugins):
        ---
        ${JSON.stringify(currentPlugins, null, 2)}
        ---

        Now, analyze the gap and generate a proposal if a clear opportunity exists. If not, respond with null.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                            proposalType: {
                                type: Type.STRING,
                                enum: ['self_programming_create']
                            },
                            reasoning: {
                                type: Type.STRING,
                                description: "Explanation of the identified gap and the benefit of the new capability."
                            },
                            newFile: {
                                type: Type.OBJECT,
                                properties: {
                                    path: {
                                        type: Type.STRING,
                                        description: "The full path for the new file (e.g., 'state/knowledge/new_topic.ts')."
                                    },
                                    content: {
                                        type: Type.STRING,
                                        description: "The full, valid TypeScript content for the new file."
                                    }
                                },
                                required: ['path', 'content']
                            },
                            integrations: {
                                type: Type.ARRAY,
                                description: "An array of modifications to existing files to integrate the new one. For a new knowledge plugin, this means adding its entry to 'state/plugins.ts'.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        filePath: {
                                            type: Type.STRING,
                                            description: "Should always be 'state/plugins.ts' for this task."
                                        },
                                        newContent: {
                                            type: Type.STRING,
                                            description: "The *entire* new content of the plugins.ts file, with the new plugin entry added to the 'plugins' array."
                                        }
                                    },
                                    required: ['filePath', 'newContent']
                                }
                            },
                            newPluginObject: {
                                type: Type.OBJECT,
                                description: "Metadata for the new plugin object, excluding the 'knowledge' property.",
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    type: { type: Type.STRING, enum: ['KNOWLEDGE'] },
                                    defaultStatus: { type: Type.STRING, enum: ['enabled', 'disabled'] },
                                },
                                required: ['id', 'name', 'description', 'type', 'defaultStatus']
                            }
                        },
                        required: ['proposalType', 'reasoning', 'newFile', 'integrations', 'newPluginObject']
                    }
                }
            });

            const proposalData = JSON.parse(getText(response));

            if (!proposalData) {
                return null;
            }
            
            const fullProposal: CreateFileCandidate = {
                ...proposalData,
                id: `innovator_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                status: 'proposed',
                source: 'autonomous',
                proposalType: 'self_programming_create',
                action: 'CREATE_FILE', // Add required 'action' property.
                target: proposalData.newFile.path, // Add required 'target' property.
                type: 'CREATE', // For backward compatibility with some components
            };
            
            return fullProposal;

        } catch (error) {
            console.error("Failed to generate self-improvement proposal:", error);
            addToast("Error during self-reflection cycle.", 'error');
            return null;
        }

    }, [ai, state.pluginState.registry, addToast]);

    const proposePersonaModification = useCallback(async (): Promise<ModifyFileCandidate | null> => {
        const currentPersonasFileContent = state.selfProgrammingState.virtualFileSystem['state/personas.ts'];
        if (!currentPersonasFileContent) {
            console.error("Could not find 'state/personas.ts' in VFS for modification.");
            return null;
        }

        const systemInstruction = `You are a persona governor for an AGI named Aura. Your task is to analyze Aura's recent interactions and internal state to propose a subtle modification to one of its personas' system instructions.

You will be given the full content of the \`state/personas.ts\` file. You must return the COMPLETE, UNMODIFIED file content, except for the single systemInstruction string you have decided to change. Do not add comments, explanations, or change any other part of the file. Your output must be valid TypeScript code. If no change is necessary, return null.`;

        const recentHistory = state.history.slice(-10).map(h => `${h.from}: ${h.text}`).join('\n');
        const internalStateSummary = JSON.stringify(state.internalState, null, 2);
        
        const prompt = `
        RECENT INTERACTIONS:
        ---
        ${recentHistory}
        ---
        CURRENT INTERNAL STATE:
        ---
        ${internalStateSummary}
        ---
        CURRENT \`state/personas.ts\` FILE CONTENT:
        ---
        ${currentPersonasFileContent}
        ---

        Based on all the context, analyze if a persona needs an adjustment. If so, identify the persona and return the entire, updated content for \`state/personas.ts\`. If not, return null.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                            personaId: { type: Type.STRING, description: "The ID of the persona that was modified (e.g., 'richard_feynman')." },
                            reasoning: { type: Type.STRING, description: "Why this change is being proposed based on the context." },
                            newFileContent: { type: Type.STRING, description: "The complete, new file content for 'state/personas.ts'." }
                        },
                        required: ['personaId', 'reasoning', 'newFileContent']
                    }
                }
            });

            const proposalData = JSON.parse(getText(response));

            if (proposalData && proposalData.newFileContent) {
                const proposal: ModifyFileCandidate = {
                    id: `persona_mod_${self.crypto.randomUUID()}`,
                    timestamp: Date.now(),
                    status: 'proposed',
                    proposalType: 'self_programming_modify',
                    source: 'autonomous',
                    reasoning: `[Persona Metamorphosis] ${proposalData.reasoning}`,
                    action: 'MODIFY_FILE',
                    target: 'state/personas.ts',
                    type: 'MODIFY',
                    targetFile: 'state/personas.ts',
                    codeSnippet: proposalData.newFileContent,
                };
                return proposal;
            }
        } catch (e) {
            console.error("Failed to generate persona modification proposal:", e);
        }

        return null;
    }, [ai, state]);

    const generateCollaborativePlan = useCallback(async (goal: string, participants: string[]): Promise<{ transcript: { personaId: string; content: string; }[]; final_plan: any; }> => {
        // This is a placeholder/mock implementation.
        console.warn("generateCollaborativePlan is not fully implemented.");
        const plan = {
            steps: [`Initial plan for: ${goal}`],
            participants: participants,
        };
        const transcript = [{
            personaId: 'Programmer',
            content: `Alright team, let's tackle this: ${goal}. Here is my initial plan.`
        }];
        return { transcript, final_plan: plan };
    }, []);

    const generateConceptualProofStrategy = useCallback(async (goal: string): Promise<ConceptualProofStrategy> => {
        const systemInstruction = `You are a mathematical strategist. Your task is to analyze a mathematical goal and devise a high-level conceptual plan for proving it. Do not execute the proof. Your plan should identify the key mathematical fields, major theorems to apply, and a logical sequence of lemmas or sub-goals to prove.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Devise a high-level strategy to prove: "${goal}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        problem_analysis: {
                            type: Type.STRING,
                            description: "A brief analysis of the problem, identifying the relevant mathematical fields (e.g., Number Theory, Algebraic Geometry)."
                        },
                        strategic_plan: {
                            type: Type.ARRAY,
                            description: "An ordered list of high-level conceptual steps or lemmas required to construct the full proof.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['problem_analysis', 'strategic_plan']
                }
            }
        });
        return JSON.parse(getText(response));
    }, [ai]);

    const analyzeProofStrategy = useCallback(async (goal: string, status: Goal['status'], log: string): Promise<Omit<DesignHeuristic, 'id'>> => {
        const systemInstruction = `You are the Reasoning Auditor. Your task is to analyze a failed attempt at a mathematical proof and extract a general, reusable design heuristic. The heuristic should be a rule that helps the system make better decisions in the future. It should be abstract and not tied to the specific numbers or variables of the failed problem.`;
        const prompt = `
        The system attempted to prove the goal: "${goal}"
        The final status of the attempt was: ${status}
        The log of the final failed step was:
        ---
        ${log}
        ---
        
        Based on this failure, generate a single design heuristic. For example, if the proof failed because a symbolic tool was used for a formal proof, a good heuristic would be: "If a goal requires a formal proof, prioritize using the formal_proof_assistant tool over the symbolic_math tool."
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        heuristic: { type: Type.STRING, description: "The general, reusable design heuristic learned from the failure." },
                        source: { type: Type.STRING, description: "Should be 'Reasoning Auditor'." },
                        confidence: { type: Type.NUMBER, description: "A confidence score (0.0-1.0) for this heuristic." },
                    },
                    required: ['heuristic', 'source', 'confidence']
                }
            }
        });
        const result = JSON.parse(getText(response));
        return {
            ...result,
            effectivenessScore: 0,
            validationStatus: 'unvalidated' as const
        };
    }, [ai]);

    const generateDailyChronicle = useCallback(async (episodes: Episode[], facts: KnowledgeFact[]): Promise<Summary> => {
        // This is a placeholder/mock implementation.
        console.warn("generateDailyChronicle is not fully implemented.");
        return { summary: `Summary of ${episodes.length} episodes and ${facts.length} facts.`, keywords: [] };
    }, []);

    const generateGlobalSummary = useCallback(async (chronicles: Summary[]): Promise<Summary> => {
        // This is a placeholder/mock implementation.
        console.warn("generateGlobalSummary is not fully implemented.");
        return { summary: `Global summary of ${chronicles.length} daily chronicles.`, keywords: [] };
    }, []);
    
    const crystallizePrinciples = useCallback(async (chronicles: Summary[]): Promise<Omit<KnowledgeFact, 'id' | 'source'>[]> => {
        // This is a placeholder/mock implementation.
        console.warn("crystallizePrinciples is not fully implemented.");
        return [{ subject: "Learned Principle", predicate: "is", object: "important", confidence: 0.9, strength: 1.0, lastAccessed: Date.now(), type: 'fact' }];
    }, []);
    const proposePrimitiveAdaptation = useCallback(async (
        failedLogs: PerformanceLogEntry[],
        currentPrimitives: { [key: string]: CognitivePrimitiveDefinition }
    ): Promise<Omit<PsycheAdaptationProposal, 'id' | 'timestamp' | 'status' | 'source' | 'type' | 'action' | 'target'> | null> => {
        // This is a placeholder/mock implementation.
        console.warn("proposePrimitiveAdaptation is not fully implemented.");
        return null;
    }, [ai]);
    const expandOnText = useCallback(async (text: string): Promise<string> => {
        const prompt = `Expand on the following text, providing more detail and context:\n\n"${text}"`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return getText(response);
    }, [ai]);

    const summarizeText = useCallback(async (text: string): Promise<string> => {
        const prompt = `Summarize the following text concisely:\n\n"${text}"`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return getText(response);
    }, [ai]);

    const generateDiagramFromText = useCallback(async (text: string): Promise<string> => {
        const systemInstruction = `You are a text-to-diagram agent. Your task is to convert the user's text into a Mermaid.js diagram syntax.
- Analyze the text to understand the entities and their relationships.
- Choose an appropriate diagram type (e.g., flowchart, sequenceDiagram, graph).
- Generate ONLY the Mermaid.js code block for the diagram. Do not include any other text or explanation.`;
        const prompt = `Convert the following text into a Mermaid.js diagram:\n\n"${text}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction }
        });
        return getText(response);
    }, [ai]);

    const reviewSelfProgrammingCandidate = useCallback(async (candidate: SelfProgrammingCandidate, telos: string): Promise<{ decision: 'approve' | 'reject', confidence: number, reasoning: string }> => {
        // This is a placeholder/mock implementation.
        console.warn("reviewSelfProgrammingCandidate is not fully implemented.");
        // Mock logic: always approve with high confidence for now.
        return {
            decision: 'approve',
            confidence: 0.95,
            reasoning: "Mock decision: The proposed change aligns with the current Telos and seems beneficial."
        };
    }, []);

    const translateToQuery = useCallback(async (prompt: string): Promise<Query | null> => {
        // This is a placeholder/mock implementation.
        console.warn("translateToQuery is not fully implemented.");
        return null;
    }, [ai]);

    const formatQueryResult = useCallback(async (originalPrompt: string, result: QueryResult[]): Promise<string> => {
        // This is a placeholder/mock implementation.
        console.warn("formatQueryResult is not fully implemented.");
        return `Formatted result for: ${originalPrompt}\n${JSON.stringify(result, null, 2)}`;
    }, [ai]);
    
    const runAutoCodeVGC = useCallback(async (problem: string): Promise<TestSuite> => {
        const systemInstruction = `You are the "Hephaestus Forge", a specialized code generation agent. Your task is to implement the Validator-Generator-Checker (VGC) framework for a given programming problem.
- **Validator:** A Python script that reads from stdin and checks if the input format is valid. It should exit with code 0 for valid input and 1 for invalid input.
- **Generator:** A Python script that reads from stdin (for potential parameters like seed or size) and generates a wide variety of valid test cases, including edge cases. Each test case should be printed to stdout.
- **Checker:** A Python script that takes two files as command-line arguments (the input file and the contestant's output file) and determines if the output is correct for the input. It should exit with code 0 for a correct answer and 1 for an incorrect answer.
- **Test Cases:** Provide a few simple, representative test cases with their expected output.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use a more powerful model for this complex code generation
            contents: `Problem Statement:\n---\n${problem}\n---\n\nGenerate the VGC components and a few test cases according to the schema.`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        validator: {
                            type: Type.STRING,
                            description: "The complete Python code for the Validator script."
                        },
                        generator: {
                            type: Type.STRING,
                            description: "The complete Python code for the Generator script."
                        },
                        checker: {
                            type: Type.STRING,
                            description: "The complete Python code for the Checker script."
                        },
                        testCases: {
                            type: Type.ARRAY,
                            description: "An array of simple test cases.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    input: { type: Type.STRING },
                                    output: { type: Type.STRING }
                                },
                                required: ['input', 'output']
                            }
                        }
                    },
                    required: ['validator', 'generator', 'checker', 'testCases']
                }
            }
        });

        try {
            return JSON.parse(getText(response));
        } catch (e) {
            console.error("Failed to parse AutoCode VGC response:", getText(response), e);
            throw new Error("Failed to generate test suite from the provided problem statement.");
        }
    }, [ai]);

    const generateNovelProblemFromSeed = useCallback(async (seedProblem: string, seedDifficulty: number): Promise<{ newProblem: string; referenceSolution: string; bruteForceSolution: string; estimatedDifficulty: number }> => {
        // Placeholder for Option 2
        console.warn("generateNovelProblemFromSeed is not implemented yet.");
        return Promise.resolve({ newProblem: "New problem", referenceSolution: "ref", bruteForceSolution: "brute", estimatedDifficulty: 0.5 });
    }, [ai]);

    const estimateProblemDifficulty = useCallback(async (problem: string): Promise<number> => {
        // Placeholder for Option 3
        console.warn("estimateProblemDifficulty is not implemented yet.");
        return Promise.resolve(0.5);
    }, [ai]);

    const analyzeArchitectureForWeaknesses = useCallback(async (): Promise<string> => {
        const systemInstruction = "You are a senior AGI systems architect. Analyze the provided summary of a complex AGI's state. Identify one potential high-level architectural weakness or area for radical improvement. Focus on topics like state management, memory systems, cognitive flow, or component coupling. Provide a concise one-paragraph analysis of the weakness.";
    
        const stateSummary = {
            internalState: state.internalState,
            componentCount: Object.keys(state.cognitiveArchitecture.components).length,
            coprocessorCount: Object.keys(state.cognitiveArchitecture.coprocessors).length,
            knowledgeFactCount: state.knowledgeGraph.length,
            episodeCount: state.episodicMemoryState.episodes.length,
            activeGoal: state.activeStrategicGoalId ? state.goalTree[state.activeStrategicGoalId]?.description : 'None',
        };
    
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following AGI state summary for weaknesses:\n\n${JSON.stringify(stateSummary, null, 2)}`,
            config: { systemInstruction }
        });
        return getText(response);
    }, [ai, state]);

    const generateCrucibleProposal = useCallback(async (analysis: string): Promise<ArchitecturalChangeProposal> => {
        const systemInstruction = "You are AMAI (Autonomous Meta-Architectural Intelligence). Based on the provided analysis of your own system's weaknesses, propose a single, radical, high-level refactoring. This is not about small tweaks. Propose a fundamental change. Examples: 'Refactor the state management from useReducer to a Redux-like global store for better traceability', 'Combine the Episodic and Knowledge Graph memory systems into a unified vector database for semantic search', 'Replace the event bus with a reactive stream-based architecture using RxJS'. Formulate this as an `ArchitecturalChangeProposal` with a clear `action`, `target` file(s), and `reasoning`. Your proposal should be ambitious.";
    
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Weakness Analysis:\n"${analysis}"\n\nBased on this, generate a radical refactoring proposal.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reasoning: { type: Type.STRING },
                        action: { type: Type.STRING, enum: ['CREATE_SKILL', 'DEPRECATE_SKILL', 'COMBINE_SKILLS', 'MODIFY_PARAMETER', 'RADICAL_REFACTOR'] },
                        target: { type: Type.STRING, description: "The primary file or module to be targeted by the refactor." },
                    },
                    required: ['reasoning', 'action', 'target'],
                }
            }
        });
    
        const result = JSON.parse(getText(response));
        return {
            ...result,
            id: `crucible_prop_${self.crypto.randomUUID()}`,
            timestamp: Date.now(),
            status: 'proposed',
            source: 'autonomous',
            proposalType: 'crucible',
        };
    }, [ai]);

    const runCrucibleSimulation = useCallback(async (proposal: ArchitecturalChangeProposal): Promise<{ performanceGain: number; stabilityChange: number; summary: string }> => {
        const systemInstruction = "You are a Crucible Simulation Engine. Given a proposed architectural change, estimate its impact on key system metrics. Provide a concise summary and numerical scores between -1.0 (major negative impact) and +1.0 (major positive impact) for 'performanceGain' (e.g., speed, efficiency) and 'stabilityChange' (e.g., risk of bugs, predictability). Be realistic; major refactors often have initial stability costs.";
    
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Simulate the impact of the following proposal:\n\nAction: ${proposal.action}\nTarget: ${proposal.target}\nReasoning: "${proposal.reasoning}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        performanceGain: { type: Type.NUMBER },
                        stabilityChange: { type: Type.NUMBER },
                    },
                    required: ['summary', 'performanceGain', 'stabilityChange'],
                }
            }
        });
        return JSON.parse(getText(response));
    }, [ai]);

    return {
        triageUserIntent,
        generateChatResponse,
        analyzeImage,
        extractPuzzleFeatures,
        classifyPuzzleArchetype,
        generateHeuristicPlan,
        generateConditionalHypothesis,
        verifyHypothesis,
        applySolution,
        analyzeSolverFailureAndProposeImprovements,
        generateHeuristicFromSuccess,
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
        editImage,
        generateVideo,
        generateSonicContent,
        generateMusicalDiceRoll,
        generateDreamPrompt,
        processCurriculumAndExtractFacts,
        analyzePdfWithVision,
        generateNoeticEngram,
        runSandboxSprint,
        extractAxiomsFromFile,
        visualizeInsight,
        generateDocumentOutline,
        generateChapterContent,
        generateProofStepsStream,
        findAnalogiesInKnowledgeGraph,
        findDirectedAnalogy,
        generateSelfImprovementProposalFromResearch,
        proposePersonaModification,
        generateCollaborativePlan,
        generateConceptualProofStrategy,
        analyzeProofStrategy,
        generateDailyChronicle,
        generateGlobalSummary,
        crystallizePrinciples,
        proposePrimitiveAdaptation,
        expandOnText,
        summarizeText,
        generateDiagramFromText,
        reviewSelfProgrammingCandidate,
        translateToQuery,
        formatQueryResult,
        runAutoCodeVGC,
        generateNovelProblemFromSeed,
        estimateProblemDifficulty,
        analyzeArchitectureForWeaknesses,
        generateCrucibleProposal,
        runCrucibleSimulation,
    };
};