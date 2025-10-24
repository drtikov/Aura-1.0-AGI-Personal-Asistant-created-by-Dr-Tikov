// components/Header.tsx
import React from 'react';
import { useModal } from '../context/ModalContext.tsx';
import { useLocalization, useAuraDispatch, useCoreState, useArchitectureState } from '../context/AuraContext.tsx';

export const Header = () => {
    const modal = useModal();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { ontogeneticArchitectState } = useArchitectureState();

    const pendingProposalsCount = ontogeneticArchitectState.proposalQueue.filter(
       p => p.status === 'proposed' || p.status === 'evaluated' || p.status === 'simulation_failed'
    ).length;

    return (
        <header className="app-header">
            <div className="header-title">
                AURA
            </div>
            <div className="header-actions">
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('brainstorm', {})}
                    title={t('tip_brainstorm')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                    </svg>
                    <span>{t('brainstorm')}</span>
                </button>
                <button
                    className="image-generator-button"
                    onClick={() => modal.open('autonomousEvolution', {})}
                    title={t('tip_autonomousEvolution')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                    </svg>
                    <span>{t('autonomousEvolution')}</span>
                    {pendingProposalsCount > 0 && <span className="notification-badge">{pendingProposalsCount}</span>}
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('imageGeneration', {})}
                    title={t('tip_generateImage')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.51 6 17.5h12l-3.86-5.14z"/>
                    </svg>
                    <span>{t('imageGenerator')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('videoGeneration', {})}
                    title={t('tip_generateVideo')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                    </svg>
                    <span>{t('videoGenerator')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('musicGeneration', {})}
                    title={t('tip_sonicForge')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                    <span>{t('sonicForge')}</span>
                </button>
                 <button
                    className="image-generator-button"
                    onClick={() => modal.open('documentForge', {})}
                    title={t('tip_documentForge')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                    </svg>
                    <span>{t('documentForge')}</span>
                </button>
                <button 
                    className="image-generator-button"
                    onClick={() => modal.open('pluginManager', {})}
                    title={t('tip_pluginManager')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A1.5 1.5 0 0 0 11.5 2h-1A1.5 1.5 0 0 0 9 3.5V5H5c-1.1 0-2 .9-2 2v4H1.5A1.5 1.5 0 0 0 0 12.5v1A1.5 1.5 0 0 0 1.5 15H3v4c0 1.1.9 2 2 2h4v1.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5V21h4c1.1 0 2-.9 2-2v-4h1.5a1.5 1.5 0 0 0 1.5-1.5v-1A1.5 1.5 0 0 0 20.5 11z" />
                    </svg>
                    <span>{t('pluginManager')}</span>
                </button>
            </div>
        </header>
    );
};