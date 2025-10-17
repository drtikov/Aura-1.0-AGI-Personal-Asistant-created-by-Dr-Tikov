// components/GankyilInsightsPanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { GankyilInsight } from '../types';
import { useModal } from '../context/ModalContext';

export const GankyilInsightsPanel = React.memo(() => {
    const { gankyilInsights } = useCoreState();
    const { handleEvolveFromInsight, handleVisualizeInsight } = useAuraDispatch();
    const modal = useModal();
    const { t } = useLocalization();
    const unprocessedInsightsCount = gankyilInsights.insights.filter(i => !i.isProcessedForEvolution).length;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    const onVisualize = async (insight: GankyilInsight) => {
        const prompt = await handleVisualizeInsight(insight.insight);
        if (prompt) {
            modal.open('imageGeneration', { initialPrompt: prompt });
        }
    };

    const getSourceStyle = (source: GankyilInsight['source']): React.CSSProperties => {
        switch (source) {
            case 'psychedelic_integration':
                return {
                    background: 'rgba(255, 0, 255, 0.05)',
                    borderLeft: '3px solid var(--primary-color)'
                };
            case 'dialectic':
                return {
                    background: 'rgba(255, 193, 7, 0.05)',
                    borderLeft: '3px solid var(--accent-color)'
                };
            case 'self-reflection':
            default:
                 return {
                    background: 'rgba(125, 207, 255, 0.05)',
                    borderLeft: '3px solid var(--secondary-color)'
                };
        }
    };

    return (
        <div className="side-panel gankyil-insights-panel">
            {gankyilInsights.insights.length === 0 ? (
                <div className="kg-placeholder">{t('gankyil_placeholder')}</div>
            ) : (
                gankyilInsights.insights.map(insight => (
                    <div 
                        key={insight.id} 
                        className={`rie-insight-item ${insight.isProcessedForEvolution ? 'processed' : ''}`} 
                        style={getSourceStyle(insight.source)}
                        title={insight.isProcessedForEvolution ? t('gankyil_processedTooltip') : ''}
                    >
                        <div className="rie-insight-header">
                            <span className="mod-log-type">{t('gankyil_title')}</span>
                            <small>{timeAgo(insight.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                                "{insight.insight}"
                            </p>
                            <div className="gankyil-insight-actions">
                                <button onClick={() => onVisualize(insight)} title={t('gankyil_visualize')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});