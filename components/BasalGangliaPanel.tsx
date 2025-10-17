// components/BasalGangliaPanel.tsx
import React from 'react';
import { usePlanningState, useLocalization } from '../context/AuraContext.tsx';
import { TacticalPlan } from '../types';

export const BasalGangliaPanel = React.memo(() => {
    const { premotorPlannerState, basalGangliaState } = usePlanningState();
    const { t } = useLocalization();
    const { lastCompetingSet } = premotorPlannerState;
    const { selectedPlanId } = basalGangliaState;

    const getStatusColor = (plan: TacticalPlan) => {
        if (plan.id === selectedPlanId) return 'var(--success-color)';
        if (lastCompetingSet.length > 0 && selectedPlanId) return 'var(--failure-color)';
        return 'var(--text-muted)';
    };

    return (
        <div className="side-panel basal-ganglia-panel">
            {lastCompetingSet.length === 0 ? (
                <div className="kg-placeholder">{t('basalGanglia_placeholder')}</div>
            ) : (
                lastCompetingSet.map(plan => (
                    <div key={plan.id} className="gde-status" style={{ borderLeftColor: getStatusColor(plan) }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{t(`planType_${plan.type}`)}</span>
                            {plan.actionValue !== undefined && (
                                <span className="mod-log-status" style={{ color: getStatusColor(plan) }}>
                                    {t('basalGanglia_actionValue')}: {plan.actionValue.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <p className="mod-log-description" style={{ fontStyle: 'italic' }}>
                            {plan.selectionReasoning || t(`planGoal_${plan.type}`)}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
});