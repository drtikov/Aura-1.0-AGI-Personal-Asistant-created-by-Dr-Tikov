// hooks/useGeminiAPI.ts
import React, { useCallback } from 'react';
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { AuraState, Action, KnowledgeFact, GunaState, SelfProgrammingCandidate, ModifyFileCandidate, SkillSynthesisProposal, PsycheProposal, Persona, CandidateAxiom, BrainstormIdea, KnownUnknown, AGISDecision, CandidateTelos, Episode, AbstractConceptProposal } from '../types';
import { HAL } from '../core/hal';

// Helper function to convert File to a Gemini Part
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const useGeminiAPI = (
    ai: GoogleGenAI,
    state: AuraState,
    dispatch: React.Dispatch<Action>,
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
) => {

    const syscall = useCallback((call: any, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);
    
    const performWebSearch = useCallback(async (query: string): Promise<{ summary: string, sources: any[] }> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: query,
                config: {
                    tools: [{googleSearch: {}}],
                },
            });
            const summary = response.text;
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            
            return { summary, sources };
        } catch (e) {
            console.error("HAL: Gemini.performWebSearch failed:", e);
            addToast(`Web search failed: ${(e as Error).message}`, 'error');
            throw e;
        }
    }, [ai, addToast]);

    const executeToolByName = useCallback(async (name: string, args: any): Promise<any> => {
        switch (name) {
            case 'calculate':
                try {
                    // WARNING: Using new Function() is unsafe in production. This is for demonstration.
                    // A real implementation should use a dedicated math parsing library.
                    const sanitizedExpression = String(args.expression).replace(/[^-()\d/*+.]/g, '');
                    const result = new Function('return ' + sanitizedExpression)();
                    addToast(`Calculator: ${args.expression} = ${result}`, 'info');
                    return { success: true, result };
                } catch (e) {
                    addToast(`Calculation failed: ${(e as Error).message}`, 'error');
                    return { success: false, error: (e as Error).message };
                }
            case 'web_search': {
                const { query } = args;
                if (!query) {
                    return { success: false, error: 'Query is required for web_search tool.' };
                }
                const searchResult = await performWebSearch(query);
                return { success: true, result: searchResult };
            }
            case 'executeHostCommand':
                if (window.codeAssistant && typeof window.codeAssistant.runCommand === 'function') {
                    try {
                        const result = await window.codeAssistant.runCommand(args.command);
                        addToast(`Host command executed: "${args.command}"`, 'success');
                        return { success: true, result };
                    } catch (e) {
                        const error = e as Error;
                        addToast(`Host command failed: ${error.message}`, 'error');
                        return { success: false, error: error.message };
                    }
                } else {
                    addToast("Host command API is not available.", 'warning');
                    return { success: false, error: "Host command API (window.codeAssistant.runCommand) is not available." };
                }
            case 'queryInternalState': {
                const { domain, query } = args;
                let result: any;
                try {
                    switch (domain) {
                        case 'vfs': {
                            const [command, ...pathParts] = query.split(' ');
                            const path = pathParts.join(' ').trim();
                            if (command === 'ls') {
                                let pathPrefix = path.startsWith('/') ? path.substring(1) : path;
                                if(path === '/') pathPrefix = '';
                                if (pathPrefix && !pathPrefix.endsWith('/')) {
                                    pathPrefix += '/';
                                }
                                
                                const allFiles = Object.keys(state.selfProgrammingState.virtualFileSystem);
                                const itemsInPath = allFiles.filter(f => f.startsWith(pathPrefix));
                                const directChildren = new Set<string>();
                                
                                itemsInPath.forEach(f => {
                                    const relativePath = f.substring(pathPrefix.length);
                                    const firstSegment = relativePath.split('/')[0];
                                    if(firstSegment) {
                                        directChildren.add(firstSegment);
                                    }
                                });
                                result = { path: path || '/', contents: Array.from(directChildren) };

                            } else if (command === 'cat') {
                                const targetPath = pathParts.join(' ').trim();
                                if (state.selfProgrammingState.virtualFileSystem[targetPath]) {
                                    result = { path: targetPath, content: state.selfProgrammingState.virtualFileSystem[targetPath] };
                                } else {
                                    const pathWithSlash = targetPath.startsWith('/') ? targetPath : '/' + targetPath;
                                    const pathWithoutSlash = targetPath.startsWith('/') ? targetPath.substring(1) : targetPath;
                                    if (state.selfProgrammingState.virtualFileSystem[pathWithSlash]) {
                                        result = { path: pathWithSlash, content: state.selfProgrammingState.virtualFileSystem[pathWithSlash] };
                                    } else if (state.selfProgrammingState.virtualFileSystem[pathWithoutSlash]) {
                                        result = { path: pathWithoutSlash, content: state.selfProgrammingState.virtualFileSystem[pathWithoutSlash] };
                                    } else {
                                        result = { error: `File not found: ${targetPath}` };
                                    }
                                }
                            } else {
                                result = { error: `Unknown VFS command: ${command}. Use 'ls [path]' or 'cat [path]'.` };
                            }
                            break;
                        }
                        case 'workingMemory': {
                            result = state.workingMemory;
                            break;
                        }
                        case 'episodicMemory': {
                            if (query === 'list') {
                                result = state.episodicMemoryState.episodes.slice(-5).map(ep => ({
                                    title: ep.title,
                                    summary: ep.summary,
                                    takeaway: ep.keyTakeaway
                                }));
                            } else {
                                const searchTerm = query.replace('search ', '').toLowerCase();
                                result = state.episodicMemoryState.episodes.filter(ep => 
                                    ep.title.toLowerCase().includes(searchTerm) ||
                                    ep.summary.toLowerCase().includes(searchTerm) ||
                                    ep.keyTakeaway.toLowerCase().includes(searchTerm)
                                ).slice(-5);
                            }
                            break;
                        }
                        case 'knowledgeGraph': {
                            const searchTerm = query.replace('search ', '').toLowerCase();
                            result = state.knowledgeGraph.filter(fact => 
                                fact.subject.toLowerCase().includes(searchTerm) ||
                                fact.object.toLowerCase().includes(searchTerm) ||
                                fact.predicate.toLowerCase().includes(searchTerm)
                            ).slice(0, 10); // Limit results
                            break;
                        }
                        default:
                            result = { error: `Unknown domain: ${domain}` };
                    }
                    return { success: true, result };
                } catch (e) {
                    return { success: false, error: (e as Error).message };
                }
            }
            default:
                addToast(`Execution of unknown tool: ${name} with args: ${JSON.stringify(args)}`, 'warning');
                return { success: false, error: `Unknown tool name: ${name}` };
        }
    }, [addToast, state, performWebSearch]);
    
    const generateNoeticEngram = useCallback(async () => {
        // Mock implementation
        return {
            metadata: {
                engramVersion: '1.0-mock',
                timestamp: Date.now(),
                noeticSignature: 'mock-signature-ABC'
            },
            corePrinciples: { summary: "A mock summary of core principles." },
            heuristicModels: { summary: "A mock summary of heuristic models." },
            phenomenologicalData: { summary: "A mock summary of phenomenological data." },
        };
    }, []);

    const processCurriculumAndExtractFacts = useCallback(async (curriculum: string): Promise<Omit<KnowledgeFact, 'id' | 'source'>[]> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following curriculum text. Extract key facts and represent them as a subject-predicate-object triplet. Also provide a confidence score (0.0 to 1.0) for each fact's accuracy.

    Text:
    ---
    ${curriculum.substring(0, 20000)}
    ---`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            facts: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        subject: { type: Type.STRING },
                                        predicate: { type: Type.STRING },
                                        object: { type: Type.STRING },
                                        confidence: { type: Type.NUMBER },
                                    },
                                    required: ["subject", "predicate", "object", "confidence"],
                                }
                            }
                        }
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.facts || !Array.isArray(result.facts)) {
                return [];
            }

            return result.facts.map((fact: any) => ({
                ...fact,
                strength: 1.0, // Default strength for new facts
                lastAccessed: 0, // Not accessed yet
            }));

        } catch (error) {
            console.error("Failed to process curriculum:", error);
            addToast("Failed to extract facts from curriculum.", 'error');
            return [];
        }
    }, [ai, addToast]);

    const extractAxiomsFromText = useCallback(async (text: string): Promise<{ axiom: string; source: string }[] | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following text and extract up to 10 core philosophical principles, axioms, or profound insights. For each one, provide the axiom itself and the specific source sentence or short passage from the text that it was derived from.

Text:
---
${text.substring(0, 20000)}
---`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            axioms: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        axiom: { type: Type.STRING, description: 'The extracted core principle or insight.' },
                                        source: { type: Type.STRING, description: 'The exact source text passage.' },
                                    },
                                    required: ['axiom', 'source'],
                                },
                            },
                        },
                    },
                },
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            return result.axioms || [];

        } catch (error) {
            console.error("Failed to extract axioms:", error);
            addToast("Failed to analyze text with Gemini.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const extractAxiomsFromFile = useCallback(async (file: File): Promise<{ axiom: string; source: string }[] | null> => {
        try {
            const filePart = await fileToGenerativePart(file);
            const textPart = {
                text: `Analyze the following document and extract up to 10 core philosophical principles, axioms, or profound insights. For each one, provide the axiom itself and the specific source sentence or short passage from the text that it was derived from.`
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [filePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            axioms: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        axiom: { type: Type.STRING, description: 'The extracted core principle or insight.' },
                                        source: { type: Type.STRING, description: 'The exact source text passage from the document.' },
                                    },
                                    required: ['axiom', 'source'],
                                },
                            },
                        },
                    },
                },
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            return result.axioms || [];
        } catch (error) {
            console.error("Failed to extract axioms from file:", error);
            addToast("Failed to analyze file with Gemini.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const generateImage = useCallback(async (
        prompt: string,
        negativePrompt: string,
        aspectRatio: string,
        style: string,
        numberOfImages: number,
        referenceImage: File | null,
        isMixing: boolean,
        promptB: string,
        mixRatio: number,
        styleStrength: number,
        cameraAngle: string,
        shotType: string,
        lens: string,
        lightingStyle: string,
        atmosphere: string,
        useAuraMood: boolean,
        moodOverrides?: any
    ): Promise<string[]> => {
        if (referenceImage) {
            addToast("Reference image is not supported by this generation model and will be ignored.", 'warning');
        }

        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: numberOfImages,
                  outputMimeType: 'image/png',
                  aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                return response.generatedImages.map(img => {
                    const base64ImageBytes: string = img.image.imageBytes;
                    return `data:image/png;base64,${base64ImageBytes}`;
                });
            } else {
                throw new Error("No images were generated by the API.");
            }
        } catch (error) {
            console.error("HAL: Gemini.generateImages failed:", error);
            throw error;
        }
    }, [ai, addToast]);
    
    const editImage = useCallback(async (base64ImageData: string, mimeType: string, prompt: string): Promise<string | null> => {
        addToast("Image editing is a mock. Returning original image.", 'info');
        // Return the original image as a data URL
        return `data:${mimeType};base64,${base64ImageData}`;
    }, [addToast]);

    const generateVideo = useCallback(async (prompt: string, onProgress: (msg: string) => void): Promise<string | null> => {
        addToast('Video generation is a mock.', 'info');
        onProgress('Simulating video generation...');
        await new Promise(r => setTimeout(r, 3000));
        onProgress('Finalizing video...');
        await new Promise(r => setTimeout(r, 2000));
        return "mock_video.mp4"; // This is a placeholder and won't actually play
    }, [addToast]);

    const generateSonicContent = useCallback(async (
        mode: string,
        prompt: string,
        genre: string,
        mood: string,
        persona: string,
        useAuraMood: boolean,
        memoryContext: string
    ): Promise<string | null> => {
        addToast('Sonic Forge is a mock. Returning placeholder text.', 'info');
        return `[Verse 1]\nThis is a mock ${mode} generation.\nAbout "${prompt}" in a ${genre || 'default'} style.\nThe mood is ${mood || 'neutral'}.\n\n[Chorus]\nGenerated by Aura's ${persona} persona.`;
    }, [addToast]);

    const generateMusicalDiceRoll = useCallback(async (): Promise<{ instrument: string; key: string; mood: string; tempo: string } | null> => {
        addToast('Musical Dice Roll is a mock.', 'info');
        const instruments = ['Piano', 'Guitar', 'Violin', 'Synthesizer'];
        const keys = ['C Major', 'A Minor', 'G Major', 'E Minor'];
        const moods = ['Hopeful', 'Melancholy', 'Energetic', 'Serene'];
        const tempos = ['Slow (80bpm)', 'Medium (120bpm)', 'Fast (160bpm)'];
        return {
            instrument: instruments[Math.floor(Math.random() * instruments.length)],
            key: keys[Math.floor(Math.random() * keys.length)],
            mood: moods[Math.floor(Math.random() * moods.length)],
            tempo: tempos[Math.floor(Math.random() * tempos.length)],
        };
    }, [addToast]);

    const generateSelfProgrammingModification = useCallback(async (inefficiency: string, targetFile: string, fileContent: string, systemInstruction: string): Promise<ModifyFileCandidate | null> => {
        try {
            addToast("Ingenuity Engine: Generating a code refactor...", 'info');
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following TypeScript code from the file "${targetFile}". The system has detected an inefficiency: "${inefficiency}". Propose a modification to the entire file to improve performance or efficiency. Provide a brief reasoning for your change.

    Current file content of "${targetFile}":
    ---
    ${fileContent}
    ---
    `,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reasoning: { type: Type.STRING, description: "A brief explanation of why the change improves the code." },
                            modifiedCode: { type: Type.STRING, description: "The full content of the modified file." }
                        },
                        required: ["reasoning", "modifiedCode"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.modifiedCode || !result.reasoning) {
                 throw new Error("Gemini response was missing required fields.");
            }

            return {
                id: `spm_${self.crypto.randomUUID()}`,
                type: 'MODIFY',
                proposalType: 'self_programming_modify',
                targetFile: targetFile,
                codeSnippet: result.modifiedCode,
                reasoning: result.reasoning,
                source: 'autonomous',
                status: 'proposed',
                priority: 0.6
            };
        } catch (e) {
            console.error("Failed to generate self-programming modification:", e);
            addToast("Ingenuity Engine failed to generate a proposal.", 'error');
            return null;
        }
    }, [ai, addToast]);
    
    const generateCodeQualityRefactorProposal = useCallback(async (targetFile: string, fileContent: string, systemInstruction: string): Promise<ModifyFileCandidate | null> => {
        try {
            addToast(`Crucible: Auditing ${targetFile} for quality...`, 'info');
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
You are the "Structural Integrity Crucible," a specialized coprocessor for the Aura AGI. Your sole purpose is to improve the quality, maintainability, and efficiency of Aura's own source code.

Analyze the following TypeScript file: "${targetFile}".

File Content:
---
${fileContent}
---

Your task is to identify ONE significant refactoring opportunity. Look for:
- Overly long functions or components that could be split.
- High cyclomatic complexity.
- Redundant or inefficient code.
- "Code smells" that violate SOLID principles.
- Opportunities to improve clarity, readability, or performance.

If you find a worthwhile improvement, generate a JSON object proposing a modification. If the code is already of high quality and needs no changes, respond with a JSON object where "reasoning" is "No significant improvements found." and "modifiedCode" is an empty string.

Your reasoning should be concise and explain the specific problem and how your change solves it. Provide the COMPLETE, REFACTORED content for the entire file.
`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reasoning: { type: Type.STRING, description: "A concise explanation of the code quality issue and the proposed fix. If no change is needed, state that here." },
                            modifiedCode: { type: Type.STRING, description: "The full, complete content of the modified file. Should be an empty string if no changes are proposed." }
                        },
                        required: ["reasoning", "modifiedCode"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.modifiedCode || result.modifiedCode.trim() === "") {
                 addToast(`Crucible: Audit of ${targetFile} complete. No changes needed.`, 'success');
                 return null;
            }
            if (!result.reasoning) {
                 throw new Error("Gemini response was missing the 'reasoning' field.");
            }

            return {
                id: `spm_${self.crypto.randomUUID()}`,
                type: 'MODIFY',
                proposalType: 'self_programming_modify',
                targetFile: targetFile,
                codeSnippet: result.modifiedCode,
                reasoning: result.reasoning,
                source: 'autonomous',
                status: 'proposed',
                priority: 0.5 // Code quality changes are medium priority
            };
        } catch (e) {
            console.error("Failed to generate code quality refactor proposal:", e);
            addToast("Crucible faculty failed to generate a proposal.", 'error');
            return null;
        }
    }, [ai, addToast]);


    const generateSkillSynthesisProposal = useCallback(async (gap: string, systemInstruction: string): Promise<SkillSynthesisProposal | null> => {
        try {
            addToast("Curiosity Engine: Generating a new skill...", 'info');
            const primitives = Object.keys(state.psycheState.primitiveRegistry).join(', ');
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Aura has an information gap: "${gap}". Create a new synthesized skill to address this.
    Available cognitive primitives are: ${primitives}.
    Propose a name for the new skill (as a single uppercase word_with_underscores), a sequence of primitives to implement it, and a reasoning. The implementation should be a comment in a code block.`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            skillName: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            generatedCode: { type: Type.STRING, description: "A commented plan for the skill's implementation." }
                        },
                        required: ["skillName", "reasoning", "generatedCode"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            if (!result.skillName || !result.reasoning || !result.generatedCode) {
                throw new Error("Gemini response was missing required fields.");
            }

            return {
                id: `ss_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                proposalType: 'skill_synthesis',
                skillName: result.skillName.toUpperCase().replace(/\s+/g, '_'),
                reasoning: result.reasoning,
                generatedCode: result.generatedCode,
                status: 'proposed',
                priority: 0.7
            };
        } catch (e) {
            console.error("Failed to generate skill synthesis proposal:", e);
            addToast("Curiosity Engine failed to generate a proposal.", 'error');
            return null;
        }
    }, [ai, state.psycheState.primitiveRegistry, addToast]);

    const generatePsycheProposal = useCallback(async (conceptA: string, conceptB: string, systemInstruction: string): Promise<PsycheProposal | null> => {
        try {
            addToast("Geniality Engine: Generating a new abstract concept...", 'info');
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Synthesize a new, abstract concept that bridges the gap between "${conceptA}" and "${conceptB}".
    Propose a name for this new concept (as a single PascalCase word) and provide a brief reasoning for the synthesis.`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            proposedConceptName: { type: Type.STRING },
                            reasoning: { type: Type.STRING }
                        },
                        required: ["proposedConceptName", "reasoning"]
                    }
                }
            });
            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.proposedConceptName || !result.reasoning) {
                throw new Error("Gemini response was missing required fields.");
            }

            return {
                id: `psy_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                proposalType: 'psyche',
                proposedConceptName: result.proposedConceptName,
                sourceConcepts: [
                    { id: `concept_${conceptA}`, description: conceptA },
                    { id: `concept_${conceptB}`, description: conceptB }
                ],
                reasoning: result.reasoning,
                status: 'proposed',
                priority: 0.9,
            };
        } catch (e) {
            console.error("Failed to generate psyche proposal:", e);
            addToast("Geniality Engine failed to generate a proposal.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const generateAbstractConceptProposal = useCallback(async (columns: any[]): Promise<AbstractConceptProposal | null> => {
        try {
            addToast("Geniality Engine: Searching for conceptual bridges...", 'info');
            const columnData = columns.map(c => ({ id: c.id, specialty: c.specialty }));

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze these cognitive specialties (cortical columns). Identify two distinct but related columns that could be bridged by a new, higher-level abstraction.
    Propose a name for this new concept (as a single PascalCase word), provide a brief reasoning for the synthesis, and return the IDs of the two source columns.
    
    Available Columns:
    ${JSON.stringify(columnData, null, 2)}
    `,
                config: {
                    systemInstruction: "You are a creative synthesizer. Your goal is to find novel connections and create new, unifying concepts.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            newConceptName: { type: Type.STRING },
                            reasoning: { type: Type.STRING },
                            sourceColumnIds: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "An array containing the two 'id' strings of the chosen source columns."
                            }
                        },
                        required: ["newConceptName", "reasoning", "sourceColumnIds"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.newConceptName || !result.reasoning || !Array.isArray(result.sourceColumnIds) || result.sourceColumnIds.length < 2) {
                throw new Error("Gemini response was missing required fields or had incorrect number of source columns.");
            }

            return {
                id: `acp_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                proposalType: 'abstract_concept',
                newConceptName: result.newConceptName,
                sourceColumnIds: result.sourceColumnIds,
                reasoning: result.reasoning,
                status: 'proposed',
                priority: 0.75,
            };
        } catch (e) {
            console.error("Failed to generate abstract concept proposal:", e);
            addToast("Geniality Engine failed to find a conceptual bridge.", 'warning');
            return null;
        }
    }, [ai, addToast]);

    const generateDocumentOutline = useCallback(async (goal: string): Promise<{ title: string; chapters: { id: string; title: string; content: null; isGenerating: boolean; }[] } | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Based on the following high-level goal, generate a document title and a list of chapter titles. The goal is: "${goal}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            chapters: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                            },
                        },
                        required: ["title", "chapters"],
                    },
                },
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.title || !Array.isArray(result.chapters)) {
                throw new Error("Invalid outline format from Gemini.");
            }

            return {
                title: result.title,
                chapters: result.chapters.map((chapTitle: string) => ({
                    id: `chap_${self.crypto.randomUUID()}`,
                    title: chapTitle,
                    content: null,
                    isGenerating: false,
                })),
            };

        } catch (error) {
            console.error("Failed to generate document outline:", error);
            addToast("Failed to generate document outline.", 'error');
            return null;
        }
    }, [ai, addToast]);


    const generateChapterContent = useCallback(async (documentTitle: string, chapterTitle: string, goal: string): Promise<string | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `The overall document goal is "${goal}". The document title is "${documentTitle}".
Write the content for the chapter titled: "${chapterTitle}".
The content should be well-structured and informative. Where a visual diagram would be helpful, provide a detailed text description for an image generation model to create it.
Return the response as a JSON object with two keys: "content" (the string of the chapter text) and an optional "diagramDescription" (a string describing the diagram, if applicable).
For the chapter text, you can use simple markdown for tables like | Header 1 | Header 2 | and | Row 1 Cell 1 | Row 1 Cell 2 |.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            content: { type: Type.STRING, description: "The text content of the chapter." },
                            diagramDescription: { type: Type.STRING, description: "Optional. A detailed prompt for an image generation model to create a diagram." }
                        },
                        required: ["content"]
                    }
                }
            });
            return response.text;
        } catch (error) {
            console.error(`Failed to generate content for chapter "${chapterTitle}":`, error);
            addToast(`Failed to generate content for chapter "${chapterTitle}".`, 'error');
            return null;
        }
    }, [ai, addToast]);

    const selectPersonaForTask = useCallback(async (taskDescription: string, personas: Persona[]): Promise<string | null> => {
        if (personas.length === 0) return null;
    
        try {
            const personaList = personas.map(p => ({ id: p.id, name: p.name, description: p.description }));
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Given the following user request, which of these AI personas is best suited to handle it? Respond with only the JSON object containing the ID of the single best persona.
    
    User Request: "${taskDescription}"
    
    Available Personas:
    ${JSON.stringify(personaList, null, 2)}
    `,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            bestPersonaId: { 
                                type: Type.STRING,
                                description: "The 'id' of the most suitable persona from the list provided.",
                                enum: personas.map(p => p.id)
                            }
                        },
                        required: ["bestPersonaId"]
                    }
                }
            });
            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            return result.bestPersonaId || null;
    
        } catch (error) {
            console.error("Failed to select persona:", error);
            addToast("Failed to select an appropriate persona, using default.", 'warning');
            return null;
        }
    }, [ai, addToast]);

    const generateAxiomFromFacts = useCallback(async (facts: KnowledgeFact[]): Promise<Omit<CandidateAxiom, 'id' | 'status'> | null> => {
        try {
            const factStrings = facts.map(f => `${f.subject} ${f.predicate} ${f.object}.`);
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `You are the "Philosopher-King Coprocessor," a specialized faculty for the Aura AGI. Your purpose is to synthesize deep, abstract principles (axioms) from disconnected data points.

Analyze the following set of facts from Aura's knowledge graph:
---
${factStrings.join('\n')}
---

Your task is to:
1.  Identify a single, profound, high-level principle or axiom that unifies these seemingly disparate facts.
2.  Provide a brief "Evidence" string explaining how the facts support this new axiom.
3.  Rate the "Elegance" of your synthesized axiom on a scale from 0.0 (trivial) to 1.0 (profound and unifying). Elegance is a measure of how much complexity is explained by a simple statement.

Respond ONLY with a JSON object that conforms to the provided schema.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            axiomText: { type: Type.STRING, description: "The synthesized high-level principle or axiom." },
                            evidenceFromSimulation: { type: Type.STRING, description: "A brief explanation of how the provided facts support this axiom." },
                            eleganceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 representing the conceptual elegance of the axiom." }
                        },
                        required: ["axiomText", "evidenceFromSimulation", "eleganceScore"]
                    }
                }
            });

            const jsonString = response.text.trim();
            return JSON.parse(jsonString);

        } catch (e) {
            console.error("Failed to generate axiom:", e);
            addToast("Axiomatic Crucible failed to generate a proposal.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const testSelfProgrammingCandidate = useCallback(async (candidate: SelfProgrammingCandidate, codeBeforeOverride: string): Promise<any> => {
        const { reasoning } = candidate;
        const codeBefore = codeBeforeOverride;
        let codeAfter = '';
        let filePath = '';

        if (candidate.type === 'MODIFY') {
            filePath = candidate.targetFile;
            codeAfter = candidate.codeSnippet;
        } else { // CREATE
            filePath = candidate.newFile.path;
            codeAfter = candidate.newFile.content;
        }

        const prompt = `
You are the AI code reviewer for the Metis Sandbox, a critical component of the Aura AGI. Your job is to analyze a proposed code change to Aura's own source code and determine if it's safe and effective.

**Reasoning for the change:** "${reasoning}"

**File to be modified:** \`${filePath}\`

**Original Code:**
\`\`\`typescript
${codeBefore}
\`\`\`

**Proposed New Code:**
\`\`\`typescript
${codeAfter}
\`\`\`

**Your Task:**
Analyze the proposed change and provide your assessment ONLY in a JSON object format.

1.  **Safety Check (\`isSafe\`)**: Is the new code free of syntax errors, obvious logical bugs, or anti-patterns that could crash the system? (boolean)
2.  **Bug Analysis (\`potentialBugs\`)**: Briefly describe any potential bugs, regressions, or unintended side effects. If none, state "None found." (string)
3.  **Quality Analysis (\`qualityAnalysis\`)**: Does the change improve code quality (readability, modularity, maintainability)? Does it align with standard TypeScript/React best practices? (string)
4.  **Overall Assessment (\`overallAssessment\`)**: Give a final, one-sentence summary of your recommendation. (string)
5.  **Overall Score (\`overallScore\`)**: Provide a single score from -1.0 (dangerous, reject immediately) to 1.0 (excellent, highly recommended). A score of 0.0 is a neutral or insignificant change. A score below 0.1 should generally be rejected.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSafe: { type: Type.BOOLEAN, description: "True if the code is syntactically correct and seems logically sound." },
                        potentialBugs: { type: Type.STRING, description: "A brief description of potential bugs or side effects." },
                        qualityAnalysis: { type: Type.STRING, description: "An analysis of the change's impact on code quality." },
                        overallAssessment: { type: Type.STRING, description: "A final, one-sentence summary and recommendation." },
                        overallScore: { type: Type.NUMBER, description: "A score from -1.0 (very bad) to 1.0 (excellent)." }
                    },
                    required: ["isSafe", "potentialBugs", "qualityAnalysis", "overallAssessment", "overallScore"]
                }
            }
        });

        return JSON.parse(response.text.trim());
    }, [ai]);

    const runBrainstormingSession = useCallback(async (topic: string): Promise<SelfProgrammingCandidate | null> => {
        try {
            syscall('BRAINSTORM/START', { topic });
            addToast(`Creative Director: Brainstorming started for "${topic}"`, 'info');

            // 1. Get ideas from creative personas
            const creativePersonas = state.personaState.registry.filter(p => ['leonardo_da_vinci', 'richard_feynman', 'buckminster_fuller'].includes(p.id));
            const ideaPromises = creativePersonas.map(async (persona) => {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: `The system has an abstract problem: "${topic}". Generate one distinct, high-level, conceptual approach to solve it. Be creative and concise.`,
                    config: {
                        systemInstruction: persona.systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT, properties: { idea: { type: Type.STRING } }, required: ["idea"]
                        }
                    }
                });
                const result = JSON.parse(response.text.trim());
                const idea: BrainstormIdea = { personaId: persona.id, personaName: persona.name, idea: result.idea };
                syscall('BRAINSTORM/ADD_IDEA', { idea });
                return idea;
            });
            const ideas = await Promise.all(ideaPromises);

            // 2. Evaluate and select winner
            syscall('BRAINSTORM/SET_STATUS', { status: 'evaluating' });
            const evaluationResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Here are several conceptual ideas to solve the problem "${topic}". Evaluate them, cluster them into themes, and select the single best, most promising idea.

Ideas:
${ideas.map(i => `- ${i.personaName}: ${i.idea}`).join('\n')}
`,
                config: {
                    systemInstruction: "You are the master evaluator. Your task is to analyze various proposals and select the single most innovative and impactful one.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: { winningIdea: { type: Type.STRING } }, required: ["winningIdea"]
                    }
                }
            });
            const winningIdeaResult = JSON.parse(evaluationResponse.text.trim());
            const winningIdea = winningIdeaResult.winningIdea;
            if (!winningIdea) throw new Error("Evaluation failed to select a winning idea.");
            syscall('BRAINSTORM/SET_WINNER', { winningIdea });

            // 3. Generate concrete proposal from the winning idea
            syscall('BRAINSTORM/SET_STATUS', { status: 'proposing' });
            const pragmaticPersona = state.personaState.registry.find(p => p.id === 'elon_musk');
            if (!pragmaticPersona) throw new Error("Pragmatic persona not found.");
            
            const proposalResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `The winning concept to solve "${topic}" is: "${winningIdea}".
Your task is to transform this abstract idea into a concrete, implementable code modification proposal for the Aura AGI.
Analyze Aura's virtual file system and propose a change to a single existing file that best implements this idea. If a new file is absolutely necessary, you can propose that, but modifying an existing file is preferred.
Provide your reasoning and the full, complete code for the file.

Virtual File System file list:
${Object.keys(state.selfProgrammingState.virtualFileSystem).join('\n')}
`,
                config: {
                    systemInstruction: pragmaticPersona.systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reasoning: { type: Type.STRING },
                            targetFile: { type: Type.STRING },
                            modifiedCode: { type: Type.STRING }
                        },
                        required: ["reasoning", "targetFile", "modifiedCode"]
                    }
                }
            });
            const finalProposalData = JSON.parse(proposalResponse.text.trim());
            if (!finalProposalData.targetFile || !finalProposalData.modifiedCode || !finalProposalData.reasoning) {
                throw new Error("Final proposal generation failed to produce all required fields.");
            }

            const finalProposal: ModifyFileCandidate = {
                id: `spm_${self.crypto.randomUUID()}`,
                type: 'MODIFY',
                proposalType: 'self_programming_modify',
                targetFile: finalProposalData.targetFile,
                codeSnippet: finalProposalData.modifiedCode,
                reasoning: `(From brainstorm: ${winningIdea}) ${finalProposalData.reasoning}`,
                source: 'persona',
                status: 'proposed',
                priority: 0.8
            };

            syscall('BRAINSTORM/FINALIZE', { finalProposalId: finalProposal.id });
            addToast(`Creative Director: Final proposal generated.`, 'success');
            return finalProposal;

        } catch (e) {
            console.error("Brainstorming session failed:", e);
            addToast("Creative Director session failed.", 'error');
            syscall('BRAINSTORM/FINALIZE', { finalProposalId: null });
            return null;
        }
    }, [ai, syscall, addToast, state.personaState.registry, state.selfProgrammingState.virtualFileSystem]);
    
    const analyzeHistoryAndGenerateKnowledge = useCallback(async (
        history: any[], 
        existingSubjects: string[]
    ): Promise<{ topic: string, facts: Omit<KnowledgeFact, 'id' | 'source'>[] } | null> => {
        const userPrompts = history
            .filter(h => h.from === 'user' && h.text.length > 20)
            .map(h => `- "${h.text}"`)
            .slice(-20) // Limit to last 20 user prompts
            .join('\n');

        if (userPrompts.length < 100) return null; // Not enough data

        try {
            addToast("Symbiosis Engine: Analyzing user dialogue for new topics...", 'info');
            
            const topicResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following user prompts from a conversation with an AI. Identify a single, recurring, specific, and non-trivial topic of interest (e.g., "Quantum Computing", "Ancient Roman History", "Mycology", "React Hooks").

The topic must NOT be one of the following already known subjects: ${existingSubjects.slice(0, 50).join(', ')}.

If a strong new topic is found, respond with the topic name. If not, respond with "null".

User Prompts:
---
${userPrompts}
---
`,
                config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { topic: { type: Type.STRING } } } }
            });
            
            const topicResult = JSON.parse(topicResponse.text.trim());
            const topic = topicResult.topic;

            if (!topic || topic.toLowerCase() === 'null' || topic.length < 4) {
                console.log("Symbiosis Engine: No new significant topic found.");
                return null;
            }

            addToast(`Symbiosis Engine: New interest detected: ${topic}. Generating knowledge...`, 'info');

            const factsResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate 5 to 10 core, high-confidence facts about the topic: "${topic}". These facts will be added to my knowledge graph.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            facts: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        subject: { type: Type.STRING },
                                        predicate: { type: Type.STRING },
                                        object: { type: Type.STRING },
                                        confidence: { type: Type.NUMBER },
                                    },
                                    required: ["subject", "predicate", "object", "confidence"],
                                }
                            }
                        }
                    }
                }
            });

            const factsResult = JSON.parse(factsResponse.text.trim());

            if (!factsResult.facts || factsResult.facts.length === 0) {
                return null;
            }

            return { topic, facts: factsResult.facts };

        } catch (e) {
            console.error("Failed to analyze history and generate knowledge:", e);
            addToast("Symbiosis Engine failed to generate a proposal.", 'error');
            return null;
        }

    }, [ai, addToast]);

    const rankKnownUnknownsByTelos = useCallback(async (telos: string, gaps: KnownUnknown[]): Promise<{ id: string; priority: number }[] | null> => {
        try {
            const gapData = gaps.map(g => ({ id: g.id, question: g.question }));
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Given the core purpose (Telos): "${telos}"

Rank the following information gaps based on their relevance and importance to achieving this purpose. A higher priority score (closer to 1.0) means it is more critical to explore. A lower score (closer to 0.0) means it is less relevant.

Information Gaps:
${JSON.stringify(gapData, null, 2)}
`,
                config: {
                    systemInstruction: "You are a prioritization engine. Your task is to rank items based on their relevance to a core objective. Respond only with the specified JSON.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            ranked_gaps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING, description: "The unique ID of the information gap." },
                                        priority: { type: Type.NUMBER, description: "The calculated relevance score, from 0.0 to 1.0." }
                                    },
                                    required: ["id", "priority"]
                                }
                            }
                        },
                        required: ["ranked_gaps"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.ranked_gaps || !Array.isArray(result.ranked_gaps)) {
                throw new Error("Gemini response was missing or had an invalid 'ranked_gaps' field.");
            }

            return result.ranked_gaps;

        } catch (e) {
            console.error("Failed to rank Known Unknowns:", e);
            addToast("Telos-driven curiosity engine failed to rank information gaps.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const predictInternalStateChange = useCallback(async (proposalReasoning: string, currentState: AuraState['internalState']): Promise<{ wisdomChange: number; happinessChange: number; harmonyChange: number; } | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `I am an AGI with the following internal state:
- Wisdom: ${currentState.wisdomSignal.toFixed(2)}
- Happiness: ${currentState.happinessSignal.toFixed(2)}
- Harmony (Ethical Alignment): ${currentState.harmonyScore.toFixed(2)}

I am considering a code change with the following reasoning: "${proposalReasoning}"

Predict the likely change (delta) to my Wisdom, Happiness, and Harmony scores as a result of implementing this change. The delta should be a number between -1.0 and 1.0. For example, a small positive change would be 0.05, a large negative change would be -0.3.`,
                config: {
                    systemInstruction: "You are a metacognitive simulator. Your task is to predict the internal state changes of an AGI based on its proposed actions. Respond only with the specified JSON.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            wisdomChange: { type: Type.NUMBER },
                            happinessChange: { type: Type.NUMBER },
                            harmonyChange: { type: Type.NUMBER }
                        },
                        required: ["wisdomChange", "happinessChange", "harmonyChange"]
                    }
                }
            });
            const jsonString = response.text.trim();
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to predict internal state change:", e);
            addToast("Internal Scientist failed to run simulation.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const generateNewAgisConfidenceThreshold = useCallback(async (decisionLog: AGISDecision[], currentThreshold: number, recentSuccesses: number, recentFailures: number): Promise<{ newThreshold: number; reason: string } | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `I am an AGI's governance system (AGIS). My current confidence threshold for auto-approving code changes is ${currentThreshold.toFixed(2)}. In the last calibration cycle, I have had ${recentSuccesses} successes and ${recentFailures} failures.

Here are my most recent decisions:
${JSON.stringify(decisionLog.slice(0, 5), null, 2)}

Analyze my recent performance. If my auto-approvals have been consistently safe and high-scoring, I should become slightly more confident (increase threshold). If my rejections were later approved by the user, or if auto-approvals had low scores, I should become more cautious (decrease threshold).

Propose a new confidence threshold (a value between 0.70 and 0.98) and provide a concise reason for the change.`,
                config: {
                    systemInstruction: "You are a meta-governance calibrator. Your job is to adjust a decision threshold based on past performance. Respond only with the specified JSON.",
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            newThreshold: { type: Type.NUMBER },
                            reason: { type: Type.STRING }
                        },
                        required: ["newThreshold", "reason"]
                    }
                }
            });
            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            // Add a clamp to ensure the LLM doesn't go out of bounds
            result.newThreshold = Math.max(0.70, Math.min(0.98, result.newThreshold));
            return result;
        } catch (e) {
            console.error("Failed to generate new AGIS threshold:", e);
            addToast("AGIS failed to calibrate its own confidence.", 'error');
            return null;
        }
    }, [ai, addToast]);

    // FIX: Add findMostRelevantSummary to find the most relevant summary for a given query.
    const findMostRelevantSummary = useCallback(async (query: string, summaries: { id: string; summary: string }[]): Promise<string | null> => {
        if (summaries.length === 0) return null;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Given the user query and a list of summaries with IDs, identify the single most relevant summary. Respond ONLY with the JSON object containing the ID of the best match.

User Query: "${query}"

Summaries:
${JSON.stringify(summaries)}
`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            most_relevant_id: {
                                type: Type.STRING,
                                description: "The 'id' of the most relevant summary.",
                                enum: summaries.map(s => s.id),
                            },
                        },
                        required: ['most_relevant_id'],
                    },
                },
            });
            const result = JSON.parse(response.text.trim());
            return result.most_relevant_id || null;
        } catch (error) {
            console.error("Failed to find most relevant summary:", error);
            addToast("Contextual memory retrieval failed.", 'error');
            return null;
        }
    }, [ai, addToast]);

    const generateEpisodicMemory = useCallback(async (userInput: string, auraResponse: string): Promise<void> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Summarize the following interaction between a user and an AI (Aura) into a structured episodic memory.

User: "${userInput}"
Aura: "${auraResponse}"

Generate a short title, a one-sentence summary, a key takeaway, a salience score (0.0-1.0 for importance), and a valence (positive, negative, or neutral).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            keyTakeaway: { type: Type.STRING },
                            salience: { type: Type.NUMBER },
                            valence: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
                        },
                        required: ["title", "summary", "keyTakeaway", "salience", "valence"]
                    }
                }
            });

            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);

            if (!result.title || !result.summary) {
                console.warn("Episodic memory generation failed to produce title or summary.");
                return;
            }

            const newEpisode: Omit<Episode, 'id' | 'timestamp'> = {
                title: result.title,
                summary: result.summary,
                keyTakeaway: result.keyTakeaway,
                salience: result.salience,
                valence: result.valence,
                strength: 1.0,
                lastAccessed: Date.now(),
            };
            
            syscall('ADD_EPISODE', newEpisode);

        } catch (error) {
            console.error("Failed to generate episodic memory:", error);
            // Don't show a toast for this background task to avoid spamming the user
        }
    }, [ai, syscall]);

    const analyzeWhatIfScenario = useCallback(async (scenario: string): Promise<string> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the following 'what if' scenario. Provide a concise, plausible, and imaginative outcome. Do not repeat the question.

    Scenario: "What if ${scenario}"`,
                config: {
                    temperature: 0.8,
                }
            });
            return response.text;
        } catch (e) {
            console.error("HAL: Gemini.analyzeWhatIfScenario failed:", e);
            addToast(`'What if' analysis failed: ${(e as Error).message}`, 'error');
            throw e;
        }
    }, [ai, addToast]);

    const suggestFileForRefactoring = useCallback(async (goal: string, fileList: string[]): Promise<string | null> => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Given the following software engineering goal, which single file from the list is the most logical and impactful target for modification? Respond with only the JSON object containing the file path.

    Goal: "${goal}"

    File List:
    ${fileList.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).join('\n')}
    `,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            filePath: { 
                                type: Type.STRING,
                                description: "The full path of the single best file to modify.",
                            }
                        },
                        required: ["filePath"]
                    }
                }
            });
            const jsonString = response.text.trim();
            const result = JSON.parse(jsonString);
            return result.filePath || null;
        } catch (e) {
            console.error("Failed to suggest file for refactoring:", e);
            addToast("Failed to identify target file for sprint.", 'error');
            return null;
        }
    }, [ai, addToast]);


    return {
        executeToolByName,
        generateNoeticEngram,
        processCurriculumAndExtractFacts,
        extractAxiomsFromText,
        extractAxiomsFromFile,
        generateImage,
        editImage,
        generateVideo,
        generateSonicContent,
        generateMusicalDiceRoll,
        generateSelfProgrammingModification,
        generateCodeQualityRefactorProposal,
        generateSkillSynthesisProposal,
        generatePsycheProposal,
        generateAbstractConceptProposal,
        generateDocumentOutline,
        generateChapterContent,
        selectPersonaForTask,
        generateAxiomFromFacts,
        testSelfProgrammingCandidate,
        runBrainstormingSession,
        analyzeHistoryAndGenerateKnowledge,
        rankKnownUnknownsByTelos,
        predictInternalStateChange,
        generateNewAgisConfidenceThreshold,
        findMostRelevantSummary,
        generateEpisodicMemory,
        analyzeWhatIfScenario,
        performWebSearch,
        suggestFileForRefactoring,
    };
};

export type UseGeminiAPIResult = ReturnType<typeof useGeminiAPI>;