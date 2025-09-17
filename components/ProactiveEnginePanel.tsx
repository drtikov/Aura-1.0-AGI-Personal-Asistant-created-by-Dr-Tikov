import React from 'react';
import { useEngineState } from '../context/AuraContext';

interface ProactiveEnginePanelProps {
    onSuggestionAction: (suggestionId: string, action: 'accepted' | 'rejected') => void;
}

export const ProactiveEnginePanel = React.memo(({ onSuggestionAction }: ProactiveEnginePanelProps) => {
    const { proactiveEngineState: state } = useEngineState();
    return (
        <div className="side-panel proactive-panel">
            <div className="proactive-panel-content">
                <div className="panel-subsection-title">Proactive Suggestions</div>
                {state.generatedSuggestions.filter(s => s.status === 'suggested').length === 0 ? (
                    <div className="kg-placeholder">No suggestions right now.</div>
                ) : (
                    state.generatedSuggestions.filter(s => s.status === 'suggested').map(suggestion => (
                        <div key={suggestion.id} className="suggestion-item">
                            <p className="suggestion-text">{suggestion.text}</p>
                            <div className="suggestion-footer">
                                <span className="suggestion-confidence">Confidence: {(suggestion.confidence * 100).toFixed(0)}%</span>
                                <div className="suggestion-actions">
                                    <button onClick={() => onSuggestionAction(suggestion.id, 'rejected')} title="Reject">👎</button>
                                    <button onClick={() => onSuggestionAction(suggestion.id, 'accepted')} title="Accept">👍</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});