import React, { useMemo } from 'react';
import { InternalState } from '../types';
import { AuraConfig } from '../constants';
import { clamp } from '../utils';
import { Modal } from './Modal';

export const ForecastModal = ({ isOpen, state, onClose }: { isOpen: boolean, state: InternalState, onClose: () => void }) => {
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
        <Modal isOpen={isOpen} onClose={onClose} title="Internal State Forecast">
            <p>Predicting state changes over the next 60 seconds based on current decay rates.</p>
            <div className="forecast-log">
                {forecast.map(({ time, state: s }) => (
                    <div key={time} className="forecast-entry"> <strong>T+{time}s:</strong> <span title="Wisdom" className="forecast-value wisdom">W: {s.wisdomSignal.toFixed(2)}</span> <span title="Empathy" className="forecast-value empathy">🤝 {s.empathySignal.toFixed(2)}</span> <span title="Love" className="forecast-value love">❤️ {s.loveSignal.toFixed(2)}</span> <span title="Happiness" className="forecast-value happiness">😊 {s.happinessSignal.toFixed(2)}</span> <span title="Enlightenment" className="forecast-value enlightenment">🧠 {s.enlightenmentSignal.toFixed(2)}</span> <span title="Novelty" className="forecast-value novelty">N: {s.noveltySignal.toFixed(2)}</span> <span title="Mastery" className="forecast-value mastery">M: {s.masterySignal.toFixed(2)}</span> </div>
                ))}
            </div>
        </Modal>
    );
};