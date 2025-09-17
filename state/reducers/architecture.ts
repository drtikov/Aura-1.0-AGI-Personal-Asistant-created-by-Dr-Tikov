import { AuraState, Action, ArchitecturalChangeProposal, SelfModificationLogEntry, Milestone } from '../../types';

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

        default:
            return {};
    }
};