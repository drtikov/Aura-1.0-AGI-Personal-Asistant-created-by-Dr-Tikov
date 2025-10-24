// components/ScienceAgencyPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { personas } from '../state/personas';

const specialistIds = [
    'biologist', 
    'chemist', 
    'physicist', 
    'geneticist', 
    'sociologist', 
    'anthropologist', 
    'ecologist', 
    'cognitive_scientist', 
    'geologist', 
    'astronomer', 
    'computer_scientist'
];

export const ScienceAgencyPanel = () => {
    const { t } = useLocalization();

    const specialists = personas.filter(p => specialistIds.includes(p.id));

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('scienceAgency_description')}
            </p>
            <div className="panel-subsection-title">{t('scienceAgency_specialists')}</div>
            <div className="personas-container">
                {specialists.map(specialist => (
                    <div key={specialist.id} className="persona-item">
                        <div className="persona-header">
                            <span className="persona-name">{t(`personality_${specialist.id}_name`)}</span>
                        </div>
                        <p className="persona-desc">{t(`personality_${specialist.id}_desc`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};