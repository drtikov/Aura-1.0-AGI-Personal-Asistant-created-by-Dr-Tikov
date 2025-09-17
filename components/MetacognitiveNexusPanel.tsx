import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';
import { SelfTuningDirective } from '../types';

const getStatusColor = (status: SelfTuningDirective['status']) => {
    switch(status) {
        case 'completed': return 'var(--success-color)';
        case 'failed':
        case 'rejected':
            return 'var(--failure-color)';
        case 'simulating':
        case 'pending_arbitration':
        case 'plan_generated':
            return 'var(--warning-color)';
        case 'proposed':
        default:
            return 'var(--text-muted)';
    }
};

export const MetacognitiveNexusPanel = React.memo(() => {
    const { metacognitiveNexus: state } = useSystemState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                 <div className="panel-subsection-title">{t('metaNexus_coreProcesses')}</div>
                 {(!state || !state.coreProcesses || state.coreProcesses.length === 0) ? (
                    <div className="kg-placeholder">{t('placeholderNoData')}</div>
                ) : (
                    state.coreProcesses.map(process => (
                        <div key={process.id} className="awareness-item">
                            <label>{process.name}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${process.activation * 100}%` }} title={`${t('metaNexus_activation')}: ${process.activation.toFixed(2)}`}></div>
                            </div>
                        </div>
                    ))
                )}
                <div className="panel-subsection-title">{t('metaNexus_selfTuningDirectives')}</div>
                 {(!state || !state.selfTuningDirectives || state.selfTuningDirectives.length === 0) ? (
                    <div className="kg-placeholder">{t('metaNexus_noDirectives')}</div>
                ) : (
                    state.selfTuningDirectives.map(d => (
                         <div key={d.id} className="gde-status" style={{ borderLeftColor: getStatusColor(d.status)}}>
                             <p title={d.reasoning}>
                                <strong>[{d.type.replace(/_/g, ' ')}]</strong> {t('metaNexus_on')} {d.targetSkill}
                             </p>
                            <small>{t('cogArchPanel_status')}: <span style={{ color: getStatusColor(d.status), fontWeight: 'bold' }}>{d.status}</span></small>
                         </div>
                    ))
                )}
            </div>
        </div>
    );
});