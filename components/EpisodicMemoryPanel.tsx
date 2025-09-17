import React from 'react';
import { useMemoryState, useLocalization } from '../context/AuraContext';
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
                        <div key={episode.id} className="episode-item" style={{ borderLeftColor: getValenceColor(episode.valence) }}>
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
            <style>{`
                .episode-item {
                    border-left: 3px solid;
                    padding: 0.75rem;
                    margin-bottom: 1rem;
                    background: rgba(0,0,0,0.1);
                }
                .ui-2 .episode-item, .ui-3 .episode-item, .ui-6 .episode-item, .ui-7 .episode-item, .ui-8 .episode-item, .ui-11 .episode-item {
                    background: var(--background);
                }
                .episode-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .episode-title {
                    font-size: 0.9rem;
                    color: var(--text-color);
                    font-weight: bold;
                }
                .episode-summary {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }
                .episode-takeaway {
                     font-size: 0.8rem;
                     color: var(--text-color);
                }
            `}</style>
        </div>
    );
});