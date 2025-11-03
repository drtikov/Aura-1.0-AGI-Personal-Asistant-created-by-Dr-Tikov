// components/SearchModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useLocalization } from '../context/AuraContext.tsx';

export const SearchModal = ({ isOpen, onSearch, onClose, isProcessing, initialQuery }: { isOpen: boolean; onSearch: (query: string) => void; onClose: () => void; isProcessing: boolean; initialQuery?: string; }) => {
    const [query, setQuery] = useState(initialQuery || '');
    const { t } = useLocalization();
    
    useEffect(() => {
        if (isOpen) {
            setQuery(initialQuery || '');
        }
    }, [isOpen, initialQuery]);

    const handleSearchClick = () => { if (query.trim()) { onSearch(query.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('searchModal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleSearchClick} disabled={isProcessing || !query.trim()}>{t('searchModal_search')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('searchModal')} 
            footer={footer}
            className="search-modal"
        >
            <div className="trace-section"> <h4>{t('searchModal_heading')}</h4> <p>{t('searchModal_description')}</p> <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder={t('searchModal_placeholder')} rows={4} disabled={isProcessing} /> </div>
            {isProcessing && <div className="processing-indicator"> {t('searchModal_searching')} <div className="spinner"></div> </div>}
        </Modal>
    );
};