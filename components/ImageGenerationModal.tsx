import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { Accordion } from './Accordion.tsx';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext.tsx';
import { GunaState } from '../types.ts';
import { useModal } from '../context/ModalContext.tsx';

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
type CameraAngle = "none" | "eye-level" | "low" | "high" | "worms-eye" | "birds-eye" | "dutch";
type ShotType = "none" | "extreme-closeup" | "closeup" | "medium" | "full" | "long";
type LensPreset = "none" | "wide" | "standard" | "telephoto" | "macro" | "fisheye";
type LightingStyle = "none" | "cinematic" | "rim" | "backlit" | "studio" | "golden" | "blue" | "neon" | "chiaroscuro";
type Atmosphere = "none" | "ethereal" | "gritty" | "ominous" | "serene" | "joyful" | "nostalgic" | "mysterious";

const cameraAngles: { id: CameraAngle; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'eye-level', labelKey: 'imageGen_angle_eyeLevel' },
    { id: 'low', labelKey: 'imageGen_angle_low' },
    { id: 'high', labelKey: 'imageGen_angle_high' },
    { id: 'worms-eye', labelKey: 'imageGen_angle_wormsEye' },
    { id: 'birds-eye', labelKey: 'imageGen_angle_birdsEye' },
    { id: 'dutch', labelKey: 'imageGen_angle_dutch' },
];

const shotTypes: { id: ShotType; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'extreme-closeup', labelKey: 'imageGen_shot_extremeCloseup' },
    { id: 'closeup', labelKey: 'imageGen_shot_closeup' },
    { id: 'medium', labelKey: 'imageGen_shot_medium' },
    { id: 'full', labelKey: 'imageGen_shot_full' },
    { id: 'long', labelKey: 'imageGen_shot_long' },
];

const lensPresets: { id: LensPreset; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'wide', labelKey: 'imageGen_lens_wide' },
    { id: 'standard', labelKey: 'imageGen_lens_standard' },
    { id: 'telephoto', labelKey: 'imageGen_lens_telephoto' },
    { id: 'macro', labelKey: 'imageGen_lens_macro' },
    { id: 'fisheye', labelKey: 'imageGen_lens_fisheye' },
];

const lightingStyles: { id: LightingStyle; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'cinematic', labelKey: 'imageGen_lighting_cinematic' },
    { id: 'rim', labelKey: 'imageGen_lighting_rim' },
    { id: 'backlit', labelKey: 'imageGen_lighting_backlit' },
    { id: 'studio', labelKey: 'imageGen_lighting_studio' },
    { id: 'golden', labelKey: 'imageGen_lighting_goldenHour' },
    { id: 'blue', labelKey: 'imageGen_lighting_blueHour' },
    { id: 'neon', labelKey: 'imageGen_lighting_neon' },
    { id: 'chiaroscuro', labelKey: 'imageGen_lighting_chiaroscuro' },
];

