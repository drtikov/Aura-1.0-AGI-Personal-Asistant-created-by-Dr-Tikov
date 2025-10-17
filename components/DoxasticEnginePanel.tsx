// components/DoxasticEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
// FIX: Changed import from CausalHypothesis to DoxasticHypothesis to match type definitions.
import { DoxasticHypothesis } from '../types';
import { Accordion } from './Accordion';

export const DoxasticEnginePanel = () => {
    const { doxasticEngineState } = useCoreState();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { hypotheses, unverifiedHypotheses, experiments, simulationStatus, simulationLog, lastSimulationResult } = doxasticEngineState;

    const getStatusColor = (status: DoxasticHypothesis['status']) => {
        switch(status) {
            case 'validated': return 'var(--success-color)';
            case 'refuted': return 'var(--failure-color)';
            case 'testing': return 'var(--warning-color)';
            default: return 'var(--text-muted)';
        }
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 2) return `now`;
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    const renderResultValue = (label: string, value: number) => {
        const isPositive = value > 0;
        const isNegative = value < 0;
        const color = isPositive ? 'var(--success-color)' : isNegative ? 'var(--failure-color)' : 'var(--text-muted)';
        const sign = isPositive ? '+' : '';

        return (
            <div className="metric-item">
                <span className="metric-label">{label}</span>
                <span className="metric-value" style={{ color }}>{sign}{(value * 100).toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="side-panel doxastic-engine-panel">
            <Accordion title={t('doxastic_sandbox_title')} defaultOpen={false}>
                <div className="awareness-item">
                    <label>{t('doxastic_sandbox_status')}</label>
                    <strong className={`status-${simulationStatus}`}>{simulationStatus}</strong>
                </div>

                <div className="panel-subsection-title">{t('doxastic_sandbox_log')}</div>
                <div className="command-log-list">
                    {simulationLog.length === 0 ? (
                        <div className="kg-placeholder">{t('doxastic_sandbox_noLog')}</div>
                    ) : (
                        simulationLog.map(entry => (
                            <div key={entry.timestamp} className="command-log-item log-type-info">
                                <span className="log-icon">{'>'}</span>
                                <span className="log-text">{entry.message}</span>
                                <span className="log-time">{timeAgo(entry.timestamp)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="panel-subsection-title">{t('doxastic_sandbox_lastResult')}</div>
                {lastSimulationResult ? (
                    <div className="simulation-result-display">
                        <p className="reason-text" style={{ fontStyle: 'italic', marginBottom: '0.75rem' }}>
                            "{lastSimulationResult.summary}"
                        </p>
                        <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left' }}>
                            {renderResultValue(t('doxastic_sandbox_projectedGain'), lastSimulationResult.projectedCognitiveGain)}
                            {renderResultValue(t('doxastic_sandbox_projectedTrust'), lastSimulationResult.projectedTrustChange)}
                            {renderResultValue(t('doxastic_sandbox_projectedHarmony'), lastSimulationResult.projectedHarmonyChange)}
                            <div className="metric-item">
                                <span className="metric-label">{t('doxastic_sandbox_safetyCheck')}</span>
                                <span className="metric-value" style={{ color: lastSimulationResult.isSafe ? 'var(--success-color)' : 'var(--failure-color)' }}>
                                    {lastSimulationResult.isSafe ? t('doxastic_sandbox_isSafe') : t('doxastic_sandbox_isNotSafe')}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="kg-placeholder">{t('doxastic_sandbox_noResult')}</div>
                )}
            </Accordion>
            
            <Accordion title={t('doxastic_hypotheses')} defaultOpen={true}>
                 {hypotheses.length === 0 ? (
                    <div className="kg-placeholder">{t('doxastic_noHypotheses')}</div>
                ) : (
                    hypotheses.map(hypo => (
                        <div key={hypo.id} className="gde-status" style={{ borderLeftColor: getStatusColor(hypo.status) }}>
                            <p title={hypo.description}>
                                <strong>{hypo.linkKey.replace('internalState.', '').replace('event.','')}</strong>
                            </p>
                            <div className="mod-log-header" style={{ justifyContent: 'space-between' }}>
                                <small style={{ textTransform: 'capitalize' }}>Source: {hypo.source}</small>
                                <small>{t('cogArchPanel_status')}: <span style={{ color: getStatusColor(hypo.status), fontWeight: 'bold' }}>{hypo.status}</span></small>
                            </div>
                        </div>
                    ))
                )}
            </Accordion>

            <Accordion title={t('doxastic_unverified')} defaultOpen={true} hasNotifications={unverifiedHypotheses.length > 0}>
                {unverifiedHypotheses.length === 0 ? (
                    <div className="kg-placeholder">{t('doxastic_noUnverified')}</div>
                ) : (
                    unverifiedHypotheses.map(hypo => (
                        <div key={hypo.id} className="gde-status" style={{ borderLeftColor: getStatusColor(hypo.status) }}>
                            <p><em>"{hypo.description}"</em></p>
                        </div>
                    ))
                )}
            </Accordion>
            
            <Accordion title={t('doxastic_experiments')} defaultOpen={false}>
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
            </Accordion>
        </div>
    );
};