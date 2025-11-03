// components/SelfAwarenessPanel.tsx
import React, { useMemo } from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const SelfAwarenessPanel = React.memo(() => {
    const { selfAwarenessState: state } = useCoreState();
    const { t } = useLocalization();
    const sortedBiases = useMemo(() => {
        return Object.entries(state.cognitiveBias)
            .sort(([, a], [, b]) => (b as number) - (a as number))
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
                <strong className={Number(state.performanceDrift) > 0 ? 'failure-color' : 'success-color'}>
                    {Number(state.performanceDrift) > 0 ? '+' : ''}{(Number(state.performanceDrift) * 100).toFixed(1)}%
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
                            <strong>{((percentage as number) * 100).toFixed(1)}%</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});