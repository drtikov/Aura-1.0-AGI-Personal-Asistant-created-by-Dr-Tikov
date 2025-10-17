// components/DocumentForgePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext';

export const DocumentForgePanel = React.memo(() => {
    const { documentForgeState } = useArchitectureState();
    const { t } = useLocalization();
    const modal = useModal();
    const { isActive, status, document, goal, error } = documentForgeState;

    const handleOpenModal = () => {
        modal.open('documentForge', {});
    };

    if (!isActive) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder">{t('documentForge_placeholder')}</div>
                 <div className="button-grid" style={{marginTop: '1rem'}}>
                    <button className="control-button" onClick={handleOpenModal}>
                        {t('documentForge_modal_begin')}
                    </button>
                </div>
            </div>
        );
    }

    const totalChapters = document?.chapters.length || 0;
    const completedChapters = document?.chapters.filter(c => c.content).length || 0;
    const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

    return (
        <div className="side-panel document-forge-panel">
            <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong>{status}</strong>
            </div>
             <div className="awareness-item">
                <label>Goal</label>
                <strong title={goal}>{goal.substring(0, 20)}...</strong>
            </div>
            <div className="state-item">
                <label>Progress</label>
                <div className="state-bar-container">
                    <div className="state-bar" style={{ width: `${progress}%`, backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            </div>
            {error && <div className="failure-reason-display">{error}</div>}
             <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={handleOpenModal}>
                    View Document
                </button>
            </div>
        </div>
    );
});