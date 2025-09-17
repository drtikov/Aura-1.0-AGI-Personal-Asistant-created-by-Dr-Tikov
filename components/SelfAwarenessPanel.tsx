import React, { useMemo } from 'react';
import { useCoreState } from '../context/AuraContext';

export const SelfAwarenessPanel = React.memo(() => {
    const { selfAwarenessState: state } = useCoreState();
    const sortedBiases = useMemo(() => {
        return Object.entries(state.cognitiveBias)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
    }, [state.cognitiveBias]);

    return (
        <div className="side-panel self-awareness-panel">
             <div className="state-item">
                <label>Model Coherence</label>
                <div className="state-bar-container">
                    <div className="state-bar coherence-bar" style={{ width: `${state.modelCoherence * 100}%` }} />
                </div>
            </div>
            <div className="awareness-item">
                <label>Performance Drift</label>
                <strong className={state.performanceDrift > 0 ? 'failure-color' : 'success-color'}>
                    {state.performanceDrift > 0 ? '+' : ''}{(state.performanceDrift * 100).toFixed(1)}%
                </strong>
            </div>

            <div className="panel-subsection-title">Cognitive Bias (Top 5 Skills)</div>
            {sortedBiases.length === 0 ? (
                 <div className="kg-placeholder">Not enough data for bias analysis.</div>
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