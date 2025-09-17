import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const EidolonEnvironmentPanel = React.memo(() => {
    const { eidolonEngine: state } = useArchitectureState();
    const { t } = useLocalization();

    return (
        <div className="side-panel eidolon-environment-panel">
            <div className="panel-subsection-title">{t('eidolon_currentScenario')}</div>
            <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)', marginBottom: '1rem' }}>
                <p>
                   <strong>{state.environment.currentScenario}</strong>
                </p>
                <small>{t('eidolon_runningArchitecture')} v{state.eidolon.architectureVersion}</small>
            </div>
            
            <div className="panel-subsection-title">{t('eidolon_interactionLog')}</div>
            {state.interactionLog.length === 0 ? (
                <div className="kg-placeholder">{t('eidolon_noInteractions')}</div>
            ) : (
                <div className="command-log-list">
                    {state.interactionLog.slice(0, 10).map((entry, index) => (
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