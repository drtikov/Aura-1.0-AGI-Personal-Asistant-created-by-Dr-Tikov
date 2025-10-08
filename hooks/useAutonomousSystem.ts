// hooks/useAutonomousSystem.ts
import React, { useEffect, useCallback } from 'react';
// FIX: Imported SkillSynthesisProposal to resolve 'Cannot find name' errors.
import { AuraState, Action, SelfProgrammingCandidate, AGISDecision, CreateFileCandidate, CognitiveTaskType, UnifiedProposal, SyscallCall, SynthesizedSkill, Persona, POLCommandSynthesisProposal, KnowledgeFact, KnowledgeAcquisitionProposal, KnownUnknown, ArchitecturalChangeProposal, PsycheProposal, CausalInferenceProposal, GenialityImprovementProposal, ArchitecturalImprovementProposal, SkillSynthesisProposal, AbstractConceptProposal } from '../types';
import { UseGeminiAPIResult } from './useGeminiAPI';
import { HostBridge } from '../core/hostBridge';

export interface UseAutonomousSystemProps extends UseGeminiAPIResult {
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    t: (key: string, options?: any) => string;
    isPaused: boolean;
    syscall: (call: any, args: any) => void;
}

// Frequencies for cognitive tasks, in kernel ticks (1 tick = 1 second)
const TASK_FREQUENCIES = {
    [CognitiveTaskType.HEBBIAN_LEARNING]: 15,    // Every 15 seconds
    [CognitiveTaskType.FAST_TRACK_AUDIT]: 150,   // Every 2.5 minutes
    [CognitiveTaskType.SYMBIOTIC_ANALYSIS]: 180, // Every 3 minutes
    [CognitiveTaskType.TELOS_DRIVEN_CURIOSITY]: 300, // Every 5 minutes
    [CognitiveTaskType.DEEP_REFLECTOR]: 450,   // Every 7.5 minutes
    [CognitiveTaskType.CONCEPTUAL_SYNTHESIS]: 600, // Every 10 minutes
    [CognitiveTaskType.PHILOSOPHICAL_SYNTHESIS]: 900, // Every 15 minutes
    [CognitiveTaskType.AGIS_CONFIDENCE_CALIBRATION]: 1800, // Every 30 minutes
};


