// components/SemanticWeaverPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

export const SemanticWeaverPanel = () => {
    const { semanticWeaverState } = useCoreState();
    const { t } = useLocalization();
    const { isTrained, accuracy, log } = semanticWeaverState;

    return (
        <div className="side-panel semantic-weaver-panel">
            <p className="reason-text">{t('semantic_weaver_description')}</p>
            
            <div className="semantic-weaver-card">
                <div className="semantic-weaver-header">
                    <span className="semantic-weaver-name">{t('semantic_weaver_model_name')}</span>
                </div>
                <p className="semantic-weaver-desc">{t('semantic_weaver_model_desc')}</p>
                <div className="semantic-weaver-metrics">
                    <div className="metric-item">
                        <span className="metric-label">{t('cogArchPanel_status')}</span>
                        <span className="metric-value">{isTrained ? t('semantic_weaver_status_trained') : t('semantic_weaver_status_untrained')}</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">{t('semantic_weaver_reconstruction_accuracy')}</span>
                         <div className="state-bar-container" title={`${(accuracy * 100).toFixed(1)}%`}>
                            <div className="state-bar accuracy-bar" style={{ width: `${accuracy * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('semantic_weaver_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('semantic_weaver_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🕸️</span>
                            <span className="log-text">{entry.message}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};