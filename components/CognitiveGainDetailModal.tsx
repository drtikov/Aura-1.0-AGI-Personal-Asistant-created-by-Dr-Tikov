import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { CognitiveGainLogEntry } from '../types';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const CognitiveGainDetailModal = ({ log, onClose }: { log: CognitiveGainLogEntry | null; onClose: () => void }) => {
    const { t } = useLocalization();
    const allMetrics = log ? new Set([...Object.keys(log.previousMetrics), ...Object.keys(log.currentMetrics)]) : new Set();
    const formatMetric = (metric: string, value: number) => { if (metric.toLowerCase().includes('latency')) return `${value.toFixed(0)}ms`; if (metric.toLowerCase().includes('rate') || metric.toLowerCase().includes('accuracy')) return `${(value * 100).toFixed(1)}%`; return value.toFixed(2); }
    
    return (
        <Modal isOpen={!!log} onClose={onClose} title={t('cogGainDetailModal_title')}>
            {log && (
                <>
                    <div className="trace-section"> <h4>{t('cogGainDetailModal_eventDetails')}</h4> <p><strong>{t('cogGainDetailModal_type')}:</strong> {log.eventType}</p> <p><strong>{t('cogGainDetailModal_description')}:</strong> {log.description}</p> <p><strong>{t('cogGainDetailModal_timestamp')}:</strong> {new Date(log.timestamp).toLocaleString()}</p> <p><strong>{t('cogGainDetailModal_compositeGain')}:</strong> <span className={log.compositeGain > 0 ? 'success' : 'failure'}>{log.compositeGain.toFixed(2)}</span></p> </div>
                    <div className="trace-section">
                        <h4>{t('cogGainDetailModal_performanceMetrics')}</h4>
                        <div className="gain-modal-grid">
                            <span className="grid-header">{t('cogGainDetailModal_metric')}</span> <span className="grid-header" style={{textAlign: 'right'}}>{t('cogGainDetailModal_before')}</span> <span className="grid-header" style={{textAlign: 'right'}}>{t('cogGainDetailModal_after')}</span> <span className="grid-header" style={{textAlign: 'right'}}>{t('cogGainDetailModal_change')}</span>
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