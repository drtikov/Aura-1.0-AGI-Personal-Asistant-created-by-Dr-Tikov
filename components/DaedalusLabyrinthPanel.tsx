// components/DaedalusLabyrinthPanel.tsx
import React, { useMemo } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { SKGNode, SKGEdge } from '../types.ts';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    if (timestamp === 0) return 'Never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

export const DaedalusLabyrinthPanel = () => {
    const { daedalusLabyrinthState: state } = useArchitectureState();
    const { syscall } = useAuraDispatch();
    const { t } = useLocalization();

    const { status, structuralKnowledgeGraph, lastAnalysis } = state;
    const { nodes, edges } = structuralKnowledgeGraph;

    const handleRunAnalysis = () => {
        // This syscall will be intercepted by the autonomous system hook to run the analysis
        syscall('DAEDALUS/SET_STATE', { status: 'parsing' });
    };

    const GraphVisualization = () => (
        <div className="geometric-map-container">
            <svg viewBox="0 0 200 120" className="geometric-map-svg">
                {/* This is a placeholder visualization */}
                <text x="100" y="60" fill="var(--text-muted)" textAnchor="middle">
                    Graph View (WIP)
                </text>
            </svg>
        </div>
    );

    return (
        <div className="side-panel daedalus-labyrinth-panel">
            <p className="reason-text">{t('daedalus_description')}</p>
            
            <div className="synaptic-metrics" style={{ marginBottom: '1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">{t('daedalus_status')}</span>
                    <span className="metric-value" style={{ textTransform: 'capitalize' }}>
                        {status}
                        {status === 'parsing' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                    </span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('daedalus_last_analysis')}</span>
                    <span className="metric-value">{timeAgo(lastAnalysis, t)}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('daedalus_nodes')}</span>
                    <span className="metric-value">{nodes.length}</span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">{t('daedalus_edges')}</span>
                    <span className="metric-value">{edges.length}</span>
                </div>
            </div>

            <div className="button-grid">
                <button className="control-button" onClick={handleRunAnalysis} disabled={status === 'parsing'}>
                    {t('daedalus_run_analysis')}
                </button>
            </div>

            <div className="panel-subsection-title">Structural Knowledge Graph</div>
            {nodes.length > 0 ? (
                <GraphVisualization />
            ) : (
                <div className="kg-placeholder" style={{minHeight: '150px'}}>
                    {t('daedalus_graph_placeholder')}
                </div>
            )}
        </div>
    );
};