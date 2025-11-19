// components/CollaborativeSessionModal.tsx
import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { CollaborativeSession, Goal, Persona } from '../types.ts';
import { Modal } from './Modal.tsx';
import { useLocalization, useCoreState, useAuraDispatch } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';
import { personas } from '../state/personas.ts';

const SubTaskItem = React.memo(({ task, session }: { task: Goal, session: CollaborativeSession }) => {
    const { t } = useLocalization();

    const getStatusInfo = () => {
        switch (task.status) {
            case 'completed': return { icon: '✅', text: t('subtask_status_completed') };
            case 'in_progress': return { icon: <div className="spinner-small" />, text: t('subtask_status_in_progress') };
            case 'not_started':
            default: return { icon: '⚪', text: t('subtask_status_pending') };
        }
    };
    
    const { icon, text } = getStatusInfo();
    const persona = personas.find(p => p.id === task.personaId);

    return (
        <div className="subtask-item">
            <div className="subtask-header">
                <div className="subtask-status">
                    {icon}
                    <span>{text}</span>
                </div>
                {persona && <span className="skill-tag">{t(`personality_${persona.id}_name`)}</span>}
            </div>
            <p className="subtask-description">{task.description}</p>
        </div>
    );
});

// A component to view the session transcript and artifacts
const SessionViewer = () => {
    const { collaborativeSessionState } = useCoreState();
    const { t } = useLocalization();
    const session = collaborativeSessionState.activeSession;

    if (!session) {
        return (
            <div className="generating-indicator">
                <div className="spinner-small"></div>
                <span>{t('session_initializing')}</span>
            </div>
        );
    }
    
    const synthesizer = session.participants.find(p => p === 'synthesizer');

    return (
        <div className="session-viewer">
            <div className="session-main-content">
                <div className="session-subtasks">
                    <div className="panel-subsection-title">{t('session_subtasks')}</div>
                    {session.subTasks?.map((task) => (
                        <SubTaskItem key={task.id} task={task} session={session} />
                    ))}
                </div>

                <div className="session-transcript">
                    <div className="panel-subsection-title">{t('session_transcript')}</div>
                    {session.transcript.map((entry, index) => (
                        <div key={index} className="transcript-entry">
                            <strong className="persona-name">{personas.find(p => p.id === entry.personaId)?.name || entry.personaId}:</strong>
                            <div className="transcript-content">
                                <SafeMarkdown text={entry.content} />
                            </div>
                        </div>
                    ))}
                    {session.status === 'active' && (
                        <div className="generating-indicator" style={{ marginTop: '1rem' }}>
                            <div className="spinner-small"></div>
                            <span>{t('session_thinking')}</span>
                        </div>
                    )}
                </div>

                <div className="session-artifacts">
                    <div className="panel-subsection-title">{t('session_artifacts')}</div>
                    {session.artifacts.length === 0 ? (
                         session.status === 'active' ? (
                            <div className="generating-indicator">
                                <div className="spinner-small"></div>
                                <span>{synthesizer ? t('session_synthesizing') : t('session_no_artifacts')}</span>
                            </div>
                         ) : (
                            <div className="kg-placeholder">{t('session_no_artifacts')}</div>
                         )
                    ) : (
                        session.artifacts.map((artifact, index) => (
                            <div key={index} className="artifact-item">
                                <strong>{artifact.name} ({artifact.type})</strong>
                                <div className="code-snippet-container">
                                    <pre><code>{typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content, null, 2)}</code></pre>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export const CollaborativeSessionModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { collaborativeSessionState } = useCoreState();

    const handleClose = () => {
        syscall('SESSION/CLOSE', {});
        onClose();
    };

    const footer = (
        <button className="proposal-approve-button" onClick={handleClose}>
            {collaborativeSessionState.activeSession?.status === 'active' ? t('session_run_in_background') : t('session_close')}
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('collaborative_session')}
            footer={footer}
            className="advanced-controls-modal collaborative-session-modal"
        >
            <SessionViewer />
        </Modal>
    );
};