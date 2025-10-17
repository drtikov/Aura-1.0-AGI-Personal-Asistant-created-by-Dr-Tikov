// components/UnifiedMemoryPanel.tsx
import React from 'react';
import { useAuraDispatch, useLocalization, useMemoryState } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion';
import { EpisodicMemoryPanel } from './EpisodicMemoryPanel';
import { KnowledgeGraphPanel } from './KnowledgeGraphPanel';
import { MemoryCrystallizationViewer } from './MemoryCrystallizationViewer';
import { GeometricKnowledgePanel } from './GeometricKnowledgePanel';

export const UnifiedMemoryPanel = () => {
    const { t } = useLocalization();

    return (
        <>
            <Accordion title={t('episodicMemory')} defaultOpen={true}>
                <EpisodicMemoryPanel />
            </Accordion>
            <Accordion title="Geometric Knowledge" defaultOpen={false}>
                <GeometricKnowledgePanel />
            </Accordion>
            <Accordion title={t('memoryCrystallization')} defaultOpen={false}>
                <MemoryCrystallizationViewer />
            </Accordion>
            <Accordion title={t('knowledgeGraph')} defaultOpen={false}>
                <KnowledgeGraphPanel />
            </Accordion>
        </>
    );
};