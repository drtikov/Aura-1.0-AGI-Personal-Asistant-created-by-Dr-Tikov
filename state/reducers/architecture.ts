// state/reducers/architecture.ts
import { AuraState, Action, ModificationLogEntry, ArchitecturalChangeProposal, CodeEvolutionProposal, CausalInferenceProposal, CreateFileCandidate, ModifyFileCandidate, SelfProgrammingCandidate, ArchitecturalImprovementProposal, UnifiedProposal, DesignHeuristic } from '../../types';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HEURISTICS_FORGE/ADD_HEURISTIC': {
            const newHeuristic = args as Omit<DesignHeuristic, 'id'>;

            // Simple check to avoid exact duplicates
            const exists = state.heuristicsForge.designHeuristics.some(
                h => h.heuristic === newHeuristic.heuristic
            );
            if (exists) {
                return {};
            }

            const heuristicWithId: DesignHeuristic = {
                ...newHeuristic,
                id: `heuristic_${self.crypto.randomUUID()}`,
            };

            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    designHeuristics: [heuristicWithId, ...state.heuristicsForge.designHeuristics],
                }
            };
        }
        
        case 'LOG_COGNITIVE_TRIAGE_DECISION': {
            return {
                cognitiveTriageState: {
                    ...state.cognitiveTriageState,
                    log: [args, ...state.cognitiveTriageState.log].slice(0, 20)
                }
            };
        }

        case 'OA/ADD_PROPOSAL': {
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: [...state.ontogeneticArchitectState.proposalQueue, args]
                }
            };
        }

        case 'OA/UPDATE_PROPOSAL': {
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => p.id === args.id ? { ...p, ...args.updates } : p)
                }
            };
        }

        case 'OA/REMOVE_PROPOSAL': {
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.filter(p => p.id !== args.id)
                }
            };
        }
        
        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId, isAutonomous } = args;
            const newLog: ModificationLogEntry = {
                id: modLogId,
                timestamp: Date.now(),
                description: `Applied proposal: ${proposal.action} on ${proposal.target}`,
                gainType: 'INNOVATION', 
                validationStatus: 'validated',
                isAutonomous,
            };
            return {
                ...state,
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === proposal.id && p.proposalType === 'architecture') {
                            return { ...p, status: 'approved' };
                        }
                        return p;
                    }),
                },
                modificationLog: [newLog, ...state.modificationLog].slice(0, 50),
                systemSnapshots: [
                    ...state.systemSnapshots,
                    { id: snapshotId, timestamp: Date.now(), reason: `Pre-apply: ${proposal.action}`, state }
                ].slice(-10),
            };
        }
        
        case 'ADD_SYSTEM_SNAPSHOT': {
            return {
                systemSnapshots: [...state.systemSnapshots, args].slice(-10)
            };
        }

        case 'TOGGLE_COGNITIVE_FORGE_PAUSE': {
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    isTuningPaused: !state.cognitiveForgeState.isTuningPaused,
                }
            };
        }
        
        case 'ADD_SYNTHESIZED_SKILL': {
             return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: [...state.cognitiveForgeState.synthesizedSkills, args]
                }
            };
        }

        case 'UPDATE_SYNTHESIZED_SKILL': {
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: state.cognitiveForgeState.synthesizedSkills.map(s =>
                        s.id === args.id ? { ...s, ...args.updates } : s
                    )
                }
            };
        }

        case 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE':
            return { architecturalCrucibleState: args };

        case 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL': {
            const newProposal: ArchitecturalImprovementProposal = {
                ...args,
                proposalType: 'crucible',
            };
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: [...state.ontogeneticArchitectState.proposalQueue, newProposal]
                }
            };
        }

        case 'UPDATE_CRUCIBLE_IMPROVEMENT_PROPOSAL':
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === args.id && p.proposalType === 'crucible') {
                            return { ...p, status: args.status };
                        }
                        return p;
                    })
                }
            };
        
        case 'UPDATE_SYNAPTIC_MATRIX':
            return { synapticMatrix: args };

        case 'SYNAPTIC_MATRIX/MARK_LINK_CRYSTALLIZED': {
            const linkKey = args;
            const link = state.synapticMatrix.links[linkKey];
            if (!link) return {};

            const updatedLink = { ...link, crystallized: true };
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: {
                        ...state.synapticMatrix.links,
                        [linkKey]: updatedLink
                    }
                }
            };
        }

        case 'PRUNE_SYNAPTIC_MATRIX':
            // A more complex implementation would go here
            return { 
                synapticMatrix: {
                    ...state.synapticMatrix,
                    lastPruningEvent: Date.now()
                }
            };
        
        case 'REJECT_SELF_PROGRAMMING_CANDIDATE': {
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p =>
                        p.id === args.id ? { ...p, status: 'rejected' } : p
                    )
                }
            };
        }

        case 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE': {
            const { id } = args;
            const candidate = state.ontogeneticArchitectState.proposalQueue.find(p => p.id === id) as SelfProgrammingCandidate | undefined;
            if (!candidate) return {};

            let updatedVFS = { ...state.selfProgrammingState.virtualFileSystem };
            let description = '';

            if (candidate.type === 'CREATE') {
                updatedVFS[candidate.newFile.path] = candidate.newFile.content;
                candidate.integrations.forEach(mod => {
                    updatedVFS[mod.filePath] = mod.newContent;
                });
                description = `Autonomous code creation: ${candidate.newFile.path} integrated into ${candidate.integrations.length} file(s).`;

            } else if (candidate.type === 'MODIFY') {
                updatedVFS[candidate.targetFile] = candidate.codeSnippet;
                description = `Autonomous code modification: ${candidate.targetFile}.`;
            }
            
            const newLog: ModificationLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                description,
                gainType: 'INNOVATION', 
                validationStatus: 'validated',
                isAutonomous: true,
            };

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    virtualFileSystem: updatedVFS,
                },
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.filter(p => p.id !== id),
                },
                modificationLog: [newLog, ...state.modificationLog].slice(0, 50),
                systemSnapshots: [
                    ...state.systemSnapshots,
                    { id: self.crypto.randomUUID(), timestamp: Date.now(), reason: `Pre-apply self-programming candidate ${id}`, state }
                ].slice(-10),
            };
        }
        
        case 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS':
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === args.id && p.proposalType === 'causal_inference') {
                            return { ...p, status: args.status };
                        }
                        return p;
                    })
                }
            };

        case 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL': {
            const proposal = args as CausalInferenceProposal;
            const { sourceNode, targetNode } = proposal.linkUpdate;
            const linkKey = [sourceNode, targetNode].sort().join('-');
            const newLink = {
                 ...(state.synapticMatrix.links[linkKey] || { weight: 0, causality: 0, confidence: 0, observations: 0 }),
                 ...proposal.linkUpdate
            };

            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: {
                        ...state.synapticMatrix.links,
                        [linkKey]: newLink
                    }
                },
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === proposal.id && p.proposalType === 'causal_inference') {
                            return { ...p, status: 'implemented' };
                        }
                        return p;
                    }),
                }
            };
        }
        
        case 'INGEST_CODE_CHANGE': {
            const { filePath, code } = args;
            const newModLog: ModificationLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                description: `Manual code ingestion for: ${filePath}`,
                gainType: 'INNOVATION',
                validationStatus: 'validated', // Manual changes are assumed to be validated
                isAutonomous: false,
            };
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    virtualFileSystem: {
                        ...state.selfProgrammingState.virtualFileSystem,
                        [filePath]: code,
                    }
                },
                modificationLog: [newModLog, ...state.modificationLog].slice(0, 50),
                systemSnapshots: [
                    ...state.systemSnapshots,
                    { id: self.crypto.randomUUID(), timestamp: Date.now(), reason: `Pre-ingestion of ${filePath}`, state: state }
                ].slice(-10)
            };
        }
        
        case 'SET_COPROCESSOR_ARCHITECTURE':
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitecture: args,
                    lastAutoSwitchReason: undefined, // Clear reason on manual switch
                }
            };
        
        case 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON':
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitecture: args.architecture,
                    lastAutoSwitchReason: args.reason,
                }
            };
        
        case 'SET_COPROCESSOR_ARCHITECTURE_MODE':
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitectureMode: args,
                    lastAutoSwitchReason: args === 'manual' ? undefined : state.cognitiveArchitecture.lastAutoSwitchReason,
                }
            };

        case 'UPDATE_COPROCESSOR_METRICS': {
            const { id, metric, increment } = args;
            const coprocessor = state.cognitiveArchitecture.coprocessors[id];
            if (!coprocessor) return {};
            const newMetrics = {
                ...coprocessor.metrics,
                [metric]: (coprocessor.metrics[metric] || 0) + increment,
            };
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessors: {
                        ...state.cognitiveArchitecture.coprocessors,
                        [id]: {
                            ...coprocessor,
                            metrics: newMetrics,
                        }
                    }
                }
            };
        }

        case 'UPDATE_NEURAL_ACCELERATOR_STATE':
            return { neuralAcceleratorState: args };

        case 'EMBODIMENT/UPDATE_BODY_STATE': {
            return {
                embodiedCognitionState: {
                    ...state.embodiedCognitionState,
                    virtualBodyState: {
                        ...state.embodiedCognitionState.virtualBodyState,
                        ...args,
                    }
                }
            };
        }
        
        case 'EMBODIMENT/LOG_SIMULATION': {
            const newLog = { ...args, id: self.crypto.randomUUID(), timestamp: Date.now() };
            return {
                embodiedCognitionState: {
                    ...state.embodiedCognitionState,
                    simulationLog: [newLog, ...state.embodiedCognitionState.simulationLog].slice(0, 20),
                }
            };
        }

        default:
            return {};
    }
};