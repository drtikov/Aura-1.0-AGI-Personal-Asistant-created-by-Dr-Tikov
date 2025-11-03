// components/StrategicGoalModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization } from '../context/AuraContext.tsx';

export const StrategicGoalModal = ({ isOpen, onSetGoal, onClose, isProcessing, initialGoal }: { isOpen: boolean; onSetGoal: (goal: string) => void; onClose: () => void; isProcessing: boolean; initialGoal?: string; }) => {
    const [goal, setGoal] = useState(initialGoal || '');
    const { t } = useLocalization();

    useEffect(() => {
        if (isOpen) {
            setGoal(initialGoal || '');
        }
    }, [isOpen, initialGoal]);

    const handleSetGoalClick = () => {
        if (goal.trim()) {
            onSetGoal(goal.trim());
            onClose(); // Close the modal immediately after submission
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('strategicGoal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleSetGoalClick} disabled={isProcessing || !goal.trim()}>{t('strategicGoal_setGoal')}</button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('strategicGoal')}
            footer={footer}
            className="strategic-goal-modal"
        >
            <div className="trace-section">
                <h4>{t('strategicGoal_heading')}</h4>
                <p>{t('strategicGoal_description')}</p>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder={t('strategicGoal_placeholder')}
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
        </Modal>
    );
};