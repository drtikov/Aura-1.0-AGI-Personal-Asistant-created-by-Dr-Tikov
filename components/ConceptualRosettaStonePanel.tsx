// components/ConceptualRosettaStonePanel.tsx
import React, { useMemo } from 'react';
import { useArchitectureState, useLocalization, useMemoryState } from '../context/AuraContext';
import { MDNAVector, ProtoSymbol } from '../types';

const vectorSimilarity = (v1: MDNAVector, v2: MDNAVector): number => {
    if (v1.length !== v2.length) return 0;
    const dotProduct = v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
    const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
};

export const ConceptualRosettaStonePanel = React.memo(() => {
    const { neuroCortexState } = useArchitectureState();
    const { mdnaSpace } = useMemoryState();
    const { t } = useLocalization();

    const { protoSymbols, columns } = neuroCortexState;

    const translations = useMemo(() => {
        const humanConcepts = Object.entries(mdnaSpace).filter(([name]) => !name.startsWith('Ψ-'));
        
        return protoSymbols.reduce((acc, symbol) => {
            const symbolVector = symbol.mdnaVector;
            if (!symbolVector) {
                acc[symbol.id] = [];
                return acc;
            }
            
            // FIX: Explicitly type the destructured array to ensure `vector` is correctly typed as MDNAVector.
            const similarities = humanConcepts.map(([name, vector]: [string, MDNAVector]) => ({
                name,
                similarity: vectorSimilarity(symbolVector, vector),
            }));

            acc[symbol.id] = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
            return acc;
        }, {} as Record<string, { name: string, similarity: number }[]>);
    }, [protoSymbols, mdnaSpace]);

    const columnsById = useMemo(() => {
        return new Map(columns.map(c => [c.id, c.specialty]));
    }, [columns]);

    return (
        <div className="side-panel">
            <p className="reason-text">{t('rosetta_description')}</p>
            {protoSymbols.length === 0 ? (
                <div className="kg-placeholder">{t('rosetta_placeholder')}</div>
            ) : (
                protoSymbols.map((symbol: ProtoSymbol) => (
                    <div key={symbol.id} className="axiom-card" style={{ borderLeft: '3px solid var(--guna-dharma)' }}>
                        <div className="mod-log-header">
                            <h5 className="mod-log-type">{symbol.label}</h5>
                            <span className="mod-log-status">{t('rosetta_emergentSymbol')}</span>
                        </div>
                        <p className="axiom-card-text" style={{ fontStyle: 'normal', marginTop: '0.5rem' }}>
                            {symbol.description}
                        </p>
                        
                        <div className="panel-subsection-title" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>{t('rosetta_translation')}</div>
                        <div className="hypha-connections-list">
                            {translations[symbol.id]?.map(trans => (
                                <div key={trans.name} className="hypha-connection-item" title={`${t('rosetta_similarity')}: ${trans.similarity.toFixed(3)}`}>
                                    <span className="hypha-source">{symbol.label}</span>
                                    <div className="hypha-weight-bar" style={{'--weight': `${trans.similarity * 100}%`} as React.CSSProperties}></div>
                                    <span className="hypha-target">{trans.name}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="panel-subsection-title" style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>{t('rosetta_constituents')}</div>
                        <div className="source-concept-list" style={{ borderLeft: 'none', paddingLeft: 0 }}>
                            {symbol.constituentColumnIds.map(id => (
                                <div key={id} className="source-concept-item">• {columnsById.get(id) || 'Unknown Column'}</div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});