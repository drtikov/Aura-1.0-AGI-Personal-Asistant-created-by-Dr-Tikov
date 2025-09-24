import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { PersonalityState, Persona } from '../types';

interface TraitBarProps {
    label: string;
    value: number;
    color: string;
}

// FIX: Wrapped the component in React.memo to correctly handle the `key` prop when used in a list, resolving type errors.
const TraitBar = React.memo(({ label, value, color }: TraitBarProps) => {
    // Convert value from [-1, 1] to [0, 100] for the bar width
    const isNegative = value < 0;
    
    // The bar grows from the center.
    // For negative values, we use margin-left to push it left from center.
    // For positive values, it starts at the center.
    // The width is always based on the absolute value.
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
});

export const PersonalityPanel = React.memo(() => {
    const { personalityState } = useCoreState();
    const { t } = useLocalization();

    const traits: { key: keyof Pick<PersonalityState, 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'>; labelKey: string; color: string }[] = [
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
            
             <div className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('personality_personas')}</div>
            <div className="personas-container">
                {personalityState.personas && Object.entries(personalityState.personas).map(([id, persona]: [string, Persona]) => (
                    <div key={id} className={`persona-item ${personalityState.dominantPersona === id ? 'dominant' : ''}`}>
                        <div className="persona-header">
                            <span className="persona-name">{t(`personality_${id}_name`)}</span>
                            {personalityState.dominantPersona === id && <span className="dominant-badge">{t('personality_dominant')}</span>}
                        </div>
                        <div className="state-item" style={{ padding: 0, marginTop: '0.25rem' }}>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${persona.activation * 100}%`, backgroundColor: 'var(--primary-color)' }}></div>
                            </div>
                        </div>
                        <p className="persona-desc">{t(`personality_${id}_desc`)}</p>
                    </div>
                ))}
            </div>

            <div className="state-item" style={{marginTop: '1rem'}}>
                <label>{t('personality_coherence')}</label>
                <div className="state-bar-container">
                    <div className="state-bar coherence-bar" style={{ width: `${personalityState.personaCoherence * 100}%` }} />
                </div>
            </div>

            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('personality_lastUpdate')}</div>
            <p className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>
                {personalityState.lastUpdateReason}
            </p>
        </div>
    );
});