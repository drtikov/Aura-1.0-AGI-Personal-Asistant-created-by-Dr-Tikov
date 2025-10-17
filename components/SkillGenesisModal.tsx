import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

export const SkillGenesisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const [specialty, setSpecialty] = useState('');
    const [curriculum, setCurriculum] = useState('');
    const { t } = useLocalization();
    const { handleTrainCorticalColumn } = useAuraDispatch();

    useEffect(() => {
        if (!isOpen) {
            setSpecialty('');
            setCurriculum('');
        }
    }, [isOpen]);

    const handleCreateClick = () => {
        if (specialty.trim() && curriculum.trim()) {
            handleTrainCorticalColumn(specialty.trim(), curriculum.trim());
            onClose();
        }
    };

    const isFormValid = specialty.trim() !== '' && curriculum.trim() !== '';

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose}>{t('skillGenesis_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleCreateClick} disabled={!isFormValid}>{t('skillGenesis_begin_training')}</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('skillGenesis_train')}
            footer={footer}
            className="skill-genesis-modal"
        >
            <div className="trace-section">
                <h4>{t('skillGenesis_heading')}</h4>
                <p>{t('skillGenesis_description_train')}</p>
                <input
                    type="text"
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    placeholder={t('skillGenesis_placeholder')}
                    className="vfs-path-input" 
                />
            </div>
             <div className="trace-section">
                <h4>{t('skillGenesis_curriculum_heading')}</h4>
                <p>{t('skillGenesis_curriculum_description')}</p>
                <textarea
                    value={curriculum}
                    onChange={e => setCurriculum(e.target.value)}
                    placeholder={t('skillGenesis_curriculum_placeholder')}
                    className="curriculum-textarea"
                    rows={8}
                />
            </div>
        </Modal>
    );
};