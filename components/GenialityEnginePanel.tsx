import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { GenialityImprovementProposal } from '../types';

const RadialBar = ({ percentage, color, label, size = 40, stroke = 4 }: { percentage: number, color: string, label: string, size?: number, stroke?: number }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage * circumference);

    return (
        <div className="geniality-radial-bar" title={`${label}: ${(percentage * 100).toFixed(0)}%`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    stroke="var(--border-color)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <span className="geniality-radial-label">{label.substring(0, 1)}</span>
        </div>
    );
};

export const GenialityEnginePanel = React.memo(() => {
    const { genialityEngineState: state } = useCoreState();
    const { t } = useLocalization();
    const { genialityIndex, componentScores, improvementProposals } = state;

    return (
        <div className="side-panel geniality-panel">
            <div className="geniality-main-display">
                <div className="geniality-gauge-container">
                    <svg viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="genialityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--guna-rajas)" />
                                <stop offset="50%" stopColor="var(--guna-dharma)" />
                                <stop offset="100%" stopColor="var(--primary-color)" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="url(#genialityGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={(2 * Math.PI * 45) * (1 - genialityIndex)}
                            className="geniality-gauge-value"
                        />
                    </svg>
                    <div className="geniality-gauge-text">
                        <div className="geniality-gauge-value-num">{(genialityIndex * 100).toFixed(0)}</div>
                        <div className="geniality-gauge-label">{t('geniality_index')}</div>
                    </div>
                </div>
                <div className="geniality-component-scores">
                    <RadialBar percentage={componentScores.creativity} color="var(--mode-creativity)" label={t('geniality_component_creativity')} />
                    <RadialBar percentage={componentScores.insight} color="var(--state-wisdom)" label={t('geniality_component_insight')} />
                    <RadialBar percentage={componentScores.synthesis} color="var(--guna-dharma)" label={t('geniality_component_synthesis')} />
                    <RadialBar percentage={componentScores.flow} color="var(--state-mastery)" label={t('geniality_component_flow')} />
                </div>
            </div>
            
            <div className="panel-subsection-title">{t('geniality_proposals_title')}</div>
            <div className="geniality-proposals-list">
                {improvementProposals.length === 0 ? (
                    <div className="kg-placeholder">{t('geniality_noProposals')}</div>
                ) : (
                    improvementProposals.map(proposal => (
                        <div key={proposal.id} className={`geniality-proposal-item status-${proposal.status}`}>
                            <div className="geniality-proposal-header">
                                <h5 className="geniality-proposal-title">{proposal.title}</h5>
                                <div className="geniality-proposal-impact" title={`${t('geniality_projected_impact')}: +${(proposal.projectedImpact * 100).toFixed(0)}%`}>
                                    <span className="impact-arrow">▲</span>
                                    <span>{(proposal.projectedImpact * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <p className="geniality-proposal-reasoning">
                                <strong>{t('architecturePanel_reasoning')}:</strong> <em>{proposal.reasoning}</em>
                            </p>
                             <p className="geniality-proposal-action">
                                <strong>{t('proposalReview_action')}:</strong> {proposal.action}
                            </p>
                             <div className="proposal-actions-footer">
                                <span className={`arch-status status-${proposal.status}`}>{proposal.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});