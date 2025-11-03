// components/ChroniclePanel.tsx
import React from 'react';
import { useMemoryState, useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { Summary } from '../types.ts';

export const ChroniclePanel = React.memo(() => {
    const { chronicleState } = useMemoryState();
    const { t } = useLocalization();

    const sortedDailySummaries = Object.entries(chronicleState.dailySummaries)
        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());

    return (
        <div className="side-panel">
            <div className="panel-subsection-title">{t('chronicle_globalSummary')}</div>
            {chronicleState.globalSummary ? (
                <p className="reason-text" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                    {chronicleState.globalSummary.summary}
                </p>
            ) : (
                <div className="kg-placeholder" style={{ marginBottom: '1rem' }}>
                    {t('chronicle_noGlobalSummary')}
                </div>
            )}

            <div className="panel-subsection-title">{t('chronicle_dailySummaries')}</div>
            {sortedDailySummaries.length === 0 ? (
                <div className="kg-placeholder">
                    {t('chronicle_noDailySummaries')}
                </div>
            ) : (
                sortedDailySummaries.map(([date, summary]: [string, Summary]) => (
                    <Accordion key={date} title={date}>
                        {/* FIX: Cast summary to Summary type to access its properties. */}
                        <p className="reason-text" style={{ fontSize: '0.8rem' }}>
                            {summary.summary}
                        </p>
                    </Accordion>
                ))
            )}
        </div>
    );
};