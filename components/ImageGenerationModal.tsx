import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';
import { GunaState } from '../types';

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


export const ImageGenerationModal = ({ isOpen, onClose, initialPrompt }: { isOpen: boolean; onClose: () => void; initialPrompt?: string; }) => {
    const { t } = useLocalization();
    const { generateImage, setAttachedFile, addToast, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();
    
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
        addToast("Mood parameters reset to Aura's current state.", 'info');
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
                        <>
                             <div className="image-gen-control-group">
                                <label htmlFor="img-prompt-b">{t('imageGen_promptB')}</label>
                                <textarea id="img-prompt-b" value={promptB} onChange={e => setPromptB(e.target.value)} placeholder={t('imageGen_promptPlaceholder')} disabled={isGenerating} />
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="img-mix-ratio">{t('imageGen_mixRatio')} ({mixRatio}%)</label>
                                <input type="range" id="img-mix-ratio" min="0" max="100" value={mixRatio} onChange={e => setMixRatio(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                        </>
                    )}

                     <div className="image-gen-control-group">
                        <label htmlFor="img-neg-prompt">{t('imageGen_negativePrompt')}</label>
                        <textarea id="img-neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('imageGen_negativePromptPlaceholder')} disabled={isGenerating} />
                    </div>
                     <div className="image-gen-control-group">
                        <label>{t('imageGen_referenceImage')}</label>
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
                                    <button className="remove-reference-btn" onClick={handleRemoveReference} title={t('imageGen_clearImage')}>&times;</button>
                                </div>
                             ) : (
                                <span>{t('imageGen_uploadOrDrop')}</span>
                             )}
                        </div>
                    </div>
                     <div className="image-gen-control-group">
                        <label htmlFor="img-num">{t('imageGen_numberOfImages')}</label>
                        <select 
                            id="img-num" 
                            value={numberOfImages} 
                            onChange={e => setNumberOfImages(Number(e.target.value))} 
                            disabled={isGenerating}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </select>
                    </div>
                    <div className="image-gen-control-group">
                        <label>{t('imageGen_aspectRatio')}</label>
                        <div className="aspect-ratio-buttons">
                            {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map(ar => (
                                <button key={ar} className={aspectRatio === ar ? 'active' : ''} onClick={() => setAspectRatio(ar)} disabled={isGenerating}>
                                    {ar}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="image-gen-control-group">
                        <label>{t('imageGen_cameraAngle')}</label>
                        <div className="composition-buttons">
                            {cameraAngles.map(angle => (
                                <button
                                    key={angle.id}
                                    className={cameraAngle === angle.id ? 'active' : ''}
                                    onClick={() => setCameraAngle(angle.id)}
                                    disabled={isGenerating}
                                >
                                    {t(angle.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="image-gen-control-group">
                        <label>{t('imageGen_shotType')}</label>
                        <div className="composition-buttons">
                            {shotTypes.map(shot => (
                                <button
                                    key={shot.id}
                                    className={shotType === shot.id ? 'active' : ''}
                                    onClick={() => setShotType(shot.id)}
                                    disabled={isGenerating}
                                >
                                    {t(shot.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="image-gen-control-group">
                        <label>{t('imageGen_lens')}</label>
                        <div className="composition-buttons">
                            {lensPresets.map(preset => (
                                <button
                                    key={preset.id}
                                    className={lens === preset.id ? 'active' : ''}
                                    onClick={() => setLens(preset.id)}
                                    disabled={isGenerating}
                                >
                                    {t(preset.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="image-gen-control-group">
                        <label>{t('imageGen_lighting')}</label>
                        <div className="composition-buttons">
                            {lightingStyles.map(ls => (
                                <button
                                    key={ls.id}
                                    className={lightingStyle === ls.id ? 'active' : ''}
                                    onClick={() => setLightingStyle(ls.id)}
                                    disabled={isGenerating}
                                >
                                    {t(ls.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="image-gen-control-group">
                        <label htmlFor="img-atmosphere">{t('imageGen_atmosphere')}</label>
                        <select 
                            id="img-atmosphere" 
                            value={atmosphere} 
                            onChange={e => setAtmosphere(e.target.value as Atmosphere)} 
                            disabled={isGenerating}
                        >
                           {atmospheres.map(atm => (
                               <option key={atm.id} value={atm.id}>{t(atm.labelKey)}</option>
                           ))}
                        </select>
                    </div>

                     <div className="image-gen-control-group">
                        <label htmlFor="img-style">{t('imageGen_style')}</label>
                        <select id="img-style" value={style} onChange={e => setStyle(e.target.value)} disabled={isGenerating} size={8}>
                            <optgroup label={t('imageGen_style_group_core')}>
                                <option value="none">{t('imageGen_style_none')}</option>
                                <option value="anime">{t('imageGen_style_anime')}</option>
                                <option value="cyberpunk">{t('imageGen_style_cyberpunk')}</option>
                                <option value="fantasy">{t('imageGen_style_fantasy')}</option>
                                <option value="photorealistic">{t('imageGen_style_photorealistic')}</option>
                                <option value="pixelart">{t('imageGen_style_pixelart')}</option>
                                <option value="steampunk">{t('imageGen_style_steampunk')}</option>
                            </optgroup>
                             <optgroup label={t('imageGen_style_group_painting')}>
                                <option value="airbrush">{t('imageGen_style_airbrush')}</option>
                                <option value="ballpointPen">{t('imageGen_style_ballpointPen')}</option>
                                <option value="charcoalSketch">{t('imageGen_style_charcoalSketch')}</option>
                                <option value="chiaroscuro">{t('imageGen_style_chiaroscuro')}</option>
                                <option value="coloredPencil">{t('imageGen_style_coloredPencil')}</option>
                                <option value="fresco">{t('imageGen_style_fresco')}</option>
                                <option value="gouache">{t('imageGen_style_gouache')}</option>
                                <option value="impasto">{t('imageGen_style_impasto')}</option>
                                <option value="inkWash">{t('imageGen_style_inkWash')}</option>
                                <option value="oilPainting">{t('imageGen_style_oilPainting')}</option>
                                <option value="pastel">{t('imageGen_style_pastel')}</option>
                                <option value="pencilSketch">{t('imageGen_style_pencilSketch')}</option>
                                <option value="pointillism">{t('imageGen_style_pointillism')}</option>
                                <option value="tempera">{t('imageGen_style_tempera')}</option>
                                <option value="watercolor">{t('imageGen_style_watercolor')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_artMovements')}>
                                <option value="artDeco">{t('imageGen_style_artDeco')}</option>
                                <option value="artNouveau">{t('imageGen_style_artNouveau')}</option>
                                <option value="bauhaus">{t('imageGen_style_bauhaus')}</option>
                                <option value="cubism">{t('imageGen_style_cubism')}</option>
                                <option value="expressionism">{t('imageGen_style_expressionism')}</option>
                                <option value="impressionism">{t('imageGen_style_impressionism')}</option>
                                <option value="minimalism">{t('imageGen_style_minimalism')}</option>
                                <option value="popArt">{t('imageGen_style_popArt')}</option>
                                <option value="sovietPropaganda">{t('imageGen_style_sovietPropaganda')}</option>
                                <option value="surrealism">{t('imageGen_style_surrealism')}</option>
                            </optgroup>
                             <optgroup label={t('imageGen_style_group_digital')}>
                                <option value="anaglyph">{t('imageGen_style_anaglyph')}</option>
                                <option value="asciiArt">{t('imageGen_style_asciiArt')}</option>
                                <option value="conceptArt">{t('imageGen_style_conceptArt')}</option>
                                <option value="glitchArt">{t('imageGen_style_glitchArt')}</option>
                                <option value="holographic">{t('imageGen_style_holographic')}</option>
                                <option value="infographic">{t('imageGen_style_infographic')}</option>
                                <option value="lowPoly">{t('imageGen_style_lowPoly')}</option>
                                <option value="psychedelic">{t('imageGen_style_psychedelic')}</option>
                                <option value="synthwave">{t('imageGen_style_synthwave')}</option>
                                <option value="threeDRender">{t('imageGen_style_threeDRender')}</option>
                                <option value="vaporwave">{t('imageGen_style_vaporwave')}</option>
                                <option value="vectorArt">{t('imageGen_style_vectorArt')}</option>
                            </optgroup>
                             <optgroup label={t('imageGen_style_group_photo')}>
                                <option value="bokeh">{t('imageGen_style_bokeh')}</option>
                                <option value="cinematic">{t('imageGen_style_cinematic')}</option>
                                <option value="crossProcessing">{t('imageGen_style_crossProcessing')}</option>
                                <option value="daguerreotype">{t('imageGen_style_daguerreotype')}</option>
                                <option value="doubleExposure">{t('imageGen_style_doubleExposure')}</option>
                                <option value="filmNoir">{t('imageGen_style_filmNoir')}</option>
                                <option value="goldenHour">{t('imageGen_style_goldenHour')}</option>
                                <option value="infrared">{t('imageGen_style_infrared')}</option>
                                <option value="lomography">{t('imageGen_style_lomography')}</option>
                                <option value="longExposure">{t('imageGen_style_longExposure')}</option>
                                <option value="macro">{t('imageGen_style_macro')}</option>
                                <option value="pinhole">{t('imageGen_style_pinhole')}</option>
                                <option value="solarigraphy">{t('imageGen_style_solarigraphy')}</option>
                                <option value="tiltShift">{t('imageGen_style_tiltShift')}</option>
                                <option value="wetPlate">{t('imageGen_style_wetPlate')}</option>
                            </optgroup>
                             <optgroup label={t('imageGen_style_group_illustration')}>
                                <option value="botanicalIllustration">{t('imageGen_style_botanicalIllustration')}</option>
                                <option value="collage">{t('imageGen_style_collage')}</option>
                                <option value="comicBook">{t('imageGen_style_comicBook')}</option>
                                <option value="engraving">{t('imageGen_style_engraving')}</option>
                                <option value="etching">{t('imageGen_style_etching')}</option>
                                <option value="fashionIllustration">{t('imageGen_style_fashionIllustration')}</option>
                                <option value="graphicNovel">{t('imageGen_style_graphicNovel')}</option>
                                <option value="linocut">{t('imageGen_style_linocut')}</option>
                                <option value="storybook">{t('imageGen_style_storybook')}</option>
                                <option value="tattooArt">{t('imageGen_style_tattooArt')}</option>
                                <option value="technicalIllustration">{t('imageGen_style_technicalIllustration')}</option>
                                <option value="woodcut">{t('imageGen_style_woodcut')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_historical')}>
                                <option value="aztec">{t('imageGen_style_aztec')}</option>
                                <option value="byzantineIcon">{t('imageGen_style_byzantineIcon')}</option>
                                <option value="celticKnotwork">{t('imageGen_style_celticKnotwork')}</option>
                                <option value="greekPottery">{t('imageGen_style_greekPottery')}</option>
                                <option value="hieroglyphics">{t('imageGen_style_hieroglyphics')}</option>
                                <option value="illuminatedManuscript">{t('imageGen_style_illuminatedManuscript')}</option>
                                <option value="romanMosaic">{t('imageGen_style_romanMosaic')}</option>
                                <option value="ukiyoE">{t('imageGen_style_ukiyoE')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_crafts')}>
                                <option value="bronzeStatue">{t('imageGen_style_bronzeStatue')}</option>
                                <option value="claymation">{t('imageGen_style_claymation')}</option>
                                <option value="diorama">{t('imageGen_style_diorama')}</option>
                                <option value="embroidery">{t('imageGen_style_embroidery')}</option>
                                <option value="marbleSculpture">{t('imageGen_style_marbleSculpture')}</option>
                                <option value="origami">{t('imageGen_style_origami')}</option>
                                <option value="stainedGlass">{t('imageGen_style_stainedGlass')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_scifi')}>
                                <option value="atompunk">{t('imageGen_style_atompunk')}</option>
                                <option value="biomechanical">{t('imageGen_style_biomechanical')}</option>
                                <option value="biopunk">{t('imageGen_style_biopunk')}</option>
                                <option value="cassetteFuturism">{t('imageGen_style_cassetteFuturism')}</option>
                                <option value="cyberNoir">{t('imageGen_style_cyberNoir')}</option>
                                <option value="dieselpunk">{t('imageGen_style_dieselpunk')}</option>
                                <option value="eldritch">{t('imageGen_style_eldritch')}</option>
                                <option value="highFantasyMap">{t('imageGen_style_highFantasyMap')}</option>
                                <option value="solarpunk">{t('imageGen_style_solarpunk')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_unconventional')}>
                                <option value="abstractExpressionism">{t('imageGen_style_abstractExpressionism')}</option>
                                <option value="algorithmicArt">{t('imageGen_style_algorithmicArt')}</option>
                                <option value="bioArt">{t('imageGen_style_bioArt')}</option>
                                <option value="dadaism">{t('imageGen_style_dadaism')}</option>
                                <option value="fluidPouring">{t('imageGen_style_fluidPouring')}</option>
                                <option value="fractalArt">{t('imageGen_style_fractalArt')}</option>
                                <option value="generativeArt">{t('imageGen_style_generativeArt')}</option>
                                <option value="kineticArt">{t('imageGen_style_kineticArt')}</option>
                                <option value="lightAndSpace">{t('imageGen_style_lightAndSpace')}</option>
                                <option value="opArt">{t('imageGen_style_opArt')}</option>
                            </optgroup>
                            <optgroup label={t('imageGen_style_group_technical')}>
                                <option value="blueprint">{t('imageGen_style_blueprint')}</option>
                                <option value="chalkboard">{t('imageGen_style_chalkboard')}</option>
                                <option value="isometric">{t('imageGen_style_isometric')}</option>
                                <option value="schematic">{t('imageGen_style_schematic')}</option>
                                <option value="xRay">{t('imageGen_style_xRay')}</option>
                            </optgroup>
                        </select>
                    </div>

                    <div className="image-gen-control-group">
                        <label htmlFor="img-style-strength">{t('imageGen_styleStrength')} ({(styleStrength * 100).toFixed(0)}%)</label>
                        <input 
                            type="range" 
                            id="img-style-strength" 
                            min="0" max="1" step="0.05" 
                            value={styleStrength} 
                            onChange={e => setStyleStrength(Number(e.target.value))} 
                            disabled={isGenerating || style === 'none'} 
                        />
                    </div>
                    
                    <div className="image-gen-control-group toggle-group">
                        <label htmlFor="img-aura-mood-toggle" className="toggle-switch-label">Aura's Mood</label>
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
                                <h4>Tweak Mood Parameters</h4>
                                <button onClick={handleResetMood} className="control-button reset-mood-button">Reset</button>
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="mood-guna">Guna State</label>
                                <select id="mood-guna" value={moodGuna} onChange={e => setMoodGuna(e.target.value as GunaState)} disabled={isGenerating}>
                                    {Object.values(GunaState).map(guna => <option key={guna} value={guna}>{guna}</option>)}
                                </select>
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="mood-novelty">Novelty ({(moodNovelty * 100).toFixed(0)}%)</label>
                                <input type="range" id="mood-novelty" min="0" max="1" step="0.01" value={moodNovelty} onChange={e => setMoodNovelty(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="mood-harmony">Harmony ({(moodHarmony * 100).toFixed(0)}%)</label>
                                <input type="range" id="mood-harmony" min="0" max="1" step="0.01" value={moodHarmony} onChange={e => setMoodHarmony(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="mood-love">Love ({(moodLove * 100).toFixed(0)}%)</label>
                                <input type="range" id="mood-love" min="0" max="1" step="0.01" value={moodLove} onChange={e => setMoodLove(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                            <div className="image-gen-control-group">
                                <label htmlFor="mood-wisdom">Wisdom ({(moodWisdom * 100).toFixed(0)}%)</label>
                                <input type="range" id="mood-wisdom" min="0" max="1" step="0.01" value={moodWisdom} onChange={e => setMoodWisdom(Number(e.target.value))} disabled={isGenerating} />
                            </div>
                        </div>
                    )}
                    
                    <div className="image-gen-control-group special-action-group">
                        <button className="control-button" onClick={handleGenerateDream} disabled={isGenerating}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 3C7.12 3 3.14 5.86 1.2 10.15c-.2.45-.2.96 0 1.41C3.14 15.84 7.12 18.7 12 18.7s8.86-2.86 10.8-7.15c.2-.45.2-.96 0-1.41C20.86 5.86 16.88 3 12 3zm0 13.7c-3.19 0-5.93-2.22-7.25-5.35C5.87 8.32 8.52 6.3 12 6.3s6.13 2.02 7.25 5.05c-1.32 3.13-4.06 5.35-7.25 5.35zm0-8.85c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/></svg>
                            Generate from Dream State
                        </button>
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
                    {generatedImageUrls ? (
                        <div className="image-results-grid">
                            {generatedImageUrls.map((url, index) => (
                                <div key={index} className="generated-image-item">
                                    <img src={url} alt={`Generated image ${index + 1}`} />
                                    <div className="image-item-actions">
                                        <button onClick={() => handleDownload(url)} title={t('imageGen_download')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                        </button>
                                        <button onClick={() => handleUseInChat(url)} title={t('imageGen_useInChat')}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isGenerating && <p>{t('imageGen_placeholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};
