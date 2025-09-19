import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const AtmanProjectorPanel = React.memo(() => {
    const { coreIdentity: identity, atmanProjector: projector } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel atman-projector-panel">
            <div className="atman-main-display">
                <div className="atman-gauge-container">
                    <svg viewBox="0 0 100 100" className="atman-gauge-svg">
                        <circle cx="50" cy="50" r="45" className="gauge-bg" />
                        <circle
                            cx="50" cy="50" r="45"
                            className="gauge-value"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={(2 * Math.PI * 45) * (1 - projector.coherence)}
                        />
                    </svg>
                    <div className="atman-gauge-text">
                        <div className="atman-gauge-value-num">{(projector.coherence * 100).toFixed(0)}%</div>
                        <div className="atman-gauge-label">{t('atman_coherence')}</div>
                    </div>
                </div>
                <div className="atman-narrative-container">
                    <div className="panel-subsection-title">{t('atman_dominantNarrative')}</div>
                    <p className="atman-narrative-text">
                        <em>"{projector.dominantNarrative}"</em>
                    </p>
                </div>
            </div>

            <div className="awareness-item">
                <label>{t('atman_activeBias')}</label>
                <strong>{projector.activeBias}</strong>
            </div>
             <div className="awareness-item">
                <label>{t('atman_growthVector')}</label>
                <strong>{projector.growthVector}</strong>
            </div>

            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('atman_coreValues')}</div>
            <ul className="ethical-principles-list">
                {identity.values.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
        </div>
    );
});