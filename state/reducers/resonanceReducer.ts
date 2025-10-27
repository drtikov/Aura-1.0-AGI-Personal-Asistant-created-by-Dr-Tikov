// state/reducers/resonanceReducer.ts
import { AuraState, Action } from '../../types.ts';

const RESONANCE_DECAY_RATE = 0.92;
const RESONANCE_PING_INTENSITY = 1.0;

export const resonanceReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') {
        return {};
    }
    const { call, args } = action.payload;

    switch (call) {
        case 'RESONANCE/PING_FREQUENCY': {
            const { frequency } = args;
            if (!frequency) return {};

            return {
                resonanceFieldState: {
                    ...state.resonanceFieldState,
                    activeFrequencies: {
                        ...state.resonanceFieldState.activeFrequencies,
                        [frequency]: {
                            intensity: RESONANCE_PING_INTENSITY,
                            lastPing: Date.now(),
                        }
                    }
                }
            };
        }
        case 'RESONANCE/DECAY_FREQUENCIES': {
            const decayedFrequencies: { [key: string]: { intensity: number; lastPing: number } } = {};
            for (const freq in state.resonanceFieldState.activeFrequencies) {
                const current = state.resonanceFieldState.activeFrequencies[freq];
                const newIntensity = current.intensity * RESONANCE_DECAY_RATE;
                if (newIntensity > 0.01) { // Pruning threshold
                    decayedFrequencies[freq] = { ...current, intensity: newIntensity };
                }
            }
            return {
                resonanceFieldState: {
                    ...state.resonanceFieldState,
                    activeFrequencies: decayedFrequencies,
                }
            };
        }
        default:
            return {};
    }
};