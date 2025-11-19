// components/CognitiveGainPanel.tsx
import React, { useMemo } from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
// FIX: Corrected import path for types to resolve module error.
import { CognitiveGainLogEntry } from '../types.ts';

export const CognitiveGainPanel = React.memo(() => {
    const { cognitiveGainLog: log } = useLogsState();
    const { t } = useLocalization();
    const modal = useModal();
    const summary = useMemo(() => {
        if (log.length === 0) return { totalEvents: 0, averageGain: 0 };
        const totalGain = log.reduce((acc, curr) => acc + curr.compositeGain, 0);
        return { totalEvents: log.length, averageGain: totalGain / log.length, };
    }, [log]);
    return (
        <div className="side-panel cognitive-gain-panel">
            <div className="cognitive-gain-summary"> <div className="gain-summary-grid"> <div className="gain-summary-item"> <div className="value">{summary.totalEvents}</div> <div className="label">{t('cogGainPanel_totalEvents')}</div> </div> <div className="gain-summary-item"> <div className={`value ${summary.averageGain > 0 ? 'success' : summary.averageGain < 0 ? 'failure' : ''}`}> {summary.averageGain.toFixed(2)} </div> <div className="label">{t('cogGainPanel_avgGain')}</div> </div> </div> </div>
            <div className="gain-log-list">
                {log.length === 0 ? <div className="kg-placeholder">{t('cogGainPanel_placeholder')}</div> : log.map(entry => (
                    <div key={entry.id} className={`gain-log-item ${entry.compositeGain > 0 ? 'positive-gain' : entry.compositeGain < 0 ? 'negative-gain' : ''}`} onClick={() => modal.open('cognitiveGainDetail', { log: entry })} title={t('cogGainPanel_clickDetails')}>
                        <div className="gain-log-header"> <span className="gain-log-type">{entry.eventType}</span> <span className={`composite-gain-value ${entry.compositeGain > 0 ? 'positive' : 'negative'}`}> {entry.compositeGain > 0 ? '+' : ''}{entry.compositeGain.toFixed(2)} </span> </div>
                        <p className="gain-log-description">{entry.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});