import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const DialecticEnginePanel = React.memo(() => {
    const { dialecticEngine: state } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel dialectic-engine-panel">
            {state.activeDialectics.length === 0 ? (
                <div className="kg-placeholder">
                    {t('dialecticEngine_placeholder')}
                </div>
            ) : (
                state.activeDialectics.map(d => (
                    <div key={d.id} className="veto-log-item" style={{ borderLeftColor: d.synthesis ? 'var(--success-color)' : 'var(--warning-color)', background: 'rgba(255, 193, 7, 0.05)', marginBottom: '1rem' }}>
                        <div className="veto-action" style={{fontWeight: 'bold', color: 'var(--text-color)', marginBottom: '0.5rem'}}>
                           {d.conflictDescription}
                        </div>
                        
                        <div className="dialectic-pair">
                            <p className="dialectic-part thesis">
                                <strong>{t('dialecticEngine_thesis')} ({d.thesis.source}):</strong> "{d.thesis.content}"
                            </p>
                             <p className="dialectic-part antithesis">
                                <strong>{t('dialecticEngine_antithesis')} ({d.antithesis.source}):</strong> "{d.antithesis.content}"
                            </p>
                        </div>

                        {d.synthesis ? (
                             <p className="dialectic-part synthesis">
                                <strong>{t('dialecticEngine_synthesis')} ({t('causalSelfModel_confidence')}: {(d.synthesis.confidence * 100).toFixed(0)}%):</strong> "{d.synthesis.content}"
                            </p>
                        ) : (
                             <p className="dialectic-part synthesizing">
                                <strong>{t('dialecticEngine_synthesizing')}...</strong>
                            </p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
});
