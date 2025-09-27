// components/PluginManagerPanel.tsx
import React from 'react';
import { useSystemState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { Plugin } from '../types';

export const PluginManagerPanel = React.memo(() => {
    const { pluginState } = useSystemState();
    const { dispatch, addToast } = useAuraDispatch();
    const { t } = useLocalization();

    const handleToggle = (plugin: Plugin) => {
        const newStatus = plugin.status === 'enabled' ? 'disabled' : 'enabled';
        
        // Handle knowledge ingestion as a side-effect in the UI handler
        if (plugin.type === 'KNOWLEDGE' && newStatus === 'enabled' && plugin.knowledge) {
            dispatch({ 
                type: 'SYSCALL', 
                payload: { 
                    call: 'ADD_FACTS_BATCH', 
                    args: plugin.knowledge 
                } 
            });
            addToast(`Knowledge package "${plugin.name}" ingested.`, 'success');
        }

        dispatch({
            type: 'SYSCALL',
            payload: {
                call: 'PLUGIN/SET_STATUS',
                args: { pluginId: plugin.id, status: newStatus }
            }
        });
    };

    const getPluginTypeName = (type: Plugin['type']) => {
        switch (type) {
            case 'TOOL': return 'Tool';
            case 'COPROCESSOR': return 'Coprocessor';
            case 'KNOWLEDGE': return 'Knowledge';
            default: return 'Plugin';
        }
    }

    return (
        <div className="side-panel plugin-manager-panel">
            {pluginState.registry.map((plugin: Plugin) => (
                <div key={plugin.id} className="plugin-item">
                    <div className="plugin-info">
                        <h5 className="plugin-name">
                            <span className={`plugin-type-badge type-${plugin.type}`}>{getPluginTypeName(plugin.type)}</span>
                            {t(plugin.name)}
                        </h5>
                        <p className="plugin-description">{t(plugin.description)}</p>
                    </div>
                    <div className="plugin-controls">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={plugin.status === 'enabled'}
                                onChange={() => handleToggle(plugin)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
});