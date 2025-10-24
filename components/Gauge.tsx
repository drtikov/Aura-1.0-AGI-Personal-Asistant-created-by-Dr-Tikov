

import React, { useEffect, useRef } from 'react';

declare const anime: any;

export const Gauge = React.memo(({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof anime === 'undefined') return;

        const circumference = 157;
        const offset = circumference - (value * circumference);

        anime({
            targets: pathRef.current,
            strokeDashoffset: offset,
            duration: 750,
            easing: 'easeOutQuad'
        });

        const textValue = { val: parseFloat(textRef.current?.textContent || '0') };
        anime({
            targets: textValue,
            val: value * 100,
            round: 1,
            duration: 750,
            easing: 'easeOutQuad',
            update: () => {
                if (textRef.current) {
                    textRef.current.textContent = String(Math.round(textValue.val));
                }
            }
        });

    }, [value]);
    
    return (
        <div className="gauge-container">
            <svg viewBox="0 0 120 70" className="gauge-svg">
                <path d="M10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--border-color)" strokeWidth="6" strokeLinecap="round" />
                <path
                    ref={pathRef}
                    d="M10 60 A 50 50 0 0 1 110 60"
                    fill="none"
                    className={`gauge-value ${colorClass}`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="157"
                    strokeDashoffset={157}
                />
            </svg>
            <div className="gauge-label">{label}</div>
            <div className="gauge-text">
                <span ref={textRef}>{(value * 100).toFixed(0)}</span>%
            </div>
        </div>
    );
});