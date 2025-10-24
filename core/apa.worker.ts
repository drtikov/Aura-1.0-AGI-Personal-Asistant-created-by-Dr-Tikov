// core/apa.worker.ts

// The GunaState enum is copied here to avoid import issues in the worker.
enum GunaState {
    SATTVA = 'Sattva',
    RAJAS = 'Rajas',
    TAMAS = 'Tamas',
    DHARMA = 'Dharma',
    'GUNA-TEETA' = 'Guna-Teeta',
}

interface InternalState {
    gunaState: GunaState;
    noveltySignal: number;
    masterySignal: number;
    uncertaintySignal: number;
    boredomLevel: number;
    load: number;
}

self.onmessage = (event: MessageEvent<{ id: string; type: string; payload: InternalState }>) => {
    const { id, type, payload: internalState } = event.data;

    if (type === 'CALCULATE_GUNA_REASON') {
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
        
        self.postMessage({ id, type: 'GUNA_REASON_RESULT', payload: result });
    }
};
