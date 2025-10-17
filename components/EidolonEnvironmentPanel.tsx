// components/EidolonEnvironmentPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';

export const EidolonEnvironmentPanel = React.memo(() => {
    const { eidolonEngine: state } = useArchitectureState();
    const { t } = useLocalization();
    const { eidolon, environment, interactionLog } = state;

    return (
        <div className="side-panel eidolon-environment-panel">
            <div className="panel-subsection-title">{t('eidolon_currentScenario')}</div>
            <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)', marginBottom: '1rem' }}>
                <p>
                   <strong>{environment.currentScenario}</strong>
                </p>
                <small>{t('eidolon_runningArchitecture')} v{eidolon.architectureVersion}</small>
            </div>

             <div className="panel-subsection-title">{t('eidolon_eidolonState')}</div>
             <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '0.2rem 1rem', paddingBottom: '1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">{t('eidolon_position')}</span>
                    <span className="metric-value">
                        {eidolon.position ? `(${eidolon.position.x}, ${eidolon.position.y}, ${eidolon.position.z})` : 'N/A'}
                    </span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('eidolon_lastAction')}</span>
                    <span className="metric-value">{eidolon.lastAction || 'None'}</span>
                </div>
                 <div className="metric-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="metric-label">{t('eidolon_sensoryInput')}</span>
                    <span className="metric-value">
                        {eidolon.sensoryInput ? JSON.stringify(eidolon.sensoryInput) : 'None'}
                    </span>
                </div>
            </div>
            
            <div className="panel-subsection-title">{t('eidolon_interactionLog')}</div>
            {interactionLog.length === 0 ? (
                <div className="kg-placeholder">{t('eidolon_noInteractions')}</div>
            ) : (
                <div className="command-log-list">
                    {interactionLog.slice(0, 10).map((entry, index) => (
                         <div key={index} className="command-log-item log-type-info" style={{background: 'rgba(0,0,0,0.1)'}}>
                            <span className="log-icon" title={t('eidolon_interaction')}>{'>'}</span>
                            <span className="log-text">{entry}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});