// components/ImageGenerationModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

// This component is a placeholder based on VideoGenerationModal to fix build errors.
export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast(t('toast_promptRequired'), 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedImageUrl(null);
        try {
            const images = await geminiAPI.generateImage();
            if (images && images[0]) {
                const imageUrl = `data:image/jpeg;base64,${images[0]}`;
                setGeneratedImageUrl(imageUrl);
                addToast(t('toast_imageGenSuccess'), 'success');
            } else {
                throw new Error('Image generation returned no data.');
            }
        } catch (error) {
            console.error("Image generation failed:", error);
            addToast(t('toast_imageGenFailed') + `: ${(error as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    useEffect(() => {
        if (!isOpen) {
            setPrompt(initialPrompt || '');
            setGeneratedImageUrl(null);
            setIsGenerating(false);
        } else {
            setPrompt(initialPrompt || '');
        }
    }, [isOpen, initialPrompt]);


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageGenerator')} className="video-generation-modal">
            <div className="video-gen-layout">
                <div className="video-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{t('imageGen_prompt')}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageGen_promptPlaceholder')} disabled={isGenerating} rows={4}/>
                    </div>
                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>
                <div className="video-gen-preview">
                    {isGenerating ? (
                        <div className="loading-overlay active" style={{position: 'relative', background: 'var(--panel-bg)'}}>
                            <div className="spinner-small"></div>
                            <span>Generating...</span>
                        </div>
                    ) : generatedImageUrl ? (
                         <div className="generated-image-item">
                            <img src={generatedImageUrl} alt="generated" />
                        </div>
                    ) : (
                        <p>Your generated image will appear here.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};
