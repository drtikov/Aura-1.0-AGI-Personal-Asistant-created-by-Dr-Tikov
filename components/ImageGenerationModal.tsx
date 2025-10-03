

import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal';
import { Accordion } from './Accordion';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';
import { GunaState } from '../types';
// FIX: Add missing import for the useModal hook to resolve 'Cannot find name' error.
import { useModal } from '../context/ModalContext';

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
// FIX: Reverted keys to videoGen_ to align with localization.ts fix and resolve duplicate key errors.
            { id: 'watercolor', labelKey: 'videoGen_style_watercolor' },
            { id: 'oilPainting', labelKey: 'videoGen_style_oilPainting' },
            { id: 'impressionism', labelKey: 'imageGen_style_impressionism' },
            { id: 'surrealism', labelKey: 'imageGen_style_surrealism' },
            { id: 'charcoalSketch', labelKey: 'imageGen_style_charcoalSketch' },
            { id: 'impasto', labelKey: 'imageGen_style_impasto' },
            { id: 'gouache', labelKey: 'videoGen_style_gouache' },
            { id: 'pastel', labelKey: 'videoGen_style_pastel' },
            { id: 'fresco', labelKey: 'videoGen_style_fresco' },
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

export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string }) => {
    const { t } = useLocalization();
    const { generateImage, addToast, setAttachedFile, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();
    const modal = useModal();

    // Core State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    
    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Basic Controls State
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [style, setStyle] = useState('none');
    
    // Advanced Controls State
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
    const [isMixing, setIsMixing] = useState(false);
    const [promptB, setPromptB] = useState('');
    const [mixRatio, setMixRatio] = useState(0.5);
    const [styleStrength, setStyleStrength] = useState(50);
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
        setGeneratedImages([]);
        setNegativePrompt('');
        setAspectRatio('1:1');
        setStyle('none');
        setNumberOfImages(1);
        setReferenceImage(null);
        setReferenceImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsMixing(false);
        setPromptB('');
        setMixRatio(0.5);
        setStyleStrength(50);
        setCameraAngle('none');
        setShotType('none');
        setLens('none');
        setLightingStyle('none');
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
            setPrompt(initialPrompt || '');
            resetMoodToCurrent();
        } else {
            resetState();
        }
    }, [isOpen, initialPrompt, resetState, resetMoodToCurrent]);

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            setReferenceImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            addToast('Please upload a valid image file.', 'warning');
        }
    };
    
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileSelect(e.dataTransfer.files?.[0] || null); }, []);
    const handleRemoveReferenceImage = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setReferenceImage(null); setReferenceImagePreview(null); if (fileInputRef.current) { fileInputRef.current.value = ''; } }, []);
    
    const constructFinalPrompt = () => {
        let finalPrompt = prompt;
        const additions: string[] = [];
        
        if (style !== 'none') additions.push(`in the style of ${style.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        if (atmosphere !== 'none') additions.push(`with a ${atmosphere} atmosphere`);
        if (lightingStyle !== 'none') additions.push(`with ${lightingStyle.replace('-', ' ')} lighting`);
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
            const images = await generateImage(finalPrompt, negativePrompt, aspectRatio, style, numberOfImages, referenceImage, isMixing, promptB, mixRatio, styleStrength, cameraAngle, shotType, lens, lightingStyle, atmosphere, useAuraMood);
            setGeneratedImages(images);
            addToast(t('toast_imageGenSuccess'), 'success');
        } catch (error) {
            console.error("Image generation failed:", error);
            addToast(t('toast_imageGenFailed'), 'error');
        } finally {
            setIsGenerating(false);
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

    const handleEditImage = (imageUrl: string) => {
        onClose(); // Close this modal
        modal.open('imageEditing', { initialImage: imageUrl }); // Open the other
    };

    const handleUseInChat = (imageUrl: string) => {
        // This is a placeholder. A real implementation would convert the data URL to a File object.
        addToast('Using image in chat is a mock.', 'info');
        onClose();
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `aura-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageGen_title')} className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    {/* Main Controls */}
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{isMixing ? t('imageGen_promptA') : t('imageGen_prompt')}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageGen_prompt_placeholder')} disabled={isGenerating} rows={isMixing ? 3 : 5} />
                    </div>
                     <div className="image-gen-control-group toggle-group" style={{ marginBottom: isMixing ? '1rem' : '-1rem' }}>
                        <label htmlFor="mixing-toggle" className="toggle-switch-label">{t('imageGen_promptMixing')}</label>
                        <label className="toggle-switch">
                            <input type="checkbox" id="mixing-toggle" checked={isMixing} onChange={e => setIsMixing(e.target.checked)} disabled={isGenerating} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {isMixing && (
                        <>
                            <div className="image-gen-control-group">
                                <label htmlFor="img-prompt-b">Prompt B</label>
                                <textarea id="img-prompt-b" value={promptB} onChange={e => setPromptB(e.target.value)} placeholder="e.g., 'A tranquil forest scene at sunrise'" disabled={isGenerating} rows={3} />
                            </div>
                             <div className="image-gen-control-group">
                                <label htmlFor="mix-ratio">Mix Ratio (A ←→ B): {(mixRatio * 100).toFixed(0)}%</label>
                                <input type="range" id="mix-ratio" min="0" max="1" step="0.01" value={mixRatio} onChange={e => setMixRatio(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                        </>
                    )}
                    
                    <div className="image-gen-control-group">
                        <label htmlFor="neg-prompt">{t('imageGen_negativePrompt')}</label>
                        <textarea id="neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('imageGen_negativePrompt_placeholder')} disabled={isGenerating} rows={2}/>
                    </div>
                    <div className="image-gen-control-group">
                        <label>Aspect Ratio</label>
                        <div className="aspect-ratio-buttons">
                            {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map(ar => (
                                <button key={ar} className={aspectRatio === ar ? 'active' : ''} onClick={() => setAspectRatio(ar)} disabled={isGenerating}>{ar}</button>
                            ))}
                        </div>
                    </div>
                    <div className="image-gen-control-group">
                        <label>Number of Images: {numberOfImages}</label>
                        <input type="range" min="1" max="4" step="1" value={numberOfImages} onChange={e => setNumberOfImages(Number(e.target.value))} disabled={isGenerating} />
                    </div>

                    <Accordion title={t('imageGen_directorsToolkit')}>
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
                            <label htmlFor="style-strength">{t('imageGen_styleStrength')}: {styleStrength}%</label>
                            <input type="range" id="style-strength" min="1" max="100" value={styleStrength} onChange={e => setStyleStrength(Number(e.target.value))} disabled={isGenerating || style === 'none'} />
                        </div>
                    </Accordion>
                    
                     <Accordion title={t('imageGen_auraIntegration')}>
                        <div className="image-gen-control-group toggle-group">
                            <label htmlFor="aura-mood-toggle" className="toggle-switch-label">{t('imageGen_useAuraMood')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="aura-mood-toggle" checked={useAuraMood} onChange={e => {
                                    setUseAuraMood(e.target.checked);
                                    setShowMoodTweaks(e.target.checked);
                                }} disabled={isGenerating} />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        {useAuraMood && (
                            <div className={`image-gen-control-group mood-tweaks-submenu ${showMoodTweaks ? 'open' : ''}`}>
                                <div className="mood-tweaks-header">
                                    <h4>{t('imageGen_tweakMood')}</h4>
                                    <button onClick={handleResetMood} className="control-button reset-mood-button">{t('imageGen_resetMood')}</button>
                                </div>
                                <div className="image-gen-control-group"> <label htmlFor="mood-guna">Guna State</label> <select id="mood-guna" value={moodGuna} onChange={e => setMoodGuna(e.target.value as GunaState)} disabled={isGenerating}> {Object.values(GunaState).map(guna => <option key={guna} value={guna}>{guna}</option>)} </select> </div>
                                <div className="image-gen-control-group"> <label htmlFor="mood-novelty">Novelty ({(moodNovelty * 100).toFixed(0)}%)</label> <input type="range" id="mood-novelty" min="0" max="1" step="0.01" value={moodNovelty} onChange={e => setMoodNovelty(Number(e.target.value))} disabled={isGenerating} /> </div>
                                <div className="image-gen-control-group"> <label htmlFor="mood-harmony">Harmony ({(moodHarmony * 100).toFixed(0)}%)</label> <input type="range" id="mood-harmony" min="0" max="1" step="0.01" value={moodHarmony} onChange={e => setMoodHarmony(Number(e.target.value))} disabled={isGenerating} /> </div>
                                <div className="image-gen-control-group"> <label htmlFor="mood-love">Love ({(moodLove * 100).toFixed(0)}%)</label> <input type="range" id="mood-love" min="0" max="1" step="0.01" value={moodLove} onChange={e => setMoodLove(Number(e.target.value))} disabled={isGenerating} /> </div>
                                <div className="image-gen-control-group"> <label htmlFor="mood-wisdom">Wisdom ({(moodWisdom * 100).toFixed(0)}%)</label> <input type="range" id="mood-wisdom" min="0" max="1" step="0.01" value={moodWisdom} onChange={e => setMoodWisdom(Number(e.target.value))} disabled={isGenerating} /> </div>
                            </div>
                        )}
                        
                        <div className="image-gen-control-group special-action-group" style={{borderTop: 'none', paddingTop: '0'}}>
                            <button className="control-button" onClick={handleGenerateDream} disabled={isGenerating}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 3C7.12 3 3.14 5.86 1.2 10.15c-.2.45-.2.96 0 1.41C3.14 15.84 7.12 18.7 12 18.7s8.86-2.86 10.8-7.15c.2-.45.2-.96 0-1.41C20.86 5.86 16.88 3 12 3zm0 13.7c-3.19 0-5.93-2.22-7.25-5.35C5.87 8.32 8.52 6.3 12 6.3s6.13 2.02 7.25 5.05c-1.32 3.13-4.06 5.35-7.25 5.35zm0-8.85c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>
                                {t('imageGen_generateFromDream')}
                            </button>
                        </div>
                    </Accordion>

                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('imageGen_generating') : t('imageGen_generate')}
                    </button>
                </div>
                
                <div 
                    className={`image-gen-preview ${isDragging ? 'dropzone-active' : ''}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} >
                    {isGenerating ? (
                        <div className="loading-overlay active"> <div className="spinner-small"></div> <span>{t('imageGen_generating')}</span> </div>
                    ) : generatedImages.length > 0 ? (
                        <div className="image-results-grid">
                            {generatedImages.map((imgSrc, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={imgSrc} alt={`Generated image ${index + 1}`} />
                                    <div className="image-item-actions">
                                        <button onClick={() => handleEditImage(imgSrc)} title={t('imageGen_edit')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                        </button>
                                        <button onClick={() => handleDownload(imgSrc)} title={t('imageGen_download')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                        </button>
                                        <button onClick={() => handleUseInChat(imgSrc)} title={t('imageGen_use_in_chat')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="reference-image-placeholder" onClick={() => fileInputRef.current?.click()}>
                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} accept="image/*" style={{ display: 'none' }} />
                            {referenceImagePreview ? (
                                <div className="reference-image-preview">
                                    <img src={referenceImagePreview} alt="Reference" />
                                    <button onClick={handleRemoveReferenceImage} className="remove-reference-btn">&times;</button>
                                </div>
                            ) : (
                                <p>{t('imageGen_uploadOrDrop')}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};