// components/IntuitionEnginePanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useEngineState, useLocalization } from '../context/AuraContext.tsx';

export const IntuitionEnginePanel = React.memo(() => {
    const { intuitionEngineState: state, intuitiveLeaps: leaps } = useEngineState();
    const { t } = useLocalization();
    return (
        <div className="side-panel intuition-panel">
            <div className="internal-state-content">
                <div className="state-item"> <label>{t('intuitionEngine_accuracy')}</label> <div className="state-bar-container"> <div className="state-bar accuracy-bar" style={{ width: `${state.accuracy * 100}%` }} title={`${(state.accuracy * 100).toFixed(1)}%`}></div> </div> </div>
                <div className="awareness-item"> <label title={t('intuitionEngine_validationRatioTooltip')}>{t('intuitionEngine_validationRatio')}</label> <strong>{state.totalValidated} / {state.totalAttempts}</strong> </div>
                <div className="panel-subsection-title">{t('intuitionEngine_recentLeaps')}</div>
                <div className="intuitive-leaps-list">
                    {leaps.length === 0 ? <div className="kg-placeholder">{t('intuitionEngine_placeholder')}</div> : leaps.map(leap => (
                        <div key={leap.id} className={`intuitive-leap-item status-${leap.status} type-${leap.type}`}>
                            <div className="leap-header"> <span className="leap-type">{leap.type}</span> <span className={`leap-status status-${leap.status}`}>{leap.status}</span> </div>
                            <p className="leap-hypothesis">{leap.hypothesis}</p>
                            <div className="leap-footer"> <span title={`${t('architecturePanel_reasoning')}: ${leap.reasoning}`}>{t('causalSelfModel_confidence')}: {(leap.confidence * 100).toFixed(0)}%</span> </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});