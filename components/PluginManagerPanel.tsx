// components/PluginManagerPanel.tsx
import React, { useMemo } from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext.tsx';
import { Plugin } from '../types';

export const PluginManagerPanel = React.memo(() => {
    const { pluginState } = useSystemState();
    const { t } = useLocalization();

    const groupedPlugins = useMemo(() => {
        return pluginState.registry.reduce((acc, plugin) => {
            const type = plugin.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(plugin);
            return acc;
        }, {} as Record<Plugin['type'], Plugin[]>);
    }, [pluginState.registry]);
    
    const groupOrder: { type: Plugin['type'], className: string }[] = [
        { type: 'TOOL', className: 'tools' },
        { type: 'COPROCESSOR', className: 'coprocessors' },
        { type: 'KNOWLEDGE', className: 'knowledge' },
    ];

    const getCardClass = (type: Plugin['type']) => {
        switch (type) {
            case 'TOOL': return 'tool';
            case 'KNOWLEDGE': return 'knowledge';
            case 'COPROCESSOR': return 'coprocessor';
            default: return '';
        }
    };

    return (
        <div className="plugin-manager-content">
            {groupOrder.map(group => {
                const pluginsInGroup = groupedPlugins[group.type];
                if (!pluginsInGroup || pluginsInGroup.length === 0) return null;
                
                return (
                    <div key={group.type} className="plugin-group">
                        <h3 className={`plugin-group-header ${group.className}`}>
                            {t(`plugin_group_${group.type}`)}
                        </h3>
                        <div className="plugin-card-grid">
                             {pluginsInGroup.map((plugin: Plugin) => (
                                <div key={plugin.id} className={`plugin-card ${getCardClass(plugin.type)}`}>
                                    <div className="plugin-card-header">
                                        <div className="plugin-card-name">{t(plugin.name)}</div>
                                        <div className={`plugin-card-status ${plugin.status}`} title={`${plugin.status}`}></div>
                                    </div>
                                    <p className="plugin-card-desc">{t(plugin.description)}</p>
                                    {plugin.type === 'KNOWLEDGE' && plugin.knowledge && (
                                        <div className="plugin-fact-count">
                                            {t('plugin_facts_indicator', { count: plugin.knowledge.length })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});