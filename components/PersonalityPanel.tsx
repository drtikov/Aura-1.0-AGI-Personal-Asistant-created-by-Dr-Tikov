import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { PersonalityState } from '../types';

const TraitBar = ({ label, value, color }: { label: string, value: number, color: string }) => {
    // Convert value from [-1, 1] to [0, 100] for the bar width
    const percentage = (value + 1) * 50;
    const isNegative = value < 0;
    const barStyle: React.CSSProperties = {
        width: `${Math.abs(value) * 50}%`,
        backgroundColor: color,
        marginLeft: isNegative ? `${50 - Math.abs(value) * 50}%` : '50%',
    };

    return (
        <div className="trait-item">
            <label>{label}</label>
            <div className="trait-bar-container">
                <div className="trait-bar-track">
                    <div className="trait-bar-value" style={barStyle}></div>
                </div>
            </div>
            <span>{value.toFixed(2)}</span>
        </div>
    );
};

export const PsychometricSubstratePanel = React.memo(() => {
    const { personalityState } = useCoreState();
    const { t } = useLocalization();

    const traits: { key: keyof Omit<PersonalityState, 'personaCoherence' | 'lastUpdateReason'>; labelKey: string; color: string }[] = [
        { key: 'openness', labelKey: 'personality_openness', color: 'var(--mode-creativity)' },
        { key: 'conscientiousness', labelKey: 'personality_conscientiousness', color: 'var(--guna-dharma)' },
        { key: 'extraversion', labelKey: 'personality_extraversion', color: 'var(--state-happiness)' },
        { key: 'agreeableness', labelKey: 'personality_agreeableness', color: 'var(--state-love)' },
        { key: 'neuroticism', labelKey: 'personality_neuroticism', color: 'var(--state-uncertainty)' },
    ];

    return (
        <div className="side-panel personality-panel">
            <div className="panel-subsection-title">{t('personality_oceanTraits')}</div>
            <div className="traits-container">
                {traits.map(trait => (
                    <TraitBar 
                        key={trait.key}
                        label={t(trait.labelKey)}
                        value={personalityState[trait.key]}
                        color={trait.color}
                    />
                ))}
            </div>
            
            <div className="state-item" style={{marginTop: '1rem'}}>
                <label>{t('personality_coherence')}</label>
                <div className="state-bar-container">
                    <div className="state-bar coherence-bar" style={{ width: `${personalityState.personaCoherence * 100}%` }} />
                </div>
            </div>

            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('personality_lastUpdate')}</div>
            <p className="reason-text">
                <em>{personalityState.lastUpdateReason}</em>
            </p>

            <style>{`
                .traits-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .trait-item {
                    display: grid;
                    grid-template-columns: 120px 1fr 40px;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                }
                .trait-item label {
                    color: var(--text-muted);
                    text-align: right;
                }
                .trait-item span {
                    font-weight: bold;
                    font-family: var(--font-body);
                }
                .trait-bar-container {
                    width: 100%;
                }
                .trait-bar-track {
                    width: 100%;
                    height: 10px;
                    background: var(--border-color);
                    position: relative;
                }
                .trait-bar-track::before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: var(--text-color);
                    opacity: 0.5;
                }
                .trait-bar-value {
                    height: 100%;
                }
                .reason-text {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
});
