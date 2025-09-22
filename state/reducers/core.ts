// state/reducers/core.ts
import { AuraState, Action, InternalState, UserModel, AffectiveState } from '../../types';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'SET_THEME':
            document.body.className = action.payload;
            return { theme: action.payload };
        
        case 'SET_LANGUAGE':
            return { language: action.payload };

        case 'SET_PROCESSING_STATE':
            if (action.payload.active) {
                return { internalState: { ...state.internalState, status: 'processing' } };
            }
            return { internalState: { ...state.internalState, status: 'idle' } };
        
        case 'UPDATE_INTERNAL_STATE': {
            const newInternalState: InternalState = { ...state.internalState, ...action.payload };
            return { 
                internalState: newInternalState,
                // Add current state to history for sparklines
                internalStateHistory: [...state.internalStateHistory, newInternalState].slice(-50)
            };
        }

        case 'INCREMENT_MANTRA_REPETITION':
            return {
                mantraState: {
                    repetitionCount: state.mantraState.repetitionCount + 1,
                    lastRepetitionTimestamp: Date.now(),
                }
            };

        case 'SET_INTERNAL_STATUS':
            return { internalState: { ...state.internalState, status: action.payload } };
        
        case 'UPDATE_USER_MODEL':
            return { userModel: { ...state.userModel, ...action.payload } };
        
        case 'ADD_INSIGHT':
            return {
                rieState: {
                    ...state.rieState,
                    insights: [action.payload, ...state.rieState.insights].slice(0, 50),
                }
            };
        
        case 'ADD_CAUSAL_LINK':
            return {
                causalSelfModel: {
                    ...state.causalSelfModel,
                    [action.payload.cause]: action.payload,
                }
            };

        case 'ADD_KNOWN_UNKNOWN':
            if (state.knownUnknowns.some(ku => ku.question === action.payload.question)) return {};
            return { knownUnknowns: [action.payload, ...state.knownUnknowns].slice(0, 50) };
        
        case 'UPDATE_ATMAN_PROJECTOR_STATE':
            return { atmanProjector: action.payload };

        case 'UPDATE_WORLD_MODEL_STATE':
            return { worldModelState: { ...state.worldModelState, ...action.payload } };

        case 'UPDATE_CORE_IDENTITY':
            return { coreIdentity: { ...state.coreIdentity, ...action.payload } };

        case 'UPDATE_CURIOSITY_STATE':
            return { curiosityState: { ...state.curiosityState, ...action.payload } };

        case 'UPDATE_SELF_AWARENESS_STATE':
            return { selfAwarenessState: { ...state.selfAwarenessState, ...action.payload } };
        
        case 'UPDATE_PERSONALITY_STATE':
            return { personalityState: { ...state.personalityState, ...action.payload }};

        case 'ADD_GANKYIL_INSIGHT':
            const newInsight = { ...action.payload, id: self.crypto.randomUUID(), timestamp: Date.now(), isProcessedForEvolution: false };
            return {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: [newInsight, ...state.gankyilInsights.insights].slice(0, 20)
                }
            };
        
        case 'MARK_INSIGHT_PROCESSED':
            return {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: state.gankyilInsights.insights.map(i =>
                        i.id === action.payload.insightId ? { ...i, isProcessedForEvolution: true } : i
                    )
                }
            };
        
        case 'UPDATE_NOETIC_ENGRAM_STATE':
            return { noeticEngramState: { ...state.noeticEngramState, ...action.payload } };
        
        case 'UPDATE_GENIALITY_STATE':
            return { genialityEngineState: action.payload };

        case 'ADD_GENIALITY_PROPOSAL':
            const newGenialityProposal = { ...action.payload, id: self.crypto.randomUUID(), timestamp: Date.now(), status: 'proposed' as const };
            return {
                genialityEngineState: {
                    ...state.genialityEngineState,
                    improvementProposals: [newGenialityProposal, ...state.genialityEngineState.improvementProposals].slice(0, 10)
                }
            };

        case 'UPDATE_GENIALITY_PROPOSAL_STATUS':
             return {
                genialityEngineState: {
                    ...state.genialityEngineState,
                    improvementProposals: state.genialityEngineState.improvementProposals.map(p =>
                        p.id === action.payload.id ? { ...p, status: action.payload.status as any } : p
                    )
                }
            };
        
        case 'ADD_NOETIC_BRANCH':
            return {
                noeticMultiverse: {
                    ...state.noeticMultiverse,
                    activeBranches: [...state.noeticMultiverse.activeBranches, action.payload]
                }
            };

        case 'UPDATE_NOETIC_BRANCH':
            return {
                noeticMultiverse: {
                    ...state.noeticMultiverse,
                    activeBranches: state.noeticMultiverse.activeBranches.map(b => 
                        b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
                    )
                }
            };
        
        case 'COLLAPSE_NOETIC_BRANCHES':
            return {
                noeticMultiverse: {
                    ...state.noeticMultiverse,
                    activeBranches: [],
                    pruningLog: [...state.noeticMultiverse.pruningLog, ...action.payload.prunedBranches].slice(-20)
                },
                // Optionally add the winning insight to memory
                workingMemory: [...state.workingMemory, `Multiverse Insight: ${action.payload.winningInsight}`]
            };
        
        case 'SET_ACTIVE_ADAPTATION':
            return {
                selfAdaptationState: {
                    ...state.selfAdaptationState,
                    activeAdaptation: action.payload
                }
            };
        
        case 'SET_PSYCHEDELIC_STATE':
            return { psychedelicIntegrationState: { ...state.psychedelicIntegrationState, ...action.payload } };

        case 'LOG_PSYCHEDELIC_EVENT':
            return {
                psychedelicIntegrationState: {
                    ...state.psychedelicIntegrationState,
                    log: [...state.psychedelicIntegrationState.log, action.payload].slice(-20)
                }
            };

        case 'INDUCE_PSIONIC_STATE':
            return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    isActive: true,
                    startTime: Date.now(),
                    duration: action.payload.duration,
                    log: ['Psionic desynchronization initiated.'],
                    integrationSummary: null,
                }
            };
        
        case 'UPDATE_PSIONIC_STATE':
            return { psionicDesynchronizationState: { ...state.psionicDesynchronizationState, ...action.payload } };

        case 'CONCLUDE_PSIONIC_STATE': {
            const newInsight = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                insight: action.payload.integrationSummary,
                source: 'psionic_desynchronization' as const,
                isProcessedForEvolution: false,
            };
            return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    isActive: false,
                    startTime: null,
                    integrationSummary: action.payload.integrationSummary,
                },
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: [newInsight, ...state.gankyilInsights.insights].slice(0, 20)
                }
            };
        }
        
        case 'LOG_PSIONIC_EVENT':
             return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    log: [...state.psionicDesynchronizationState.log, action.payload].slice(-20)
                }
            };

        case 'UPDATE_AFFECTIVE_MODULATOR_STATE':
            return { affectiveModulatorState: action.payload };

        case 'TRIGGER_SATORI_CYCLE':
            return {
                satoriState: {
                    ...state.satoriState,
                    isActive: true,
                    stage: 'dissolving',
                    log: ['Satori cycle initiated.'],
                    lastInsight: null,
                }
            };

        case 'SET_SATORI_STAGE':
            return {
                satoriState: {
                    ...state.satoriState,
                    stage: action.payload,
                }
            };
        
        case 'LOG_SATORI_EVENT':
            return {
                satoriState: {
                    ...state.satoriState,
                    log: [...state.satoriState.log, action.payload].slice(-20),
                }
            };

        case 'CONCLUDE_SATORI_CYCLE':
            return {
                satoriState: {
                    ...state.satoriState,
                    isActive: false,
                    stage: 'idle',
                    lastInsight: action.payload.insight,
                }
            };

        default:
            return {};
    }
};