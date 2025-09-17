import React, { useMemo } from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const CognitiveShadowPanel = React.memo(() => {
    const { selfAwarenessState: state } = useCoreState();
    const { t } = useLocalization();
    const sortedBiases = useMemo(() => {
        return Object.entries(state.cognitiveBias)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    }, [state.cognitiveBias]);

    return (
        <div className="side-panel self-awareness-panel">
             <div className="state-item">
                <label>{t('selfAwareness_modelCoherence')}</label>
                <div className="state-bar-container">
                    <div className="state-bar coherence-bar" style={{ width: `${state.modelCoherence * 100}%` }} />
                </div>
            </div>
            <div className="awareness-item">
                <label>{t('selfAwareness_performanceDrift')}</label>
                <strong className={state.performanceDrift > 0 ? 'failure-color' : 'success-color'}>
                    {state.performanceDrift > 0 ? '+' : ''}{(state.performanceDrift * 100).toFixed(1)}%
                </strong>
            </div>

            <div className="panel-subsection-title">{t('selfAwareness_cognitiveBias')}</div>
            {sortedBiases.length === 0 ? (
                 <div className="kg-placeholder">{t('selfAwareness_noBias')}</div>
            ) : (
                <ul className="cognitive-bias-list">
                    {sortedBiases.map(([skill, percentage]) => (
                        <li key={skill}>
                            <span>{skill.replace(/_/g, ' ')}</span>
                            <strong>{(percentage * 100).toFixed(1)}%</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});
