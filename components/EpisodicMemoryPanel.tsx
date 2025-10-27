// components/EpisodicMemoryPanel.tsx
import React from 'react';
import { useMemoryState, useLocalization } from '../context/AuraContext';
// FIX: Added '.ts' extension to satisfy module resolution.
import { Episode } from '../types';

export const EpisodicMemoryPanel = React.memo(() => {
    const { episodicMemoryState } = useMemoryState();
    const { t } = useLocalization();

    const getValenceColor = (valence: Episode['valence']) => {
        switch (valence) {
            case 'positive': return 'var(--success-color)';
            case 'negative': return 'var(--failure-color)';
            case 'neutral':
            default:
                return 'var(--primary-color)';
        }
    };

    return (
        <div className="side-panel episodic-memory-panel">
            {episodicMemoryState.episodes.length === 0 ? (
                <div className="kg-placeholder">{t('episodicMemory_placeholder')}</div>
            ) : (
                episodicMemoryState.episodes
                    .sort((a, b) => b.timestamp - a.timestamp) // Show newest first
                    .map(episode => (
                        <div 
                            key={episode.id} 
                            className="episode-item" 
                            style={{ 
                                borderLeftColor: getValenceColor(episode.valence),
                                opacity: 0.4 + (episode.strength * 0.6) 
                            }}
                            title={`Strength: ${episode.strength.toFixed(2)}`}
                        >
                            <div className="episode-header">
                                <h5 className="episode-title">{episode.title}</h5>
                                <div className="episode-salience-container" title={`${t('episodicMemory_salience')}: ${episode.salience.toFixed(2)}`}>
                                    <div className="state-bar-container" style={{ width: '50px' }}>
                                        <div 
                                            className="state-bar" 
                                            style={{ width: `${episode.salience * 100}%`, backgroundColor: getValenceColor(episode.valence) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="episode-summary">{episode.summary}</p>
                            <p className="episode-takeaway">
                                <strong>{t('episodicMemory_takeaway')}:</strong> <em>{episode.keyTakeaway}</em>
                            </p>
                        </div>
                    ))
            )}
        </div>
    );
});