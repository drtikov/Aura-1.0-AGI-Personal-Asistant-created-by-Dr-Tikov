// components/SelfAdaptationPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const SelfAdaptationPanel = () => {
    const { selfAdaptationState } = useCoreState();
    const { t } = useLocalization();
    const { expertVectors, activeAdaptation } = selfAdaptationState;

    return (
        <div className="side-panel self-adaptation-panel">
            <div className="panel-subsection-title">{t('selfAdaptation_expertVectors')}</div>
            <div className="expert-vectors-list">
                {expertVectors.map(vector => (
                    <div key={vector.id} className="mod-log-item">
                        <div className="mod-log-header">
                            <span className="mod-log-type">{vector.name}</span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>{vector.description}</p>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('selfAdaptation_activeAdaptation')}</div>
            {activeAdaptation ? (
                <div className="active-adaptation-display">
                    <p className="reasoning-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <strong>{t('selfAdaptation_reasoning')}:</strong> "{activeAdaptation.reasoning}"
                    </p>
                    <div className="panel-subsection-title">{t('selfAdaptation_weights')}</div>
                    {Object.entries(activeAdaptation.weights).map(([name, value]: [string, number]) => (
                        <div key={name} className="state-item">
                            <label>{name}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ 
                                        width: `${value * 100}%`,
                                        backgroundColor: 'var(--primary-color)' 
                                    }}
                                ></div>
                            </div>
                            <span>{(value * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('selfAdaptation_noActive')}</div>
            )}
        </div>
    );
};