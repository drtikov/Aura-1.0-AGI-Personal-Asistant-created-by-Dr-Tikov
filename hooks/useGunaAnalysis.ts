// hooks/useGunaAnalysis.ts
import { useState, useEffect } from 'react';
import { InternalState, GunaState } from '../types.ts';
import { useLocalization } from '../context/AuraContext.tsx';

// The logic from the former APA worker is now integrated directly into this hook.
const calculateGunaReasonSync = (internalState: InternalState): { key: string; options?: any } => {
    const { gunaState, noveltySignal, masterySignal, uncertaintySignal, boredomLevel, load } = internalState;

    const signals = [
        { name: 'Novelty', value: noveltySignal },
        { name: 'Mastery', value: masterySignal },
        { name: 'Uncertainty', value: uncertaintySignal },
        { name: 'Boredom', value: boredomLevel },
        { name: 'Cognitive Load', value: load },
    ].sort((a, b) => b.value - a.value);

    const dominantSignal = signals[0] || { name: 'N/A', value: 0 };
    const secondarySignal = signals[1] || { name: 'N/A', value: 0 };

    let result: { key: string; options?: any };

    switch (gunaState) {
        case GunaState.SATTVA:
            result = { key: 'gunaReasonSattva', options: { mastery: masterySignal.toFixed(2), uncertainty: uncertaintySignal.toFixed(2) } };
            break;
        case GunaState.RAJAS:
            result = { key: 'gunaReasonRajas', options: { dominantSignal: dominantSignal.name, dominantValue: dominantSignal.value.toFixed(2), secondarySignal: secondarySignal.name, secondaryValue: secondarySignal.value.toFixed(2) } };
            break;
        case GunaState.TAMAS:
            result = { key: 'gunaReasonTamas', options: { load: load.toFixed(2), boredom: boredomLevel.toFixed(2) } };
            break;
        case GunaState.DHARMA:
            result = { key: 'gunaReasonDharma' };
            break;
        case GunaState['GUNA-TEETA']:
            result = { key: 'gunaReasonGunaTeeta' };
            break;
        default:
            result = { key: 'gunaReasonCalculating' };
    }
    return result;
};


export const useGunaAnalysis = (internalState: InternalState, t: (key: string, options?: any) => string): string => {
    const [gunaReason, setGunaReason] = useState(t('gunaReasonCalculating'));

    useEffect(() => {
        // The calculation is now performed synchronously on the main thread inside useEffect.
        // This is acceptable as the calculation is lightweight and non-blocking.
        const result = calculateGunaReasonSync(internalState);
        if (result) {
            setGunaReason(t(result.key, result.options));
        }
    }, [internalState, t]);

    return gunaReason;
};