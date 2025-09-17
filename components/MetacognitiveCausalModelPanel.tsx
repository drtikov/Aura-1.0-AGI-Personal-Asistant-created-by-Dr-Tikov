import React from 'react';
import { MetacognitiveLink } from '../types';
import { useSystemState } from '../context/AuraContext';

const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim();

const CorrelationArrow = ({ correlation }: { correlation: number }) => {
    if (correlation > 0.1) return <span style={{ color: 'var(--success-color)' }}>↑ INCREASE</span>;
    if (correlation < -0.1) return <span style={{ color: 'var(--failure-color)' }}>↓ DECREASE</span>;
    return <span style={{ color: 'var(--text-muted)' }}>- NO EFFECT</span>;
};

export const MetacognitiveCausalModelPanel = React.memo(() => {
    const { metacognitiveCausalModel: model } = useSystemState();
    const links = Object.values(model).sort((a, b) => b.lastUpdated - a.lastUpdated);

    return (
        <div className="side-panel">
            {links.length === 0 ? (
                <div className="kg-placeholder">No metacognitive causal links have been discovered yet. The system will analyze its performance over time to build this model.</div>
            ) : (
                links.map(link => (
                    <div key={link.id} className="causal-link source-rie" style={{ background: 'rgba(0, 255, 255, 0.05)' }}>
                        <div className="causal-link-header">
                            <span className="causal-cause" style={{color: 'var(--primary-color)'}}>
                                WHEN {formatKey(link.source.key)} is {link.source.condition}
                            </span>
                            <span className="causal-confidence" title={`Correlation: ${link.correlation.toFixed(2)}`}>
                                ({(link.correlation * 100).toFixed(0)}%)
                            </span>
                        </div>
                        <div className="causal-effect">
                            <span className="causal-effect-arrow">→</span>
                            PERFORMANCE of <strong style={{color: 'var(--accent-color)'}}>{formatKey(link.target.key)}</strong>'s {formatKey(link.target.metric)} shows a...
                        </div>
                        <div className="causal-effect" style={{ marginTop: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                            <CorrelationArrow correlation={link.correlation} />
                        </div>
                         <div className="causal-link-footer">
                            Based on {link.observationCount} observations.
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});