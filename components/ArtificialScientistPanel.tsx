// components/ArtificialScientistPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { DiagnosticFinding, InternalScientistExperiment, InternalScientistHypothesis, SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate } from '../types.ts';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

export const ArtificialScientistPanel = () => {
    const { artificialScientistState } = useCoreState();
    const { t } = useLocalization();
    const { status, log, currentGoal, currentHypothesis, currentExperiment } = artificialScientistState;


    return (
        <div className="side-panel">
             <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong style={{ textTransform: 'capitalize' }}>
                    {status}
                    {status !== 'idle' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>

            {currentGoal && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentGoal')}</div>
                    <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)'}}>
                        <p><em>{currentGoal}</em></p>
                    </div>
                </>
            )}
            {currentHypothesis && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentHypothesis')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--primary-color)'}}>
                        <p><em>{currentHypothesis}</em></p>
                    </div>
                </>
            )}
            {currentExperiment && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentExperiment')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--secondary-color)'}}>
                        <p><strong>Experiment:</strong> {(currentExperiment as any).description}</p>
                    </div>
                </>
            )}

            <div className="panel-subsection-title">{t('scientist_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('scientist_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon" style={{textTransform: 'capitalize'}}>{entry.stage.substring(0,1)}</span>
                            <div className="log-text-group">
                                <span className="log-text">{entry.message}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};