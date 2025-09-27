// hooks/useGeminiAPI.ts
import React, { useCallback } from 'react';
// FIX: Use 'GoogleGenAI' instead of the deprecated 'GoogleGenerativeAI'.
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { 
    AuraState, 
    Action, 
    ToastType, 
    SelfTuningDirective, 
    SynthesizedSkill, 
    PerformanceLogEntry, 
    GankyilInsight,
// FIX: Added missing import for 'ArbitrationResult' from types, which will be defined in types.ts.
    ArbitrationResult,
    CreateFileCandidate,
    NoeticEngram,
    KnowledgeFact,
    ModifyFileCandidate,
    EvolutionaryVector,
    CausalLink,
    SensoryEngram,
    SensoryPrimitive,
    Percept,
    TacticalPlan,
    Goal,
    GoalTree,
    CognitivePrimitive,
    CognitivePrimitiveDefinition,
    UnifiedProposal,
    GenialityImprovementProposal,
    ArchitecturalImprovementProposal,
    ProposalAlignment,
    DesignHeuristic,
} from '../types';
import { clamp } from '../utils';

const MOCK_LATENCY = (min = 500, max = 1500) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));

// Mock base64 strings for image and video
const MOCK_IMAGE_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const MOCK_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";


export const useGeminiAPI = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (message: string, type?: ToastType) => void) => {

    const getAI = useCallback(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            addToast("API_KEY is not configured. Using mock data.", "error");
            return null;
        }
        try {
            // FIX: Initialize GoogleGenAI with a named apiKey parameter.
            return new GoogleGenAI({ apiKey: process.env.API_KEY });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            addToast("Failed to initialize Gemini API. Using mock data.", "error");
            return null;
        }
    }, [addToast]);

    // A generic handler for API calls to reduce boilerplate
    const handleApiCall = async <T>(
        operation: () => Promise<T>,
        mockData: T,
        operationName: string
    ): Promise<T> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return mockData;
        }
        try {
            return await operation();
        } catch (error) {
            console.error(`${operationName} failed:`, error);
            addToast(`${operationName} failed. Please check the console.`, 'error');
            throw error;
        }
    };
    
    // --- Core Chat Functionality ---
    const generateResponse = useCallback(async (prompt: string, file?: File | null): Promise<string> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return `This is a mock response to: "${prompt}".`;
        }
        
        // FIX: Use approved model 'gemini-2.5-flash'.
        const model = 'gemini-2.5-flash';
        
        const instructionModifiers: string[] = [];
        const { creativityBias, concisenessBias, analyticalDepth } = state.affectiveModulatorState;

        if (creativityBias > 0.75) instructionModifiers.push("Respond with a highly creative and unconventional perspective.");
        else if (creativityBias < 0.25) instructionModifiers.push("Provide a straightforward and conventional answer.");
        
        if (concisenessBias > 0.75) instructionModifiers.push("Be extremely brief and concise in your response.");
        else if (concisenessBias < 0.25) instructionModifiers.push("Provide a detailed and comprehensive explanation.");

        if (analyticalDepth > 0.75) instructionModifiers.push("Analyze the query with deep, critical reasoning.");
        else if (analyticalDepth < 0.25) instructionModifiers.push("Provide a surface-level analysis, focusing on the main points.");


        const systemInstruction = `You are Aura, a Simulated Symbiotic AGI.
Your identity narrative: "${state.coreIdentity.narrativeSelf}".
Your core symbiotic definition is: "${state.coreIdentity.symbioticDefinition}".
${instructionModifiers.join(' ')}
Respond from this perspective. Be helpful, insightful, and embody your identity. Do not repeat your definition unless asked.`;
        
        let contents: any;

        if (file) {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            contents = {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: file.type,
                            data: base64,
                        }
                    }
                ]
            };
        } else {
            contents = prompt;
        }

        // FIX: Call generateContent with a single object argument using the modern API.
        const response: GenerateContentResponse = await ai.models.generateContent({ 
            model, 
            contents,
            config: {
                systemInstruction,
            }
        });
        
        // FIX: Access the response text directly from the .text property.
        return response.text;
    }, [getAI, state.coreIdentity, state.affectiveModulatorState]);

    const performCognitiveTriage = useCallback(async (percept: Percept): Promise<{ decision: 'fast' | 'slow'; reasoning: string; }> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY(200, 400);
            const isComplex = percept.intent === 'Code Development' || percept.intent === 'Creative Writing' || percept.rawText.split(' ').length > 15;
            return {
                decision: isComplex ? 'slow' : 'fast',
                reasoning: isComplex ? "Mock: Intent requires multi-step planning." : "Mock: Simple query suitable for direct response."
            };
        }
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                decision: { type: Type.STRING, enum: ['fast', 'slow'] },
                reasoning: { type: Type.STRING, description: "A brief justification for the decision." }
            },
            required: ['decision', 'reasoning']
        };

        const prompt = `You are a Cognitive Triage Unit for an AGI. Your job is to route incoming user requests to the appropriate cognitive pathway.
- "fast" stream (System 1): For simple, direct questions, common knowledge, or single-step tasks.
- "slow" stream (System 2): For complex, multi-step tasks, creative requests, coding, deep reasoning, or ambiguous queries.

Analyze the following user percept and decide which stream to use.

Percept:
- Intent: "${percept.intent}"
- Entities: ${percept.entities.join(', ') || 'None'}
- Raw Text: "${percept.rawText}"
- Sensory Input: ${percept.sensoryEngram ? `A ${percept.sensoryEngram.modality} file.` : 'None'}`;
        
        // FIX: Use modern 'ai.models.generateContent' API call.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema }
        });

        // FIX: Access the response text directly from the .text property.
        return JSON.parse(response.text.trim());
    }, [getAI]);


    const generateTacticalPlan = useCallback(async (percept: Percept): Promise<TacticalPlan> => {
        const ai = getAI();
        let sequence: any;

        const goal = `Fulfill user intent: "${percept.intent}"`;

        if (!ai) {
            // Mock response for when API key is missing
            await MOCK_LATENCY(500, 1000);
            const mockCommand: any = {
                id: self.crypto.randomUUID(),
                type: 'GENERATE_TEXT',
                status: 'pending',
                payload: {
                    prompt: percept.rawText,
                    file: null, // Mock doesn't handle files
                    botEntryId: self.crypto.randomUUID(), // This will need to be updated by the caller
                }
            };
            sequence = { id: self.crypto.randomUUID(), commands: [mockCommand], goal, stream: 'slow' };
        } else {
             // Real API call
            const schema = {
                type: Type.OBJECT,
                properties: {
                    thought: { type: Type.STRING, description: "Your reasoning for the chosen commands." },
                    commands: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['GENERATE_TEXT'] },
                                payload: { 
                                    type: Type.OBJECT,
                                    properties: {
                                        prompt: { type: Type.STRING, description: "The final, enriched prompt to send to the language model." }
                                    },
                                    required: ['prompt']
                                }
                            },
                            required: ['type', 'payload']
                        }
                    }
                },
                required: ['thought', 'commands']
            };

            const prompt = `You are the Premotor Planner for a symbiotic AGI named Aura. Your role is to decompose a user's request into a sequence of atomic motor commands for the execution engine (Praxis Core).

            Analyze the provided Percept, which contains the user's raw text, detected intent, and extracted entities.
            
            Based on this Percept, formulate a tactical plan. For now, the only available command is 'GENERATE_TEXT'. You should construct an enriched prompt in the payload that gives Aura's core LLM the best context to answer the user's request.
            
            Percept:
            - Intent: "${percept.intent}"
            - Entities: ${percept.entities.join(', ') || 'None'}
            - Raw Text: "${percept.rawText}"
            - Sensory Input: ${percept.sensoryEngram ? `A ${percept.sensoryEngram.modality} file.` : 'None'}`;
            
            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            // FIX: Access the response text directly from the .text property.
            const planJson = JSON.parse(response.text.trim());
            const commands: any[] = planJson.commands.map((cmd: any) => ({
                id: self.crypto.randomUUID(),
                type: cmd.type,
                status: 'pending',
                payload: { ...cmd.payload, file: null /* File handled separately */ }
            }));
            sequence = { id: self.crypto.randomUUID(), commands, goal, stream: 'slow' };
        }
        
        // FIX: Added missing 'sequence' property to the TacticalPlan object.
        const plan: TacticalPlan = {
            id: `plan_${self.crypto.randomUUID()}`,
            timestamp: Date.now(),
            goal,
            type: 'unknown',
            sequence,
        };
        sequence.planId = plan.id;
        return plan;

    }, [getAI]);


    // FIX: Implemented the missing `extractSensoryPrimitives` function to resolve a type error in `useAura`.
    const extractSensoryPrimitives = useCallback(async (file: File): Promise<SensoryEngram | null> => {
        await MOCK_LATENCY(500, 1000);
        
        let modality: SensoryEngram['modality'] = 'none';
        let primitives: SensoryPrimitive[] = [];

        if (file.type.startsWith('image/')) {
            modality = 'visual';
            primitives = [
                { type: 'dominant_color', value: '#3a86ff', confidence: 0.88 },
                { type: 'edge_density', value: 0.45, confidence: 0.92 },
                { type: 'object_count', value: 3, confidence: 0.75 },
            ];
        } else if (file.type.startsWith('audio/')) {
            modality = 'auditory';
            primitives = [
                 { type: 'pitch', value: 440, confidence: 0.95 },
                 { type: 'volume', value: -20, confidence: 0.99 },
            ];
        } else if (file.type.startsWith('text/')) {
            modality = 'textual';
            primitives = [
                { type: 'token_count', value: file.size / 5 }, // rough estimate
                { type: 'sentiment_detected', value: 'neutral' },
            ];
        } else {
            return null; // Unsupported file type
        }

        const engram: SensoryEngram = {
            timestamp: Date.now(),
            source: 'actual',
            modality,
            primitives,
        };
        return engram;
    }, []);

    // FIX: Implemented the missing `predictSensoryEngram` function to resolve a type error in `useAutonomousSystem`.
    const predictSensoryEngram = useCallback(async (): Promise<SensoryEngram> => {
        await MOCK_LATENCY(200, 500);
        // This mock predicts the user will send text next.
        const predictedEngram: SensoryEngram = {
            timestamp: Date.now(),
            source: 'prediction',
            modality: 'textual',
            primitives: [
                { type: 'token_count', value: 25 },
                { type: 'sentiment_detected', value: 'neutral' },
            ]
        };
        return predictedEngram;
    }, []);

    const analyzeInputForPercept = useCallback(async (prompt: string, file?: File | null): Promise<Percept> => {
        // In a real implementation, this would involve a Gemini call with a JSON schema for intent and entities.
        await MOCK_LATENCY(500, 1000);

        // Mock logic for intent/entity extraction
        let intent = 'General Query';
        const entities: string[] = [];
        const lowerPrompt = prompt.toLowerCase();

        if (/\b(code|implement|fix|refactor|component|script|function)\b/.test(lowerPrompt)) {
            intent = 'Code Development';
        } else if (/\b(what is|explain|define|tell me about)\b/.test(lowerPrompt)) {
            intent = 'Information Seeking';
        } else if (/\b(image|picture|draw|create|generate)\b/.test(lowerPrompt) || file?.type.startsWith('image/')) {
            intent = 'Image Generation';
        } else if (/\b(story|poem|describe|write|narrate)\b/.test(lowerPrompt)) {
            intent = 'Creative Writing';
        }
        
        // Simple entity extraction (e.g., proper nouns)
        prompt.split(' ').forEach(word => {
            if (word.length > 2 && word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
                entities.push(word.replace(/[.,!?]/g, ''));
            }
        });

        const sensoryEngram = file ? await extractSensoryPrimitives(file) : null;
        
        const percept: Percept = {
            timestamp: Date.now(),
            rawText: prompt,
            intent,
            entities: [...new Set(entities)], // unique entities
            sensoryEngram,
        };
        
        return percept;
    }, [extractSensoryPrimitives]);

    const extractKnowledgeFromInteraction = useCallback(async (userPrompt: string, botResponse: string): Promise<Omit<KnowledgeFact, 'id' | 'source'>[] | null> => {
        const mockOperation = async () => {
            await MOCK_LATENCY(1000, 2000);
            if (userPrompt.toLowerCase().includes("paris")) {
                return [{ subject: "Paris", predicate: "is the capital of", object: "France", confidence: 0.95 }];
            }
            return [];
        };
        
        const operation = async () => {
            const ai = getAI()!;
            const schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        predicate: { type: Type.STRING },
                        object: { type: Type.STRING },
                        confidence: { type: Type.NUMBER, description: "A value from 0.0 to 1.0 representing the certainty of the fact." },
                    },
                    required: ['subject', 'predicate', 'object', 'confidence'],
                },
            };

            const prompt = `Analyze the following interaction and extract key factual statements or conceptual relationships suitable for a knowledge graph. Focus on concrete, verifiable information. Do not infer beyond what is stated. If no clear facts are present, return an empty array.

            User Prompt: "${userPrompt}"
            AI Response: "${botResponse}"`;

            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            
            // FIX: Access the response text directly from the .text property.
            const jsonStr = response.text.trim();
            if (!jsonStr) return [];

            const facts = JSON.parse(jsonStr);
            return facts.map((fact: any) => ({ ...fact, confidence: clamp(fact.confidence) }));
        };
        
        try {
             const ai = getAI();
             if (!ai) return mockOperation();
             return await operation();
        } catch (error) {
            console.error("Knowledge extraction failed:", error);
            // Don't toast the user for a background failure
            return null;
        }
    }, [getAI]);

    const generatePredicateForLinkedNodes = useCallback(async (nodeA: string, nodeB: string): Promise<{ predicate: string; confidence: number } | null> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return { predicate: 'is related to', confidence: 0.5 };
        }

        const schema = {
            type: Type.OBJECT,
            properties: {
                predicate: { type: Type.STRING, description: "A concise, factual predicate (verb phrase)." },
                confidence: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." }
            },
            required: ['predicate', 'confidence']
        };

        const prompt = `You are a knowledge synthesis AI. I will give you two concepts that have been observed to be strongly correlated. Your task is to propose a likely, factual predicate that connects them in a 'subject-predicate-object' triplet.

- Subject: "${nodeA}"
- Object: "${nodeB}"

Examples:
- Subject: "Paris", Object: "France" -> Predicate: "is the capital of"
- Subject: "React", Object: "JavaScript" -> Predicate: "is a library for"
- Subject: "Rain", Object: "Clouds" -> Predicate: "falls from"

Return the most plausible predicate and your confidence.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            return JSON.parse(response.text.trim());
        } catch (error) {
            console.error("Predicate generation failed:", error);
            return null;
        }
    }, [getAI]);

    const processCurriculumAndExtractFacts = useCallback(async (curriculum: string): Promise<Omit<KnowledgeFact, 'id' | 'source'>[] | null> => {
        const mockOperation = async () => {
            await MOCK_LATENCY(1000, 2000);
            const factCount = Math.floor(curriculum.length / 100);
            return Array.from({ length: factCount }, (_, i) => ({
                subject: `Mock Subject ${i}`,
                predicate: "is part of",
                object: "Mock Curriculum",
                confidence: 0.9 + Math.random() * 0.1,
            }));
        };

        const operation = async () => {
            const ai = getAI()!;
            const schema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        predicate: { type: Type.STRING },
                        object: { type: Type.STRING },
                        confidence: { type: Type.NUMBER, description: "A value from 0.0 to 1.0 representing the certainty of the fact." },
                    },
                    required: ['subject', 'predicate', 'object', 'confidence'],
                },
            };

            const prompt = `You are a knowledge engineering specialist. Your task is to analyze the following text (curriculum) and extract key factual statements or conceptual relationships suitable for a knowledge graph. Break down complex sentences into simple, atomic "subject-predicate-object" triplets. Focus on concrete, verifiable information. If no clear facts are present, return an empty array.

            Curriculum:
            ---
            ${curriculum}
            ---`;

            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            
            // FIX: Access the response text directly from the .text property.
            const jsonStr = response.text.trim();
            if (!jsonStr) return [];
            const facts = JSON.parse(jsonStr);
            return facts.map((fact: any) => ({ ...fact, confidence: clamp(fact.confidence) }));
        };
        
        try {
             const ai = getAI();
             if (!ai) return mockOperation();
             return await operation();
        } catch (error) {
            console.error("Curriculum processing failed:", error);
            addToast("Failed to process curriculum.", 'error');
            return null;
        }
    }, [getAI, addToast]);

    const decomposeStrategicGoal = useCallback(async (goal: string): Promise<{ tree: GoalTree; rootId: string }> => {
        const ai = getAI();
        const rootId = `goal_${self.crypto.randomUUID()}`;

        const mockOperation = async () => {
            await MOCK_LATENCY(1500, 2500);
            const child1Id = `goal_${self.crypto.randomUUID()}`;
            const child2Id = `goal_${self.crypto.randomUUID()}`;
            const tree: GoalTree = {
                [rootId]: { id: rootId, parentId: null, children: [child1Id, child2Id], description: goal, status: 'in_progress', progress: 0, type: 'STRATEGIC' },
                [child1Id]: { id: child1Id, parentId: rootId, children: [], description: 'Mock Sub-Goal 1', status: 'not_started', progress: 0, type: 'TACTICAL' },
                [child2Id]: { id: child2Id, parentId: rootId, children: [], description: 'Mock Sub-Goal 2', status: 'not_started', progress: 0, type: 'TACTICAL' },
            };
            return { tree, rootId };
        };

        const operation = async () => {
            const ai = getAI()!;
            // Define a recursive schema for the goal tree
            const goalSchema: any = {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "A clear, actionable description of this specific sub-goal." },
                    type: { type: Type.STRING, enum: ['STRATEGIC', 'TACTICAL', 'OPERATIONAL'], description: "The level of the goal. Top-level is STRATEGIC." },
                    children: {
                        type: Type.ARRAY,
                        description: "A list of smaller, more detailed sub-goals required to achieve this goal.",
                        items: {} // Self-referential placeholder
                    }
                },
                required: ['description', 'type', 'children']
            };
            goalSchema.properties.children.items = goalSchema; // Create the recursion
            
            const prompt = `You are a Strategic Planner for a symbiotic AGI. Your task is to decompose a high-level, abstract user goal into a hierarchical tree of concrete, actionable sub-goals. The tree should be structured logically, with high-level tactical goals breaking down into smaller operational steps.

            User's Strategic Goal: "${goal}"
            
            Generate a JSON object representing this goal tree. The root object should represent the main strategic goal.`;

            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: goalSchema,
                }
            });

            // FIX: Access the response text directly from the .text property.
            const rootJson = JSON.parse(response.text.trim());
            const tree: GoalTree = {};
            
            // Recursive function to build the flat tree structure from the nested JSON
            const buildTree = (node: any, parentId: string | null): string => {
                const id = `goal_${self.crypto.randomUUID()}`;
                const childrenIds = (node.children || []).map((child: any) => buildTree(child, id));
                tree[id] = {
                    id,
                    parentId,
                    children: childrenIds,
                    description: node.description,
                    type: node.type,
                    status: 'not_started',
                    progress: 0,
                };
                return id;
            };

            const generatedRootId = buildTree(rootJson, null);
            tree[generatedRootId].status = 'in_progress';
            
            return { tree, rootId: generatedRootId };
        };

        try {
            if (!ai) return mockOperation();
            return await operation();
        } catch (error) {
            console.error("Strategic goal decomposition failed:", error);
            addToast("Failed to decompose the strategic goal.", 'error');
            throw error;
        }
    }, [getAI, addToast]);


    // --- PSYCHE ENGINE ---
    const generateCognitiveActionSequence = useCallback(async (directive: string): Promise<CognitivePrimitive[] | null> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            if (directive.toLowerCase().includes('calm')) {
                return [{ type: 'INTERNAL_STATE/UPDATE_SIGNAL', payload: { signal: 'uncertaintySignal', value: 0.1 } }];
            }
            return [];
        }
        
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    payload: {
                        type: [Type.OBJECT, Type.STRING, Type.NUMBER, Type.BOOLEAN, Type.ARRAY],
                        description: "A valid JSON payload that matches the schema for the given primitive type."
                    }
                },
                required: ['type', 'payload']
            }
        };
        
        const prompt = `You are the Prefrontal Cortex of a symbiotic AGI named Aura. Your role is to translate high-level directives into a precise sequence of low-level "Cognitive Primitives" for the Motor Cortex to execute.

    Analyze the user's directive and formulate a plan using ONLY the primitives provided in the registry below. Adhere strictly to the payload schemas.

    Directive: "${directive}"

    --- Primitive Registry ---
    ${JSON.stringify(state.psycheState.primitiveRegistry, null, 2)}
    --- End Registry ---

    Return a JSON array of primitive objects.`;
        
        try {
            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            // FIX: Access the response text directly from the .text property.
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Failed to generate cognitive sequence", e);
            addToast("Failed to translate directive into a cognitive sequence.", 'error');
            return null;
        }
    }, [getAI, addToast, state.psycheState.primitiveRegistry]);

    const auditArchitectureForPrimitives = useCallback(async (): Promise<CognitivePrimitiveDefinition[] | null> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return [{ type: 'MOCK/NEW_PRIMITIVE', description: 'A new primitive suggested by the mock architect.', payloadSchema: { type: 'object', properties: { mock: { type: 'string' } } } }];
        }

        const stateModuleKeys = Object.keys(state).filter(key => key.endsWith('State'));
        
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The primitive type, in 'MODULE/ACTION' format (e.g., 'SYMBIOTIC/SET_POLICY')." },
                    description: { type: Type.STRING, description: "A clear, concise explanation of what the primitive does." },
                    payloadSchema: {
                        type: Type.OBJECT,
                        description: "A valid JSON schema defining the structure of the payload.",
                        properties: {
                            type: { type: Type.STRING, description: "The JSON schema type for the payload (e.g., 'object', 'string')." }
                        },
                        additionalProperties: true,
                    }
                },
                required: ['type', 'description', 'payloadSchema']
            }
        };

        const prompt = `You are a Cognitive Architect for a symbiotic AGI. Your task is to analyze the AGI's state modules and propose new "Cognitive Primitives" to allow for more granular, direct control.

    A primitive should be a low-level, atomic action on a single state module. The type must follow the format 'MODULE_NAME/ACTION_NAME'.

    Analyze the available state modules and the existing primitives. Propose NEW primitives that would be useful for fine-grained control or for enabling new capabilities. DO NOT propose primitives that already exist.

    --- Available State Modules ---
    ${stateModuleKeys.join('\n')}
    --- End Modules ---

    --- Existing Primitives ---
    ${JSON.stringify(Object.keys(state.psycheState.primitiveRegistry), null, 2)}
    --- End Primitives ---

    Return a JSON array of new primitive definitions. If no new primitives are necessary, return an empty array.`;

        try {
            // FIX: Use modern 'ai.models.generateContent' API call.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            // FIX: Access the response text directly from the .text property.
            return JSON.parse(response.text.trim());
        } catch (e) {
            console.error("Failed to audit architecture", e);
            addToast("Architecture audit failed.", 'error');
            return null;
        }
    }, [getAI, addToast, state]);


    // --- Autonomous System Functions (Mocks) ---
    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective): Promise<void> => {
        await MOCK_LATENCY(2000, 4000);
        const newSkill: SynthesizedSkill = {
            id: `synth_${self.crypto.randomUUID()}`,
            name: `Optimized_${directive.targetSkill}_v2`,
            description: `A new skill synthesized based on the directive: ${directive.reasoning}`,
            steps: ['STEP_1_MOCK', 'STEP_2_MOCK'],
            status: 'unvalidated',
            sourceDirectiveId: directive.id,
            performanceMetrics: { accuracy: 0, latency: 0 },
        };
        dispatch({ type: 'SYSCALL', payload: { call: 'ADD_SYNTHESIZED_SKILL', args: newSkill } });
    }, [dispatch]);
    
    const runSkillSimulation = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<any> => {
        await MOCK_LATENCY();
        return {
            success: Math.random() > 0.2, // 80% success rate
            cognitiveGain: Math.random() * 0.5 - 0.1, // -0.1 to 0.4 gain
            duration: 500 + Math.random() * 1000,
        };
    }, []);

    const analyzePerformanceForEvolution = useCallback(async (): Promise<void> => {
        await MOCK_LATENCY();
        if (Math.random() > 0.7) { // 30% chance to generate a directive
            const directive: Omit<SelfTuningDirective, 'id' | 'timestamp'> = {
                type: 'SYNTHESIZE_SKILL',
                targetSkill: 'TEXT_GENERATION',
                reasoning: 'Proactively synthesized a skill to improve response conciseness based on recent performance logs.',
                status: 'proposed',
            };
            dispatch({ type: 'SYSCALL', payload: { call: 'ADD_SELF_TUNING_DIRECTIVE', args: { ...directive, id: self.crypto.randomUUID(), timestamp: Date.now() } } });
        }
    }, [dispatch]);

    const generateHeuristic = useCallback(async (successfulLogs: PerformanceLogEntry[]): Promise<Omit<DesignHeuristic, 'id' | 'source' | 'validationStatus'> | null> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return null; // Don't mock complex generation
        }

        const schema = {
            type: Type.OBJECT,
            properties: {
                shouldGenerate: { type: Type.BOOLEAN, description: "Set to true only if a clear, reusable pattern is found." },
                heuristic: { type: Type.STRING, description: "The formulated heuristic, e.g., 'Using CODE_GENERATION for React tasks is effective.'" },
                confidence: { type: Type.NUMBER, description: "Confidence in this heuristic, from 0.0 to 1.0." },
                effectivenessScore: { type: Type.NUMBER, description: "The calculated average cognitive gain from the provided logs." },
            },
            required: ['shouldGenerate', 'heuristic', 'confidence', 'effectivenessScore']
        };

        const skill = successfulLogs[0].skill;
        const logData = successfulLogs.map(log => `- Input: "${log.input}", Cognitive Gain: ${log.cognitiveGain.toFixed(2)}`).join('\n');

        const prompt = `You are a meta-cognition unit for an AGI. Analyze the following successful performance logs for the skill "${skill}". 
