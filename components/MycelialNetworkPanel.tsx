// components/MycelialNetworkPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Add MycelialModule to import from types.
import { MycelialModule } from '../types';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

// FIX: Wrapped component in React.memo to correctly handle the `key` prop when used in a list.
const ModuleCard = React.memo(({ module }: { module: MycelialModule }) => {
    const { name, description, accuracy, lastPrediction } = module;

    return (
        <div className="mycelial-module-card">
            <div className="mycelial-module-header">
                <span className="mycelial-module-name">{name}</span>
            </div>
            <p className="mycelial-module-desc">{description}</p>
            <div className="mycelial-module-metrics">
                <div className="metric-item">
                    <span className="metric-label">Accuracy</span>
                    <div className="state-bar-container" title={`${(accuracy * 100).toFixed(1)}%`}>
                        <div className="state-bar accuracy-bar" style={{ width: `${accuracy * 100}%` }}></div>
                    </div>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">Last Prediction</span>
                    <span className="metric-value">{lastPrediction.toFixed(3)}</span>
                </div>
            </div>
        </div>
    );
});

export const MycelialNetworkPanel = () => {
    const { mycelialState } = useCoreState();
    const { t } = useLocalization();
    const { modules, log } = mycelialState;

    return (
        <div className="side-panel mycelial-network-panel">
            <p className="reason-text">{t('mycelial_description')}</p>
            
            <div className="panel-subsection-title">{t('mycelial_modules')}</div>
            {Object.values(modules).map((module: MycelialModule, index) => (
                <ModuleCard key={index} module={module} />
            ))}

            <div className="panel-subsection-title">{t('mycelial_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('mycelial_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🍄</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};