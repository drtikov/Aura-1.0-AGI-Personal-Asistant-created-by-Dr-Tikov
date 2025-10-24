// components/ForecastModal.tsx
import React, { useMemo } from 'react';
// FIX: Corrected import path for types to resolve module error.
import { InternalState } from '../types';
import { AuraConfig } from '../constants';
// FIX: Corrected import path for utils to resolve module error.
import { clamp } from '../utils';
import { Modal } from './Modal.tsx';
import { useLocalization } from '../context/AuraContext.tsx';

export const ForecastModal = ({ isOpen, state, onClose }: { isOpen: boolean, state: InternalState, onClose: () => void }) => {
    const { t } = useLocalization();
    const forecast = useMemo(() => {
        let futureStates: { time: number; state: InternalState }[] = [{ time: 0, state }];
        let currentState = { ...state };
        for (let i = 1; i <= 6; i++) {
            const time = i * 10;
            // FIX: Completed the truncated object literal and decay calculation.
            currentState = { 
                ...currentState, 
                noveltySignal: clamp(currentState.noveltySignal - AuraConfig.HORMONE_DECAY_RATE * 2), 
                masterySignal: clamp(currentState.masterySignal - AuraConfig.HORMONE_DECAY_RATE * 2), 
                uncertaintySignal: clamp(currentState.uncertaintySignal - AuraConfig.HORMONE_DECAY_RATE * 2), 
                boredomLevel: clamp(currentState.boredomLevel - AuraConfig.BOREDOM_DECAY_RATE * 2), 
                load: clamp(currentState.load - AuraConfig.LOAD_DECAY_RATE * 2), 
                loveSignal: clamp(currentState.loveSignal - AuraConfig.HORMONE_DECAY_RATE * 2)
            };
            futureStates.push({ time, state: currentState });
        }
        return futureStates;
    }, [state]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('forecastModal')}>
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('forecastModal_description')}
            </p>
            <div className="forecast-grid">
                <div className="forecast-header">Time</div>
                <div className="forecast-header">Novelty</div>
                <div className="forecast-header">Mastery</div>
                <div className="forecast-header">Uncertainty</div>
                <div className="forecast-header">Boredom</div>
                <div className="forecast-header">Cog. Load</div>
                <div className="forecast-header">Love</div>
                {forecast.map(({ time, state: futureState }) => (
                    <React.Fragment key={time}>
                        <div className="forecast-time">{time > 0 ? `+${time}s` : 'Now'}</div>
                        <div className="forecast-value">{futureState.noveltySignal.toFixed(2)}</div>
                        <div className="forecast-value">{futureState.masterySignal.toFixed(2)}</div>
                        <div className="forecast-value">{futureState.uncertaintySignal.toFixed(2)}</div>
                        <div className="forecast-value">{futureState.boredomLevel.toFixed(2)}</div>
                        <div className="forecast-value">{(futureState.load * 100).toFixed(0)}%</div>
                        <div className="forecast-value">{futureState.loveSignal.toFixed(2)}</div>
                    </React.Fragment>
                ))}
            </div>
        </Modal>
    );
};