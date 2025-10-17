// state/reducers/architecture.ts
import { AuraState, Action, ArchitecturalChangeProposal, ModificationLogEntry, SelfProgrammingCandidate, SystemSnapshot, SynthesisCandidate, SynthesizedSkill, CreateFileCandidate, ModifyFileCandidate, PsycheProposal, AbstractConceptProposal, UnifiedProposal } from '../../types';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId, isAutonomous } = args;
            const newSnapshot: SystemSnapshot = {
                id: snapshotId,
                timestamp: Date.now(),
                reason: `Pre-apply: ${proposal.action} on ${proposal.target}`,
                state: state, // a snapshot of the *entire* state
            };
            const newModLog: ModificationLogEntry = {
                id: modLogId,
                timestamp: Date.now(),
                description: `Applied proposal: ${proposal.reasoning}`,
                gainType: 'ARCHITECTURE',
                validationStatus: 'validated',
                isAutonomous: isAutonomous,
            };
            return {
                systemSnapshots: [...state.systemSnapshots, newSnapshot].slice(-10),
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Add a type assertion to help TypeScript understand that the updated object is still a valid UnifiedProposal.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                        p.id === proposal.id ? { ...p, status: 'implemented' } as UnifiedProposal : p
                    ),
                },
                kernelState: {
                    ...state.kernelState,
                    rebootRequired: true,
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
                validationStatus: 'validated',
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
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
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

        case 'COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS': {
            const { id, status } = args;
            const candidate = state.cognitiveForgeState.synthesisCandidates.find(c => c.id === id);

            let newSynthesizedSkills = state.cognitiveForgeState.synthesizedSkills;
            if (status === 'approved' && candidate) {
                const newSkill: SynthesizedSkill = {
                    id: `skill_synth_${self.crypto.randomUUID()}`,
                    name: candidate.name,
                    description: candidate.description,
                    steps: candidate.primitiveSequence,
                    status: 'active',
                    policyWeight: 1.0,
                };
                newSynthesizedSkills = [...newSynthesizedSkills, newSkill];
            }

            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesisCandidates: state.cognitiveForgeState.synthesisCandidates.map(c =>
                        c.id === id ? { ...c, status } : c
                    ),
                    synthesizedSkills: newSynthesizedSkills,
                }
            };
        }

        case 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE': {
            const { id } = args;
            const candidate = state.ontogeneticArchitectState.proposalQueue.find(p => p.id === id) as SelfProgrammingCandidate | undefined;
            if (!candidate) return {};

            let newVFS = { ...state.selfProgrammingState.virtualFileSystem };
            if (candidate.proposalType === 'self_programming_create') {
                const createCandidate = candidate as CreateFileCandidate;
                newVFS[createCandidate.newFile.path] = createCandidate.newFile.content;
                createCandidate.integrations.forEach(mod => {
                    newVFS[mod.filePath] = mod.newContent;
                });
            } else if (candidate.proposalType === 'self_programming_modify') {
                const modifyCandidate = candidate as ModifyFileCandidate;
                newVFS[modifyCandidate.targetFile] = modifyCandidate.codeSnippet;
            }

            const newModLog: ModificationLogEntry = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                description: `Implemented self-programming: ${candidate.reasoning}`,
                gainType: 'SELF_PROGRAMMING',
                validationStatus: 'validated',
                isAutonomous: candidate.source === 'autonomous',
            };

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    virtualFileSystem: newVFS,
                },
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Add a type assertion to help TypeScript understand that the updated object is still a valid UnifiedProposal.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                        p.id === id ? { ...p, status: 'implemented' } as UnifiedProposal : p
                    ),
                },
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
            };
        }

        case 'REJECT_SELF_PROGRAMMING_CANDIDATE': {
            const { id } = args;
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p =>
                        p.id === id ? { ...p, status: 'rejected' } : p
                    ),
                }
            };
        }
        
        case 'OA/ADD_PROPOSAL': {
             const newProposal: UnifiedProposal = args;
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: [newProposal, ...state.ontogeneticArchitectState.proposalQueue]
                }
            };
        }

        case 'OA/UPDATE_PROPOSAL': {
            const { id, updates } = args;
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                        p.id === id ? { ...p, ...updates } : p
                    )
                }
            };
        }

        default:
            return {};
    }
};