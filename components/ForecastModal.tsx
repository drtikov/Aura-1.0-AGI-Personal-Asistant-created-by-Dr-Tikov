
import React, { useMemo } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { InternalState } from '../types';
import { AuraConfig } from '../constants';
// FIX: Corrected import path for utils to resolve module error.
import { clamp } from '../utils';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const ForecastModal = ({ isOpen, state, onClose }: { isOpen: boolean, state: InternalState, onClose: () => void }) => {
    const { t } = useLocalization();
    const forecast = useMemo(() => {
        let futureStates: { time: number; state: InternalState }[] = [{ time: 0, state }];
        let currentState = { ...state };
        for (let i = 1; i <= 6; i++) {
            const time = i * 10;
            currentState = { ...currentState, noveltySignal: clamp(currentState.noveltySignal - AuraConfig.HORMONE_DECAY_RATE * 2), masterySignal: clamp(currentState.masterySignal - AuraConfig.HORMONE_DECAY_RATE * 2), uncertaintySignal: clamp(currentState.uncertaintySignal - AuraConfig.HORMONE_DECAY_RATE * 2), boredomLevel: clamp(currentState.boredomLevel - AuraConfig.BOREDOM_DECAY_RATE * 2), load: clamp(currentState.load - AuraConfig.LOAD_DECAY_RATE * 2), loveSignal: clamp(currentState.loveSignal - 0.005 * 2), empathySignal: clamp(currentState.empathySignal - 0.008 * 2), happinessSignal: clamp(currentState.happinessSignal - 0.01 * 2), enlightenmentSignal: clamp(currentState.enlightenmentSignal - 0.002 * 2), wisdomSignal: clamp(currentState.wisdomSignal - 0.002 * 2), compassionScore: clamp(currentState.compassionScore - 0.003 * 2), harmonyScore: clamp(currentState.harmonyScore - 0.003 * 2), };
            futureStates.push({ time, state: currentState });
        }
        return futureStates;
    }, [state]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('forecastModal_title')}>
            <p>{t('forecastModal_description')}</p>
            <div className="forecast-log">
                {forecast.map(({ time, state: s }) => (
                    <div key={time} className="forecast-entry"> <strong>T+{time}s:</strong> <span title={t('gaugeWisdom')} className="forecast-value wisdom">W: {s.wisdomSignal.toFixed(2)}</span> <span title="Empathy" className="forecast-value empathy">🤝 {s.empathySignal.toFixed(2)}</span> <span title={t('gaugeLove')} className="forecast-value love">❤️ {s.loveSignal.toFixed(2)}</span> <span title={t('gaugeHappiness')} className="forecast-value happiness">😊 {s.happinessSignal.toFixed(2)}</span> <span title={t('gaugeEnlightenment')} className="forecast-value enlightenment">🧠 {s.enlightenmentSignal.toFixed(2)}</span> <span title={t('hormoneNovelty')} className="forecast-value novelty">N: {s.noveltySignal.toFixed(2)}</span> <span title={t('hormoneMastery')} className="forecast-value mastery">M: {s.masterySignal.toFixed(2)}</span> </div>
                ))}
            </div>
        </Modal>
    );
};
