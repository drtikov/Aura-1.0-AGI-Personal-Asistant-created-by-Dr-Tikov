// components/GeometricKnowledgePanel.tsx
import React, { useMemo, useState } from 'react';
import { useMemoryState, useLocalization } from '../context/AuraContext';
// FIX: Import ConnectionData to explicitly type the value from Object.entries.
import { MDNAVector, ConnectionData } from '../types';

export const GeometricKnowledgePanel = () => {
    const { mdnaSpace, conceptConnections } = useMemoryState();
    const { t } = useLocalization();
    const [hoveredConcept, setHoveredConcept] = useState<string | null>(null);

    const concepts = useMemo(() => Object.entries(mdnaSpace), [mdnaSpace]);
    
    const strongestConnections = useMemo(() => {
        return Object.entries(conceptConnections)
            // FIX: Explicitly typing `[key, data]` resolves the "Spread types may only be created from object types" error
            // by ensuring TypeScript knows `data` is an object.
            .map(([key, data]: [string, ConnectionData]) => ({ key, ...data }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 15);
    }, [conceptConnections]);

    const viewBoxSize = 2.4;
    const center = viewBoxSize / 2;

    const renderContent = () => {
        if (concepts.length === 0) {
            return <div className="kg-placeholder">{t('geometricKnowledge_placeholder')}</div>;
        }

        return (
            <>
                <p className="reason-text">
                    This is a 2D projection of the high-dimensional MDNA space (Metacognitive Dimensional Nucleic Acid), representing Aura's intuitive understanding. Each point is a concept. Lines represent the strongest learned associations.
                </p>
                <div className="spanda-manifold-container">
                    <svg viewBox={`-${center} -${center} ${viewBoxSize} ${viewBoxSize}`} className="spanda-manifold-svg">
                        {/* Connections */}
                        {strongestConnections.map(conn => {
                            const [conceptA, conceptB] = conn.key.split('--');
                            const vectorA = mdnaSpace[conceptA];
                            const vectorB = mdnaSpace[conceptB];
                            if (!vectorA || !vectorB) return null;

                            return (
                                <line
                                    key={conn.key}
                                    x1={vectorA[0]} y1={vectorA[1]}
                                    x2={vectorB[0]} y2={vectorB[1]}
                                    stroke="var(--primary-color)"
                                    strokeWidth="0.005"
                                    opacity={conn.weight * 0.7}
                                />
                            );
                        })}
                        {/* Concepts */}
                        {concepts.map(([name, vector]: [string, MDNAVector]) => (
                            <circle
                                key={name}
                                cx={vector[0]}
                                cy={vector[1]}
                                r="0.02"
                                fill={hoveredConcept === name ? "var(--accent-color)" : "var(--primary-color)"}
                                onMouseEnter={() => setHoveredConcept(name)}
                                onMouseLeave={() => setHoveredConcept(null)}
                                style={{ transition: 'fill 0.2s ease' }}
                            />
                        ))}
                        {/* Hovered Concept Label */}
                        {hoveredConcept && mdnaSpace[hoveredConcept] && (
                             <text
                                x={mdnaSpace[hoveredConcept][0]}
                                y={mdnaSpace[hoveredConcept][1] - 0.03}
                                fill="var(--accent-color)"
                                fontSize="0.05"
                                textAnchor="middle"
                                pointerEvents="none"
                            >
                                {hoveredConcept}
                            </text>
                        )}
                    </svg>
                </div>

                <div className="panel-subsection-title">{t('geometricKnowledge_strongestConnections')}</div>
                <div className="hypha-connections-list">
                    {strongestConnections.map(conn => (
                        <div key={conn.key} className="hypha-connection-item" title={`${t('memoryCrystallization_weight')}: ${conn.weight.toFixed(3)}`}>
                            <span className="hypha-source">{conn.key.split('--')[0]}</span>
                            <div className="hypha-weight-bar" style={{'--weight': `${conn.weight * 100}%`} as React.CSSProperties}></div>
                            <span className="hypha-target">{conn.key.split('--')[1]}</span>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="side-panel geometric-knowledge-panel">
           {renderContent()}
        </div>
    );
};