// components/ATP_CoprocessorPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { ATPProofStep } from '../types.ts';

export const ATPCoprocessorPanel = () => {
    const { atpCoprocessorState } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const [goal, setGoal] = useState('Prove the sum of the first n odd numbers is n^2');
    const { status, currentGoal, proofLog, finalProof } = atpCoprocessorState;

    const handleInitiate = () => {
        if (goal.trim()) {
            syscall('ATP/START_ORCHESTRATION', { goal: goal.trim() });
        }
    };
    
    const handleReset = () => {
        syscall('ATP/RESET', {});
    };

    const handleViewLandscape = () => {
        syscall('EXECUTE_UI_HANDLER', { handlerName: 'open', args: ['auraOS', { initialPanel: 'proofLandscape' }] });
    };

    const isProgramRunning = status === 'orchestrating' || status === 'strategizing' || status === 'proving';

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

            <div className="awareness-item" style={{ marginTop: '1rem' }}>
                <label>{t('atp_program_status')}</label>
                <strong className={`status-${status}`} style={{textTransform: 'capitalize'}}>
                    {t(`atp_status_${status}`, { defaultValue: status })}
                    {isProgramRunning && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
            </div>

            {atpCoprocessorState.proofTreeRootId && (
                 <div className="button-grid" style={{ marginTop: '0.5rem' }}>
                    <button className="control-button" onClick={handleViewLandscape}>
                        {t('atp_view_landscape')}
                    </button>
                 </div>
            )}
            
        </div>
    );
};