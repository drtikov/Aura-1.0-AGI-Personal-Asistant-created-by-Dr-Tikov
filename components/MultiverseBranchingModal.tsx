import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const MultiverseBranchingModal = ({ isOpen, onBranch, onClose, isProcessing }: { isOpen: boolean; onBranch: (prompt: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [prompt, setPrompt] = useState('');
    const { t } = useLocalization();

    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
        }
    }, [isOpen]);

    const handleBranchClick = () => { if (prompt.trim()) { onBranch(prompt.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('multiverse_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleBranchClick} disabled={isProcessing || !prompt.trim()}>{t('multiverse_branch')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('multiverse_title')} 
            footer={footer}
            className="multiverse-branching-modal"
        >
            <div className="trace-section">
                <h4>{t('multiverse_heading')}</h4>
                <p>{t('multiverse_description')}</p>
                <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder={t('multiverse_placeholder')}
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
            {isProcessing && <div className="processing-indicator"> {t('multiverse_branching')} <div className="spinner"></div> </div>}
        </Modal>
    );
};