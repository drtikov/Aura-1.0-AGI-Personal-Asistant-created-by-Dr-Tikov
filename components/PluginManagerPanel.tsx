// components/PluginManagerPanel.tsx
import React from 'react';
import { useSystemState, useAuraDispatch, useLocalization } from '../context/AuraContext';
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

    const getPluginTypeName = (type: Plugin['type']) => {
        switch (type) {
            case 'TOOL': return 'Tool';
            case 'COPROCESSOR': return 'Coprocessor';
            case 'KNOWLEDGE': return 'Knowledge';
            case 'PERCEPTOR': return 'Perceptor';
            case 'MODULATOR': return 'Modulator';
            case 'GOVERNOR': return 'Governor';
            case 'SYNTHESIZER': return 'Synthesizer';
            case 'ORACLE': return 'Oracle';
            default: return 'Plugin';
        }
    }

    return (
        <div className="side-panel plugin-manager-panel">
            {pluginState.registry.map((plugin: Plugin) => (
                <div key={plugin.id} className="plugin-item">
                    <div className="plugin-info">
                        <h5 className="plugin-name">
                            {plugin.status === 'pending' && <span title="Synthesized Plugin (Pending Integration)">🤖</span>}
                            <span className={`plugin-type-badge type-${plugin.type}`}>{getPluginTypeName(plugin.type)}</span>
                            {t(plugin.name)}
                            {plugin.type === 'KNOWLEDGE' && plugin.knowledge && (
                                <span className="knowledge-data-indicator">
                                    {t('plugin_facts_indicator', { count: plugin.knowledge.length })}
                                </span>
                            )}
                        </h5>
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
});