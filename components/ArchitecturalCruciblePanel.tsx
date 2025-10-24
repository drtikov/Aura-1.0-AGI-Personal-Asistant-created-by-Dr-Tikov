// components/ArchitecturalCruciblePanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { ArchitecturalChangeProposal, CrucibleLogEntry } from '../types.ts';

const MetricItem = ({ label, value }: { label: string, value: number }) => (
    <div className="state-item">
        <label>{label}</label>
        <div className="state-bar-container">
            <div 
                className="state-bar" 
                style={{ 
                    width: `${value * 100}%`,
                    backgroundColor: value > 0.7 ? 'var(--success-color)' : value > 0.4 ? 'var(--warning-color)' : 'var(--failure-color)'
                }}
            />
        </div>
    </div>
);

export const ArchitecturalCruciblePanel = React.memo(() => {
    const { architecturalCrucibleState, ontogeneticArchitectState } = useArchitectureState();
    const { t } = useLocalization();
    const { handleRunCrucibleSimulation, syscall, addToast, geminiAPI } = useAuraDispatch();
    const [isProposing, setIsProposing] = useState(false);

    const crucibleProposals = ontogeneticArchitectState.proposalQueue.filter(p => p.proposalType === 'crucible' && p.status === 'proposed') as ArchitecturalChangeProposal[];
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        return `${seconds}s ago`;
    };

    const handleProposeEvolution = async () => {
        setIsProposing(true);
        addToast(t('toast_amai_analyzing'), 'info');
        try {
            const analysis = await geminiAPI.analyzeArchitectureForWeaknesses();
            addToast(t('toast_amai_proposing'), 'info');
            const proposal = await geminiAPI.generateCrucibleProposal(analysis);
            syscall('OA/ADD_PROPOSAL', proposal);
            addToast(t('toast_amai_complete'), 'success');
        } catch (e) {
            console.error("AMAI proposal generation failed:", e);
            addToast(`AMAI failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsProposing(false);
        }
    };

    return (
        <div className="side-panel architectural-crucible-panel">
            <p className="reason-text">{t('archCrucible_description')}</p>
            <div className="main-display">
                <div className="geniality-gauge-container">
                     <svg viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="crucibleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--failure-color)" />
                                <stop offset="50%" stopColor="var(--warning-color)" />
                                <stop offset="100%" stopColor="var(--success-color)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="url(#crucibleGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={(2 * Math.PI * 45) * (1 - architecturalCrucibleState.architecturalHealthIndex)}
                            className="geniality-gauge-value"
                        />
                    </svg>
                    <div className="geniality-gauge-text">
                        <div className="geniality-gauge-value-num">{(architecturalCrucibleState.architecturalHealthIndex * 100).toFixed(0)}</div>
                        <div className="geniality-gauge-label">{t('archCrucible_healthIndex')}</div>
                    </div>
                </div>
            </div>

            <div className="component-scores">
                <MetricItem label={t('archCrucible_efficiency')} value={architecturalCrucibleState.componentScores.efficiency} />
                <MetricItem label={t('archCrucible_robustness')} value={architecturalCrucibleState.componentScores.robustness} />
                <MetricItem label={t('archCrucible_scalability')} value={architecturalCrucibleState.componentScores.scalability} />
                <MetricItem label={t('archCrucible_innovation')} value={architecturalCrucibleState.componentScores.innovation} />
            </div>
            
            <div className="panel-subsection-title">{t('archCrucible_proposeEvolution')}</div>
            <p className="reason-text" style={{fontSize: '0.8rem'}}>
                Trigger the Autonomous Meta-Architectural Intelligence (AMAI) to analyze the system for weaknesses and propose a high-risk, high-reward refactoring.
            </p>
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button 
                    className="control-button" 
                    onClick={handleProposeEvolution}
                    disabled={isProposing}
                >
                    {isProposing ? 'Analyzing...' : 'Initiate AMAI Cycle'}
                </button>
            </div>

            <div className="panel-subsection-title">AMAI Proposals</div>
            {crucibleProposals.length > 0 ? (
                crucibleProposals.map(proposal => (
                    <div key={proposal.id} className="proposal-card">
                        <div className="proposal-card-body">
                            <p><em>{proposal.reasoning}</em></p>
                        </div>
                        <div className="proposal-actions-footer">
                            <button
                                className="control-button implement-button"
                                onClick={() => handleRunCrucibleSimulation(proposal)}
                                disabled={proposal.status === 'simulating'}
                            >
                                {proposal.status === 'simulating' ? 'Simulating...' : t('archCrucible_run_in_crucible')}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('archCrucible_no_proposals')}</div>
            )}
            
            <div className="panel-subsection-title">{t('archCrucible_simulation_log')}</div>
            <div className="command-log-list">
                {architecturalCrucibleState.simulationLog && architecturalCrucibleState.simulationLog.length > 0 ? (
                    architecturalCrucibleState.simulationLog.map((log: CrucibleLogEntry) => (
                        <div key={log.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🔬</span>
                            <span className="log-text">{log.message}</span>
                            <span className="log-time">{timeAgo(log.timestamp)}</span>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">{t('archCrucible_no_logs')}</div>
                )}
            </div>
        </div>
    );
});