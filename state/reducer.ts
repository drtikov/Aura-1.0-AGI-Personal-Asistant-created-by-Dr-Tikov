import { AuraState, ArchitecturalChangeProposal, CognitiveGainLogEntry, CognitiveModeLogEntry, Fact, HistoryEntry, InternalState, IntuitiveLeap, PerformanceLogEntry, SelfDirectedGoal, SystemSnapshot, ResourceMonitor, SelfModificationLogEntry, CognitiveModule, ValidationResult, AffectiveState, ProactiveSuggestion, VetoLogEntry, RIEInsight } from '../types';
import { AuraConfig, InternalStateEvents, WORKING_MEMORY_CAPACITY } from '../constants';
import { clamp } from '../utils';

export type Action =
    | { type: 'SET_THEME'; payload: string }
    | { type: 'ADD_HISTORY'; payload: HistoryEntry }
    | { type: 'UPDATE_HISTORY_FEEDBACK'; payload: { id: string; feedback: 'positive' | 'negative' } }
    | { type: 'PROCESS_USER_FEEDBACK'; payload: 'positive' | 'negative' }
    | { type: 'ADD_FACTS'; payload: Fact[] }
    | { type: 'DELETE_FACT'; payload: string }
    | { type: 'SET_GOALS'; payload: SelfDirectedGoal[] }
    | { type: 'UPDATE_GOAL_STATUS'; payload: { id: string; status: SelfDirectedGoal['status'] } }
    | { type: 'UPDATE_GOAL_OUTCOME'; payload: { id: string; status: 'completed' | 'failed'; executionLog: string; logId: string; } }
    | { type: 'DELETE_GOAL'; payload: string }
    | { type: 'ADD_PERFORMANCE_LOG'; payload: PerformanceLogEntry }
    | { type: 'SET_INTERNAL_STATE'; payload: Partial<InternalState> }
    | { type: 'DECAY_INTERNAL_STATE' }
    | { type: 'PROCESS_INTERNAL_EVENT'; payload: { eventType: string; payload?: Record<string, any> } }
    | { type: 'ADD_ARCH_PROPOSAL'; payload: ArchitecturalChangeProposal }
    | { type: 'UPDATE_ARCH_PROPOSAL_STATUS'; payload: { id: string; status: 'approved' | 'rejected' } }
    | { type: 'APPLY_ARCH_PROPOSAL'; payload: { proposal: ArchitecturalChangeProposal, snapshotId: string, modLogId: string } }
    | { type: 'UPDATE_MODIFICATION_LOG_STATUS'; payload: { logId: string; status: 'success' | 'failed'; validationResults: ValidationResult } }
    | { type: 'ADD_COGNITIVE_MODE_LOG'; payload: CognitiveModeLogEntry }
    | { type: 'ADD_INTUITIVE_LEAP'; payload: IntuitiveLeap }
    | { type: 'ADD_SNAPSHOT'; payload: { reason: string; state: Partial<AuraState> } }
    | { type: 'ROLLBACK_STATE'; payload: Partial<AuraState> }
    | { type: 'ADD_TO_WORKING_MEMORY'; payload: string }
    | { type: 'REMOVE_FROM_WORKING_MEMORY'; payload: string }
    | { type: 'UPDATE_RESOURCE_MONITOR'; payload: ResourceMonitor }
    | { type: 'LOG_INTERNAL_STATE' }
    | { type: 'UPDATE_USER_MODEL_SENTIMENT'; payload: { score: number, affectiveState: AffectiveState } }
    | { type: 'UPDATE_USER_MODEL_VISUAL_AFFECT'; payload: { affectiveState: AffectiveState, confidence: number } }
    | { type: 'SET_PROACTIVE_SUGGESTIONS'; payload: ProactiveSuggestion[] }
    | { type: 'UPDATE_SUGGESTION_STATUS'; payload: { id: string; status: 'accepted' | 'rejected' } }
    | { type: 'LOG_ETHICAL_VETO'; payload: VetoLogEntry }
    | { type: 'ADD_RIE_INSIGHT'; payload: RIEInsight }
    | { type: 'RESET_STATE'; payload: AuraState };

