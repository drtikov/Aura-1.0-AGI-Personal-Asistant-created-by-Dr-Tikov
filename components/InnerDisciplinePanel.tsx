// components/InnerDisciplinePanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { usePlanningState, useLocalization } from '../context/AuraContext.tsx';

export const InnerDisciplinePanel = React.memo(() => {
    const { disciplineState: discipline } = usePlanningState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                {discipline.committedGoal ? (
                    <>
                        <div className="panel-subsection-title">{t('innerDiscipline_committedGoal')}</div> <div className="discipline-goal-item"> <span className="goal-type">{discipline.committedGoal.type.replace(/_/g, ' ')}</span> <p>{discipline.committedGoal.description}</p> <small>{t('innerDiscipline_commitmentStrength')}: {discipline.committedGoal.commitmentStrength.toFixed(2)}</small> </div>
                        <div className="state-item"> <label>{t('innerDiscipline_adherenceScore')}</label> <div className="state-bar-container"> <div className="state-bar discipline-adherence-bar" style={{ width: `${discipline.adherenceScore * 100}%` }}></div> </div> </div>
                        <div className="state-item"> <label>{t('innerDiscipline_distractionResistance')}</label> <div className="state-bar-container"> <div className="state-bar discipline-resistance-bar" style={{ width: `${discipline.distractionResistance * 100}%` }}></div> </div> </div>
                    </>
                ) : <div className="kg-placeholder">{t('innerDiscipline_placeholder')}</div>}
            </div>
        </div>
    );
});