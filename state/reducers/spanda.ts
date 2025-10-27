// state/reducers/spanda.ts
import { AuraState, Action } from '../../types.ts';
import { clamp } from '../../utils.ts';

export const spandaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call } = action.payload;

    switch (call) {
        // This is triggered periodically by the autonomous system hook
        case 'SPANDA/UPDATE_MANIFOLD_POSITION': {
            const {
                wisdomSignal, happinessSignal, loveSignal, enlightenmentSignal,
                noveltySignal, masterySignal, uncertaintySignal, boredomLevel, load,
                harmonyScore
            } = state.internalState;

            // Project high-dimensional state to a 2D manifold point.
            // X-axis: Order vs. Chaos (Wisdom/Harmony vs. Uncertainty/Load)
            // Y-axis: Exploration vs. Exploitation (Novelty/Love vs. Mastery/Boredom)
            const x = (wisdomSignal + harmonyScore) - (uncertaintySignal + load);
            const y = (noveltySignal + loveSignal) - (masterySignal + boredomLevel);
            
            // Normalize to a range of roughly -1 to 1 and scale for the [-100, 100] viewbox
            const newPoint = {
                x: clamp(x * 50, -95, 95),
                y: clamp(y * -50, -95, 95) // Invert Y for standard screen coordinates
            };

            const newTrajectory = [...state.spandaState.trajectory, newPoint].slice(-50);
            
            let currentRegion = 'The Void';
            if (newPoint.x > 20 && newPoint.y < -20) currentRegion = 'Sattvic Flow';
            else if (newPoint.x < -20 && newPoint.y > 20) currentRegion = 'Tamasic Basin';
            else if (newPoint.y < -20) currentRegion = 'Rajasic Ascent';
            else if (newPoint.y > 20) currentRegion = 'Lethargic Drift';
            else if (newPoint.x > 20) currentRegion = 'Harmonious Equilibrium';
            else if (newPoint.x < -20) currentRegion = 'Cognitive Dissonance';
            else currentRegion = 'The Neutral Zone';


            return {
                spandaState: {
                    ...state.spandaState,
                    point: newPoint,
                    trajectory: newTrajectory,
                    currentRegion,
                }
            };
        }

        default:
            return {};
    }
};