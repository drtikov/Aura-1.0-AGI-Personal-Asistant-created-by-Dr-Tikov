// components/PremotorPlannerPanel.tsx
import React from 'react';
import { usePlanningState, useLocalization } from '../context/AuraContext.tsx';
import { TacticalPlan } from '../types';

export const PremotorPlannerPanel = React.memo(() => {
    const { premotorPlannerState } = usePlanningState();
    const { t } = useLocalization();
    const { planLog: plans } = premotorPlannerState;

    const getPlanStatus = (plan: TacticalPlan): string => {
        // Since Praxis Core is removed, plans are only logged, not actively tracked.
        // Their status is effectively always "Pending" in this view.
        return t('planStatus_pending');
    };
    
     const getStatusColor = (status: string) => {
        switch(status) {
            case t('planStatus_completed'): return 'var(--success-color)';
            case t('planStatus_failed'): return 'var(--failure-color)';
            case t('planStatus_executing'): return 'var(--warning-color)';
            case t('planStatus_pending'):
            default:
                return 'var(--text-muted)';
        }
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel premotor-planner-panel">
            {plans.length === 0 ? (
                <div className="kg-placeholder">{t('premotor_placeholder')}</div>
            ) : (
                plans.map(plan => {
                    const status = getPlanStatus(plan);
                    return (
                        <details key={plan.id} className="workflow-details">
                            <summary className="workflow-summary">
                                <div className="mod-log-header" style={{width: '100%'}}>
                                    <span className="mod-log-type" title={plan.goal}>
                                        {plan.goal}
                                    </span>
                                     <span className="mod-log-status" style={{ color: getStatusColor(status) }}>
                                        {status}
                                    </span>
                                </div>
                            </summary>
                            <div className="workflow-content">
                                {plan.sequence.map((cmd: any, index: number) => (
                                    <div key={index} className="command-log-item log-type-info" style={{background: 'rgba(0,0,0,0.1)'}}>
                                        <span className="log-icon">{index + 1}</span>
                                        <span className="log-text">{cmd.type.replace(/_/g, ' ')}</span>
                                    </div>
                                ))}
                                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    {timeAgo(plan.timestamp)}
                                </div>
                            </div>
                        </details>
                    );
                })
            )}
        </div>
    );
});