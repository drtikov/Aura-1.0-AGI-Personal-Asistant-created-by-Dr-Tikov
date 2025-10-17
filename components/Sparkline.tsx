// components/Sparkline.tsx
import React, { useState, useRef } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const Sparkline = ({ data, strokeColor, width = 100, height = 30, className = "" }: { data: number[], strokeColor: string, width?: number, height?: number, className?: string }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string; visible: boolean } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const { t } = useLocalization();

    if (!data || data.length < 2) {
        return <div className="sparkline-placeholder">{t('sparkline_noData')}</div>;
    }

    const uniqueDataPoints = new Set(data);
    const isFlat = uniqueDataPoints.size === 1;
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const yRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = isFlat ? height / 2 : height - ((d - minVal) / yRange) * (height - 4) + 2;
        return { x, y, value: d };
    });

    const pathD = points.map((p, i) => i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`).join(' ');

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        
        const closestPoint = points.reduce((prev, curr) => 
            Math.abs(curr.x - mouseX) < Math.abs(prev.x - mouseX) ? curr : prev
        );
        
        setTooltip({
            x: closestPoint.x,
            y: closestPoint.y,
            value: closestPoint.value.toFixed(2),
            visible: true
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div style={{ position: 'relative' }}>
            <svg
                ref={svgRef}
                className={`sparkline-svg ${className}`}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <path
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    d={pathD}
                />
                {tooltip && tooltip.visible && (
                    <circle
                        className="sparkline-indicator"
                        cx={tooltip.x}
                        cy={tooltip.y}
                        r="2.5"
                    />
                )}
            </svg>
            {tooltip && tooltip.visible && (
                <div
                    className={`sparkline-tooltip visible`}
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                    }}
                >
                    {tooltip.value}
                </div>
            )}
        </div>
    );
};