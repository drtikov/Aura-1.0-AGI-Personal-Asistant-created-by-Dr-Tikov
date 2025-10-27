// state/reducers/core.ts
import { AuraState, Action, CoCreatedWorkflow, GenialityImprovementProposal, KnownUnknown, UnifiedProposal } from '../../types.ts';
import { clamp } from '../../utils.ts';
import { AuraConfig } from '../../constants.ts';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'PROCESS_COMMAND':
            return { commandToProcess: args };
        case 'CLEAR_COMMAND_TO_PROCESS':
            return { commandToProcess: null };

        case 'COGNITIVE/SET_STRATEGY':
            return {
                cognitiveStrategy: args.strategy,
            };

        case 'TOGGLE_IDLE_THOUGHT':
            return { isIdleThoughtEnabled: !state.isIdleThoughtEnabled };

        case 'EXECUTE_UI_HANDLER':
            return {
                uiCommandRequest: {
                    handlerName: args.handlerName,
                    args: args.args || [],
                }
            };
        case 'CLEAR_UI_COMMAND_REQUEST':
            return { uiCommandRequest: null };

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

        case 'USER_MODEL/LOG_TASK_SUCCESS': {
            const newHistory = [...state.userModel.taskSuccessHistory, { success: args.success, timestamp: Date.now() }].slice(-10);
            const successCount = newHistory.filter(item => item.success).length;
            const newCompetence = newHistory.length > 0 ? successCount / newHistory.length : 0.6; // Default to 0.6 if no history

            return {
                userModel: {
                    ...state.userModel,
                    taskSuccessHistory: newHistory,
                    perceivedCompetence: newCompetence,
                }
            };
        }

        case 'UPDATE_PERSONALITY_PORTRAIT':
            return {
                userModel: {
                    ...state.userModel,
                    personalityPortrait: args,
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
        
        case 'RIE/TRIGGER_ADAPTATION_ANALYSIS':
            return {
                rieState: {
                    ...state.rieState,
                    adaptationAnalysisPending: true,
                }
            };
        
        case 'RIE/COMPLETE_ADAPTATION_ANALYSIS':
            return {
                rieState: {
                    ...state.rieState,
                    adaptationAnalysisPending: false,
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

        case 'UPDATE_KNOWN_UNKNOWN': {
            return {
                knownUnknowns: state.knownUnknowns.map(ku => 
                    ku.id === args.id ? { ...ku, ...args.updates } : ku
                )
            };
        }

        case 'UPDATE_KNOWN_UNKNOWNS_BATCH': {
            const { updates } = args as { updates: { id: string; priority: number }[] };
            const priorityMap = new Map(updates.map(u => [u.id, u.priority]));
            
            const newKnownUnknowns = state.knownUnknowns.map(ku => {
                if (priorityMap.has(ku.id)) {
                    return { ...ku, priority: priorityMap.get(ku.id)! };
                }
                return ku;
            });
            
            return {
                knownUnknowns: newKnownUnknowns,
            };
        }

        case 'UPDATE_NARRATIVE_SUMMARY':
            return { narrativeSummary: args };

        case 'SET_TELOS':
            return {
                telosEngine: {
                    ...state.telosEngine,
                    valueHierarchy: {
                        ...state.telosEngine.valueHierarchy,
                        telos: args,
                    },
                }
            };

        case 'TELOS/ADD_CANDIDATE':
            return {
                telosEngine: {
                    ...state.telosEngine,
                    candidateTelos: [...state.telosEngine.candidateTelos, args]
                }
            };
        
        case 'TELOS/REMOVE_CANDIDATE':
            return {
                telosEngine: {
                    ...state.telosEngine,
                    candidateTelos: state.telosEngine.candidateTelos.filter(c => c.id !== args),
                }
            };

        case 'TELOS/ADOPT_CANDIDATE': {
            const candidate = state.telosEngine.candidateTelos.find(c => c.id === args);
            if (!candidate) return {};
            return {
                telosEngine: {
                    ...state.telosEngine,
                    valueHierarchy: {
                        ...state.telosEngine.valueHierarchy,
                        telos: candidate.text,
                    },
                    candidateTelos: state.telosEngine.candidateTelos.filter(c => c.id !== args),
                }
            };
        }

        case 'TELOS/DECOMPOSE_AND_SET_TREE': {
            const { vectors } = args;
            return {
                telosEngine: {
                    ...state.telosEngine,
                    evolutionaryVectors: vectors,
                    lastDecomposition: Date.now(),
                }
            };
        }
        
        case 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL': {
             return {
                ontogeneticArchitectState: {
                    ...state.ontogeneticArchitectState,
                    proposalQueue: state.ontogeneticArchitectState.proposalQueue.map(p => {
                        if (p.id === args.id && p.proposalType === 'geniality') {
                            const updated: UnifiedProposal = { ...p, status: args.status };
                            return updated;
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
            const { isActive, mode } = args;
            const logEntry = isActive ? `Psychedelic state initiated with mode: ${mode}.` : 'Psychedelic state terminated.';
            return {
                psychedelicIntegrationState: {
                    ...state.psychedelicIntegrationState,
                    isActive,
                    mode,
                    log: [...state.psychedelicIntegrationState.log, logEntry].slice(-20),
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
                title: 'Manual Code Ingestion',
                description: `A user or external agent directly modified the file: ${filePath}`,
            };
            return {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [...state.developmentalHistory.milestones, newMilestone]
                }
            };
        }
        
        case 'UPDATE_PERSONALITY_STATE': {
            return {
                personalityState: {
                    ...state.personalityState,
                    ...args
                }
            }
        }
        
        case 'ADD_GANKYIL_INSIGHT':
            return {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: [args, ...state.gankyilInsights.insights]
                }
            };

        case 'PROCESS_GANKYIL_INSIGHT':
            return {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: state.gankyilInsights.insights.map(i => i.id === args.id ? { ...i, isProcessedForEvolution: true } : i)
                }
            };

        case 'MULTIVERSE/SET_BRANCHES':
            return {
                noeticMultiverse: {
                    ...state.noeticMultiverse,
                    activeBranches: args,
                    divergenceIndex: args.length > 1 ? state.noeticMultiverse.divergenceIndex + 0.05 : state.noeticMultiverse.divergenceIndex - 0.05
                }
            };
        
        case 'MULTIVERSE/LOG_PRUNING':
             return {
                noeticMultiverse: {
                    ...state.noeticMultiverse,
                    pruningLog: [args.log, ...state.noeticMultiverse.pruningLog].slice(0, 10)
                }
            };

        case 'SELF_ADAPTATION/SET_ACTIVE':
            return {
                selfAdaptationState: {
                    ...state.selfAdaptationState,
                    activeAdaptation: args,
                }
            };

        case 'SITUATIONAL_AWARENESS/UPDATE_FIELD':
            return {
                situationalAwareness: {
                    ...state.situationalAwareness,
                    attentionalField: { ...state.situationalAwareness.attentionalField, ...args }
                }
            };

        case 'SITUATIONAL_AWARENESS/LOG_DOM_CHANGE':
            return {
                situationalAwareness: {
                    ...state.situationalAwareness,
                    domChangeLog: [{ timestamp: Date.now(), summary: args.summary }, ...state.situationalAwareness.domChangeLog].slice(0, 20)
                }
            };

        case 'MODAL/OPEN':
            return { modalRequest: args };
        case 'MODAL/CLOSE':
        case 'CLEAR_MODAL_REQUEST':
            return { modalRequest: null };

        case 'SHOW_PROACTIVE_UI':
            return { proactiveUI: { ...args, isActive: true } };
        case 'HIDE_PROACTIVE_UI':
            return { proactiveUI: { ...state.proactiveUI, isActive: false } };
            
        default:
            return {};
    }
};