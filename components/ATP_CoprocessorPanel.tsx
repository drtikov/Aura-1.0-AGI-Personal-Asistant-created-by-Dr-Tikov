// components/ATP_CoprocessorPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { ProofAttempt, ProofStep } from '../types.ts';

// FIX: Wrapped component in React.memo to correctly handle the 'key' prop in a list.
const ProofStepDisplay = React.memo(({ step }: { step: ProofStep }) => {
    const { t } = useLocalization();
    const getStatusInfo = () => {
        switch (step.status) {
            case 'proven': return { icon: '✅', color: 'var(--success-color)' };
            case 'failed': return { icon: '❌', color: 'var(--failure-color)' };
            case 'proving': return { icon: <div className="spinner-small" />, color: 'var(--warning-color)' };
            case 'pending':
            default: return { icon: '⚪', color: 'var(--text-muted)' };
        }
    };
    const { icon, color } = getStatusInfo();

    return (
        <div className="proof-step" style={{ borderLeftColor: color }}>
            <div className="proof-step-header">
                <span style={{ color }}>{icon} Step {step.stepNumber}: {t(`atp_step_${step.status}`)}</span>
            </div>
            <p className="proof-step-statement">{step.statement}</p>
            {step.justification && <p className="proof-step-justification"><strong>Justification:</strong> {step.justification}</p>}
        </div>
    );
});

export const ATPCoprocessorPanel = () => {
    const { atpCoprocessorState } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const [goal, setGoal] = useState('Prove that for any integer n, if n^2 is even, then n is even.');
    const { status, currentGoal, activeProofAttempt } = atpCoprocessorState;

    const handleInitiate = () => {
        if (goal.trim()) {
            syscall('ATP/START_PROOF_ATTEMPT', { goal: goal.trim() });
        }
    };
    
    const handleReset = () => {
        syscall('ATP/RESET', {});
    };

    const isProgramRunning = status === 'orchestrating' || activeProofAttempt?.status === 'planning' || activeProofAttempt?.status === 'proving';

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
                    disabled={isProgramRunning}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleInitiate}
                    disabled={isProgramRunning || !goal.trim()}
                >
                    {isProgramRunning ? t('atp_proving') : t('atp_initiate_program')}
                </button>
                 {(status !== 'idle') && (
                    <button className="control-button" onClick={handleReset}>
                        {t('atp_reset')}
                    </button>
                )}
            </div>
            
            {activeProofAttempt && (
                <div className="proof-attempt-container">
                    <div className="panel-subsection-title">{t('atp_attempt_status')}</div>
                    <div className="awareness-item">
                        <label>Conjecture</label>
                        <strong title={activeProofAttempt.conjecture}>{activeProofAttempt.conjecture.substring(0, 30)}...</strong>
                    </div>
                     <div className="awareness-item">
                        <label>Status</label>
                        <strong className={`status-${activeProofAttempt.status}`} style={{textTransform: 'capitalize'}}>
                            {t(`atp_status_${activeProofAttempt.status}`, { defaultValue: activeProofAttempt.status })}
                            {(activeProofAttempt.status === 'planning' || activeProofAttempt.status === 'proving') && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                        </strong>
                    </div>

                    <div className="panel-subsection-title">{t('atp_proof_plan')}</div>
                    <div className="proof-plan-list">
                        {activeProofAttempt.plan.length > 0 ? (
                            activeProofAttempt.plan.map(step => <ProofStepDisplay key={step.stepNumber} step={step} />)
                        ) : (
                            <div className="kg-placeholder">Awaiting proof plan from Euclid Engine...</div>
                        )}
                    </div>

                    <div className="panel-subsection-title">{t('atp_triumvirate_log')}</div>
                    <div className="command-log-list">
                        {activeProofAttempt.log.map(entry => (
                            <div key={entry.timestamp} className="command-log-item log-type-info">
                                <span className="log-icon">{entry.engine.charAt(0)}</span>
                                <span className="log-text">{entry.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};