// components/CognitiveForgePanel.tsx
import React from 'react';
import { SynthesizedSkill, SimulationLogEntry, SynthesisCandidate } from '../types';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

export const CognitiveForgePanel = React.memo(() => {
    const { cognitiveForgeState: state } = useArchitectureState();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return t('timeAgoMinutes', { count: minutes });
        const hours = Math.floor(minutes / 60);
        return t('timeAgoHours', { count: hours });
    };

    const handleTogglePause = () => {
        syscall('TOGGLE_COGNITIVE_FORGE_PAUSE', {});
    };

    const handleUpdateCandidateStatus = (id: string, status: 'approved' | 'rejected') => {
        syscall('COGNITIVE_FORGE/UPDATE_SYNTHESIS_STATUS', { id, status });
    };

    return (
        <div className="side-panel cognitive-forge-panel">
            <div className="button-grid" style={{ marginBottom: '1rem' }}>
                <button 
                    className={`control-button pause-button ${state.isTuningPaused ? 'paused' : ''}`}
                    onClick={handleTogglePause}
                >
                    {state.isTuningPaused ? t('resume') : t('pause')} {t('cognitiveForge_tuning')}
                </button>
            </div>
            
            <div className="panel-subsection-title">{t('cognitiveForge_synthesisCandidates')}</div>
            {state.synthesisCandidates.filter(c => c.status === 'proposed').length > 0 ? (
                state.synthesisCandidates.filter(c => c.status === 'proposed').map((candidate: SynthesisCandidate) => (
                    <div key={candidate.id} className="proposal-card">
                        <div className="proposal-card-header">
                             <span className="proposal-type-badge psyche">{t('cognitiveForge_newPrimitive')}</span>
                        </div>
                        <div className="proposal-card-body">
                            <p><strong>{candidate.name}</strong></p>
                            <p><em>{candidate.description}</em></p>
                            <div className="code-snippet-container" style={{ maxHeight: '100px', marginTop: '0.5rem' }}>
                                <pre><code>{candidate.primitiveSequence.join('\n→ ')}</code></pre>
                            </div>
                        </div>
                        <div className="proposal-actions-footer">
                            <button className="control-button reject-button" onClick={() => handleUpdateCandidateStatus(candidate.id, 'rejected')}>
                                {t('proposalReview_reject')}
                            </button>
                            <button className="control-button implement-button" onClick={() => handleUpdateCandidateStatus(candidate.id, 'approved')}>
                                {t('proposalReview_approve')}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('cognitiveForge_noCandidates')}</div>
            )}


            <div className="panel-subsection-title">{t('cognitiveForge_synthesizedSkills')}</div>
            {state.synthesizedSkills.length > 0 ? (
                state.synthesizedSkills.map((skill: SynthesizedSkill) => (
                    <div key={skill.id} className={`mod-log-item status-${skill.status}`}>
                        <div className="mod-log-header">
                            <span className="mod-log-type">{skill.name}</span>
                            <span className={`mod-log-status status-${skill.status}`}>{skill.status}</span>
                        </div>
                        <p className="mod-log-description">{skill.description}</p>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('cognitiveForge_noSkills')}</div>
            )}
            
            <div className="panel-subsection-title">{t('cognitiveForge_simulationLog')}</div>
            {state.simulationLog.length > 0 ? (
                <div className="command-log-list">
                    {state.simulationLog.map((log: SimulationLogEntry) => (
                        <div key={log.id} className={`command-log-item log-type-${log.result.success ? 'success' : 'error'}`}>
                             <span className="log-icon">{log.result.success ? '✓' : '✗'}</span>
                             <span className="log-text" title={`Skill: ${log.skillId}`}>{t('cognitiveForge_simulation')} {log.result.success ? t('cognitiveForge_succeeded') : t('cognitiveForge_failed')}</span>
                             <span className="log-time">{timeAgo(log.timestamp)}</span>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="kg-placeholder">{t('cognitiveForge_noSimulations')}</div>
            )}
        </div>
    );
});