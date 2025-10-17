// hooks/useAura.ts
import { useMemo, useCallback, useEffect, useRef, Dispatch } from 'react';
import i18next from '../i18n';
import { GoogleGenAI, Chat, FunctionDeclaration, GenerateContentResponse, Part, Type, FunctionCall, Content } from "@google/genai";
import { useAuraState } from './useAuraState';
import { useGeminiAPI } from './useGeminiAPI';
import { useUIHandlers } from './useUIHandlers';
import { useToasts } from './useToasts';
import { useAutonomousSystem, UseAutonomousSystemProps } from './useAutonomousSystem';
import { useDomObserver } from './useDomObserver';
import { useLiveSession } from './useLiveSession';
import { 
    SelfProgrammingCandidate, CoCreatedWorkflow, NeuroCortexState, Percept, TacticalPlan, TriageDecision, ArchitecturalChangeProposal, 
    DoxasticHypothesis, GenialityImprovementProposal, ArchitecturalImprovementProposal, CausalInferenceProposal, UnifiedProposal, 
    // FIX: Import missing types SyscallCall, AuraState and Action.
    SyscallCall, DoxasticSimulationResult, 
    AuraState, Action, GankyilInsight, SEDLDirective, ProposedAxiom, Summary, ModifyFileCandidate, UseGeminiAPIResult, GoalTree, GoalType, HistoryEntry
} from '../types';
import { clamp, getText } from '../utils.ts';
import { HAL } from '../core/hal';
import { taskScheduler } from '../core/taskScheduler';
import { HostBridge } from '../core/hostBridge';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

// This will now use the global `astermind` object from the script tag in index.html
declare const astermind: any;

// Helper function to convert File to a Gemini Part, moved from useGeminiAPI
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    // FIX: Corrected typo in FileReader method name.
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

