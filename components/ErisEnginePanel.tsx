// components/ErisEnginePanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const ErisEnginePanel = () => {
    const { erisEngineState } = useCoreState();
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const { isActive, chaosLevel, perturbationMode, log } = erisEngineState;

    const handleToggle = () => {
        syscall('ERIS/SET_ACTIVE', { isActive: !isActive });
        addToast(isActive ? 'Eris Engine deactivated.' : 'Eris Engine activated. Expect the unexpected.', 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('eris_description')}</p>

            <div className="button-grid" style={{ margin: '1rem 0' }}>
                <button
                    className={`control-button ${isActive ? 'reject-button' : 'implement-button'}`}
                    onClick={handleToggle}
                    style={{
                        borderColor: isActive ? 'var(--failure-color)' : 'var(--success-color)',
                        color: isActive ? 'var(--failure-color)' : 'var(--success-color)'
                    }}
                >
                    {isActive ? 'Deactivate Eris' : 'Activate Eris'}
                </button>
            </div>
            
            <div className={`eris-controls ${!isActive ? 'disabled-group' : ''}`}>
                <div className="image-gen-control-group">
                    <label htmlFor="chaos-level">{t('eris_chaos_level')} ({(chaosLevel * 100).toFixed(0)}%)</label>
                    <input
                        id="chaos-level"
                        type="range"
                        min="0.05"
                        max="0.5"
                        step="0.05"
                        value={chaosLevel}
                        onChange={(e) => syscall('ERIS/SET_CHAOS_LEVEL', { level: parseFloat(e.target.value) })}
                        disabled={!isActive}
                    />
                </div>

                <div className="image-gen-control-group">
                    <label>{t('eris_perturbation_mode')}</label>
                    <div className="radio-button-group">
                        <label className="radio-button-label">
                            <input type="radio" name="perturb-mode" value="contextual_mutation" checked={perturbationMode === 'contextual_mutation'} onChange={() => syscall('ERIS/SET_MODE', { mode: 'contextual_mutation' })} disabled={!isActive} />
                            <span className="radio-button-custom"></span>
                            <span>Contextual Mutation</span>
                        </label>
                         <label className="radio-button-label">
                            <input type="radio" name="perturb-mode" value="persona_scramble" checked={perturbationMode === 'persona_scramble'} onChange={() => syscall('ERIS/SET_MODE', { mode: 'persona_scramble' })} disabled={!isActive} />
                            <span className="radio-button-custom"></span>
                            <span>Persona Scramble</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">Intervention Log</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">No interventions logged yet.</div>
                ) : (
                    log.map((entry, index) => (
                        <div key={index} className="command-log-item log-type-warning">
                            <span className="log-icon">🔥</span>
                            <span className="log-text">{entry}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};