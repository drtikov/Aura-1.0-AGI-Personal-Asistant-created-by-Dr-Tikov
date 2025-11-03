// components/IdeaCartographerPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAuraDispatch, useLocalization, useMemoryState } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';

export const IdeaCartographerPanel = () => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    const { knowledgeGraph } = useMemoryState();
    const modal = useModal();

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [sourceConcepts, setSourceConcepts] = useState<string[]>([]);

    const handleExplore = async () => {
        setIsLoading(true);
        setResults([]);
        try {
            // Get up to 5 random, unique subjects from the knowledge graph
            const allSubjects = [...new Set(knowledgeGraph.map(fact => fact.subject))];
            const concepts = [];
            while (concepts.length < 5 && allSubjects.length > 0) {
                const randomIndex = Math.floor(Math.random() * allSubjects.length);
                concepts.push(allSubjects.splice(randomIndex, 1)[0]);
            }

            if (concepts.length === 0) {
                addToast('Not enough concepts in memory to explore.', 'warning');
                return;
            }

            setSourceConcepts(concepts);
            const topics = await geminiAPI.findRelatedUntrackedTopics(concepts);
            setResults(topics);

        } catch (e) {
            addToast(`Exploration failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTopicClick = (topic: string) => {
        modal.open('search', { initialQuery: topic });
    };

    return (
        <div className="side-panel">
            <p className="reason-text">
                This tool uses concepts from your knowledge graph as a starting point to discover related, unexplored topics ("Terra Incognita"), turning your memory into a map for new discoveries.
            </p>

            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button 
                    className="control-button" 
                    onClick={handleExplore} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Exploring...' : 'Explore Connections'}
                </button>
            </div>
            
            {isLoading && (
                <div className="generating-indicator" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                    <div className="spinner-small"></div>
                    <span>Charting Terra Incognita...</span>
                </div>
            )}
            
            {results.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="panel-subsection-title">Source Concepts</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {sourceConcepts.map(concept => <span key={concept} className="skill-tag">{concept}</span>)}
                    </div>

                    <div className="panel-subsection-title">Terra Incognita (Unexplored Topics)</div>
                    <div className="button-grid" style={{ gridTemplateColumns: '1fr' }}>
                        {results.map((topic, index) => (
                            <button 
                                key={index} 
                                className="control-button" 
                                style={{ textAlign: 'left', textTransform: 'none', letterSpacing: 'normal' }}
                                onClick={() => handleTopicClick(topic)}
                            >
                                {topic}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};