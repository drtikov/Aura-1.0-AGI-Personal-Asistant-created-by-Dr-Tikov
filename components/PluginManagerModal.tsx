// components/PluginManagerModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { PluginManagerPanel } from './PluginManagerPanel.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization } from '../context/AuraContext.tsx';

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
            title={t('pluginManager_modal')}
            className="advanced-controls-modal" // Re-use this class for a larger modal
        >
            <div className="advanced-controls-content">
                <PluginManagerPanel />
            </div>
        </Modal>
    );
};