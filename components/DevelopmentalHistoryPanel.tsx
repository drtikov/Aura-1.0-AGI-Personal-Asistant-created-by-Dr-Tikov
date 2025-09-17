import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const DevelopmentalHistoryPanel = React.memo(() => {
    const { developmentalHistory: state } = useCoreState();
    const { t } = useLocalization();
    
    const timeAgo = (timestamp: number) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return t('timeAgoHours', { count: hours });
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="side-panel developmental-history-panel">
            {state.milestones.length === 0 ? (
                <div className="kg-placeholder">{t('devHistoryPanel_placeholder')}</div>
            ) : (
                <div className="milestone-timeline">
                    {state.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="milestone-item-wrapper">
                            <div className="milestone-item">
                                <div className="milestone-header">
                                    <h5 className="milestone-title">{milestone.title}</h5>
                                    <span className="milestone-time">{timeAgo(milestone.timestamp)}</span>
                                </div>
                                <p className="milestone-description">{milestone.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

// Some basic styling for the timeline - can be enhanced in CSS
const styles = `
.milestone-timeline {
    position: relative;
    padding: 0.5rem 0;
}
.milestone-item-wrapper {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}
.milestone-item-wrapper::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0.3rem;
    bottom: -1rem;
    width: 2px;
    background-color: var(--border-color);
}
.milestone-item-wrapper:last-child::before {
    display: none;
}
.milestone-item-wrapper::after {
    content: '';
    position: absolute;
    left: calc(0.5rem - 4px);
    top: 0.3rem;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    border: 2px solid var(--background);
}
.milestone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
}
.milestone-title {
    color: var(--text-color);
    font-size: 0.9rem;
    font-weight: bold;
}
.milestone-time {
    font-size: 0.7rem;
    color: var(--text-muted);
}
.milestone-description {
    font-size: 0.8rem;
    color: var(--text-muted);
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);