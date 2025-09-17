
import React from 'react';

interface LoadingOverlayProps {
    isActive: boolean;
    text: string;
}

export const LoadingOverlay = ({ isActive, text }: LoadingOverlayProps) => (
    <div className={`loading-overlay ${isActive ? 'active' : ''}`}>
        <span>{text}</span>
        <div className="spinner-small"></div>
    </div>
);
