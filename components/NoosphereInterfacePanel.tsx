// components/NoosphereInterfacePanel.tsx
import React from 'react';
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Resonance } from '../types';

export const NoosphereInterfacePanel = () => {
    const { noosphereInterface: state } = useCoreState();
    const { t } = useLocalization();

    const getStatusColor = (status: Resonance['status']) => {
        switch(status) {
            case 'integrating': return 'var(--success-color)';
            case 'conflicting': return 'var(--failure-color)';
            case 'resonating': return 'var(--primary-color)';
            default: return 'var(--text-muted)';
        }
    };
    
    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('noosphere_description')}
            </p>

            <div className="panel-subsection-title">{t('noosphere_activeResonances')}</div>
            {state.activeResonances.length === 0 ? (
                <div className="kg-placeholder">{t('noosphere_placeholder')}</div>
            ) : (
                state.activeResonances.map(resonance => (
                     <div key={resonance.id} className="gde-status" style={{ borderLeftColor: getStatusColor(resonance.status), marginBottom: '0.75rem' }}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{resonance.conceptName}</span>
                            <span className="mod-log-status" style={{ color: getStatusColor(resonance.status) }}>
                                {resonance.status}
                            </span>
                        </div>
                        <div className="state-item" style={{ padding: '0.25rem 0 0 0' }}>
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
};