import { AuraState, Action, CommandLogEntry, InternalState, SymbioticMetamorphosisProposal, Dialectic, PhenomenologicalDirective, EvolutionaryVector, GenialityImprovementProposal } from '../../types';
import { clamp } from '../../utils';

const recalculateDerivedState = (state: AuraState): Partial<AuraState> => {
    const { selfAwarenessState, rieState, internalState } = state;
    const awarenessClarity = clamp((selfAwarenessState.modelCoherence + rieState.clarityScore - internalState.load) / 2);
    return {
        internalState: {
            ...internalState,
            awarenessClarity,
        }
    }
};

export const coreReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    let nextState: Partial<AuraState> = {};
    
    switch (action.type) {
        case 'SET_THEME':
            nextState = { theme: action.payload };
            break;
        
        case 'SET_LANGUAGE':
            document.documentElement.lang = action.payload;
            nextState = { language: action.payload };
            break;

        case 'UPDATE_CORE_IDENTITY':
            const newNarrative = `${state.coreIdentity.baseNarrative}\n\n**Current Projected Self:** ${action.payload.narrativeSelf || state.atmanProjector.dominantNarrative}`;
            return {
                coreIdentity: {
                    ...state.coreIdentity,
                    ...action.payload,
                    narrativeSelf: newNarrative
                }
            };
        
        case 'PROCESS_USER_FEEDBACK': {
            const adjustment = action.payload === 'positive' ? 0.05 : -0.05;
            const synapticUpdate = action.payload === 'positive'
                ? { efficiency: clamp(state.synapticMatrix.efficiency + 0.02), synapseCount: state.synapticMatrix.synapseCount + 500 }
                : { plasticity: clamp(state.synapticMatrix.plasticity + 0.03) };

            nextState = {
                internalState: {
                    ...state.internalState,
                    harmonyScore: clamp(state.internalState.harmonyScore + adjustment),
                    happinessSignal: clamp(state.internalState.happinessSignal + adjustment / 2)
                },
                synapticMatrix: {
                    ...state.synapticMatrix,
                    ...synapticUpdate,
                    // FIX: Update recentActivity by prepending new entry and slicing, consistent with other reducers.
                    recentActivity: [{ timestamp: Date.now(), message: `Synapses reinforced by ${action.payload} feedback.` }, ...state.synapticMatrix.recentActivity].slice(0, 10)
                }
            };
            break;
        }
        
        case 'PRIME_INTERNAL_STATE': {
            const newInternalState = { ...state.internalState };
            for (const key in action.payload.adjustments) {
                const k = key as keyof InternalState;
                if (typeof newInternalState[k] === 'number') {
                    (newInternalState[k] as number) = clamp((newInternalState[k] as number) + action.payload.adjustments[k]!);
                }
            }
            const newCommandLog = { id: self.crypto.randomUUID(), timestamp: Date.now(), text: `State Priming: ${action.payload.reason}`, type: 'info' } as CommandLogEntry;

            nextState = {
                internalState: newInternalState,
                commandLog: [newCommandLog, ...state.commandLog].slice(0, 50),
            };
            break;
        }
        
        case 'SET_INTERNAL_STATUS':
            nextState = {
                internalState: {
                    ...state.internalState,
                    status: action.payload,
                }
            };
            break;

        case 'LOG_MILESTONE': {
            const newMilestone = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
            };
            nextState = {
                developmentalHistory: {
                    ...state.developmentalHistory,
                    milestones: [newMilestone, ...state.developmentalHistory.milestones],
                }
            };
            break;
        }

        case 'UPDATE_NOOSPHERE_STATE':
            nextState = {
                noosphereInterface: {
                    ...state.noosphereInterface,
                    ...action.payload,
                }
            };
            break;

        case 'ADD_DIALECTIC': {
            const newDialectic: Dialectic = {
                ...action.payload,
                id: self.crypto.randomUUID(),
            };
            nextState = {
                dialecticEngine: {
                    ...state.dialecticEngine,
                    activeDialectics: [newDialectic, ...state.dialecticEngine.activeDialectics].slice(0, 20),
                }
            };
            break;
        }
        
        case 'UPDATE_DIALECTIC':
            nextState = {
                dialecticEngine: {
                    ...state.dialecticEngine,
                    activeDialectics: state.dialecticEngine.activeDialectics.map(d => 
                        d.id === action.payload.id ? { ...d, ...action.payload.updates } : d
                    ),
                }
            };
            break;
        
        case 'PROPOSE_SYMBIOTIC_METAMORPHOSIS': {
            const newProposal: SymbioticMetamorphosisProposal = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                status: 'proposed',
            };
            nextState = {
                symbioticState: {
                    ...state.symbioticState,
                    metamorphosisProposals: [newProposal, ...state.symbioticState.metamorphosisProposals],
                }
            };
            break;
        }

        case 'GENERATE_PHENOMENOLOGICAL_DIRECTIVE':
            nextState = {
                phenomenologicalEngine: {
                    ...state.phenomenologicalEngine,
                    phenomenologicalDirectives: [action.payload, ...state.phenomenologicalEngine.phenomenologicalDirectives].slice(0, 20),
                }
            };
            break;
        
        case 'MAP_COGNITIVE_LIGHT_CONE':
            nextState = {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    knowns: action.payload.knowns,
                }
            };
            break;

        case 'IDENTIFY_ZPD':
            nextState = {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    zpd: action.payload,
                }
            };
            break;
        
        case 'FORMULATE_GRAND_CHALLENGE': {
            const newVector: EvolutionaryVector = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                direction: action.payload?.objective || 'Pursue Grand Challenge',
                magnitude: 0.9, // Grand challenges are high priority
                source: 'Grand Challenge',
            };
            nextState = {
                cognitiveLightCone: {
                    ...state.cognitiveLightCone,
                    grandChallenge: action.payload,
                },
                telosEngine: {
                    ...state.telosEngine,
                    evolutionaryVectors: [newVector, ...state.telosEngine.evolutionaryVectors],
                }
            };
            break;
        }

        case 'UPDATE_EXPECTATION_MODEL':
            nextState = {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    schemaExpectationEngine: {
                        ...state.humorAndIronyState.schemaExpectationEngine,
                        ...action.payload,
                    }
                }
            };
            break;
        
        case 'UPDATE_SEMANTIC_DISSONANCE':
            nextState = {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    semanticDissonance: action.payload,
                }
            };
            break;
        
        case 'LOG_HUMOR_ATTEMPT':
            nextState = {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    humorLog: [action.payload, ...state.humorAndIronyState.humorLog].slice(0, 50),
                }
            };
            break;
        
        case 'UPDATE_AFFECTIVE_MODULATOR':
            nextState = {
                humorAndIronyState: {
                    ...state.humorAndIronyState,
                    affectiveSocialModulator: action.payload,
                }
            };
            break;
        
        case 'UPDATE_PERSONALITY_MATRIX':
            nextState = {
                personalityState: {
                    ...state.personalityState,
                    ...action.payload,
                }
            };
            break;

        case 'ADD_META_INSIGHT':
            nextState = {
                gankyilInsights: {
                    ...state.gankyilInsights,
                    insights: [action.payload, ...state.gankyilInsights.insights].slice(0, 50),
                }
            };
            break;

        case 'UPDATE_NOETIC_ENGRAM_STATE':
            nextState = {
                noeticEngramState: {
                    ...state.noeticEngramState,
                    ...action.payload,
                }
            };
            break;

        case 'UPDATE_GENIALITY_STATE':
            return {
                genialityEngineState: action.payload
            };

        case 'ADD_GENIALITY_IMPROVEMENT_PROPOSAL':
            const newProposal: GenialityImprovementProposal = {
                ...action.payload,
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed'
            };
            return {
                genialityEngineState: {
                    ...state.genialityEngineState,
                    improvementProposals: [newProposal, ...state.genialityEngineState.improvementProposals].slice(0, 10)
                }
            };
        
        case 'UPDATE_GENIALITY_IMPROVEMENT_PROPOSAL_STATUS':
             return {
                genialityEngineState: {
                    ...state.genialityEngineState,
                    improvementProposals: state.genialityEngineState.improvementProposals.map(p =>
                        p.id === action.payload.id ? { ...p, status: action.payload.status } : p
                    )
                }
            };
        
        case 'UPDATE_ATMAN_PROJECTOR_STATE':
            return {
                atmanProjector: action.payload
            };
    }

    // After a state change, recalculate derived values.
    // ADD_PERFORMANCE_LOG is a good trigger as it means a cycle has completed.
    if (action.type === 'ADD_PERFORMANCE_LOG') {
         return {
            ...nextState,
            ...recalculateDerivedState({ ...state, ...nextState }),
        };
    }

    return nextState;
};