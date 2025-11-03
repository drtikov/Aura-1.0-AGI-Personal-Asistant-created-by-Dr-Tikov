// components/PersonalityPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
// FIX: Updated import to use PersonaActivation instead of the collided Persona type.
import { PersonalityState, PersonaActivation, Persona } from '../types.ts';
import { useModal } from '../context/ModalContext.tsx';
import { personas } from '../state/personas.ts';


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
    const modal = useModal();
    const { personaJournals } = personalityState;

    const traits: { key: keyof Pick<PersonalityState, 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism'>; labelKey: string; color: string }[] = [
        { key: 'openness', labelKey: 'personality_openness', color: 'var(--mode-creativity)' },
        { key: 'conscientiousness', labelKey: 'personality_conscientiousness', color: 'var(--guna-dharma)' },
        { key: 'extraversion', labelKey: 'personality_extraversion', color: 'var(--state-happiness)' },
        { key: 'agreeableness', labelKey: 'personality_agreeableness', color: 'var(--state-love)' },
        { key: 'neuroticism', labelKey: 'personality_neuroticism', color: 'var(--state-uncertainty)' },
    ];

    const handlePersonaClick = (persona: Persona) => {
        const entries = personaJournals[persona.id] || [];
        modal.open('personaJournal', { persona, entries });
    };

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
                {personas.map((persona: Persona) => {
                    const personaData = personalityState.personas[persona.id] as PersonaActivation | undefined;
                    const journalEntries = personaJournals[persona.id];
                    const hasJournalEntries = journalEntries && journalEntries.length > 0;

                    return (
                        <div 
                            key={persona.id} 
                            className={`persona-item ${personalityState.dominantPersona === persona.id ? 'dominant' : ''}`}
                            onClick={() => handlePersonaClick(persona)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="persona-header">
                                <span className="persona-name">{t(`personality_${persona.id}_name`)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {hasJournalEntries && (
                                        <span className="accordion-summary has-notifications" title={`${journalEntries.length} learned principles`}>
                                            {journalEntries.length}
                                        </span>
                                    )}
                                    {personalityState.dominantPersona === persona.id && <span className="dominant-badge">{t('personality_dominant')}</span>}
                                </div>
                            </div>
                            {personaData && (
                                <div className="state-item" style={{ padding: 0, marginTop: '0.25rem' }}>
                                    <div className="state-bar-container">
                                        <div className="state-bar" style={{ width: `${personaData.activation * 100}%`, backgroundColor: 'var(--primary-color)' }}></div>
                                    </div>
                                </div>
                            )}
                            <p className="persona-desc">{t(`personality_${persona.id}_desc`)}</p>
                        </div>
                    );
                })}
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