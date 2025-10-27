// state/reducers/atpCoprocessor.ts
import { AuraState, Action, ProofAttempt, ProofStep } from '../../types.ts';

export const atpCoprocessorReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'ATP/START_PROOF_ATTEMPT': {
            const newAttempt: ProofAttempt = {
                id: `proof_${self.crypto.randomUUID()}`,
                conjecture: args.goal,
                status: 'planning',
                plan: [],
                log: [{ timestamp: Date.now(), engine: 'Euclid', message: 'Received conjecture. Devising proof strategy...' }],
            };
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'orchestrating',
                    currentGoal: args.goal,
                    activeProofAttempt: newAttempt,
                }
            };
        }

        case 'ATP/SET_PROOF_PLAN': {
            if (!state.atpCoprocessorState.activeProofAttempt) return {};
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    activeProofAttempt: {
                        ...state.atpCoprocessorState.activeProofAttempt,
                        status: 'proving',
                        plan: args.plan, // The plan is an array of ProofStep objects
                        log: [
                            ...state.atpCoprocessorState.activeProofAttempt.log,
                            { timestamp: Date.now(), engine: 'Euclid', message: `Proof plan generated with ${args.plan.length} steps.` }
                        ],
                    }
                }
            };
        }

        case 'ATP/UPDATE_STEP_STATUS': {
            if (!state.atpCoprocessorState.activeProofAttempt) return {};
            const { stepNumber, status, justification, validationLog } = args;
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    activeProofAttempt: {
                        ...state.atpCoprocessorState.activeProofAttempt,
                        plan: state.atpCoprocessorState.activeProofAttempt.plan.map(step =>
                            step.stepNumber === stepNumber ? { ...step, status, justification, validationLog } : step
                        ),
                    }
                }
            };
        }
        
        case 'ATP/ADD_LOG_ENTRY': {
             if (!state.atpCoprocessorState.activeProofAttempt) return {};
             const newLogEntry = { timestamp: Date.now(), ...args.logEntry };
             return {
                 atpCoprocessorState: {
                     ...state.atpCoprocessorState,
                     activeProofAttempt: {
                         ...state.atpCoprocessorState.activeProofAttempt,
                         log: [...state.atpCoprocessorState.activeProofAttempt.log, newLogEntry].slice(-50),
                     }
                 }
             };
        }

        case 'ATP/CONCLUDE_ATTEMPT': {
            if (!state.atpCoprocessorState.activeProofAttempt) return {};
            const { status, finalMessage } = args; // status is 'proven' or 'failed'
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: status === 'proven' ? 'success' : 'failed',
                    activeProofAttempt: {
                        ...state.atpCoprocessorState.activeProofAttempt,
                        status: status,
                        log: [...state.atpCoprocessorState.activeProofAttempt.log, { timestamp: Date.now(), engine: 'Euclid', message: finalMessage }],
                    }
                }
            };
        }

        case 'ATP/RESET':
            return {
                atpCoprocessorState: {
                    ...state.atpCoprocessorState,
                    status: 'idle',
                    currentGoal: null,
                    activeProofAttempt: null,
                }
            };

        default:
            return {};
    }
};