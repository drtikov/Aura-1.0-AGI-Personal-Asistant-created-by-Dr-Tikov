import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export const SearchModal = ({ isOpen, onSearch, onClose, isProcessing }: { isOpen: boolean; onSearch: (query: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [query, setQuery] = useState('');
    
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    const handleSearchClick = () => { if (query.trim()) { onSearch(query.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>Cancel</button>
            <button className="proposal-approve-button" onClick={handleSearchClick} disabled={isProcessing || !query.trim()}>Search</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Google Search Grounding" 
            footer={footer}
            className="search-modal"
        >
            <div className="trace-section"> <h4>Enter your search query</h4> <p>Aura will use Google Search to find up-to-date information and answer your question. Sources will be provided with the response.</p> <textarea value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g., Who won the latest F1 race?" rows={4} disabled={isProcessing} /> </div>
            {isProcessing && <div className="processing-indicator"> Searching... <div className="spinner"></div> </div>}
        </Modal>
    );
};