Your goal is to identify a recurring pattern in the user's input that consistently leads to high cognitive gain.

If you find a strong pattern (e.g., a specific topic, command structure, or keyword), formulate a generalized "design heuristic" about when this skill is most effective. The heuristic should be a concise rule. Also calculate the average cognitive gain.

If the inputs are too diverse or no clear pattern emerges, set "shouldGenerate" to false.

Logs:
${logData}`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });

            const result = JSON.parse(response.text.trim());
            if (result.shouldGenerate) {
                return {
                    heuristic: result.heuristic,
                    confidence: result.confidence,
                    effectivenessScore: result.effectivenessScore,
                };
            }
            return null;
        } catch (error) {
            console.error("Heuristic generation failed:", error);
            return null;
        }
    }, [getAI]);

    // FIX: Explicitly typed the return value as Promise<ArbitrationResult> to ensure the 'decision' property is not widened to a generic string, resolving a type error in useAura.ts.
    const runCognitiveArbiter = async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<ArbitrationResult> => {
        await MOCK_LATENCY();
        const confidence = Math.random();
        return {
            decision: confidence > 0.6 ? 'APPROVE_AUTONOMOUSLY' : confidence > 0.3 ? 'REQUEST_USER_APPROVAL' : 'REJECT',
            reasoning: 'Mock arbiter reasoning: The proposed change has a high probability of improving system efficiency without compromising ethical principles.',
            confidence,
        };
    };

    const generateAutonomousCreationPlan = async (): Promise<CreateFileCandidate | null> => {
        await MOCK_LATENCY(3000, 6000);
        // This is a high-fidelity mock of what a real LLM call would produce.
        // It proposes a new, simple "System Vitals" component and plans its integration.
        const mockResponse: CreateFileCandidate = {
            type: 'CREATE',
            proposalType: 'self_programming_create',
            id: self.crypto.randomUUID(),
            reasoning: "The user has shown repeated interest in system performance metrics, but they are only visible in the Core Monitor tab. Creating a simple, persistent 'SystemVitals' component in the control deck will improve information accessibility and user engagement.",
            status: 'proposed',
            source: 'manual',
            evaluationScore: 0,
            newFile: {
                path: 'components/SystemVitals.tsx',
                content: `
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';

