// components/PsychedelicIntegrationPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const PsychedelicIntegrationPanel = React.memo(() => {
    const { psychedelicIntegrationState: state } = useCoreState();
    const { t } = useLocalization();

    if (!state.isActive) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder">
                    {state.integrationSummary ? state.integrationSummary : 'Psychedelic integration protocol is inactive. Press "Trip" to begin.'}
                </div>
                {state.log && state.log.length > 1 && (
                     <details style={{marginTop: '1rem', fontSize: '0.8rem'}}>
                        <summary>View Last Trip Log</summary>
                        <ul className="ethical-principles-list" style={{marginTop: '0.5rem'}}>
                            {state.log.map((entry, index) => (
                                <li key={index}>{entry}</li>
                            ))}
                        </ul>
                    </details>
                )}
            </div>
        );
    }

    return (
        <div className="side-panel psychedelic-panel">
            <div className="awareness-item">
                <label>Current Theme</label>
                <strong>{state.currentTheme || '...'}</strong>
            </div>

            <div className="state-item">
                <label>PHC→VC Connectivity</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${state.phcToVcConnectivity * 100}%`, backgroundColor: 'var(--secondary-color)' }}></div>
                </div>
            </div>

             <div className="state-item">
                <label>Imagery Intensity</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${state.imageryIntensity * 100}%`, backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            </div>
            
            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>Trip Log</div>
            <ul className="ethical-principles-list" style={{fontSize: '0.8rem'}}>
                {state.log.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>
        </div>
    );
});