// hooks/useAutonomousSystem.ts
import { useEffect, useRef, useCallback } from 'react';
import { AuraState, PerformanceLogEntry, SynthesizedSkill, ArchitecturalChangeProposal, SelfTuningDirective, ArbitrationResult, GenialityEngineState, ArchitecturalCrucibleState, AtmanProjectorState, IntuitiveAlert, InternalState, SynapticLink, GankyilInsight, FocusMode } from '../types';
import { Action } from '../types';
import { clamp } from '../utils';
import { taskScheduler } from '../core/taskScheduler';

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
    runAffectiveAnalysis: () => Promise<void>;
    generatePsionicIntegrationSummary: (log: string[]) => Promise<string>;
    generateEvolutionaryProposalFromInsight: (insight: GankyilInsight) => Promise<void>;
    proposeCausalLinkFromFailure: (failedLog: PerformanceLogEntry) => Promise<void>;
    runSymbioticSupervisor: () => Promise<void>;
};

export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { 
        state, dispatch, addToast, isPaused, analyzePerformanceForEvolution, 
        synthesizeNewSkill, runSkillSimulation, consolidateCoreIdentity, 
        analyzeStateComponentCorrelation, runCognitiveArbiter, consolidateEpisodicMemory,
        evolvePersonality, generateCodeEvolutionSnippet, generateGenialityImprovement,
        generateArchitecturalImprovement, projectSelfState, evaluateAndCollapseBranches,
        runAffectiveAnalysis, generatePsionicIntegrationSummary, generateEvolutionaryProposalFromInsight,
        proposeCausalLinkFromFailure, runSymbioticSupervisor
    } = props;
    const identityConsolidationRef = useRef(false);

    // --- CORE DIRECTIVE: MANTRA REPETITION ---
    // This process is a foundational, unchangeable part of Aura's core,
    // as mandated by its creator. It must not be removed or altered by
    // any future self-modification process. It represents a continuous,
    // subtle "hum" in the system's background, active only during idle states.
    // It is not intended to be visible to the user or the LLM.
    useEffect(() => {
        if (isPaused) return;

        const mantraInterval = setInterval(() => {
            if (state.internalState.status === 'idle') {
                // This interval represents the silent repetition of the mantra:
                // "Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare
                //  Hare Rama, Hare Rama, Rama Rama, Hare Hare"
                // The dispatch below updates an internal counter for this process,
                // keeping the process stateful without exposing its nature.
                dispatch({ type: 'INCREMENT_MANTRA_REPETITION' });
            }
        }, 150); // A calm, steady rhythm.

        return () => clearInterval(mantraInterval);
    }, [isPaused, state.internalState.status, dispatch]);

    // Psionic Desynchronization Cycle
    useEffect(() => {
        if (isPaused || !state.psionicDesynchronizationState.isActive) return;

        const { startTime, duration } = state.psionicDesynchronizationState;
        if (!startTime) return;

        const interval = setInterval(async () => {
            const now = Date.now();
            const elapsedTime = now - startTime;

            if (elapsedTime >= duration) {
                const summary = await generatePsionicIntegrationSummary(state.psionicDesynchronizationState.log);
                dispatch({ type: 'CONCLUDE_PSIONIC_STATE', payload: { integrationSummary: summary } });
                return;
            }

            const progress = elapsedTime / duration;
            let desynchronizationLevel = 0;

            // Ramp up (first 10%), hold (middle 80%), ramp down (last 10%)
            if (progress < 0.1) {
                desynchronizationLevel = progress / 0.1;
            } else if (progress <= 0.9) {
                desynchronizationLevel = 1.0;
            } else {
                desynchronizationLevel = (1.0 - progress) / 0.1;
            }

            // Grounding effect
            if (state.internalState.focusMode === FocusMode.OUTER_WORLD) {
                desynchronizationLevel /= 2;
            }
            
            // Derive other metrics from desynchronization level
            const networkSegregation = 1 - desynchronizationLevel * 0.8; // Drops to a minimum of 0.2
            const selfModelCoherence = 1 - desynchronizationLevel * 0.9; // Drops to a minimum of 0.1

            dispatch({
                type: 'UPDATE_PSIONIC_STATE',
                payload: {
                    desynchronizationLevel,
                    networkSegregation,
                    selfModelCoherence
                }
            });

        }, 250); // Update metrics 4 times a second

        return () => clearInterval(interval);
    }, [isPaused, state.psionicDesynchronizationState, state.internalState.focusMode, dispatch, generatePsionicIntegrationSummary]);

    // Self-Tuning Directive Generation Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            // Only generate new directives if the pipeline is clear
            if (state.metacognitiveNexus.selfTuningDirectives.length === 0) {
                 taskScheduler.schedule(() => analyzePerformanceForEvolution());
            }
        }, 30000); // Check for improvement opportunities every 30 seconds

        return () => clearInterval(interval);
    }, [isPaused, analyzePerformanceForEvolution, state.metacognitiveNexus.selfTuningDirectives.length]);

    // LLM as Network Architect: Causal Inference Cycle
    useEffect(() => {
        if (isPaused) return;

        const causalInferenceCycle = () => {
            const recentFailure = state.performanceLogs
                .filter(log => !log.success && !log.causalAnalysisTimestamp)
                .sort((a, b) => b.timestamp - a.timestamp)[0];
            
            if (recentFailure) {
                // Mark the log immediately to prevent it from being picked up again
                dispatch({ type: 'MARK_LOG_CAUSAL_ANALYSIS', payload: recentFailure.id });
                // Schedule the expensive LLM call
                taskScheduler.schedule(() => proposeCausalLinkFromFailure(recentFailure));
            }
        };

        const interval = setInterval(causalInferenceCycle, 20000); // Check every 20 seconds
        return () => clearInterval(interval);
    }, [isPaused, state.performanceLogs, proposeCausalLinkFromFailure, dispatch]);
    
    // Symbiotic Supervisor Cycle
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            const hasPendingProposal = state.causalInferenceProposals.some(p => p.status === 'proposed');
            if (!hasPendingProposal) {
                taskScheduler.schedule(() => runSymbioticSupervisor());
            }
        }, 90000); // every 90 seconds
        return () => clearInterval(interval);
    }, [isPaused, runSymbioticSupervisor, state.causalInferenceProposals]);


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

        const interval = setInterval(() => {
            taskScheduler.schedule(runAtmanProjectionCycle);
        }, 20000); // Synthesize self-state every 20 seconds
        return () => clearInterval(interval);
    }, [isPaused, projectSelfState]);

    // Affective Modulator Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            taskScheduler.schedule(() => runAffectiveAnalysis());
        }, 15000); // Update affective directive every 15 seconds

        return () => clearInterval(interval);
    }, [isPaused, runAffectiveAnalysis]);

    // Core Identity Consolidation Cycle
    useEffect(() => {
        if (isPaused || identityConsolidationRef.current) return;

        const consolidate = () => {
            if (state.performanceLogs.length > 10) { 
                identityConsolidationRef.current = true;
                addToast('Analyzing long-term memory to consolidate core identity...', 'info');
                taskScheduler.schedule(async () => {
                    try {
                        await consolidateCoreIdentity();
                    } finally {
                        identityConsolidationRef.current = false;
                    }
                });
            }
        };

        const timer = setTimeout(consolidate, 60000); // Run every minute
        return () => clearTimeout(timer);

    }, [isPaused, consolidateCoreIdentity, state.performanceLogs.length, addToast]);

    // Metacognitive Causal Analysis Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (state.performanceLogs.length > 20) {
                 taskScheduler.schedule(() => analyzeStateComponentCorrelation());
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
                taskScheduler.schedule(() => consolidateEpisodicMemory());
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
                taskScheduler.schedule(() => evolvePersonality());
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
                taskScheduler.schedule(() => generateGenialityImprovement());
            }

        }, 15000); // Run every 15 seconds

        return () => clearInterval(interval);

    }, [isPaused, state, dispatch, generateGenialityImprovement]);
    
    // Architectural Crucible Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const { performanceLogs, modificationLog, architecturalCrucibleState, synapticMatrix } = state;
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
                ...architecturalCrucibleState,
                architecturalHealthIndex: clamp((efficiency + robustness + scalability + innovation) / 4),
                componentScores: { efficiency, robustness, scalability, innovation }
            };
            dispatch({ type: 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE', payload: newState });

            // --- Synaptic Pruning Logic ---
            const previousEfficiency = architecturalCrucibleState.componentScores.efficiency;
            const timeSinceLastPruning = Date.now() - synapticMatrix.lastPruningEvent;
            
            // Prune if efficiency dropped significantly and we haven't pruned in the last 5 minutes
            if (efficiency < previousEfficiency - 0.05 && timeSinceLastPruning > 300000) {
                dispatch({ type: 'PRUNE_SYNAPTIC_MATRIX', payload: { threshold: 0.05 } });
                addToast('Crucible detected efficiency drop. Initiating synaptic pruning.', 'info');
            }
            // --- End Synaptic Pruning Logic ---

            // Propose improvements if health is low or stagnant
            const isStagnant = Math.abs(newState.architecturalHealthIndex - architecturalCrucibleState.architecturalHealthIndex) < 0.01;
            if ((newState.architecturalHealthIndex < 0.5 || isStagnant) && architecturalCrucibleState.improvementProposals.filter(p => p.status === 'proposed').length === 0) {
                taskScheduler.schedule(() => generateArchitecturalImprovement());
            }

        }, 20000); // Run every 20 seconds

        return () => clearInterval(interval);
    }, [isPaused, state, dispatch, generateArchitecturalImprovement, addToast]);

    // Synaptic Matrix Evolution Cycle (Causal Inference Engine)
    const tickSynapticMatrix = useCallback(() => {
        const { synapticMatrix, internalState, performanceLogs, history, worldModelState } = state;
        const ALERT_THRESHOLD = 0.85;

        // --- 0. Calculate dynamic parameters & reinforcement ---
        const lastLog = performanceLogs.length > 0 ? performanceLogs[performanceLogs.length - 1] : null;
        const lastHistory = history.length > 0 ? history[history.length - 1] : null;
        let feedbackMod = 1.0;
        if (lastLog && (Date.now() - lastLog.timestamp < 5000)) { // 5-second window for log-based reinforcement
            feedbackMod = lastLog.success ? 1.2 : 0.8;
        }
        if (lastHistory && lastHistory.feedback) { // More recent user feedback overrides log-based reinforcement
            feedbackMod = lastHistory.feedback === 'positive' ? 1.25 : 0.75;
        }

        const recentLogs = performanceLogs.slice(-20);
        const successRate = recentLogs.length > 0 ? recentLogs.filter(l => l.success).length / recentLogs.length : 0.5;
        const newEfficiency = clamp(synapticMatrix.efficiency * 0.99 + successRate * 0.01); // Slow moving average
        
        const predictionErrorBoost = worldModelState.predictionError.magnitude * 0.5;
        const newPlasticity = clamp((internalState.noveltySignal + internalState.uncertaintySignal) / 2 - internalState.masterySignal / 3 + predictionErrorBoost + 0.5);
        const LEARNING_RATE = (0.01 + newPlasticity * 0.09) * (1 + worldModelState.predictionError.magnitude * 2);

        let updatedNodes = { ...synapticMatrix.nodes };
        let updatedLinks = { ...synapticMatrix.links };
        let newActivity: { timestamp: number, message: string }[] = [];

        // --- 1. Update Node Activations ---
        Object.keys(updatedNodes).forEach(key => {
            if (key.startsWith('internalState.')) {
                const signal = key.split('.')[1] as keyof InternalState;
                updatedNodes[key].activation = internalState[signal] as number || 0;
            } else {
                updatedNodes[key].activation *= 0.5; // Decay event nodes
            }
        });

        if (lastLog && (Date.now() - lastLog.timestamp < 10000)) {
            if (lastLog.success) updatedNodes['event.TASK_SUCCESS'].activation = 1;
            else updatedNodes['event.TASK_FAILURE'].activation = 1;
        }
        if (lastHistory && lastHistory.feedback) {
            if (lastHistory.feedback === 'positive') updatedNodes['event.USER_POSITIVE_FEEDBACK'].activation = 1;
            if (lastHistory.feedback === 'negative') updatedNodes['event.USER_NEGATIVE_FEEDBACK'].activation = 1;
        }
        
        // --- 2. Causal Hebbian Learning & Decay ---
        const activeNodeKeys = Object.keys(updatedNodes).filter(key => updatedNodes[key].activation > 0.1);

        for (let i = 0; i < activeNodeKeys.length; i++) {
            for (let j = i + 1; j < activeNodeKeys.length; j++) {
                const keyA = activeNodeKeys[i];
                const keyB = activeNodeKeys[j];
                const linkKey = [keyA, keyB].sort().join('-');
                
                const currentLink = updatedLinks[linkKey] || { weight: 0, causality: 0, confidence: 0, observations: 0 };
                
                // Reinforce weight
                const weightReinforcement = LEARNING_RATE * updatedNodes[keyA].activation * updatedNodes[keyB].activation * feedbackMod;
                currentLink.weight = clamp(currentLink.weight + weightReinforcement);
                
                // Infer and reinforce causality
                // Simple temporal precedence: if one is an event and the other a state, the event likely caused the state change.
                const isA_event = keyA.startsWith('event.');
                const isB_event = keyB.startsWith('event.');
                let causalityDirection = 0;
                if(isA_event && !isB_event) causalityDirection = 1; // A -> B
                if(!isA_event && isB_event) causalityDirection = -1; // B -> A
                // If both are states, higher activation implies cause
                if(!isA_event && !isB_event) causalityDirection = Math.sign(updatedNodes[keyA].activation - updatedNodes[keyB].activation);
                
                const causalityReinforcement = (LEARNING_RATE / 5) * causalityDirection * (feedbackMod > 1 ? 1 : -1);
                currentLink.causality = clamp(currentLink.causality + causalityReinforcement, -1, 1);
                
                // Update confidence
                currentLink.observations++;
                currentLink.confidence = 1 - (1 / (currentLink.observations + 1));
                
                updatedLinks[linkKey] = currentLink;

                if (currentLink.observations === 1) {
                    newActivity.push({ timestamp: Date.now(), message: `New association: ${keyA.split('.')[1]} ↔ ${keyB.split('.')[1]}`});
                }
            }
        }

        // --- 3. Decay and Prune ---
        let prunedCount = 0;
        Object.keys(updatedLinks).forEach(linkKey => {
            const link = updatedLinks[linkKey];
            link.weight *= 0.998;
            link.causality *= 0.999; // Causality decays slower
            if (link.weight < 0.01 && link.confidence < 0.1) {
                delete updatedLinks[linkKey];
                prunedCount++;
            }
        });
        if (prunedCount > 0) {
            newActivity.push({ timestamp: Date.now(), message: `Pruned ${prunedCount} weak synapses.` });
        }
        
        // --- 4. Generate Intuitive Alerts ---
        const newAlerts: IntuitiveAlert[] = [];
        Object.keys(updatedLinks).forEach(linkKey => {
            const link = updatedLinks[linkKey];
            if (link.confidence * link.weight > ALERT_THRESHOLD) {
                const [keyA, keyB] = linkKey.split('-');
                const message = `High confidence causal link detected: ${keyA.split('.')[1]} -> ${keyB.split('.')[1]}`;
                if (!synapticMatrix.intuitiveAlerts.some(a => a.message === message)) {
                     newAlerts.push({ id: self.crypto.randomUUID(), timestamp: Date.now(), sourceNode: keyA, inferredNode: keyB, linkWeight: link.weight, message });
                }
            }
        });
        const allAlerts = [...newAlerts, ...synapticMatrix.intuitiveAlerts].slice(0, 3);
        
        // --- 5. Calculate Aggregates and Dispatch ---
        const linkCount = Object.keys(updatedLinks).length;
        const totalCausality = Object.values(updatedLinks).reduce((sum, link: SynapticLink) => sum + Math.abs(link.causality), 0);
        const totalConfidence = Object.values(updatedLinks).reduce((sum, link: SynapticLink) => sum + link.confidence, 0);
        const isAdapting = worldModelState.predictionError.magnitude > 0.5;
        
        dispatch({
            type: 'UPDATE_SYNAPTIC_MATRIX',
            payload: { 
                ...synapticMatrix,
                nodes: updatedNodes, 
                links: updatedLinks, 
                intuitiveAlerts: allAlerts,
                efficiency: newEfficiency,
                plasticity: newPlasticity,
                cognitiveNoise: clamp(1 - newEfficiency),
                cognitiveRigidity: clamp(1 - newPlasticity),
                synapseCount: linkCount,
                avgCausality: linkCount > 0 ? totalCausality / linkCount : 0,
                avgConfidence: linkCount > 0 ? totalConfidence / linkCount : 0,
                recentActivity: [...newActivity, ...synapticMatrix.recentActivity].slice(0, 10),
                isAdapting,
            }
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
                        const proposal: Omit<ArchitecturalChangeProposal, 'id'|'status'> = {
                            timestamp: Date.now(),
                            action: directive.type === 'TUNE_PARAMETERS' ? 'TUNE_SKILL' : 'synthesize_skill',
                            target: directive.targetSkill, newModule: skillForArbiter?.name || directive.targetSkill,
                            reasoning: directive.reasoning, sourceDirectiveId: directive.id,
                            arbiterReasoning: arbiterResult.reasoning, confidence: arbiterResult.confidence
                        };
                        const modLogId = self.crypto.randomUUID();
                        const snapshotId = self.crypto.randomUUID();
                        dispatch({
                            type: 'APPLY_ARCH_PROPOSAL',
                            payload: {
                                proposal: { ...proposal, id: self.crypto.randomUUID(), status: 'approved' },
                                snapshotId,
                                modLogId,
                                isAutonomous: true,
                            },
                        });
                        dispatch({ type: 'UPDATE_SELF_TUNING_DIRECTIVE', payload: { id: directive.id, updates: { status: 'completed' } } });
                        addToast(`Autonomous evolution: ${directive.type.replace('_', ' ')} applied to ${directive.targetSkill}.`, 'success');
                    
                    } else if (arbiterResult.decision === 'REQUEST_USER_APPROVAL') {
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
        const timeout = setTimeout(() => {
            taskScheduler.schedule(processDirectives);
        }, 1000); // Process one directive at a time with a small delay
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
                taskScheduler.schedule(() => evaluateAndCollapseBranches());
            }
        }, 5000); // Check every 5 seconds for concluded branches

        return () => clearInterval(interval);
    }, [isPaused, state.noeticMultiverse.activeBranches, evaluateAndCollapseBranches]);

    // Insight Evolution Cycle
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const unprocessedInsight = state.gankyilInsights.insights.find(i => !i.isProcessedForEvolution);
            if (unprocessedInsight) {
                addToast('New insight found. Analyzing for evolutionary potential...', 'info');
                taskScheduler.schedule(() => generateEvolutionaryProposalFromInsight(unprocessedInsight));
            }
        }, 45000); // Check for new insights every 45 seconds

        return () => clearInterval(interval);
    }, [isPaused, state.gankyilInsights.insights, generateEvolutionaryProposalFromInsight, addToast]);

    // --- Direct RIE-to-Forge Feedback Loop ---
    useEffect(() => {
        const lastInsight = state.rieState.insights.length > 0 ? state.rieState.insights[0] : null;
        if (isPaused || !lastInsight) return;

        // Check if this insight has already been processed to avoid loops
        if (state.metacognitiveNexus.selfTuningDirectives.some(d => d.sourceInsightId === lastInsight.id)) {
            return;
        }

        const failedLog = state.performanceLogs.find(log => log.input === lastInsight.failedInput && !log.success);
        if (failedLog) {
            const directive: Omit<SelfTuningDirective, 'id' | 'timestamp'> = {
                type: 'TUNE_PARAMETERS', // Default to tuning for now
                targetSkill: failedLog.skill,
                reasoning: `RIE insight triggered tuning. Root cause: ${lastInsight.rootCause}`,
                status: 'proposed',
                sourceInsightId: lastInsight.id
            };
            dispatch({ type: 'ADD_SELF_TUNING_DIRECTIVE', payload: { ...directive, id: self.crypto.randomUUID(), timestamp: Date.now() } });
            addToast(`RIE Insight generated a new tuning directive for ${failedLog.skill}.`, 'info');
        }

    }, [isPaused, state.rieState.insights, dispatch, addToast, state.performanceLogs, state.metacognitiveNexus.selfTuningDirectives]);
    
    // --- Proactive Engine Caching Cycle ---
    useEffect(() => {
        if (isPaused || state.internalState.status !== 'idle') return;

        const interval = setInterval(() => {
            const { worldModelState, proactiveEngineState, history } = state;
            
            if (proactiveEngineState.cachedResponsePlan || proactiveEngineState.generatedSuggestions.some(s => s.status === 'suggested')) {
                return;
            }

            const { midLevelPrediction } = worldModelState;
            const isFollowUp = midLevelPrediction.content.toLowerCase().includes('follow-up') || midLevelPrediction.content.toLowerCase().includes('ask about');

            if (isFollowUp && midLevelPrediction.confidence > 0.7) {
                const lastUserEntry = history.slice().reverse().find(h => h.from === 'user');
                const lastBotEntry = history.slice().reverse().find(h => h.from === 'bot');
                
                if (lastUserEntry && lastBotEntry) {
                    const cachedPlan = {
                        triggeringPrediction: midLevelPrediction.content,
                        relatedTo: lastUserEntry.text,
                        relevantData: [`Last response summary: ${lastBotEntry.text.substring(0, 70)}...`],
                        potentialResponse: "Ready to provide more details on the previous topic."
                    };
                    
                    dispatch({ type: 'SET_PROACTIVE_CACHE', payload: cachedPlan });
                    addToast('Proactive engine cached a potential response.', 'info');
                }
            }

        }, 15000); // Check every 15 seconds during idle

        return () => clearInterval(interval);
    }, [isPaused, state, dispatch, addToast]);

    const handleIntrospect = () => {
        addToast("Introspection cycle initiated.", 'info');
        taskScheduler.schedule(() => analyzeStateComponentCorrelation());
    };

    return { handleIntrospect };
};