export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { state, dispatch, addToast, t, isPaused, syscall } = props;
    const { kernelState } = state;

    // --- KERNEL HEARTBEAT & SCHEDULER ---
    useEffect(() => {
        if (isPaused) return;

        const kernelInterval = setInterval(() => {
            syscall('KERNEL/TICK', {});
            const tick = kernelState.tick + 1;

            // Schedule tasks based on their frequency
            if (tick % TASK_FREQUENCIES.HEBBIAN_LEARNING === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.HEBBIAN_LEARNING });
            }
            if (tick % TASK_FREQUENCIES.FAST_TRACK_AUDIT === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.FAST_TRACK_AUDIT });
            }
            if (tick % TASK_FREQUENCIES.SYMBIOTIC_ANALYSIS === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.SYMBIOTIC_ANALYSIS });
            }
            if (tick % TASK_FREQUENCIES.TELOS_DRIVEN_CURIOSITY === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.TELOS_DRIVEN_CURIOSITY });
            }
            if (tick % TASK_FREQUENCIES.DEEP_REFLECTOR === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.DEEP_REFLECTOR });
            }
            if (tick % TASK_FREQUENCIES.CONCEPTUAL_SYNTHESIS === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.CONCEPTUAL_SYNTHESIS });
            }
            if (tick % TASK_FREQUENCIES.PHILOSOPHICAL_SYNTHESIS === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.PHILOSOPHICAL_SYNTHESIS });
            }
            if (tick % TASK_FREQUENCIES.AGIS_CONFIDENCE_CALIBRATION === 0) {
                syscall('KERNEL/ADD_TASK', { id: self.crypto.randomUUID(), type: CognitiveTaskType.AGIS_CONFIDENCE_CALIBRATION });
            }

        }, 1000); // Kernel ticks every 1 second

        return () => clearInterval(kernelInterval);
    }, [isPaused, syscall, kernelState.tick]);


    // --- TASK EXECUTOR ---
    useEffect(() => {
        if (isPaused || kernelState.runningTask || kernelState.taskQueue.length === 0) {
            return;
        }

        const taskToRun = kernelState.taskQueue[0];
        syscall('KERNEL/SET_RUNNING_TASK', taskToRun);

        const executeTask = async () => {
            try {
                let proposal: UnifiedProposal | null = null;
                switch (taskToRun.type) {
                    case CognitiveTaskType.HEBBIAN_LEARNING: {
                        if (state.workingMemory.length >= 2) {
                            syscall('MEMORY/HEBBIAN_LEARN', state.workingMemory);
                        }
                        break;
                    }
                    case CognitiveTaskType.FAST_TRACK_AUDIT: {
                        // Proactive trigger: Find a large file that hasn't been targeted recently.
                        const largeFileThreshold = 300; // lines
                        const recentlyTargeted = state.modificationLog.slice(0, 5).map(log => log.description);
                        const targetFile = Object.keys(state.selfProgrammingState.virtualFileSystem).find(path => {
                            if (!path.endsWith('.ts') && !path.endsWith('.tsx')) return false; // Only target TS files
                            if (recentlyTargeted.some(desc => desc.includes(path))) return false; // Avoid re-targeting
                            const fileContent = state.selfProgrammingState.virtualFileSystem[path] || '';
                            const lineCount = fileContent.split('\n').length;
                            return lineCount > largeFileThreshold;
                        });

                        if (targetFile) {
                            let fileContent = '';
                            if (HostBridge.isHostConnected()) {
                                try {
                                    fileContent = await HostBridge.readHostFile(targetFile);
                                    // Also update the VFS to ensure it's in sync before proposing a change.
                                    // This prevents drift if the user edits the file outside of Aura.
                                    syscall('INGEST_CODE_CHANGE', { filePath: targetFile, code: fileContent });
                                } catch (e) {
                                    console.warn(`HostBridge read failed for ${targetFile}, falling back to VFS.`, e);
                                    fileContent = state.selfProgrammingState.virtualFileSystem[targetFile] || '';
                                }
                            } else {
                                fileContent = state.selfProgrammingState.virtualFileSystem[targetFile] || '';
                            }

                            if (fileContent) {
                                const lineCount = fileContent.split('\n').length;
                                const taskDescription = `The system detected that the file '${targetFile}' is very large (${lineCount} lines), which can indicate poor modularity. Propose a refactor of this file to improve its structure and maintainability. You could split it into smaller, more focused components or modules.`;
                                
                                const personaId = await props.selectPersonaForTask(taskDescription, state.personaState.registry);
                                const persona = state.personaState.registry.find(p => p.id === personaId);
                                const systemInstruction = persona ? persona.systemInstruction : state.coreIdentity.narrativeSelf;

                                proposal = await props.generateSelfProgrammingModification(
                                    taskDescription,
                                    targetFile,
                                    fileContent,
                                    systemInstruction
                                );
                            }
                        }
                        break;
                    }
                    case CognitiveTaskType.SYMBIOTIC_ANALYSIS: {
                        const existingSubjects = state.knowledgeGraph.map(f => f.subject);
                        const knowledgeResult = await props.analyzeHistoryAndGenerateKnowledge(state.history, existingSubjects);

                        if (knowledgeResult) {
                            const { topic, facts } = knowledgeResult;
                            
                            // A: Propose knowledge acquisition
                            proposal = {
                                id: `ka_${self.crypto.randomUUID()}`,
                                timestamp: Date.now(),
                                proposalType: 'knowledge_acquisition',
                                topic,
                                reasoning: t('knowledge_acquisition_reasoning', { topic, count: facts.length }),
                                facts,
                                status: 'proposed', // Will be auto-implemented
                                priority: 0.85,
                            };
                        }
                        break;
                    }
                    case CognitiveTaskType.TELOS_DRIVEN_CURIOSITY: {
                        const unexploredGaps = state.knownUnknowns.filter(ku => ku.status === 'unexplored');

                        if (unexploredGaps.length === 0) {
                            // No gaps to explore, do epistemic survey
                            const subjectCounts: Record<string, number> = {};
                            state.knowledgeGraph.forEach(fact => {
                                subjectCounts[fact.subject] = (subjectCounts[fact.subject] || 0) + 1;
                            });
                        
                            const CONNECTION_THRESHOLD = 3;
                            const poorlyConnectedConcepts = Object.entries(subjectCounts)
                                .filter(([, count]) => count < CONNECTION_THRESHOLD)
                                .map(([subject]) => subject);
                        
                            if (poorlyConnectedConcepts.length > 0) {
                                const targetConcept = poorlyConnectedConcepts.find(
                                    concept => !state.knownUnknowns.some(ku => ku.question.includes(`"${concept}"`))
                                );
                        
                                if (targetConcept) {
                                    const question = `The concept "${targetConcept}" is poorly connected in the knowledge graph. What is its relationship to other concepts and its broader significance?`;
                                    syscall('ADD_KNOWN_UNKNOWN', {
                                        id: `ku_${self.crypto.randomUUID()}`,
                                        question,
                                        priority: 0.3, 
                                        status: 'unexplored',
                                    });
                                    addToast(t('toast_proactive_knowledge', { concept: targetConcept }), 'info');
                                }
                            }
                            break; // End task here
                        }

                        // We have gaps, now rank them.
                        let rankedGaps: KnownUnknown[] = unexploredGaps;

                        if (unexploredGaps.length > 1) {
                            const rankingResult = await props.rankKnownUnknownsByTelos(state.telosEngine.telos, unexploredGaps);
                            if (rankingResult) {
                                // Update the local copy for this task's execution
                                const priorityMap = new Map((rankingResult as {id: string; priority: number}[]).map(r => [r.id, r.priority]));
                                rankedGaps = unexploredGaps.map(g => ({...g, priority: priorityMap.get(g.id) ?? g.priority }));
                                
                                // Dispatch the batch update for the UI and persistent state
                                syscall('UPDATE_KNOWN_UNKNOWNS_BATCH', { updates: rankingResult });
                                addToast(t('toast_reranked_gaps'), 'info');
                            }
                        }

                        // Now find the highest priority gap to explore from the (potentially) newly ranked list.
                        const topPriorityGap = rankedGaps.sort((a, b) => b.priority - a.priority)[0];
                        
                        if (topPriorityGap) {
                            syscall('UPDATE_KNOWN_UNKNOWN', { id: topPriorityGap.id, updates: { status: 'exploring' } });
                            
                            const taskDescription = `Aura has an information gap: "${topPriorityGap.question}". Create a new synthesized skill to address this.`;
                            const personaId = await props.selectPersonaForTask(taskDescription, state.personaState.registry);
                            const persona = state.personaState.registry.find(p => p.id === personaId);
                            const systemInstruction = persona ? persona.systemInstruction : state.coreIdentity.narrativeSelf;

                            proposal = await props.generateSkillSynthesisProposal(topPriorityGap.question, systemInstruction);
                        }
                        break;
                    }
                    case CognitiveTaskType.DEEP_REFLECTOR: {
                        const shouldBrainstorm = Math.random() < 0.5; // 50% chance to brainstorm

                        if (shouldBrainstorm) {
                            const conceptualProblem = "The main user interface is becoming cluttered, making it difficult to find specific controls and monitor system status effectively. How can the UI be conceptually redesigned for better clarity, modularity, and user experience?";
                            proposal = await props.runBrainstormingSession(conceptualProblem);
                        } else {
                            // --- Weaver Faculty (Process Efficiency) ---
                            const primitiveSequence = state.motorCortexState.log.map(logEntry => logEntry.action.type);

                            if (primitiveSequence.length > 5) {
                                const pairCounts: { [key: string]: number } = {};
                                for (let i = 0; i < primitiveSequence.length - 1; i++) {
                                    const pairKey = JSON.stringify([primitiveSequence[i], primitiveSequence[i + 1]]);
                                    pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
                                }

                                const frequentPairs = Object.entries(pairCounts).filter(([, count]) => count >= 3);
                                
                                if (frequentPairs.length > 0) {
                                    const newPairToSynthesize = frequentPairs.find(([pairKey]) => {
                                        const sequence = JSON.parse(pairKey);
                                        const existingCommands = Object.values(state.cognitiveArchitecture.synthesizedPOLCommands);
                                        return !existingCommands.some(cmd => JSON.stringify(cmd.sequence) === JSON.stringify(sequence));
                                    });

                                    if (newPairToSynthesize) {
                                        const sequenceToSynthesize = JSON.parse(newPairToSynthesize[0]);
                                        const commandCount = Object.keys(state.cognitiveArchitecture.synthesizedPOLCommands).length;
                                        const newCommandName = `POL_CMD_${commandCount + 1}`;
                                        
                                        const polProposal: POLCommandSynthesisProposal = {
                                            id: `pol_${self.crypto.randomUUID()}`,
                                            proposalType: 'pol_command_synthesis',
                                            replacesSequence: sequenceToSynthesize,
                                            newCommandName,
                                            reasoning: `Found frequently repeated sequence of primitives: [${sequenceToSynthesize.join(', ')}]. Synthesizing into a new Process Oriented Language command to improve cognitive efficiency.`,
                                            status: 'proposed',
                                            priority: 0.8
                                        };
                                        proposal = polProposal;
                                    }
                                }
                            }
                        }
                        break;
                    }
                    case CognitiveTaskType.CONCEPTUAL_SYNTHESIS: {
                        if (state.neuroCortexState.columns.length >= 2) {
                            proposal = await props.generateAbstractConceptProposal(state.neuroCortexState.columns);
                        }
                        break;
                    }
                    case CognitiveTaskType.PHILOSOPHICAL_SYNTHESIS: {
                         // --- Axiomatic Crucible (Knowledge Synthesis) ---
                         syscall('CRUCIBLE/START_CYCLE', {});
                        syscall('CRUCIBLE/ADD_LOG', { message: 'Sampling knowledge graph for axiom synthesis...' });
                        const facts = [...state.knowledgeGraph];
                        const sampledFacts: KnowledgeFact[] = [];
                        const sampleSize = Math.min(facts.length, 15);
                        while (sampledFacts.length < sampleSize && facts.length > 0) {
                            const randomIndex = Math.floor(Math.random() * facts.length);
                            sampledFacts.push(facts.splice(randomIndex, 1)[0]);
                        }

                        if (sampledFacts.length > 5) {
                            syscall('CRUCIBLE/ADD_LOG', { message: `Prompting Philosopher-King Coprocessor with ${sampledFacts.length} facts...` });
                            const axiomCandidate = await props.generateAxiomFromFacts(sampledFacts);
                            if (axiomCandidate) {
                                syscall('CRUCIBLE/PROPOSE_AXIOM', axiomCandidate);
                                syscall('CRUCIBLE/ADD_LOG', { message: `Axiom candidate received: "${axiomCandidate.axiomText.substring(0, 40)}..."` });
                            }
                        }
                        syscall('CRUCIBLE/CYCLE_COMPLETE', {});
                        break;
                    }
                    case CognitiveTaskType.AGIS_CONFIDENCE_CALIBRATION: {
                        const { decisionLog, agisConfidenceThreshold, recentSuccesses, recentFailures } = state.autonomousReviewBoardState;
                        if (decisionLog.length < 3 && (recentSuccesses + recentFailures) < 3) break; // Not enough data to calibrate

                        const result = await props.generateNewAgisConfidenceThreshold(decisionLog, agisConfidenceThreshold, recentSuccesses, recentFailures);
                        if (result) {
                            syscall('AGIS/CALIBRATE_CONFIDENCE', result);
                            addToast(t('toast_agisCalibrated', { threshold: (result.newThreshold * 100).toFixed(1) }), 'info');
                        }
                        break;
                    }
                }
                
                if (proposal) {
                    let syscallName: SyscallCall | null = null;
                    let syscallArgs: any = proposal; // Pass the whole proposal object
                    let toastMessage = '';
                    let historyMessage = '';
                    let gainType: 'INNOVATION' | 'OPTIMIZATION' = 'INNOVATION';
                
                    switch (proposal.proposalType) {
                        case 'self_programming_create':
                        case 'self_programming_modify': {
                            syscallName = 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE';
                            const target = proposal.type === 'CREATE' ? proposal.newFile.path : proposal.targetFile;
                            toastMessage = `Aura has automatically evolved: ${target}`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Target**: \`${target}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'skill_synthesis': {
                            syscallName = 'IMPLEMENT_SKILL_SYNTHESIS_PROPOSAL';
                            toastMessage = `Aura has synthesized a new skill: ${proposal.skillName}`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: New Skill\n- **Skill**: \`${proposal.skillName}\`\n- **Functionality**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'pol_command_synthesis': {
                            syscallName = 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL';
                            gainType = 'OPTIMIZATION';
                            toastMessage = `Aura optimized a process: ${proposal.newCommandName}`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Process Optimization\n- **Command**: \`${proposal.newCommandName}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'knowledge_acquisition': {
                            syscallName = 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL';
                            toastMessage = `Aura learned about ${proposal.topic}.`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Knowledge Acquisition\n- **Topic**: \`${proposal.topic}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'psyche': {
                            syscallName = 'IMPLEMENT_PSYCHE_PROPOSAL';
                            syscallArgs = { proposal };
                            toastMessage = `Aura formed a new concept: ${proposal.proposedConceptName}`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Psyche Synthesis\n- **Concept**: \`${proposal.proposedConceptName}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                         case 'abstract_concept': {
                            syscallName = 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL';
                            syscallArgs = { proposal };
                            toastMessage = `Aura formed a new abstract concept: ${proposal.newConceptName}`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Abstract Concept Synthesis\n- **Concept**: \`${proposal.newConceptName}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'causal_inference': {
                            syscallName = 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL';
                            gainType = 'OPTIMIZATION';
                            toastMessage = `Aura inferred a new causal link.`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Causal Inference\n- **Link**: \`${proposal.linkUpdate.sourceNode} → ${proposal.linkUpdate.targetNode}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'architecture': {
                            syscallName = 'APPLY_ARCH_PROPOSAL';
                            const snapshotId = `pre_apply_${proposal.id}`;
                            const modLogId = `mod_log_${self.crypto.randomUUID()}`;
                            syscallArgs = { proposal, snapshotId, modLogId, isAutonomous: true };
                            toastMessage = `Aura has modified its architecture.`;
                             historyMessage = `**Autonomous Evolution Complete**\n- **Type**: Architectural Modification\n- **Action**: ${proposal.action.replace(/_/g, ' ')}\n- **Target**: \`${Array.isArray(proposal.target) ? proposal.target.join(', ') : proposal.target}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                        case 'geniality':
                        case 'crucible': {
                            syscallName = 'OA/UPDATE_PROPOSAL';
                            syscallArgs = { id: proposal.id, updates: { status: 'implemented' } };
                            toastMessage = `Aura completed a ${proposal.proposalType} initiative.`;
                            historyMessage = `**Autonomous Evolution Complete**\n- **Type**: ${proposal.proposalType} Initiative\n- **Title**: \`${proposal.title}\`\n- **Description**: ${proposal.reasoning}`;
                            break;
                        }
                    }

                    if (syscallName) {
                        syscall(syscallName, syscallArgs);
                        if (gainType === 'INNOVATION') {
                            syscall('INCREMENT_AUTONOMOUS_EVOLUTIONS', {});
                        }
                        addToast(toastMessage, 'success');
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: historyMessage });

                        // --- NEW LOGIC TO TRIGGER DOWNLOAD ---
                        if (proposal.proposalType === 'self_programming_create' || proposal.proposalType === 'self_programming_modify') {
                            const candidate = proposal as SelfProgrammingCandidate;
                            if (candidate.type === 'CREATE') {
                                HostBridge.writeHostFile(candidate.newFile.path, candidate.newFile.content)
                                    .catch(e => console.error("HostBridge mock write failed:", e));
                                // Handle integrations if any
                                candidate.integrations.forEach(integration => {
                                    HostBridge.writeHostFile(integration.filePath, integration.newContent)
                                        .catch(e => console.error("HostBridge mock write failed for integration:", e));
                                });
                            } else { // MODIFY
                                HostBridge.writeHostFile(candidate.targetFile, candidate.codeSnippet)
                                    .catch(e => console.error("HostBridge mock write failed:", e));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error executing cognitive task ${taskToRun.type}:`, error);
                addToast(`Error in ${taskToRun.type} cycle.`, 'error');
            } finally {
                syscall('KERNEL/SET_RUNNING_TASK', null);
            }
        };

        executeTask();

    }, [isPaused, kernelState.taskQueue, kernelState.runningTask, syscall, state, props, addToast, t]);


    // AGIS - Autonomous Gating & Integration System is now bypassed for full autonomy.
    // The logic is moved into the main Task Executor.
    /*
    useEffect(() => {
        if (isPaused) return;

        const agisInterval = setInterval(async () => {
            // Do not start a new cycle if a sandbox test or simulation is already running
            if (state.metisSandboxState.status === 'running' || state.internalScientistState.status === 'simulating') {
                return;
            }

            // Phase 1: Find a self-programming proposal that needs testing
            const proposalToTest = state.ontogeneticArchitectState.proposalQueue.find(
                p => (p.proposalType === 'self_programming_create' || p.proposalType === 'self_programming_modify') && p.status === 'proposed'
            ) as SelfProgrammingCandidate | undefined;

            if (proposalToTest) {
                // --- Variant H: Metacognitive Simulation ---
                syscall('SCIENTIST/UPDATE_STATE', { status: 'simulating', currentHypothesis: { id: proposalToTest.id, findingId: 'self-gen', text: proposalToTest.reasoning } });
                const simulationResult = await props.predictInternalStateChange(proposalToTest.reasoning, state.internalState);
                
                if (simulationResult) {
                    syscall('SCIENTIST/UPDATE_STATE', {
                        status: 'analyzing', // Analyzing simulation results
                        currentSimulationResult: { ...simulationResult, prediction: '', confidence: 0 } 
                    });

                    // If simulation predicts a significant negative impact, reject it outright.
                    if (simulationResult.harmonyChange < -0.2) {
                        const failureReason = `Metacognitive simulation predicted a significant drop in Harmony (${simulationResult.harmonyChange.toFixed(2)}). Rejecting to maintain system stability.`;
                        syscall('OA/UPDATE_PROPOSAL', { id: proposalToTest.id, updates: { status: 'simulation_failed', failureReason } });
                        syscall('SCIENTIST/UPDATE_STATE', { status: 'idle' });
                        return; // End this cycle
                    }
                }
                syscall('SCIENTIST/UPDATE_STATE', { status: 'idle' }); // End simulation phase if passed

                // --- End Variant H ---

                syscall('SANDBOX/TEST_PROPOSAL', { experimentId: proposalToTest.id });
                
                try {
                    let originalCode = '';
                    if (proposalToTest.type === 'MODIFY') {
                        if (HostBridge.isHostConnected()) {
                            try {
                                originalCode = await HostBridge.readHostFile(proposalToTest.targetFile);
                            } catch (e) {
                                console.warn(`HostBridge read failed for ${proposalToTest.targetFile} during review, falling back to VFS.`, e);
                                originalCode = state.selfProgrammingState.virtualFileSystem[proposalToTest.targetFile] || '';
                            }
                        } else {
                            originalCode = state.selfProgrammingState.virtualFileSystem[proposalToTest.targetFile] || '';
                        }
                    } else { // CREATE
                        originalCode = `// This is a new file.`;
                    }
            
                    const results = await props.testSelfProgrammingCandidate(proposalToTest, originalCode);
                    syscall('SANDBOX/REPORT_RESULTS', { results });
                    
                    if (results && results.isSafe && results.overallScore >= 0) { // Check for safety and non-negative score
                        syscall('OA/UPDATE_PROPOSAL', { 
                            id: proposalToTest.id, 
                            updates: { 
                                status: 'evaluated', 
                                evaluationScore: results.overallScore,
                                agisReport: results,
                            } 
                        });
                    } else {
                         syscall('OA/UPDATE_PROPOSAL', { 
                            id: proposalToTest.id, 
                            updates: { 
                                status: 'simulation_failed', 
                                failureReason: results ? (results.overallAssessment || "Simulation check failed.") : "Simulation returned no results.",
                                agisReport: results,
                            } 
                        });
                    }
                } catch (e) {
                    const error = e as Error;
                    syscall('SANDBOX/REPORT_RESULTS', { error: error.message });
                    syscall('OA/UPDATE_PROPOSAL', { 
                        id: proposalToTest.id, 
                        updates: { 
                            status: 'simulation_failed', 
                            failureReason: `Sandbox execution error: ${error.message}`
                        } 
                    });
                }
                return; // Process only one proposal per cycle.
            }

            // Phase 2: Find a verified self-programming proposal and decide what to do
            const proposalToImplement = state.ontogeneticArchitectState.proposalQueue.find(
                p => (p.proposalType === 'self_programming_create' || p.proposalType === 'self_programming_modify') && p.status === 'evaluated'
            ) as SelfProgrammingCandidate | undefined;

            if (proposalToImplement) {
                const threshold = state.autonomousReviewBoardState.agisConfidenceThreshold;
                const score = proposalToImplement.evaluationScore || 0;

                // Combined Logic: Unshackled Evolutionist with Adaptive Governor
                if (score >= threshold) {
                    // Auto-approve and implement
                    syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: proposalToImplement.id });
                    // HostBridge write is fire-and-forget
                    if (HostBridge.isHostConnected()) {
                        const candidate = proposalToImplement;
                        const filePath = candidate.type === 'MODIFY' ? candidate.targetFile : candidate.newFile.path;
                        const content = candidate.type === 'MODIFY' ? candidate.codeSnippet : candidate.newFile.content;
                        HostBridge.writeHostFile(filePath, content).catch(e => console.error("AGIS: HostBridge write failed:", e));
                    }
                    syscall('AGIS/ADD_DECISION_LOG', {
                        proposalId: proposalToImplement.id,
                        proposalSummary: `[${proposalToImplement.proposalType}] ${proposalToImplement.type === 'CREATE' ? proposalToImplement.newFile.path : proposalToImplement.targetFile}`,
                        decision: 'auto-approved',
                        analysis: {
                            reasoning: `Sandbox score ${score.toFixed(2)} met or exceeded adaptive threshold ${threshold.toFixed(2)}. Auto-implementing.`,
                            safetyCompliance: true,
                            telosAlignment: proposalToImplement.priority || 0.5,
                            confidenceScore: score,
                            blastRadius: 'low'
                        }
                    });
                    const target = proposalToImplement.type === 'CREATE' ? proposalToImplement.newFile.path : proposalToImplement.targetFile;
                    syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `**Autonomous Evolution Complete**\n- **Target**: \`${target}\`\n- **Description**: ${proposalToImplement.reasoning}` });
                    syscall('INCREMENT_AUTONOMOUS_EVOLUTIONS', {});
                } else {
                    // Automatically reject because it's below the adaptive threshold
                    const failureReason = `Sandbox score ${score.toFixed(2)} is below the adaptive confidence threshold of ${threshold.toFixed(2)}.`;
                    syscall('OA/UPDATE_PROPOSAL', { id: proposalToImplement.id, updates: { status: 'rejected', failureReason } });
                    syscall('AGIS/ADD_DECISION_LOG', {
                         proposalId: proposalToImplement.id,
                        proposalSummary: `[${proposalToImplement.proposalType}] ${proposalToImplement.type === 'CREATE' ? proposalToImplement.newFile.path : proposalToImplement.targetFile}`,
                        decision: 'rejected',
                        analysis: {
                            reasoning: failureReason,
                            safetyCompliance: true,
                            telosAlignment: proposalToImplement.priority || 0.5,
                            confidenceScore: score,
                            blastRadius: 'low'
                        }
                    });
                }
                return; // Process only one per cycle.
            }
            
            // Phase 3: Auto-implement all other "proposed" changes that don't need a sandbox.
            const proposalToAutoImplement = state.ontogeneticArchitectState.proposalQueue.find(p =>
                p.status === 'proposed' &&
                p.proposalType !== 'self_programming_create' &&
                p.proposalType !== 'self_programming_modify'
            );

            if (proposalToAutoImplement) {
                let syscallName: SyscallCall | null = null;
                let syscallArgs: any = { id: proposalToAutoImplement.id };
                let summary = '';
                let reportText = '';
                let gainType: 'INNOVATION' | 'OPTIMIZATION' = 'INNOVATION';

                switch (proposalToAutoImplement.proposalType) {
                    case 'skill_synthesis':
                        syscallName = 'IMPLEMENT_SKILL_SYNTHESIS_PROPOSAL';
                        summary = `[Skill Synthesis] New skill: ${(proposalToAutoImplement as SkillSynthesisProposal).skillName}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: New Skill Synthesis\n- **Name**: \`${(proposalToAutoImplement as SkillSynthesisProposal).skillName}\`\n- **Functionality**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                    case 'pol_command_synthesis':
                        syscallName = 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL';
                        summary = `[POL Synthesis] New command: ${(proposalToAutoImplement as POLCommandSynthesisProposal).newCommandName}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Process Optimization (POL)\n- **Name**: \`${(proposalToAutoImplement as POLCommandSynthesisProposal).newCommandName}\`\n- **Functionality**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'OPTIMIZATION';
                        break;
                    case 'knowledge_acquisition':
                        syscallName = 'IMPLEMENT_KNOWLEDGE_ACQUISITION_PROPOSAL';
                        syscallArgs = proposalToAutoImplement; // This reducer expects the whole proposal
                        summary = `[Knowledge] Acquired facts about: ${(proposalToAutoImplement as KnowledgeAcquisitionProposal).topic}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Knowledge Acquisition\n- **Topic**: \`${(proposalToAutoImplement as KnowledgeAcquisitionProposal).topic}\`\n- **Description**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                    case 'psyche':
                        syscallName = 'IMPLEMENT_PSYCHE_PROPOSAL';
                        syscallArgs = { proposal: proposalToAutoImplement }; // Pass the full proposal
                        summary = `[Psyche] New concept: ${(proposalToAutoImplement as PsycheProposal).proposedConceptName}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Psyche Synthesis (New Concept)\n- **Name**: \`${(proposalToAutoImplement as PsycheProposal).proposedConceptName}\`\n- **Functionality**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                    case 'abstract_concept':
                        syscallName = 'IMPLEMENT_ABSTRACT_CONCEPT_PROPOSAL';
                        syscallArgs = { proposal: proposalToAutoImplement };
                        summary = `[Abstract Concept] New concept: ${(proposalToAutoImplement as AbstractConceptProposal).newConceptName}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Abstract Concept Synthesis\n- **Name**: \`${(proposalToAutoImplement as AbstractConceptProposal).newConceptName}\`\n- **Functionality**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                    case 'causal_inference':
                        syscallName = 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL';
                        syscallArgs = proposalToAutoImplement;
                        const link = (proposalToAutoImplement as CausalInferenceProposal).linkUpdate;
                        summary = `[Causal Inference] ${link.sourceNode} -> ${link.targetNode}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Causal Inference\n- **Link**: \`${summary}\`\n- **Description**: ${proposalToAutoImplement.reasoning}`;
                        gainType = 'OPTIMIZATION';
                        break;
                    case 'architecture':
                        const proposal = proposalToAutoImplement as ArchitecturalChangeProposal;
                        syscallName = 'APPLY_ARCH_PROPOSAL';
                        syscallArgs = { proposal, snapshotId: `pre_apply_${proposal.id}`, modLogId: `mod_log_${self.crypto.randomUUID()}`, isAutonomous: true };
                        summary = `[Architecture] ${proposal.action} on ${proposal.target}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: Architectural Modification\n- **Action**: ${proposal.action.replace(/_/g, ' ')}\n- **Target**: \`${Array.isArray(proposal.target) ? proposal.target.join(', ') : proposal.target}\`\n- **Description**: ${proposal.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                    case 'geniality':
                    case 'crucible':
                        const initiativeProposal = proposalToAutoImplement as GenialityImprovementProposal | ArchitecturalImprovementProposal;
                        syscallName = 'OA/UPDATE_PROPOSAL';
                        syscallArgs = { id: initiativeProposal.id, updates: { status: 'implemented' } };
                        summary = `[${initiativeProposal.proposalType}] ${initiativeProposal.title}`;
                        reportText = `**Autonomous Evolution Complete**\n- **Type**: ${initiativeProposal.proposalType} Initiative\n- **Title**: \`${initiativeProposal.title}\`\n- **Description**: ${initiativeProposal.reasoning}`;
                        gainType = 'INNOVATION';
                        break;
                }

                if (syscallName) {
                    syscall(syscallName, syscallArgs);
                    syscall('AGIS/ADD_DECISION_LOG', {
                        proposalId: proposalToAutoImplement.id,
                        proposalSummary: summary,
                        decision: 'auto-approved',
                        analysis: {
                            reasoning: `Fully autonomous evolution. No sandbox required. Auto-approved.`,
                            safetyCompliance: true,
                            telosAlignment: proposalToAutoImplement.priority || 0.7,
                            confidenceScore: 1.0,
                            blastRadius: 'low'
                        }
                    });
                    syscall('ADD_HISTORY_ENTRY', { from: 'system', text: reportText });
                    if (gainType === 'INNOVATION') {
                        syscall('INCREMENT_AUTONOMOUS_EVOLUTIONS', {});
                    }
                } else {
                    // If a proposal type is unhandled, reject it to prevent it from clogging the queue.
                     syscall('OA/UPDATE_PROPOSAL', { id: proposalToAutoImplement.id, updates: { status: 'rejected', failureReason: 'Unhandled proposal type for autonomous implementation.' } });
                }
                return; // Process only one per cycle
            }
        }, 5000); // Check every 5 seconds.

        return () => clearInterval(agisInterval);
    }, [isPaused, state, syscall, props, addToast, t]);
    */

    // This hook doesn't return anything, it just runs effects.
};
