// components/PoseQuestionModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const PoseQuestionModal = ({ isOpen, onPose, onClose }: { isOpen: boolean; onPose: (question: string) => void; onClose: () => void; }) => {
    const [question, setQuestion] = useState('');
    const { t } = useLocalization();

    useEffect(() => {
        if (!isOpen) {
            setQuestion('');
        }
    }, [isOpen]);

    const handlePoseClick = () => {
        if (question.trim()) {
            onPose(question.trim());
            onClose();
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose}>{t('curiosity_modal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handlePoseClick} disabled={!question.trim()}>{t('curiosity_modal_pose')}</button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('curiosity_modal_title')}
            footer={footer}
            className="pose-question-modal"
        >
            <div className="trace-section">
                <h4>{t('curiosity_modal_heading')}</h4>
                <p>{t('curiosity_modal_description')}</p>
                <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder={t('curiosity_modal_placeholder')}
                    rows={4}
                />
            </div>
        </Modal>
    );
};