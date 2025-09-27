// state/reducers/core.ts
import { AuraState, Action, CoCreatedWorkflow, GenialityImprovementProposal } from '../../types';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'SET_THEME':
            return { theme: args };

        case 'SET_LANGUAGE':
            return { language: args };

        case 'SET_INTERNAL_STATUS':
            return {
                internalState: {
                    ...state.internalState,
                    status: args,
                }
            };
        
        case 'UPDATE_INTERNAL_STATE':
            return {
                internalState: {
                    ...state.internalState,
                    ...args,
                }
            };
        
        case 'ADD_INTERNAL_STATE_HISTORY':
            return {
                internalStateHistory: [...state.internalStateHistory, args].slice(-100)
            };
            
        case 'UPDATE_USER_MODEL':
            return {
                userModel: {
                    ...state.userModel,
                    ...args,
                }
            };
            
        case 'QUEUE_EMPATHY_AFFIRMATION':
            return {
                userModel: {
                    ...state.userModel,
                    queuedEmpathyAffirmations: [...(state.userModel.queuedEmpathyAffirmations || []), args]
                }
            };

        case 'UPDATE_RIE_STATE':
            return {
                rieState: {
                    ...state.rieState,
                    ...args
                }
            };

        case 'ADD_RIE_INSIGHT':
            return {
                rieState: {
                    ...state.rieState,
                    insights: [args, ...state.rieState.insights].slice(0, 20)
                }
            };

        case 'ADD_LIMITATION':
            if (state.limitations.includes(args)) return {};
            return {
                limitations: [...state.limitations, args]
            };

        case 'ADD_CAUSAL_LINK': {
            const newLink = { ...args, id: self.crypto.randomUUID(), lastUpdated: Date.now() };
            return {
                causalSelfModel: {
                    ...state.causalSelfModel,
                    [newLink.cause]: newLink,
                }
            };
        }
        
        case 'ADD_KNOWN_UNKNOWN':
            return {
                knownUnknowns: [args, ...state.knownUnknowns]
            };

        case 'UPDATE_NARRATIVE_SUMMARY':
            return { narrativeSummary: args };

        case 'SET_TELOS':
            return {
                telosEngine: {
                    ...state.telosEngine,
                    telos: args,
                }
            };
        
        case 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL': {
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    // FIX: Added a type guard to ensure the spread operation on the union type is safe.
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === args.id && p.proposalType === 'geniality') {
                            return { ...p, status: args.status };
                        }
                        return p;
                    })
                }
            };
        }
        
        case 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL': {
            const newProposal: GenialityImprovementProposal = {
                ...args,
                proposalType: 'geniality'
            };
            return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: [...state.ontogeneticArchitectState.proposalQueue, newProposal]
                }
            };
        }

        case 'UPDATE_NOETIC_ENGRAM_STATE':
            return {
                noeticEngramState: {
                    ...state.noeticEngramState,
                    ...args,
                }
            };

        case 'SET_PSYCHEDELIC_STATE': {
            const isActive = args.isActive;
            return {
                psychedelicIntegrationState: {
                    ...state.psychedelicIntegrationState,
                    isActive,
                    log: isActive ? ['Psychedelic state initiated.'] : state.psychedelicIntegrationState.log,
                }
            };
        }
        
        case 'INDUCE_PSIONIC_STATE': {
            return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    isActive: true,
                    startTime: Date.now(),
                    duration: args.duration,
                    log: [`Psionic desynchronization induced for ${args.duration}ms.`],
                    integrationSummary: '',
                }
            };
        }
        
        case 'SET_SATORI_STATE': {
            const isActive = args.isActive;
            return {
                satoriState: {
                    ...state.satoriState,
                    isActive,
                    stage: isActive ? 'grounding' : 'none',
                    log: isActive ? ['Satori state initiated.'] : state.satoriState.log,
                }
            };
        }

        case 'AFFECTIVE/SET_BIAS': {
            const { bias, value } = args;
            return {
                affectiveModulatorState: {
                    ...state.affectiveModulatorState,
                    [bias]: value,
                }
            };
        }

        case 'TEST_CAUSAL_HYPOTHESIS':
            // This would trigger a complex process. For now, we just log it.
            console.log('Testing causal hypothesis:', args);
            return {};
            
        case 'INCREMENT_MANTRA_REPETITION':
            return {
                internalState: {
                    ...state.internalState,
                    mantraRepetitions: state.internalState.mantraRepetitions + 1,
                }
            };
        
        case 'ADD_WORKFLOW_PROPOSAL': {
            const newWorkflow: CoCreatedWorkflow = {
                ...args,
                id: `workflow_${self.crypto.randomUUID()}`,
            };
            return {
                symbioticState: {
                    ...state.symbioticState,
                    coCreatedWorkflows: [...state.symbioticState.coCreatedWorkflows, newWorkflow]
                }
            };
        }

        case 'INGEST_CODE_CHANGE': {
            const { filePath } = args;
            const newMilestone = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                title: 'VFS Code Ingestion',
                description: `A user or internal process directly modified the file: ${filePath}`,
            };
            return {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [...state.developmentalHistory.milestones, newMilestone]
                }
            };
        }

        case 'SOCIAL/ADD_NODE': {
            const newNode = args;
            if (state.socialCognitionState.socialGraph[newNode.id]) return {};
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    socialGraph: {
                        ...state.socialCognitionState.socialGraph,
                        [newNode.id]: newNode,
                    }
                }
            };
        }

        case 'SOCIAL/ADD_RELATIONSHIP': {
            const { sourceId, relationship } = args;
            const sourceNode = state.socialCognitionState.socialGraph[sourceId];
            if (!sourceNode) return {};
            const updatedNode = {
                ...sourceNode,
                relationships: [...sourceNode.relationships, relationship],
            };
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    socialGraph: {
                        ...state.socialCognitionState.socialGraph,
                        [sourceId]: updatedNode,
                    }
                }
            };
        }
        
        case 'SOCIAL/UPDATE_CULTURAL_MODEL': {
            return {
                socialCognitionState: {
                    ...state.socialCognitionState,
                    culturalModel: {
                        ...state.socialCognitionState.culturalModel,
                        ...args,
                    }
                }
            };
        }
        
        case 'CURIOSITY/SET_DRIVE': {
            return {
                curiosityState: {
                    ...state.curiosityState,
                    motivationDrive: args,
                }
            };
        }
        
        case 'CURIOSITY/SET_ACTIVE_GOAL': {
            return {
                curiosityState: {
                    ...state.curiosityState,
                    activeCuriosityGoalId: args,
                }
            };
        }

        default:
            return {};
    }
};