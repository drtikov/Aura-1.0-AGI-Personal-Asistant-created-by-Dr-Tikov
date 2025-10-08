import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const EpistemicBoundaryPanel = React.memo(() => {
    const { knownUnknowns } = useCoreState();
    const { t } = useLocalization();

    const unexploredGaps = [...knownUnknowns]
        .filter(ku => ku.status === 'unexplored')
        .sort((a, b) => b.priority - a.priority);

    return (
        <div className="side-panel epistemic-boundary-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('epistemic_description')}
            </p>
            <div className="panel-subsection-title">{t('epistemic_unexploredGaps')}</div>
            {unexploredGaps.length === 0 ? (
                <div className="kg-placeholder">{t('epistemic_noGaps')}</div>
            ) : (
                unexploredGaps.map(gap => (
                    <div key={gap.id} className="veto-log-item" style={{ borderLeftColor: 'var(--secondary-color)', background: 'rgba(255, 0, 255, 0.05)' }}>
                        <div className="causal-link-header" style={{ marginBottom: '0.25rem', alignItems: 'flex-start' }}>
                            <p className="veto-reason" style={{ fontStyle: 'italic', color: 'var(--text-color)', margin: 0, flexGrow: 1 }}>
                                "{gap.question}"
                            </p>
                             <span className="priority-score" title={t('epistemic_priority')}>
                                {gap.priority.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});