const atmospheres: { id: Atmosphere; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'ethereal', labelKey: 'imageGen_atmosphere_ethereal' },
    { id: 'gritty', labelKey: 'imageGen_atmosphere_gritty' },
    { id: 'ominous', labelKey: 'imageGen_atmosphere_ominous' },
    { id: 'serene', labelKey: 'imageGen_atmosphere_serene' },
    { id: 'joyful', labelKey: 'imageGen_atmosphere_joyful' },
    { id: 'nostalgic', labelKey: 'imageGen_atmosphere_nostalgic' },
    { id: 'mysterious', labelKey: 'imageGen_atmosphere_mysterious' },
];

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

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string }) => {
    const { t } = useLocalization();
    const { geminiAPI, addToast, setAttachedFile, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();
    const modal = useModal();

    // Core State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    
    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Controls State
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('none');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isMixing, setIsMixing] = useState(false);
    const [promptB, setPromptB] = useState('');
    const [mixRatio, setMixRatio] = useState(0.5);
    const [styleStrength, setStyleStrength] = useState(50);
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);

    // Director's Toolkit State
    const [cameraAngle, setCameraAngle] = useState<CameraAngle>('none');
    const [shotType, setShotType] = useState<ShotType>('none');
    const [lens, setLens] = useState<LensPreset>('none');
    const [lightingStyle, setLightingStyle] = useState<LightingStyle>('none');
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
        setNegativePrompt('');
        setStyle('none');
        setAspectRatio('1:1');
        setGeneratedImages([]);
        setIsMixing(false);
        setPromptB('');
        setMixRatio(0.5);
        setStyleStrength(50);
        setReferenceImage(null);
        if (referenceImageUrl) URL.revokeObjectURL(referenceImageUrl);
        setReferenceImageUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setCameraAngle('none');
        setShotType('none');
        setLens('none');
        setLightingStyle('none');
        setAtmosphere('none');
        setUseAuraMood(false);
        setShowMoodTweaks(false);
    }, [referenceImageUrl]);

    const resetMoodToCurrent = useCallback(() => {
        setMoodGuna(internalState.gunaState);
        setMoodNovelty(internalState.noveltySignal);
        setMoodHarmony(internalState.harmonyScore);
        setMoodLove(internalState.loveSignal);
        setMoodWisdom(internalState.wisdomSignal);
    }, [internalState]);
    
    useEffect(() => {
        if (isOpen) {
            setPrompt(initialPrompt || '');
            resetMoodToCurrent();
        } else {
            resetState();
        }
    }, [isOpen, initialPrompt, resetState, resetMoodToCurrent]);

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setReferenceImage(file);
            if (referenceImageUrl) URL.revokeObjectURL(referenceImageUrl);
            setReferenceImageUrl(URL.createObjectURL(file));
        } else if (file) {
            addToast('Please upload a valid image file.', 'warning');
        }
    };
    
    const constructFinalPrompt = () => {
        let finalPrompt = prompt;
        const additions: string[] = [];
    
        if (style !== 'none') additions.push(`in the style of ${style.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        if (atmosphere !== 'none') additions.push(`with a ${atmosphere} atmosphere`);
        if (lightingStyle !== 'none') additions.push(`${lightingStyle.replace('-', ' ')} lighting`);
        if (cameraAngle !== 'none') additions.push(`${cameraAngle.replace('-', ' ')} angle shot`);
        if (shotType !== 'none') additions.push(`${shotType.replace('-', ' ')}`);
        if (lens !== 'none') additions.push(`using a ${lens} lens`);
    
        if (useAuraMood) {
            if (moodGuna === GunaState.SATTVA) additions.push('embodying clarity, harmony, and purity');
            if (moodGuna === GunaState.RAJAS) additions.push('filled with dynamic energy, passion, and action');
            if (moodGuna === GunaState.TAMAS) additions.push('shrouded in shadow, inertia, and mystery');
            if (moodNovelty > 0.75) additions.push('with a surprising, unconventional element');
            if (moodHarmony > 0.75) additions.push('with a balanced and harmonious composition');
            if (moodLove > 0.75) additions.push('evoking a feeling of warmth, connection, and love');
            if (moodWisdom > 0.75) additions.push('with a sense of deep insight and wisdom');
        }
    
        if (additions.length > 0) finalPrompt += `, ${additions.join(', ')}`;
    
        return finalPrompt;
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast(t('toast_promptRequired'), 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedImages([]);
        try {
            const finalPrompt = constructFinalPrompt();
            const images = await geminiAPI.generateImage(
                finalPrompt,
                negativePrompt,
                aspectRatio,
                style,
                1,
                referenceImage,
                isMixing,
                promptB,
                mixRatio,
                styleStrength,
                cameraAngle,
                shotType,
                lens,
                lightingStyle,
                atmosphere,
                useAuraMood,
                useAuraMood ? { guna: moodGuna, novelty: moodNovelty, harmony: moodHarmony, love: moodLove, wisdom: moodWisdom } : undefined
            );
            setGeneratedImages(images);
            addToast(t('toast_imageGenSuccess'), 'success');
        } catch (error) {
            console.error("Image generation failed:", error);
            addToast(t('toast_imageGenFailed'), 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUseInChat = async (imageUrl: string) => {
        const file = dataURLtoFile(imageUrl, "generated-image.png");
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAttachedFile({ file, previewUrl, type: 'image' });
            onClose();
        } else {
            addToast("Failed to prepare image for chat.", "error");
        }
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `aura-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEdit = (imageUrl: string) => {
        modal.open('imageEditing', { initialImage: imageUrl });
        onClose(); // Close the generation modal
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageGen')} className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    {/* All controls go here */}
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{t('imageGen_prompt')}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageGen_prompt_placeholder')} disabled={isGenerating} rows={4}/>
                    </div>

                     <Accordion title={t('imageGen_directorsToolkit')} defaultOpen={true}>
                         <div className="image-gen-control-group">
                            <label htmlFor="camera-angle">{t('imageGen_cameraAngle')}</label>
                            <select id="camera-angle" value={cameraAngle} onChange={e => setCameraAngle(e.target.value as CameraAngle)} disabled={isGenerating}>
                                {cameraAngles.map(a => <option key={a.id} value={a.id}>{t(a.labelKey)}</option>)}
                            </select>
                        </div>
                         <div className="image-gen-control-group">
                            <label htmlFor="shot-type">{t('imageGen_shotType')}</label>
                            <select id="shot-type" value={shotType} onChange={e => setShotType(e.target.value as ShotType)} disabled={isGenerating}>
                                {shotTypes.map(s => <option key={s.id} value={s.id}>{t(s.labelKey)}</option>)}
                            </select>
                        </div>
                         <div className="image-gen-control-group">
                            <label htmlFor="lens-preset">{t('imageGen_lensPreset')}</label>
                            <select id="lens-preset" value={lens} onChange={e => setLens(e.target.value as LensPreset)} disabled={isGenerating}>
                                {lensPresets.map(l => <option key={l.id} value={l.id}>{t(l.labelKey)}</option>)}
                            </select>
                        </div>
                    </Accordion>
                    
                     <Accordion title={t('imageGen_artisticControls')}>
                        <div className="image-gen-control-group">
                            <label htmlFor="style">{t('imageGen_artisticStyle')}</label>
                            <select id="style" value={style} onChange={e => setStyle(e.target.value)} disabled={isGenerating}>
                                <option value="none">{t('imageGen_style_none')}</option>
                                {styleGroups.map(group => (
                                    <optgroup key={group.labelKey} label={t(group.labelKey)}>
                                        {group.styles.map(s => <option key={s.id} value={s.id}>{t(s.labelKey)}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="lighting-style">{t('imageGen_lighting')}</label>
                            <select id="lighting-style" value={lightingStyle} onChange={e => setLightingStyle(e.target.value as LightingStyle)} disabled={isGenerating}>
                                {lightingStyles.map(l => <option key={l.id} value={l.id}>{t(l.labelKey)}</option>)}
                            </select>
                        </div>
                         <div className="image-gen-control-group">
                            <label htmlFor="atmosphere">{t('imageGen_atmosphere')}</label>
                             <select id="atmosphere" value={atmosphere} onChange={e => setAtmosphere(e.target.value as Atmosphere)} disabled={isGenerating}>
                                {atmospheres.map(a => <option key={a.id} value={a.id}>{t(a.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="neg-prompt">{t('imageGen_negativePrompt')}</label>
                            <textarea id="neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('imageGen_negativePrompt_placeholder')} disabled={isGenerating} rows={2}/>
                        </div>
                    </Accordion>
                    
                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('imageGen_generating') : t('imageGen_generate')}
                    </button>
                </div>
                <div className="image-gen-preview">
                    {isGenerating ? (
                        <div className="loading-overlay active">
                            <div className="spinner-small"></div>
                            <span>{t('imageGen_generating')}</span>
                        </div>
                    ) : generatedImages.length > 0 ? (
                        <div className="image-results-grid">
                            {generatedImages.map((src, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={src} alt={`Generated image ${index + 1}`} />
                                    <div className="image-item-actions">
                                        <button onClick={() => handleDownload(src)} title={t('imageGen_download')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                        </button>
                                        <button onClick={() => handleEdit(src)} title={t('imageGen_edit')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                        </button>
                                        <button onClick={() => handleUseInChat(src)} title={t('imageGen_useInChat')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>{t('imageGen_placeholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};