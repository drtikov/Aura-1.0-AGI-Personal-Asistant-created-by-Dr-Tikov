// components/MotivationPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const MotivationPanel = React.memo(() => {
    const { userModel } = useCoreState();
    const { t } = useLocalization();

    const { perceivedCompetence, taskSuccessHistory } = userModel;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 2) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    };

    return (
        <div className="side-panel motivation-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                This panel shows metrics from the Symbiotic Motivation Engine, which tracks your perceived competence and offers help when needed.
            </p>

            <div className="state-item">
                <label title="A score from 0 to 1 representing Aura's model of your current confidence and success rate.">Perceived Competence</label>
                <div className="state-bar-container">
                    <div 
                        className="state-bar" 
                        style={{ 
                            width: `${perceivedCompetence * 100}%`,
                            backgroundColor: 'var(--state-mastery)'
                        }} 
                    />
                </div>
                <span>{(perceivedCompetence * 100).toFixed(0)}%</span>
            </div>

            <div className="panel-subsection-title">Recent Task History</div>
            <div className="command-log-list">
                {taskSuccessHistory.length === 0 ? (
                    <div className="kg-placeholder">No tasks with feedback recorded yet.</div>
                ) : (
                    taskSuccessHistory.map((item, index) => (
                         <div key={index} className={`command-log-item log-type-${item.success ? 'success' : 'error'}`}>
                            <span className="log-icon">{item.success ? '✓' : '✗'}</span>
                            <span className="log-text">{item.success ? 'Task Succeeded' : 'Task Failed'}</span>
                            <span className="log-time">{timeAgo(item.timestamp)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});