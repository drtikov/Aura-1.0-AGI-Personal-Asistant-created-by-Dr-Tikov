// components/components/MemoryCrystallizationViewer.tsx
import React, { useMemo } from 'react';
import { useMemoryState, useLocalization } from '../../context/AuraContext.tsx';

export const MemoryCrystallizationViewer = React.memo(() => {
    const { memoryNexus: nexus } = useMemoryState();
    const { t } = useLocalization();
    const strongestConnections = useMemo(() => {
        if (!nexus.hyphaeConnections) return [];
        return [...nexus.hyphaeConnections]
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 15);
    }, [nexus.hyphaeConnections]);

    return (
        <div className="side-panel">
            <p className="kg-placeholder" style={{marginBottom: '1rem'}}>
                {t('memoryCrystallization_description')}
            </p>
            <div className="hypha-connections-list">
                {strongestConnections.map(conn => (
                    <div key={conn.id} className="hypha-connection-item" title={`${t('memoryCrystallization_weight')}: ${conn.weight.toFixed(3)}`}>
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