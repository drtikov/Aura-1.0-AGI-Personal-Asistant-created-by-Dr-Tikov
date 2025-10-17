// components/TelosModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization } from '../context/AuraContext.tsx';

export const TelosModal = ({ isOpen, onSetTelos, onClose, currentTelos }: { isOpen: boolean; onSetTelos: (telos: string) => void; onClose: () => void; currentTelos: string; }) => {
    const [telos, setTelos] = useState(currentTelos);
    const { t } = useLocalization();

    useEffect(() => {
        if (isOpen) {
            setTelos(currentTelos);
        }
    }, [isOpen, currentTelos]);

    const handleSetTelosClick = () => {
        if (telos.trim()) {
            onSetTelos(telos.trim());
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose}>{t('telos_modal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleSetTelosClick} disabled={!telos.trim()}>{t('telos_modal_set')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('telos_modal')} 
            footer={footer}
            className="telos-modal"
        >
            <div className="trace-section">
                <h4>{t('telos_modal_heading')}</h4>
                <p>{t('telos_modal_description')}</p>
                <textarea
                    value={telos}
                    onChange={e => setTelos(e.target.value)}
                    placeholder={t('telos_modal_placeholder')}
                    rows={4}
                />
            </div>
        </Modal>
    );
};