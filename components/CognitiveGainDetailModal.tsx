import React from 'react';
import { CognitiveGainLogEntry } from '../types';
import { Modal } from './Modal';

export const CognitiveGainDetailModal = ({ log, onClose }: { log: CognitiveGainLogEntry | null; onClose: () => void }) => {
    const allMetrics = log ? new Set([...Object.keys(log.previousMetrics), ...Object.keys(log.currentMetrics)]) : new Set();
    const formatMetric = (metric: string, value: number) => { if (metric.toLowerCase().includes('latency')) return `${value.toFixed(0)}ms`; if (metric.toLowerCase().includes('rate') || metric.toLowerCase().includes('accuracy')) return `${(value * 100).toFixed(1)}%`; return value.toFixed(2); }
    
    return (
        <Modal isOpen={!!log} onClose={onClose} title="Cognitive Gain Analysis">
            {log && (
                <>
                    <div className="trace-section"> <h4>Event Details</h4> <p><strong>Type:</strong> {log.eventType}</p> <p><strong>Description:</strong> {log.description}</p> <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p> <p><strong>Composite Gain:</strong> <span className={log.compositeGain > 0 ? 'success' : 'failure'}>{log.compositeGain.toFixed(2)}</span></p> </div>
                    <div className="trace-section">
                        <h4>Performance Metrics</h4>
                        <div className="gain-modal-grid">
                            <span className="grid-header">Metric</span> <span className="grid-header" style={{textAlign: 'right'}}>Before</span> <span className="grid-header" style={{textAlign: 'right'}}>After</span> <span className="grid-header" style={{textAlign: 'right'}}>Change</span>
                            {Array.from(allMetrics).map((metric: string) => {
                                const before = log.previousMetrics[metric] ?? 0; const after = log.currentMetrics[metric] ?? 0; const gain = log.gainScores[metric] ?? 0;
                                return ( <React.Fragment key={metric}> <span className="metric-row">{metric.replace(/_/g, ' ')}</span> <span className="metric-row" style={{textAlign: 'right'}}>{formatMetric(metric, before)}</span> <span className="metric-row" style={{textAlign: 'right'}}>{formatMetric(metric, after)}</span> <span className={`metric-delta ${gain > 0 ? 'positive' : gain < 0 ? 'negative' : 'neutral'}`}> {gain > 0 ? '+' : ''}{formatMetric(metric, gain)} </span> </React.Fragment> );
                            })}
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
};