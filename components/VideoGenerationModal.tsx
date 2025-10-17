import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

// FIX: Completed the truncated `VideoGenerationModal.tsx` file with a functional component to resolve export and syntax errors.
export const VideoGenerationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast(t('toast_promptRequired'), 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedVideoUrl(null);
        setProgressMessage(t('videoGen_progress_sending'));

        try {
            const onProgress = (message: string) => {
                setProgressMessage(message);
            };
            const videoUrl = await geminiAPI.generateVideo(prompt, onProgress);
            if (videoUrl) {
                setGeneratedVideoUrl(videoUrl);
                addToast(t('toast_videoGenSuccess'), 'success');
            } else {
                throw new Error('Video generation returned no data.');
            }
        } catch (error) {
            console.error("Video generation failed:", error);
            addToast(t('toast_videoGenFailed'), 'error');
        } finally {
            setIsGenerating(false);
            setProgressMessage('');
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
            setGeneratedVideoUrl(null);
            setIsGenerating(false);
            setProgressMessage('');
        }
    }, [isOpen]);

    const handleDownload = (videoUrl: string | null) => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `aura-generated-video-${Date.now()}.mp4`;
        link.target = '_blank'; // Needed for some browsers
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('videoGen')} className="video-generation-modal">
            <div className="video-gen-layout">
                <div className="video-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="vid-prompt">{t('imageGen_prompt')}</label>
                        <textarea id="vid-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('videoGen_promptPlaceholder')} disabled={isGenerating} rows={4}/>
                    </div>
                    {/* Simplified controls for now */}
                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('videoGen_generating') : t('videoGen_generate')}
                    </button>
                </div>
                <div className="video-gen-preview">
                    {isGenerating ? (
                        <div className="loading-overlay active">
                            <div className="spinner-small"></div>
                            <span>{progressMessage || t('videoGen_generating')}</span>
                        </div>
                    ) : generatedVideoUrl ? (
                         <div className="generated-image-item">
                            <video src={generatedVideoUrl} controls autoPlay loop muted />
                             <div className="image-item-actions">
                                <button onClick={() => handleDownload(generatedVideoUrl)} title={t('videoGen_download')}>
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>{t('videoGen_placeholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};