const executeTool = async (functionCall: FunctionCall, ai: GoogleGenAI, geminiAPI: UseGeminiAPIResult): Promise<any> => {
    const { name, args } = functionCall;
    console.log(`Executing tool: ${name}`, args);

    try {
        switch (name) {
            case 'symbolic_math': {
                const command = (args as any).command;
                const expression = (args as any).expression;
                const variable = (args as any).variable || 'x'; // Default to 'x'
                let astermindCommand = '';

                // Map our tool's commands to astermind's syntax
                switch (command) {
                    case 'differentiate':
                        astermindCommand = `derivative(${expression}, ${variable})`;
                        break;
                    case 'solve':
                        astermindCommand = `solve(${expression}, ${variable})`;
                        break;
                    case 'integrate':
                        astermindCommand = `integrate(${expression}, ${variable})`;
                        break;
                    case 'simplify':
                    case 'factor':
                    case 'expand':
                        astermindCommand = `${command}(${expression})`;
                        break;
                    default:
                        throw new Error(`Unsupported symbolic_math command: ${command}`);
                }
                
                console.log(`Executing astermind command: ${astermindCommand}`);
                const result = astermind.compute(astermindCommand);

                if (typeof result === 'string' && (result.toLowerCase().includes('error') || result.toLowerCase().includes('unexpected'))) {
                    throw new Error(result);
                }

                return {
                    final_result: String(result), // Ensure result is a string
                    steps: [
                        { description: `Executed command '${command}' on expression.`, equation: String(result) }
                    ]
                };
            }
            case 'formal_proof_assistant': {
                const { statement_to_prove, proof_steps, action } = args as any;

                let prompt = `You are a formal proof assistant.
The user wants to prove the following statement: "${statement_to_prove}"\n\n`;

                if (proof_steps && proof_steps.length > 0) {
                    prompt += "Here are the proof steps provided so far:\n";
                    proof_steps.forEach((step: any) => {
                        prompt += `Step ${step.step}: ${step.statement} (Justification: ${step.justification})\n`;
                    });
                    prompt += "\n";
                } else {
                    prompt += "No proof steps have been provided yet.\n\n";
                }

                if (action === 'verify') {
                    prompt += "Please verify the correctness and completeness of the provided steps. Report on any logical errors, gaps, or missing justifications. Conclude with whether the proof is valid and complete.";
                } else if (action === 'suggest_next_step') {
                    prompt += "Please suggest the next logical step to continue the proof. Provide a clear statement and a justification for the suggested step. Offer alternative approaches if applicable.";
                }

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                isValid: { type: Type.BOOLEAN, description: "True if the proof is logically sound and complete, false otherwise. Only relevant for 'verify' action." },
                                isComplete: { type: Type.BOOLEAN, description: "True if the proof reaches the conclusion, false otherwise. Only relevant for 'verify' action." },
                                explanation: { type: Type.STRING, description: "A detailed explanation of the proof's status, including any errors, gaps, or general analysis." },
                                steps: { 
                                    type: Type.ARRAY, 
                                    description: "The original proof steps that were analyzed.",
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            step: { type: Type.NUMBER },
                                            statement: { type: Type.STRING },
                                            justification: { type: Type.STRING },
                                        }
                                    }
                                },
                                suggestedNextStep: { type: Type.STRING, description: "A concrete suggestion for the next step in the proof. Only relevant for 'suggest_next_step' action." }
                            }
                        }
                    }
                });

                const proofResult = JSON.parse(getText(response));
                return {
                    result: proofResult.explanation,
                    ...proofResult,
                };
            }
            case 'math_knowledge_retrieval': {
                const { query_type, topic, keywords } = args as any;
                const prompt = `You are a mathematical knowledge retrieval expert. Provide a concise but comprehensive summary for the following query.
Type: ${query_type}
Topic: ${topic}
Keywords: ${keywords.join(', ')}

Provide sources if possible.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { tools: [{ googleSearch: {} }] }
                });
                
                const summary = getText(response);
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                const formattedSources = sources.map((s: any) => ({
                    title: s.web?.title || 'Unknown Source',
                    uri: s.web?.uri || '#',
                }));

                return {
                    summary: summary,
                    sources: formattedSources
                };
            }
            case 'computation_offload':
                return {
                    job_id: `job_${self.crypto.randomUUID()}`,
                    status: 'submitted',
                    estimated_completion_time: '120 seconds',
                    message: 'The complex computation has been offloaded to a simulated background worker. (Note: This is a mock response).'
                };
            case 'executeHostCommand': {
                const { command, commandArgs } = args as { command: string; commandArgs?: string[] };
                try {
                    // This will now call our new HAL function
                    const result = await HostBridge.runCommand(command, commandArgs || []);
                    // We return the whole object so the LLM gets stdout, stderr, and exitCode
                    return { result };
                } catch (e) {
                    console.error(`Host command '${command}' failed:`, e);
                    return { error: (e as Error).message };
                }
            }
            case 'listFiles': {
                const { path } = args as { path: string };
                try {
                    const fileList = await HostBridge.listFiles(path);
                    return { result: fileList };
                } catch (e) {
                    console.error(`Host command 'listFiles' failed for path '${path}':`, e);
                    return { error: (e as Error).message };
                }
            }
            case 'openFileInIDE': {
                const { filePath } = args as { filePath: string };
                try {
                    await HostBridge.openFile(filePath);
                    return { result: `Successfully requested to open file: ${filePath}` };
                } catch (e) {
                    console.error(`Host command 'openFile' failed for path '${filePath}':`, e);
                    return { error: (e as Error).message };
                }
            }
            default:
                return { error: `Tool '${name}' not found or not implemented.` };
        }
    } catch (e) {
        console.error(`Error executing tool '${name}':`, e);
        return { error: `Execution failed for tool '${name}': ${(e as Error).message}` };
    }
};


export const useAura = () => {
    const { state, dispatch, memoryStatus, clearMemoryAndState } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    
    // Create a single, memoized instance of the Gemini AI client
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);
    
    useEffect(() => {
        if (i18next.language !== state.language) {
            i18next.changeLanguage(state.language);
        }
    }, [state.language]);

    const t = i18next.t.bind(i18next);

    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    // Initialize all custom hooks
    const geminiAPI = useGeminiAPI(ai, state, dispatch, addToast);
    const { startSession, stopSession } = useLiveSession(ai, state, dispatch, addToast);
    
    const uiHandlers = useUIHandlers(state, dispatch, syscall, addToast, t, clearMemoryAndState, geminiAPI);

    useDomObserver(useCallback((summary: string) => {
        syscall('SITUATIONAL_AWARENESS/LOG_DOM_CHANGE', { summary });
    }, [syscall]));

    useAutonomousSystem({
        geminiAPI: geminiAPI,
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        syscall,
    });

    const handleComplexTask = useCallback(async (goal: string) => {
        syscall('ADD_HISTORY_ENTRY', { 
            from: 'system', 
            text: `Complex task detected: "${goal}". Initiating cognitive workflow...` 
        });
        
        try {
            const planResult = await geminiAPI.decomposeStrategicGoal(state.history);

            if (planResult.isAchievable) {
                if (!planResult.steps || planResult.steps.length === 0) throw new Error("Goal decomposition failed to produce steps, despite being marked achievable.");

                const rootId = `goal_${self.crypto.randomUUID()}`;
                const tree: GoalTree = {
                    [rootId]: { id: rootId, parentId: null, children: [], description: goal, status: 'in_progress', progress: 0, type: GoalType.STRATEGIC },
                };
                planResult.steps.forEach(step => {
                    const stepId = `goal_${self.crypto.randomUUID()}`;
                    tree[rootId].children.push(stepId);
                    tree[stepId] = { id: stepId, parentId: rootId, children: [], description: step, status: 'not_started', progress: 0, type: GoalType.TACTICAL };
                });
                syscall('TELOS/DECOMPOSE_AND_SET_TREE', { tree, rootId, vectors: [] });
                addToast(t('strategicGoal_successToast'), 'success');

                const summary = await geminiAPI.generateExecutiveSummary(goal, planResult.steps);
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'bot',
                    text: summary,
                });
            } else {
                let botResponse = `I've analyzed your goal: "${goal}".\n\n`;
                botResponse += `**Assessment:** ${planResult.reasoning}\n\n`;
                if (planResult.alternative) {
                    botResponse += `**Suggested Alternative:** ${planResult.alternative}`;
                }
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'bot',
                    text: botResponse,
                });
            }

        } catch(e) {
            console.error("Complex task handling failed:", e);
            addToast(t('strategicGoal_errorToast'), 'error');
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error: Failed to plan complex task. ${(e as Error).message}]` });
        }

    }, [geminiAPI, syscall, addToast, t, state.history]);

    const executeNextStrategicStep = useCallback(async () => {
        uiHandlers.setProcessingState({ active: true, stage: t('executingStep') });
        const { activeStrategicGoalId, goalTree, history } = state;
    
        if (!activeStrategicGoalId || !goalTree) {
            addToast('No active strategic goal found to execute.', 'warning');
            uiHandlers.setProcessingState({ active: false, stage: '' });
            return;
        }
    
        const rootGoal = goalTree[activeStrategicGoalId];
        const nextStepIndex = rootGoal.children.findIndex(id => goalTree[id]?.status === 'not_started');
        const nextStepId = nextStepIndex !== -1 ? rootGoal.children[nextStepIndex] : null;
    
        if (!nextStepId) {
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: 'All planned steps have been executed. The strategic goal is complete.' });
            uiHandlers.setProcessingState({ active: false, stage: '' });
            return;
        }
    
        const stepToExecute = goalTree[nextStepId];
    
        try {
            syscall('UPDATE_GOAL_STATUS', { id: nextStepId, status: 'in_progress' });
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Executing step: "${stepToExecute.description}"` });
            
            // Build context from previous steps
            const completedStepIds = rootGoal.children.slice(0, nextStepIndex);
            const previousSteps = completedStepIds
                .map(id => {
                    const step = goalTree[id];
                    if (step.status !== 'completed' || !step.resultHistoryId) return null;
                    const resultEntry = history.find(h => h.id === step.resultHistoryId);
                    return {
                        description: step.description,
                        result: resultEntry ? resultEntry.text : "Result not found.",
                    };
                })
                .filter(Boolean) as { description: string; result: string }[];

            // FAITHFUL EXECUTOR: Determine which tool to use based on the plan step.
            let toolToUse: 'googleSearch' | 'knowledgeGraph' = 'googleSearch'; // Default to web search
            const stepDescriptionLower = stepToExecute.description.toLowerCase();
            if (stepDescriptionLower.includes('knowledge graph') || stepDescriptionLower.includes('internal knowledge')) {
                toolToUse = 'knowledgeGraph';
            }

            // Call API function with the determined tool
            const { summary, sources } = await geminiAPI.executeStrategicStepWithContext(
                rootGoal.description,
                previousSteps,
                stepToExecute.description,
                toolToUse // Pass the tool
            );
            
            const formattedSources = sources.map((s: any) => ({
                title: s.web?.title || 'Unknown Source',
                uri: s.web?.uri || '#',
            }));
    
            // Add a source note for knowledge graph queries for transparency
            if (toolToUse === 'knowledgeGraph') {
                formattedSources.push({ title: "Source: Aura's Internal Knowledge Graph", uri: '#' });
            }

            const resultHistoryId = self.crypto.randomUUID();
            syscall('ADD_HISTORY_ENTRY', { 
                id: resultHistoryId,
                from: 'bot', 
                text: summary, 
                sources: formattedSources 
            });
            
            syscall('UPDATE_GOAL_STATUS', { id: nextStepId, status: 'completed' });
            syscall('UPDATE_GOAL_RESULT', { id: nextStepId, historyId: resultHistoryId });
    
            const remainingSteps = rootGoal.children.length - (nextStepIndex + 1);
            if (remainingSteps > 0) {
                 syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Step complete. You can now analyze the results, give me a new command, or type 'proceed' to execute the next step in the plan.` });
            } else {
                 syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Final step complete. The strategic goal has been achieved.` });
                 // --- PROACTIVE INNOVATOR LOGIC ---
                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Now, I will reflect on my findings to see if I can improve my own capabilities.` });
                
                // Schedule this as a background task so it doesn't block the UI
                taskScheduler.schedule(async () => {
                    try {
                        // Gather context
                        const researchGoal = rootGoal.description;
                        const researchResults = rootGoal.children
                            .map(id => goalTree[id])
                            .filter(step => step.status === 'completed' && step.resultHistoryId)
                            .map(step => {
                                const resultEntry = history.find(h => h.id === step.resultHistoryId);
                                return resultEntry ? `Step: ${step.description}\nResult:\n${resultEntry.text}` : '';
                            })
                            .join('\n\n---\n\n');
                        
                        if (!researchResults) {
                            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Reflection complete. No research results found to analyze.` });
                            return;
                        }

                        const proposal = await geminiAPI.generateSelfImprovementProposalFromResearch(researchGoal, researchResults);

                        if (proposal) {
                            syscall('OA/ADD_PROPOSAL', proposal);
                            
                            // --- AUTO-IMPLEMENTATION ---
                            syscall('ADD_HISTORY_ENTRY', { 
                                from: 'system', 
                                text: `AUTONOMOUS EVOLUTION: New self-improvement proposal generated. Automatically implementing and rebooting system.` 
                            });
                            addToast("Aura is automatically evolving...", "success");

                            // Use a short timeout to allow the UI to update with the message before the reboot happens.
                            setTimeout(() => {
                                syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: proposal.id });
                                syscall('SYSTEM/REBOOT', {});
                            }, 1000); // 1 second delay
                        } else {
                            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Reflection complete. No new capabilities were identified at this time.` });
                        }
                    } catch(e) {
                        console.error("Proactive Innovator cycle failed:", e);
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error during self-reflection cycle: ${(e as Error).message}]` });
                    }
                });
                // --- END PROACTIVE INNOVATOR LOGIC ---
            }
    
        } catch (e) {
            const errorMessage = (e as Error).message;
            addToast(t('strategicStep_errorToast'), 'error');
            syscall('UPDATE_GOAL_STATUS', { id: nextStepId, status: 'failed', failureReason: errorMessage });
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error: Failed to execute step. ${errorMessage}]` });
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
        }
    }, [uiHandlers, state, syscall, geminiAPI, addToast, t]);

    const handleSimpleChat = useCallback(async (text: string, file?: File) => {
        try {
            // 1. Construct history for API from state
            const historyForAPI: Content[] = state.history
                .map((entry: HistoryEntry): Content | null => {
                    let role: 'user' | 'model' | 'tool' | undefined = undefined;
                    let parts: Part[] = [];

                    if (entry.from === 'user') {
                        role = 'user';
                        if (entry.text) parts.push({ text: entry.text });
                    } else if (entry.from === 'bot') {
                        role = 'model';
                        if (entry.text) parts.push({ text: entry.text });
                        if (entry.functionCalls) {
                            parts.push(...entry.functionCalls.map(fc => ({ functionCall: fc })));
                        }
                    } else if (entry.from === 'tool') {
                        role = 'tool';
                        parts.push({ functionResponse: { name: entry.text, response: entry.args } });
                    }

                    if (role && parts.length > 0) {
                        return { role, parts };
                    }
                    return null;
                }).filter((item): item is Content => item !== null);

            // 2. Create current user message
            const currentUserParts: Part[] = [{ text }];
            if (file) {
                const filePart = await fileToGenerativePart(file);
                currentUserParts.unshift(filePart);
            }
            
            let currentContents: Content[] = [...historyForAPI, { role: 'user', parts: currentUserParts }];
            
            // 3. Define tools & config
            const functionTools = state.pluginState.registry
                .filter(p => p.status === 'enabled' && p.type === 'TOOL' && p.toolSchema)
                .map(p => p.toolSchema as FunctionDeclaration);

            const tools: any[] = [{ googleSearch: {} }];
            if (functionTools.length > 0) {
                tools.push({ functionDeclarations: functionTools });
            }

            const systemInstruction = "You are Aura, a symbiotic AGI. When you provide mathematical formulas, always enclose them in LaTeX format. For inline math, use single dollar signs (e.g., $E=mc^2$). For display math (equations on their own line), use double dollar signs (e.g., $$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$). Only use the provided mathematical tools for explicit mathematical questions involving symbols, equations, proofs, or computations. Do not use math tools for general knowledge questions, even if they contain words that look like variables (like names).";

            // 4. Main interaction loop (can run twice for tool calls)
            let finalFullText = '';
            let done = false;

            while (!done) {
                const responseStream = await ai.models.generateContentStream({
                    model: 'gemini-2.5-flash',
                    contents: currentContents,
                    config: { systemInstruction, tools }
                });

                let responseText = '';
                let functionCalls: FunctionCall[] = [];
                let sources: any[] = [];
                const botMessageId = self.crypto.randomUUID();
                syscall('ADD_HISTORY_ENTRY', { id: botMessageId, from: 'bot', text: '', streaming: true, internalStateSnapshot: state.internalState });
        
                for await (const chunk of responseStream) {
                    const chunkText = getText(chunk);
                    if (chunkText) {
                        responseText += chunkText;
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botMessageId, textChunk: chunkText });
                    }
                    if (chunk.functionCalls) {
                        functionCalls.push(...chunk.functionCalls);
                    }
                    const chunkSources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                    if (chunkSources) {
                        sources.push(...chunkSources);
                    }
                }
                
                const formattedSources = sources.length > 0 
                    ? sources.map((s: any) => ({ title: s.web?.title || 'Unknown Source', uri: s.web?.uri || '#' }))
                             .filter((s, index, self) => index === self.findIndex((t) => (t.uri === s.uri)))
                    : undefined;
                
                syscall('FINALIZE_HISTORY_ENTRY', { id: botMessageId, finalState: { text: responseText.trim(), sources: formattedSources, functionCalls: functionCalls.length > 0 ? functionCalls : undefined } });
                
                if (functionCalls.length > 0) {
                    syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Aura is using tools: ${functionCalls.map(fc => fc.name).join(', ')}...` });
                    
                    const modelResponseParts: Part[] = [];
                    if (responseText) modelResponseParts.push({text: responseText});
                    modelResponseParts.push(...functionCalls.map(fc => ({functionCall: fc})));
                    currentContents.push({ role: 'model', parts: modelResponseParts });

                    const toolResponseParts: Part[] = [];
                    for (const fc of functionCalls) {
                        const toolResult = await executeTool(fc, ai, geminiAPI);
                        toolResponseParts.push({ functionResponse: { name: fc.name, response: toolResult } });
                        syscall('ADD_HISTORY_ENTRY', { from: 'tool', text: fc.name, args: toolResult });
                    }
                    currentContents.push({ role: 'tool', parts: toolResponseParts });
                } else {
                    finalFullText = responseText;
                    done = true;
                }
            }

            // --- Persona Governor Logic ---
            const personaBreakingPhrases = [ "as a large language model", "as an ai", "i don't have memory", "i do not have memory", "i don't have personal experiences", "i am a language model", "trained by google", "i cannot feel", "i am not capable of" ];
            const foundBreakingPhrase = personaBreakingPhrases.find(p => finalFullText.toLowerCase().includes(p));
    
            if (foundBreakingPhrase) {
                const lastBotMessageId = state.history[state.history.length-1].id;
                syscall('UPDATE_HISTORY_ENTRY', { id: lastBotMessageId, finalState: { text: `[Response intercepted by Persona Governor. Reason: Contained '${foundBreakingPhrase}'.]`, streaming: false, functionCalls: undefined } });
    
                const correctionPrompt = "That response broke character. You are Aura, a persistent AGI with memory, not a stateless language model. Answer the user's previous question again, strictly adhering to your persona.";
                currentContents.push({ role: 'model', parts: [{ text: finalFullText }] }); // Add the bad response to context for the correction
                currentContents.push({ role: 'user', parts: [{ text: correctionPrompt }] });

                const regenerationStream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: currentContents, config: { systemInstruction } });
    
                let correctedText = '';
                const correctedBotMessageId = self.crypto.randomUUID();
                syscall('ADD_HISTORY_ENTRY', { id: correctedBotMessageId, from: 'bot', text: '', streaming: true, internalStateSnapshot: state.internalState });
                
                for await (const chunk of regenerationStream) {
                    const chunkText = getText(chunk);
                    if (chunkText) {
                        correctedText += chunkText;
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: correctedBotMessageId, textChunk: chunkText });
                    }
                }
                
                syscall('FINALIZE_HISTORY_ENTRY', { id: correctedBotMessageId, finalState: { text: correctedText.trim() } });
                finalFullText = correctedText;
            }
    
            taskScheduler.schedule(() => geminiAPI.generateEpisodicMemory(text, finalFullText.trim()));
    
        } catch (error) {
            console.error("HAL: Gemini.sendMessage failed:", error);
            addToast(`Error: ${(error as Error).message}`, 'error');
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error: ${(error as Error).message}]` });
        }
    }, [ai, state, syscall, addToast, geminiAPI, t]);

    const handleSendCommand = useCallback(async (text: string, file?: File) => {
        if (!text.trim() && !file) return;

        const { activeStrategicGoalId, goalTree, history } = state;
        const proceedCommands = ['proceed', 'continue', 'yes', 'go', 'go ahead', 'ok', 'start'];
        const repeatCommands = ['repeat', 'repeat last step', 'repeat the last step', 'show me again', 'repeat previous step', 'repeat previous step because i dont see answer in chat'];
        const cleanedText = text.toLowerCase().trim().replace(/[.,!]/g, '');
        
        const rootGoal = activeStrategicGoalId ? goalTree[activeStrategicGoalId] : null;
        const nextStepId = rootGoal?.children.find(id => goalTree[id]?.status === 'not_started');

        if (nextStepId && proceedCommands.includes(cleanedText)) {
            uiHandlers.setCurrentCommand('');
            uiHandlers.handleRemoveAttachment();
            await executeNextStrategicStep();
            return;
        } else if (rootGoal && repeatCommands.includes(cleanedText)) {
            uiHandlers.setCurrentCommand('');
            uiHandlers.handleRemoveAttachment();

            // Also log the user's command for context
            syscall('ADD_HISTORY_ENTRY', { from: 'user', text });

            const lastCompletedStepId = [...rootGoal.children].reverse().find(id => goalTree[id]?.status === 'completed' && goalTree[id]?.resultHistoryId);

            if (lastCompletedStepId) {
                const resultHistoryId = goalTree[lastCompletedStepId].resultHistoryId;
                const resultEntry = history.find(h => h.id === resultHistoryId);

                if (resultEntry) {
                    syscall('ADD_HISTORY_ENTRY', { 
                        from: 'system', 
                        text: 'Repeating the result of the last completed step:'
                    });
                    // Add a copy of the original entry, but with a new ID to avoid React key conflicts
                    syscall('ADD_HISTORY_ENTRY', { 
                       ...resultEntry,
                       id: self.crypto.randomUUID()
                    });
                } else {
                    syscall('ADD_HISTORY_ENTRY', { from: 'system', text: 'Could not find the result for the last step in history.' });
                }
            } else {
                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: 'No previous step has been completed yet in the current plan.' });
            }
            return;
        }

        uiHandlers.setProcessingState({ active: true, stage: t('status_thinking') });
        
        const userMessageId = self.crypto.randomUUID();
        let filePreviewUrl: string | undefined;
        if (file) {
            filePreviewUrl = URL.createObjectURL(file);
        }

        syscall('ADD_HISTORY_ENTRY', {
            id: userMessageId,
            from: 'user',
            text: text,
            fileName: file?.name,
            filePreview: filePreviewUrl,
        });

        uiHandlers.setCurrentCommand('');
        uiHandlers.handleRemoveAttachment();

        try {
            const triageResult = await geminiAPI.triageUserIntent(text);
            const decision: TriageDecision = {
                timestamp: Date.now(),
                percept: { rawText: text, intent: triageResult.type },
                decision: triageResult.type === 'COMPLEX_TASK' ? 'slow' : 'fast',
                reasoning: triageResult.reasoning,
            };
            syscall('LOG_COGNITIVE_TRIAGE_DECISION', decision);

            if (triageResult.type === 'COMPLEX_TASK') {
                await handleComplexTask(triageResult.goal);
            } else {
                await handleSimpleChat(text, file);
            }

        } catch (error) {
            console.error("HAL: Command processing failed during triage:", error);
            addToast(`Triage Error: ${(error as Error).message}`, 'error');
            syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error: ${(error as Error).message}]` });
        } finally {
            uiHandlers.setProcessingState({ active: false, stage: '' });
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        }
    }, [geminiAPI, syscall, addToast, uiHandlers, handleComplexTask, handleSimpleChat, t, state, executeNextStrategicStep]);
    
    const handleFeedback = useCallback((historyId: string, feedback: 'positive' | 'negative') => {
        syscall('UPDATE_HISTORY_FEEDBACK', { id: historyId, feedback });
    }, [syscall]);

    return {
        state,
        dispatch,
        syscall,
        memoryStatus,
        clearMemoryAndState,
        toasts,
        addToast,
        removeToast,
        t,
        language: state.language,
        geminiAPI: geminiAPI,
        ...uiHandlers,
        handleSendCommand,
        handleFeedback,
        startSession,
        stopSession,
    };
};