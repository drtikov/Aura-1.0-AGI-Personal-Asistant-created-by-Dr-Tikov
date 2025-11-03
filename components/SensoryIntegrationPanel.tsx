// components/SensoryIntegrationPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useArchitectureState } from '../context/AuraContext.tsx';
import { CoprocessorArchitecture } from '../types.ts';

export const SensoryIntegrationPanel = () => {
    const { sensoryIntegration } = useCoreState();
    const { cognitiveArchitecture } = useArchitectureState();
    const { t } = useLocalization();

    // This panel is only relevant for the Sensory Integration architecture
    if (cognitiveArchitecture.coprocessorArchitecture !== CoprocessorArchitecture.SENSORY_INTEGRATION) {
        return (
            <div className="side-panel">
                 <div className="kg-placeholder">{t('sensoryHub_inactive')}</div>
            </div>
        );
    }

    const { proprioceptiveOutput, linguisticOutput, structuralOutput, hubLog } = sensoryIntegration;
    const timeAgo = (timestamp: number) => `${Math.floor((Date.now() - timestamp) / 1000)}s ago`;

    return (
        <div className="side-panel command-log-panel">
            <div className="panel-subsection-title">{t('sensoryHub_proprioceptive')}</div>
            <div className="sensory-output-grid">
                {Object.entries(proprioceptiveOutput).map(([key, value]) => (
                    <div key={key} className="metric-item">
                        <span className="metric-label">{key}</span>
                        <span className="metric-value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('sensoryHub_linguistic')}</div>
            <div className="sensory-output-grid">
                {Object.entries(linguisticOutput).map(([key, value]) => (
                    <div key={key} className="metric-item">
                        <span className="metric-label">{key}</span>
                        <span className="metric-value">{value}</span>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('sensoryHub_structural')}</div>
            <div className="sensory-output-grid">
                 {Object.entries(structuralOutput).map(([key, value]) => (
                    <div key={key} className="metric-item">
                        <span className="metric-label">{key}</span>
                        <span className="metric-value">{JSON.stringify(value)}</span>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('sensoryHub_log')}</div>
            <div className="command-log-list">
                {hubLog.map(entry => (
                    <div key={entry.timestamp} className="command-log-item log-type-info">
                        <span className="log-icon">↔️</span>
                        <span className="log-text">{entry.message}</span>
                        <span className="log-time">{timeAgo(entry.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};