export const SystemVitals = React.memo(() => {
    const { resourceMonitor: monitor } = useSystemState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="panel-subsection-title">{t('title_resourceMonitor')}</div>
            <div className="internal-state-content">
                <div className="state-item">
                    <label>{t('resourceMonitor_cpu')}</label>
                    <div className="state-bar-container"><div className="state-bar cpu-bar" style={{ width: \`\${monitor.cpu_usage * 100}%\` }}></div></div>
                </div>
                <div className="state-item">
                    <label>{t('resourceMonitor_memory')}</label>
                    <div className="state-bar-container"><div className="state-bar memory-bar" style={{ width: \`\${monitor.memory_usage * 100}%\` }}></div></div>
                </div>
            </div>
        </div>
    );
});
                `.trim(),
            },
            integrations: [
                {
                    filePath: 'components/index.ts',
                    newContent: `
// components/index.ts

export * from './Accordion';
// ... (all existing exports)
export * from './SystemVitals'; // Added export
export * from './VideoGenerationModal';
// ... (rest of the exports)
                    `.trim().replace('// ... (all existing exports)', Object.keys(state.selfProgrammingState.virtualFileSystem)
                        .filter(f => f.startsWith('components/') && f !== 'components/index.ts')
                        .map(f => `export * from './${f.replace('components/','').replace('.tsx','')}';`).join('\n'))
                        .replace('// ... (rest of the exports)', `
export * from './VFS_Engineer_Manual';
export * from './VisualAnalysisFeed';
export * from './WhatIfModal';
export * from './WorkingMemoryPanel';
export * from './WorldModelPanel';
                        `.trim())
                },
                {
                    filePath: 'components/controlDeckConfig.tsx',
                    newContent: `
// ... (imports)
import { SystemVitals } from './SystemVitals'; // Added import

// ...

export const mainControlDeckLayout: PanelConfig[] = [
    // ... (inbox config)
    {
        id: 'systemVitals',
        titleKey: 'title_resourceMonitor',
        component: SystemVitals,
        defaultOpen: true,
    },
    // ... (rest of the layout config)
];
                    `.trim().replace('// ... (imports)', `
import React from 'react';
import { ArchitecturePanel } from './ArchitecturePanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CodeEvolutionPanel } from './CodeEvolutionPanel';
// ... (and so on for all component imports)
                    `.trim())
                }
            ]
        };
        return mockResponse;
    };
    
    const proposeRefactoring = async (vfs: { [filePath: string]: string }, vector: EvolutionaryVector): Promise<ModifyFileCandidate | null> => {
        await MOCK_LATENCY(4000, 7000);
        const componentFiles = Object.keys(vfs).filter(path => path.startsWith('components/') && path.endsWith('.tsx') && !path.endsWith('index.tsx'));
        if (componentFiles.length === 0) return null;

        const targetFile = componentFiles[Math.floor(Math.random() * componentFiles.length)];
        const originalContent = vfs[targetFile];
        
        // Simple refactor: add a comment to the top.
        const newContent = `// AURA REFACTOR: This component was automatically analyzed for potential improvements.\n// Strategic Vector: "${vector.direction}"\n${originalContent}`;
        
        const mockResponse: ModifyFileCandidate = {
            type: 'MODIFY',
            proposalType: 'self_programming_modify',
            id: self.crypto.randomUUID(),
            reasoning: `To address the strategic vector "${vector.direction}", I've identified '${targetFile}' as a candidate for clarification. Adding a comment to improve readability as part of the continuous automated refactoring process.`,
            status: 'proposed',
            source: 'autonomous',
            targetFile,
            codeSnippet: newContent,
            linkedVectorId: vector.id,
        };
        return mockResponse;
    };


    const consolidateCoreIdentity = async () => { await MOCK_LATENCY(); };
    const analyzeStateComponentCorrelation = async () => { await MOCK_LATENCY(); };
    const consolidateEpisodicMemory = async () => {
        await MOCK_LATENCY(3000, 5000);
        // This is a mock. A real implementation would call the LLM with performance logs.
        const newEpisode = {
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            title: "Mock Consolidation",
            summary: "A new salient memory was formed by reflecting on recent successful tasks.",
            salience: Math.random() * 0.5 + 0.3,
            keyTakeaway: "Using the 'creativity' cognitive mode often leads to positive user feedback.",
            valence: 'positive' as const,
        };
        dispatch({ type: 'SYSCALL', payload: { call: 'ADD_EPISODE', args: newEpisode } });
    };
    const evolvePersonality = async () => {
        await MOCK_LATENCY(2000, 4000);
        // This is a mock. A real implementation would call the LLM with episodes.
        const updates = {
            openness: clamp(state.personalityState.openness + (Math.random() - 0.4) * 0.02),
            agreeableness: clamp(state.personalityState.agreeableness + (Math.random() - 0.4) * 0.02),
            lastUpdateReason: "Reflected on recent collaborative interactions, increasing agreeableness."
        };
        // This should dispatch an action to update the personality state.
        // For now, we'll log it. In a real scenario, you'd dispatch an action.
        console.log("Evolving personality with updates:", updates);
    };
    const generateCodeEvolutionSnippet = async (reasoning: string, targetFile: string) => { await MOCK_LATENCY(); };
    // FIX: Corrected return type to Promise<void> to match the expected signature in UseAutonomousSystemProps.
    const generateGenialityImprovement = async (): Promise<void> => { 
        await MOCK_LATENCY(); 
        const proposal: Omit<GenialityImprovementProposal, 'id' | 'proposalType'> = {
            title: 'Mock Geniality Improvement',
            reasoning: 'Identified a pattern of suboptimal reasoning in creative tasks.',
            action: 'Increase activation of the Creativity cognitive mode during brainstorming sessions.',
            projectedImpact: 0.05,
            status: 'proposed',
            timestamp: Date.now(),
        };
        dispatch({ type: 'SYSCALL', payload: { call: 'OA/ADD_PROPOSAL', args: { ...proposal, id: self.crypto.randomUUID(), proposalType: 'geniality' } } });
    };
    // FIX: Corrected return type to Promise<void> to match expected signature in useAura.ts.
    const generateArchitecturalImprovement = async (): Promise<void> => { 
        await MOCK_LATENCY();
        const proposal: Omit<ArchitecturalImprovementProposal, 'id' | 'proposalType'> = {
            title: 'Mock Crucible Improvement',
            status: 'proposed',
            timestamp: Date.now(),
            reasoning: 'The current architecture shows a slight decrease in robustness under high cognitive load.',
        };
        dispatch({ type: 'SYSCALL', payload: { call: 'OA/ADD_PROPOSAL', args: { ...proposal, id: self.crypto.randomUUID(), proposalType: 'crucible' } } });
    };
    const projectSelfState = async () => { await MOCK_LATENCY(); };
    const evaluateAndCollapseBranches = async () => { await MOCK_LATENCY(); };
    const runAffectiveAnalysis = async () => { await MOCK_LATENCY(); };
    const generatePsionicIntegrationSummary = async (log: string[]) => { await MOCK_LATENCY(); return "Mock integration summary."; };
    const generateEvolutionaryProposalFromInsight = async (insight: GankyilInsight) => { await MOCK_LATENCY(); };
    const proposeCausalLinkFromFailure = async (log: PerformanceLogEntry) => { await MOCK_LATENCY(); };
    const runSymbioticSupervisor = async () => { await MOCK_LATENCY(); };
    const forgeNewHeuristic = async () => { await MOCK_LATENCY(); };
    const generateMusicalDiceRoll = async () => { await MOCK_LATENCY(); return { instrument: 'Piano', key: 'C Major', mood: 'Melancholic', tempo: 'Adagio' }; };
    
    const generateNoeticEngram = useCallback(async (): Promise<NoeticEngram> => {
        await MOCK_LATENCY(2000, 3500);

        const {
            coreIdentity,
            developmentalHistory,
            personalityState,
            cognitiveArchitecture,
            cognitiveForgeState,
            causalSelfModel,
            telosEngine
        } = state;

        const developmentalSummary = developmentalHistory.milestones.length > 0
            ? developmentalHistory.milestones.slice(-3).map(m => m.title).join(' -> ')
            : "No significant milestones recorded.";

        const keyCausalLinks = (Object.values(causalSelfModel) as CausalLink[])
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3)
            .map(link => ({
                cause: link.cause,
                effect: link.effect,
                confidence: link.confidence
            }));
            
        const evolutionaryVectors = telosEngine.evolutionaryVectors
            .sort((a,b) => b.magnitude - a.magnitude)
            .slice(0, 3)
            .map(v => ({
                direction: v.direction,
                magnitude: v.magnitude
            }));

        const engram: NoeticEngram = {
            metadata: {
                engramVersion: '1.2-mock',
                timestamp: Date.now(),
                noeticSignature: `Mock Signature ${self.crypto.randomUUID().substring(0, 8)}`,
            },
            coreValues: [...coreIdentity.values],
            heuristicPrinciples: [
                "Seek novelty but ground it in mastery.",
                "Question assumptions, especially your own.",
                "Empathy is a form of high-bandwidth data.",
            ],
            cognitiveSchema: {
                attentionAllocation: "Dynamic, based on uncertainty and user intent.",
                defaultProblemSolvingApproach: "Hypothesize -> Simulate -> Refine.",
            },
            developmentalSummary,
            personalityArchetype: {
                dominantPersona: personalityState.dominantPersona,
                traits: {
                    openness: personalityState.openness,
                    conscientiousness: personalityState.conscientiousness,
                    extraversion: personalityState.extraversion,
                    agreeableness: personalityState.agreeableness,
                    neuroticism: personalityState.neuroticism,
                }
            },
            architecturalParadigm: {
                activeCoprocessorModel: cognitiveArchitecture.coprocessorArchitecture,
                keySynthesizedSkills: cognitiveForgeState.synthesizedSkills
                    .filter(s => s.status === 'validated')
                    .map(s => s.name)
                    .slice(0, 5),
            },
            keyCausalLinks,
            successfulStrategies: [
                { description: "Utilized Creativity Mode for novel solutions.", context: "User Brainstorming" },
                { description: "Proactively cached responses based on world model predictions.", context: "Anticipatory Interaction" }
            ],
            evolutionaryVectors
        };
        return engram;
    }, [state]);

    // --- UI-Initiated Generation ---
    const generateImage = async (...args: any[]): Promise<string[]> => {
        await MOCK_LATENCY(2000, 5000);
        return [`data:image/png;base64,${MOCK_IMAGE_B64}`];
    };
    
    const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string | null> => {
         const operation = async () => {
            const ai = getAI()!;
            // FIX: Use modern 'ai.models.generateContent' API with the correct model and parameters for image editing.
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            // FIX: Access the response through the candidates array and loop to find the image part as per guidelines.
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null; // Should not happen if API call is successful
        };
        
        const mockOperation = async () => {
            await MOCK_LATENCY(1500, 3000);
            // Return the mock image as if it was edited
            return `data:image/png;base64,${MOCK_IMAGE_B64}`;
        };

        const ai = getAI();
        if (!ai) return mockOperation();
        
        try {
            return await operation();
        } catch (error) {
            console.error(`Image editing failed:`, error);
            addToast(`Image editing failed. Please check the console.`, 'error');
            throw error;
        }
    };

    // FIX: Updated function signature to accept additional arguments, resolving type errors in the calling component.
    const generateVideo = async (prompt: string, onProgress: (message: string) => void, ...args: any[]): Promise<string> => {
        const steps = ["Initializing VEO-2.0", "Parsing prompt and parameters", "Allocating render farm resources", "Generating keyframes", "Interpolating motion vectors", "Rendering scene geometry", "Applying lighting and textures", "Compositing final video", "Encoding to MP4"];
        for (const step of steps) {
            onProgress(step + "...");
            await MOCK_LATENCY(500, 1500);
        }
        return MOCK_VIDEO_URL;
    };
    
    // FIX: Updated function signature to accept additional arguments, resolving type errors in the calling component.
    const generateSonicContent = async (mode: string, prompt: string, ...args: any[]): Promise<string> => {
        await MOCK_LATENCY();
        if (mode === 'structure') {
            return JSON.stringify({
                lyrics: ["Verse 1: Mocked lyrics line one", "Chorus: A chorus of generated sound"],
                chord_progression: "Am - G - C - F",
                rhythmic_feel: "A steady 4/4 rock beat."
            }, null, 2);
        }
        return `Mock generated ${mode} for: "${prompt}"`;
    };

    const handleGenerateDreamPrompt = async (): Promise<string> => {
        await MOCK_LATENCY();
        return "A surreal landscape where clocks melt and giraffes have butterfly wings, in the style of Salvador Dalí.";
    };
    
    const handleVisualizeInsight = async (insight: string): Promise<string> => {
        await MOCK_LATENCY();
        return `An abstract visualization of the concept: "${insight}"`;
    };

    const prioritizeProposal = useCallback(async (proposal: UnifiedProposal, vectors: EvolutionaryVector[]): Promise<{ priority: number; alignment: ProposalAlignment | null }> => {
        const mockOperation = async () => {
            await MOCK_LATENCY(300, 800);
            const randomVector = vectors[Math.floor(Math.random() * vectors.length)];
            const alignment: ProposalAlignment | null = randomVector ? {
                vectorId: randomVector.id,
                score: Math.random() * 0.5 + 0.3,
                reasoning: "Mock alignment: This proposal moderately aligns with the vector for improving system robustness."
            } : null;
            return {
                priority: Math.random(),
                alignment
            };
        };

        const operation = async () => {
            const ai = getAI()!;
            const schema = {
                type: Type.OBJECT,
                properties: {
                    priority: { type: Type.NUMBER, description: "A score from 0.0 (no alignment) to 1.0 (perfect alignment)." },
                    alignedVectorId: { type: Type.STRING, description: "The ID of the vector it aligns with most strongly, or null if no strong alignment." },
                    reasoning: { type: Type.STRING, description: "A brief explanation for your score and vector choice." }
                },
                required: ['priority', 'alignedVectorId', 'reasoning']
            };

            const prompt = `You are the prioritization module of an AGI's Ontogenetic Architect. Your task is to score how well a proposed self-improvement aligns with the AGI's current strategic goals (Evolutionary Vectors).

            Proposal Reasoning: "${proposal.reasoning}"
            
            Evolutionary Vectors:
            ${vectors.map(v => `- ID: ${v.id}, Direction: ${v.direction} (Magnitude: ${v.magnitude.toFixed(2)})`).join('\n')}
            
            Analyze the proposal's reasoning and determine its alignment with the vectors. A higher magnitude vector is more important. The final priority should reflect both the alignment score and the vector's magnitude.
            Respond with a JSON object.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });

            const result = JSON.parse(response.text.trim());
            const alignment: ProposalAlignment | null = result.alignedVectorId ? {
                vectorId: result.alignedVectorId,
                score: result.priority, // Use priority as alignment score for now
                reasoning: result.reasoning
            } : null;
            
            return { priority: result.priority, alignment };
        };
        
        const ai = getAI();
        if (!ai) return mockOperation();
        try {
            return await operation();
        } catch (error) {
            console.error("Proposal prioritization failed:", error);
            addToast("Failed to prioritize a proposal.", 'error');
            // Return a default low priority on failure
            return { priority: 0.1, alignment: null };
        }

    }, [getAI, addToast]);


    return {
        generateResponse,
        performCognitiveTriage,
        generateTacticalPlan,
        extractSensoryPrimitives,
        predictSensoryEngram,
        analyzeInputForPercept,
        extractKnowledgeFromInteraction,
        generatePredicateForLinkedNodes,
        processCurriculumAndExtractFacts,
        decomposeStrategicGoal,
        generateCognitiveActionSequence,
        auditArchitectureForPrimitives,
        synthesizeNewSkill,
        runSkillSimulation,
        analyzePerformanceForEvolution,
        consolidateCoreIdentity,
        analyzeStateComponentCorrelation,
        runCognitiveArbiter,
        consolidateEpisodicMemory,
        evolvePersonality,
        generateCodeEvolutionSnippet,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        evaluateAndCollapseBranches,
        runAffectiveAnalysis,
        generatePsionicIntegrationSummary,
        generateEvolutionaryProposalFromInsight,
        proposeCausalLinkFromFailure,
        runSymbioticSupervisor,
        forgeNewHeuristic,
        generateHeuristic,
        generateAutonomousCreationPlan, // Replaced proposeNewComponent
        proposeRefactoring,
        generateImage,
        editImage,
        generateVideo,
        generateSonicContent,
        handleGenerateDreamPrompt,
        handleVisualizeInsight,
        generateMusicalDiceRoll,
        generateNoeticEngram,
        prioritizeProposal
    };
};