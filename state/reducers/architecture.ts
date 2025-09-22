// state/reducers/architecture.ts
import { AuraState, Action, ArchitecturalChangeProposal, SelfModificationLogEntry, Milestone, PossibleFutureSelf, SomaticSimulationLog, ArchitecturalImprovementProposal, RicciFlowManifoldState, SynapticLink } from '../../types';
import { clamp } from '../../utils';

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

        case 'ADD_CAUSAL_INFERENCE_PROPOSAL':
            return {
                causalInferenceProposals: [action.payload, ...state.causalInferenceProposals].slice(0, 10)
            };

        case 'UPDATE_CAUSAL_INFERENCE_PROPOSAL_STATUS':
            return {
                causalInferenceProposals: state.causalInferenceProposals.map(p =>
                    p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                )
            };

        case 'UPDATE_MODIFICATION_LOG_STATUS':
            return {
                modificationLog: state.modificationLog.map(log =>
                    log.id === action.payload.id
                        ? { ...log, validationStatus: action.payload.status, validationReasoning: action.payload.reasoning }
                        : log
                )
            };

        case 'UPDATE_SYNAPTIC_MATRIX': {
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    ...action.payload,
                }
            };
        }

        case 'PRUNE_SYNAPTIC_MATRIX': {
            const { threshold } = action.payload;
            const oldLinks = state.synapticMatrix.links;
            const newLinks: { [key: string]: SynapticLink } = {};
            let prunedCount = 0;
    
            Object.entries(oldLinks).forEach(([key, link]) => {
                if (link.weight * link.confidence > threshold) {
                    newLinks[key] = link;
                } else {
                    prunedCount++;
                }
            });
            
            const newActivity = {
                timestamp: Date.now(),
                message: `Crucible Pruning: Removed ${prunedCount} weak synapses.`
            };
    
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: newLinks,
                    synapseCount: Object.keys(newLinks).length,
                    lastPruningEvent: Date.now(),
                    recentActivity: [newActivity, ...state.synapticMatrix.recentActivity].slice(0, 10),
                }
            };
        }

        case 'UPDATE_SYNAPTIC_LINK_FROM_LLM': {
            const { sourceNode, targetNode, action: linkAction, causalityDirection, reasoning } = action.payload;
            if (!state.synapticMatrix.nodes[sourceNode] || !state.synapticMatrix.nodes[targetNode]) {
                console.warn(`LLM proposed link for non-existent nodes: ${sourceNode}, ${targetNode}`);
                return {};
            }
        
            const linkKey = [sourceNode, targetNode].sort().join('-');

            if (linkAction === 'PRUNE_LINK') {
                const { [linkKey]: deletedLink, ...remainingLinks } = state.synapticMatrix.links;
                const newActivity = {
                    timestamp: Date.now(),
                    message: `LLM Causal Inference (Prune): ${reasoning}`
                };
                return {
                    synapticMatrix: {
                        ...state.synapticMatrix,
                        links: remainingLinks,
                        synapseCount: state.synapticMatrix.links[linkKey] ? state.synapticMatrix.synapseCount - 1 : state.synapticMatrix.synapseCount,
                        recentActivity: [newActivity, ...state.synapticMatrix.recentActivity].slice(0, 10),
                    }
                };
            }
            
            const currentLink = state.synapticMatrix.links[linkKey] || { weight: 0.1, causality: 0, confidence: 0, observations: 0 };
            
            const weightChange = linkAction === 'CREATE_OR_STRENGTHEN_LINK' ? 0.15 : -0.15;
            
            let causalityChange = 0;
            if (causalityDirection === 'source_to_target') {
                const sortOrder = [sourceNode, targetNode].sort();
                causalityChange = (sortOrder[0] === sourceNode) ? 0.2 : -0.2;
            } else if (causalityDirection === 'target_to_source') {
                const sortOrder = [sourceNode, targetNode].sort();
                causalityChange = (sortOrder[0] === targetNode) ? 0.2 : -0.2;
            }
        
            const updatedLink = {
                ...currentLink,
                weight: clamp(currentLink.weight + weightChange),
                causality: clamp(currentLink.causality + causalityChange, -1, 1),
                observations: currentLink.observations + 1,
                confidence: 1 - (1 / (currentLink.observations + 2)),
            };
        
            const newActivity = {
                timestamp: Date.now(),
                message: `LLM Causal Inference: ${reasoning}`
            };
        
            return {
                synapticMatrix: {
                    ...state.synapticMatrix,
                    links: {
                        ...state.synapticMatrix.links,
                        [linkKey]: updatedLink,
                    },
                    synapseCount: state.synapticMatrix.links[linkKey] ? state.synapticMatrix.synapseCount : state.synapticMatrix.synapseCount + 1,
                    recentActivity: [newActivity, ...state.synapticMatrix.recentActivity].slice(0, 10),
                }
            };
        }

        case 'UPDATE_RICCI_FLOW_MANIFOLD':
            return {
                ricciFlowManifoldState: {
                    ...state.ricciFlowManifoldState,
                    ...action.payload,
                }
            };

        case 'INITIATE_SELF_PROGRAMMING_CYCLE':
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    isActive: true,
                    statusMessage: action.payload.statusMessage,
                    cycleCount: state.selfProgrammingState.cycleCount + 1,
                    candidates: [],
                }
            };

        case 'POPULATE_SELF_PROGRAMMING_CANDIDATES': {
            const newCandidates = action.payload.candidates.map(c => ({
                ...c,
                id: self.crypto.randomUUID(),
                // If the payload includes a score, it's already evaluated.
                status: (c.evaluationScore !== undefined && c.evaluationScore !== null) ? 'evaluated' as const : 'pending_evaluation' as const,
                evaluationScore: c.evaluationScore !== undefined ? c.evaluationScore : null,
            }));
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    statusMessage: action.payload.statusMessage,
                    candidates: newCandidates,
                }
            };
        }

        case 'UPDATE_SELF_PROGRAMMING_CANDIDATE':
            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    candidates: state.selfProgrammingState.candidates.map(c =>
                        c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
                    )
                }
            };

        case 'CONCLUDE_SELF_PROGRAMMING_CYCLE':
            const { implementedCandidateId, logMessage } = action.payload;
            const implementedCandidate = state.selfProgrammingState.candidates.find(c => c.id === implementedCandidateId);
            const scoreGain = implementedCandidate?.evaluationScore || 0;

            return {
                selfProgrammingState: {
                    ...state.selfProgrammingState,
                    isActive: false,
                    statusMessage: "Cycle complete. Awaiting new instructions.",
                    candidates: state.selfProgrammingState.candidates.map(c => 
                        c.id === implementedCandidateId 
                            ? { ...c, status: 'implemented' }
                            : { ...c, status: 'discarded' }
                    ),
                    log: [logMessage, ...state.selfProgrammingState.log].slice(0, 20)
                },
                cognitiveArchitecture: {
                    ...state.cognitiveArchitecture,
                    modelComplexityScore: state.cognitiveArchitecture.modelComplexityScore + (scoreGain / 100), // Apply simulated gain
                }
            };

        default:
            return {};
    }
};