import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const EpistemicBoundaryPanel = React.memo(() => {
    const { boundaryDetectionEngine: state } = useCoreState();
    const { t } = useLocalization();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        return t('timeAgoMinutes', { count: minutes });
    };

    return (
        <div className="side-panel epistemic-boundary-panel">
            {state.epistemicBoundaries.length === 0 ? (
                <div className="kg-placeholder">{t('epistemic_placeholder')}</div>
            ) : (
                state.epistemicBoundaries.map(boundary => (
                    <div key={boundary.id} className="veto-log-item" style={{ borderLeftColor: 'var(--secondary-color)', background: 'rgba(255, 0, 255, 0.05)' }}>
                        <div className="veto-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <strong>{t('epistemic_limitation')}</strong>
                           <small style={{color: 'var(--text-muted)'}}>{timeAgo(boundary.timestamp)}</small>
                        </div>
                        <p className="veto-reason" style={{ fontStyle: 'italic', color: 'var(--text-color)', marginTop: '0.25rem' }}>
                            "{boundary.limitation}"
                        </p>
                         <p className="veto-principle" style={{fontSize: '0.75rem'}}>
                            {t('epistemic_evidence', { count: boundary.evidence.length })}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
});