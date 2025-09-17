import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const SituationalAwarenessPanel = React.memo(() => {
    const { situationalAwareness: state } = useCoreState();
    const { attentionalField } = state;

    return (
        <div className="side-panel situational-awareness-panel">
            <div className="awareness-item">
                <label>Emotional Tone</label>
                <strong>{attentionalField.emotionalTone}</strong>
            </div>

            <div className="panel-subsection-title">Spotlight</div>
            <div className="spotlight-item" style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '0.75rem', marginBottom: '1rem' }}>
                <div className="state-item" style={{ padding: 0 }}>
                    <label>{attentionalField.spotlight.item}</label>
                    <div className="state-bar-container">
                        <div className="state-bar" style={{ width: `${attentionalField.spotlight.intensity * 100}%`, backgroundColor: 'var(--accent-color)' }} title={`Intensity: ${attentionalField.spotlight.intensity.toFixed(2)}`}></div>
                    </div>
                </div>
            </div>

            <div className="panel-subsection-title">Ambient Awareness</div>
            {attentionalField.ambientAwareness.length === 0 ? (
                <div className="kg-placeholder">No items in ambient awareness.</div>
            ) : (
                <div className="ambient-list">
                    {attentionalField.ambientAwareness.map((item, index) => (
                        <div key={index} className="state-item">
                            <label>{item.item}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${item.relevance * 100}%`, backgroundColor: 'var(--primary-color)', opacity: 0.7 }} title={`Relevance: ${item.relevance.toFixed(2)}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="panel-subsection-title">Ignored Stimuli</div>
             {attentionalField.ignoredStimuli.length === 0 ? (
                <div className="kg-placeholder">Not actively ignoring any stimuli.</div>
            ) : (
                <ul className="ignored-list" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', paddingLeft: 0 }}>
                    {attentionalField.ignoredStimuli.map((item, index) => (
                        <li key={index} style={{ padding: '0.2rem 0', textDecoration: 'line-through' }}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
});