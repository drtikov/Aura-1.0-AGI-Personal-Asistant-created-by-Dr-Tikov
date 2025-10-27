// state/reducers/axiomaticGenesisForge.ts
import { AuraState, Action, Axiom } from '../../types.ts';

export const axiomaticGenesisForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'FORGE/LOAD_BASE_SYSTEM': {
            const { systemId, axioms } = args;
            return {
                axiomaticGenesisForgeState: {
                    ...state.axiomaticGenesisForgeState,
                    status: 'idle',
                    baseSystemId: systemId,
                    currentSystem: {
                        axioms: axioms.map((axiom: any) => ({ ...axiom, status: 'base' }))
                    },
                    mutationLog: [],
                    surveyorResults: { emergentTheorems: [], undecidableStatements: [] },
                }
            };
        }
        case 'FORGE/APPLY_MUTATION': {
            const { axiomId, mutationType, newAxiom } = args;
            let newAxioms = [...state.axiomaticGenesisForgeState.currentSystem.axioms];
            let newLog = [...state.axiomaticGenesisForgeState.mutationLog];

            if (mutationType === 'add' && newAxiom) {
                newAxioms.push({ ...newAxiom, status: 'added' });
                newLog.push(`Added: ${newAxiom.axiom}`);
            } else {
                newAxioms = newAxioms.map((axiom: Axiom) => {
                    if (axiom.id === axiomId) {
                        newLog.push(`${mutationType.charAt(0).toUpperCase() + mutationType.slice(1)}: ${axiom.text}`);
                        return { ...axiom, status: mutationType };
                    }
                    return axiom;
                });
            }
            
            return {
                axiomaticGenesisForgeState: {
                    ...state.axiomaticGenesisForgeState,
                    status: 'surveying', // Trigger the autonomous process to check this new system
                    currentSystem: {
                        axioms: newAxioms,
                    },
                    mutationLog: newLog,
                }
            };
        }
        case 'FORGE/SET_SURVEYOR_RESULTS': {
            const { status, results } = args;
            return {
                 axiomaticGenesisForgeState: {
                    ...state.axiomaticGenesisForgeState,
                    status: status, // 'idle' or 'inconsistent'
                    surveyorResults: results,
                }
            }
        }
        case 'FORGE/UPDATE_LANGLANDS_CANDIDATES': {
            return {
                 axiomaticGenesisForgeState: {
                    ...state.axiomaticGenesisForgeState,
                    langlandsCandidates: args.candidates,
                }
            }
        }
        default:
            return {};
    }
};