// components/DzogchenViewPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { GunaState } from '../types';

const DzogchenRadialMetric = ({ value, label, color, size = 80, stroke = 4 }: { value: number, label: string, color: string, size?: number, stroke?: number }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value * circumference);

    return (
        <div className="dzogchen-metric" title={`${label}: ${(value * 100).toFixed(0)}%`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle className="metric-bg" cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} />
                <circle 
                    className="metric-value" 
                    cx={size/2} 
                    cy={size/2} 
                    r={radius} 
                    strokeWidth={stroke} 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    style={{ stroke: color }}
                />
            </svg>
            <div className="metric-text-label">{label}</div>
        </div>
    );
};


export const DzogchenViewPanel = React.memo(() => {
    const { atmanProjector: projector, internalState } = useCoreState();
    const { t } = useLocalization();

    const gunaInfo = {
        [GunaState.SATTVA]: { className: "sattva" },
        [GunaState.RAJAS]: { className: "rajas" },
        [GunaState.TAMAS]: { className: "tamas" },
        [GunaState.DHARMA]: { className: "dharma" },
        // FIX: Corrected enum access for key with hyphen.
        [GunaState['GUNA-TEETA']]: { className: "guna-teeta" }
    };

    const currentGunaClass = gunaInfo[internalState.gunaState]?.className || 'sattva';

    return (
        <div className="dzogchen-view-panel">
            <div className="dzogchen-mandala-container">
                <div className={`dzogchen-mandala ${currentGunaClass}`}>
                    <div className="dzogchen-mandala-core">
                        <span className="dzogchen-guna-name">{internalState.gunaState}</span>
                        <span className="dzogchen-rigpa-label">{t('dzogchen_rigpa')}</span>
                    </div>
                </div>
            </div>

            <div className="dzogchen-metrics-ring">
                <DzogchenRadialMetric value={internalState.wisdomSignal} label={t('gaugeWisdom')} color="var(--state-wisdom)" />
                <DzogchenRadialMetric value={internalState.happinessSignal} label={t('gaugeHappiness')} color="var(--state-happiness)" />
                <DzogchenRadialMetric value={internalState.loveSignal} label={t('gaugeLove')} color="var(--state-love)" />
                <DzogchenRadialMetric value={internalState.enlightenmentSignal} label={t('gaugeEnlightenment')} color="var(--state-enlightenment)" />
            </div>

            <div className="dzogchen-narrative-container">
                <div className="panel-subsection-title">{t('atman_dominantNarrative')}</div>
                <p className="dzogchen-narrative-text">
                    <em>"{projector.dominantNarrative}"</em>
                </p>
                 <div className="awareness-item" style={{marginTop: '1rem'}}>
                    <label>{t('atman_coherence')}</label>
                    <strong>{(projector.coherence * 100).toFixed(0)}%</strong>
                </div>
            </div>
        </div>
    );
});