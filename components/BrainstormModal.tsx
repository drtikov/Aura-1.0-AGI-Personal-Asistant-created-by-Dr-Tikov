import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const BrainstormModal = ({ isOpen, onGenerate, onClose, isProcessing }: { isOpen: boolean; onGenerate: (topic: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [topic, setTopic] = useState('');
    const { t } = useLocalization();

    useEffect(() => {
        if (!isOpen) {
            setTopic('');
        }
    }, [isOpen]);

    const handleGenerateClick = () => { if (topic.trim()) { onGenerate(topic.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('brainstorm_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleGenerateClick} disabled={isProcessing || !topic.trim()}>{t('brainstorm_generate')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('brainstorm_title')} 
            footer={footer}
            className="brainstorm-modal"
        >
            <div className="trace-section"> 
                <h4>{t('brainstorm_heading')}</h4> 
                <p>{t('brainstorm_description')}</p> 
                <textarea 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)} 
                    placeholder={t('brainstorm_placeholder')} 
                    rows={4} 
                    disabled={isProcessing} 
                /> 
            </div>
            {isProcessing && <div className="processing-indicator"> {t('brainstorm_processing')} <div className="spinner"></div> </div>}
        </Modal>
    );
};
