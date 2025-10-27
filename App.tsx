// App.tsx
import React, { useEffect } from 'react';
// FIX: Corrected import path for AuraProvider to resolve module not found error.
import { AuraProvider } from './context/AuraProvider';
import { useAuraDispatch, useCoreState } from './context/AuraContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { ToastContainer } from './components/Toast';
// FIX: Corrected import path for ControlDeckComponent to resolve module casing ambiguity.
import { ControlDeckComponent } from './components/ControlDeckComponent';
// import { LiveTranscriptOverlay } from './components/LiveTranscriptOverlay'; // File not provided
import { Header } from './components/Header';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed';
import { ModalPayloads } from './types';
import { LeftColumnComponent } from './components/LeftColumnComponent';

const AppContent: React.FC = () => {
    // The useAuraDispatch hook is used to access state and handlers provided by AuraProvider.
    const { toasts, removeToast, videoRef, isVisualAnalysisActive, syscall } = useAuraDispatch();
    const { modalRequest } = useCoreState();
    const modal = useModal();

    useEffect(() => {
        if (modalRequest) {
            // The type assertion here is a bit loose but necessary to bridge the state and context systems.
            // We trust that the syscall payload is correct.
            modal.open(modalRequest.type as keyof ModalPayloads, modalRequest.payload as any);
            syscall('CLEAR_MODAL_REQUEST', {});
        }
    }, [modalRequest, modal, syscall]);

    return (
        <div className="app-wrapper">
            <Header />
            <div className="app-container">
                <LeftColumnComponent />
                <ControlDeckComponent />
            </div>
            {/* These components are positioned absolutely */}
            <VisualAnalysisFeed videoRef={videoRef} isAnalysisActive={isVisualAnalysisActive} />
            {/* <LiveTranscriptOverlay /> */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

export const App: React.FC = () => {
    return (
        <AuraProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </AuraProvider>
    );
};