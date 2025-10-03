// components/MetisSandboxPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const MetisSandboxPanel = () => {
    const { metisSandboxState } = useCoreState();
    const { t } = useLocalization();
    const { status, currentExperimentId, testResults, errorMessage } = metisSandboxState;

    return (
        <div className="side-panel">
            <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong className={`status-${status}`}>{status}</strong>
            </div>
            
            <div className="awareness-item">
                <label>{t('sandbox_experimentId')}</label>
                <strong title={currentExperimentId || ''}>
                    {currentExperimentId ? `...${currentExperimentId.slice(-12)}` : t('sandbox_noExperiment')}
                </strong>
            </div>

            {status === 'complete' && testResults && (
                <>
                    <div className="panel-subsection-title">{t('sandbox_results')}</div>
                    <div className="code-snippet-container">
                        <pre><code>{JSON.stringify(testResults, null, 2)}</code></pre>
                    </div>
                </>
            )}

            {status === 'error' && errorMessage && (
                <div className="failure-reason-display">
                    <strong>{t('sandbox_error')}</strong>
                    <p>{errorMessage}</p>
                </div>
            )}
            
            {status === 'running' && (
                <div className="generating-indicator" style={{justifyContent: 'center', marginTop: '1rem'}}>
                    <div className="spinner-small"></div>
                    <span>{t('sandbox_running')}</span>
                </div>
            )}
        </div>
    );
};