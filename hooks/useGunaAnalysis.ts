import { useMemo } from 'react';
import { InternalState } from '../types';
import { GunaState } from '../constants';

export const useGunaAnalysis = (internalState: InternalState) => {
    const gunaReason = useMemo(() => {
        const { gunaState, noveltySignal, masterySignal, uncertaintySignal, boredomLevel, load } = internalState;

        const signals = [
            { name: 'Novelty', value: noveltySignal },
            { name: 'Mastery', value: masterySignal },
            { name: 'Uncertainty', value: uncertaintySignal },
            { name: 'Boredom', value: boredomLevel },
            { name: 'Cognitive Load', value: load },
        ].sort((a, b) => b.value - a.value);

        const dominantSignal = signals[0];
        const secondarySignal = signals[1];

        switch (gunaState) {
            case GunaState.SATTVA:
                return `Driven by high Mastery (${masterySignal.toFixed(2)}) and low Uncertainty (${uncertaintySignal.toFixed(2)}).`;
            case GunaState.RAJAS:
                return `Driven by high ${dominantSignal.name} (${dominantSignal.value.toFixed(2)}) and ${secondarySignal.name} (${secondarySignal.value.toFixed(2)}).`;
            case GunaState.TAMAS:
                return `Resulting from high Cognitive Load (${load.toFixed(2)}) or sustained Boredom (${boredomLevel.toFixed(2)}).`;
            case GunaState.DHARMA:
                return `Engaged in self-correction due to detected performance deviation.`;
            case GunaState.GUNA_TEETA:
                return `A transcendent state where all signals are in dynamic equilibrium.`;
            default:
                return 'Calculating state drivers...';
        }
    }, [internalState]);

    return gunaReason;
};
