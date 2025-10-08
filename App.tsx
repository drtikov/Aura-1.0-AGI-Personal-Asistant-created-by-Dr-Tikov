// App.tsx
import React, { useEffect, useRef } from 'react';
// FIX: Unifying component imports through the barrel file to resolve a casing conflict with ControlDeckComponent.
import { ToastContainer, LeftColumnComponent, Header, LiveTranscriptOverlay, ControlDeckComponent } from './components';
import { useAuraDispatch, useCoreState } from './context/AuraContext';
import { ModalProvider } from './context/ModalContext';
import { AuraProvider } from './context/AuraProvider';

// This component renders the main UI layout and is guaranteed to be within all necessary contexts.
const MainLayout = () => {
    // We can now get toasts directly from the context.
    const { toasts, removeToast, startSession } = useAuraDispatch(); 
    const { psychedelicIntegrationState, userModel, liveSessionState } = useCoreState();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Effect to toggle the "Cognitive Kaleidoscope" visual theme
    useEffect(() => {
        const body = document.body;
        if (psychedelicIntegrationState.isActive && psychedelicIntegrationState.mode === 'visions') {
            body.classList.add('visions-active');
        } else {
            body.classList.remove('visions-active');
        }
        // Cleanup function to ensure the class is removed if the component unmounts while active
        return () => {
            body.classList.remove('visions-active');
        };
    }, [psychedelicIntegrationState]);

    useEffect(() => {
        if (liveSessionState.status === 'connecting' && videoRef.current && canvasRef.current) {
            startSession(videoRef.current, canvasRef.current);
        }
    }, [liveSessionState.status, startSession]);

    return (
        <div className="app-wrapper">
            {/* Hidden elements for video processing */}
            <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <LiveTranscriptOverlay />
            <div className={`cognitive-resonance-overlay state-${userModel.inferredCognitiveState}`} />
            <Header />
            <div className="app-container">
                <ToastContainer toasts={toasts} removeToast={removeToast} />
                <LeftColumnComponent />
                <ControlDeckComponent />
            </div>
        </div>
    );
};

export const App = () => {
    return (
        <AuraProvider>
            <ModalProvider>
                <MainLayout />
            </ModalProvider>
        </AuraProvider>
    );
};