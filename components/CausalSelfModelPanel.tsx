// components/CausalSelfModelPanel.tsx
import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { CausalLink } from '../types.ts';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const CausalSelfModelPanel = React.memo(() => {
    const { causalSelfModel: model } = useCoreState();
    const { t } = useLocalization();

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    return (
        <div className="side-panel causal-model-panel">
            <div className="causal-model-content">
                {Object.values(model).length > 0
                    ? Object.entries(model).map(([causeKey, link]) => {
                        const typedLink = link as CausalLink;
                        return (
                        <div key={typedLink.id} className={`causal-link source-${typedLink.source}`}>
                            <div className="causal-link-header">
                                <span className="causal-cause" title={causeKey}>{causeKey.replace(/_/g, ' ')}</span>
                                <span className="causal-confidence" title={`${t('causalSelfModel_confidence')}: ${typedLink.confidence.toFixed(2)}`}>
                                    ({(typedLink.confidence * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="causal-effect">
                                <span className="causal-effect-arrow">→</span>
                                {typedLink.effect}
                            </div>
                            <div className="causal-link-footer">
                                {t('causalSelfModel_learnedVia', { source: typedLink.source.toUpperCase() })} ({timeAgo(typedLink.lastUpdated)})
                            </div>
                        </div>
                    )})
                    : <div className="kg-placeholder">{t('causalSelfModel_placeholder')}</div>
                }
            </div>
        </div>
    );
});