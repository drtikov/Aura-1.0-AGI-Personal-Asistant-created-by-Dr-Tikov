// state/reducers/architecture.ts
import { AuraState, Action, ArchitecturalChangeProposal, ModificationLogEntry, SelfProgrammingCandidate, SystemSnapshot, SynthesizedSkill, CreateFileCandidate, ModifyFileCandidate, PsycheProposal, AbstractConceptProposal, UnifiedProposal, PerformanceLogEntry, CognitivePrimitiveDefinition } from '../../types';

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

        case 'ADD_SIMULATION_LOG':
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    simulationLog: [args, ...state.cognitiveForgeState.simulationLog].slice(0, 50),
                }
            };
            
        case 'COGNITIVE_FORGE/ANALYZE_PERFORMANCE_LOGS': {
            const successfulPlans = state.performanceLogs
                .filter((log: PerformanceLogEntry) => log.success && log.decisionContext?.reasoningPlan && log.decisionContext.reasoningPlan.length > 1)
                .map((log: PerformanceLogEntry) => log.decisionContext!.reasoningPlan!.map(step => step.skill));

            const pairCounts: { [key: string]: number } = {};
            successfulPlans.forEach(plan => {
                for (let i = 0; i < plan.length - 1; i++) {
                    const pairKey = `${plan[i]}->${plan[i + 1]}`;
                    pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
                }
            });

            const newSkills: SynthesizedSkill[] = [];
            const newPrimitives: { [key: string]: CognitivePrimitiveDefinition } = {};

            for (const pairKey in pairCounts) {
                if (pairCounts[pairKey] >= 2) { // Threshold for proposing
                    const [skill1, skill2] = pairKey.split('->');
                    if(!skill1 || !skill2) continue;
                    
                    const sequence = [skill1, skill2];
                    const name = `SYNTHESIZE_${skill1}_AND_${skill2}`;
                    const description = `An autonomously synthesized skill that combines ${skill1} and ${skill2} for greater efficiency.`;

                    const alreadyExists = state.cognitiveForgeState.synthesizedSkills.some(s => s.name === name);

                    if (!alreadyExists) {
                        const newSkill: SynthesizedSkill = {
                            id: `skill_synth_${self.crypto.randomUUID()}`,
                            name,
                            description,
                            steps: sequence,
                            status: 'active',
                            policyWeight: 1.0,
                        };
                        newSkills.push(newSkill);
                        
                        const newPrimitive: CognitivePrimitiveDefinition = {
                            type: name,
                            description: description,
                            payloadSchema: { input: 'any', context: 'string[]' },
                            isSynthesized: true,
                            sourcePrimitives: sequence,
                        };
                        newPrimitives[name] = newPrimitive;
                    }
                }
            }

            if (newSkills.length > 0) {
                return {
                    cognitiveForgeState: {
                        ...state.cognitiveForgeState,
                        synthesizedSkills: [...newSkills, ...state.cognitiveForgeState.synthesizedSkills],
                    },
                    psycheState: {
                        ...state.psycheState,
                        version: state.psycheState.version + newSkills.length,
                        primitiveRegistry: {
                            ...state.psycheState.primitiveRegistry,
                            ...newPrimitives,
                        }
                    }
                };
            }
            return {};
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
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map((p: UnifiedProposal) =>
                        p.id === id ? { ...p, status: 'implemented' } as UnifiedProposal : p
                    ),
                },
                modificationLog: [newModLog, ...state.modificationLog].slice(-50),
                kernelState: {
                    ...state.kernelState,
                    rebootRequired: true,
                }
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
        
        case 'HEURISTICS_FORGE/ADD_HEURISTIC': {
            const newHeuristic = { ...args, id: `heuristic_${self.crypto.randomUUID()}` };
            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    designHeuristics: [newHeuristic, ...state.heuristicsForge.designHeuristics].slice(0, 50)
                }
            };
        }

        default:
            return {};
    }
};