// components/LiveTranscriptOverlay.tsx
import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useCoreState, useAuraDispatch } from '../context/AuraContext.tsx';

export const LiveTranscriptOverlay = () => {
    const { liveSessionState } = useCoreState();
    const { stopSession } = useAuraDispatch();
    const { status, inputTranscript, outputTranscript } = liveSessionState;

    if (status === 'idle' || status === 'error') {
        return null;
    }

    return (
        <div className="live-transcript-overlay">
            <div className="live-status-indicator">
                <span className={`status-dot ${status}`}></span>
                {status.toUpperCase()}
            </div>
            <div className="transcript-display">
                <p className="transcript-line user-line">
                    <strong>You:</strong> {inputTranscript}
                    {status === 'live' && <span className="blinking-cursor"></span>}
                </p>
                <p className="transcript-line aura-line">
                    <strong>Aura:</strong> {outputTranscript}
                    {status === 'live' && outputTranscript && <span className="blinking-cursor"></span>}
                </p>
            </div>
            <button className="end-session-button" onClick={stopSession}>
                End Session
            </button>
        </div>
    );
};