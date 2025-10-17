import { useMemo } from 'react';
import { InternalState } from '../types';
import { GunaState } from '../types';

export const useGunaAnalysis = (internalState: InternalState, t: (key: string, options?: any) => string) => {
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
                return t('gunaReasonSattva', { mastery: masterySignal.toFixed(2), uncertainty: uncertaintySignal.toFixed(2) });
            case GunaState.RAJAS:
                return t('gunaReasonRajas', { dominantSignal: dominantSignal.name, dominantValue: dominantSignal.value.toFixed(2), secondarySignal: secondarySignal.name, secondaryValue: secondarySignal.value.toFixed(2) });
            case GunaState.TAMAS:
                return t('gunaReasonTamas', { load: load.toFixed(2), boredom: boredomLevel.toFixed(2) });
            case GunaState.DHARMA:
                return t('gunaReasonDharma');
            // FIX: Changed GunaState.GUNA_TEETA to GunaState['GUNA-TEETA'] to correctly access the enum member with a hyphen.
            case GunaState['GUNA-TEETA']:
                return t('gunaReasonGunaTeeta');
            default:
                return t('gunaReasonCalculating');
        }
    }, [internalState, t]);

    return gunaReason;
};
