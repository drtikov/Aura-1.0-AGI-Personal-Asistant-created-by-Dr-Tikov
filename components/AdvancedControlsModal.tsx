// components/AdvancedControlsModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization } from '../context/AuraContext.tsx';
import { AuraOSModal } from './AuraOSModal.tsx';

interface AdvancedControlsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// This component is now a wrapper around the new AuraOSModal for backward compatibility if needed.
// The main functionality has been moved to AuraOSModal.
export const AdvancedControlsModal = ({ isOpen, onClose }: AdvancedControlsModalProps) => {
    const { t } = useLocalization();

    return (
        <AuraOSModal isOpen={isOpen} onClose={onClose} />
    );
};