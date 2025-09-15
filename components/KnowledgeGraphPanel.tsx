import React from 'react';
import { Fact } from '../types';
import { Action } from '../state/reducer';

export const KnowledgeGraphPanel = React.memo(({ graph, dispatch }: { graph: Fact[], dispatch: React.Dispatch<Action> }) => (
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
                        <button className="kg-delete-button" onClick={() => dispatch({ type: 'DELETE_FACT', payload: fact.id })} title="Delete Fact">&times;</button>
                    </div>
                ))
            )}
        </div>
    </div>
));
