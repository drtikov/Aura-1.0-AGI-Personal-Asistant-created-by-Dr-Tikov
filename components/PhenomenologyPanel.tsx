// components/PhenomenologyPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const PhenomenologyPanel = React.memo(() => {
    const { phenomenologicalEngine: state } = useCoreState();
    const { t } = useLocalization();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    return (
        <div className="side-panel phenomenology-panel">
            <div className="panel-subsection-title">{t('phenomenology_directives')}</div>
            {state.phenomenologicalDirectives.length === 0 ? (
                <div className="kg-placeholder" style={{marginBottom: '1rem'}}>{t('phenomenology_noDirectives')}</div>
            ) : (
                 state.phenomenologicalDirectives.map(entry => (
                    <div key={entry.id} className="causal-link source-rie" style={{ background: 'rgba(187, 154, 247, 0.1)', borderLeftColor: 'var(--primary-color)'}}>
                        <div className="causal-effect" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                           "{entry.directive}"
                        </div>
                         <div className="causal-link-footer" style={{textAlign: 'left', marginTop: '0.5rem'}}>
                            <strong>{t('phenomenology_source')}:</strong> {entry.sourcePattern}
                        </div>
                    </div>
                ))
            )}

            <div className="panel-subsection-title">{t('phenomenology_qualiaLog')}</div>
            {state.qualiaLog.length === 0 ? (
                <div className="kg-placeholder">{t('phenomenology_noQualia')}</div>
            ) : (
                state.qualiaLog.map(entry => (
                    <div key={entry.id} className="rie-insight-item" style={{ background: 'rgba(187, 154, 247, 0.05)', borderLeft: '3px solid var(--primary-color)' }}>
                        <div className="rie-insight-header">
                            <span className="mod-log-type">{t('phenomenology_qualiaEntry')}</span>
                            <small>{timeAgo(entry.timestamp)}</small>
                        </div>
                        <div className="rie-insight-body">
                            <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                                "{entry.experience}"
                            </p>
                            <div className="associated-states-grid" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {entry.associatedStates.map(s => (
                                    <span key={s.key}>{s.key.replace('Signal', '')}: <strong>{s.value.toFixed(2)}</strong></span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});