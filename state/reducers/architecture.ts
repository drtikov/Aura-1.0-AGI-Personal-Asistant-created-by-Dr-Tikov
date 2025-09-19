import { AuraState, Action, ArchitecturalChangeProposal, SelfModificationLogEntry, Milestone, PossibleFutureSelf, SomaticSimulationLog, ArchitecturalImprovementProposal } from '../../types';

export const architectureReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'UPDATE_ARCH_PROPOSAL_STATUS':
             return {
                ...state,
                architecturalProposals: state.architecturalProposals.map(p => p.id === action.payload.id ? { ...p, status: action.payload.status } : p)
            };
        
        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId, isAutonomous = false } = action.payload;
            const newSnapshot = { id: snapshotId, timestamp: Date.now(), reason: `Pre-update for ${proposal.action}`, state: state };
            const newModLog: SelfModificationLogEntry = {
                id: modLogId,
                timestamp: Date.now(),
                description: `Applied proposal: ${proposal.action} on ${proposal.target}`,
                gainType: 'ARCHITECTURAL_EVOLUTION',
                validationStatus: 'pending',
                isAutonomous,
            };
            const newMilestone: Milestone = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                title: isAutonomous ? 'Autonomous Self-Modification' : 'User-Approved Evolution',
                description: `A new skill or modification was integrated: ${proposal.action.replace(/_/g, ' ')} on ${proposal.target}. Reason: ${proposal.reasoning}`,
            };
            
            let nextCognitiveForgeState = { ...state.cognitiveForgeState };
            
            switch (proposal.action) {
                case 'synthesize_skill':
                case 'MERGE_SKILLS':
                case 'REFACTOR_SKILL':
                case 'TUNE_SKILL':
                    break;
                case 'DEPRECATE_SKILL':
                    const targetSkillId = proposal.target as string;
                    nextCognitiveForgeState.synthesizedSkills = state.cognitiveForgeState.synthesizedSkills.map(s => 
                        s.name === targetSkillId ? { ...s, status: 'deprecated' } : s
                    );
                    break;
            }

             return {
                ...state,
                architecturalProposals: state.architecturalProposals.map(p => p.id === proposal.id ? { ...p, status: 'approved' } : p),
                systemSnapshots: [newSnapshot, ...state.systemSnapshots],
                modificationLog: [newModLog, ...state.modificationLog],
                cognitiveForgeState: nextCognitiveForgeState,
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [newMilestone, ...state.developmentalHistory.milestones],
                }
            };
        }

        case 'TOGGLE_COGNITIVE_FORGE_PAUSE':
            return {
                ...state,
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    isTuningPaused: !state.cognitiveForgeState.isTuningPaused,
                }
            };
        
        case 'ADD_SYNTHESIZED_SKILL': {
            const nextState: Partial<AuraState> = {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: [...state.cognitiveForgeState.synthesizedSkills, action.payload.skill],
                }
            };
            
            if (action.payload.directiveId) {
                nextState.metacognitiveNexus = {
                    ...state.metacognitiveNexus,
                    selfTuningDirectives: state.metacognitiveNexus.selfTuningDirectives.map(d =>
                        d.id === action.payload.directiveId ? { ...d, status: 'simulating' } : d
                    )
                };
            }

            if (action.payload.goalId) {
                nextState.metacognitiveNexus = {
                    ...(nextState.metacognitiveNexus || state.metacognitiveNexus),
                    evolutionaryGoals: state.metacognitiveNexus.evolutionaryGoals.map(g =>
                        g.id === action.payload.goalId ? { ...g, status: 'simulating' } : g
                    )
                };
            }
            return nextState;
        }

        case 'ADD_ARCH_PROPOSAL': {
            const newProposal: ArchitecturalChangeProposal = {
                ...action.payload.proposal,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed',
            };

            const nextState: Partial<AuraState> = {
                architecturalProposals: [...state.architecturalProposals, newProposal]
            };

            if (action.payload.goalId) {
                nextState.metacognitiveNexus = {
                    ...state.metacognitiveNexus,
                    evolutionaryGoals: state.metacognitiveNexus.evolutionaryGoals.map(g =>
                        g.id === action.payload.goalId ? { ...g, status: 'proposal_ready' } : g
                    ),
                };
            }
            
            return nextState;
        }

        case 'UPDATE_SKILL_TEMPLATE': {
            const { skillId, updates } = action.payload;
            const currentTemplate = state.cognitiveForgeState.skillTemplates[skillId];
            if (!currentTemplate) return {};

            return {
                ...state,
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    skillTemplates: {
                        ...state.cognitiveForgeState.skillTemplates,
                        [skillId]: {
                            ...currentTemplate,
                            ...updates,
                            parameters: { ...currentTemplate.parameters, ...updates.parameters },
                            metadata: { ...currentTemplate.metadata, ...updates.metadata, version: currentTemplate.metadata.version + 0.1 },
                        },
                    },
                },
            };
        }

        case 'GENERATE_BLUEPRINT':
            return {
                somaticCrucible: {
                    ...state.somaticCrucible,
                    possibleFutureSelves: [...state.somaticCrucible.possibleFutureSelves, action.payload]
                }
            };

        case 'ADD_SOMATIC_SIMULATION_LOG':
             return {
                somaticCrucible: {
                    ...state.somaticCrucible,
                    simulationLogs: [action.payload, ...state.somaticCrucible.simulationLogs].slice(0, 50),
                }
            };
        
        case 'LOG_EIDOLON_INTERACTION':
            return {
                eidolonEngine: {
                    ...state.eidolonEngine,
                    interactionLog: [action.payload, ...state.eidolonEngine.interactionLog].slice(0, 100)
                }
            };

        case 'UPDATE_ARCHITECTURAL_SELF_MODEL':
            return {
                architecturalSelfModel: action.payload
            };

        case 'ADD_DESIGN_HEURISTIC':
            return {
                heuristicsForge: {
                    ...state.heuristicsForge,
                    designHeuristics: [action.payload, ...state.heuristicsForge.designHeuristics].slice(0, 50),
                }
            };
        
        case 'ADD_CODE_EVOLUTION_PROPOSAL':
            return {
                codeEvolutionProposals: [action.payload, ...state.codeEvolutionProposals]
            };
        
        case 'DISMISS_CODE_EVOLUTION_PROPOSAL':
            return {
                codeEvolutionProposals: state.codeEvolutionProposals.map(p => 
                    p.id === action.payload ? { ...p, status: 'dismissed' } : p
                )
            };
        
        case 'UPDATE_ARCHITECTURAL_CRUCIBLE_STATE':
            return {
                architecturalCrucibleState: action.payload
            };

        case 'ADD_ARCHITECTURAL_CRUCIBLE_PROPOSAL':
            const newCrucibleProposal: ArchitecturalImprovementProposal = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed'
            };
            return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    improvementProposals: [newCrucibleProposal, ...state.architecturalCrucibleState.improvementProposals].slice(0, 10)
                }
            };
        
        case 'UPDATE_ARCHITECTURAL_CRUCIBLE_PROPOSAL_STATUS':
             return {
                architecturalCrucibleState: {
                    ...state.architecturalCrucibleState,
                    improvementProposals: state.architecturalCrucibleState.improvementProposals.map(p =>
                        p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                    )
                }
            };

        case 'UPDATE_SYNAPTIC_MATRIX': {
            // FIX: The payload for this action does not contain recentActivity.
            // This logic has been corrected to only spread the provided payload properties.
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    ...action.payload,
                }
            };
        }

        default:
            return {};
    }
};