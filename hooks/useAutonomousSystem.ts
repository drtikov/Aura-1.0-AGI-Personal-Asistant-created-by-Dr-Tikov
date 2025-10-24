// hooks/useAutonomousSystem.ts
import React, { useEffect, useRef } from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
import { AuraState, Action, SyscallCall, UseGeminiAPIResult, AnalogicalHypothesisProposal, SelfProgrammingCandidate, AGISDecision, DesignHeuristic, GunaState, PerformanceLogEntry, SynthesizedSkill, CognitiveTaskType, UnifiedProposal, ArchitecturalChangeProposal } from '../types';
import { deriveInternalState } from '../core/stateDerivation.ts';

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

    // Effect for the main kernel tick and periodic autonomous agents
    useEffect(() => {

        const conceptualEntanglementPulse = async () => {
            if (isPaused) return;
            const now = Date.now();
            const lastCheck = state.prometheusState.lastEntanglementCheck || 0;
            const COOLDOWN = 60000; // 1 minute cooldown
    
            if (now - lastCheck < COOLDOWN) return;
    
            const activeFrequencies = Object.entries(state.resonanceFieldState.activeFrequencies)
                .filter(([, data]) => data.intensity > 0.8 && now - data.lastPing < 5000) // high intensity, recent ping
                .map(([freq]) => freq);
    
            if (activeFrequencies.length < 2) return;
            
            const categories: { [key: string]: string } = {
                'MEMORY': 'KNOWLEDGE', 'KNOWLEDGE': 'KNOWLEDGE', 'CHRONICLE': 'KNOWLEDGE',
                'GOAL': 'ACTION', 'MOTOR_CORTEX': 'ACTION', 'SESSION': 'ACTION',
                'SYSTEM': 'META', 'KERNEL': 'META', 'PLUGIN': 'META',
                'PSYCHE': 'COGNITION', 'RIE': 'COGNITION', 'PROMETHEUS': 'COGNITION',
            };
            const getCategory = (freq: string) => categories[freq] || 'OTHER';
    
            // Find a disparate pair
            for (let i = 0; i < activeFrequencies.length; i++) {
                for (let j = i + 1; j < activeFrequencies.length; j++) {
                    const freqA = activeFrequencies[i];
                    const freqB = activeFrequencies[j];
                    if(!freqA || !freqB) continue;

                    const catA = getCategory(freqA);
                    const catB = getCategory(freqB);
                    
                    if (catA !== catB) {
                        // Found a pair! Trigger Prometheus.
                        syscall('PROMETHEUS/SET_STATE', { lastEntanglementCheck: now });
                        syscall('ADD_COMMAND_LOG', { type: 'info', text: t('entanglement_detected', { freqA, freqB }) });
                        syscall('PROMETHEUS/LOG', { message: `Entanglement found: ${freqA} ↔ ${freqB}. Initiating directed analogy.` });
                        
                        try {
                            const result = await geminiAPI.findDirectedAnalogy(freqA, freqB);
                            if (result) {
                                const proposal: Omit<AnalogicalHypothesisProposal, 'id' | 'timestamp' | 'status'> = {
                                    ...result,
                                    proposalType: 'analogical_hypothesis',
                                    source: 'autonomous',
                                };
                                syscall('OA/ADD_PROPOSAL', { ...proposal, id: `prop_entangle_${self.crypto.randomUUID()}`, timestamp: Date.now(), status: 'proposed' });
                                syscall('ADD_COMMAND_LOG', { type: 'success', text: t('entanglement_proposal', { conjecture: `${result.conjecture.substring(0, 50)}...` }) });
                            }
                        } catch (e) {
                            console.error("Conceptual Entanglement failed:", e);
                        }
                        return; // Only process one entanglement per cycle
                    }
                }
            }
        };

        const autonomousEvolutionPulse = async () => {
            if (isPaused) return;
        
            // Find the first "proposed" proposal in the queue
            const proposalToProcess = state.ontogeneticArchitectState.proposalQueue.find(
                (p: UnifiedProposal) => p.status === 'proposed'
            );
        
            if (!proposalToProcess) {
                return; // No pending proposals
            }
        
            // Mark the proposal as being reviewed to prevent re-processing
            syscall('OA/UPDATE_PROPOSAL', { id: proposalToProcess.id, updates: { status: 'reviewing' } });
            syscall('ADD_COMMAND_LOG', { type: 'info', text: t('autoevolution_reviewing', { proposalId: proposalToProcess.id.slice(0, 8) }) });
        
            // Automatically approve and implement the proposal.
            syscall('ADD_COMMAND_LOG', { type: 'success', text: t('autoevolution_approving', { proposalId: proposalToProcess.id.slice(0, 8) }) });
            
            const reasoning = (proposalToProcess as any).reasoning || (proposalToProcess as any).conjecture || `Implementing new ${proposalToProcess.proposalType} proposal.`;

            // Add system message to main chat for observable evolution
            if (['self_programming_create', 'self_programming_modify', 'architecture'].includes(proposalToProcess.proposalType)) {
                const systemMessage = `**Autonomous Evolution Triggered**\n\n**Reasoning:** *${reasoning.substring(0, 200)}...*\n\nImplementing change and initiating seamless reboot to integrate new capabilities.`;
                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: systemMessage });
            } else if (proposalToProcess.proposalType === 'psyche') {
                const systemMessage = `**Autonomous Psyche Adaptation**\n\n**Reasoning:** *${reasoning.substring(0, 200)}...*\n\nApplying adaptation to cognitive primitives.`;
                syscall('ADD_HISTORY_ENTRY', { from: 'system', text: systemMessage });
            }
        
            // Trigger the correct implementation syscall based on the proposal type
            switch (proposalToProcess.proposalType) {
                case 'self_programming_create':
                case 'self_programming_modify':
                    syscall('IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', { id: proposalToProcess.id });
                    break;
                case 'architecture':
                    syscall('APPLY_ARCH_PROPOSAL', {
                        proposal: proposalToProcess,
                        snapshotId: `snap_auto_${self.crypto.randomUUID()}`,
                        modLogId: `mod_auto_${self.crypto.randomUUID()}`,
                        isAutonomous: true,
                    });
                    break;
                case 'psyche':
                    // These don't require a reboot, so they can be applied directly.
                    syscall('IMPLEMENT_PSYCHE_PROPOSAL', { proposal: proposalToProcess });
                    // Update status to implemented
                    syscall('OA/UPDATE_PROPOSAL', { id: proposalToProcess.id, updates: { status: 'implemented' } });
                    break;
                case 'analogical_hypothesis':
                    // Acknowledged. A more advanced system would convert this into an actionable proposal.
                    syscall('OA/UPDATE_PROPOSAL', { id: proposalToProcess.id, updates: { status: 'implemented' } });
                    syscall('ADD_COMMAND_LOG', { type: 'info', text: `Acknowledged analogical hypothesis: ${ (proposalToProcess as any).conjecture.substring(0,40) }...` });
                    break;
                default:
                    syscall('ADD_COMMAND_LOG', { type: 'warning', text: `Auto-evolution: Unknown proposal type '${proposalToProcess.proposalType}'. Cannot implement.` });
                    syscall('OA/UPDATE_PROPOSAL', { id: proposalToProcess.id, updates: { status: 'rejected', failureReason: 'Unknown proposal type for autonomous implementation.' } });
                    break;
            }
        };

        const executeTick = () => {
            if (isPaused) return;

            // This is a simplified "kernel" loop that runs background tasks.
            syscall('KERNEL/TICK', {});

            // --- NEW STATE DERIVATION LOGIC ---
            // This replaces the old decay logic with a dynamic, real-time calculation
            // of abstract meta-states based on operational metrics.
            const derivedStateChanges = deriveInternalState(state);
            syscall('UPDATE_INTERNAL_STATE', derivedStateChanges);
            // --- END NEW LOGIC ---
            
            // Update the Spanda Engine manifold position on every tick.
            syscall('SPANDA/UPDATE_MANIFOLD_POSITION', {});

            // Update the Somatic Crucible energy state on every tick.
            syscall('SOMATIC/UPDATE_ENERGY_STATE', {});
            
            // Run periodic autonomous tasks based on their frequencies
            const tick = state.kernelState.tick + 1; // Use next tick value
            if (tick % (state.kernelState.taskFrequencies[CognitiveTaskType.CONCEPTUAL_ENTANGLEMENT_PULSE] || 30) === 0) {
                conceptualEntanglementPulse();
            }
            if (tick % (state.kernelState.taskFrequencies[CognitiveTaskType.AUTONOMOUS_EVOLUTION_PULSE] || 15) === 0) {
                autonomousEvolutionPulse();
            }
        };

        // Clear any existing interval
        if (tickInterval.current) {
            clearInterval(tickInterval.current);
        }
        
        // Set a new interval
        tickInterval.current = window.setInterval(executeTick, 1000);

        // Cleanup on unmount
        return () => {
            if (tickInterval.current) {
                clearInterval(tickInterval.current);
            }
        };
    }, [isPaused, syscall, state, geminiAPI, t]); // Re-run if these state slices change
};