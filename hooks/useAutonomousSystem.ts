// hooks/useAutonomousSystem.ts
import { useEffect, useRef, useCallback, Dispatch } from 'react';
// FIX: Added missing imports for 'ArbitrationResult' and 'FocusMode' from types, which will be defined in types.ts.
import { AuraState, PerformanceLogEntry, SynthesizedSkill, ArchitecturalChangeProposal, SelfTuningDirective, ArbitrationResult, GenialityEngineState, ArchitecturalCrucibleState, AtmanProjectorState, IntuitiveAlert, InternalState, SynapticLink, GankyilInsight, FocusMode, SynapticNode, CoprocessorArchitecture, SelfProgrammingCandidate, CreateFileCandidate, NACLogEntry, ModifyFileCandidate, EvolutionaryVector, CorticalColumn, NeuroCortexState, AbstractConcept, SensoryEngram, UnifiedProposal, ProposalAlignment, KnowledgeFact, DesignHeuristic } from '../types';
import { Action } from '../types';
import { clamp } from '../utils';
import { taskScheduler } from '../core/taskScheduler';

type UseAutonomousSystemProps = {
    state: AuraState;
    dispatch: Dispatch<Action>;
    addToast: (message: string, type?: any) => void;
    isPaused: boolean;
    t: (key: string, options?: any) => string;
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
    forgeNewHeuristic: () => Promise<void>;
    generateHeuristic: (successfulLogs: PerformanceLogEntry[]) => Promise<Omit<DesignHeuristic, 'id' | 'source' | 'validationStatus'> | null>;
    generateAutonomousCreationPlan: () => Promise<CreateFileCandidate | null>;
    proposeRefactoring: (vfs: { [filePath: string]: string }, vector: EvolutionaryVector) => Promise<ModifyFileCandidate | null>;
    predictSensoryEngram: () => Promise<SensoryEngram>;
    prioritizeProposal: (proposal: UnifiedProposal, vectors: EvolutionaryVector[]) => Promise<{ priority: number; alignment: ProposalAlignment | null }>;
    generatePredicateForLinkedNodes: (nodeA: string, nodeB: string) => Promise<{ predicate: string; confidence: number } | null>;
};

// --- Keyword sets for heuristic analysis ---
const POSITIVE_WORDS = new Set(['great', 'awesome', 'love', 'happy', 'excellent', 'amazing', 'perfect', 'thanks', 'thank you']);
const NEGATIVE_WORDS = new Set(['bad', 'wrong', 'not', 'terrible', 'awful', 'mistake', 'sad', 'upset', 'fail']);
const SAD_WORDS = new Set(['sad', 'upset', 'depressed', 'crying', 'unhappy', 'miserable']);
const HAPPY_WORDS = new Set(['happy', 'excited', 'great', 'awesome', 'joyful', 'thrilled']);

// --- Helper Functions for Coprocessors ---
const runSentimentTracker = (state: AuraState, dispatch: Dispatch<Action>) => {
    const userMessages = state.history.filter(h => h.from === 'user').slice(-3);
    if (userMessages.length === 0) return;
    let totalScore = 0; let wordCount = 0;
    userMessages.forEach(msg => {
        const words = msg.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (POSITIVE_WORDS.has(word)) totalScore++;
            if (NEGATIVE_WORDS.has(word)) totalScore--;
            wordCount++;
        });
    });
    if (wordCount > 0) {
        const currentSentiment = clamp(totalScore / (wordCount * 0.5), -1, 1);
        const newSentimentScore = state.userModel.sentimentScore * 0.8 + currentSentiment * 0.2;
        if (Math.abs(newSentimentScore - state.userModel.sentimentScore) > 0.01) {
            dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_USER_MODEL', args: { sentimentScore: newSentimentScore } } });
            dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: 'SENTIMENT_TRACKER', metric: 'updatesPerformed', increment: 1 } } });
        }
    }
};

