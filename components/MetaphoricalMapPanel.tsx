// components/MetaphoricalMapPanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { Metaphor } from '../types.ts';

export const MetaphoricalMapPanel = () => {
    const { metaphoricalMapState } = useCoreState();
    const { t } = useLocalization();

    const sortedMetaphors = [...metaphoricalMapState.metaphors].sort((a, b) => b.fitnessScore - a.fitnessScore);

    return (
        <div className="side-panel">
            {sortedMetaphors.length === 0 ? (
                <div className="kg-placeholder">{t('metaphor_placeholder')}</div>
            ) : (
                sortedMetaphors.map((metaphor: Metaphor) => (
                    <div key={metaphor.id} className="rie-insight-item" style={{background: 'rgba(147, 112, 219, 0.1)', borderLeft: '3px solid var(--guna-dharma)'}}>
                        <p className="rie-insight-model-update" style={{ fontStyle: 'italic', color: 'var(--text-color)' }}>
                           "{metaphor.description}"
                        </p>
                        <div className="mod-log-header" style={{ justifyContent: 'space-between', marginTop: '0.5rem' }}>
                            <span className="mod-log-type" style={{ fontSize: '0.75rem' }}>
                                {metaphor.sourceDomain} → {metaphor.targetDomain}
                            </span>
                             <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                                <span>{t('metaphor_fitness')}: <strong>{metaphor.fitnessScore.toFixed(2)}</strong></span>
                                <span>{t('metaphor_observations')}: <strong>{metaphor.observationCount}</strong></span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};