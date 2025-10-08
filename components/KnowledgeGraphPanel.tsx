

import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { SyscallCall } from '../types';
import { useMemoryState, useLocalization, useAuraDispatch } from '../context/AuraContext';

export const KnowledgeGraphPanel = React.memo(() => {
    const { knowledgeGraph: graph } = useMemoryState();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();

    return (
        <div className="side-panel">
            <div className="kg-content">
                {graph.length === 0 ? (
                    <div className="kg-placeholder">{t('knowledgeGraph_placeholder')}</div>
                ) : (
                    graph.map((fact) => (
                        <div 
                            className="kg-fact" 
                            key={fact.id}
                            style={{ opacity: 0.4 + (fact.strength * 0.6) }}
                            title={`Strength: ${fact.strength.toFixed(2)}`}
                        >
                            <div className="kg-fact-confidence" style={{'--confidence': `${fact.confidence * 100}%`} as React.CSSProperties} title={`${t('causalSelfModel_confidence')}: ${Math.round(fact.confidence * 100)}%`}></div>
                            <span className="kg-subject">{fact.subject}</span>
                            <span className="kg-predicate">{fact.predicate}</span>
                            <span className="kg-object">{fact.object}</span>
                            <button className="kg-delete-button" onClick={() => syscall('DELETE_FACT', fact.id)} title={t('knowledgeGraph_deleteFact')}>&times;</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
