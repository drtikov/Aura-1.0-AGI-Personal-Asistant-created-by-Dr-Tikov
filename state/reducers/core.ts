import { AuraState, Action, CommandLogEntry, InternalState, SymbioticMetamorphosisProposal, Dialectic, PhenomenologicalDirective, EvolutionaryVector } from '../../types';
import { clamp } from '../../utils';

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    switch (action.type) {
        case 'SET_THEME':
            return { theme: action.payload };
        
        case 'SET_LANGUAGE':
            document.documentElement.lang = action.payload;
            return { language: action.payload };

        case 'UPDATE_CORE_IDENTITY':
            return { coreIdentity: action.payload };
        
        case 'PROCESS_USER_FEEDBACK':
            // This is a placeholder for a more complex update logic
            // For now, it slightly adjusts harmony and happiness
            const adjustment = action.payload === 'positive' ? 0.05 : -0.05;
            return {
                internalState: {
                    ...state.internalState,
                    harmonyScore: clamp(state.internalState.harmonyScore + adjustment),
                    happinessSignal: clamp(state.internalState.happinessSignal + adjustment / 2)
                }
            };
        
        case 'PRIME_INTERNAL_STATE': {
            const newInternalState = { ...state.internalState };
            for (const key in action.payload.adjustments) {
                const k = key as keyof InternalState;
                if (typeof newInternalState[k] === 'number') {
                    (newInternalState[k] as number) = clamp((newInternalState[k] as number) + action.payload.adjustments[k]!);
                }
            }
            const newCommandLog = { id: self.crypto.randomUUID(), timestamp: Date.now(), text: `State Priming: ${action.payload.reason}`, type: 'info' } as CommandLogEntry;

            return {
                internalState: newInternalState,
                commandLog: [newCommandLog, ...state.commandLog].slice(0, 50),
            };
        }
        
        case 'SET_INTERNAL_STATUS':
            return {
                internalState: {
                    ...state.internalState,
                    status: action.payload,
                }
            };

        case 'LOG_MILESTONE':
            const newMilestone = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
            };
            return {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [newMilestone, ...state.developmentalHistory.milestones],
                }
            };

        case 'UPDATE_NOOSPHERE_STATE':
            return {
                noosphereInterface: {
                    ...state.noosphereInterface,
                    ...action.payload,
                }
            };

        case 'ADD_DIALECTIC':
            const newDialectic: Dialectic = {
                ...action.payload,
                id: self.crypto.randomUUID(),
            };
            return {
                dialecticEngine: {
                    ...state.dialecticEngine,
                    activeDialectics: [newDialectic, ...state.dialecticEngine.activeDialectics].slice(0, 20),
                }
            };
        
        case 'UPDATE_DIALECTIC':
            return {
                dialecticEngine: {
                    ...state.dialecticEngine,
                    activeDialectics: state.dialecticEngine.activeDialectics.map(d => 
                        d.id === action.payload.id ? { ...d, ...action.payload.updates } : d
                    ),
                }
            };
        
        case 'PROPOSE_SYMBIOTIC_METAMORPHOSIS':
            const newProposal: SymbioticMetamorphosisProposal = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                status: 'proposed',
            };
            return {
                symbioticState: {
                    ...state.symbioticState,
                    metamorphosisProposals: [newProposal, ...state.symbioticState.metamorphosisProposals],
                }
            };

        case 'GENERATE_PHENOMENOLOGICAL_DIRECTIVE':
            return {
                phenomenologicalEngine: {
                    ...state.phenomenologicalEngine,
                    phenomenologicalDirectives: [action.payload, ...state.phenomenologicalEngine.phenomenologicalDirectives].slice(0, 20),
                }
            };
        
        case 'MAP_COGNITIVE_LIGHT_CONE':
            return {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    knowns: action.payload.knowns,
                }
            };

        case 'IDENTIFY_ZPD':
            return {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    zpd: action.payload,
                }
            };
        
        case 'FORMULATE_GRAND_CHALLENGE':
            const newVector: EvolutionaryVector = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                direction: action.payload?.objective || 'Pursue Grand Challenge',
                magnitude: 0.9, // Grand challenges are high priority
                source: 'Grand Challenge',
            };
            return {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    grandChallenge: action.payload,
                },
                telosEngine: {
                    ...state.telosEngine,
                    evolutionaryVectors: [newVector, ...state.telosEngine.evolutionaryVectors],
                }
            };

        case 'UPDATE_EXPECTATION_MODEL':
            return {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    schemaExpectationEngine: {
                        ...state.humorAndIronyState.schemaExpectationEngine,
                        ...action.payload,
                    }
                }
            };
        
        case 'UPDATE_SEMANTIC_DISSONANCE':
            return {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    semanticDissonance: action.payload,
                }
            };
        
        case 'LOG_HUMOR_ATTEMPT':
            return {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    humorLog: [action.payload, ...state.humorAndIronyState.humorLog].slice(0, 50),
                }
            };
        
        case 'UPDATE_AFFECTIVE_MODULATOR':
            return {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    affectiveSocialModulator: action.payload,
                }
            };
        
        case 'UPDATE_PERSONALITY_MATRIX':
            return {
                personalityState: {
                    ...state.personalityState,
                    ...action.payload,
                }
            };

        case 'ADD_META_INSIGHT':
            return {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: [action.payload, ...state.gankyilInsights.insights].slice(0, 50),
                }
            };

        default:
            return {};
    }
};
