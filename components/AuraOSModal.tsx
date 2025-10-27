// components/AuraOSModal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { PanelConfig, mainControlDeckLayout, advancedControlsLayout } from './controlDeckConfig.tsx';

interface AuraOSModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPanel?: string;
}

const flattenPanels = (panels: PanelConfig[]): PanelConfig[] => {
    const allPanels: PanelConfig[] = [];
    const flatten = (p: PanelConfig[]) => {
        for (const panel of p) {
            if (panel.children) {
                // For AuraOS, we flatten the groups into a single list of panels
                // The group titles are handled separately in the UI.
                flatten(panel.children);
            } else if (panel.component) {
                allPanels.push(panel);
            }
        }
    };
    flatten(panels);
    return allPanels;
};

const getAllPanels = (layout: PanelConfig[]): PanelConfig[] => {
    const all: PanelConfig[] = [];
    const recurse = (panels: PanelConfig[]) => {
        for (const panel of panels) {
            if (panel.component) {
                all.push(panel);
            }
            if (panel.children) {
                recurse(panel.children);
            }
        }
    };
    recurse(layout);
    return all;
};


export const AuraOSModal = ({ isOpen, onClose, initialPanel }: AuraOSModalProps) => {
    const { t } = useLocalization();
    const handlers = useAuraDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const [activePanel, setActivePanel] = useState<PanelConfig | null>(null);

    const allPanelConfigs = useMemo(() => [
        ...getAllPanels(mainControlDeckLayout),
        ...getAllPanels(advancedControlsLayout)
    ], []);

    useEffect(() => {
        if (isOpen) {
            if (initialPanel) {
                const panelToOpen = allPanelConfigs.find(p => p.id === initialPanel);
                setActivePanel(panelToOpen || null);
            } else {
                setActivePanel(null);
            }
            setSearchQuery('');
        }
    }, [isOpen, initialPanel, allPanelConfigs]);

    const panelGroups = useMemo(() => ([
        { titleKey: 'selfAwareness', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'self')) },
        { titleKey: 'userAwareness', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'user')) },
        { titleKey: 'unifiedMemory', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'memory')) },
        { titleKey: 'planningAndGoals', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'planning')) },
        { titleKey: 'cognitiveEngines', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'engines')) },
        { titleKey: 'logsAndPerformance', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'logs')) },
        { titleKey: 'systemInternals', panels: flattenPanels(mainControlDeckLayout.filter(p => p.id === 'system')) },
        // FIX: The advanced controls layout is hierarchical, but the UI expects a flat list of panels under a single group.
        // Flatten the advanced layout to match the expected structure.
        ...advancedControlsLayout.map(group => ({
            titleKey: group.titleKey,
            panels: (group.children || []).sort((a,b) => t(a.titleKey).localeCompare(t(b.titleKey)))
        }))
    ]), [t]);

    const filteredPanelGroups = useMemo(() => {
        if (!searchQuery.trim()) {
            return panelGroups;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        
        return panelGroups
            .map(group => ({
                ...group,
                panels: group.panels.filter(panel =>
                    t(panel.titleKey).toLowerCase().includes(lowercasedQuery)
                ),
            }))
            .filter(group => group.panels.length > 0);
    }, [searchQuery, panelGroups, t]);
    
    // Create a comprehensive map from panel ID to component
    const allPanels = useMemo(() => {
        const panelMap: { [key: string]: React.ComponentType<any> } = {};
        // FIX: Flatten the advanced layout to correctly build the map of all available panels.
        const allConfigs = [...getAllPanels(mainControlDeckLayout), ...getAllPanels(advancedControlsLayout)];
        allConfigs.forEach(p => {
            if(p.component) {
                panelMap[p.id] = p.component;
            }
        });
        return panelMap;
    }, []);

    const PanelComponent = activePanel ? allPanels[activePanel.id] : null;
    const componentProps = activePanel && activePanel.props ? activePanel.props(handlers) : {};
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('auraOS_title')} className="aura-os-modal">
            <div className="aura-os-layout">
                <nav className="aura-os-nav">
                    <input
                        type="text"
                        className="aura-os-search"
                        placeholder={t('auraOS_search_placeholder')}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        aria-label={t('auraOS_search_placeholder')}
                    />
                    <div className="aura-os-nav-list">
                        {filteredPanelGroups.map(group => (
                            <div key={group.titleKey}>
                                <h3 className="aura-os-nav-group">{t(group.titleKey)}</h3>
                                {group.panels.map(panel => (
                                    <button
                                        key={panel.id}
                                        className={`aura-os-nav-item ${activePanel?.id === panel.id ? 'active' : ''}`}
                                        onClick={() => setActivePanel(panel)}
                                    >
                                        {t(panel.titleKey)}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </nav>
                <main className="aura-os-content" role="tabpanel">
                    {activePanel && PanelComponent ? (
                        <>
                            <h2 className="aura-os-content-header">{t(activePanel.titleKey)}</h2>
                            <PanelComponent {...componentProps} />
                        </>
                    ) : (
                        <div className="aura-os-content-placeholder">
                            <pre aria-hidden="true">
                                {`
      /\\
     /  \\
    /____\\
   /______\\
  /________\\
 /__________\\
/____________\\
                                `}
                            </pre>
                            <h3>{t('auraOS_welcome_title')}</h3>
                            <p>{t('auraOS_welcome_desc')}</p>
                        </div>
                    )}
                </main>
            </div>
        </Modal>
    );
};