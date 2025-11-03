// components/KernelTaskPanel.tsx
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';

export const KernelTaskPanel = React.memo(() => {
    const { kernelState } = useSystemState();
    const { t } = useLocalization();
    const { tick, taskQueue, runningTask } = kernelState;

    return (
        <div className="side-panel kernel-task-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('kernel_description')}
            </p>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginBottom: '1rem' }}>
                <div className="metric-item" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="metric-label">{t('kernel_tick')}</span>
                    <span className="metric-value">{tick}</span>
                </div>
                <div className="metric-item" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="metric-label">{t('kernel_queued')}</span>
                    <span className="metric-value">{taskQueue.length}</span>
                </div>
            </div>
            <div className="panel-subsection-title">{t('kernel_running')}</div>
            {runningTask ? (
                <div className="active-inquiry-item">
                    <div className="spinner-small"></div>
                    <span>{runningTask.type.replace(/_/g, ' ')}</span>
                </div>
            ) : (
                <div className="kg-placeholder">{t('kernel_noTask')}</div>
            )}

            <div className="panel-subsection-title">Task Queue</div>
            <div className="command-log-list">
                {taskQueue.length > 0 ? (
                    taskQueue.map(task => (
                        <div key={task.id} className="command-log-item log-type-info">
                            <span className="log-icon">⏳</span>
                            <span className="log-text">{task.type.replace(/_/g, ' ')}</span>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">Queue is empty.</div>
                )}
            </div>
        </div>
    );
});