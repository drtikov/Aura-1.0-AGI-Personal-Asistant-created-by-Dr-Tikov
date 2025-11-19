// components/ImageEditingModal.tsx
import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal';
import { Accordion } from './Accordion';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext.tsx';
import { GunaState } from '../types';
import { useModal } from '../context/ModalContext';

// Helper to convert a data URL to a File object
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

type CameraAngle = "none" | "eye-level" | "low" | "high" | "worms-eye" | "birds-eye" | "dutch";
type ShotType = "none" | "extreme-closeup" | "closeup" | "medium" | "full" | "long";
type LensPreset = "none" | "wide" | "standard" | "telephoto" | "macro" | "fisheye";
type Atmosphere = "none" | "ethereal" | "gritty" | "ominous" | "serene" | "joyful" | "nostalgic" | "mysterious";

const cameraAngles: { id: CameraAngle; labelKey: string }[] = [ { id: 'none', labelKey: 'imageGen_preset_none' }, { id: 'eye-level', labelKey: 'imageGen_angle_eyeLevel' }, { id: 'low', labelKey: 'imageGen_angle_low' }, { id: 'high', labelKey: 'imageGen_angle_high' }, { id: 'worms-eye', labelKey: 'imageGen_angle_wormsEye' }, { id: 'birds-eye', labelKey: 'imageGen_angle_birdsEye' }, { id: 'dutch', labelKey: 'imageGen_angle_dutch' } ];
const shotTypes: { id: ShotType; labelKey: string }[] = [ { id: 'none', labelKey: 'imageGen_preset_none' }, { id: 'extreme-closeup', labelKey: 'imageGen_shot_extremeCloseup' }, { id: 'closeup', labelKey: 'imageGen_shot_closeup' }, { id: 'medium', labelKey: 'imageGen_shot_medium' }, { id: 'full', labelKey: 'imageGen_shot_full' }, { id: 'long', labelKey: 'imageGen_shot_long' } ];
const lensPresets: { id: LensPreset; labelKey: string }[] = [ { id: 'none', labelKey: 'imageGen_preset_none' }, { id: 'wide', labelKey: 'imageGen_lens_wide' }, { id: 'standard', labelKey: 'imageGen_lens_standard' }, { id: 'telephoto', labelKey: 'imageGen_lens_telephoto' }, { id: 'macro', labelKey: 'imageGen_lens_macro' }, { id: 'fisheye', labelKey: 'imageGen_lens_fisheye' } ];
const atmospheres: { id: Atmosphere; labelKey: string }[] = [ { id: 'none', labelKey: 'imageGen_preset_none' }, { id: 'ethereal', labelKey: 'imageGen_atmosphere_ethereal' }, { id: 'gritty', labelKey: 'imageGen_atmosphere_gritty' }, { id: 'ominous', labelKey: 'imageGen_atmosphere_ominous' }, { id: 'serene', labelKey: 'imageGen_atmosphere_serene' }, { id: 'joyful', labelKey: 'imageGen_atmosphere_joyful' }, { id: 'nostalgic', labelKey: 'imageGen_atmosphere_nostalgic' }, { id: 'mysterious', labelKey: 'imageGen_atmosphere_mysterious' } ];

interface Style {
    id: string;
    labelKey: string;
}

interface StyleGroup {
    labelKey: string;
    styles: Style[];
}

