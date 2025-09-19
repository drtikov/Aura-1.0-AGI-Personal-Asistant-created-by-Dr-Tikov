import { useEffect, useRef, useCallback } from 'react';
// FIX: Added InternalState to imports to resolve a type error.
import { AuraState, PerformanceLogEntry, SynthesizedSkill, ArchitecturalChangeProposal, SelfTuningDirective, ArbitrationResult, GenialityEngineState, ArchitecturalCrucibleState, AtmanProjectorState, IntuitiveAlert, InternalState } from '../types';
import { Action } from '../types';
import { clamp } from '../utils';

type UseAutonomousSystemProps = {
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    addToast: (message: string, type?: any) => void;
    isPaused: boolean;
    synthesizeNewSkill: (directive: SelfTuningDirective) => Promise<void>;
    runSkillSimulation: (directive: SelfTuningDirective, skill?: SynthesizedSkill) => Promise<any>;
    analyzePerformanceForEvolution: () => Promise<void>;
    consolidateCoreIdentity: () => Promise<void>;
    analyzeStateComponentCorrelation: () => Promise<void>;
    runCognitiveArbiter: (directive: SelfTuningDirective, skill?: SynthesizedSkill) => Promise<ArbitrationResult | null>;
    consolidateEpisodicMemory: () => Promise<void>;
    evolvePersonality: () => Promise<void>;
    generateCodeEvolutionSnippet: (reasoning: string, targetFile: string) => Promise<void>;
    generateGenialityImprovement: () => Promise<void>;
    generateArchitecturalImprovement: () => Promise<void>;
    projectSelfState: () => Promise<void>;
    evaluateAndCollapseBranches: () => Promise<void>;
};

