// components/SubsumptionLogPanel.tsx
import React from 'react';
import { useLogsState, useLocalization } from '../context/AuraContext.tsx';

export const SubsumptionLogPanel = React.memo(() => {
    const { subsumptionLogState } = useLogsState();
    const { t } = useLocalization();
    const { log } = subsumptionLogState;

    return (
        <div className="side-panel">
            <div className="kg-placeholder">{t('subsumptionLog_placeholder')}</div>
        </div>
    );
});