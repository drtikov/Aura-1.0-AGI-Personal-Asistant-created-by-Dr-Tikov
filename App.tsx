// App.tsx
import React, { useEffect } from 'react';
import { AuraProvider } from './context/AuraProvider.tsx';
import { useAuraDispatch, useCoreState } from './context/AuraContext.tsx';
import { ModalProvider, useModal } from './context/ModalContext.tsx';
import { ToastContainer } from './components/Toast.tsx';
import { LeftColumnComponent } from './components/LeftColumnComponent.tsx';
import { LiveTranscriptOverlay } from './components/LiveTranscriptOverlay.tsx';
import { Header } from './components/Header.tsx';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed.tsx';
// FIX: Corrected import path casing for ControlDeckComponent to resolve module resolution errors.
// FIX: To resolve module resolution errors, this now points to the canonical PascalCase file to avoid casing ambiguity.
import { ControlDeckComponent } from './components/ControlDeckComponent.tsx';
import { ModalPayloads } from './types.ts';

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
            {/* These components are overlays or positioned absolutely */}
            <VisualAnalysisFeed videoRef={videoRef} isAnalysisActive={isVisualAnalysisActive} />
            <LiveTranscriptOverlay />
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