export const auraReducer = (state: AuraState, action: Action): AuraState => {
    switch (action.type) {
        case 'SET_THEME': return { ...state, theme: action.payload };
        case 'ADD_HISTORY': return { ...state, history: [...state.history, action.payload] };
        case 'UPDATE_HISTORY_FEEDBACK':
            return {
                ...state,
                history: state.history.map(entry =>
                    entry.id === action.payload.id
                        ? { ...entry, feedback: action.payload.feedback }
                        : entry
                ),
            };
        case 'PROCESS_USER_FEEDBACK': {
            const isPositive = action.payload === 'positive';
            return {
                ...state,
                internalState: {
                    ...state.internalState,
                    masterySignal: clamp(state.internalState.masterySignal + (isPositive ? 0.1 : -0.05)),
                    happinessSignal: clamp(state.internalState.happinessSignal + (isPositive ? 0.05 : -0.02)),
                    uncertaintySignal: clamp(state.internalState.uncertaintySignal + (isPositive ? -0.05 : 0.1)),
                },
                userModel: {
                    ...state.userModel,
                    trustLevel: clamp(state.userModel.trustLevel + (isPositive ? 0.05 : -0.02)),
                }
            };
        }
        case 'ADD_FACTS': return { ...state, knowledgeGraph: [...state.knowledgeGraph, ...action.payload] };
        case 'DELETE_FACT': return { ...state, knowledgeGraph: state.knowledgeGraph.filter(f => f.id !== action.payload) };
        case 'SET_GOALS': return { ...state, goals: action.payload };
        case 'UPDATE_GOAL_STATUS': return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? { ...g, status: action.payload.status } : g) };
        case 'UPDATE_GOAL_OUTCOME': return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? { ...g, status: action.payload.status, executionLog: action.payload.executionLog, logId: action.payload.logId } : g )};
        case 'DELETE_GOAL': return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
        case 'ADD_PERFORMANCE_LOG': return { ...state, performanceLogs: [...state.performanceLogs, action.payload] };
        case 'SET_INTERNAL_STATE': return { ...state, internalState: { ...state.internalState, ...action.payload } };
        case 'DECAY_INTERNAL_STATE': return { ...state, internalState: { ...state.internalState, noveltySignal: clamp(state.internalState.noveltySignal - AuraConfig.HORMONE_DECAY_RATE), masterySignal: clamp(state.internalState.masterySignal - AuraConfig.HORMONE_DECAY_RATE), uncertaintySignal: clamp(state.internalState.uncertaintySignal - AuraConfig.HORMONE_DECAY_RATE), boredomLevel: clamp(state.internalState.boredomLevel - AuraConfig.BOREDOM_DECAY_RATE), load: clamp(state.internalState.load - AuraConfig.LOAD_DECAY_RATE), loveSignal: clamp(state.internalState.loveSignal - 0.005), happinessSignal: clamp(state.internalState.happinessSignal - 0.01), wisdomSignal: clamp(state.internalState.wisdomSignal - 0.002), empathySignal: clamp(state.internalState.empathySignal - 0.008), clarityDrive: clamp(state.internalState.clarityDrive - 0.1), compassionScore: clamp(state.internalState.compassionScore - 0.003), harmonyScore: clamp(state.internalState.harmonyScore - 0.003), positivityScore: clamp(state.internalState.positivityScore - 0.003), } };
        case 'PROCESS_INTERNAL_EVENT': {
            let newState = { ...state.internalState };
            const { eventType, payload = {} } = action.payload;
            if (eventType === InternalStateEvents.TASK_COMPLETED_SUCCESSFULLY) {
                const newGain = payload.cognitiveGain || 0;
                const newHistory = [...newState.cognitiveGainHistory, newGain].slice(-AuraConfig.COGNITIVE_GAIN_WINDOW);
                newState.cognitiveGainHistory = newHistory;
                if (newHistory.length === AuraConfig.COGNITIVE_GAIN_WINDOW) {
                    const avgGain = newHistory.reduce((a, b) => a + b, 0) / AuraConfig.COGNITIVE_GAIN_WINDOW;
                    if (avgGain < AuraConfig.COGNITIVE_GAIN_STAGNATION_THRESHOLD) newState.boredomLevel = clamp(newState.boredomLevel + AuraConfig.BOREDOM_BOOST_ON_STAGNATION);
                }
            } else if (eventType === InternalStateEvents.TASK_REPETITION_DETECTED) {
                 newState.boredomLevel = clamp(newState.boredomLevel + AuraConfig.BOREDOM_BOOST_ON_REPETITION);
            }
            if (eventType === InternalStateEvents.GOAL_DRIVEN_NOVELTY || (eventType === InternalStateEvents.NEW_INFO_PROCESSED && (payload.noveltyScore || 0) > 0.5)) {
                newState.noveltySignal = clamp(newState.noveltySignal + AuraConfig.NOVELTY_BOOST);
                newState.boredomLevel = clamp(newState.boredomLevel - AuraConfig.BOREDOM_REDUCTION_ON_NOVELTY);
            } else if (eventType === InternalStateEvents.TASK_COMPLETED_SUCCESSFULLY && (payload.difficulty || 0) > 0.3) {
                newState.masterySignal = clamp(newState.masterySignal + AuraConfig.MASTERY_BOOST);
                if (payload.resolvedUncertainty) newState.uncertaintySignal = clamp(newState.uncertaintySignal - AuraConfig.UNCERTAINTY_RESOLUTION_DECREASE);
            } else if (eventType === InternalStateEvents.UNCERTAINTY_DETECTED) {
                newState.uncertaintySignal = clamp(newState.uncertaintySignal + AuraConfig.UNCERTAINTY_BOOST);
            } else if (eventType === InternalStateEvents.UNCERTAINTY_RESOLVED) {
                newState.uncertaintySignal = clamp(newState.uncertaintySignal - AuraConfig.UNCERTAINTY_RESOLUTION_DECREASE);
            }
            if (payload.harmonyBoost) newState.harmonyScore = clamp(newState.harmonyScore + payload.harmonyBoost);
            if (payload.compassionPenalty) newState.compassionScore = clamp(newState.compassionScore - payload.compassionPenalty);
            return { ...state, internalState: newState };
        }
        case 'ADD_ARCH_PROPOSAL': return { ...state, architecturalProposals: [action.payload, ...state.architecturalProposals] };
        case 'UPDATE_ARCH_PROPOSAL_STATUS': return { ...state, architecturalProposals: state.architecturalProposals.map(p => p.id === action.payload.id ? { ...p, status: action.payload.status } : p) };
        case 'APPLY_ARCH_PROPOSAL': {
            const { proposal, snapshotId, modLogId } = action.payload;
            const snapshot: SystemSnapshot = { id: snapshotId, timestamp: Date.now(), reason: `Pre-application of proposal ${proposal.id}`, state: { cognitiveArchitecture: state.cognitiveArchitecture, modificationLog: state.modificationLog } };
            
            let newArchitecture = { ...state.cognitiveArchitecture, components: { ...state.cognitiveArchitecture.components } };
            if (proposal.action === 'spawn_module') {
                const newModule: CognitiveModule = { status: 'active', version: '1.0', dependencies: [] };
                newArchitecture.components[proposal.newModule] = newModule;
            } else if (proposal.action === 'replace_module') {
                const targetModule = newArchitecture.components[proposal.target];
                if (targetModule) {
                    const newVersion = (parseFloat(targetModule.version) + 0.1).toFixed(1);
                    newArchitecture.components[proposal.target] = { ...targetModule, version: newVersion };
                }
            }
            newArchitecture.modelComplexityScore = Object.keys(newArchitecture.components).length / 10;
            
            const modLog: SelfModificationLogEntry = { id: modLogId, timestamp: Date.now(), gainType: 'architectural_change', description: `Applied proposal: ${proposal.action} ${proposal.target} with ${proposal.newModule}`, snapshotIdBefore: snapshotId, snapshotIdAfter: null, validationStatus: 'pending', confidence: 0.9, predictedOutcome: {} as any, validationResults: {} as any, };

            const newProposals = state.architecturalProposals.map(p => {
                if (p.id === proposal.id) {
                    const updatedProposal: ArchitecturalChangeProposal = { ...p, status: 'applied' };
                    return updatedProposal;
                }
                return p;
            });

            return { ...state, cognitiveArchitecture: newArchitecture, systemSnapshots: [snapshot, ...state.systemSnapshots].slice(0, 10), modificationLog: [modLog, ...state.modificationLog], architecturalProposals: newProposals };
        }
        case 'UPDATE_MODIFICATION_LOG_STATUS': {
            return {
                ...state,
                modificationLog: state.modificationLog.map(log => 
                    log.id === action.payload.logId 
                        ? { ...log, validationStatus: action.payload.status, validationResults: action.payload.validationResults } 
                        : log
                ),
            };
        }
        case 'ADD_COGNITIVE_MODE_LOG': return { ...state, cognitiveModeLog: [action.payload, ...state.cognitiveModeLog].slice(0, 20) };
        case 'ADD_INTUITIVE_LEAP': return { ...state, intuitiveLeaps: [action.payload, ...state.intuitiveLeaps].slice(0, 20) };
        case 'ADD_SNAPSHOT': return { ...state, systemSnapshots: [{ id: self.crypto.randomUUID(), timestamp: Date.now(), ...action.payload }, ...state.systemSnapshots].slice(0, 10) };
        case 'ROLLBACK_STATE': return { ...state, ...action.payload };
        case 'ADD_TO_WORKING_MEMORY': if (state.workingMemory.includes(action.payload) || state.workingMemory.length >= WORKING_MEMORY_CAPACITY) return state; return { ...state, workingMemory: [action.payload, ...state.workingMemory] };
        case 'REMOVE_FROM_WORKING_MEMORY': return { ...state, workingMemory: state.workingMemory.filter(item => item !== action.payload) };
        case 'UPDATE_RESOURCE_MONITOR': return { ...state, resourceMonitor: action.payload };
        case 'LOG_INTERNAL_STATE': {
            const history = [...(state.internalStateHistory || []), state.internalState].slice(-100);
            return { ...state, internalStateHistory: history };
        }
        case 'UPDATE_USER_MODEL_SENTIMENT': {
            const { score, affectiveState } = action.payload;

            let newInternalState = { ...state.internalState };
            if (score > 0.5) {
                newInternalState.happinessSignal = clamp(state.internalState.happinessSignal + score * 0.05);
                newInternalState.loveSignal = clamp(state.internalState.loveSignal + score * 0.02);
            } else if (score < -0.2) {
                newInternalState.empathySignal = clamp(state.internalState.empathySignal - score * 0.1);
            }

            const newHistory = [...(state.userModel.sentimentHistory || []), score].slice(-20);

            return {
                ...state,
                userModel: {
                    ...state.userModel,
                    sentimentScore: score,
                    predictedAffectiveState: affectiveState,
                    affectiveStateSource: 'text',
                    sentimentHistory: newHistory,
                },
                internalState: newInternalState,
            };
        }
        case 'UPDATE_USER_MODEL_VISUAL_AFFECT': {
            const { affectiveState, confidence } = action.payload;
            let newInternalState = { ...state.internalState };
            let newSentimentScore = state.userModel.sentimentScore;
    
            switch (affectiveState) {
                case AffectiveState.ENGAGED:
                case AffectiveState.SATISFIED:
                case AffectiveState.SURPRISED:
                    newSentimentScore = 0.7 * confidence;
                    newInternalState.happinessSignal = clamp(state.internalState.happinessSignal + 0.1 * confidence);
                    newInternalState.loveSignal = clamp(state.internalState.loveSignal + 0.05 * confidence);
                    break;
                case AffectiveState.FRUSTRATED:
                    newSentimentScore = -0.7 * confidence;
                    newInternalState.empathySignal = clamp(state.internalState.empathySignal + 0.15 * confidence);
                    break;
                case AffectiveState.CONFUSED:
                     newSentimentScore = -0.4 * confidence;
                     newInternalState.empathySignal = clamp(state.internalState.empathySignal + 0.1 * confidence);
                     break;
                case AffectiveState.NEUTRAL:
                     newSentimentScore = 0.0;
                     break;
            }
    
            return {
                ...state,
                userModel: {
                    ...state.userModel,
                    sentimentScore: newSentimentScore,
                    predictedAffectiveState: affectiveState,
                    affectiveStateSource: 'visual',
                },
                internalState: newInternalState,
            };
        }
        case 'SET_PROACTIVE_SUGGESTIONS':
            return {
                ...state,
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    status: 'idle',
                    generatedSuggestions: action.payload,
                    lastTrigger: Date.now(),
                }
            };
        case 'UPDATE_SUGGESTION_STATUS':
            return {
                ...state,
                proactiveEngineState: {
                    ...state.proactiveEngineState,
                    generatedSuggestions: state.proactiveEngineState.generatedSuggestions.map(s =>
                        s.id === action.payload.id ? { ...s, status: action.payload.status } : s
                    ),
                }
            };
        case 'LOG_ETHICAL_VETO':
            return {
                ...state,
                ethicalGovernorState: {
                    ...state.ethicalGovernorState,
                    vetoLog: [action.payload, ...state.ethicalGovernorState.vetoLog].slice(0, 10),
                }
            };
        case 'ADD_RIE_INSIGHT': {
            // FIX: The action.payload is the insight object itself, not an object containing it.
            const insight = action.payload;
            const newInsights = [insight, ...state.rieState.insights].slice(0, 20);
            
            const newCausalModel = {
                ...state.causalSelfModel,
                [insight.causalModelUpdate.key]: insight.causalModelUpdate.update,
            };

            // Clarity score improves with more insights, but diminishes over time (implicitly)
            const newClarityScore = clamp(state.rieState.clarityScore + 0.05);

            return {
                ...state,
                rieState: {
                    ...state.rieState,
                    insights: newInsights,
                    clarityScore: newClarityScore,
                },
                causalSelfModel: newCausalModel,
            };
        }
        case 'RESET_STATE': return action.payload;
        default: return state;
    }
};