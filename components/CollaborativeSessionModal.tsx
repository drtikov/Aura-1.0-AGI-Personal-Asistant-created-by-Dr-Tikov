// components/CollaborativeSessionModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useCoreState, useAuraDispatch } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';

// A component to view the session transcript and artifacts
const SessionTranscriptViewer = () => {
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

    return (
        <div className="session-viewer">
            <div className="session-participants">
                <strong>{t('session_participants')}:</strong>
                {session.participants.map(p => <span key={p} className="skill-tag">{p}</span>)}
            </div>

            <div className="session-main-content">
                <div className="session-transcript">
                    <div className="panel-subsection-title">{t('session_transcript')}</div>
                    {session.transcript.map((entry, index) => (
                        <div key={index} className="transcript-entry">
                            <strong className="persona-name">{entry.personaId}:</strong>
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
                        <div className="kg-placeholder">{t('session_no_artifacts')}</div>
                    ) : (
                        session.artifacts.map((artifact, index) => (
                            <div key={index} className="artifact-item">
                                <strong>{artifact.name} ({artifact.type})</strong>
                                <div className="code-snippet-container">
                                    <pre><code>{JSON.stringify(artifact.content, null, 2)}</code></pre>
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
        // We end the session in the backend state but don't nullify it,
        // so the user can still view the completed transcript.
        if (collaborativeSessionState.activeSession?.status === 'active') {
            syscall('SESSION/END', { status: 'completed' });
        }
        onClose();
    };

    const footer = (
        <button className="proposal-approve-button" onClick={handleClose}>
            {t('session_close')}
        </button>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t('collaborative_session')}
            footer={footer}
            className="advanced-controls-modal" // Use a large modal
        >
            <SessionTranscriptViewer />
        </Modal>
    );
};