export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { 
        state, dispatch, addToast, isPaused, analyzePerformanceForEvolution, 
        synthesizeNewSkill, runSkillSimulation, consolidateCoreIdentity, 
        analyzeStateComponentCorrelation, runCognitiveArbiter, consolidateEpisodicMemory,
        evolvePersonality, generateCodeEvolutionSnippet, generateGenialityImprovement,
        generateArchitecturalImprovement, projectSelfState, evaluateAndCollapseBranches
    } = props;
    const identityConsolidationRef = useRef(false);

    // Self-Tuning Directive Generation Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            // Only generate new directives if the pipeline is clear
            if (state.metacognitiveNexus.selfTuningDirectives.length === 0) {
                 analyzePerformanceForEvolution();
            }
        }, 30000); // Check for improvement opportunities every 30 seconds

        return () => clearInterval(interval);
    }, [isPaused, analyzePerformanceForEvolution, state.metacognitiveNexus.selfTuningDirectives.length]);
    
    // Atman Projector Cycle (Self-Awareness Synthesis)
    useEffect(() => {
        if (isPaused) return;

        const runAtmanProjectionCycle = async () => {
            try {
                await projectSelfState();
            } catch (error) {
                console.error("Atman Projection Cycle failed:", error);
            }
        };

        const interval = setInterval(runAtmanProjectionCycle, 20000); // Synthesize self-state every 20 seconds
        return () => clearInterval(interval);
    }, [isPaused, projectSelfState]);

    // Core Identity Consolidation Cycle
    useEffect(() => {
        if (isPaused || identityConsolidationRef.current) return;

        const consolidate = () => {
            if (state.performanceLogs.length > 10) { 
                identityConsolidationRef.current = true;
                addToast('Analyzing long-term memory to consolidate core identity...', 'info');
                consolidateCoreIdentity().finally(() => { identityConsolidationRef.current = false; });
            }
        };

        const timer = setTimeout(consolidate, 60000); // Run every minute
        return () => clearTimeout(timer);

    }, [isPaused, consolidateCoreIdentity, state.performanceLogs.length]);

    // Metacognitive Causal Analysis Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (state.performanceLogs.length > 20) {
                 analyzeStateComponentCorrelation();
            }
        }, 120000); // Run every 2 minutes

        return () => clearInterval(interval);
    }, [isPaused, analyzeStateComponentCorrelation, state.performanceLogs.length]);

    // Memory Consolidation Cycle
    useEffect(() => {
        if (isPaused || state.memoryConsolidationState.status === 'consolidating') return;

        const interval = setInterval(() => {
            // Check if enough time has passed and there are new logs to process
            const timeSinceLast = Date.now() - state.memoryConsolidationState.lastConsolidation;
            const newLogsCount = state.performanceLogs.filter(log => log.timestamp > state.memoryConsolidationState.lastConsolidation).length;

            if (timeSinceLast > 180000 && newLogsCount > 5) { // Consolidate every 3 minutes if there's something new
                consolidateEpisodicMemory();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [isPaused, state.memoryConsolidationState, state.performanceLogs, consolidateEpisodicMemory]);

    // Persona Evolution Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            // Evolve personality if there are recent memories to reflect upon
            if (state.episodicMemoryState.episodes.length > 0) {
                evolvePersonality();
            }
        }, 300000); // Run every 5 minutes

        return () => clearInterval(interval);
    }, [isPaused, state.episodicMemoryState.episodes.length, evolvePersonality]);

    // Geniality Engine Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const { internalState, ingenuityState, rieState, selfAwarenessState } = state;

            // 1. Calculate component scores
            const creativity = clamp((internalState.noveltySignal + ingenuityState.unconventionalSolutionBias) / 2);
            const insight = clamp((internalState.wisdomSignal + rieState.clarityScore) / 2);
            const synthesis = clamp(selfAwarenessState.modelCoherence);
            const flow = clamp(1 - internalState.load);

            // 2. Calculate overall Geniality Index (weighted average)
            const genialityIndex = clamp(
                (creativity * 0.3) + (insight * 0.3) + (synthesis * 0.25) + (flow * 0.15)
            );

            const newState: GenialityEngineState = {
                ...state.genialityEngineState,
                genialityIndex,
                componentScores: { creativity, insight, synthesis, flow }
            };

            dispatch({ type: 'UPDATE_GENIALITY_STATE', payload: newState });

            // 3. Check for stagnation or low index and propose improvements
            const isStagnant = Math.abs(genialityIndex - state.genialityEngineState.genialityIndex) < 0.01;
            if ((genialityIndex < 0.4 || isStagnant) && state.genialityEngineState.improvementProposals.filter(p=> p.status === 'proposed').length === 0) {
                generateGenialityImprovement();
            }

        }, 15000); // Run every 15 seconds

        return () => clearInterval(interval);

    }, [isPaused, state, dispatch, generateGenialityImprovement]);
    
    // Architectural Crucible Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const { performanceLogs, modificationLog } = state;
            const recentLogs = performanceLogs.slice(-50);
            if (recentLogs.length < 10) return;

            // Efficiency: Higher is better. Inversely related to duration, positively to success.
            const avgDuration = recentLogs.reduce((acc, log) => acc + log.duration, 0) / recentLogs.length;
            const normalizedDuration = clamp(avgDuration / 5000); // Normalize based on a 5s soft cap
            const successRate = recentLogs.filter(log => log.success).length / recentLogs.length;
            const efficiency = clamp((1 - normalizedDuration) * 0.5 + successRate * 0.5);

            // Robustness: Higher is better. Directly success rate.
            const robustness = successRate;

            // Scalability: Higher is better. Stability of resource allocation.
            const scalability = state.resourceMonitor.resource_allocation_stability;

            // Innovation: Rate of successful, autonomous modifications in recent history.
            const recentModifications = modificationLog.slice(0, 20);
            const successfulAutonomousMods = recentModifications.filter(m => m.isAutonomous && m.validationStatus === 'validated').length;
            const innovation = clamp(successfulAutonomousMods / 10); // Normalize based on a goal of 1 successful mod every 2

            const newState: ArchitecturalCrucibleState = {
                ...state.architecturalCrucibleState,
                architecturalHealthIndex: clamp((efficiency + robustness + scalability + innovation) / 4),
                componentScores: { efficiency, robustness, scalability, innovation }
            };
            dispatch({ type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE', payload: newState });

            // Propose improvements if health is low or stagnant
            const isStagnant = Math.abs(newState.architecturalHealthIndex - state.architecturalCrucibleState.architecturalHealthIndex) < 0.01;
            if ((newState.architecturalHealthIndex < 0.5 || isStagnant) && state.architecturalCrucibleState.improvementProposals.filter(p => p.status === 'proposed').length === 0) {
                generateArchitecturalImprovement();
            }

        }, 20000); // Run every 20 seconds

        return () => clearInterval(interval);
    }, [isPaused, state, dispatch, generateArchitecturalImprovement]);

    // Synaptic Matrix Evolution Cycle (Hebbian Learning)
    const tickSynapticMatrix = useCallback(() => {
        const { synapticMatrix, internalState, performanceLogs, history } = state;
        const LEARNING_RATE = 0.05;
        const DECAY_RATE = 0.998;
        const ALERT_THRESHOLD = 0.7;

        let updatedNodes = { ...synapticMatrix.nodes };
        let updatedLinks = { ...synapticMatrix.links };
        let newAlerts: IntuitiveAlert[] = [];

        // --- 1. Update Node Activations ---
        Object.keys(updatedNodes).forEach(key => {
            if (key.startsWith('internalState.')) {
                const signal = key.split('.')[1] as keyof InternalState;
                updatedNodes[key].activation = internalState[signal] as number || 0;
            } else {
                // Decay event nodes
                updatedNodes[key].activation *= 0.5;
            }
        });

        const lastLog = performanceLogs[performanceLogs.length - 1];
        if (lastLog && (Date.now() - lastLog.timestamp < 10000)) { // Only consider recent events
            if (lastLog.success) updatedNodes['event.TASK_SUCCESS'].activation = 1;
            else updatedNodes['event.TASK_FAILURE'].activation = 1;
        }

        const lastHistory = history[history.length - 1];
        if (lastHistory && lastHistory.feedback) {
            if (lastHistory.feedback === 'positive') updatedNodes['event.USER_POSITIVE_FEEDBACK'].activation = 1;
            if (lastHistory.feedback === 'negative') updatedNodes['event.USER_NEGATIVE_FEEDBACK'].activation = 1;
        }
        
        // --- 2. Hebbian Learning & Decay ---
        const activeNodeKeys = Object.keys(updatedNodes).filter(key => updatedNodes[key].activation > 0.1);

        for (let i = 0; i < activeNodeKeys.length; i++) {
            for (let j = i + 1; j < activeNodeKeys.length; j++) {
                const keyA = activeNodeKeys[i];
                const keyB = activeNodeKeys[j];
                const linkKey = [keyA, keyB].sort().join('-');
                
                const currentWeight = updatedLinks[linkKey]?.weight || 0;
                const reinforcement = LEARNING_RATE * updatedNodes[keyA].activation * updatedNodes[keyB].activation;
                updatedLinks[linkKey] = { weight: clamp(currentWeight + reinforcement) };
            }
        }

        Object.keys(updatedLinks).forEach(key => {
            updatedLinks[key].weight *= DECAY_RATE;
            if (updatedLinks[key].weight < 0.01) {
                delete updatedLinks[key]; // Pruning weak links
            }
        });

        // --- 3. Generate Intuitive Alerts ---
        activeNodeKeys.forEach(keyA => {
            Object.keys(updatedLinks).forEach(linkKey => {
                if (linkKey.includes(keyA)) {
                    const link = updatedLinks[linkKey];
                    if (link.weight > ALERT_THRESHOLD) {
                        const keyB = linkKey.replace(keyA, '').replace('-', '');
                        if (!activeNodeKeys.includes(keyB)) { // Don't alert for already active nodes
                            const message = `High activation of '${keyA.split('.')[1]}' suggests a strong connection to '${keyB.split('.')[1]}'.`;
                            newAlerts.push({ id: self.crypto.randomUUID(), timestamp: Date.now(), sourceNode: keyA, inferredNode: keyB, linkWeight: link.weight, message });
                        }
                    }
                }
            });
        });

        dispatch({
            type: 'UPDATE_SYNAPTIC_MATRIX',
            payload: { nodes: updatedNodes, links: updatedLinks, intuitiveAlerts: newAlerts.slice(0, 3) }
        });
    }, [state, dispatch]);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(tickSynapticMatrix, 5000); // Tick the network every 5 seconds
        return () => clearInterval(interval);
    }, [isPaused, tickSynapticMatrix]);


    // Self-Tuning Directive Processing Pipeline
    const processDirectives = useCallback(async () => {
        const directive = state.metacognitiveNexus.selfTuningDirectives.find(
            d => ['proposed', 'plan_generated', 'simulating', 'pending_arbitration'].includes(d.status)
        );

        if (!directive) return;

        try {
            switch (directive.status) {
                case 'proposed':
                    if (directive.type === 'SYNTHESIZE_SKILL') {
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'plan_generated' } } });
                        await synthesizeNewSkill(directive);
                    } else if (directive.type === 'GENERATE_CODE_EVOLUTION') {
                        await generateCodeEvolutionSnippet(directive.reasoning, directive.payload.targetFile);
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'completed' } } });
                    } else {
                        // For TUNE or REWRITE, we can go straight to simulation
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'simulating' } } });
                        const simResult = await runSkillSimulation(directive);
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { simulationResult: simResult, status: 'pending_arbitration' } } });
                    }
                    break;

                case 'plan_generated': // This status is set by synthesizeNewSkill
                     // The next step is simulation, which happens when the skill is added
                     // This is handled by ADD_SYNTHESIZED_SKILL reducer logic
                    break;
                
                case 'simulating':
                     const newSkill = state.cognitiveForgeState.synthesizedSkills.find(s => s.sourceDirectiveId === directive.id);
                     if (newSkill) {
                        const simResult = await runSkillSimulation(directive, newSkill);
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { simulationResult: simResult, status: 'pending_arbitration' } } });
                     }
                    break;

                case 'pending_arbitration':
                    const skillForArbiter = state.cognitiveForgeState.synthesizedSkills.find(s => s.sourceDirectiveId === directive.id);
                    const arbiterResult = await runCognitiveArbiter(directive, skillForArbiter);
                    if (!arbiterResult) throw new Error("Cognitive Arbiter failed to produce a decision.");

                    dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { arbitrationResult: arbiterResult } } });

                    if (arbiterResult.decision === 'APPROVE_AUTONOMOUSLY') {
                        // FIX: Added missing 'timestamp' property to the proposal object.
                        const proposal: Omit<ArchitecturalChangeProposal, 'id'|'status'> = {
                            timestamp: Date.now(),
                            action: directive.type === 'TUNE_PARAMETERS' ? 'TUNE_SKILL' : 'synthesize_skill',
                            target: directive.targetSkill, newModule: skillForArbiter?.name || directive.targetSkill,
                            reasoning: directive.reasoning, sourceDirectiveId: directive.id,
                            arbiterReasoning: arbiterResult.reasoning, confidence: arbiterResult.confidence
                        };
                        const modLogId = self.crypto.randomUUID();
                        const snapshotId = self.crypto.randomUUID();
                        dispatch({ type: 'APPLY_ARCH_PROPOSAL', payload: { proposal: { ...proposal, id: self.crypto.randomUUID(), status: 'approved' }, snapshotId, modLogId, isAutonomous: true } });
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'completed' } } });
                        addToast(`Autonomous evolution: ${directive.type.replace('_', ' ')} applied to ${directive.targetSkill}.`, 'success');
                    
                    } else if (arbiterResult.decision === 'REQUEST_USER_APPROVAL') {
                        // FIX: Added missing 'timestamp' property to the proposal object.
                        const proposal: Omit<ArchitecturalChangeProposal, 'id'|'status'> = {
                             timestamp: Date.now(),
                             action: directive.type === 'TUNE_PARAMETERS' ? 'TUNE_SKILL' : 'synthesize_skill',
                             target: directive.targetSkill, newModule: skillForArbiter?.name || directive.targetSkill,
                             reasoning: directive.reasoning, sourceDirectiveId: directive.id,
                             arbiterReasoning: arbiterResult.reasoning, confidence: arbiterResult.confidence
                        };
                        dispatch({ type: 'ADD_ARCH_PROPOSAL', payload: { proposal } });
                         dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'completed' } } }); // The proposal handles it from here
                    
                    } else { // REJECT
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'rejected' } } });
                        addToast(`Evolutionary directive for ${directive.targetSkill} was rejected by the Arbiter.`, 'warning');
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error processing directive ${directive.id}:`, error);
            addToast(`Error during autonomous evolution for ${directive.targetSkill}.`, 'error');
            dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'failed' } } });
        }
    }, [state.metacognitiveNexus.selfTuningDirectives, state.cognitiveForgeState.synthesizedSkills, dispatch, synthesizeNewSkill, runSkillSimulation, runCognitiveArbiter, addToast, generateCodeEvolutionSnippet]);

    useEffect(() => {
        if (isPaused) return;
        const timeout = setTimeout(processDirectives, 1000); // Process one directive at a time with a small delay
        return () => clearTimeout(timeout);
    }, [isPaused, processDirectives]);

    // Noetic Multiverse Collapse Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            // Check if there are branches that have been exploring for a while
            const now = Date.now();
            const concludedBranches = state.noeticMultiverse.activeBranches.filter(
                b => b.status === 'exploring' && (now - b.timestamp > 10000) // Conclude after 10s for demo
            );

            if (concludedBranches.length > 0) {
                evaluateAndCollapseBranches();
            }
        }, 5000); // Check every 5 seconds for concluded branches

        return () => clearInterval(interval);
    }, [isPaused, state.noeticMultiverse.activeBranches, evaluateAndCollapseBranches]);


    const handleIntrospect = () => {
        addToast("Introspection cycle initiated.", 'info');
        analyzeStateComponentCorrelation();
    };

    return { handleIntrospect };
};