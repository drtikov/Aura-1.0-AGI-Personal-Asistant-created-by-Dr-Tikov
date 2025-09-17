import React, { useMemo } from 'react';
import { useMemoryState } from '../context/AuraContext';

export const MemoryCrystallizationViewer = React.memo(() => {
    const { memoryNexus: nexus } = useMemoryState();
    const strongestConnections = useMemo(() => {
        if (!nexus.hyphaeConnections) return [];
        return [...nexus.hyphaeConnections]
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 15);
    }, [nexus.hyphaeConnections]);

    return (
        <div className="side-panel">
            <p className="kg-placeholder" style={{marginBottom: '1rem'}}>
                Long-term memory is stored as weighted connections between cognitive cores. Below are the strongest connections, representing the most stable "memory crystals."
            </p>
            <div className="hypha-connections-list">
                {strongestConnections.map(conn => (
                    <div key={conn.id} className="hypha-connection-item" title={`Weight: ${conn.weight.toFixed(3)}`}>
                        <span className="hypha-source">{conn.source.replace(/_/g, ' ')}</span>
                        <div 
                            className="hypha-weight-bar"
                            style={{ '--weight': `${Math.min(conn.weight * 100, 100)}%` } as React.CSSProperties}
                        ></div>
                        <span className="hypha-target">{conn.target.replace(/_/g, ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});