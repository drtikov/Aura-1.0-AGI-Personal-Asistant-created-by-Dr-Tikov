// components/SpandaEnginePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { clamp } from '../utils.ts';

// FIX: Made the 'children' prop optional to resolve a TypeScript error where it was not being correctly inferred from JSX.
const RegionLabel = ({ x, y, children }: { x: number, y: number, children?: React.ReactNode }) => (
    <text x={x} y={y} fill="var(--text-muted)" fontSize="10" textAnchor="middle" style={{ opacity: 0.5 }}>
        {children}
    </text>
);

export const SpandaEnginePanel = () => {
    const { spandaState } = useCoreState();
    const { t } = useLocalization();
    const { point, trajectory, currentRegion } = spandaState;

    const pathData = trajectory.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="side-panel spanda-panel">
            <p className="reason-text">{t('spanda_description')}</p>
            <div className="awareness-item">
                <label>{t('spanda_currentRegion')}</label>
                <strong>{currentRegion}</strong>
            </div>

            <div className="spanda-manifold-container">
                <svg viewBox="-100 -100 200 200" className="spanda-manifold-svg">
                    {/* Axes */}
                    <line x1="-100" y1="0" x2="100" y2="0" stroke="var(--border-color)" strokeWidth="0.5" />
                    <line x1="0" y1="-100" x2="0" y2="100" stroke="var(--border-color)" strokeWidth="0.5" />

                    {/* Region Labels */}
                    <RegionLabel x={60} y={-60}>Sattvic Flow</RegionLabel>
                    <RegionLabel x={-60} y={60}>Tamasic Basin</RegionLabel>
                    <RegionLabel x={0} y={-80}>Rajasic Ascent</RegionLabel>
                    <RegionLabel x={0} y={80}>Lethargic Drift</RegionLabel>
                    
                    {/* Trajectory Path */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="1"
                        style={{ opacity: 0.6 }}
                    />
                    
                    {/* Current State Point */}
                    <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="var(--accent-color)"
                        className="spanda-point"
                    />
                </svg>
            </div>
            <div className="spanda-axes-legend">
                <span>← Chaos</span>
                <span>Order →</span>
            </div>
             <div className="spanda-axes-legend vertical">
                <span>↑ Exploration</span>
                <span>Exploitation ↓</span>
            </div>
        </div>
    );
};