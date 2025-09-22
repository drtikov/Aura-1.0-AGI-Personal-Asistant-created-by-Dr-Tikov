// components/SelfProgrammingPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { SelfProgrammingCandidate } from '../types';

export const SelfProgrammingPanel = () => {
    const { selfProgrammingState } = useArchitectureState();
    const { t } = useLocalization();
    const { runSelfProgrammingCycle, dispatch } = useAuraDispatch();
    const { isActive, statusMessage, candidates, cycleCount, log } = selfProgrammingState;

    const handleImplement = (candidateId: string) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate) {
            const logMessage = `Cycle ${cycleCount}: Implemented candidate with score ${candidate.evaluationScore?.toFixed(2)}. Reasoning: ${candidate.reasoning}`;
            dispatch({ type: 'CONCLUDE_SELF_PROGRAMMING_CYCLE', payload: { implementedCandidateId: candidateId, logMessage } });
        }
    };
    
    return (
        <div className="side-panel self-programming-panel">
            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button
                    className="control-button"
                    onClick={runSelfProgrammingCycle}
                    disabled={isActive}
                >
                    {isActive ? "Cycle in Progress..." : "Initiate Reprogramming Cycle"}
                </button>
            </div>

            <div className="awareness-item">
                <label>Current Status</label>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isActive && <div className="spinner-small" />}
                    {statusMessage}
                </strong>
            </div>

            <div className="panel-subsection-title">Modification Candidates (Cycle #{cycleCount})</div>
            {candidates.length === 0 ? (
                <div className="kg-placeholder">No candidates generated for this cycle.</div>
            ) : (
                candidates.map(candidate => (
                    <div key={candidate.id} className={`rie-insight-item candidate-status-${candidate.status}`}>
                        <div className="rie-insight-header">
                            <strong>Candidate #{candidate.id.substring(0, 4)}...</strong>
                            {candidate.evaluationScore !== null && (
                                 <strong className={`mod-log-status ${candidate.evaluationScore > 0 ? 'status-success' : 'status-failed'}`}>
                                    Gain: {candidate.evaluationScore.toFixed(2)}
                                </strong>
                            )}
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>
                            {candidate.reasoning}
                        </p>
                        <div className="code-snippet-container">
                            <pre><code>{candidate.codeSnippet}</code></pre>
                        </div>
                        {candidate.status === 'evaluated' && (
                            <div className="proposal-actions-footer">
                                <button className="control-button" onClick={() => handleImplement(candidate.id)}>Implement</button>
                            </div>
                        )}
                    </div>
                ))
            )}

            <div className="panel-subsection-title">Implementation Log</div>
            {log.length === 0 ? (
                <div className="kg-placeholder">No modifications implemented yet.</div>
            ) : (
                <div className="command-log-list">
                    {log.map((entry, index) => (
                        <div key={index} className="command-log-item log-type-success">
                            <span className="log-icon">✓</span>
                            <span className="log-text">{entry}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};