import React from 'react';
import { Action } from '../types';
import { useMemoryState } from '../context/AuraContext';

export const KnowledgeGraphPanel = React.memo(({ onDispatch }: { onDispatch: React.Dispatch<Action> }) => {
    const { knowledgeGraph: graph } = useMemoryState();
    return (
        <div className="side-panel">
            <div className="kg-content">
                {graph.length === 0 ? (
                    <div className="kg-placeholder">The knowledge graph is empty. Start a conversation to build it.</div>
                ) : (
                    graph.map((fact) => (
                        <div className="kg-fact" key={fact.id}>
                            <div className="kg-fact-confidence" style={{'--confidence': `${fact.confidence * 100}%`} as React.CSSProperties} title={`Confidence: ${Math.round(fact.confidence * 100)}%`}></div>
                            <span className="kg-subject">{fact.subject}</span>
                            <span className="kg-predicate">{fact.predicate}</span>
                            <span className="kg-object">{fact.object}</span>
                            <button className="kg-delete-button" onClick={() => onDispatch({ type: 'DELETE_FACT', payload: fact.id })} title="Delete Fact">&times;</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});