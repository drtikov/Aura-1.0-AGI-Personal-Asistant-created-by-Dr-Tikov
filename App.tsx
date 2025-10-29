// App.tsx
import React, { useEffect } from 'react';
// FIX: Corrected import path for AuraProvider to resolve module not found error.
import { AuraProvider } from './context/AuraProvider.tsx';
import { useAuraDispatch, useCoreState } from './context/AuraContext.tsx';
import { ModalProvider, useModal } from './context/ModalContext.tsx';
import { ToastContainer } from './components/Toast.tsx';
// FIX: Corrected the import path for ControlDeckComponent to directly use the canonical PascalCase filename ('ControlDeckComponent.tsx'). This resolves a module resolution error caused by ambiguity between the component file and its differently-cased re-export file, ensuring consistent and correct module loading.
import { ControlDeckComponent } from './components/ControlDeckComponent.tsx';
// import { LiveTranscriptOverlay } from './components/LiveTranscriptOverlay'; // File not provided
import { Header } from './components/Header.tsx';
import { VisualAnalysisFeed } from './components/VisualAnalysisFeed.tsx';
import { ModalPayloads } from './types.ts';
import { LeftColumnComponent } from './components/LeftColumnComponent.tsx';

const AppContent: React.FC = () => {
    // The useAuraDispatch hook is used to access state and handlers provided by AuraProvider.
    const { toasts, removeToast, videoRef, isVisualAnalysisActive, syscall, memoryStatus } = useAuraDispatch();
    const { modalRequest } = useCoreState();
    const modal = useModal();

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
            // The type assertion here is a bit loose but necessary to bridge the state and context systems.
            // We trust that the syscall payload is correct.
            modal.open(modalRequest.type as keyof ModalPayloads, modalRequest.payload as any);
            syscall('CLEAR_MODAL_REQUEST', {});
        }
    }, [modalRequest, modal, syscall]);

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