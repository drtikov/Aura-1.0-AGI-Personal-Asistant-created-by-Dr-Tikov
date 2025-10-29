// components/ReflectiveInsightEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const ReflectiveInsightEnginePanel = React.memo(() => {
    const { rieState: state } = useCoreState();
    const { t } = useLocalization();
    return (
        <div className="side-panel rie-panel">
            <div className="internal-state-content">
                <div className="state-item">
                    <label title={t('riePanel_clarityScoreTooltip')}>{t('riePanel_clarityScore')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar accuracy-bar" style={{ width: `${state.clarityScore * 100}%` }} />
                    </div>
                </div>
                <div className="panel-subsection-title">{t('riePanel_recentInsights')}</div>
                <div className="rie-insights-list">
                    {state.insights.length === 0 ? (
                        <div className="kg-placeholder">{t('riePanel_placeholder')}</div>
                    ) : (
                        state.insights.map(insight => (
                            <div key={insight.id} className="rie-insight-item">
                                <div className="rie-insight-header">
                                    {t('riePanel_failedTask')}: <strong>"{insight.failedInput.substring(0, 50)}{insight.failedInput.length > 50 ? '...' : ''}"</strong>
                                </div>
                                <div className="rie-insight-body">
                                    <p><strong>{t('riePanel_rootCause')}:</strong> {insight.rootCause}</p>
                                    <p className="rie-insight-model-update">
                                        <strong>{t('riePanel_learned')}:</strong> "{insight.causalModelUpdate.key.replace(/_/g, ' ')}" → 
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