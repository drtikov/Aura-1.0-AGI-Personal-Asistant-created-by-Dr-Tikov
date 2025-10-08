import React from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { ArchitecturalChangeProposal } from '../types';

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
    const { architecturalCrucibleState: state } = useArchitectureState();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();

    const handleProposeRadicalChange = () => {
        const proposal: Omit<ArchitecturalChangeProposal, 'id' | 'timestamp' | 'status'> = {
            proposalType: 'architecture',
            action: 'RADICAL_REFACTOR',
            target: 'state/reducer.ts',
            reasoning: 'The current monolithic reducer pattern is becoming a bottleneck for parallel state updates. Proposing a migration to an Actor Model-based state management system to improve performance and scalability under high cognitive load.',
            priority: 0.95, // High priority
        };
        syscall('OA/ADD_PROPOSAL', { ...proposal, id: `arch_${self.crypto.randomUUID()}`, timestamp: Date.now(), status: 'proposed' });
    };

    return (
        <div className="side-panel architectural-crucible-panel">
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
                            strokeDashoffset={(2 * Math.PI * 45) * (1 - state.architecturalHealthIndex)}
                            className="geniality-gauge-value"
                        />
                    </svg>
                    <div className="geniality-gauge-text">
                        <div className="geniality-gauge-value-num">{(state.architecturalHealthIndex * 100).toFixed(0)}</div>
                        <div className="geniality-gauge-label">{t('archCrucible_healthIndex')}</div>
                    </div>
                </div>
            </div>

            <div className="component-scores">
                <MetricItem label={t('archCrucible_efficiency')} value={state.componentScores.efficiency} />
                <MetricItem label={t('archCrucible_robustness')} value={state.componentScores.robustness} />
                <MetricItem label={t('archCrucible_scalability')} value={state.componentScores.scalability} />
                <MetricItem label={t('archCrucible_innovation')} value={state.componentScores.innovation} />
            </div>

            <div className="panel-subsection-title">{t('geniality_proposals_title')}</div>
            <div className="kg-placeholder">{t('archCrucible_proposalsMoved')}</div>

            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={handleProposeRadicalChange}>
                    {t('archCrucible_proposeEvolution')}
                </button>
            </div>
        </div>
    );
});