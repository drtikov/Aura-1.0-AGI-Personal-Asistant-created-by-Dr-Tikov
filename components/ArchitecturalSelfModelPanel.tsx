// components/ArchitecturalSelfModelPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Import ArchitecturalComponentSelfModel to resolve type error.
import { ArchitecturalComponentSelfModel, CognitiveModule } from '../types.ts';

export const ArchitecturalSelfModelPanel = React.memo(() => {
    const { architecturalSelfModel: model, cognitiveArchitecture } = useArchitectureState();
    const { t } = useLocalization();

    const hasSelfModel = Object.keys(model.components).length > 0;
    const componentsToRender = hasSelfModel ? Object.values(model.components) : Object.entries(cognitiveArchitecture.components);

    return (
        <div className="side-panel">
            {componentsToRender.length === 0 ? (
                <div className="kg-placeholder">
                    {t('archSelfModel_placeholder')}
                </div>
            ) : (
                <div>
                    <div className="panel-subsection-title">{t('archSelfModel_understoodComponents')}</div>
                    {!hasSelfModel && (
                        <p className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem'}}>
                            {t('archSelfModel_fallback_desc')}
                        </p>
                    )}
                    {componentsToRender.map((item) => {
                        let name: string, purpose: string, efficiency: number, version: string | null = null;
                        if (hasSelfModel) {
                            const component = item as ArchitecturalComponentSelfModel;
                            name = component.name;
                            purpose = component.understoodPurpose;
                            efficiency = component.perceivedEfficiency;
                        } else {
                            const [compName, compData] = item as [string, CognitiveModule];
                            name = compName;
                            purpose = `Direct view of active component. Status: ${compData.status}.`;
                            efficiency = 1.0; // Assume 100% for direct view
                            version = compData.version;
                        }

                        return (
                            <div key={name} className="mod-log-item" style={{marginBottom: '0.5rem'}}>
                                <div className="mod-log-header">
                                    <span className="mod-log-type">{name.replace(/_/g, ' ')}{version ? ` (v${version})` : ''}</span>
                                    <span className="mod-log-status" title={`${t('archSelfModel_perceivedEfficiency')}: ${efficiency.toFixed(2)}`}>
                                        {(efficiency * 100).toFixed(0)}% {t('archSelfModel_effAbbr')}
                                    </span>
                                </div>
                                <p className="mod-log-description" style={{fontStyle: 'italic'}}>
                                    "{purpose}"
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
});