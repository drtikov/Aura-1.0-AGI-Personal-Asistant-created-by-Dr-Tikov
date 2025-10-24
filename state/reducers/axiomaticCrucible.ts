// state/reducers/axiomaticCrucible.ts
import { AuraState, Action } from '../../types';

export const axiomaticCrucibleReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'AXIOM_GUARDIAN/LOG_INCONSISTENCY': {
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    inconsistencyLog: [args.log, ...state.axiomaticCrucibleState.inconsistencyLog || []].slice(0, 10),
                }
            };
        }

        case 'CRUCIBLE/ADD_AXIOM_FROM_PROOF': {
            const { goalDescription } = args;
            const newAxiom = {
                id: `axiom_${self.crypto.randomUUID()}`,
                axiom: goalDescription,
                source: 'Proven via ATP Coprocessor',
                status: 'accepted' as const
            };
            
            // Avoid duplicates
            if (state.axiomaticCrucibleState.axioms.some(a => a.axiom === newAxiom.axiom)) {
                return {};
            }

            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    axioms: [newAxiom, ...state.axiomaticCrucibleState.axioms]
                }
            };
        }
        case 'CRUCIBLE/START_CYCLE':
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    status: 'running',
                    log: ['Cycle initiated. Ingesting Psyche Primitives...'],
                }
            };
        
        case 'CRUCIBLE/START_GRAND_UNIFICATION_CYCLE':
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    status: 'running',
                    mode: 'grand_unification',
                    log: ['Grand Unification Cycle initiated. Engaging Perelman Persona...'],
                }
            };
        
        case 'CRUCIBLE/ADD_LOG':
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    log: [...state.axiomaticCrucibleState.log, args.message].slice(-20)
                }
            };

        case 'CRUCIBLE/PROPOSE_AXIOM': {
            const newAxiom = {
                ...args,
                id: `axiom_${self.crypto.randomUUID()}`,
                status: 'unvalidated'
            };
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    candidateAxioms: [newAxiom, ...state.axiomaticCrucibleState.candidateAxioms],
                }
            };
        }

        case 'CRUCIBLE/CYCLE_COMPLETE':
             return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    status: 'idle',
                    mode: 'normal',
                    log: [...state.axiomaticCrucibleState.log, 'Cycle complete. Awaiting next command.'],
                }
            };
        
        default:
            return {};
    }
};