// state/reducers/ramanujan.ts
import { AuraState, Action, ProposedConjecture } from '../../types.ts';

export const ramanujanReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'RAMANUJAN/SET_STATE':
            return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    ...args,
                }
            };

        case 'RAMANUJAN/ADD_LOG': {
            const newLogEntry = { timestamp: Date.now(), message: args.message };
            return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    log: [newLogEntry, ...state.ramanujanEngineState.log].slice(0, 20),
                }
            };
        }

        case 'RAMANUJAN/PROPOSE_CONJECTURE': {
            const { conjectureText, sourceAnalogyId } = args;
            const newConjecture: ProposedConjecture = {
                id: `conj_${self.crypto.randomUUID()}`,
                timestamp: Date.now(),
                conjectureText,
                sourceAnalogyId,
                status: 'untested',
            };
            return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    proposedConjectures: [newConjecture, ...state.ramanujanEngineState.proposedConjectures]
                }
            };
        }

        case 'RAMANUJAN/UPDATE_CONJECTURE_STATUS': {
            const { id, status } = args;
            return {
                ramanujanEngineState: {
                    ...state.ramanujanEngineState,
                    proposedConjectures: state.ramanujanEngineState.proposedConjectures.map(c =>
                        c.id === id ? { ...c, status } : c
                    ),
                }
            };
        }

        default:
            return {};
    }
};