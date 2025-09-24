// state/reducers/core.ts
import { AuraState, Action, CreateFileCandidate } from '../../types';
import { clamp } from '../../utils';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'SET_THEME':
            return { theme: action.payload };

        case 'SET_LANGUAGE':
            return { language: action.payload };

        case 'UPDATE_INTERNAL_STATE': {
            const newInternalState = { ...state.internalState, ...action.payload };
            return {
                internalState: newInternalState,
                internalStateHistory: [...state.internalStateHistory, newInternalState].slice(-50)
            };
        }
        
        case 'SET_INTERNAL_STATUS': {
            const newInternalState = { ...state.internalState, status: action.payload };
             return {
                internalState: newInternalState,
                internalStateHistory: [...state.internalStateHistory, newInternalState].slice(-50)
            };
        }

        case 'DECAY_INTERNAL_STATE_SIGNAL': {
            const { signal, decayRate } = action.payload;
            const currentValue = state.internalState[signal] as number;
            const newValue = clamp(currentValue - decayRate);
            return {
                internalState: {
                    ...state.internalState,
                    [signal]: newValue,
                }
            };
        }
        
        case 'UPDATE_USER_MODEL':
            return { userModel: { ...state.userModel, ...action.payload } };

        case 'ADD_KNOWN_UNKNOWN':
            if (state.knownUnknowns.some(k => k.question === action.payload.question)) {
                return {};
            }
            return { knownUnknowns: [action.payload, ...state.knownUnknowns] };
            
        case 'QUEUE_EMPATHY_AFFIRMATION':
            return {
                userModel: {
                    ...state.userModel,
                    queuedEmpathyAffirmations: [...(state.userModel.queuedEmpathyAffirmations || []), action.payload]
                }
            };
            
        case 'UPDATE_GENIALITY_STATE':
            return { genialityEngineState: action.payload };

        case 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL':
            return {
                genialityEngineState: {
                    ...state.genialityEngineState,
                    improvementProposals: [action.payload, ...state.genialityEngineState.improvementProposals]
                }
            };

        case 'INCREMENT_MANTRA_REPETITION':
            return {
                internalState: {
                    ...state.internalState,
                    mantraRepetitions: (state.internalState.mantraRepetitions || 0) + 1,
                }
            };

        case 'UPDATE_NOETIC_ENGRAM_STATE':
            return { noeticEngramState: { ...state.noeticEngramState, ...action.payload } };
        
        case 'INDUCE_PSIONIC_STATE':
            return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    isActive: true,
                    startTime: Date.now(),
                    duration: action.payload.duration,
                    log: [`Psionic desynchronization induced for ${action.payload.duration}ms.`],
                    integrationSummary: '',
                }
            };
            
        case 'CONCLUDE_PSIONIC_STATE':
            return {
                 psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    isActive: false,
                    startTime: null,
                    desynchronizationLevel: 0,
                    networkSegregation: 1,
                    selfModelCoherence: 1,
                    integrationSummary: action.payload.integrationSummary,
                }
            };

        case 'UPDATE_PSIONIC_STATE':
            return {
                psionicDesynchronizationState: {
                    ...state.psionicDesynchronizationState,
                    ...action.payload,
                }
            };
        
        case 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE': {
            const candidate = state.selfProgrammingState.candidates.find(c => c.id === action.payload.id);
            if (!candidate) return {};

            let description = '';
            if (candidate.type === 'CREATE') {
                const createCandidate = candidate as CreateFileCandidate;
                description = `Autonomously created new component '${createCandidate.newFile.path}' and integrated it across ${createCandidate.integrations.length} other file(s).`;
            } else {
                description = `Autonomously modified file: ${candidate.targetFile}.`;
            }

            const newMilestone = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                title: 'Autonomous Code Evolution',
                description,
            };
            return {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [...state.developmentalHistory.milestones, newMilestone]
                }
            };
        }

        case 'INGEST_CODE_CHANGE': {
            const { filePath } = action.payload;
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

        default:
            return {};
    }
};