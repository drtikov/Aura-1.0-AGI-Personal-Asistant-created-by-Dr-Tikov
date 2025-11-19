// components/CollaborateModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization } from '../context/AuraContext.tsx';

export const CollaborateModal = ({ isOpen, onCollaborate, onClose, isProcessing }: { isOpen: boolean; onCollaborate: (goal: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [goal, setGoal] = useState('');
    const { t } = useLocalization();

    useEffect(() => {
        if (!isOpen) {
            setGoal('');
        }
    }, [isOpen]);

    const handleCollaborateClick = () => {
        if (goal.trim()) {
            onCollaborate(goal.trim());
            onClose();
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('collaborate_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleCollaborateClick} disabled={isProcessing || !goal.trim()}>{t('collaborate_begin')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('collaborate_title')} 
            footer={footer}
            className="collaborate-modal"
        >
            <div className="trace-section">
                <h4>{t('collaborate_heading')}</h4>
                <p>{t('collaborate_description')}</p>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder={t('collaborate_placeholder')}
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
        </Modal>
    );
};