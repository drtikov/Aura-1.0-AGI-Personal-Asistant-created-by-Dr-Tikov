// components/HOVAPanel.tsx
import React from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { HOVAEvolutionLogEntry } from '../types';

export const HOVAPanel = () => {
    const { hovaState } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const handleRunCycle = () => {
        syscall('HOVA/START_CYCLE', {});
    };

    const getStatusInfo = (log: HOVAEvolutionLogEntry) => {
        switch (log.status) {
            case 'success':
                const improvement = log.performanceDelta.before - log.performanceDelta.after;
                const percentChange = (improvement / log.performanceDelta.before) * 100;
                return { color: 'var(--success-color)', text: `Success (+${percentChange.toFixed(1)}%)` };
            case 'failed_incorrect':
                return { color: 'var(--failure-color)', text: 'Failed (Incorrect)' };
            case 'failed_slower':
                return { color: 'var(--warning-color)', text: 'Failed (Slower)' };
            default:
                return { color: 'var(--text-muted)', text: 'Unknown' };
        }
    };

    const { metrics, optimizationLog } = hovaState;

    return (
        <div className="side-panel hova-panel">
            <p className="reason-text">{t('hova_description')}</p>
            
            <div className="synaptic-metrics" style={{ marginBottom: '1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">{t('hova_totalOptimizations')}</span>
                    <span className="metric-value">{metrics.totalOptimizations}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('hova_avgLatencyReduction')}</span>
                    <span className="metric-value">{metrics.avgLatencyReduction > 0 ? `-${metrics.avgLatencyReduction.toFixed(2)}ms` : `${metrics.avgLatencyReduction.toFixed(2)}ms`}</span>
                </div>
            </div>

            <div className="button-grid">
                <button className="control-button" onClick={handleRunCycle}>
                    {t('hova_runCycle')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('hova_evolutionLog')}</div>
            {optimizationLog.length === 0 ? (
                <div className="kg-placeholder">{t('hova_noLogs')}</div>
            ) : (
                optimizationLog.map(log => {
                    const statusInfo = getStatusInfo(log);
                    return (
                        <div key={log.id} className="mod-log-item" style={{ borderLeft: `3px solid ${statusInfo.color}` }}>
                            <div className="mod-log-header">
                                <span className="mod-log-type">{log.target}</span>
                                <strong style={{ color: statusInfo.color }}>{statusInfo.text}</strong>
                            </div>
                            <p className="mod-log-description">
                                {t('hova_metric', { metric: log.metric })}: {log.performanceDelta.before.toFixed(2)}ms → {log.performanceDelta.after.toFixed(2)}ms
                            </p>
                        </div>
                    );
                })
            )}
        </div>
    );
};