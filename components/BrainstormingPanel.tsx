// components/BrainstormingPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { BrainstormIdea } from '../types';

export const BrainstormingPanel = () => {
    const { brainstormState } = useCoreState();
    const { t } = useLocalization();
    const { status, topic, ideas, winningIdea } = brainstormState;

    if (status === 'idle') {
        return (
            <div className="side-panel">
                <div className="kg-placeholder">{t('brainstorm_idle')}</div>
            </div>
        );
    }
    
    return (
        <div className="side-panel brainstorming-panel">
            <div className="awareness-item">
                <label>{t('brainstorm_status')}</label>
                <strong className={`status-${status}`}>{status}</strong>
            </div>
            
            <div className="panel-subsection-title">{t('brainstorm_topic')}</div>
            <p className="reason-text"><em>"{topic}"</em></p>

            <div className="panel-subsection-title">{t('brainstorm_ideas')}</div>
            {ideas.length === 0 && status === 'brainstorming' && (
                <div className="generating-indicator">
                    <div className="spinner-small" />
                    <span>{t('brainstorm_generating_ideas')}</span>
                </div>
            )}
            {ideas.map((idea: BrainstormIdea, index: number) => (
                <div key={index} className={`axiom-card ${idea.idea === winningIdea ? 'accepted' : ''}`}>
                    <div className="mod-log-header">
                        <span className="mod-log-type">{idea.personaName}</span>
                    </div>
                    <p className="axiom-card-text" style={{ fontStyle: 'normal' }}>{idea.idea}</p>
                </div>
            ))}

            {winningIdea && (
                <>
                    <div className="panel-subsection-title">{t('brainstorm_winner')}</div>
                     <div className="axiom-card accepted">
                        <p className="axiom-card-text">"{winningIdea}"</p>
                    </div>
                </>
            )}
        </div>
    );
};