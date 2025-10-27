// state/reducers/cognitiveForge.ts
// FIX: Removed `SynthesisCandidate` from import as it is an obsolete type.
import { AuraState, Action, SynthesizedSkill } from '../../types.ts';

export const cognitiveForgeReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        // FIX: Removed obsolete cases for `COGNITIVE_FORGE/PROPOSE_SYNTHESIS` and `COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS`
        // as the `synthesisCandidates` feature has been deprecated in types.ts.
        
        case 'ADD_SYNTHESIZED_SKILL': {
            const newSkill: SynthesizedSkill = {
                ...args,
                policyWeight: 1.0, // Initialize with a neutral weight
            };
            return {
                cognitiveForgeState: {
                    ...state.cognitiveForgeState,
                    synthesizedSkills: [...state.cognitiveForgeState.synthesizedSkills, newSkill]
                }
            };
        }

        default:
            return {};
    }
};