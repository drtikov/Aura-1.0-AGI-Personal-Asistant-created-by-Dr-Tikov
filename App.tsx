// App.tsx
import React, { useEffect, useState } from 'react';
import { AuraProvider } from './context/AuraProvider';
import { useAuraDispatch, useCoreState, useSystemState } from './context/AuraContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { ToastContainer } from './components/Toast';
// FIX: Corrected import path casing for ControlDeckComponent to resolve a module resolution conflict.
import { ControlDeckComponent } from './components/controlDeckComponent';
import { Header } from './components/Header';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed';
import { ModalPayloads } from './types';
import { LeftColumnComponent } from './components/LeftColumnComponent';
import { ApiKeySelector } from './components/ApiKeySelector';

const AppContent: React.FC = () => {
    // The useAuraDispatch hook is used to access state and handlers provided by AuraProvider.
    const { toasts, removeToast, videoRef, isVisualAnalysisActive, syscall, memoryStatus } = useAuraDispatch();
    const { modalRequest } = useCoreState();
    const { isApiKeyInvalidated } = useSystemState();
    const modal = useModal();
    const [isKeySelectionRequired, setIsKeySelectionRequired] = useState(false);

    useEffect(() => {
        // Hide the static splash screen only AFTER the main state has been loaded.
        if (memoryStatus === 'ready') {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                // To ensure the splash is visible for at least a moment and the UI is painted,
                // we add a short delay before starting the fade-out.
                setTimeout(() => {
                    splash.classList.add('fade-out');
                    const removeSplash = () => splash.remove();
                    // Listen for the end of the transition to remove the element from the DOM.
                    splash.addEventListener('transitionend', removeSplash, { once: true });
                    // Add a fallback timeout in case the transitionend event doesn't fire.
                    setTimeout(removeSplash, 500); // 500ms matches the CSS transition
                }, 100); // 100ms delay to ensure it's visible
            }
        }
    }, [memoryStatus]);

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
        if (isApiKeyInvalidated) {
            setIsKeySelectionRequired(true);
            syscall('SYSTEM/CLEAR_API_KEY_INVALIDATED', {});
        }
    }, [isApiKeyInvalidated, syscall]);
    
    if (isKeySelectionRequired) {
        return <ApiKeySelector onKeySelected={() => setIsKeySelectionRequired(false)} />;
    }

    return (
        <div className="app-wrapper">
            {/* The React-based splash screen has been removed to simplify the loading logic
                and rely solely on the static splash screen in index.html for a smoother transition. */}
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