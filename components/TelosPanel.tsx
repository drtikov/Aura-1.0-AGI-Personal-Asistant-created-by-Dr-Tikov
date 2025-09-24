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
                            {goal.reasoning && <p className="mod-log-description" style={{fontSize: '0.8rem'}}><strong>Reason:</strong> {goal.reasoning}</p>}
                            {telosEngine.evolutionaryVectors.filter(v => v.source === `aspirational_goal_${goal.id}`).length > 0 && (
                                <>
                                    <div className="panel-subsection-title" style={{fontSize: '0.7rem', marginTop: '0.5rem', marginBottom: '0.2rem'}}>{t('telos_linkedVectors')}</div>
                                    {telosEngine.evolutionaryVectors.filter(v => v.source === `aspirational_goal_${goal.id}`).map(vector => (
                                         <div key={vector.id} className="state-item" style={{padding: '0.25rem 0 0 0'}}>
                                            <label style={{color: 'var(--text-color)', fontStyle: 'italic', fontSize: '0.8rem'}}>{vector.direction}</label>
                                            <div className="state-bar-container" style={{width: '60px'}}>
                                                <div 
                                                    className="state-bar" 
                                                    style={{ width: `${vector.magnitude * 100}%`, backgroundColor: 'var(--guna-dharma)' }}
                                                    title={`${t('telos_magnitude')}: ${vector.magnitude.toFixed(2)}`}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
