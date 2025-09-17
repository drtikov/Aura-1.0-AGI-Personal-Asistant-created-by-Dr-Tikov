import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const GankyilInsightsPanel = React.memo(() => {
    const { gankyilInsights } = useCoreState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel gankyil-insights-panel">
            {gankyilInsights.insights.length === 0 ? (
                <div className="kg-placeholder">{t('gankyil_placeholder')}</div>
            ) : (
                gankyilInsights.insights.map(insight => (
                    <div key={insight.id} className="rie-insight-item" style={{ background: 'rgba(125, 207, 255, 0.05)', borderLeft: '3px solid var(--secondary-color)' }}>
                        <div className="rie-insight-header">
                            <span className="mod-log-type">{t('gankyil_title')}</span>
                            <small>{timeAgo(insight.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                                "{insight.insight}"
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});
