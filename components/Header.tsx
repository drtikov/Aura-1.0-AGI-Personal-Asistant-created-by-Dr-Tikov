import React from 'react';
import { useModal } from '../context/ModalContext';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';

export const Header = () => {
    const modal = useModal();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { liveSessionState } = useCoreState();
    const isLive = liveSessionState.status === 'live' || liveSessionState.status === 'connecting';

    const handleGoLive = () => {
        if (isLive) {
            // The actual stopping logic is in useLiveSession, triggered by the overlay button
            // This is just a backup, but the primary control is the overlay's "End Session"
             syscall('LIVE/DISCONNECT', {});
        } else {
            syscall('LIVE/CONNECT', {});
        }
    };

    return (
        <header className="app-header">
            <div className="header-title">
                AURA
            </div>
            <div className="header-actions">
                 <button 
                    className={`image-generator-button go-live-button ${isLive ? 'live' : ''}`}
                    onClick={handleGoLive}
                    title={t('tip_goLive')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                    <span>{isLive ? t('header_goLive_active') : t('header_goLive')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('imageGeneration', {})}
                    title={t('tip_generateImage')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.51 6 17.5h12l-3.86-5.14z"/>
                    </svg>
                    <span>{t('header_imageGenerator')}</span>
                </button>
                 <button 
                    className="image-generator-button"
                    onClick={() => modal.open('imageEditing', {})}
                    title={t('tip_editImage')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    <span>{t('header_imageEditor')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('videoGeneration', {})}
                    title={t('tip_generateVideo')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                    <span>{t('header_videoGenerator')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('musicGeneration', {})}
                    title={t('tip_sonicForge')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <span>{t('header_sonicForge')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('pluginManager', {})}
                    title={t('tip_pluginManager')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A1.5 1.5 0 0 0 11.5 2h-1A1.5 1.5 0 0 0 9 3.5V5H5c-1.1 0-2 .9-2 2v4H1.5A1.5 1.5 0 0 0 0 12.5v1A1.5 1.5 0 0 0 1.5 15H3v4c0 1.1.9 2 2 2h4v1.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5V21h4c1.1 0 2-.9 2-2v-4h1.5a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 20.5 11z" />
                    </svg>
                    <span>{t('header_pluginManager')}</span>
                </button>
            </div>
        </header>
    );
};