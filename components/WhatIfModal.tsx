// components/WhatIfModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useLocalization } from '../context/AuraContext.tsx';

export const WhatIfModal = ({ isOpen, onAnalyze, onClose, isProcessing }: { isOpen: boolean; onAnalyze: (scenario: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [scenario, setScenario] = useState('');
    const { t } = useLocalization();

    useEffect(() => {
        if (!isOpen) {
            setScenario('');
        }
    }, [isOpen]);

    const handleAnalyzeClick = () => { if (scenario.trim()) { onAnalyze(scenario.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('whatIf_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleAnalyzeClick} disabled={isProcessing || !scenario.trim()}>{t('whatIf_analyze')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('whatIf')} 
            footer={footer}
            className="what-if-modal"
        >
            <div className="trace-section"> <h4>{t('whatIf_heading')}</h4> <p>{t('whatIf_description')}</p> <textarea value={scenario} onChange={e => setScenario(e.target.value)} placeholder={t('whatIf_placeholder')} rows={4} disabled={isProcessing} /> </div>
            {isProcessing && <div className="processing-indicator"> {t('whatIf_analyzing')} <div className="spinner"></div> </div>}
        </Modal>
    );
};