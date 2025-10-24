// hooks/useAura.ts
import { useMemo, useEffect, useRef } from 'react';
import { useAuraState } from './useAuraState.ts';
import { useGeminiAPI } from './useGeminiAPI.ts';
import { useUIHandlers } from './useUIHandlers.ts';
import { useToasts } from './useToasts.ts';
import { useAutonomousSystem } from './useAutonomousSystem.ts';
import { useToolExecution } from './useToolExecution.ts';
import { HAL } from '../core/hal.ts';
import { SyscallCall, HistoryEntry, ConceptualProofStrategy, Hypothesis, HeuristicPlan, DesignHeuristic, Persona } from '../types.ts';
import { GoogleGenAI } from '@google/genai';
import { useDomObserver } from './useDomObserver.ts';
import { useLiveSession } from './useLiveSession.ts';
import { useTranslation } from 'react-i18next';
import { personas } from '../state/personas.ts';

let ai: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
    if (ai) return ai;
    if (process.env.API_KEY) {
        try {
            ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            return ai;
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            throw new Error("Failed to initialize Gemini API. Check API Key.");
        }
    }
    console.error("API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set.");
};

export const useAura = () => {
    const { state, dispatch, memoryStatus, clearMemoryAndState } = useAuraState();
    const { toasts, addToast, removeToast } = useToasts();
    const { t, i18n } = useTranslation();

    // This effect syncs i18next language with app state language
    useEffect(() => {
        if (i18n.language !== state.language) {
            i18n.changeLanguage(state.language);
        }
    }, [state.language, i18n]);

    const aiInstance = useMemo(() => getAI(), []);

    const syscall = (call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    };

    const geminiAPI = useGeminiAPI(aiInstance, state, dispatch, addToast);
    
    const uiHandlers = useUIHandlers(state, dispatch, syscall, addToast, t, clearMemoryAndState, geminiAPI);

    useAutonomousSystem({
        geminiAPI,
        state,
        dispatch,
        addToast,
        t,
        isPaused: uiHandlers.isPaused,
        syscall,
    });
    
    useDomObserver((summary: string) => {
        syscall('SITUATIONAL_AWARENESS/LOG_DOM_CHANGE', { summary });
    });
    
    useToolExecution({
        syscall,
        addToast,
        toolExecutionRequest: state.toolExecutionRequest,
        state,
    });

    const liveSession = useLiveSession(aiInstance, state, dispatch, addToast);

    const commandToProcess = useRef<{ command: string; file?: File } | null>(null);

    const processCommand = async (command: string, file?: File) => {
        // 1. Triage the intent
        const triageResult = await geminiAPI.triageUserIntent(command);

        // 3. Log the triage decision for transparency
        syscall('ADD_HISTORY_ENTRY', { 
            from: 'system', 
            text: `Cognitive Triage: Classified as '${triageResult.type}'. Goal: "${triageResult.goal}". Reasoning: ${triageResult.reasoning}`
        });

        // 2. Route to the correct handler
        switch (triageResult.type) {
            case 'SYMBOLIC_REASONING_SOLVER': {
                if (!file) {
                    syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: "Please provide the puzzle image for me to solve." });
                    return;
                }
            
                const runSolver = async () => {
                    uiHandlers.setProcessingState({ active: true, stage: 'Initiating Solver...' });
                    const botResponseId = self.crypto.randomUUID();
                    syscall('ADD_HISTORY_ENTRY', { id: botResponseId, from: 'bot', text: '', streaming: true });
            
                    try {
                        // Step 1: Announce
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: "Initiating Symbolic Reasoning Solver for abstract puzzle...\n\n" });
                        uiHandlers.setProcessingState({ active: true, stage: 'Extracting puzzle features...' });
            
                        // Step 2: Feature Extraction
                        const features = await geminiAPI.extractPuzzleFeatures(file);
                        const featureText = `**1. Perception & Feature Extraction:**\n\`\`\`json\n${JSON.stringify(features, null, 2)}\n\`\`\`\n\n`;
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: featureText });
                        
                        // NEW Step: Meta-Learning Strategy Selection
                        uiHandlers.setProcessingState({ active: true, stage: 'Classifying puzzle archetype...' });
                        const classification = await geminiAPI.classifyPuzzleArchetype(features);
                        const classificationText = `**2. Meta-Learning Strategy Selection:**\n- **Archetype:** ${classification.archetype}\n- **Confidence:** ${(classification.confidence * 100).toFixed(0)}%\n- **Source:** ${classification.source}\n- **Reasoning:** ${classification.reasoning}\n\n`;
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: classificationText });

                        // Step 3: Heuristic Planning
                        uiHandlers.setProcessingState({ active: true, stage: 'Generating heuristic plan...' });
                        const plan = await geminiAPI.generateHeuristicPlan(features, state.heuristicsForge.designHeuristics, classification.archetype);
                        let planText = `**3. Heuristic Plan Generation:**\n`;
                        plan.forEach((step, i) => {
                            planText += `- **Step ${i+1}:** ${step}\n`;
                        });
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: planText + '\n' });

                        // Step 4: Conditional Hypothesis Synthesis
                        uiHandlers.setProcessingState({ active: true, stage: 'Synthesizing Über-Hypothesis...' });
                        const uberHypothesis = await geminiAPI.generateConditionalHypothesis(features, plan, classification.archetype);
                        const hypothesisText = `**4. Conditional Hypothesis Synthesis (Über-Hypothesis):**\n- **H1:** ${uberHypothesis.description}\n\n`;
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: hypothesisText });
            
                        // Step 5: Verification
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `**5. Hypothesis Verification (Simulated Sandbox):**\n` });
                        uiHandlers.setProcessingState({ active: true, stage: `Verifying Über-Hypothesis...` });
                        const verification = await geminiAPI.verifyHypothesis(features, uberHypothesis);
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `- **H1:** ${verification.status} (${verification.reason})\n` });
            
                        if (verification.status !== 'VALID') {
                             syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `\n\n**Conclusion:** The synthesized hypothesis was invalid. I will now analyze the failure to propose architectural improvements.\n\n` });
                            uiHandlers.setProcessingState({ active: true, stage: `Analyzing failure...` });

                            const improvementReport = await geminiAPI.analyzeSolverFailureAndProposeImprovements(features, uberHypothesis, verification.reason);
                            
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: improvementReport });
                            return; // Stop the process
                        }
            
                        // Step 6: Application
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `\n**6. Solution Application:**\n` });
                        uiHandlers.setProcessingState({ active: true, stage: `Applying solution...` });
                        
                        const stream = await geminiAPI.applySolution(features.test_input, uberHypothesis);
                        let fullSolutionText = '';
                        for await (const chunk of stream) {
                            const text = chunk.text;
                            if (text) {
                                fullSolutionText += text;
                                syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: text });
                            }
                        }

                        // NEW STEP: Generate and append summary for clarity
                        uiHandlers.setProcessingState({ active: true, stage: 'Summarizing solution...' });
                        const summary = await geminiAPI.summarizePuzzleSolution(fullSolutionText);
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `\n\n**Final Output Summary:**\n${summary}` });

                        // Step 7: Learn from Success (Heuristics Forge)
                        uiHandlers.setProcessingState({ active: true, stage: `Generalizing successful strategy...` });
                        const newHeuristic = await geminiAPI.generateHeuristicFromSuccess(features, plan, uberHypothesis);
                        if (newHeuristic) {
                            syscall('HEURISTICS_FORGE/ADD_HEURISTIC', newHeuristic);
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `\n\n**Learning:** Successfully applied strategy has been saved as a new design heuristic: "${newHeuristic.heuristic}"` });
                        }
            
                    } catch (e) {
                        const errorMessage = `Symbolic Reasoning Solver failed: ${(e as Error).message}`;
                        console.error(errorMessage);
                        syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: `\n\n[ERROR] ${errorMessage}` });
                    } finally {
                        syscall('FINALIZE_HISTORY_ENTRY', { id: botResponseId, finalState: {} });
                        uiHandlers.setProcessingState({ active: false, stage: '' });
                    }
                };
            
                runSolver();
                break;
            }
            case 'VISION_ANALYSIS': {
                if (!file) {
                    syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: "Please attach an image for me to analyze." });
                    return;
                }
                uiHandlers.setProcessingState({ active: true, stage: 'Analyzing image...' });
                const botResponseId = self.crypto.randomUUID();
                syscall('ADD_HISTORY_ENTRY', { id: botResponseId, from: 'bot', text: '', streaming: true });
                try {
                    const stream = await geminiAPI.analyzeImage(command, file);
                    let fullText = '';
                    for await (const chunk of stream) {
                        const text = chunk.text;
                        if (text) {
                            fullText += text;
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: text });
                        }
                    }
                    syscall('FINALIZE_HISTORY_ENTRY', { id: botResponseId, finalState: { text: fullText } });
                } catch (e) {
                    const errorMessage = `Error during image analysis: ${(e as Error).message}`;
                    console.error(errorMessage);
                    syscall('FINALIZE_HISTORY_ENTRY', { id: botResponseId, finalState: { text: `[${errorMessage}]` } });
                } finally {
                    uiHandlers.setProcessingState({ active: false, stage: '' });
                }
                break;
            }
            case 'COMPLEX_TASK':
                const onSetGoal = async (goal: string) => {
                    uiHandlers.setProcessingState({ active: true, stage: 'Decomposing Strategic Goal...' });
                    try {
                        const historyForDecomposition: HistoryEntry[] = [...state.history, { id: 'temp_goal', from: 'user', text: goal, timestamp: Date.now() }];
                        const decomposition = await geminiAPI.decomposeStrategicGoal(historyForDecomposition);
                        
                        if (decomposition.isAchievable) {
                            syscall('BUILD_GOAL_TREE', { decomposition, rootGoal: goal });
                            const summary = await geminiAPI.generateExecutiveSummary(goal, decomposition.steps);
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: summary });
                        } else {
                            let failureMessage = `I am unable to achieve the goal "${goal}". Reason: ${decomposition.reasoning}`;
                            if (decomposition.alternative) {
                                failureMessage += `\n\nPerhaps we could try this instead: "${decomposition.alternative}"`;
                            }
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: failureMessage });
                        }
                    } catch (e) {
                        const errorMessage = `Failed to decompose goal: ${(e as Error).message}`;
                        console.error(errorMessage);
                        addToast(errorMessage, 'error');
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[System Error: ${errorMessage}]` });
                    } finally {
                        uiHandlers.setProcessingState({ active: false, stage: '' });
                    }
                };
                syscall('MODAL/OPEN', { 
                    type: 'strategicGoal', 
                    payload: { 
                        initialGoal: triageResult.goal,
                        onSetGoal: onSetGoal,
                        isProcessing: uiHandlers.processingState.active
                    } 
                });
                break;
            case 'BRAINSTORM':
                syscall('MODAL/OPEN', { type: 'brainstorm', payload: { initialTopic: triageResult.goal } });
                break;
            
            case 'BRAINSTORM_SCIFI_COUNCIL': {
                const council_ids = [
                    'isaac_asimov', 'philip_k_dick', 'arthur_c_clarke', 'william_gibson',
                    'stanislaw_lem', 'iain_m_banks', 'greg_egan', 'ted_chiang'
                ];
                const councilPersonas = personas.filter((p: Persona) => council_ids.includes(p.id));
                syscall('MODAL/OPEN', { 
                    type: 'brainstorm', 
                    payload: { 
                        initialTopic: triageResult.goal,
                        personas: councilPersonas
                    } 
                });
                break;
            }

            case 'MATHEMATICAL_PROOF':
                // Variant B: The Research Simulator
                (async () => {
                    uiHandlers.setProcessingState({ active: true, stage: 'Initiating Proof Attempt...' });
                    
                    try {
                        // 1. Generate a high-level conceptual strategy
                        uiHandlers.setProcessingState({ stage: 'Devising Conceptual Strategy...' });
                        const strategy: ConceptualProofStrategy = await geminiAPI.generateConceptualProofStrategy(triageResult.goal);
                        
                        // 2. Build the proof plan (goal tree) in the state
                        syscall('BUILD_PROOF_TREE', { strategy, rootGoal: triageResult.goal });
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                        // 3. Inform user of the plan
                        let planMessage = `I will attempt to solve "${triageResult.goal}" by following this conceptual plan:\n\n`;
                        planMessage += `**Analysis:** ${strategy.problem_analysis}\n\n`;
                        planMessage += `**Strategic Steps:**\n${strategy.strategic_plan.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: planMessage });

                        // Announce the research simulation
                        syscall('ADD_HISTORY_ENTRY', { 
                            from: 'system', 
                            text: `This is a frontier problem in mathematics. I will now begin a **research simulation** to precisely identify the knowledge and tool gaps in my architecture. I will document the failure point of each strategic step.`
                        });

                        // 4. Simulate attempting each step with detailed failure logging.
                        const failureLogs: string[] = [];
                        
                        for (const [index, step] of strategy.strategic_plan.entries()) {
                            uiHandlers.setProcessingState({ stage: `Simulating Step ${index + 1}: ${step.substring(0, 30)}...` });
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work

                            let failureReason = '';
                            const stepLower = step.toLowerCase();

                            // Check for specific, known-hard concepts that are not in the knowledge base
                            if (stepLower.includes('p-adic') || stepLower.includes('iwasawa') || stepLower.includes('tate-shafarevich')) {
                                const missingConcept = stepLower.includes('p-adic') ? 'p-adic L-functions' : stepLower.includes('iwasawa') ? 'Iwasawa Theory' : 'Tate-Shafarevich group';
                                failureReason = `The concept '${missingConcept}' is not defined in my knowledge bases. My \`formal_proof_assistant\` cannot operate on undefined objects.`;
                            } 
                            // Check if the step requires inventing new mathematics
                            else if (stepLower.includes('construct a universal theory') || stepLower.includes('generalize') || stepLower.includes('new methods')) {
                                failureReason = `This step requires the creation of new mathematics, not just the application of existing knowledge. My architecture has no mechanism for true mathematical invention.`;
                            } 
                            // Check for concepts that require advanced tooling beyond simple definitions
                            else if (stepLower.includes('finiteness of') || stepLower.includes('cohomology')) {
                                failureReason = `The tools required for this step, such as advanced cohomological calculations, are not implemented in my current \`formal_proof_assistant\`.`;
                            }
                            // Generic failure if no specific keyword is matched
                            else {
                                failureReason = `The formal verification of the logical steps required in this phase is beyond the capabilities of my current toolset.`;
                            }

                            const failureMessage = `Attempting Step ${index + 1}: *"${step}"*...\n\n**FAILURE.**\n**Reason:** ${failureReason}`;
                            
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: failureMessage });
                            failureLogs.push(failureReason); // Push the reason for the final summary
                        }

                        // 5. Analyze the failure and generate a heuristic
                        uiHandlers.setProcessingState({ stage: 'Analyzing Failure & Generating Heuristic...' });
                        const combinedLog = failureLogs.join('\n');
                        const heuristic = await geminiAPI.analyzeProofStrategy(triageResult.goal, 'failed', combinedLog);
                        
                        // 6. Save the new heuristic to the state
                        syscall('HEURISTICS_FORGE/ADD_HEURISTIC', heuristic);
                        
                        // 7. Report the final outcome to the user
                        let finalReport = `I have completed the research simulation. **The attempt failed.**\n\n`;
                        finalReport += `**Failure Analysis:**\nBased on the step-by-step audit, the primary obstacle was a combination of missing foundational knowledge and a lack of the rigorous, axiom-based deductive power of a true formal proof assistant.\n\n`;
                        finalReport += `**Architectural Improvement Generated:**\nBased on this failure, I have generated and logged a new design heuristic:\n\n> _"${heuristic.heuristic}"_`;
                        
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: finalReport });

                    } catch (e) {
                        const errorMessage = `Error during proof attempt: ${(e as Error).message}`;
                        console.error(errorMessage);
                        addToast(errorMessage, 'error');
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `[System Error during proof attempt: ${errorMessage}]` });
                    } finally {
                        uiHandlers.setProcessingState({ active: false, stage: '' });
                    }
                })();
                break;

            case 'SIMPLE_CHAT':
            default:
                const botResponseId = self.crypto.randomUUID();
                syscall('ADD_HISTORY_ENTRY', { id: botResponseId, from: 'bot', text: '', streaming: true, internalStateSnapshot: state.internalState });
                
                try {
                    const stream = await geminiAPI.generateChatResponse(state.history);
                    let fullText = '';
                    for await (const chunk of stream) {
                        const text = chunk.text;
                        if (text) {
                            fullText += text;
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: botResponseId, textChunk: text });
                        }
                    }
                    syscall('FINALIZE_HISTORY_ENTRY', { id: botResponseId, finalState: { text: fullText } });
                    geminiAPI.generateEpisodicMemory(command, fullText);
                } catch (e) {
                    const errorMessage = `Error during chat generation: ${(e as Error).message}`;
                    console.error(errorMessage);
                    syscall('FINALIZE_HISTORY_ENTRY', { id: botResponseId, finalState: { text: `[${errorMessage}]` } });
                }
                break;
        }
    };

    const handleSendCommand = (command: string, file?: File) => {
        if (!command.trim() && !file) {
            return;
        }
        
        syscall('ADD_HISTORY_ENTRY', { from: 'user', text: command, fileName: file?.name });
        commandToProcess.current = { command, file };
        
        uiHandlers.setCurrentCommand('');
        uiHandlers.setAttachedFile(null);
    };

    useEffect(() => {
        if (commandToProcess.current) {
            const { command, file } = commandToProcess.current;
            commandToProcess.current = null; // Prevent re-running
            processCommand(command, file);
        }
    }, [state.history]); // Triggered after the user's message is added to history
    
    const handleFeedback = (id: string, feedback: 'positive' | 'negative') => {
        syscall('UPDATE_HISTORY_FEEDBACK', { id, feedback });
    };

    return {
        state,
        dispatch,
        syscall,
        memoryStatus,
        toasts,
        addToast,
        removeToast,
        t,
        i18n,
        language: i18n.language,
        geminiAPI,
        ...uiHandlers,
        ...liveSession,
        handleSendCommand,
        handleFeedback,
    };
};