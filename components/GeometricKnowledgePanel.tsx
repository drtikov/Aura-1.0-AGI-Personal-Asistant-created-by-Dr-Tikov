// components/GeometricKnowledgePanel.tsx
import React, { useMemo, useState } from 'react';
import { useMemoryState, useLocalization } from '../context/AuraContext.tsx';
import { MDNAVector, ConnectionData } from '../types.ts';

export const GeometricKnowledgePanel = () => {
    const { mdnaSpace, conceptConnections } = useMemoryState();
    const { t } = useLocalization();
    const [hoveredConcept, setHoveredConcept] = useState<string | null>(null);

    const concepts = useMemo(() => Object.entries(mdnaSpace), [mdnaSpace]);
    
    const strongestConnections = useMemo(() => {
        return Object.entries(conceptConnections)
            .map(([key, data]: [string, ConnectionData]) => ({ key, ...data }))
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 15);
    }, [conceptConnections]);

    const viewBoxSize = 2.4;
    const center = viewBoxSize / 2;

    // A simple 2D projection from the high-dimensional MDNA vector
    const projectTo2D = (vector: MDNAVector) => {
        if (!vector || vector.length < 2) return { x: center, y: center };
        // Use first two dimensions and scale to fit viewbox
        return {
            x: center + vector[0] * (center * 0.9),
            y: center + vector[1] * (center * 0.9)
        };
    };

    const renderContent = () => {
        if (concepts.length === 0) {
            return <div className="kg-placeholder">{t('geometricKnowledge_placeholder')}</div>;
        }

        // FIX: Explicitly type the Map generic to ensure TS knows the shape of its values.
        const conceptPositions = new Map<string, { x: number; y: number }>(concepts.map(([name, vector]) => [name, projectTo2D(vector as MDNAVector)]));
        const hoveredPos = hoveredConcept ? conceptPositions.get(hoveredConcept) : null;

        return (
            <div className="geometric-knowledge-layout">
                <div className="geometric-map-container">
                    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="geometric-map-svg">
                        {/* Render connections */}
                        {strongestConnections.map(({ key, weight }) => {
                            const [source, target] = key.split('--');
                            if (!source || !target) return null;
                            const posA = conceptPositions.get(source);
                            const posB = conceptPositions.get(target);
                            if (!posA || !posB) return null;
                            return (
                                <line
                                    key={key}
                                    x1={posA.x} y1={posA.y}
                                    x2={posB.x} y2={posB.y}
                                    stroke="var(--primary-color)"
                                    strokeWidth={0.01 + weight * 0.05}
                                    opacity={0.1 + weight * 0.5}
                                />
                            );
                        })}
                        
                        {/* Render concepts */}
                        {concepts.map(([name, vector]) => {
                            const pos = conceptPositions.get(name);
                            if (!pos) return null;
                            const isHovered = name === hoveredConcept;
                            return (
                                <circle
                                    key={name}
                                    cx={pos.x} cy={pos.y}
                                    r={isHovered ? 0.05 : 0.03}
                                    fill={isHovered ? "var(--accent-color)" : "var(--primary-color)"}
                                    onMouseEnter={() => setHoveredConcept(name)}
                                    onMouseLeave={() => setHoveredConcept(null)}
                                    style={{ transition: 'r 0.2s ease' }}
                                />
                            );
                        })}

                        {/* Render label for hovered concept */}
                        {hoveredPos && (
                            <text
                                x={hoveredPos.x} y={hoveredPos.y - 0.07}
                                fill="var(--accent-color)"
                                textAnchor="middle"
                                fontSize="0.08"
                                style={{ pointerEvents: 'none' }}
                            >
                                {hoveredConcept}
                            </text>
                        )}
                    </svg>
                </div>
                <div className="geometric-connections-list">
                    <div className="panel-subsection-title">{t('geometricKnowledge_strongestConnections')}</div>
                     {strongestConnections.map(conn => {
                        const [source, target] = conn.key.split('--');
                        if (!source || !target) return null;
                        return (
                            <div key={conn.key} className="hypha-connection-item">
                                <span className="hypha-source">{source}</span>
                                <div 
                                    className="hypha-weight-bar"
                                    style={{ '--weight': `${Math.min(conn.weight * 100, 100)}%` } as React.CSSProperties}
                                ></div>
                                <span className="hypha-target">{target}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="side-panel">
            {renderContent()}
        </div>
    );
};