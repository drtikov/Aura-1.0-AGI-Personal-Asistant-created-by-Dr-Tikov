import React from 'react';
import { useAuraDispatch, useLocalization, useMemoryState } from '../context/AuraContext';
import { Accordion } from './Accordion';
import { EpisodicMemoryPanel } from './EpisodicMemoryPanel';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { MemoryCrystallizationViewer } from './MemoryCrystallizationViewer';

export const UnifiedMemoryPanel = () => {
    const { dispatch } = useAuraDispatch();
    const { knowledgeGraph, episodicMemoryState } = useMemoryState();
    const { t } = useLocalization();

    const summary = () => {
        const factCount = knowledgeGraph.length;
        const episodeCount = episodicMemoryState.episodes.length;
        return `${t('panelSummaryFacts', { count: factCount })} | ${t('panelSummaryEpisodes', { count: episodeCount })}`;
    };

    return (
        <Accordion title={t('title_unifiedMemory')} defaultOpen={true} summary={summary()}>
            <Accordion title={t('title_episodicMemory')} defaultOpen={true}>
                <EpisodicMemoryPanel />
            </Accordion>
            <Accordion title={t('title_memoryCrystallization')} defaultOpen={false}>
                <MemoryCrystallizationViewer />
            </Accordion>
            <Accordion title={t('title_knowledgeGraph')} defaultOpen={false}>
                <KnowledgeGraphPanel />
            </Accordion>
        </Accordion>
    );
};