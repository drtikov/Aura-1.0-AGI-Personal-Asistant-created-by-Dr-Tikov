// hooks/useAutonomousSystem.ts
import React, { useEffect, useRef } from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
// FIX: Imported the 'Persona' type to resolve a type error.
// FIX: Added TriageResult to import
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, AnalogicalHypothesisProposal, SelfProgrammingCandidate, AGISDecision, DesignHeuristic, GunaState, PerformanceLogEntry, SynthesizedSkill, KernelTaskType, UnifiedProposal, ArchitecturalChangeProposal, ProofStep, KnowledgeFact, KernelTask, TriageResult, Persona, CognitiveStrategy, ProofResult } from '../types.ts';
import { deriveInternalState } from '../core/stateDerivation.ts';
import { personas } from '../state/personas.ts';
import { businessAndFinanceKnowledge } from '../state/knowledge/businessAndFinance.ts';
import { entrepreneurNetworkData } from '../state/knowledge/entrepreneurNetwork.ts';
import { classifyHeuristically } from '../core/heuristicClassifier.ts';

export interface UseAutonomousSystemProps {
    geminiAPI: UseGeminiAPIResult;
    state: AuraState;
    // FIX: Changed React.Dispatch to Dispatch for consistency
    dispatch: React.Dispatch<Action>;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    t: (key: string, options?: any) => string;
    isPaused: boolean;
    syscall: (call: SyscallCall, args: any, traceId?: string) => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAutonomousSystem = ({
    geminiAPI,
    state,
    // FIX: Changed React.Dispatch to Dispatch for consistency
    dispatch,
    addToast,
    t,
    isPaused,
    syscall,
}: UseAutonomousSystemProps) => {
    const tickInterval = useRef<number | null>(null);
    const isProcessingTask = useRef(false);
    const { ethicalGovernorState } = state;

    // Effect for the main kernel tick
    useEffect(() => {
        const executeTick = () => {
            if (isPaused) return;
            const traceId = `trace_tick_${self.crypto.randomUUID()}`;

            syscall('KERNEL/TICK', {}, traceId);
            
            const derivedStateChanges = deriveInternalState(state);
            syscall('UPDATE_INTERNAL_STATE', derivedStateChanges, traceId);

            syscall('SPANDA/UPDATE_MANIFOLD_POSITION', {}, traceId);
            syscall('SOMATIC/UPDATE_ENERGY_STATE', {}, traceId);
            syscall('SYNAPTIC_MATRIX/UPDATE_METRICS', {}, traceId);

            // --- RESONANCE FIELD INTEGRATION ---
            // Decay all active frequencies with each tick
            syscall('RESONANCE/DECAY_FREQUENCIES', {}, traceId);
            // --- END INTEGRATION ---

            const tick = state.kernelState.tick + 1;
            const { taskFrequencies } = state.kernelState;
            
            // Queue periodic autonomous tasks
            for (const taskTypeStr in taskFrequencies) {
                const taskType = taskTypeStr as KernelTaskType;
                const frequency = taskFrequencies[taskType];
                if (frequency && tick % frequency === 0) {
                     syscall('KERNEL/QUEUE_TASK', {
                        id: `task_${self.crypto.randomUUID()}`,
                        type: taskType,
                        payload: {},
                        timestamp: Date.now(),
                        traceId,
                    }, traceId);
                }
            }
        };
        
        if (tickInterval.current) clearInterval(tickInterval.current);
        tickInterval.current = window.setInterval(executeTick, 1000);
        
        return () => {
            if (tickInterval.current) clearInterval(tickInterval.current);
        };
    }, [isPaused, syscall, state]);


    // Effect for processing the Kernel task queue
    useEffect(() => {
        const processQueue = async () => {
            if (isPaused || isProcessingTask.current || state.kernelState.taskQueue.length === 0) {
                return;
            }

            isProcessingTask.current = true;
            const task = state.kernelState.taskQueue[0];
            const traceId = task.traceId || `trace_task_${self.crypto.randomUUID()}`;
            
            syscall('KERNEL/SET_RUNNING_TASK', { task }, traceId);
            syscall('SET_INTERNAL_STATUS', 'thinking', traceId);

            try {
                switch (task.type) {
                    case KernelTaskType.GENERATE_CHAT_RESPONSE: {
                        const { command } = task.payload;
                        
                        const entryId = self.crypto.randomUUID();
                        
                        // Check for Iterative Refinement strategy
                        if (state.internalState.activeCognitiveStrategyId === 'strategy_iterative_refinement') {
                            const MAX_ITERATIONS = 3;
                            
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', id: entryId, text: '', streaming: true, internalStateSnapshot: state.internalState }, traceId);
                            syscall('REFINEMENT/START', { prompt: command, traceId, historyId: entryId });
                    
                            // Iteration 1: Draft
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: `**Cognitive Refinement Cycle (1/${MAX_ITERATIONS}): Drafting...**\n` }, traceId);
                            let currentDraft = await geminiAPI.generateRefinementDraft(command);
                            syscall('REFINEMENT/SET_DRAFT', { draft: currentDraft });
                    
                            let finalDraft = currentDraft;
                            let critique = '';
                    
                            for (let i = 1; i < MAX_ITERATIONS; i++) {
                                syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: `\n**Cycle (${i+1}/${MAX_ITERATIONS}): Critiquing...**\n` }, traceId);
                                critique = await geminiAPI.generateRefinementCritique(command, currentDraft);
                                
                                if (critique === 'OK') {
                                    syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: `Critique: OK. Draft is satisfactory.\n` }, traceId);
                                    break; // Exit loop if draft is good
                                }
                                
                                syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: `Critique:\n${critique}\n\n**Cycle (${i+1}/${MAX_ITERATIONS}): Refining...**\n` }, traceId);
                                const newDraft = await geminiAPI.refineDraftWithCritique(command, currentDraft, [critique]);
                                
                                syscall('REFINEMENT/ADD_CRITIQUE_AND_REFINE', { critique, newDraft });
                                currentDraft = newDraft;
                                finalDraft = newDraft;
                            }
                    
