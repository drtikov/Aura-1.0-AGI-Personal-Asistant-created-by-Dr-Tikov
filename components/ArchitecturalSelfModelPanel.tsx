import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const ArchitecturalSelfModelPanel = React.memo(() => {
    const { architecturalSelfModel: model } = useArchitectureState();
    const { t } = useLocalization();
    
    return (
        <div className="side-panel">
            {Object.keys(model.components).length === 0 ? (
                <div className="kg-placeholder">
                    {t('archSelfModel_placeholder')}
                </div>
            ) : (
                <div>
                    <div className="panel-subsection-title">{t('archSelfModel_understoodComponents')}</div>
                    {Object.values(model.components).map(component => (
                        <div key={component.name} className="mod-log-item" style={{marginBottom: '0.5rem'}}>
                            <div className="mod-log-header">
                                <span className="mod-log-type">{component.name.replace(/_/g, ' ')}</span>
                                <span className="mod-log-status" title={`${t('archSelfModel_perceivedEfficiency')}: ${component.perceivedEfficiency.toFixed(2)}`}>
                                    {(component.perceivedEfficiency * 100).toFixed(0)}% {t('archSelfModel_effAbbr')}
                                </span>
                            </div>
                            <p className="mod-log-description" style={{fontStyle: 'italic'}}>
                                "{component.understoodPurpose}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});