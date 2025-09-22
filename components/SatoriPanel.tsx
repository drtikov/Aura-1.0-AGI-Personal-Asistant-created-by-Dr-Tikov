import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const SatoriPanel = React.memo(() => {
    const { satoriState } = useCoreState();
    const { t } = useLocalization();

    const renderContent = () => {
        if (satoriState.isActive) {
            return (
                <>
                    <div className="awareness-item">
                        <label>{t('satori_status')}</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <strong>{t(`satori_stage_${satoriState.stage}`)}</strong>
                            <div className="spinner-small" />
                        </div>
                    </div>
                    <div className="panel-subsection-title" style={{ marginTop: '1rem' }}>Log</div>
                    <ul className="ethical-principles-list" style={{ fontSize: '0.8rem' }}>
                        {satoriState.log.map((entry, index) => (
                            <li key={index}>{entry}</li>
                        ))}
                    </ul>
                </>
            );
        }

        if (satoriState.lastInsight) {
            return (
                <>
                    <div className="panel-subsection-title">{t('satori_lastInsight')}</div>
                    <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                        "{satoriState.lastInsight}"
                    </p>
                </>
            );
        }

        return (
            <div className="kg-placeholder">
                {t('satori_placeholder')}
            </div>
        );
    };

    return (
        <div className="side-panel satori-panel">
            {renderContent()}
        </div>
    );
});
