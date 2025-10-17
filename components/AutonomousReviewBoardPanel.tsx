// components/AutonomousReviewBoardPanel.tsx
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext.tsx';
import { AGISDecision } from '../types';

// FIX: Wrapped component in React.memo to handle `key` prop correctly and fixed the type of `t` to allow for interpolation options.
const DecisionCard = React.memo(({ decision, t }: { decision: AGISDecision, t: (key: string, options?: any) => string }) => {
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    const getDecisionInfo = () => {
        switch (decision.decision) {
            case 'auto-approved':
                return { color: 'var(--success-color)', icon: '✅', label: t('agis_decision_approved') };
            case 'sent-to-user':
                return { color: 'var(--warning-color)', icon: '👤', label: t('agis_decision_user') };
            case 'rejected':
                return { color: 'var(--failure-color)', icon: '🚫', label: t('agis_decision_rejected') };
        }
    };

    const { color, icon, label } = getDecisionInfo();

    return (
        <details className="workflow-details">
            <summary className="workflow-summary">
                <div className="mod-log-header" style={{ width: '100%' }}>
                    <span className="mod-log-type" title={decision.proposalId}>
                        {icon} {decision.proposalSummary}
                    </span>
                    <span className="mod-log-status" style={{ color }}>
                        {label}
                    </span>
                </div>
            </summary>
            <div className="workflow-content">
                <p className="reason-text"><strong>{t('agis_reasoning')}:</strong> <em>"{decision.analysis.reasoning}"</em></p>
                <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left', marginTop: '0.75rem' }}>
                    <div className="metric-item">
                        <span className="metric-label">{t('agis_safety')}</span>
                        <span className="metric-value" style={{ color: decision.analysis.safetyCompliance ? 'var(--success-color)' : 'var(--failure-color)' }}>
                            {decision.analysis.safetyCompliance ? t('agis_compliant') : t('agis_nonCompliant')}
                        </span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">{t('agis_blastRadius')}</span>
                        <span className="metric-value">{decision.analysis.blastRadius}</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">{t('agis_confidence')}</span>
                        <span className="metric-value">{(decision.analysis.confidenceScore * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">{t('agis_telos')}</span>
                        <span className="metric-value">{decision.analysis.telosAlignment.toFixed(2)}</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {timeAgo(decision.timestamp)}
                </div>
            </div>
        </details>
    );
});

export const AutonomousReviewBoardPanel = () => {
    const { autonomousReviewBoardState } = useSystemState();
    const { t } = useLocalization();

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('agis_description')}
            </p>
            
            <div className="awareness-item">
                <label title={t('agis_confidence_threshold_tip')}>{t('agis_confidence_threshold')}</label>
                <strong>{(autonomousReviewBoardState.agisConfidenceThreshold * 100).toFixed(1)}%</strong>
            </div>
            
            {autonomousReviewBoardState.lastCalibrationReason && (
                <p className="reason-text" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                   <strong>{t('agis_lastCalibration')}:</strong> {autonomousReviewBoardState.lastCalibrationReason}
                </p>
            )}

            <div className="panel-subsection-title">{t('agis_decisionLog')}</div>
            {autonomousReviewBoardState.decisionLog.length === 0 ? (
                <div className="kg-placeholder">{t('agis_noDecisions')}</div>
            ) : (
                <div className="decision-log-list">
                    {autonomousReviewBoardState.decisionLog.map(decision => (
                        <DecisionCard key={decision.id} decision={decision} t={t} />
                    ))}
                </div>
            )}
        </div>
    );
};