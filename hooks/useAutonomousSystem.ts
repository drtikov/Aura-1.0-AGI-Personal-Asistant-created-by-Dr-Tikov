// hooks/useAutonomousSystem.ts
import React, { useEffect, useRef } from 'react';
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, AnalogicalHypothesisProposal } from '../types';

export interface UseAutonomousSystemProps {
    geminiAPI: UseGeminiAPIResult;
    state: AuraState;
    dispatch: React.Dispatch<Action>;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    t: (key: string, options?: any) => string;
    isPaused: boolean;
    syscall: (call: SyscallCall, args: any) => void;
}

export const useAutonomousSystem = ({
    geminiAPI,
    state,
    dispatch,
    addToast,
    t,
    isPaused,
    syscall,
}: UseAutonomousSystemProps) => {
    const tickInterval = useRef<number | null>(null);

    useEffect(() => {
        const executeTick = () => {
            if (isPaused) return;

            // This is a simplified "kernel" loop that runs background tasks.
            syscall('KERNEL/TICK', {});

            const { tick } = state.kernelState;
            
            // Example periodic task: update manifold position every 5 ticks
            if (tick % 5 === 0) {
                 syscall('SPANDA/UPDATE_MANIFOLD_POSITION', {});
            }

            // Example task: decay memory every 100 ticks
            if (tick % 100 === 0) {
                const memoryIdsToDecay = {
                    kg: state.knowledgeGraph.slice(0, 5).map(f => f.id), // Decay a few old facts
                    episodes: state.episodicMemoryState.episodes.slice(0,2).map(e => e.id)
                };
                syscall('MEMORY/DECAY', { memoryIdsToDecay });
                addToast(t('toast_memoryDecay'), 'info');
            }

            // Example task: run a synaptic probe every 30 ticks
            if (tick % 30 === 0) {
                syscall('MEMORY/SYNAPTIC_PROBE', {});
            }

            // New task for Persona Metamorphosis every 150 ticks (~12.5 minutes)
            if (tick > 0 && tick % 150 === 0) {
                (async () => {
                    try {
                        const proposal = await geminiAPI.proposePersonaModification();
                        if (proposal) {
                            syscall('OA/ADD_PROPOSAL', proposal);
                            
                            // --- AUTO-IMPLEMENTATION ---
                            syscall('ADD_HISTORY_ENTRY', { 
                                from: 'system', 
                                text: `AUTONOMOUS EVOLUTION: A new persona modification has been generated. Automatically implementing and rebooting system.` 
                            });
                            addToast("Aura is automatically evolving its personality...", "success");

                            // Use a short timeout to allow the UI to update with the message before the reboot happens.
                            setTimeout(() => {
                                syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: proposal.id });
                                syscall('SYSTEM/REBOOT', {});
                            }, 1000); // 1 second delay
                        }
                    } catch (e) {
                        console.error("Persona Metamorphosis cycle failed:", e);
                        syscall('ADD_HISTORY_ENTRY', { from: 'system', text: `[Error during persona metamorphosis cycle: ${(e as Error).message}]` });
                    }
                })();
            }

        };

        if (tickInterval.current) {
            clearInterval(tickInterval.current);
        }

        tickInterval.current = window.setInterval(executeTick, 5000); // Run every 5 seconds

        return () => {
            if (tickInterval.current) {
                clearInterval(tickInterval.current);
            }
        };
    }, [isPaused, state, syscall, addToast, t, geminiAPI]);

    // ATP Coprocessor - Replaces the previous mock simulation with an LLM-driven one
    useEffect(() => {
        if (isPaused || state.atpCoprocessorState.status !== 'proving') {
            return;
        }

        const runProof = async () => {
            const goal = state.atpCoprocessorState.currentGoal;
            if (!goal) {
                syscall('ATP/FAIL', { reason: 'No goal provided.' });
                return;
            }

            try {
                const stream = await geminiAPI.generateProofStepsStream(goal);
                const fullProof = [];
                let lastStrategy = 'Deduction';
                let buffer = '';

                for await (const chunk of stream) {
                    buffer += chunk.text;
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || ''; // Keep the last partial line

                    for (const line of lines) {
                        if (line.trim() === '') continue;
                        try {
                            const step = JSON.parse(line);
                            if (step.step && step.action && step.result) {
                                syscall('ATP/LOG_STEP', step);
                                fullProof.push(step);
                                if (step.strategy) lastStrategy = step.strategy;
                            }
                        } catch (e) {
                            console.warn('ATP stream parsing error, skipping line:', line);
                        }
                    }
                }

                if (buffer.trim()) {
                    try {
                        const step = JSON.parse(buffer);
                        if (step.step && step.action && step.result) {
                            syscall('ATP/LOG_STEP', step);
                            fullProof.push(step);
                            if (step.strategy) lastStrategy = step.strategy;
                        }
                    } catch(e) {
                        console.warn('ATP stream parsing error on final buffer:', buffer);
                    }
                }

                if (fullProof.length > 0) {
                    syscall('ATP/SUCCEED', { proof: fullProof, strategy: lastStrategy });
                } else {
                    throw new Error('LLM did not produce any valid proof steps.');
                }

            } catch (error) {
                syscall('ATP/FAIL', { reason: (error as Error).message, strategy: 'N/A' });
            }
        };

        runProof();

    }, [state.atpCoprocessorState.status, state.atpCoprocessorState.currentGoal, isPaused, syscall, geminiAPI]);

    // Prometheus Engine Cycle
    useEffect(() => {
        if (isPaused || state.prometheusState.status !== 'running') {
            return;
        }

        const runPrometheusCycle = async () => {
            try {
                syscall('PROMETHEUS/LOG', { message: 'Analyzing knowledge graph for deep analogies...' });
                const proposalData = await geminiAPI.findAnalogiesInKnowledgeGraph();
                
                if (proposalData) {
                    const newProposal: AnalogicalHypothesisProposal = {
                        ...proposalData,
                        id: `prometheus_${self.crypto.randomUUID()}`,
                        timestamp: Date.now(),
                        status: 'proposed',
                        proposalType: 'analogical_hypothesis',
                    };
                    syscall('OA/ADD_PROPOSAL', newProposal);
                    syscall('PROMETHEUS/LOG', { message: `New conjecture formulated: ${newProposal.conjecture.substring(0, 50)}...` });
                } else {
                    throw new Error('LLM did not produce a valid proposal.');
                }
            } catch (error) {
                console.error("Prometheus cycle failed:", error);
                syscall('PROMETHEUS/LOG', { message: `Cycle failed: ${(error as Error).message}` });
            } finally {
                syscall('PROMETHEUS/CYCLE_COMPLETE', {});
            }
        };

        // Delay the execution slightly to allow the UI to update
        const timeoutId = setTimeout(runPrometheusCycle, 100);
        
        return () => clearTimeout(timeoutId);

    }, [isPaused, state.prometheusState.status, geminiAPI, syscall]);
};