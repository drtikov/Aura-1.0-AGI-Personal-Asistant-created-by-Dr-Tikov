
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';

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


export const AffectiveModulatorPanel = React.memo(() => {
    const { affectiveModulatorState: state } = useCoreState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    return (
        <div className="side-panel affective-modulator-panel">
            <div className="panel-subsection-title" style={{ marginTop: 0 }}>{t('affectiveModulator_title')}</div>
            <p className="reason-text" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('affectiveModulator_description')}
            </p>
            <div className="hormone-signals">
                 <BiasSlider
                    label={t('affectiveModulator_creativity')}
                    biasKey="creativityBias"
                    value={state.creativityBias}
                    syscall={syscall}
                />
                 <BiasSlider
                    label={t('affectiveModulator_conciseness')}
                    biasKey="concisenessBias"
                    value={state.concisenessBias}
                    syscall={syscall}
                />
                 <BiasSlider
                    label={t('affectiveModulator_analyticalDepth')}
                    biasKey="analyticalDepth"
                    syscall={syscall}
                    value={state.analyticalDepth}
                />
            </div>
        </div>
    );
});