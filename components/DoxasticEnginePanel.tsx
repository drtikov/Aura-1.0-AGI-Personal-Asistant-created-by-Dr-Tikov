// components/DoxasticEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { CausalHypothesis } from '../types';

export const DoxasticEnginePanel = () => {
    const { doxasticEngineState } = useCoreState();
    const { t } = useLocalization();
    const { testCausalHypothesis } = useAuraDispatch();
    const { hypotheses, experiments } = doxasticEngineState;

    const getStatusColor = (status: CausalHypothesis['status']) => {
        switch(status) {
            case 'validated': return 'var(--success-color)';
            case 'refuted': return 'var(--failure-color)';
            case 'testing': return 'var(--warning-color)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="side-panel doxastic-engine-panel">
            <div className="panel-subsection-title">{t('doxastic_hypotheses')}</div>
            {hypotheses.length === 0 ? (
                <div className="kg-placeholder">{t('doxastic_noHypotheses')}</div>
            ) : (
                hypotheses.map(hypo => (
                    <div key={hypo.id} className="gde-status" style={{ borderLeftColor: getStatusColor(hypo.status) }}>
                        <p title={hypo.description}>
                            <strong>{hypo.linkKey.replace('internalState.', '').replace('event.','')}</strong>
                        </p>
                        <div className="mod-log-header" style={{ justifyContent: 'space-between' }}>
                            <small>{t('cogArchPanel_status')}: <span style={{ color: getStatusColor(hypo.status), fontWeight: 'bold' }}>{hypo.status}</span></small>
                            {hypo.status === 'untested' && (
                                <button className="trace-button" onClick={() => testCausalHypothesis(hypo)}>Test</button>
                            )}
                        </div>
                    </div>
                ))
            )}
            
            <div className="panel-subsection-title">{t('doxastic_experiments')}</div>
            {experiments.length === 0 ? (
                <div className="kg-placeholder">{t('doxastic_noExperiments')}</div>
            ) : (
                experiments.map(exp => (
                     <div key={exp.id} className="rie-insight-item">
                         <div className="rie-insight-header">
                            <span className="mod-log-type" title={exp.hypothesisId}>{t('doxastic_experimentFor')} #{exp.hypothesisId.substring(0,4)}</span>
                            <small>{exp.method.replace('_', ' ')}</small>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic', fontSize: '0.8rem'}}>
                            {exp.description}
                        </p>
                        {exp.result && (
                            <div className="code-snippet-container" style={{ marginTop: '0.5rem' }}>
                                <pre><code>{t('doxastic_result')}: {exp.result}</code></pre>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};
