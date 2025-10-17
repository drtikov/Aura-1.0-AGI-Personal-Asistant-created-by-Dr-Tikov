

import React from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useEngineState, useLocalization } from '../context/AuraContext.tsx';

export const IngenuityPanel = React.memo(() => {
    const { ingenuityState: state } = useEngineState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                <div className="awareness-item"> <label title={t('ingenuityPanel_biasTooltip')}>{t('ingenuityPanel_unconventionalBias')}</label> <strong>{state.unconventionalSolutionBias.toFixed(2)}</strong> </div>
                <div className="panel-subsection-title">{t('ingenuityPanel_complexProblems')}</div>
                {state.identifiedComplexProblems.length > 0 ? <ul>{state.identifiedComplexProblems.map((p, i) => <li key={i}>{p}</li>)}</ul> : <div className="kg-placeholder">{t('ingenuityPanel_noComplexProblems')}</div>}
                <div className="panel-subsection-title">{t('ingenuityPanel_selfSolutions')}</div>
                {state.proposedSelfSolutions.length > 0 ? state.proposedSelfSolutions.map((s, i) => ( <div key={i} className="mod-log-item"> <p className="mod-log-description" title={`${t('hormoneNovelty')}: ${s.noveltyScore.toFixed(2)}`}>{s.description}</p> </div> )) : <div className="kg-placeholder">{t('ingenuityPanel_noSelfSolutions')}</div>}
            </div>
        </div>
    );
});