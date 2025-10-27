// components/MetisSandboxPanel.tsx
import React, { useState } from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

export const MetisSandboxPanel = () => {
    const { metisSandboxState } = useCoreState();
    const { handleStartMetisResearch } = useAuraDispatch();
    const { t } = useLocalization();
    const { status, problemStatement, researchLog, findings, errorMessage } = metisSandboxState;
    
    const [localProblem, setLocalProblem] = useState('');

    const handleStart = () => {
        if (localProblem.trim()) {
            handleStartMetisResearch(localProblem.trim());
        }
    };

    const isProcessing = status === 'analyzing' || status === 'hypothesizing' || status === 'experimenting';

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('metis_description')}
            </p>
            
            {status === 'idle' ? (
                <>
                    <div className="image-gen-control-group">
                        <label htmlFor="metis-problem">{t('metis_problem_statement')}</label>
                        <textarea
                            id="metis-problem"
                            value={localProblem}
                            onChange={(e) => setLocalProblem(e.target.value)}
                            rows={4}
                            placeholder={t('metis_problem_placeholder')}
                        />
                    </div>
                    <div className="button-grid" style={{ marginTop: '1rem' }}>
                        <button className="control-button" onClick={handleStart} disabled={!localProblem.trim()}>
                            {t('metis_start_research')}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="panel-subsection-title">{t('metis_problem_statement')}</div>
                    <p className="reason-text"><em>"{problemStatement}"</em></p>

                    <div className="panel-subsection-title">{t('metis_research_log')}</div>
                    <div className="command-log-list">
                        {researchLog.map(entry => (
                            <div key={entry.timestamp} className="command-log-item log-type-info">
                                <span className="log-icon">{entry.stage === 'OBSERVE' ? '👀' : entry.stage === 'HYPOTHESIZE' ? '💡' : entry.stage === 'EXPERIMENT' ? '🔬' : '✅'}</span>
                                <span className="log-text">{entry.message}</span>
                                <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                            </div>
                        ))}
                    </div>

                    {isProcessing && (
                        <div className="generating-indicator" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                            <div className="spinner-small"></div>
                            <span>{status.charAt(0).toUpperCase() + status.slice(1)}...</span>
                        </div>
                    )}
                    
                    {errorMessage && <div className="failure-reason-display">{errorMessage}</div>}

                    {findings && (
                        <>
                            <div className="panel-subsection-title">{t('metis_findings')}</div>
                            <div className="rie-insight-item" style={{ background: 'rgba(76, 175, 80, 0.05)', borderLeft: '3px solid var(--success-color)' }}>
                                <SafeMarkdown text={findings} />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};