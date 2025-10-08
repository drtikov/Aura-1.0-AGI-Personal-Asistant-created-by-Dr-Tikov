// components/EvolutionarySandboxPanel.tsx
import React, { useState, useEffect } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { HAL } from '../core/hal';

const DiffViewer = ({ diff }: { diff: { before: string, after: string } }) => {
    return (
        <div className="diff-viewer">
            <div className="diff-pane">
                <div className="diff-header">Before</div>
                <pre><code>{diff.before}</code></pre>
            </div>
            <div className="diff-pane">
                <div className="diff-header">After</div>
                <pre><code>{diff.after}</code></pre>
            </div>
        </div>
    );
};

export const EvolutionarySandboxPanel = () => {
    const { evolutionarySandboxState } = useArchitectureState();
    const { syscall, handleStartSandboxSprint } = useAuraDispatch();
    const { t } = useLocalization();

    const [goal, setGoal] = useState('');
    const { status, sprintGoal, log, startTime, result } = evolutionarySandboxState;

    const handleStartSprint = () => {
        if (goal.trim()) {
            handleStartSandboxSprint(goal);
        }
    };

    const handleApprove = () => {
        if (result) {
            syscall('INGEST_CODE_CHANGE', { filePath: result.diff.filePath, code: result.diff.after });
            syscall('SANDBOX/RESET', {});
            setGoal('');
        }
    };

    const handleDiscard = () => {
        syscall('SANDBOX/RESET', {});
        setGoal('');
    };

    const renderIdle = () => (
        <>
            <p className="reason-text">{t('sandbox_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="sprint-goal">{t('sandbox_goal_label')}</label>
                <input
                    id="sprint-goal"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t('sandbox_goal_placeholder')}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleStartSprint} disabled={!goal.trim()}>{t('sandbox_begin_button')}</button>
            </div>
        </>
    );

    const renderRunning = () => (
        <>
            <div className="sprint-running-header">
                <h4>{t('sandbox_sprint_running')}</h4>
                <div className="spinner-small" />
            </div>
            <p className="reason-text"><strong>{t('sandbox_goal_label')}:</strong> {sprintGoal}</p>
            <div className="command-log-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {log.map(entry => (
                    <div key={entry.timestamp} className="command-log-item log-type-info">
                        <span className="log-icon">»</span>
                        <span className="log-text">{entry.message}</span>
                    </div>
                ))}
            </div>
        </>
    );

    const renderComplete = () => (
        <>
            <h4>{t('sandbox_sprint_complete')}</h4>
            <div className="panel-subsection-title">{t('sandbox_results_title')}</div>
            <p className="reason-text"><strong>{t('sandbox_goal_label')}:</strong> {result?.originalGoal}</p>
            
            <div className="panel-subsection-title">{t('sandbox_gains_title')}</div>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr', textAlign: 'left', gap: '0.2rem' }}>
                {result?.performanceGains.map(gain => (
                    <div key={gain.metric} className="metric-item">
                        <span className="metric-label">{gain.metric}</span>
                        <span className="metric-value" style={{ color: gain.change.startsWith('+') ? 'var(--success-color)' : 'var(--failure-color)' }}>{gain.change}</span>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">{t('sandbox_diff_title')}: {result?.diff.filePath}</div>
            {result && <DiffViewer diff={result.diff} />}

            <div className="proposal-actions-footer">
                <button className="control-button reject-button" onClick={handleDiscard}>{t('sandbox_discard_button')}</button>
                <button className="control-button implement-button" onClick={handleApprove}>{t('sandbox_approve_button')}</button>
            </div>
        </>
    );

    return (
        <div className="side-panel">
            {status === 'idle' && renderIdle()}
            {status === 'running' && renderRunning()}
            {status === 'complete' && result && renderComplete()}
        </div>
    );
};