                            syscall('REFINEMENT/FINALIZE', { finalDraft });
                            syscall('UPDATE_HISTORY_ENTRY', { id: entryId, finalState: { text: `**Final Refined Response:**\n\n${finalDraft}`, streaming: false } }, traceId);
                    
                        } else {
                            // Original logic for normal chat response
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', id: entryId, text: '', streaming: true, internalStateSnapshot: state.internalState }, traceId);
                            const stream = await geminiAPI.generateChatResponse(state.history, state.internalState.activeCognitiveStrategyId, state.activeCognitiveMode);
                            let fullText = '';
                            for await (const chunk of stream) {
                                const textChunk = chunk.text ?? '';
                                fullText += textChunk;
                                syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: textChunk }, traceId);
                            }
                            syscall('FINALIZE_HISTORY_ENTRY', { id: entryId, finalState: { text: fullText, streaming: false } }, traceId);
                        }
                        
                        syscall('CLEAR_COGNITIVE_MODE', {}, traceId);
                        syscall('COGNITIVE/SET_STRATEGY', { strategyId: null }, traceId); // Reset strategy after chat
                        syscall('REFINEMENT/RESET', {}); // Always reset after completion
                        break;
                    }
                    case KernelTaskType.DECOMPOSE_STRATEGIC_GOAL: {
                        const { command } = task.payload;
                        const decomposition = await geminiAPI.decomposeStrategicGoal(state.history);
                        if (decomposition.isAchievable) {
                            syscall('BUILD_GOAL_TREE', { rootGoal: command, decomposition }, traceId);
                            const summary = await geminiAPI.generateExecutiveSummary(command, decomposition.steps);
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `I have decomposed the goal "${command}" into a multi-step plan. Here is the summary:\n\n${summary}\n\nYou can monitor the progress in the "Planning & Goals" panel.` }, traceId);
                        } else {
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: `I am unable to achieve that goal. **Reason:** ${decomposition.reasoning}\n\n**Alternative:** ${decomposition.alternative}` }, traceId);
                        }
                        break;
                    }
                    case KernelTaskType.RUN_BRAINSTORM_SESSION: {
                        const { goal } = task.payload.triageResult;
                        const customPersonas = task.payload.customPersonas;
                        syscall('BRAINSTORM/START', { topic: goal }, traceId);

                        const ideas = await geminiAPI.generateBrainstormingIdeas(goal, customPersonas);
                        ideas.forEach(idea => syscall('BRAINSTORM/ADD_IDEA', { idea }, traceId));

                        const winningIdea = await geminiAPI.synthesizeBrainstormWinner(goal, ideas);
                        syscall('BRAINSTORM/SET_WINNER', { winningIdea }, traceId);
                        
                        const proposalId = `proposal_brainstorm_${self.crypto.randomUUID()}`;
                        syscall('OA/ADD_PROPOSAL', { id: proposalId, timestamp: Date.now(), proposalType: 'geniality', area: 'synthesis', suggestion: winningIdea, reasoning: `Synthesized from a brainstorming session on '${goal}'.`, status: 'proposed' });

                        let brainstormText = `## Brainstorming Session: ${goal}\n\n`;
                        ideas.forEach(idea => {
                            brainstormText += `**${idea.personaName}:** ${idea.idea}\n\n`;
                        });
                        brainstormText += `### Synthesized Idea\n${winningIdea}`;
                        
                        syscall('HISTORY/CLEAR_PREVIOUS_BRAINSTORMS', {}, traceId);
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: brainstormText }, traceId);
                        
                        // Finalize *after* adding the entry to the chat, ensuring the modal closes once results are visible.
                        syscall('BRAINSTORM/FINALIZE', { finalProposalId: proposalId });
                        break;
                    }
                    case KernelTaskType.RUN_VISION_ANALYSIS: {
                        const { command, file } = task.payload;
                        if (!file) throw new Error("Vision analysis requires a file.");

                        const entryId = self.crypto.randomUUID();
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', id: entryId, text: '', streaming: true }, traceId);

                        const stream = await geminiAPI.analyzeImage(command, file);
                        for await (const chunk of stream) {
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: chunk.text ?? '' }, traceId);
                        }
                        syscall('FINALIZE_HISTORY_ENTRY', { id: entryId, finalState: { streaming: false } }, traceId);
                        break;
                    }
                    case KernelTaskType.RUN_MATHEMATICAL_PROOF: {
                        const { goal } = task.payload.triageResult;
                        const strategy = await geminiAPI.generateConceptualProofStrategy(goal);
                        syscall('BUILD_PROOF_TREE', { rootGoal: goal, strategy }, traceId);
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `ATP Coprocessor: Proof plan for "${goal}" generated. See the Proof Landscape Explorer for details.` }, traceId);
                        break;
                    }
                    case KernelTaskType.RUN_MARKET_ANALYSIS: {
                         const context = [...businessAndFinanceKnowledge, ...entrepreneurNetworkData].map(f => `${f.subject} ${f.predicate} ${f.object}.`).join('\n');
                         const analysis = await geminiAPI.analyzeMarketData(context);
                         syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: analysis }, traceId);
                         break;
                    }
                    case KernelTaskType.RUN_DOCUMENT_FORGE: {
                        const { goal } = task.payload;
                        syscall('DOCUMENT_FORGE/START_PROJECT', { goal }, traceId);
                        try {
                            const outline = await geminiAPI.generateDocumentOutline(goal);
                            syscall('DOCUMENT_FORGE/SET_OUTLINE', { outline }, traceId);

                            for (const chapter of outline.chapters) {
                                syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { isGenerating: true } }, traceId);
                                const content = await geminiAPI.generateChapterContent(outline.title, chapter.title, goal);
                                syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { content, isGenerating: false } }, traceId);
                                
                                // Randomly decide to generate a diagram for some chapters
                                if (Math.random() > 0.6) {
                                    syscall('DOCUMENT_FORGE/UPDATE_CHAPTER', { id: chapter.id, updates: { diagram: { description: `Diagram for ${chapter.title}`, isGenerating: true, imageUrl: null } } }, traceId);
                                    const diagramPrompt = await geminiAPI.generateDiagramFromText(content);
                                    syscall('DOCUMENT_FORGE/UPDATE_DIAGRAM', { chapterId: chapter.id, updates: { isGenerating: false, imageUrl: 'https://via.placeholder.com/400x225.png?text=Diagram+Placeholder' } }, traceId);
                                }
                            }
                            syscall('DOCUMENT_FORGE/FINALIZE_PROJECT', {}, traceId);
                        } catch (e) {
                             syscall('DOCUMENT_FORGE/SET_STATUS', { status: 'error', message: (e as Error).message }, traceId);
                        }
                        break;
                    }
                }
            } catch (e) {
                console.error(`Error processing task ${task.type}:`, e);
                addToast(t('task_processing_error', { taskType: task.type, error: (e as Error).message }), 'error');
                
                if (task.type === KernelTaskType.RUN_BRAINSTORM_SESSION) {
                    syscall('BRAINSTORM/FINALIZE', { finalProposalId: null });
                }

                if (task.type === KernelTaskType.GENERATE_CHAT_RESPONSE || task.type === KernelTaskType.RUN_VISION_ANALYSIS) {
                    const entryId = task.traceId ? state.history.find(h => h.id.startsWith('bot_') && (h as any).traceId === task.traceId)?.id : undefined;
                    if (entryId) {
                         syscall('FINALIZE_HISTORY_ENTRY', { id: entryId, finalState: { text: `[Error: ${(e as Error).message}]`, streaming: false } });
                    }
                }

                if (task.payload?.goalId) {
                    syscall('UPDATE_GOAL_STATUS', { id: task.payload.goalId, status: 'failed', failureReason: (e as Error).message }, traceId);
                }

            } finally {
                isProcessingTask.current = false;
                syscall('KERNEL/SET_RUNNING_TASK', { task: null }, traceId);
                syscall('SET_INTERNAL_STATUS', 'idle', traceId);
            }
        };

        processQueue();
    }, [isPaused, state.kernelState.taskQueue, geminiAPI, syscall, addToast, t, state.history, state.activeCognitiveMode, state.internalState]);
};