// components/AtmanProjectorPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { Gauge } from './Gauge';

export const AtmanProjectorPanel = React.memo(() => {
    const { atmanProjector: projector } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel atman-projector-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('atman_description')}
            </p>
            <div className="atman-main-display">
                <div className="atman-gauge-container">
                     <Gauge label={t('atman_coherence')} value={projector.coherence} colorClass="love" />
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
        </div>
    );
});