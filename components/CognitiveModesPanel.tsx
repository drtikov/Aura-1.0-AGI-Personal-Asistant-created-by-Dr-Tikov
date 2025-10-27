// components/CognitiveModesPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext';

export const CognitiveModesPanel = React.memo(() => {
    const { cognitiveModeLog: log } = useLogsState();
    const { t } = useLocalization();
    return (
        <div className="side-panel cognitive-modes-panel">
            <div className="cognitive-modes-content">
                {log.length === 0 ? <div className="kg-placeholder">{t('cogModesPanel_placeholder')}</div> : log.map(entry => (
                    <div key={entry.id} className={`cognitive-log-item mode-${entry.mode.toLowerCase()}`}>
                        <div className="cognitive-log-header"> <span className="cognitive-log-mode">{entry.mode}</span> <span className="cognitive-log-metric">{entry.metric.name}: {entry.metric.value.toFixed(2)}</span> </div>
                        <p className="cognitive-log-outcome">{entry.outcome}</p>
                        <div className="cognitive-log-footer"> <span className="cognitive-log-trigger">{t('cogModesPanel_trigger')}: {entry.trigger.replace(/_/g, ' ')}</span> <span className={`cognitive-log-gain ${entry.gainAchieved ? 'success' : ''}`}>{entry.gainAchieved ? t('cogModesPanel_gainAchieved') : t('cogModesPanel_noGain')}</span> </div>
                    </div>
                ))}
            </div>
        </div>
    );
});