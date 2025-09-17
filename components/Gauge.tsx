
import React from 'react';

export const Gauge = React.memo(({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => (
    <div className="gauge-container">
        <svg viewBox="0 0 120 70" className="gauge-svg">
            <path d="M10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--border-color)" strokeWidth="6" strokeLinecap="round" />
            <path
                d="M10 60 A 50 50 0 0 1 110 60"
                fill="none"
                className={`gauge-value ${colorClass}`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="157"
                strokeDashoffset={157 - (value * 157)}
            />
        </svg>
        <div className="gauge-label">{label}</div>
        <div className="gauge-text">{(value * 100).toFixed(0)}%</div>
    </div>
));
