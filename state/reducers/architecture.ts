// state/reducers/architecture.ts
import { AuraState, Action, ModificationLogEntry, ArchitecturalChangeProposal, CodeEvolutionProposal, CausalInferenceProposal, CreateFileCandidate, ModifyFileCandidate, SelfProgrammingCandidate, ArchitecturalImprovementProposal, UnifiedProposal, DesignHeuristic, SynapticNode, CorticalColumn, SynapticLink, POLCommandSynthesisProposal } from '../../types';
import { clamp } from '../../utils';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'HEURISTICS_FORGE/ADD_AXIOM': {
            const newAxiom = {
                ...args,
                id: `axiom_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
            };
            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    axioms: [newAxiom, ...state.heuristicsForge.axioms],
                }
            };
        }
        
        case 'COGNITIVE_ARCHITECT/FORM_CLUSTER': {
            const { requiredPlugins, nonEssentialPlugins } = args;
            const newRegistry = state.pluginState.registry.map(plugin => {
                if (plugin.type === 'COPROCESSOR' || plugin.type === 'TOOL') {
                    if (requiredPlugins.has(plugin.id)) {
                        return { ...plugin, status: 'enabled' as const };
                    }
                    if (nonEssentialPlugins.includes(plugin.id)) {
                        return { ...plugin, status: 'disabled' as const };
                    }
                }
                return plugin; // Keep default status for others
            });

            return {
                pluginState: { registry: newRegistry },
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    isDynamicClusterActive: true,
                    status: 'translating_cgl',
                }
            };
        }
        
        case 'COGNITIVE_ARCHITECT/SKIP_CLUSTER': {
            return {
                cognitiveOSState: {
                    ...state.cognitiveOSState,
                    isDynamicClusterActive: false,
                    status: 'translating_cgl',
                }
            };
        }

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
                policyWeight: 1.0,
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
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === proposal.id && p.proposalType === 'architecture') {
                            const updated: ArchitecturalChangeProposal = { ...p, status: 'approved' };
                            return updated;
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
                            const updated: ArchitecturalImprovementProposal = { ...p, status: args.status };
                            return updated;
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
            if (!link || link.crystallized) return {};

            const updatedLink = { ...link, crystallized: true };
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: {
                        ...state.synapticMatrix.links,
                        [linkKey]: updatedLink,
                    }
                }
            };
        }

        case 'SYNAPTIC_MATRIX/REINFORCE_LINK': {
            const { skillAId, skillBId } = args;
            if (!skillAId || !skillBId || skillAId === skillBId) return {};

            const linkKey = [skillAId, skillBId].sort().join('-');
            const existingLink = state.synapticMatrix.links[linkKey];
            
            const LEARNING_RATE = 0.05;

            const updatedLink: SynapticLink = existingLink 
                ? {
                    ...existingLink,
                    weight: clamp(existingLink.weight + LEARNING_RATE),
                    confidence: clamp(existingLink.confidence + LEARNING_RATE / 2),
                    observations: existingLink.observations + 1,
                }
                : {
                    weight: LEARNING_RATE,
                    causality: 0, // Direction is unknown from simple co-activation
                    confidence: LEARNING_RATE / 2,
                    observations: 1,
                };

            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: {
                        ...state.synapticMatrix.links,
                        [linkKey]: updatedLink,
                    },
                    synapseCount: existingLink ? state.synapticMatrix.synapseCount : state.synapticMatrix.synapseCount + 1,
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
                    // FIX: Added a type guard to prevent unsafe spreading of a discriminated union.
                    // This ensures TypeScript can correctly infer the type of the returned object.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === args.id && (p.proposalType === 'self_programming_create' || p.proposalType === 'self_programming_modify')) {
                            return { ...p, status: 'rejected' };
                        }
                        return p;
                    })
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
                            const updated: CausalInferenceProposal = { ...p, status: args.status };
                            return updated;
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
                    // FIX: Replaced a confusing switch statement with a clearer type-guarded conditional to resolve a TypeScript error.
                    // This ensures that only proposals of the correct type are modified, satisfying the compiler's checks for discriminated unions.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === proposal.id && p.proposalType === 'causal_inference') {
                            // FIX: Explicitly creating a typed variable before returning it helps the compiler correctly infer the type of the array.
                            const updated: CausalInferenceProposal = { ...p, status: 'implemented' };
                            return updated;
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

        case 'APPLY_REINFORCEMENT_LEARNING': {
            const { targetId, targetType, reward } = args; // reward is -1 to 1
            const LEARNING_RATE = 0.1;

            if (targetType === 'synthesizedSkill') {
                return {
                    cognitiveForgeState: {
                        ...state.cognitiveForgeState,
                        synthesizedSkills: state.cognitiveForgeState.synthesizedSkills.map(skill => {
                            if (skill.id === targetId) {
                                const newWeight = clamp(skill.policyWeight + (reward * LEARNING_RATE), 0.1, 3.0);
                                return { ...skill, policyWeight: newWeight };
                            }
                            return skill;
                        })
                    }
                };
            }

            if (targetType === 'designHeuristic') {
                return {
                    heuristicsForge: {
                        ...state.heuristicsForge,
                        designHeuristics: state.heuristicsForge.designHeuristics.map(h => {
                             if (h.id === targetId) {
                                const newWeight = clamp(h.policyWeight + (reward * LEARNING_RATE), 0.1, 3.0);
                                return { ...h, policyWeight: newWeight };
                            }
                            return h;
                        })
                    }
                };
            }

            return {};
        }
        
        case 'CREATE_CORTICAL_COLUMN': {
            const newColumn = args as CorticalColumn;
            const newNode: SynapticNode = {
                id: newColumn.id,
                type: 'skill',
                activation: 0.1,
            };
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    nodes: {
                        ...state.synapticMatrix.nodes,
                        [newNode.id]: newNode,
                    }
                }
            };
        }
        
        case 'IMPLEMENT_POL_SYNTHESIS_PROPOSAL': {
            const proposal = args as POLCommandSynthesisProposal;
            if (!proposal || proposal.status === 'implemented') return {};
            
            const newCommandName = proposal.newCommandName.toUpperCase().replace(/\s+/g, '_');

            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    synthesizedPOLCommands: {
                        ...state.cognitiveArchitecture.synthesizedPOLCommands,
                        [newCommandName]: {
                            sequence: proposal.replacesSequence,
                        }
                    }
                },
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to prevent unsafe spreading of a discriminated union.
                    // This ensures TypeScript can correctly infer the type of the returned object.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === proposal.id && p.proposalType === 'pol_command_synthesis') {
                            return { ...p, status: 'implemented' };
                        }
                        return p;
                    })
                }
            };
        }

        default:
            return {};
    }
};