// state/reducers/cognitiveForge.ts
import { AuraState, Action, SynthesisCandidate } from '../../types';

export const cognitiveForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'COGNITIVE_FORGE/PROPOSE_SYNTHESIS': {
            const newCandidate: SynthesisCandidate = {
                ...args,
                id: `synth_cand_${self.crypto.randomUUID()}`,
                status: 'proposed',
            };
            
            // Avoid adding duplicate proposals
            const exists = state.cognitiveForgeState.synthesisCandidates.some(
                c => c.name === newCandidate.name && JSON.stringify(c.primitiveSequence) === JSON.stringify(newCandidate.primitiveSequence)
            );
            if (exists) {
                return {};
            }

            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesisCandidates: [newCandidate, ...state.cognitiveForgeState.synthesisCandidates]
                }
            };
        }

        case 'COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS': {
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesisCandidates: state.cognitiveForgeState.synthesisCandidates.map(c =>
                        c.id === args.id ? { ...c, status: args.status } : c
                    )
                }
            };
        }

        default:
            return {};
    }
};