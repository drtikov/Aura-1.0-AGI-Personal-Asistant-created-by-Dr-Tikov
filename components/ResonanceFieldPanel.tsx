// components/ResonanceFieldPanel.tsx
import React, { useMemo } from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

const BiasSlider = ({ label, biasKey, value, syscall }: { label: string; biasKey: string; value: number; syscall: any }) => (
    <div className="state-item">
        <label>{label}</label>
        <div className="state-bar-container">
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={value}
                onChange={(e) => syscall('AFFECTIVE/SET_BIAS', { bias: biasKey, value: e.target.valueAsNumber })}
                style={{ width: '100%' }}
            />
        </div>
        <span>{(value * 100).toFixed(0)}%</span>
    </div>
);

export const ResonanceFieldPanel = () => {
    // FIX: Get resonanceFieldState from useCoreState
    const { resonanceFieldState, affectiveModulatorState } = useCoreState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const activeFrequencies = useMemo(() => {
        // FIX: Explicitly type parameters in callback functions to resolve 'unknown' type errors from Object.entries.
        return Object.entries(resonanceFieldState.activeFrequencies)
            .filter(([, data]: [string, { intensity: number }]) => data.intensity > 0.01)
            .sort(([, a]: [string, { intensity: number }], [, b]: [string, { intensity: number }]) => b.intensity - a.intensity);
    }, [resonanceFieldState.activeFrequencies]);

    const totalIntensity = useMemo(() => {
        // FIX: Explicitly type parameters in callback functions to resolve 'unknown' type errors.
        return activeFrequencies.reduce((sum, [, data]: [string, { intensity: number }]) => sum + data.intensity, 0);
    }, [activeFrequencies]);

    const tensegrityIndex = useMemo(() => {
        // A simple formula where the index decreases as total intensity increases.
        // Normalize based on ~5 active pings being "high load"
        return Math.max(0, 1 - (totalIntensity / 5));
    }, [totalIntensity]);

    return (
        <div className="side-panel">
            <p className="reason-text">{t('tensegrityMesh_description')}</p>
            
            <div className="main-display" style={{marginBottom: '1rem'}}>
                <div className="geniality-gauge-container">
                     <svg viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="tensegrityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--failure-color)" />
                                <stop offset="50%" stopColor="var(--primary-color)" />
                                <stop offset="100%" stopColor="var(--success-color)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="url(#tensegrityGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={(2 * Math.PI * 45) * (1 - tensegrityIndex)}
                            className="geniality-gauge-value"
                        />
                    </svg>
                    <div className="geniality-gauge-text">
                        <div className="geniality-gauge-value-num">{(tensegrityIndex * 100).toFixed(0)}</div>
                        <div className="geniality-gauge-label">{t('resonanceField_tensegrityIndex')}</div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('tensegrityMesh_tuning')}</div>
            <div className="hormone-signals" style={{ marginBottom: '1rem' }}>
                <BiasSlider label={t('tensegrityMesh_creativity')} biasKey="creativityBias" value={affectiveModulatorState.creativityBias} syscall={syscall} />
                {/* FIX: Completed the truncated BiasSlider component call with missing props. */}
                <BiasSlider label={t('tensegrityMesh_focus')} biasKey="concisenessBias" value={affectiveModulatorState.concisenessBias} syscall={syscall} />
                <BiasSlider label={t('tensegrityMesh_depth')} biasKey="analyticalDepth" value={affectiveModulatorState.analyticalDepth} syscall={syscall} />
            </div>

            <div className="panel-subsection-title">{t('resonanceField_activeFrequencies')}</div>
            {activeFrequencies.length > 0 ? (
                <div className="hormone-signals">
                    {/* FIX: Explicitly type parameters in callback functions to resolve 'unknown' type errors. */}
                    {activeFrequencies.map(([freq, data]: [string, { intensity: number }]) => (
                        <div key={freq} className="state-item">
                            <label>{freq}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${data.intensity * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('resonanceField_placeholder')}</div>
            )}
        </div>
    );
};