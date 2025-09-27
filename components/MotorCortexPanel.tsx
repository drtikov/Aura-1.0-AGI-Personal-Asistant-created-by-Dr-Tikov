// components/MotorCortexPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { CognitivePrimitive } from '../types';

export const MotorCortexPanel = () => {
    const { motorCortexState } = useArchitectureState();
    const { handleGenerateCognitiveSequence, dispatch } = useAuraDispatch();
    const { t } = useLocalization();

    const [directive, setDirective] = useState('');
    const { status, actionQueue, executionIndex, lastError } = motorCortexState;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (directive.trim()) {
            handleGenerateCognitiveSequence(directive.trim());
            setDirective('');
        }
    };
    
    return (
        <div className="side-panel motor-cortex-panel">
            <div className="awareness-item">
                <label>{t('motorCortex_status')}</label>
                <strong className={`status-${status}`}>{status}</strong>
            </div>
            
            <form onSubmit={handleSubmit} className="input-area" style={{padding: 0, borderTop: 'none'}}>
                <div className="input-area-content" style={{ marginTop: '0.5rem' }}>
                     <textarea
                        value={directive}
                        onChange={(e) => setDirective(e.target.value)}
                        placeholder={t('motorCortex_directive_placeholder')}
                        rows={2}
                        disabled={status === 'executing'}
                    />
                     <div className="input-controls">
                        <button type="submit" disabled={status === 'executing' || !directive.trim()}>
                            {t('motorCortex_dispatch_button')}
                        </button>
                    </div>
                </div>
            </form>

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
                    <button className="control-button" onClick={() => dispatch({ type: 'MOTOR_CORTEX/CLEAR_SEQUENCE' })}>
                        {t('motorCortex_clear_button')}
                    </button>
                </div>
            )}
        </div>
    );
};
