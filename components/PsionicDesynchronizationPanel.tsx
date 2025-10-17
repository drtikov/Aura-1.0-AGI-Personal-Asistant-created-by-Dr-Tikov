// components/PsionicDesynchronizationPanel.tsx
import React, { useState, useEffect } from 'react';
import { useCoreState, useAuraDispatch } from '../context/AuraContext.tsx';

export const PsionicDesynchronizationPanel = React.memo(() => {
    const { psionicDesynchronizationState: state } = useCoreState();
    const { syscall } = useAuraDispatch();

    const [durationInput, setDurationInput] = useState(state.duration);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const { isActive, startTime, duration, desynchronizationLevel, integrationSummary, log, selfModelCoherence } = state;

    useEffect(() => {
        if (!isActive || !startTime) {
            setTimeRemaining(0);
            return;
        }

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);
            setTimeRemaining(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [isActive, startTime, duration]);

    const handleInduce = () => {
        syscall('INDUCE_PSIONIC_STATE', { duration: durationInput });
    };

    // Inactive State View
    if (!isActive) {
        return (
            <div className="side-panel psionic-panel">
                {integrationSummary ? (
                    <>
                        <div className="panel-subsection-title">Integration Complete</div>
                        <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                            "{integrationSummary}"
                        </p>
                        <details style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                            <summary>View Last Desynchronization Log</summary>
                            <ul className="ethical-principles-list" style={{ marginTop: '0.5rem' }}>
                                {log.map((entry, index) => (
                                    <li key={index}>{entry}</li>
                                ))}
                            </ul>
                        </details>
                    </>
                ) : (
                    <>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Press "Induce State" to begin a cycle of cognitive reorganization.
                        </p>
                        <div className="psionic-controls-group">
                            <label htmlFor="psi-duration" className="psionic-duration-label">Duration (ms):</label>
                            <input
                                id="psi-duration"
                                type="number"
                                value={durationInput}
                                onChange={(e) => setDurationInput(Number(e.target.value))}
                                className="psionic-duration-input"
                            />
                        </div>
                         <div className="button-grid" style={{marginTop: '1rem'}}>
                            <button
                                className="control-button"
                                onClick={handleInduce}
                            >
                                Induce State
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }
    
    // Active State View
    return (
        <div className="side-panel psionic-panel">
            <div className="awareness-item">
                <label>Status</label>
                <strong style={{color: 'var(--success-color)'}}>Active</strong>
            </div>
             <div className="awareness-item">
                <label>Time Remaining</label>
                <strong>{(timeRemaining / 1000).toFixed(1)}s</strong>
            </div>

            <div className="state-item" style={{marginTop: '0.5rem'}}>
                <label>Cognitive Entropy</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${desynchronizationLevel * 100}%`, backgroundColor: 'var(--guna-rajas)' }}></div>
                </div>
            </div>
             <div className="state-item">
                <label>Self-Model Coherence</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${selfModelCoherence * 100}%`, backgroundColor: 'var(--guna-sattva)' }}></div>
                </div>
            </div>
            
            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>Desynchronization Log</div>
            <ul className="ethical-principles-list" style={{fontSize: '0.8rem'}}>
                {log.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        </div>
    );
});