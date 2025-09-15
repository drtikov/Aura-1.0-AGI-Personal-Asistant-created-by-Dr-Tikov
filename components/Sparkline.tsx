import React from 'react';

export const Sparkline = ({ data, strokeColor, width = 100, height = 30, className = "" }: { data: number[], strokeColor: string, width?: number, height?: number, className?: string }) => {
    if (!data || data.length < 2) {
        return <div className="sparkline-placeholder">Not enough data</div>;
    }
    
    // Handle data that is all the same value
    const uniqueDataPoints = new Set(data);
    const isFlat = uniqueDataPoints.size === 1;

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const yRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;
    
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        // If flat, draw a straight line in the middle. Otherwise, map to height.
        const y = isFlat ? height / 2 : height - ((d - minVal) / yRange) * (height - 4) + 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className={`sparkline-svg ${className}`} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    );
};