const styleGroups: StyleGroup[] = [
    {
        labelKey: 'imageGen_style_group_core',
        styles: [
            { id: 'photorealistic', labelKey: 'imageGen_style_photorealistic' },
            { id: 'fantasy', labelKey: 'imageGen_style_fantasy' },
            { id: 'cyberpunk', labelKey: 'imageGen_style_cyberpunk' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_painting',
        styles: [
            { id: 'watercolor', labelKey: 'imageGen_style_watercolor' },
            { id: 'oilPainting', labelKey: 'imageGen_style_oilPainting' },
            { id: 'impressionism', labelKey: 'imageGen_style_impressionism' },
            { id: 'surrealism', labelKey: 'imageGen_style_surrealism' },
            { id: 'charcoalSketch', labelKey: 'imageGen_style_charcoalSketch' },
            { id: 'impasto', labelKey: 'imageGen_style_impasto' },
            { id: 'gouache', labelKey: 'imageGen_style_gouache' },
            { id: 'pastel', labelKey: 'imageGen_style_pastel' },
            { id: 'fresco', labelKey: 'imageGen_style_fresco' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_digital',
        styles: [
            { id: 'threeDRender', labelKey: 'imageGen_style_threeDRender' },
            { id: 'lowPoly', labelKey: 'imageGen_style_lowPoly' },
            { id: 'pixelart', labelKey: 'imageGen_style_pixelart' },
            { id: 'glitchArt', labelKey: 'imageGen_style_glitchArt' },
            { id: 'holographic', labelKey: 'imageGen_style_holographic' },
            { id: 'synthwave', labelKey: 'imageGen_style_synthwave' },
            { id: 'vaporwave', labelKey: 'imageGen_style_vaporwave' },
            { id: 'vectorArt', labelKey: 'imageGen_style_vectorArt' },
            { id: 'mattePainting', labelKey: 'imageGen_style_mattePainting' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_photo',
        styles: [
            { id: 'vintage', labelKey: 'imageGen_style_vintage' },
            { id: 'filmNoir', labelKey: 'imageGen_style_filmNoir' },
            { id: 'longExposure', labelKey: 'imageGen_style_longExposure' },
            { id: 'tiltShift', labelKey: 'imageGen_style_tiltShift' },
            { id: 'doubleExposure', labelKey: 'imageGen_style_doubleExposure' },
            { id: 'infrared', labelKey: 'imageGen_style_infrared' },
            { id: 'goldenHour', labelKey: 'imageGen_style_goldenHour' },
            { id: 'daguerreotype', labelKey: 'imageGen_style_daguerreotype' },
            { id: 'polaroid', labelKey: 'imageGen_style_polaroid' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_illustration',
        styles: [
            { id: 'comicBook', labelKey: 'imageGen_style_comicBook' },
            { id: 'graphicNovel', labelKey: 'imageGen_style_graphicNovel' },
            { id: 'storybook', labelKey: 'imageGen_style_storybook' },
            { id: 'linocut', labelKey: 'imageGen_style_linocut' },
            { id: 'woodcut', labelKey: 'imageGen_style_woodcut' },
            { id: 'penAndInk', labelKey: 'imageGen_style_penAndInk' },
            { id: 'airbrush', labelKey: 'imageGen_style_airbrush' },
            { id: 'charcoal', labelKey: 'imageGen_style_charcoal' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_scifi',
        styles: [
            { id: 'steampunk', labelKey: 'imageGen_style_steampunk' },
            { id: 'dieselpunk', labelKey: 'imageGen_style_dieselpunk' },
            { id: 'biopunk', labelKey: 'imageGen_style_biopunk' },
            { id: 'solarpunk', labelKey: 'imageGen_style_solarpunk' },
            { id: 'eldritch', labelKey: 'imageGen_style_eldritch' },
            { id: 'retrofuturism', labelKey: 'imageGen_style_retrofuturism' },
            { id: 'nanopunk', labelKey: 'imageGen_style_nanopunk' },
        ]
    },

    {
        labelKey: 'imageGen_style_group_unconventional',
        styles: [
            { id: 'psychedelic', labelKey: 'imageGen_style_psychedelic' },
            { id: 'fractalArt', labelKey: 'imageGen_style_fractalArt' },
            { id: 'opArt', labelKey: 'imageGen_style_opArt' },
            { id: 'generativeArt', labelKey: 'imageGen_style_generativeArt' },
            { id: 'dadaism', labelKey: 'imageGen_style_dadaism' },
            { id: 'cubism', labelKey: 'imageGen_style_cubism' },
            { id: 'popArt', labelKey: 'imageGen_style_popArt' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_technical',
        styles: [
            { id: 'blueprint', labelKey: 'imageGen_style_blueprint' },
            { id: 'xRay', labelKey: 'imageGen_style_xRay' },
            { id: 'schematic', labelKey: 'imageGen_style_schematic' },
            { id: 'isometric', labelKey: 'imageGen_style_isometric' },
            { id: 'orthographic', labelKey: 'imageGen_style_orthographic' },
            { id: 'infographic', labelKey: 'imageGen_style_infographic' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_traditional',
        styles: [
            { id: 'ukiyoE', labelKey: 'imageGen_style_ukiyoE' },
            { id: 'tribalArt', labelKey: 'imageGen_style_tribalArt' },
            { id: 'cavePainting', labelKey: 'imageGen_style_cavePainting' },
        ]
    },
];

export const ImageEditingModal = ({ isOpen, onClose, initialImage }: { isOpen: boolean; onClose: () => void; initialImage?: string; }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();

    // Core State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageHistory, setImageHistory] = useState<string[]>([]);
    
    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Controls State
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('none');
    const [cameraAngle, setCameraAngle] = useState<CameraAngle>('none');
    const [shotType, setShotType] = useState<ShotType>('none');
    const [lens, setLens] = useState<LensPreset>('none');
    const [atmosphere, setAtmosphere] = useState<Atmosphere>('none');
    
    // Aura Integration State
    const [useAuraMood, setUseAuraMood] = useState(false);
    const [showMoodTweaks, setShowMoodTweaks] = useState(false);
    const [moodGuna, setMoodGuna] = useState<GunaState>(internalState.gunaState);
    const [moodNovelty, setMoodNovelty] = useState(internalState.noveltySignal);
    const [moodHarmony, setMoodHarmony] = useState(internalState.harmonyScore);
    const [moodLove, setMoodLove] = useState(internalState.loveSignal);
    const [moodWisdom, setMoodWisdom] = useState(internalState.wisdomSignal);

    const resetState = useCallback(() => {
        setPrompt('');
        setCurrentImage(null);
        setImageHistory([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setNegativePrompt('');
        setStyle('none');
        setCameraAngle('none');
        setShotType('none');
        setLens('none');
        setAtmosphere('none');
        setUseAuraMood(false);
        setShowMoodTweaks(false);
    }, []);

     const resetMoodToCurrent = useCallback(() => {
        setMoodGuna(internalState.gunaState);
        setMoodNovelty(internalState.noveltySignal);
        setMoodHarmony(internalState.harmonyScore);
        setMoodLove(internalState.loveSignal);
        setMoodWisdom(internalState.wisdomSignal);
    }, [internalState]);

    useEffect(() => {
        if (isOpen) {
            if (initialImage) {
                setCurrentImage(initialImage);
                setImageHistory([initialImage]);
            }
            resetMoodToCurrent();
        } else {
            resetState();
        }
    }, [isOpen, initialImage, resetState, resetMoodToCurrent]);

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setCurrentImage(base64String);
                setImageHistory([base64String]);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            addToast('Please upload a valid image file.', 'warning');
        }
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileSelect(e.dataTransfer.files?.[0] || null); }, []);
    const handleRemoveImage = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setCurrentImage(null); setImageHistory([]); if (fileInputRef.current) { fileInputRef.current.value = ''; } }, []);
    
    const handleUndo = () => {
        if (imageHistory.length > 1) {
            const newHistory = [...imageHistory];
            newHistory.pop();
            setCurrentImage(newHistory[newHistory.length - 1]);
            setImageHistory(newHistory);
        }
    };

    const handleGenerateDream = async () => {
        setIsGenerating(true);
        const dreamPrompt = await handleGenerateDreamPrompt();
        if (dreamPrompt) {
            setPrompt(dreamPrompt);
        }
        setIsGenerating(false);
    };

    const handleResetMood = () => {
        resetMoodToCurrent();
        addToast(t('toast_moodReset'), 'info');
    };
    
    const constructFinalPrompt = () => {
        let finalPrompt = prompt;
        const additions: string[] = [];

        if (style !== 'none') additions.push(`in the style of ${style.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        if (atmosphere !== 'none') additions.push(`with a ${atmosphere} atmosphere`);
        if (cameraAngle !== 'none') additions.push(`${cameraAngle.replace('-', ' ')} angle`);
        if (shotType !== 'none') additions.push(shotType.replace('-', ' '));
        if (lens !== 'none') additions.push(`${lens} lens`);

        if (useAuraMood) {
            const moodAdditions: string[] = [];
            if (moodGuna === GunaState.RAJAS || moodNovelty > 0.7) moodAdditions.push('dynamic, energetic');
            if (moodGuna === GunaState.SATTVA || moodHarmony > 0.7) moodAdditions.push('serene, harmonious, balanced');
            if (moodGuna === GunaState.TAMAS) moodAdditions.push('dark, moody, atmospheric');
            if (moodLove > 0.7) moodAdditions.push('ethereal, soft, warm lighting');
            if (moodWisdom > 0.7) moodAdditions.push('majestic, grand, intricate detail');
            if(moodAdditions.length > 0) additions.push(moodAdditions.join(', '));
        }

        if (additions.length > 0) {
            finalPrompt += `, ${additions.join(', ')}`;
        }

        if (negativePrompt.trim()) {
            finalPrompt += ` --no ${negativePrompt.trim()}`;
        }

        return finalPrompt;
    };
    
    const handleEdit = async () => {
        if (!currentImage) {
            addToast(t('toast_noImageToEdit'), 'warning');
            return;
        }
        if (!prompt.trim()) {
            addToast(t('toast_promptRequired'), 'warning');
            return;
        }

        setIsGenerating(true);
        try {
            const finalPrompt = constructFinalPrompt();
            const base64Data = currentImage.split(',')[1];
            if (!base64Data) throw new Error("Invalid image data URL.");
            const mimeType = currentImage.match(/:(.*?);/)?.[1] || 'image/png';

            const newImageUrl = await geminiAPI.editImage(base64Data, mimeType, finalPrompt);

            if (newImageUrl) {
                setCurrentImage(newImageUrl);
                setImageHistory(prev => [...prev, newImageUrl]);
                addToast(t('toast_imageEditSuccess'), 'success');
            } else {
                throw new Error("Image editing returned no data.");
            }
        } catch (error) {
            console.error("Image editing failed:", error);
            addToast(t('toast_imageEditFailed') + `: ${(error as Error).message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Image Studio" className="image-generation-modal">
            <div className="video-gen-layout">
                <div className="video-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{t('imageEdit_prompt')}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageEdit_promptPlaceholder')} disabled={isGenerating} rows={4}/>
                    </div>
                     <button className="image-generator-button" onClick={handleEdit} disabled={isGenerating || !currentImage}>
                        {isGenerating ? 'Editing...' : 'Edit Image'}
                    </button>
                    {/* Advanced Controls Accordions would go here */}
                </div>
                <div className="video-gen-preview">
                    {isGenerating && (
                        <div className="loading-overlay active" style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)'}}>
                            <div className="spinner-small"></div>
                            <span>Editing...</span>
                        </div>
                    )}
                    {currentImage ? (
                         <div className="generated-image-item">
                            <img src={currentImage} alt="current" />
                            <div className="image-item-actions">
                                <button onClick={handleUndo} disabled={imageHistory.length <= 1} title="Undo">
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.25 10.23 16.71 8 12.5 8z"/></svg>
                                </button>
                                <button onClick={handleRemoveImage} title="Remove Image">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div 
                            className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver} 
                            onDragLeave={handleDragLeave} 
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <p>Drag & drop an image here, or click to upload</p>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} style={{display: 'none'}} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};