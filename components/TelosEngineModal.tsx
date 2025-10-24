// components/TelosEngineModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization } from '../context/AuraContext.tsx';
import { TelosEnginePanel } from './TelosPanel.tsx';

interface TelosEngineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TelosEngineModal = ({ isOpen, onClose }: TelosEngineModalProps) => {
    const { t } = useLocalization();

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('telos_title')}
            className="advanced-controls-modal" // Use a large modal style
        >
            <TelosEnginePanel />
        </Modal>
    );
};