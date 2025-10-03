// components/PluginManagerModal.tsx
import React from 'react';
import { Modal } from './Modal';
import { PluginManagerPanel } from './PluginManagerPanel';
import { useLocalization } from '../context/AuraContext';

interface PluginManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PluginManagerModal = ({ isOpen, onClose }: PluginManagerModalProps) => {
    const { t } = useLocalization();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('pluginManager_modal_title')}
            className="advanced-controls-modal" // Re-use this class for a larger modal
        >
            <div className="advanced-controls-content">
                <PluginManagerPanel />
            </div>
        </Modal>
    );
};
