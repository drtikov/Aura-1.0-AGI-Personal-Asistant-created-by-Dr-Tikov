import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization, useAuraDispatch, useArchitectureState } from '../context/AuraContext';

export const DocumentForgeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const [goal, setGoal] = useState('');
    const { t } = useLocalization();
    const { handleStartDocumentForge } = useAuraDispatch();
    const { documentForgeState } = useArchitectureState();

    const isProcessing = documentForgeState.isActive;

    useEffect(() => {
        if (!isOpen) {
            setGoal('');
        }
    }, [isOpen]);

    const handleBegin = () => {
        if (goal.trim()) {
            handleStartDocumentForge(goal.trim());
            onClose();
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('documentForge_modal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleBegin} disabled={isProcessing || !goal.trim()}>{t('documentForge_modal_begin')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('documentForge_modal_title')}
            footer={footer}
            className="document-forge-modal"
        >
            <div className="trace-section">
                <h4>{t('documentForge_modal_heading')}</h4>
                <p>{t('documentForge_modal_description')}</p>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder={t('documentForge_modal_placeholder')}
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
        </Modal>
    );
};