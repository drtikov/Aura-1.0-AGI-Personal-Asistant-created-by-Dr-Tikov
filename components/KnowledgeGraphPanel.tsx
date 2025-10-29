// components/KnowledgeGraphPanel.tsx
import React from 'react';
// FIX: Add '.ts' extension to satisfy module resolution.
import { SyscallCall, KnowledgeFact } from '../types.ts';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useMemoryState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

const FactTypeBadge = ({ type }: { type: KnowledgeFact['type'] }) => {
    if (!type || type === 'fact') return null;
    let style = {};
    switch (type) {
        case 'theorem': style = { backgroundColor: 'var(--guna-dharma)', color: 'var(--background)' }; break;
        case 'definition': style = { backgroundColor: 'var(--primary-color)', color: 'var(--background)' }; break;
        case 'dependency': style = { backgroundColor: 'var(--text-muted)', color: 'var(--background)' }; break;
        default: style = { backgroundColor: 'var(--border-color)', color: 'var(--text-color)' }; break;
    }
    return <span className="proposal-type-badge" style={{...style, justifySelf: 'start', gridColumn: '2 / 3'}}>{type}</span>;
}

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
                            style={{ 
                                opacity: 0.4 + (fact.strength * 0.6), 
                                gridTemplateColumns: '10px auto 1fr auto auto',
                                gridTemplateRows: fact.type && fact.type !== 'fact' ? 'auto auto' : 'auto',
                            }}
                            title={`Strength: ${fact.strength.toFixed(2)}`}
                        >
                            <div className="kg-fact-confidence" style={{'--confidence': `${fact.confidence * 100}%`, gridRow: '1 / -1'} as React.CSSProperties} title={`${t('causalSelfModel_confidence')}: ${Math.round(fact.confidence * 100)}%`}></div>
                            
                            <FactTypeBadge type={fact.type} />
                            
                            <span className="kg-subject" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2', gridColumn: '2 / 3' }}>{fact.subject}</span>
                            <span className="kg-predicate" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>{fact.predicate}</span>
                            <span className="kg-object" style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>{fact.object}</span>
                            <button className="kg-delete-button" onClick={() => syscall('DELETE_FACT', fact.id)} title={t('knowledgeGraph_deleteFact')} style={{ gridRow: fact.type && fact.type !== 'fact' ? '2 / 3' : '1 / 2' }}>&times;</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});