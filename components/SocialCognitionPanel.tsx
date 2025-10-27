import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { SocialGraphNode } from '../types.ts';

export const SocialCognitionPanel = React.memo(() => {
    const { socialCognitionState } = useCoreState();
    const { t } = useLocalization();
    const { socialGraph, culturalModel } = socialCognitionState;
    const nodes = Object.values(socialGraph);

    return (
        <div className="side-panel social-cognition-panel">
            <div className="panel-subsection-title">{t('social_graph')}</div>
            {nodes.length === 0 ? (
                <div className="kg-placeholder">{t('social_noNodes')}</div>
            ) : (
                nodes.map((node: SocialGraphNode) => (
                    <div key={node.id} className="mod-log-item" style={{ marginBottom: '0.5rem' }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{node.name}</span>
                            <span className="mod-log-status">{node.type}</span>
                        </div>
                        <p className="mod-log-description" style={{fontStyle: 'italic'}}>"{node.summary}"</p>
                        {node.relationships.length > 0 && (
                            <div className="relationships-list" style={{marginTop: '0.5rem'}}>
                                <strong>{t('social_relationships')}:</strong>
                                {node.relationships.map((rel, i) => (
                                    <span key={i} className="skill-tag">{rel.type}: {rel.targetId} ({(rel.strength * 100).toFixed(0)}%)</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
            <div className="panel-subsection-title">{t('social_culturalModel')}</div>
            <div className="cultural-model-display" style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <p><strong>{t('social_norms')}:</strong> {culturalModel.norms.join(', ') || 'N/A'}</p>
                <p><strong>{t('social_values')}:</strong> {culturalModel.values.join(', ') || 'N/A'}</p>
                <p><strong>{t('social_idioms')}:</strong> {culturalModel.idioms.join(', ') || 'N/A'}</p>
            </div>
        </div>
    );
});