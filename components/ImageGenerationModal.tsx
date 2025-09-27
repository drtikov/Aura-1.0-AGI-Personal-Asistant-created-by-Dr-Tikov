

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
            { id: 'watercolor', labelKey: 'videoGen_style_watercolor' },
            { id: 'oilPainting', labelKey: 'videoGen_style_oilPainting' },
            { id: 'impressionism', labelKey: 'videoGen_style_impressionism' },
            { id: 'surrealism', labelKey: 'imageGen_style_surrealism' },
            { id: 'charcoalSketch', labelKey: 'videoGen_style_charcoalSketch' },
            { id: 'impasto', labelKey: 'videoGen_style_impasto' },
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
            { id: 'vintage', labelKey: 'videoGen_style_vintage' },
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
    }
];

export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string; }) => {
    const { t } = useLocalization();
    const { generateImage, setAttachedFile, addToast, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();
    const modal = useModal();
    
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [style, setStyle] = useState('none');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [cameraAngle, setCameraAngle] = useState<CameraAngle>('none');
    const [shotType, setShotType] = useState<ShotType>('none');
    const [lens, setLens] = useState<LensPreset>('none');
    const [lightingStyle, setLightingStyle] = useState<LightingStyle>('none');
    const [atmosphere, setAtmosphere] = useState<Atmosphere>('none');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImageUrls, setGeneratedImageUrls] = useState<string[] | null>(null);
    const [referenceImage, setReferenceImage] = useState<{ file: File, previewUrl: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Controls State
    const [isMixing, setIsMixing] = useState(false);
    const [promptB, setPromptB] = useState('');
    const [mixRatio, setMixRatio] = useState(50); // 0-100%
    const [styleStrength, setStyleStrength] = useState(1.0); // 0.0-1.0
    const [useAuraMood, setUseAuraMood] = useState(false);
    const [showMoodTweaks, setShowMoodTweaks] = useState(false);

    // Mood override state
    const [moodGuna, setMoodGuna] = useState<GunaState>(internalState.gunaState);
    const [moodNovelty, setMoodNovelty] = useState(internalState.noveltySignal);
    const [moodHarmony, setMoodHarmony] = useState(internalState.harmonyScore);
    const [moodLove, setMoodLove] = useState(internalState.loveSignal);
    const [moodWisdom, setMoodWisdom] = useState(internalState.wisdomSignal);

    const resetMoodToCurrent = useCallback(() => {
        setMoodGuna(internalState.gunaState);
        setMoodNovelty(internalState.noveltySignal);
        setMoodHarmony(internalState.harmonyScore);
        setMoodLove(internalState.loveSignal);
        setMoodWisdom(internalState.wisdomSignal);
    }, [internalState]);

    useEffect(() => {
        if (initialPrompt && isOpen) {
            setPrompt(initialPrompt);
        } 
        
        if(isOpen) {
            resetMoodToCurrent();
        } else if (!isOpen) {
             // Clear all state on modal close to ensure it's fresh next time
            setPrompt('');
            setNegativePrompt('');
            setStyle('none');
            setAspectRatio('1:1');
            setCameraAngle('none');
            setShotType('none');
            setLens('none');
            setLightingStyle('none');
            setAtmosphere('none');
            setNumberOfImages(1);
            setGeneratedImageUrls(null);
            setReferenceImage(null);
            setIsMixing(false);
            setPromptB('');
            setMixRatio(50);
            setStyleStrength(1.0);
            setUseAuraMood(false);
            setShowMoodTweaks(false);
        }
    }, [initialPrompt, isOpen, resetMoodToCurrent]);


    useEffect(() => {
        // Cleanup the object URL when the component unmounts or the image changes
        return () => {
            if (referenceImage) {
                URL.revokeObjectURL(referenceImage.previewUrl);
            }
        };
    }, [referenceImage]);

    const handleResetMood = () => {
        resetMoodToCurrent();
        addToast(t('toast_moodReset'), 'info');
    };

    const handleFileSelect = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            if (referenceImage) {
                URL.revokeObjectURL(referenceImage.previewUrl);
            }
            setReferenceImage({ file, previewUrl: URL.createObjectURL(file) });
        } else if (file) {
            addToast('Please upload a valid image file.', 'warning');
        }
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file || null);
    }, []);

    const handleRemoveReference = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (referenceImage) {
            URL.revokeObjectURL(referenceImage.previewUrl);
        }
        setReferenceImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [referenceImage]);

    const handleGenerateDream = async () => {
        setIsGenerating(true);
        const dreamPrompt = await handleGenerateDreamPrompt();
        if (dreamPrompt) {
            setPrompt(dreamPrompt);
        }
        setIsGenerating(false);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast('Please enter a prompt to generate an image.', 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedImageUrls(null);
        
        try {
            const imageUrls = await generateImage(
                prompt,
                negativePrompt,
                aspectRatio, 
                style, 
                numberOfImages, 
                referenceImage?.file || null,
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
                useAuraMood ? {
                    gunaState: moodGuna,
                    noveltySignal: moodNovelty,
                    harmonyScore: moodHarmony,
                    loveSignal: moodLove,
                    wisdomSignal: moodWisdom,
                } : undefined
            );

            if (imageUrls && imageUrls.length > 0) {
                setGeneratedImageUrls(imageUrls);
                addToast(t('toast_imageGenSuccess'), 'success');
            } else {
                throw new Error('Image generation returned no data.');
            }
        } catch (error) {
            console.error("Image generation failed:", error);
            addToast(t('toast_imageGenFailed'), 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseInChat = async (imageUrl: string) => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], "generated-image.jpeg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(file);
            setAttachedFile({ file, previewUrl, type: 'image' });
            onClose();
        } catch (error) {
            console.error("Failed to attach image:", error);
            addToast("Failed to attach image to chat.", "error");
        }
    };
    
    const handleDownload = (imageUrl: string) => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `aura-generated-${Date.now()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleEdit = (imageUrl: string) => {
        modal.open('imageEditing', { initialImage: imageUrl });
        onClose(); // Close the generation modal
    };

    const CompositionButtonGroup = ({ label, options, selected, onSelect }: { label: string; options: {id: string; labelKey: string}[]; selected: string; onSelect: (id: string) => void; }) => (
         <div className="image-gen-control-group">
            <label>{label}</label>
            <div className="composition-buttons">
                {options.map(opt => (
                    <button 
                        key={opt.id} 
                        className={selected === opt.id ? 'active' : ''}
                        onClick={() => onSelect(opt.id)}
                        type="button"
                        disabled={isGenerating}
                    >
                        {t(opt.labelKey)}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageGen_title')} className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="img-prompt">{isMixing ? t('imageGen_promptA') : t('imageGen_prompt')}</label>
                        <textarea id="img-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageGen_promptPlaceholder')} disabled={isGenerating} />
                    </div>
                    
                    <div className="image-gen-control-group toggle-group">
                        <label htmlFor="img-mixing-toggle" className="toggle-switch-label">{t('imageGen_promptMixing')}</label>
                        <label className="toggle-switch">
                            <input type="checkbox" id="img-mixing-toggle" checked={isMixing} onChange={e => setIsMixing(e.target.checked)} disabled={isGenerating} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    
                    {isMixing && (
                         <div className="image-gen-control-group">
                            <label htmlFor="img-prompt-b">Prompt B</label>
                            <textarea id="img-prompt-b" value={promptB} onChange={e => setPromptB(e.target.value)} placeholder="Describe the second concept..." disabled={isGenerating} />
                            <input type="range" min="0" max="100" value={mixRatio} onChange={e => setMixRatio(Number(e.target.value))} disabled={isGenerating} />
                        </div>
                    )}
                    
                    <div className="image-gen-control-group">
                        <label htmlFor="img-negative-prompt">{t('imageGen_negativePrompt')}</label>
                        <textarea id="img-negative-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('imageGen_negativePrompt_placeholder')} disabled={isGenerating} rows={2}/>
                    </div>

                    <div className="image-gen-control-group">
                        <label>{t('Reference Image')}</label>
                         <div 
                            className={`image-gen-reference-upload ${isDragging ? 'dropzone-active' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} accept="image/*" style={{ display: 'none' }} />
                            {referenceImage ? (
                                <div className="image-gen-reference-preview">
                                    <img src={referenceImage.previewUrl} alt="Reference" className="reference-preview-img" />
                                    <button className="remove-reference-btn" onClick={handleRemoveReference}>&times;</button>
                                </div>
                            ) : (
                                <span>{t('imageGen_uploadOrDrop')}</span>
                            )}
                        </div>
                    </div>

                    <Accordion title={t('imageGen_directorsToolkit')} defaultOpen={true}>
                        <div className="image-gen-control-group">
                            <label>{t('Aspect Ratio')}</label>
                            <div className="aspect-ratio-buttons">
                                {(["1:1", "16:9", "9:16", "4:3", "3:4"] as AspectRatio[]).map(ar => (
                                    <button key={ar} className={aspectRatio === ar ? 'active' : ''} onClick={() => setAspectRatio(ar)} type="button">{ar}</button>
                                ))}
                            </div>
                        </div>
                         <CompositionButtonGroup label={t('imageGen_angle')} options={cameraAngles} selected={cameraAngle} onSelect={(id) => setCameraAngle(id as CameraAngle)} />
                         <CompositionButtonGroup label={t('imageGen_shot')} options={shotTypes} selected={shotType} onSelect={(id) => setShotType(id as ShotType)} />
                         <CompositionButtonGroup label={t('imageGen_lens')} options={lensPresets} selected={lens} onSelect={(id) => setLens(id as LensPreset)} />
                    </Accordion>

                    <Accordion title={t('imageGen_artisticControls')}>
                        <CompositionButtonGroup label={t('imageGen_lighting')} options={lightingStyles} selected={lightingStyle} onSelect={(id) => setLightingStyle(id as LightingStyle)} />
                        <CompositionButtonGroup label={t('imageGen_atmosphere')} options={atmospheres} selected={atmosphere} onSelect={(id) => setAtmosphere(id as Atmosphere)} />
                        
                        <div className="image-gen-control-group">
                            <label htmlFor="img-style">{t('imageGen_style')}</label>
                            <select id="img-style" value={style} onChange={e => setStyle(e.target.value)} disabled={isGenerating}>
                                <option value="none">{t('imageGen_style_none')}</option>
                                {styleGroups.map(group => (
                                    <optgroup key={group.labelKey} label={t(group.labelKey)}>
                                        {group.styles.map(s => <option key={s.id} value={s.id}>{t(s.labelKey)}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="img-style-strength">{t('imageGen_styleStrength')}</label>
                            <input type="range" id="img-style-strength" min="0" max="1" step="0.05" value={styleStrength} onChange={e => setStyleStrength(Number(e.target.value))} disabled={isGenerating} />
                             <span>{(styleStrength * 100).toFixed(0)}%</span>
                        </div>
                    </Accordion>
                    
                    <Accordion title={t('imageGen_auraIntegration')}>
                        <div className="image-gen-control-group toggle-group">
                            <label htmlFor="img-aura-mood-toggle" className="toggle-switch-label">{t('imageGen_useAuraMood')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="img-aura-mood-toggle" checked={useAuraMood} onChange={e => {
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
                        
                        <div className="image-gen-control-group special-action-group">
                            <button className="control-button" onClick={handleGenerateDream} disabled={isGenerating}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 3C7.12 3 3.14 5.86 1.2 10.15c-.2.45-.2.96 0 1.41C3.14 15.84 7.12 18.7 12 18.7s8.86-2.86 10.8-7.15c.2-.45.2-.96 0-1.41C20.86 5.86 16.88 3 12 3zm0 13.7c-3.19 0-5.93-2.22-7.25-5.35C5.87 8.32 8.52 6.3 12 6.3s6.13 2.02 7.25 5.05c-1.32 3.13-4.06 5.35-7.25 5.35zm0-8.85c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>
                                {t('imageGen_generateFromDream')}
                            </button>
                        </div>
                    </Accordion>
                    
                     <div className="image-gen-control-group slider-label-group">
                        <label htmlFor="img-num-images">Number of Images</label>
                        <input 
                            type="range" 
                            id="img-num-images" 
                            min="1" 
                            max="4" 
                            value={numberOfImages} 
                            onChange={e => setNumberOfImages(Number(e.target.value))} 
                            disabled={isGenerating} 
                        />
                        <span>{numberOfImages}</span>
                    </div>

                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('imageGen_generating') : t('imageGen_generate')}
                    </button>
                </div>

                <div className="image-gen-preview">
                    {isGenerating && (
                        <div className="loading-overlay active">
                            <div className="spinner-small"></div>
                            <span>{t('imageGen_generating')}</span>
                        </div>
                    )}
                    {generatedImageUrls && generatedImageUrls.length > 0 ? (
                        <div className="image-results-grid" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${numberOfImages > 1 ? '300px' : '600px'}, 1fr))`}}>
                            {generatedImageUrls.map((url, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={url} alt={`Generated image ${index + 1}`} />
                                    <div className="image-item-actions">
                                        <button onClick={() => handleEdit(url)} title={t('imageGen_edit')}>
                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                        </button>
                                        <button onClick={() => handleDownload(url)} title={t('imageGen_download')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                        </button>
                                        <button onClick={() => handleUseInChat(url)} title={t('imageGen_use_in_chat')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isGenerating && <p>{t('imageGen_promptPlaceholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};