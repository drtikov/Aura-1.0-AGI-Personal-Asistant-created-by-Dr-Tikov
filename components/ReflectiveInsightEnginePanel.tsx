import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const ReflectiveInsightEnginePanel = React.memo(() => {
    const { rieState: state } = useCoreState();
    return (
        <div className="side-panel rie-panel">
            <div className="internal-state-content">
                <div className="state-item">
                    <label title="A measure of how well Aura understands its own failures.">Clarity Score</label>
                    <div className="state-bar-container">
                        <div className="state-bar accuracy-bar" style={{ width: `${state.clarityScore * 100}%` }} />
                    </div>
                </div>
                <div className="panel-subsection-title">Recent Insights</div>
                <div className="rie-insights-list">
                    {state.insights.length === 0 ? (
                        <div className="kg-placeholder">No reflective insights generated yet. The engine analyzes failures as they occur.</div>
                    ) : (
                        state.insights.map(insight => (
                            <div key={insight.id} className="rie-insight-item">
                                <div className="rie-insight-header">
                                    Failed Task: <strong>"{insight.failedInput.substring(0, 50)}{insight.failedInput.length > 50 ? '...' : ''}"</strong>
                                </div>
                                <div className="rie-insight-body">
                                    <p><strong>Root Cause:</strong> {insight.rootCause}</p>
                                    <p className="rie-insight-model-update">
                                        <strong>Learned:</strong> "{insight.causalModelUpdate.key.replace(/_/g, ' ')}" → 
                                        <span className="rie-insight-model-update-value"> "{insight.causalModelUpdate.update.effect}"</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
});