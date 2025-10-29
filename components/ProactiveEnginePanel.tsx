// components/ProactiveEnginePanel.tsx
import React from 'react';
import { useEngineState, useLocalization } from '../context/AuraContext.tsx';

interface ProactiveEnginePanelProps {
    onSuggestionAction: (suggestionId: string, action: 'accepted' | 'rejected') => void;
}

export const ProactiveEnginePanel = React.memo(({ onSuggestionAction }: ProactiveEnginePanelProps) => {
    const { proactiveEngineState: state } = useEngineState();
    const { t } = useLocalization();
    return (
        <div className="side-panel proactive-panel">
            <div className="proactive-panel-content">
                <div className="panel-subsection-title">{t('proactiveEngine_title')}</div>
                {state.generatedSuggestions.filter(s => s.status === 'suggested').length === 0 ? (
                    <div className="kg-placeholder">{t('proactiveEngine_placeholder')}</div>
                ) : (
                    state.generatedSuggestions.filter(s => s.status === 'suggested').map(suggestion => (
                        <div key={suggestion.id} className="suggestion-item">
                            <p className="suggestion-text">{suggestion.text}</p>
                            <div className="suggestion-footer">
                                <span className="suggestion-confidence">{t('causalSelfModel_confidence')}: {(suggestion.confidence * 100).toFixed(0)}%</span>
                                <div className="suggestion-actions">
                                    <button onClick={() => onSuggestionAction(suggestion.id, 'rejected')} title={t('proactiveEngine_reject')}>👎</button>
                                    <button onClick={() => onSuggestionAction(suggestion.id, 'accepted')} title={t('proactiveEngine_accept')}>👍</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div className="panel-subsection-title">{t('proactiveEngine_cachedPlan')}</div>
                {state.cachedResponsePlan ? (
                    <div className="suggestion-item cached-plan">
                        <p className="suggestion-text">
                            <strong>{t('proactiveEngine_predictedTopic')}:</strong> {state.cachedResponsePlan.triggeringPrediction}
                        </p>
                        <div className="suggestion-footer">
                            <span className="suggestion-confidence">{t('proactiveEngine_statusReady')}</span>
                        </div>
                    </div>
                ) : (
                    <div className="kg-placeholder">{t('proactiveEngine_noCachedPlan')}</div>
                )}
            </div>
        </div>
    );
});