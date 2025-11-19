// App.tsx
import React, { useEffect, useState } from 'react';
import { AuraProvider } from './context/AuraProvider';
// FIX: Add file extensions for explicit module resolution
import { useAuraDispatch, useCoreState, useSystemState } from './context/AuraContext.tsx';
import { ModalProvider, useModal } from './context/ModalContext.tsx';
import { ToastContainer } from './components/Toast.tsx';
// FIX: Corrected import path casing to use a lowercase re-export file to resolve module resolution conflicts.
import { ControlDeckComponent } from './components/ControlDeckComponent.tsx';
import { Header } from './components/Header.tsx';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed.tsx';
import { ModalPayloads } from './types.ts';
import { LeftColumnComponent } from './components/LeftColumnComponent.tsx';
import { ApiKeySelector } from './components/ApiKeySelector.tsx';

const AppContent: React.FC = () => {
    // The useAuraDispatch hook is used to access state and handlers provided by AuraProvider.
    const { toasts, removeToast, videoRef, isVisualAnalysisActive, syscall } = useAuraDispatch();
    const { modalRequest } = useCoreState();
    // FIX: Correctly destructure systemState to access isApiKeyInvalidated
    const { systemState } = useSystemState();
    const modal = useModal();
    const [isKeySelectionRequired, setIsKeySelectionRequired] = useState(false);

    useEffect(() => {
        if (modalRequest) {
            // Check for API key if the modal is for video generation
            if (modalRequest.type === 'videoGeneration') {
                window.aistudio.hasSelectedApiKey().then((hasKey: boolean) => {
                    if (!hasKey) {
                        setIsKeySelectionRequired(true);
                    } else {
                        modal.open(modalRequest.type as keyof ModalPayloads, modalRequest.payload as any);
                    }
                });
            } else {
                 modal.open(modalRequest.type as keyof ModalPayloads, modalRequest.payload as any);
            }
            syscall('CLEAR_MODAL_REQUEST', {});
        }
    }, [modalRequest, modal, syscall]);

    useEffect(() => {
        // FIX: Access isApiKeyInvalidated via systemState
        if (systemState.isApiKeyInvalidated) {
            setIsKeySelectionRequired(true);
            syscall('SYSTEM/CLEAR_API_KEY_INVALIDATED', {});
        }
    }, [systemState.isApiKeyInvalidated, syscall]);
    
    if (isKeySelectionRequired) {
        return <ApiKeySelector onKeySelected={() => setIsKeySelectionRequired(false)} />;
    }

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