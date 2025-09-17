

import React from 'react';
import { PerformanceLogEntry } from '../types';
import { Modal } from './Modal';

export const CausalChainModal = ({ log, onClose }: { log: PerformanceLogEntry | null, onClose: () => void }) => {
    const snapshot = log?.decisionContext?.internalStateSnapshot;
    const workingMemory = log?.decisionContext?.workingMemorySnapshot;
    const reasoningPlan = log?.decisionContext?.reasoningPlan;
    
    return (
        <Modal isOpen={!!log} onClose={onClose} title="Causal Chain Trace">
            {log && (
                <>
                    <div className="trace-section"> <h4>1. Initial State</h4> {snapshot ? ( <div className="state-grid"> <span>Novelty: {snapshot.noveltySignal?.toFixed(2) ?? 'N/A'}</span> <span>Mastery: {snapshot.masterySignal?.toFixed(2) ?? 'N/A'}</span> <span>Uncertainty: {snapshot.uncertaintySignal?.toFixed(2) ?? 'N/A'}</span> <span>Boredom: {snapshot.boredomLevel?.toFixed(2) ?? 'N/A'}</span> <span>Load: {(snapshot.load * 100)?.toFixed(0) ?? 'N/A'}%</span> <span>Guna: {snapshot.gunaState ?? 'N/A'}</span> </div> ) : <p><i>No snapshot available.</i></p>} </div>
                    <div className="trace-section"> <h4>2. Working Memory</h4> {workingMemory && workingMemory.length > 0 ? ( <ul>{workingMemory.map((item, i) => <li key={i}>{item}</li>)}</ul> ) : ( <p><i>Empty or unavailable.</i></p> )} </div>
                    <div className="trace-section">
                        <h4>3. Decision & Reasoning</h4>
                        <p><strong>Input:</strong> "{log.input ?? 'N/A'}"</p>
                        {reasoningPlan && reasoningPlan.length > 0 ? (
                            <div className="reasoning-plan">
                                <p><strong>Reasoning Plan:</strong></p>
                                {reasoningPlan.map(step => (
                                    <div key={step.step} className="plan-step">
                                        <div className="step-header">Step {step.step}: {step.skill}</div>
                                        <div className="step-reasoning"><em>{step.reasoning}</em></div>
                                        <div className="step-input">Input: "{step.input}"</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="reasoning-text"><strong>Reasoning:</strong> "{log.decisionContext?.reasoning ?? 'N/A'}"</p>
                        )}
                    </div>
                    <div className="trace-section"> <h4>4. Outcome</h4> <p><strong>Success:</strong> <span className={log.success ? 'success' : 'failure'}>{log.success ? 'Yes' : 'No'}</span></p> <p><strong>Duration:</strong> {log.duration ?? 'N/A'}ms</p> <p><strong>Cognitive Gain:</strong> {log.cognitiveGain?.toFixed(2) ?? 'N/A'}</p> {log.sentiment !== undefined && <p><strong>Sentiment Score:</strong> {log.sentiment?.toFixed(2) ?? 'N/A'}</p>} <p><strong>Output:</strong></p> <pre className="output-preview">{log.output?.substring(0, 300) || 'N/A'}{log.output && log.output.length > 300 ? '...' : ''}</pre> </div>
                </>
            )}
        </Modal>
    );
};