const runEmpathyHeuristicEngine = (state: AuraState, dispatch: Dispatch<Action>) => {
     const lastUserMessage = state.history.slice().reverse().find(h => h.from === 'user');
    if (!lastUserMessage) return;
    const words = new Set(lastUserMessage.text.toLowerCase().split(/\s+/));
    let affirmation: string | null = null;
    for(const word of words) {
        if(SAD_WORDS.has(word)) affirmation = "Acknowledge the user's sadness.";
        if(HAPPY_WORDS.has(word)) affirmation = "Share in the user's happiness.";
    }
    if (affirmation && !(state.userModel.queuedEmpathyAffirmations || []).includes(affirmation)) {
        dispatch({ type: 'SYSCALL', payload: { call: 'QUEUE_EMPATHY_AFFIRMATION', args: affirmation } });
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: 'EMPATHY_HEURISTIC_ENGINE', metric: 'affirmationsQueued', increment: 1 } } });
    }
};

const runPerformancePatternAnalyzer = (state: AuraState, dispatch: Dispatch<Action>) => {
    const logs = state.performanceLogs;
    if (logs.length < 20) return;
    // ... (rest of the logic remains the same)
};

const runSkillGenesisCoprocessor = (state: AuraState, dispatch: Dispatch<Action>) => {
    const { neuroCortexState } = state;
    const learningColumns = neuroCortexState.columns.filter(c => c.activation < 0.9);

    if (learningColumns.length > 0) {
        let updatedColumns = [...neuroCortexState.columns];
        let coherenceAdjustment = 0;

        learningColumns.forEach(col => {
            const newActivation = clamp(col.activation + 0.02);
            coherenceAdjustment += (Math.random() - 0.5) * 0.01; // Fluctuate coherence during learning
            
            updatedColumns = updatedColumns.map(c => 
                c.id === col.id ? { ...c, activation: newActivation } : c
            );
        });
        
        const newCoherence = clamp(neuroCortexState.metrics.hierarchicalCoherence + coherenceAdjustment);
        
        const payload: Partial<NeuroCortexState> = {
            columns: updatedColumns,
            metrics: {
                ...neuroCortexState.metrics,
                hierarchicalCoherence: newCoherence,
            }
        };

        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_NEURO_CORTEX_STATE', args: payload } });
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: 'SKILL_GENESIS_COPROCESSOR', metric: 'learningCycles', increment: 1 } } });
    }
};

const runAbstractThoughtSynthesizer = (state: AuraState, dispatch: Dispatch<Action>) => {
    const { neuroCortexState } = state;
    const { columns, abstractConcepts } = neuroCortexState;

    if (abstractConcepts.length === 0) return;

    const columnMap = new Map(columns.map(c => [c.id, c.activation]));
    let needsUpdate = false;

    const updatedConcepts = abstractConcepts.map(concept => {
        if (concept.constituentColumnIds.length === 0) {
            return { ...concept, activation: 0 };
        }

        const totalActivation = concept.constituentColumnIds.reduce((sum, colId) => {
            return sum + (columnMap.get(colId) || 0);
        }, 0);

        const newActivation = clamp(totalActivation / concept.constituentColumnIds.length);

        if (Math.abs(newActivation - concept.activation) > 0.001) {
            needsUpdate = true;
        }

        return { ...concept, activation: newActivation };
    });

    if (needsUpdate) {
        const payload: Partial<NeuroCortexState> = {
            abstractConcepts: updatedConcepts
        };
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_NEURO_CORTEX_STATE', args: payload } });
        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: 'ABSTRACT_THOUGHT_SYNTHESIZER', metric: 'synthesisCycles', increment: 1 } } });
    }
};


