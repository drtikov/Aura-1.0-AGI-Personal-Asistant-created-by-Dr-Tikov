// components/SelfDevelopmentPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { WisdomIngestionPanel } from './WisdomIngestionPanel.tsx';
import { useMemoryState, useSystemState } from '../context/AuraContext.tsx';

export const SelfDevelopmentPanel = () => {
    const { t } = useLocalization();
    const { knowledgeGraph } = useMemoryState();
    const { pluginState } = useSystemState();

    const knowledgePlugins = pluginState.registry.filter(p => p.type === 'KNOWLEDGE');

    return (
        <div className="side-panel self-development-panel">
            <p className="reason-text">{t('self_development_desc')}</p>
            
            <Accordion title={t('selfDevelopment_docAnalysis_title')} defaultOpen={true}>
                <WisdomIngestionPanel />
            </Accordion>
            
            <Accordion title={t('knowledge_summary_title')} defaultOpen={false}>
                <div className="secondary-metrics" style={{gridTemplateColumns: '1fr', textAlign: 'left', gap: '0.5rem'}}>
                    <div className="metric-item">
                        <span className="metric-label">{t('total_facts_label')}</span>
                        <span className="metric-value">{knowledgeGraph.length}</span>
                    </div>
                     <div className="metric-item">
                        <span className="metric-label">{t('knowledge_plugins_label')}</span>
                        <span className="metric-value">{knowledgePlugins.length}</span>
                    </div>
                </div>
                <ul className="plugin-list" style={{fontSize: '0.8rem', marginTop: '0.5rem', listStyle: 'none', padding: 0}}>
                    {knowledgePlugins.map(p => <li key={p.id} style={{padding: '0.2rem', borderBottom: '1px solid var(--border-color)'}}>{t(p.name)}</li>)}
                </ul>
            </Accordion>
        </div>
    );
};
