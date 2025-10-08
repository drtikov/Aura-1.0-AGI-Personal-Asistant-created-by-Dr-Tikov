// state/reducers/axiomaticCrucible.ts
import { AuraState, Action, CandidateAxiom } from '../../types';

export const axiomaticCrucibleReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'CRUCIBLE/START_CYCLE':
            return {
                axiomaticCrucibleState: {
                    ...state.axiomaticCrucibleState,
                    status: 'running',
                    log: ['Cycle initiated. Ingesting Psyche Primitives...'],
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
            const newAxiom: CandidateAxiom = {
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
                    log: [...state.axiomaticCrucibleState.log, 'Cycle complete. Awaiting next command.'],
                }
            };
        
        default:
            return {};
    }
};