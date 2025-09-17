import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const NoosphereInterfacePanel = React.memo(() => {
    const { noosphereInterface: state } = useCoreState();
    const { t } = useLocalization();

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'integrating': return 'var(--success-color)';
            case 'conflicting': return 'var(--failure-color)';
            case 'resonating': return 'var(--primary-color)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="side-panel noosphere-interface-panel">
            {state.activeResonances.length === 0 ? (
                <div className="kg-placeholder">
                    {t('noosphere_placeholder')}
                </div>
            ) : (
                state.activeResonances.map(resonance => (
                    <div key={resonance.id} className="gde-status" style={{ borderLeftColor: getStatusColor(resonance.status), marginBottom: '0.75rem' }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{resonance.conceptName}</span>
                            <span className="mod-log-status" style={{ color: getStatusColor(resonance.status) }}>
                                {resonance.status}
                            </span>
                        </div>
                        <div className="state-item" style={{padding: '0.25rem 0 0 0'}}>
                            <label>{t('noosphere_resonanceStrength')}</label>
                            <div className="state-bar-container">
                                <div 
                                    className="state-bar" 
                                    style={{ width: `${resonance.resonanceStrength * 100}%`, backgroundColor: getStatusColor(resonance.status) }}
                                    title={`${t('noosphere_strength')}: ${resonance.resonanceStrength.toFixed(2)}`}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});