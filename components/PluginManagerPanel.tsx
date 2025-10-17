// components/PluginManagerPanel.tsx
import React, { useMemo } from 'react';
import { useSystemState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Plugin } from '../types';

export const PluginManagerPanel = React.memo(() => {
    const { pluginState } = useSystemState();
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const handleToggle = (plugin: Plugin) => {
        if (plugin.status === 'pending') {
            addToast(t('plugin_pending_toast'), 'info');
            return;
        }
        const newStatus = plugin.status === 'enabled' ? 'disabled' : 'enabled';
        
        // Handle knowledge ingestion as a side-effect in the UI handler
        if (plugin.type === 'KNOWLEDGE' && newStatus === 'enabled' && plugin.knowledge) {
            syscall('ADD_FACTS_BATCH', plugin.knowledge);
            addToast(`Knowledge package "${t(plugin.name)}" ingested.`, 'success');
        }

        syscall('PLUGIN/SET_STATUS', { pluginId: plugin.id, status: newStatus });
    };

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
    
    const groupOrder: Plugin['type'][] = ['TOOL', 'COPROCESSOR', 'KNOWLEDGE'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {groupOrder.map(groupType => {
                const pluginsInGroup = groupedPlugins[groupType];
                if (!pluginsInGroup || pluginsInGroup.length === 0) return null;
                
                return (
                    <div key={groupType}>
                        <h4 className="panel-subsection-title" style={{ marginTop: 0 }}>
                            {t(`plugin_group_${groupType}`)}
                        </h4>
                        {pluginsInGroup.map((plugin: Plugin) => (
                            <div key={plugin.id} className="plugin-item">
                                <div className="plugin-info">
                                    <div className="plugin-name">
                                        <span className={`plugin-type-badge type-${plugin.type}`}>{plugin.type}</span>
                                        {t(plugin.name)}
                                        {plugin.type === 'KNOWLEDGE' && plugin.knowledge && (
                                            <span className="knowledge-data-indicator">
                                                {t('plugin_facts_indicator', { count: plugin.knowledge.length })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="plugin-description">{t(plugin.description)}</p>
                                </div>
                                <div className="plugin-controls">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={plugin.status === 'enabled'}
                                            onChange={() => handleToggle(plugin)}
                                            disabled={plugin.status === 'pending'}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
});