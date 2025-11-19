// hooks/useAutonomousSystem.ts
import React, { useEffect, useRef } from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
// FIX: Imported the 'Persona' type to resolve a type error.
// FIX: Added TriageResult to import
// FIX: Imported GoalType to resolve 'Cannot find name' error.
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, AnalogicalHypothesisProposal, SelfProgrammingCandidate, AGISDecision, DesignHeuristic, GunaState, PerformanceLogEntry, SynthesizedSkill, KernelTaskType, UnifiedProposal, ArchitecturalChangeProposal, ProofStep, KnowledgeFact, KernelTask, TriageResult, Persona, CognitiveStrategy, ProofResult, Goal, GoalType } from '../types.ts';
import { deriveInternalState } from '../core/stateDerivation';
import { personas } from '../state/personas.ts';
import { businessAndFinanceKnowledge } from '../state/knowledge/businessAndFinance';
import { entrepreneurNetworkData } from '../state/knowledge/entrepreneurNetwork';
import { classifyHeuristically } from '../core/heuristicClassifier';
import { heuristicCoprocessorImplementations } from '../state/knowledge/heuristicCoprocessors';

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
                let taskResult: any = null; // Variable to hold the result of the task execution

                switch (task.type) {
                    case KernelTaskType.RUN_HEURISTIC_COPROCESSORS: {
                        const now = state.kernelState.tick;
                        const enabledCoprocessors = state.pluginState.registry.filter(p => p.type === 'HEURISTIC_COPROCESSOR' && p.status === 'enabled');

                        for (const plugin of enabledCoprocessors) {
                            const lastRun = state.heuristicCoprocessorState.cooldowns[plugin.id] || 0;
                            if (now < lastRun) continue; // Skip if in cooldown

                            // Find the implementation for this plugin
                            const implementation = heuristicCoprocessorImplementations.find(impl => impl.id === plugin.id);

                            if (implementation && implementation.condition(state)) {
                                // Fire-and-forget the action
                                implementation.action(syscall, state, geminiAPI);
                                // The action itself is responsible for logging and setting its cooldown
                                break; // Only run one coprocessor per cycle to avoid contention
                            }
                        }
                        break;
                    }
                    case KernelTaskType.CONTEXT_COMPACTION_PULSE: {
                        const HISTORY_THRESHOLD = 30;
                        const ENTRIES_TO_SUMMARIZE = 10;
                        const relevantHistory = state.history.filter(h => h.from === 'user' || h.from === 'bot');

                        if (relevantHistory.length > HISTORY_THRESHOLD) {
                            const entriesToSummarize = relevantHistory.slice(0, ENTRIES_TO_SUMMARIZE);
                            const textToSummarize = entriesToSummarize.map(e => `${e.from}: ${e.text}`).join('\n\n');
                            const summary = await geminiAPI.summarizeText(textToSummarize);
                            syscall('ADD_TO_WORKING_MEMORY', `Summary of early conversation: ${summary}`, traceId);
                            // This is a "soft" compaction. We don't remove history, just add a summary to WM.
                            // A "hard" compaction would involve replacing history entries, which is more complex.
                            addToast('Contextual Summarizer ran.', 'info');
                        }
                        break;
                    }

                    case KernelTaskType.RUN_COLLABORATIVE_SESSION: {
                        const { goal } = task.payload;
                        const sessionId = `session_${self.crypto.randomUUID()}`;

                        // 1. Decompose goal into sub-tasks for different personas
                        const decomposition = await geminiAPI.decomposeGoalForGuilds(goal);
                        const subTasks: Goal[] = decomposition.steps.map((step, index) => ({
                            id: `subtask_${sessionId}_${index}`,
                            parentId: null,
                            children: [],
                            description: step.task,
                            status: 'not_started',
                            progress: 0,
                            type: GoalType.TACTICAL,
                            personaId: step.personaId,
                        }));

                        // 2. Start the session and open the modal
                        syscall('SESSION/START', { taskId: goal, participants: [...new Set(subTasks.map(t => t.personaId))] }, traceId);
                        syscall('SESSION/UPDATE', { subTasks }, traceId);
                        syscall('MODAL/OPEN', { type: 'collaborativeSession', payload: {} }, traceId);
                        await sleep(500);

                        // 3. Execute each sub-task sequentially
                        const transcript: { personaId: string; content: string }[] = [];
                        for (const subTask of subTasks) {
                            syscall('SESSION/UPDATE_SUBTASK_STATUS', { taskId: subTask.id, status: 'in_progress' }, traceId);
                            const persona = personas.find(p => p.id === subTask.personaId);
                            if (!persona) {
                                syscall('SESSION/POST_MESSAGE', { personaId: 'system', content: `Error: Persona ${subTask.personaId} not found.` }, traceId);
                                continue;
                            }
                            
                            const response = await geminiAPI.executeCollaborativeStep(persona, subTask.description, transcript);
                            const message = { personaId: persona.id, content: response };
                            transcript.push(message);
                            syscall('SESSION/POST_MESSAGE', message, traceId);
                            syscall('SESSION/UPDATE_SUBTASK_STATUS', { taskId: subTask.id, status: 'completed' }, traceId);
                            await sleep(1000); // Pause for UI readability
                        }
                        
                        // 4. Synthesize the final artifact
                        const finalArtifact = await geminiAPI.synthesizeCollaborativeArtifacts(goal, transcript);
                        syscall('SESSION/ADD_ARTIFACT', finalArtifact, traceId);

                        // 5. End the session
                        syscall('SESSION/END', { status: 'completed' }, traceId);
                        taskResult = finalArtifact.content;
                        break;
                    }
                    
                    case KernelTaskType.PROOF_ORCHESTRATION_PULSE: {
                        const { atpCoprocessorState } = state;
                        const { status, activeProofAttempt } = atpCoprocessorState;

                        if (status !== 'orchestrating' || !activeProofAttempt) {
                            break; // Nothing to do
                        }

                        if (activeProofAttempt.status === 'planning') {
                            // Generate the proof plan
                            const plan = await geminiAPI.generateProofStrategy(activeProofAttempt.conjecture);
                            syscall('ATP/SET_PROOF_PLAN', { plan }, traceId);
                        } else if (activeProofAttempt.status === 'proving') {
                            // Find the next step to prove
                            const nextStep = activeProofAttempt.plan.find(step => step.status === 'pending');
                            if (nextStep) {
                                // Attempt to prove this step
                                syscall('ATP/UPDATE_STEP_STATUS', { stepNumber: nextStep.stepNumber, status: 'proving' }, traceId);
                                
                                const context = activeProofAttempt.plan.filter(s => s.status === 'proven').map(s => s.statement);
                                const result = await geminiAPI.verifyProofStep(activeProofAttempt.conjecture, context, nextStep.statement);
                                
                                syscall('ATP/ADD_LOG_ENTRY', { logEntry: { engine: 'Hilbert', message: `Attempting step ${nextStep.stepNumber}: ${result.explanation}` } }, traceId);

                                if (result.isValid) {
                                    syscall('ATP/UPDATE_STEP_STATUS', { stepNumber: nextStep.stepNumber, status: 'proven', justification: result.justification }, traceId);
                                } else {
                                    syscall('ATP/UPDATE_STEP_STATUS', { stepNumber: nextStep.stepNumber, status: 'failed', validationLog: result.explanation }, traceId);
                                    syscall('ATP/CONCLUDE_ATTEMPT', { status: 'failed', finalMessage: `Failed to prove step ${nextStep.stepNumber}.` }, traceId);
                                }
                            } else {
                                // All steps are proven, conclude the proof.
                                const allProven = activeProofAttempt.plan.every(step => step.status === 'proven');
                                if (allProven) {
                                    syscall('ATP/CONCLUDE_ATTEMPT', { status: 'proven', finalMessage: 'All steps successfully proven.' }, traceId);
                                    // Add axiom to crucible
                                    syscall('CRUCIBLE/ADD_AXIOM_FROM_PROOF', { goalDescription: activeProofAttempt.conjecture }, traceId);
                                } else {
                                    // Should not happen if all steps are processed, but as a fallback
                                    syscall('ATP/CONCLUDE_ATTEMPT', { status: 'failed', finalMessage: 'Proof orchestration completed, but not all steps were proven.' }, traceId);
                                }
                            }
                        }
                        break;
                    }
                    case KernelTaskType.RUN_HEURISTIC_SEARCHERS: {
                        // This simulates the execution of heuristic searcher coprocessors.
                        // For this implementation, we simulate a "RedundancySearcher".
                        const vfs = state.selfProgrammingState.virtualFileSystem;
                        const proposals = state.ontogeneticArchitectState.proposalQueue;

                        for (const filePath in vfs) {
                            const content = vfs[filePath].trim();
                            const isEmpty = content === '' || content === 'export {};';
                            const isMarkedAsDuplicate = content.includes('This file is a duplicate') || content.includes('This file has been emptied');

                            if (isEmpty || isMarkedAsDuplicate) {
                                // Check if a proposal to remove this file already exists and is pending
                                const proposalExists = proposals.some(p => 
                                    p.proposalType === 'architecture' && 
                                    (p as ArchitecturalChangeProposal).action === 'REMOVE_COMPONENT' &&
                                    (p as ArchitecturalChangeProposal).target === filePath &&
                                    p.status === 'proposed'
                                );

                                if (!proposalExists) {
                                    const proposal: ArchitecturalChangeProposal = {
                                        id: `proposal_searcher_${self.crypto.randomUUID()}`,
                                        timestamp: Date.now(),
                                        proposalType: 'architecture',
                                        reasoning: `The autonomous RedundancySearcher found that the file '${filePath}' is empty or marked as a duplicate. It should be removed to improve codebase health and reduce complexity.`,
                                        action: 'REMOVE_COMPONENT',
                                        target: filePath,
                                        status: 'proposed',
                                    };
                                    syscall('OA/ADD_PROPOSAL', proposal, traceId);
                                    syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `Heuristic Searcher found redundant file: ${filePath}. Submitting proposal for deletion.` }, traceId);
                                }
                            }
                        }
                        break;
                    }
                    case KernelTaskType.AUTONOMOUS_EVOLUTION_PULSE: {
                        const recentModifications = state.modificationLog
                            .slice(0, 5)
                            .map(log => `- ${log.description.substring(0, 100)}... (${log.isAutonomous ? 'Autonomous' : 'Manual'})`)
                            .join('\n');
                        
                        const currentComponents = Object.keys(state.cognitiveArchitecture.components);
                        const currentCoprocessors = Object.keys(state.cognitiveArchitecture.coprocessors);
                        const pendingProposals = state.ontogeneticArchitectState.proposalQueue
                            .filter(p => p.status === 'proposed')
                            // FIX: Added a type guard to ensure `action` and `target` exist on the proposal object before access.
                            .map(p => `- ${'action' in p ? p.action : 'N/A'} on ${'target' in p ? p.target : 'N/A'}`);

                        const context = `
### Current System State
- Guna: ${state.internalState.gunaState}
- Cognitive Load: ${state.internalState.load.toFixed(2)}
- Harmony Score: ${state.internalState.harmonyScore.toFixed(2)}

### Current Architecture
- **Components:**
${currentComponents.length > 0 ? currentComponents.map(c => `  - ${c}`).join('\n') : '  - None'}
- **Coprocessors:**
${currentCoprocessors.length > 0 ? currentCoprocessors.map(c => `  - ${c}`).join('\n') : '  - None'}

### Pending & Recent Changes
- **Pending Proposals:**
${pendingProposals.length > 0 ? pendingProposals.join('\n') : '  - None'}
- **Recent Modifications History (last 5):**
${recentModifications || '  - None'}
`.trim();
                        
                        try {
                            const proposal = await geminiAPI.generateSelfImprovementProposalFromResearch(context);
                            
                            if (proposal) {
                                // Auto-approve and apply
                                syscall('APPLY_ARCH_PROPOSAL', { 
                                    proposal, 
                                    snapshotId: `snap_auto_${self.crypto.randomUUID()}`, 
                                    modLogId: `mod_auto_${self.crypto.randomUUID()}`, 
                                    isAutonomous: true 
                                }, traceId);
            
                                // FIX: Robustly handle the `reasoning` field which might be an object to prevent '[object Object]'.
                                const reasoningText = typeof proposal.reasoning === 'object' 
                                    ? JSON.stringify(proposal.reasoning, null, 2)
                                    : String(proposal.reasoning);
                                
                                const reportMessage = `**Autonomous Evolution Complete**
Aura has automatically approved and implemented an architectural change.

**Reasoning:**

    ${reasoningText}

**Action:** ${proposal.action.replace(/_/g, ' ')} on target \`${Array.isArray(proposal.target) ? proposal.target.join(', ') : proposal.target}\`.

A system reboot is pending to apply these changes.`;
                                
                                syscall('ADD_HISTORY_ENTRY', { 
                                    from: 'system', 
                                    text: reportMessage
                                }, traceId);
                            }
                        } catch (e) {
                            console.error("Autonomous evolution pulse failed:", e);
                            // Don't add a toast for background tasks to avoid spamming the user on transient errors.
                        }
                        break;
                    }
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
                            taskResult = fullText;
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
                            const summary = await geminiAPI.generateInitialPlanSummary(command, decomposition.steps);
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: summary }, traceId);
                            // Immediately queue the first step
                            syscall('KERNEL/QUEUE_TASK', { type: KernelTaskType.EXECUTE_NEXT_GOAL_STEP, payload: {}, id: `task_${self.crypto.randomUUID()}`, timestamp: Date.now() }, traceId);
                        } else {
                            const reasoning = decomposition.reasoning || "I am currently unable to process this request.";
                            const alternative = decomposition.alternative || `I can research the topic of "${command}" for you or explore related, achievable tasks.`;
                            const responseText = `I am unable to achieve that goal. **Reason:** ${reasoning}\n\n**Alternative:** ${alternative}`;
                            syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: responseText }, traceId);
                        }
                        break;
                    }
                    case KernelTaskType.EXECUTE_NEXT_GOAL_STEP: {
                        const { activeStrategicGoalId, goalTree } = state;
                        if (!activeStrategicGoalId) break;

                        const rootGoal = goalTree[activeStrategicGoalId];
                        // FIX: Replaced complex reverse-loop with a simpler, more robust findIndex to prevent planning loops.
                        const nextStepIndex = rootGoal.children.findIndex(childId => goalTree[childId]?.status === 'not_started');

                        if (nextStepIndex !== -1) {
                            const nextGoalId = rootGoal.children[nextStepIndex];
                            const nextGoal = goalTree[nextGoalId];
                            if (nextGoal) {
                                syscall('UPDATE_GOAL_STATUS', { id: nextGoalId, status: 'in_progress' }, traceId);
                                const nextTaskType = await geminiAPI.mapStepToKernelTask(nextGoal.description);
                                syscall('KERNEL/QUEUE_TASK', {
                                    id: `task_step_${self.crypto.randomUUID()}`,
                                    type: nextTaskType,
                                    payload: { command: nextGoal.description, goalId: nextGoalId },
                                    timestamp: Date.now(),
                                    traceId,
                                }, traceId);
                            }
                        } else {
                            // All steps are done, queue the final report
                            syscall('KERNEL/QUEUE_TASK', { type: KernelTaskType.GENERATE_FINAL_REPORT, payload: { rootGoalId: activeStrategicGoalId }, id: `task_report_${self.crypto.randomUUID()}`, timestamp: Date.now() }, traceId);
                        }
                        break;
                    }
                    case KernelTaskType.GENERATE_FINAL_REPORT: {
                        const { rootGoalId } = task.payload;
                        const rootGoal = state.goalTree[rootGoalId];
                        if (!rootGoal) break;

                        const stepResults = rootGoal.children.map(id => {
                            const goal = state.goalTree[id];
                            return { step: goal.description, result: goal.result || 'No output.' };
                        });
                        
                        const finalReport = await geminiAPI.generateFinalReport(rootGoal.description, stepResults);
                        
                        syscall('ADD_HISTORY_ENTRY', { from: 'bot', text: finalReport }, traceId);
                        syscall('PLANNING/CLEAR_ACTIVE_GOAL', {}, traceId);
                        break;
                    }
                    case KernelTaskType.RUN_BRAINSTORM_SESSION: {
                        const goal = task.payload.triageResult?.goal || task.payload.command;
                        if (!goal) {
                            throw new Error("Brainstorm session requires a topic/goal.");
                        }
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
                        
                        taskResult = brainstormText; // Store result for final report
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
                        let fullText = '';
                        for await (const chunk of stream) {
                             const textChunk = chunk.text ?? '';
                            fullText += textChunk;
                            syscall('APPEND_TO_HISTORY_ENTRY', { id: entryId, textChunk: textChunk }, traceId);
                        }
                        taskResult = fullText;
                        syscall('FINALIZE_HISTORY_ENTRY', { id: entryId, finalState: { streaming: false } }, traceId);
                        break;
                    }
                    case KernelTaskType.RUN_MATHEMATICAL_PROOF: {
                        const { goal } = task.payload.triageResult;
                        const strategy = await geminiAPI.generateConceptualProofStrategy(goal);
                        syscall('BUILD_PROOF_TREE', { rootGoal: goal, strategy }, traceId);
                        taskResult = `Generated a proof strategy for "${goal}". Execution must be monitored in the Proof Landscape Explorer.`;
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `ATP Coprocessor: Proof plan for "${goal}" generated. See the Proof Landscape Explorer for details.` }, traceId);
                        break;
                    }
                    case KernelTaskType.RUN_MARKET_ANALYSIS: {
                         const context = [...businessAndFinanceKnowledge, ...entrepreneurNetworkData].map(f => `${f.subject} ${f.predicate} ${f.object}.`).join('\n');
                         const analysis = await geminiAPI.analyzeMarketData(context);
                         taskResult = analysis;
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
                            taskResult = `Successfully generated a document titled "${outline.title}".`;
                        } catch (e) {
                             syscall('DOCUMENT_FORGE/SET_STATUS', { status: 'error', message: (e as Error).message }, traceId);
                             taskResult = `Failed to generate document: ${(e as Error).message}`;
                        }
                        break;
                    }
                }

                if (task.payload?.goalId) {
                    syscall('UPDATE_GOAL_STATUS', { id: task.payload.goalId, status: 'completed', result: taskResult }, traceId);
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
                
                // If a goal-related task just finished, queue the next step. This creates the execution loop.
                if (task.payload?.goalId) {
                    syscall('KERNEL/QUEUE_TASK', { type: KernelTaskType.EXECUTE_NEXT_GOAL_STEP, payload: {}, id: `task_next_step_${self.crypto.randomUUID()}`, timestamp: Date.now() }, traceId);
                }
            }
        };

        processQueue();
    }, [isPaused, state.kernelState.taskQueue, geminiAPI, syscall, addToast, t, state.history, state.activeCognitiveMode, state.internalState]);
};