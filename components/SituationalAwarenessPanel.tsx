// components/SituationalAwarenessPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const SituationalAwarenessPanel = React.memo(() => {
    const { situationalAwareness: state } = useCoreState();
    const { attentionalField } = state;
    const { t } = useLocalization();

    return (
        <div className="side-panel situational-awareness-panel">
            <div className="awareness-item">
                <label>{t('situationalAwareness_emotionalTone')}</label>
                <strong>{attentionalField.emotionalTone}</strong>
            </div>

            <div className="panel-subsection-title">{t('situationalAwareness_spotlight')}</div>
            <div className="spotlight-item" style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '0.75rem', marginBottom: '1rem' }}>
                <div className="state-item" style={{ padding: 0 }}>
                    <label>{attentionalField.spotlight.item}</label>
                    <div className="state-bar-container">
                        <div className="state-bar" style={{ width: `${attentionalField.spotlight.intensity * 100}%`, backgroundColor: 'var(--accent-color)' }} title={`${t('situationalAwareness_intensity')}: ${attentionalField.spotlight.intensity.toFixed(2)}`}></div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('situationalAwareness_ambient')}</div>
            {attentionalField.ambientAwareness.length === 0 ? (
                <div className="kg-placeholder">{t('situationalAwareness_noAmbient')}</div>
            ) : (
                <div className="ambient-list">
                    {attentionalField.ambientAwareness.map((item, index) => (
                        <div key={index} className="state-item">
                            <label>{item.item}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${item.relevance * 100}%`, backgroundColor: 'var(--primary-color)', opacity: 0.7 }} title={`${t('situationalAwareness_relevance')}: ${item.relevance.toFixed(2)}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="panel-subsection-title">{t('situationalAwareness_ignored')}</div>
             {attentionalField.ignoredStimuli.length === 0 ? (
                <div className="kg-placeholder">{t('situationalAwareness_noIgnored')}</div>
            ) : (
                <ul className="ignored-list" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', paddingLeft: 0 }}>
                    {attentionalField.ignoredStimuli.map((item, index) => (
                        <li key={index} style={{ padding: '0.2rem 0', textDecoration: 'line-through' }}>{item}</li>
                    ))}
                </ul>
            )}

            <div className="panel-subsection-title">{t('situationalAwareness_domLog')}</div>
            <div className="command-log-list" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {(state.domChangeLog || []).length === 0 ? (
                    <div className="kg-placeholder">{t('situationalAwareness_noDomChanges')}</div>
                ) : (
                    (state.domChangeLog || []).map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">👀</span>
                            <span className="log-text" title={entry.summary}>{entry.summary.substring(0, 50)}...</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});