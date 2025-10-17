// components/HumorAndIronyPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const HumorAndIronyPanel = React.memo(() => {
    const { humorAndIronyState: state } = useCoreState();
    const { t } = useLocalization();

    const getAppraisalColor = (appraisal: string) => {
        switch(appraisal) {
            case 'appropriate': return 'var(--success-color)';
            case 'inappropriate': return 'var(--failure-color)';
            case 'risky': return 'var(--warning-color)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="side-panel humor-irony-panel">
            <div className="panel-subsection-title">{t('humor_affectiveModulator')}</div>
            <div className="gde-status" style={{ borderLeftColor: getAppraisalColor(state.affectiveSocialModulator.humorAppraisal), marginBottom: '1rem' }}>
                <div className="mod-log-header">
                    <span className="mod-log-type">{t('humor_appraisal')}</span>
                    <span className="mod-log-status" style={{ color: getAppraisalColor(state.affectiveSocialModulator.humorAppraisal) }}>
                        {state.affectiveSocialModulator.humorAppraisal}
                    </span>
                </div>
                <p className="mod-log-description" style={{fontStyle: 'italic', fontSize: '0.8rem'}}>
                    {t('architecturePanel_reasoning')}: {state.affectiveSocialModulator.reasoning}
                </p>
            </div>
            
            <div className="panel-subsection-title">{t('humor_incongruityDetection')}</div>
            {state.schemaExpectationEngine.lastIncongruity ? (
                <div className="rie-insight-item" style={{background: 'rgba(0,0,0,0.1)'}}>
                    <p><strong>{t('humor_expected')}:</strong> "{state.schemaExpectationEngine.lastIncongruity.expected}"</p>
                    <p><strong>{t('humor_actual')}:</strong> "{state.schemaExpectationEngine.lastIncongruity.actual}"</p>
                    <div className="state-item" style={{paddingTop: '0.5rem'}}>
                        <label>{t('humor_magnitude')}</label>
                        <div className="state-bar-container">
                            <div className="state-bar" style={{ width: `${state.schemaExpectationEngine.lastIncongruity.magnitude * 100}%`, backgroundColor: 'var(--accent-color)' }}></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="kg-placeholder">{t('humor_noIncongruity')}</div>
            )}

            <div className="panel-subsection-title">{t('humor_semanticDissonance')}</div>
             <div className="state-item">
                <label>{t('humor_ironyScore')}</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${state.semanticDissonance.lastScore * 100}%`, backgroundColor: 'var(--secondary-color)' }}></div>
                </div>
            </div>
            {state.semanticDissonance.lastDetection && (
                 <div className="dissonance-details" style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                    <p><strong>{t('humor_lastDetection')}:</strong> "{state.semanticDissonance.lastDetection.text}"</p>
                    <p>
                        {t('humor_literal')}: <span style={{color: 'var(--success-color)'}}>{state.semanticDissonance.lastDetection.literalSentiment.toFixed(2)}</span> vs. 
                        {t('humor_contextual')}: <span style={{color: 'var(--failure-color)'}}>{state.semanticDissonance.lastDetection.contextualSentiment.toFixed(2)}</span>
                    </p>
                </div>
            )}
        </div>
    );
});