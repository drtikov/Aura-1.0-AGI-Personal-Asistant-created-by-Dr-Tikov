// components/CerebellumPanel.tsx
import React from 'react';
import { usePlanningState, useLocalization } from '../context/AuraContext.tsx';

export const CerebellumPanel = React.memo(() => {
    const { cerebellumState } = usePlanningState();
    const { t } = useLocalization();
    const { isMonitoring, activePlanId, currentStepIndex, driftLog } = cerebellumState;

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return t('timeAgoSeconds', { count: seconds });
    };

    return (
        <div className="side-panel cerebellum-panel">
            <div className="awareness-item">
                <label>{t('cerebellum_status')}</label>
                <strong style={{ color: isMonitoring ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    {isMonitoring ? t('cerebellum_monitoring') : t('cerebellum_idle')}
                </strong>
            </div>
            {isMonitoring && (
                 <div className="awareness-item">
                    <label>{t('cerebellum_activePlan')}</label>
                    <strong title={activePlanId || ''}>{(activePlanId || '').substring(0, 15)}...</strong>
                </div>
            )}
             <div className="awareness-item">
                <label>{t('cerebellum_currentStep')}</label>
                <strong>{isMonitoring ? currentStepIndex + 1 : 'N/A'}</strong>
            </div>

            <div className="panel-subsection-title">{t('cerebellum_driftLog')}</div>
            {driftLog.length === 0 ? (
                 <div className="kg-placeholder">{t('cerebellum_noDrift')}</div>
            ) : (
                driftLog.map((log, index) => (
                    <div key={index} className="veto-log-item" style={{ borderLeftColor: log.detectedDrift ? 'var(--warning-color)' : 'var(--success-color)' }}>
                        <div className="veto-action" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{t('cerebellum_step')} {log.stepIndex + 1} {t('cerebellum_check')}</strong>
                            <small>{timeAgo(log.timestamp)}</small>
                        </div>
                        <p className="veto-reason">
                            {log.detectedDrift 
                                ? `${t('cerebellum_driftDetected')}: "${log.correction}"`
                                : t('cerebellum_onTrack')}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
});