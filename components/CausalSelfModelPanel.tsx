import React from 'react';
import { CausalSelfModel } from '../types';

export const CausalSelfModelPanel = React.memo(({ model }: { model: CausalSelfModel }) => {
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="side-panel causal-model-panel">
            <div className="causal-model-content">
                {Object.values(model).length > 0 
                    ? Object.entries(model).map(([causeKey, link]) => (
                        <div key={link.id} className={`causal-link source-${link.source}`}>
                            <div className="causal-link-header">
                                <span className="causal-cause" title={causeKey}>{causeKey.replace(/_/g, ' ')}</span>
                                <span className="causal-confidence" title={`Confidence: ${link.confidence.toFixed(2)}`}>
                                    ({(link.confidence * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="causal-effect">
                                <span className="causal-effect-arrow">→</span>
                                {link.causes}
                            </div>
                            <div className="causal-link-footer">
                                Learned via {link.source.toUpperCase()} ({timeAgo(link.lastUpdated)})
                            </div>
                        </div>
                    )) 
                    : <div className="kg-placeholder">Causal self-model is empty.</div>
                }
            </div>
        </div>
    );
});
