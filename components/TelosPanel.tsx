import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const TelosPanel = React.memo(() => {
    const { telosEngine, aspirationalEngine } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel telos-panel">
            <div className="panel-subsection-title">{t('telos_aspirationalGoals')}</div>
            {aspirationalEngine.abstractGoals.length === 0 ? (
                <div className="kg-placeholder" style={{marginBottom: '1rem'}}>{t('telos_noAspirationalGoals')}</div>
            ) : (
                aspirationalEngine.abstractGoals.map(goal => (
                     <div key={goal.id} className="rie-insight-item" style={{background: 'rgba(187, 154, 247, 0.05)', borderLeft: '3px solid var(--primary-color)'}}>
                        <div className="rie-insight-header">
                           <span className="mod-log-type">{t('telos_ambition')}</span>
                            <small>{goal.status}</small>
                        </div>
                        <div className="rie-insight-body">
                             <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                               "{goal.ambition}"
                            </p>
                        </div>
                    </div>
                ))
            )}


            <div className="panel-subsection-title">{t('telos_evolutionaryVectors')}</div>
            {telosEngine.evolutionaryVectors.length === 0 ? (
                <div className="kg-placeholder">{t('telos_noVectors')}</div>
            ) : (
                telosEngine.evolutionaryVectors.map(vector => (
                    <div key={vector.id} className="prediction-item" style={{ borderLeftColor: 'var(--guna-dharma)', marginBottom: '0.5rem' }}>
                        <div className="prediction-header">
                            <span style={{color: 'var(--guna-dharma)', textTransform: 'none'}}>{vector.source}</span>
                            <span>{t('telos_magnitude')}</span>
                        </div>
                        <div className="state-item" style={{padding: '0.25rem 0 0 0'}}>
                            <label style={{color: 'var(--text-color)', fontStyle: 'italic'}}>{vector.direction}</label>
                            <div className="state-bar-container" style={{width: '80px'}}>
                                <div 
                                    className="state-bar" 
                                    style={{ width: `${vector.magnitude * 100}%`, backgroundColor: 'var(--guna-dharma)' }}
                                    title={`${t('telos_magnitude')}: ${vector.magnitude.toFixed(2)}`}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});