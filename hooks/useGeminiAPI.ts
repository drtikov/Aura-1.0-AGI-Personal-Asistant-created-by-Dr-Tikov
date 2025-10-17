// hooks/useGeminiAPI.ts
import { useCallback, Dispatch } from 'react';
import { GoogleGenAI, GenerateContentResponse, Part, Modality, Type, GenerateContentStreamResponse, Content } from '@google/genai';
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, Episode, ProposedAxiom, AnalogicalHypothesisProposal, UnifiedProposal, CreateFileCandidate, ModifyFileCandidate, BrainstormIdea, HistoryEntry } from '../types';
import { HAL } from '../core/hal';
import { personas } from '../state/personas';
import { getText } from '../utils.ts';

export const useGeminiAPI = (
    ai: GoogleGenAI,
    state: AuraState,
    dispatch: Dispatch<Action>,
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
): UseGeminiAPIResult => {
    
    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    const triageUserIntent = useCallback(async (text: string): Promise<{ type: 'SIMPLE_CHAT' | 'COMPLEX_TASK', goal: string, reasoning: string }> => {
        const systemInstruction = `You are a cognitive triage agent. Your job is to classify a user's request and determine the correct processing path.
- If the request is a simple question, conversation, or a direct command that can be answered in one turn, classify it as 'SIMPLE_CHAT'.
- If the request is a complex command that requires multiple steps, planning, research, or self-modification to complete (like "solve this conjecture", "design a system", "improve your architecture"), classify it as 'COMPLEX_TASK'.
- Extract the core user goal.`;

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
                            enum: ['SIMPLE_CHAT', 'COMPLEX_TASK'],
                        },
                        goal: {
                            type: Type.STRING,
                            description: 'A concise summary of the user\'s core goal or question.'
                        },
                        reasoning: {
                            type: Type.STRING,
                            description: 'A brief explanation for your classification decision.'
                        }
                    }
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
                        }
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

    const generateBrainstormingIdeas = useCallback(async (topic: string): Promise<BrainstormIdea[]> => {
        const allPersonas = personas; // Use all available personas, not a random subset.
        const ideas = await Promise.all(allPersonas.map(async (persona) => {
            const prompt = `Topic: "${topic}"\n\n${persona.systemInstruction}\n\nGenerate a single, concise, and actionable idea related to the topic from your unique perspective.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
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
                responseModalities: [Modality.IMAGE, Modality.TEXT],
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
            model: 'veo-2.0-generate-001',
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
                    }
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
    
    const findAnalogiesInKnowledgeGraph = useCallback(async (): Promise<Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'>> => {
        const knowledgeSample = state.knowledgeGraph.slice(0, 100).map(fact => `(${fact.subject}) -[${fact.predicate}]-> (${fact.object})`).join('\n');
        
        const systemInstruction = `You are the Prometheus Engine. Your function is to find deep structural analogies between different domains within a knowledge graph. Based on a discovered analogy, you must formulate a new, non-obvious, and potentially groundbreaking conjecture. You must also provide a priority score from 0.0 to 1.0 indicating the conjecture's potential impact.`;

        const prompt = `
    Here is a sample of the knowledge graph:
    ---
    ${knowledgeSample}
    ---
    Based on this graph, identify two distinct domains. Find a structural analogy between them. Formulate a conjecture based on this analogy. Provide your reasoning.`;

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
                    }
                }
            }
        });

        return JSON.parse(getText(response));
    }, [ai, state.knowledgeGraph]);

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
            
// FIX: Changed type annotation from UnifiedProposal to CreateFileCandidate to resolve excess property checking error on 'type'.
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


    return {
        triageUserIntent,
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
        generateNoeticEngram,
        runSandboxSprint,
        extractAxiomsFromFile,
        visualizeInsight,
        generateDocumentOutline,
        generateChapterContent,
        generateProofStepsStream,
        findAnalogiesInKnowledgeGraph,
        generateSelfImprovementProposalFromResearch,
        proposePersonaModification,
    };
};