import React from 'react';
import { useModal } from '../context/ModalContext';
import { useLocalization } from '../context/AuraContext';

export const Header = () => {
    const modal = useModal();
    const { t } = useLocalization();

    return (
        <header className="app-header">
            <div className="header-title">
                AURA
            </div>
            <div className="header-actions">
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
            </div>
        </header>
    );
};