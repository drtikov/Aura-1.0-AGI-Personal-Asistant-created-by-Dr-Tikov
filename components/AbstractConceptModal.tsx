// components/AbstractConceptModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useArchitectureState } from '../context/AuraContext.tsx';

export const AbstractConceptModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const [name, setName] = useState('');
    const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
    const { t } = useLocalization();
    const { handleSynthesizeAbstractConcept } = useAuraDispatch();
    const { neuroCortexState } = useArchitectureState();

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setSelectedColumnIds([]);
        }
    }, [isOpen]);

    const handleCheckboxChange = (columnId: string) => {
        setSelectedColumnIds(prev =>
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    };

    const handleCreateClick = () => {
        if (name.trim() && selectedColumnIds.length > 0) {
            handleSynthesizeAbstractConcept(name.trim(), selectedColumnIds);
            onClose();
        }
    };

    const isFormValid = name.trim() !== '' && selectedColumnIds.length > 0;

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose}>{t('skillGenesis_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleCreateClick} disabled={!isFormValid}>{t('abstractConcept_synthesize')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('abstractConcept')} 
            footer={footer}
            className="abstract-concept-modal"
        >
            <div className="trace-section">
                <h4>{t('abstractConcept_heading')}</h4>
                <p>{t('abstractConcept_description')}</p>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('abstractConcept_placeholder')}
                    className="vfs-path-input" 
                />
            </div>
             <div className="trace-section">
                <h4>{t('abstractConcept_selectColumns')}</h4>
                <div className="column-checkbox-list">
                    {neuroCortexState.columns.map(column => (
                         <label key={column.id} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedColumnIds.includes(column.id)} 
                                onChange={() => handleCheckboxChange(column.id)}
                            />
                            <span>{column.specialty}</span>
                        </label>
                    ))}
                </div>
            </div>
        </Modal>
    );
};