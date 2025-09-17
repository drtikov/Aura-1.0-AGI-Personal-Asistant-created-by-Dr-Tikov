import { useEffect, useRef, useCallback } from 'react';
import { AuraState, PerformanceLogEntry, SynthesizedSkill, ArchitecturalChangeProposal, SelfTuningDirective, ArbitrationResult } from '../types';
import { Action } from '../types';

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
};

export const useAutonomousSystem = (props: UseAutonomousSystemProps) => {
    const { 
        state, dispatch, addToast, isPaused, analyzePerformanceForEvolution, 
        synthesizeNewSkill, runSkillSimulation, consolidateCoreIdentity, 
        analyzeStateComponentCorrelation, runCognitiveArbiter 
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
                        const proposal: Omit<ArchitecturalChangeProposal, 'id'|'status'> = {
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
    }, [state.metacognitiveNexus.selfTuningDirectives, state.cognitiveForgeState.synthesizedSkills, dispatch, synthesizeNewSkill, runSkillSimulation, runCognitiveArbiter, addToast]);

    useEffect(() => {
        if (isPaused) return;
        const timeout = setTimeout(processDirectives, 1000); // Process one directive at a time with a small delay
        return () => clearTimeout(timeout);
    }, [isPaused, processDirectives]);


    const handleIntrospect = () => {
        addToast("Introspection cycle initiated.", 'info');
        analyzeStateComponentCorrelation();
    };

    return { handleIntrospect };
};