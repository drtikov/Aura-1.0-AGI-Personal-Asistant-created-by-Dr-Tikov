import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const AffectiveModulatorPanel = React.memo(() => {
    const { affectiveModulatorState: state } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel affective-modulator-panel">
            <div className="panel-subsection-title">{t('affectiveModulator_title')}</div>
            <div className="rie-insight-item" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                 <div className="rie-insight-header">
                    <span className="mod-log-type">{t('affectiveModulator_currentDirective')}</span>
                </div>
                <div className="rie-insight-body">
                    <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                       "{state.lastInstructionModifier}"
                    </p>
                </div>
                 <div className="rie-insight-header" style={{borderTop: '1px dashed var(--border-color)', marginTop: '0.5rem'}}>
                    <span className="mod-log-type">{t('architecturePanel_reasoning')}</span>
                </div>
                 <div className="rie-insight-body">
                    <p className="rie-insight-model-update" style={{color: 'var(--text-muted)'}}>
                       {state.reasoning}
                    </p>
                </div>
            </div>
        </div>
    );
});