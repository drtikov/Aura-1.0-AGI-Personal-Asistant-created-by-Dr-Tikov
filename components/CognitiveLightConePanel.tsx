// components/CognitiveLightConePanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const CognitiveLightConePanel = React.memo(() => {
    const { cognitiveLightCone: state } = useCoreState();
    const { t } = useLocalization();

    const hasContent = state.grandChallenge || state.zpd || (state.knowns && state.knowns.length > 0);

    return (
        <div className="side-panel">
            {!hasContent ? (
                <div className="kg-placeholder">{t('cogLightCone_placeholder')}</div>
            ) : (
                <>
                    {state.grandChallenge && (
                        <>
                            <div className="panel-subsection-title">{t('cogLightCone_grandChallenge')}</div>
                            <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)', marginBottom: '1rem' }}>
                                <p title={state.grandChallenge.objective}>
                                    <strong>{state.grandChallenge.title}</strong>
                                </p>
                                <div className="state-item" style={{ padding: '0.25rem 0 0 0' }}>
                                    <label>{t('cogLightCone_progress')}</label>
                                    <div className="state-bar-container">
                                        <div 
                                            className="state-bar" 
                                            style={{ width: `${state.grandChallenge.progress * 100}%`, backgroundColor: 'var(--accent-color)' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {state.zpd && (
                        <>
                            <div className="panel-subsection-title">{t('cogLightCone_zpd')}</div>
                            <div className="rie-insight-item" style={{background: 'rgba(0,0,0,0.1)'}}>
                                 <div className="mod-log-header">
                                    <span className="mod-log-type">{state.zpd.domain}</span>
                                </div>
                                <p className="mod-log-description" style={{fontStyle: 'italic', fontSize: '0.8rem'}}>
                                   {t('architecturePanel_reasoning')}: {state.zpd.rationale}
                                </p>
                            </div>
                        </>
                    )}

                    <div className="panel-subsection-title">{t('cogLightCone_knownCapabilities')}</div>
                    {state.knowns && state.knowns.length > 0 ? (
                        state.knowns.map(known => (
                             <div key={known.capability} className="state-item">
                                <label>{known.capability}</label>
                                <div className="state-bar-container">
                                    <div className="state-bar" style={{ width: `${known.proficiency * 100}%`, backgroundColor: 'var(--primary-color)' }} title={`${t('cogLightCone_proficiency')}: ${(known.proficiency * 100).toFixed(0)}%`}></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="kg-placeholder">{t('cogLightCone_noKnowns')}</div>
                    )}
                </>
            )}
        </div>
    );
});