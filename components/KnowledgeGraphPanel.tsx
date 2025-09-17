import React from 'react';
import { Action } from '../types';
import { useMemoryState, useLocalization } from '../context/AuraContext';

export const KnowledgeGraphPanel = React.memo(({ onDispatch }: { onDispatch: React.Dispatch<Action> }) => {
    const { knowledgeGraph: graph } = useMemoryState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="kg-content">
                {graph.length === 0 ? (
                    <div className="kg-placeholder">{t('knowledgeGraph_placeholder')}</div>
                ) : (
                    graph.map((fact) => (
                        <div className="kg-fact" key={fact.id}>
                            <div className="kg-fact-confidence" style={{'--confidence': `${fact.confidence * 100}%`} as React.CSSProperties} title={`${t('causalSelfModel_confidence')}: ${Math.round(fact.confidence * 100)}%`}></div>
                            <span className="kg-subject">{fact.subject}</span>
                            <span className="kg-predicate">{fact.predicate}</span>
                            <span className="kg-object">{fact.object}</span>
                            <button className="kg-delete-button" onClick={() => onDispatch({ type: 'DELETE_FACT', payload: fact.id })} title={t('knowledgeGraph_deleteFact')}>&times;</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});