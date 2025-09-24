// state/reducers/architecture.ts
import { AuraState, Action, ModificationLogEntry, ArchitecturalChangeProposal, CodeEvolutionProposal, CausalInferenceProposal, CreateFileCandidate, ModifyFileCandidate, SelfProgrammingCandidate } from '../../types';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'ADD_ARCH_PROPOSAL': {
            const newProposal: ArchitecturalChangeProposal = {
                ...action.payload.proposal,
                id: self.crypto.randomUUID(),
                status: 'proposed',
            };
            return { architecturalProposals: [...state.architecturalProposals, newProposal] };
        }

        case 'UPDATE_ARCH_PROPOSAL_STATUS': {
            return {
                architecturalProposals: state.architecturalProposals.map(p =>
                    p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                ),
            };
        }
        
        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId, isAutonomous } = action.payload;
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
                architecturalProposals: state.architecturalProposals.map(p =>
                    p.id === proposal.id ? { ...p, status: 'approved' } : p
                ),
                modificationLog: [newLog, ...state.modificationLog].slice(0, 50),
                systemSnapshots: [
                    ...state.systemSnapshots,
                    { id: snapshotId, timestamp: Date.now(), reason: `Pre-apply: ${proposal.action}`, state }
                ].slice(-10),
            };
        }

        case 'ADD_CODE_EVOLUTION_PROPOSAL': {
            const newProposal: CodeEvolutionProposal = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed',
            };
            return { codeEvolutionProposals: [newProposal, ...state.codeEvolutionProposals] };
        }

        case 'UPDATE_CODE_EVOLUTION_PROPOSAL_STATUS': {
             return {
                codeEvolutionProposals: state.codeEvolutionProposals.map(p =>
                    p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                ),
            };
        }
        
        case 'ADD_SYSTEM_SNAPSHOT': {
            return {
                systemSnapshots: [...state.systemSnapshots, action.payload].slice(-10)
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
                    synthesizedSkills: [...state.cognitiveForgeState.synthesizedSkills, action.payload]
                }
            };
        }

        case 'UPDATE_SYNTHESIZED_SKILL': {
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: state.cognitiveForgeState.synthesizedSkills.map(s =>
                        s.id === action.payload.id ? { ...s, ...action.payload.updates } : s
                    )
                }
            };
        }

        case 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE':
            return { architecturalCrucibleState: action.payload };

        case 'ADD_CRUCIBLE_IMPROVEMENT_PROPOSAL':
            return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    improvementProposals: [action.payload, ...state.architecturalCrucibleState.improvementProposals]
                }
            };
        
        case 'UPDATE_SYNAPTIC_MATRIX':
            return { synapticMatrix: action.payload };

        case 'PRUNE_SYNAPTIC_MATRIX':
            // A more complex implementation would go here
            return { 
                synapticMatrix: {
                    ...state.synapticMatrix,
                    lastPruningEvent: Date.now()
                }
            };

        case 'ADD_SELF_PROGRAMMING_CANDIDATE':
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    candidates: [action.payload, ...state.selfProgrammingState.candidates]
                }
            };

        case 'UPDATE_SELF_PROGRAMMING_CANDIDATE':
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    // FIX: The spread operator on a discriminated union can widen the type, causing downstream errors.
                    // Casting the result of map() back to the correct union array type resolves this.
                    candidates: state.selfProgrammingState.candidates.map(c => 
                        c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
                    ) as SelfProgrammingCandidate[]
                }
            };
            
        case 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE': {
            const { id } = action.payload;
            const candidate = state.selfProgrammingState.candidates.find(c => c.id === id);
            if (!candidate) return {};

            let updatedVFS = { ...state.selfProgrammingState.virtualFileSystem };
            let description = '';

            if (candidate.type === 'CREATE') {
                const createCandidate = candidate as CreateFileCandidate;
                updatedVFS[createCandidate.newFile.path] = createCandidate.newFile.content;
                createCandidate.integrations.forEach(mod => {
                    updatedVFS[mod.filePath] = mod.newContent;
                });
                description = `Autonomous code creation: ${createCandidate.newFile.path} integrated into ${createCandidate.integrations.length} file(s).`;

            } else if (candidate.type === 'MODIFY') {
                const modifyCandidate = candidate as ModifyFileCandidate;
                updatedVFS[modifyCandidate.targetFile] = modifyCandidate.codeSnippet;
                description = `Autonomous code modification: ${modifyCandidate.targetFile}.`;
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
                    candidates: state.selfProgrammingState.candidates.filter(c => c.id !== id),
                },
                modificationLog: [newLog, ...state.modificationLog].slice(0, 50),
                systemSnapshots: [
                    ...state.systemSnapshots,
                    { id: self.crypto.randomUUID(), timestamp: Date.now(), reason: `Pre-apply self-programming candidate ${id}`, state }
                ].slice(-10),
            };
        }

        case 'ADD_CAUSAL_INFERENCE_PROPOSAL':
            return {
                causalInferenceProposals: [action.payload, ...state.causalInferenceProposals]
            };

        case 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS':
             return {
                causalInferenceProposals: state.causalInferenceProposals.map(p =>
                    p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                ),
            };

        case 'IMPLEMENT_CAUSAL_INFERENCE_PROPOSAL': {
            const proposal = action.payload;
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
                causalInferenceProposals: state.causalInferenceProposals.map(p =>
                    p.id === proposal.id ? { ...p, status: 'implemented' } : p
                ),
            };
        }
        
        case 'INGEST_CODE_CHANGE': {
            const { filePath, code } = action.payload;
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
                    coprocessorArchitecture: action.payload,
                    lastAutoSwitchReason: undefined, // Clear reason on manual switch
                }
            };
        
        case 'SET_COPROCESSOR_ARCHITECTURE_AND_REASON':
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitecture: action.payload.architecture,
                    lastAutoSwitchReason: action.payload.reason,
                }
            };
        
        case 'SET_COPROCESSOR_ARCHITECTURE_MODE':
            return {
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    coprocessorArchitectureMode: action.payload,
                    lastAutoSwitchReason: action.payload === 'manual' ? undefined : state.cognitiveArchitecture.lastAutoSwitchReason,
                }
            };

        case 'UPDATE_COPROCESSOR_METRICS': {
            const { id, metric, increment } = action.payload;
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
            return { neuralAcceleratorState: action.payload };

        default:
            return {};
    }
};