// components/MotorCortexPanel.tsx
import React, { useState } from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { CognitivePrimitive } from '../types';

export const MotorCortexPanel = () => {
    const { motorCortexState } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const { status, actionQueue, executionIndex, lastError } = motorCortexState;
    
    return (
        <div className="side-panel motor-cortex-panel">
            <div className="awareness-item">
                <label>{t('motorCortex_status')}</label>
                <strong className={`status-${status}`}>{status}</strong>
            </div>

            <div className="panel-subsection-title">{t('motorCortex_actionQueue')} ({actionQueue.length})</div>
            {actionQueue.length > 0 ? (
                <div className="command-log-list">
                    {actionQueue.map((primitive: CognitivePrimitive, index: number) => (
                        <div 
                            key={index} 
                            className={`command-log-item log-type-info ${index === executionIndex && status === 'executing' ? 'active' : ''} ${index < executionIndex ? 'executed' : ''}`}
                        >
                            <span className="log-icon">{index + 1}</span>
                            <span className="log-text" title={JSON.stringify(primitive.payload, null, 2)}>{primitive.type}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder">{t('motorCortex_queueEmpty')}</div>
            )}
            {status === 'failed' && (
                <div className="failure-reason-display">
                    <strong>{t('motorCortex_executionFailed')}</strong>
                    <p>{lastError}</p>
                </div>
            )}
            {(status === 'completed' || status === 'failed') && (
                <div className="button-grid" style={{marginTop: '1rem'}}>
                    <button className="control-button" onClick={() => syscall('MOTOR_CORTEX/CLEAR_SEQUENCE', {})}>
                        {t('motorCortex_clear_button')}
                    </button>
                </div>
            )}
        </div>
    );
};