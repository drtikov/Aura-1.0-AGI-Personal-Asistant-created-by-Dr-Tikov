// components/ATP_CoprocessorPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { ATPProofStep } from '../types';

const MetricItem = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div className="metric-item">
        <span className="metric-label">{label}</span>
        <span className="metric-value" style={{ color: color || 'var(--text-color)' }}>{value}</span>
    </div>
);

export const ATPCoprocessorPanel = () => {
    const { atpCoprocessorState } = useArchitectureState();
    const { handleStartProof, syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const [goal, setGoal] = useState('Prove the sum of the first n odd numbers is n^2');
    const { status, currentGoal, proofLog, strategyMetrics, finalProof } = atpCoprocessorState;

    const handleProve = () => {
        if (goal.trim()) {
            handleStartProof(goal.trim());
        }
    };
    
    const handleReset = () => {
        syscall('ATP/RESET', {});
    };

    return (
        <div className="side-panel atp-coprocessor-panel">
            <p className="reason-text">{t('atp_description')}</p>
            
            <div className="image-gen-control-group">
                <label htmlFor="atp-goal">{t('atp_goal')}</label>
                <textarea
                    id="atp-goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t('atp_goal_placeholder')}
                    rows={2}
                    disabled={status === 'proving'}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleProve}
                    disabled={status === 'proving' || !goal.trim()}
                >
                    {status === 'proving' ? t('atp_proving') : t('atp_prove')}
                </button>
                 {(status === 'success' || status === 'failed') && (
                    <button className="control-button" onClick={handleReset}>
                        {t('atp_reset')}
                    </button>
                )}
            </div>

            <div className="panel-subsection-title">{t('atp_proofLog')}</div>
            <div className="command-log-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {proofLog.length === 0 ? (
                    <div className="kg-placeholder">{t('atp_log_placeholder')}</div>
                ) : (
                    proofLog.map((step, index) => (
                        <div key={index} className={`command-log-item log-type-${step.step === -1 ? 'error' : 'info'}`}>
                            <span className="log-icon">{step.step === -1 ? '❌' : `S${step.step}`}</span>
                            <span className="log-text" title={step.result}>{step.action}</span>
                        </div>
                    ))
                )}
                 {status === 'proving' && (
                     <div className="command-log-item log-type-info">
                         <span className="log-icon"><div className="spinner-small" /></span>
                         <span className="log-text">Thinking...</span>
                     </div>
                )}
            </div>

            {finalProof && status === 'success' && (
                <>
                    <div className="panel-subsection-title">{t('atp_finalProof')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--success-color)' }}>
                        <ol className="proof-steps" style={{ border: 'none', padding: 0, gap: '0.5rem' }}>
                           {finalProof.map((step: ATPProofStep) => (
                               <li key={step.step}>
                                   <span className="step-statement">{step.step}. {step.action}</span>
                                   <span className="step-justification">{step.result}</span>
                               </li>
                           ))}
                       </ol>
                    </div>
                </>
            )}

            <div className="panel-subsection-title">{t('atp_strategyMetrics')}</div>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
                {Object.entries(strategyMetrics).map(([strategy, metrics]) => (
                    <div key={strategy} className="metric-item" style={{ flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="metric-label">{strategy}</span>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            {/* FIX: Add type assertion to metrics to resolve unknown property error */}
                             <MetricItem label={t('atp_successes')} value={(metrics as any).successes} color="var(--success-color)" />
                             <MetricItem label={t('atp_failures')} value={(metrics as any).failures} color="var(--failure-color)" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};