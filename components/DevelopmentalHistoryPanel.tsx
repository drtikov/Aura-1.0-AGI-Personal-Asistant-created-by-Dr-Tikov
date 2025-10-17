// components/DevelopmentalHistoryPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

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