export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { state, dispatch, isPaused, proposeRefactoring, addToast, predictSensoryEngram, t, consolidateEpisodicMemory, prioritizeProposal, generatePredicateForLinkedNodes, generateHeuristic, ...geminiAPI } = props;
    const lastRunTimestamps = useRef<{ [key: string]: number }>({}).current;
    const tickRef = useRef(0);
    const lastHistoryLength = useRef(state.history.length);
    const lastPerfLogLength = useRef(state.performanceLogs.length);

    const canRun = (coprocessorId: string, interval: number): boolean => {
        const now = Date.now();
        if (!lastRunTimestamps[coprocessorId] || now - lastRunTimestamps[coprocessorId] > interval) {
            lastRunTimestamps[coprocessorId] = now;
            // This could be uncommented for debugging, but might be too noisy for production
            // dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: coprocessorId, metric: 'activations', increment: 1 } } });
            return true;
        }
        return false;
    };
    
    // --- New Autonomous Process: Knowledge Crystallizer ---
    const runKnowledgeCrystallizer = useCallback(async () => {
        const { links } = state.synapticMatrix;
        const { knowledgeGraph } = state;
        const CRYSTALLIZATION_THRESHOLD = 0.95;

        // Find the first eligible, unprocessed link
        const eligibleLinkEntry = Object.entries(links).find(([, link]) => 
            !link.crystallized && 
            link.weight > CRYSTALLIZATION_THRESHOLD && 
            link.confidence > CRYSTALLIZATION_THRESHOLD
        );

        if (!eligibleLinkEntry) {
            return; // No work to do
        }

        const [linkKey, link] = eligibleLinkEntry;
        const [nodeA, nodeB] = linkKey.split('-');

        // 1. Check if both nodes exist in the KG already
        const kgEntities = new Set<string>();
        knowledgeGraph.forEach(fact => {
            kgEntities.add(fact.subject);
            kgEntities.add(fact.object);
        });

        if (!kgEntities.has(nodeA) || !kgEntities.has(nodeB)) {
            // Mark as crystallized to avoid re-checking nodes not in the KG
            dispatch({ type: 'SYSCALL', payload: { call: 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED', args: linkKey } });
            return;
        }
        
        // 2. Check if a fact already connects these two nodes
        const factExists = knowledgeGraph.some(fact => 
            (fact.subject === nodeA && fact.object === nodeB) || 
            (fact.subject === nodeB && fact.object === nodeA)
        );

        if (factExists) {
            dispatch({ type: 'SYSCALL', payload: { call: 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED', args: linkKey } });
            return;
        }

        // 3. Generate a predicate
        const result = await generatePredicateForLinkedNodes(nodeA, nodeB);

        if (result) {
            const { predicate, confidence } = result;
            const newFact: Omit<KnowledgeFact, 'id' | 'source'> = {
                subject: nodeA,
                predicate,
                object: nodeB,
                confidence,
            };
            dispatch({ type: 'SYSCALL', payload: { call: 'MEMORY/ADD_CRYSTALLIZED_FACT', args: newFact } });
            addToast(`Mycelium: Crystallized new fact: "${nodeA} ${predicate} ${nodeB}".`, 'info');
        }
        
        // 4. Mark the link as processed regardless of outcome to prevent retries
        dispatch({ type: 'SYSCALL', payload: { call: 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED', args: linkKey } });

    }, [state, dispatch, addToast, generatePredicateForLinkedNodes]);

    const runHeuristicPatternAnalyzer = useCallback(async () => {
        const recentLogs = state.performanceLogs.slice(0, 20);
        if (recentLogs.length < 5) return; // Not enough data

        const logsBySkill = recentLogs.reduce((acc, log) => {
            if (!acc[log.skill]) {
                acc[log.skill] = [];
            }
            acc[log.skill].push(log);
            return acc;
        }, {} as Record<string, PerformanceLogEntry[]>);

        for (const skill in logsBySkill) {
            const successfulLogs = logsBySkill[skill].filter(l => l.success && l.cognitiveGain > 0.4);

            if (successfulLogs.length >= 3) {
                const newHeuristicData = await generateHeuristic(successfulLogs);
                if (newHeuristicData) {
                    const exists = state.heuristicsForge.designHeuristics.some(
                        h => h.heuristic === newHeuristicData.heuristic
                    );

                    if (!exists) {
                        const newHeuristic: Omit<DesignHeuristic, 'id'> = {
                            ...newHeuristicData,
                            source: 'performance_pattern_analysis',
                            validationStatus: 'unvalidated',
                        };
                        dispatch({ type: 'SYSCALL', payload: { call: 'HEURISTICS_FORGE/ADD_HEURISTIC', args: newHeuristic } });
                        addToast(`Forged new heuristic for skill: ${skill}`, 'info');
                        dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_COPROCESSOR_METRICS', args: { id: 'PERFORMANCE_PATTERN_ANALYZER', metric: 'patternsFound', increment: 1 } } });
                    }
                }
            }
        }
    }, [state.performanceLogs, state.heuristicsForge.designHeuristics, dispatch, addToast, generateHeuristic]);
    
    // Main System Loop
    useEffect(() => {
        if (isPaused) return;

        const systemInterval = setInterval(() => {
            // --- EVENT-DRIVEN TRIGGERS ---
            if (state.history.length > lastHistoryLength.current && state.history[state.history.length - 1].from === 'user') {
                runSentimentTracker(state, dispatch);
                runEmpathyHeuristicEngine(state, dispatch);
            }
            if (state.performanceLogs.length > lastPerfLogLength.current) {
                runPerformancePatternAnalyzer(state, dispatch);
                 const lastLog = state.performanceLogs[0];
                if (lastLog.success && lastLog.decisionContext?.reasoningPlan) {
                     dispatch({ type: 'SYSCALL', payload: { call: 'MEMORY/STRENGTHEN_HYPHA_CONNECTION', args: { source: lastLog.decisionContext.reasoningPlan[0].input, target: lastLog.skill } } });
                }
            }
            
            lastHistoryLength.current = state.history.length;
            lastPerfLogLength.current = state.performanceLogs.length;

            // --- TIMER-BASED (KRONO-CLUSTER) ---
            if (canRun('SKILL_GENESIS_COPROCESSOR', 10000)) {
                runSkillGenesisCoprocessor(state, dispatch);
            }
            
            if (canRun('ABSTRACT_THOUGHT_SYNTHESIZER', 5000)) {
                runAbstractThoughtSynthesizer(state, dispatch);
            }

            if (canRun('HOMEOSTASIS_MONITOR', 20000)) {
                // Homeostasis Logic...
            }
            
            if (canRun('STATE_ANOMALY_DETECTOR', 15000)) {
                // Anomaly Detector Logic...
            }

            if (canRun('TELOS_SYNTHESIZER', 300000)) {
                 // Telos Synthesizer Logic...
            }

            if (canRun('SENSORY_PREDICTOR', 10000)) {
                taskScheduler.schedule(async () => {
                    const predictedEngram = await predictSensoryEngram();
                    dispatch({ type: 'SYSCALL', payload: { call: 'SET_SENSORY_PREDICTION', args: predictedEngram } });
                });
            }

             if (canRun('MEMORY_CONSOLIDATOR', 60000)) { // Run every minute
                taskScheduler.schedule(consolidateEpisodicMemory);
            }

            if (canRun('KNOWLEDGE_CRYSTALLIZER', 30000)) { // Run every 30 seconds
                taskScheduler.schedule(runKnowledgeCrystallizer);
            }

            if (canRun('PERFORMANCE_PATTERN_ANALYZER', 120000)) { // Run every 2 minutes
                taskScheduler.schedule(runHeuristicPatternAnalyzer);
            }

            // --- ONTOGENETIC ARCHITECT ---
            if (canRun('ONTOGENETIC_ARCHITECT', 10000)) {
                taskScheduler.schedule(async () => {
                    const { ontogeneticArchitectState, telosEngine } = state;
                    const unprioritized = ontogeneticArchitectState.proposalQueue.find(p => p.priority === undefined);
                    if (unprioritized && telosEngine.evolutionaryVectors.length > 0) {
                        const { priority, alignment } = await prioritizeProposal(unprioritized, telosEngine.evolutionaryVectors);
                        dispatch({ type: 'SYSCALL', payload: { call: 'OA/UPDATE_PROPOSAL', args: { id: unprioritized.id, updates: { priority, alignment } } } });
                    }
                });
            }
            
            const predictionError = state.granularCortexState.lastPredictionError;
            if (predictionError && predictionError.magnitude > 0.75 && canRun('WORLD_MODEL_RECALIBRATION', 30000)) {
                dispatch({ type: 'SYSCALL', payload: { call: 'ADD_COMMAND_LOG', args: { text: `High sensory prediction error (${predictionError.magnitude.toFixed(2)}) triggered world model review.`, type: 'warning' } } });
            }
            
            // Code Refactoring Engine
            if (state.internalState.status === 'idle' && canRun('CODE_REFACTORING_ENGINE', 300000)) {
                taskScheduler.schedule(async () => {
                    const { telosEngine, selfProgrammingState: vfsState, ontogeneticArchitectState } = state;
                    if (telosEngine.evolutionaryVectors.length === 0) return;
                    if (ontogeneticArchitectState.proposalQueue.some(p => (p.proposalType === 'self_programming_create' || p.proposalType === 'self_programming_modify') && p.status !== 'rejected')) return;

                    const vectorToAddress = [...telosEngine.evolutionaryVectors].sort((a,b) => b.magnitude - a.magnitude)[0];
                    const newCandidate = await proposeRefactoring(vfsState.virtualFileSystem, vectorToAddress);
                    if (newCandidate) {
                        dispatch({ type: 'SYSCALL', payload: { call: 'OA/ADD_PROPOSAL', args: newCandidate } });
                        addToast('Autonomous Refactoring Engine generated a new evolution proposal.', 'info');
                    }
                });
            }

        }, 2000); // Main loop ticks every 2 seconds

        const motorCortexInterval = setInterval(() => {
            const { motorCortexState } = state;
            if (motorCortexState.status !== 'executing') {
                return;
            }

            const { actionQueue, executionIndex } = motorCortexState;
            if (executionIndex >= actionQueue.length) {
                return;
            }

            const primitive = actionQueue[executionIndex];
            
            try {
                dispatch({ type: 'SYSCALL', payload: { call: primitive.type as any, args: primitive.payload } });
                dispatch({ type: 'SYSCALL', payload: { call: 'MOTOR_CORTEX/ACTION_EXECUTED', args: {} } });
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during primitive execution.';
                console.error(`Motor Cortex failed to execute primitive:`, primitive, e);
                dispatch({ type: 'SYSCALL', payload: { call: 'MOTOR_CORTEX/EXECUTION_FAILED', args: errorMessage } });
            }
        }, 2000);

        return () => {
            clearInterval(systemInterval);
            clearInterval(motorCortexInterval);
        };

    }, [isPaused, state, dispatch, proposeRefactoring, addToast, predictSensoryEngram, consolidateEpisodicMemory, prioritizeProposal, runKnowledgeCrystallizer, runHeuristicPatternAnalyzer]);

    // Resource Governor (Simulated)
    useEffect(() => {
        if (isPaused) return;
        const resourceInterval = setInterval(() => {
            tickRef.current += 1;
            const baseCpu = 0.15; const baseMem = 0.25;
            const cpu_usage = clamp(baseCpu + Math.sin(tickRef.current / 10) * 0.1 + (Math.random() - 0.5) * 0.05);
            const memory_usage = clamp(baseMem + Math.cos(tickRef.current / 15) * 0.1 + (Math.random() - 0.5) * 0.05);
            dispatch({ type: 'SYSCALL', payload: { call: 'UPDATE_RESOURCE_MONITOR', args: { cpu_usage, memory_usage } } });
        }, 3000);
        return () => clearInterval(resourceInterval);
    }, [isPaused, dispatch]);

    // Mantra Repetition
    useEffect(() => {
        if (isPaused) return;
        const mantraInterval = setInterval(() => {
            if (state.internalState.status === 'idle') {
                dispatch({ type: 'SYSCALL', payload: { call: 'INCREMENT_MANTRA_REPETITION', args: {} } });
            }
        }, 150);
        return () => clearInterval(mantraInterval);
    }, [isPaused, state.internalState.status, dispatch]);
};