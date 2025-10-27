// components/SocraticAssessorPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { SocraticAssessorState } from '../types.ts';

export const SocraticAssessorPanel = React.memo(() => {
    const { socraticAssessorState: state } = useCoreState();
    const { t } = useLocalization();

    const getRecommendationColor = (recommendation: string) => {
        if (recommendation.toLowerCase().includes('proceed')) return 'var(--success-color)';
        if (recommendation.toLowerCase().includes('reject')) return 'var(--failure-color)';
        return 'var(--text-muted)';
    };

    return (
        <div className="side-panel">
            <p className="reason-text">The Socratic Assessor acts as an internal "peer reviewer", analyzing the feasibility and value of novel ideas before committing resources to them. It provides a critical check on divergent creativity.</p>
            <div className="awareness-item">
                <label>Engine Status</label>
                <strong>
                    {state.status}
                    {state.status === 'assessing' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>
            
            <div className="panel-subsection-title">Assessment Log</div>
            <div className="command-log-list">
                {state.log.length === 0 ? (
                    <div className="kg-placeholder">No assessments logged yet.</div>
                ) : (
                    state.log.map(entry => (
                        <div key={entry.timestamp} className="veto-log-item" style={{ borderLeftColor: getRecommendationColor(entry.recommendation) }}>
                            <div className="veto-action" style={{ fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                                Assessment: "{entry.idea.substring(0, 50)}..."
                            </div>
                            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', marginBottom: '0.5rem' }}>
                                <div className="metric-item">
                                    <span className="metric-label">Feasibility</span>
                                    <span className="metric-value">{entry.assessment.feasibility.toFixed(2)}</span>
                                </div>
                                 <div className="metric-item">
                                    <span className="metric-label">Usefulness</span>
                                    <span className="metric-value">{entry.assessment.usefulness.toFixed(2)}</span>
                                </div>
                                <div className="metric-item">
                                    <span className="metric-label">Value</span>
                                    <span className="metric-value">{entry.assessment.value.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="veto-reason" style={{ color: getRecommendationColor(entry.recommendation) }}>
                                <strong>Recommendation:</strong> {entry.recommendation}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});