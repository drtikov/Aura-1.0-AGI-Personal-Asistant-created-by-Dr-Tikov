import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal';
import { Accordion } from './Accordion';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';
import { GunaState } from '../types';

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


export const ImageEditingModal = ({ isOpen, onClose, initialImage }: { isOpen: boolean; onClose: () => void; initialImage?: string; }) => {
    const { t } = useLocalization();
    const { editImage, addToast, setAttachedFile, handleGenerateDreamPrompt } = useAuraDispatch();
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
        if (negativePrompt.trim()) finalPrompt += ` --no ${negativePrompt.trim()}`;
        
        return finalPrompt;
    };

    const handleGenerate = async () => {
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
            const [header, base64Data] = currentImage.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
            
            const finalPrompt = constructFinalPrompt();
            
            const editedImageUrl = await editImage(base64Data, mimeType, finalPrompt);

            if (editedImageUrl) {
                setCurrentImage(editedImageUrl);
                setImageHistory(prev => [...prev, editedImageUrl]);
                addToast(t('toast_imageEditSuccess'), 'success');
            } else {
                throw new Error("Image editing returned no data.");
            }
        } catch (error) {
            console.error("Image editing failed:", error);
            addToast(t('toast_imageEditFailed'), 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseInChat = async (imageUrl: string | null) => {
        if (!imageUrl) return;
        const file = dataURLtoFile(imageUrl, "edited-image.png");
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAttachedFile({ file, previewUrl, type: 'image' });
            onClose();
        } else {
            addToast("Failed to prepare image for chat.", "error");
        }
    };

    const handleDownload = (imageUrl: string | null) => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `aura-edited-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('imageEdit_title')} className="image-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    <div className="image-gen-control-group">
                        <label htmlFor="edit-prompt">{t('imageEdit_prompt_label')}</label>
                        <textarea id="edit-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('imageEdit_prompt_placeholder')} disabled={isGenerating} rows={4} />
                    </div>

                    <Accordion title={t('imageGen_directorsToolkit')}>
                        <div className="image-gen-control-group">
                            <label htmlFor="edit-camera-angle">{t('imageGen_cameraAngle')}</label>
                            <select id="edit-camera-angle" value={cameraAngle} onChange={e => setCameraAngle(e.target.value as CameraAngle)} disabled={isGenerating}>
                                {cameraAngles.map(a => <option key={a.id} value={a.id}>{t(a.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="edit-shot-type">{t('imageGen_shotType')}</label>
                            <select id="edit-shot-type" value={shotType} onChange={e => setShotType(e.target.value as ShotType)} disabled={isGenerating}>
                                {shotTypes.map(s => <option key={s.id} value={s.id}>{t(s.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="edit-lens">{t('imageGen_lensPreset')}</label>
                            <select id="edit-lens" value={lens} onChange={e => setLens(e.target.value as LensPreset)} disabled={isGenerating}>
                                {lensPresets.map(l => <option key={l.id} value={l.id}>{t(l.labelKey)}</option>)}
                            </select>
                        </div>
                    </Accordion>

                    <Accordion title={t('imageGen_artisticControls')}>
                         <div className="image-gen-control-group">
                            <label htmlFor="edit-style">{t('imageGen_artisticStyle')}</label>
                            <select id="edit-style" value={style} onChange={e => setStyle(e.target.value)} disabled={isGenerating}>
                                <option value="none">{t('imageGen_style_none')}</option>
                                <option value="photorealistic">{t('imageGen_style_photorealistic')}</option>
                                <option value="fantasy art">{t('imageGen_style_fantasy')}</option>
                                <option value="cyberpunk">{t('imageGen_style_cyberpunk')}</option>
                                {/* FIX: Changed key from videoGen_style_watercolor to imageGen_style_watercolor to match refactor */}
                                <option value="watercolor">{t('videoGen_style_watercolor')}</option>
                                <option value="oil painting">{t('imageGen_style_oilPainting')}</option>
                                <option value="surrealism">{t('imageGen_style_surrealism')}</option>
                            </select>
                        </div>
                         <div className="image-gen-control-group">
                            <label htmlFor="edit-atmosphere">{t('imageGen_atmosphere')}</label>
                            <select id="edit-atmosphere" value={atmosphere} onChange={e => setAtmosphere(e.target.value as Atmosphere)} disabled={isGenerating}>
                                {atmospheres.map(a => <option key={a.id} value={a.id}>{t(a.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="edit-neg-prompt">{t('imageGen_negativePrompt')}</label>
                            <textarea id="edit-neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('imageGen_negativePrompt_placeholder')} disabled={isGenerating} rows={2}/>
                        </div>
                    </Accordion>
                    
                     <Accordion title={t('imageGen_auraIntegration')}>
                        <div className="image-gen-control-group toggle-group">
                            <label htmlFor="edit-aura-mood-toggle" className="toggle-switch-label">{t('imageGen_useAuraMood')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="edit-aura-mood-toggle" checked={useAuraMood} onChange={e => {
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
                    
                    <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <button className="control-button" onClick={handleUndo} disabled={isGenerating || imageHistory.length <= 1}> {t('imageEdit_undo')} </button>
                        <button className="control-button" onClick={() => fileInputRef.current?.click()} disabled={isGenerating}> {t('imageEdit_upload_button')} </button>
                    </div>

                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('imageEdit_generating') : t('imageEdit_generate')}
                    </button>
                </div>
                
                <div 
                    className={`image-gen-preview ${isDragging ? 'dropzone-active' : ''}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} >
                    {isGenerating && (
                        <div className="loading-overlay active"> <div className="spinner-small"></div> <span>{t('imageEdit_generating')}</span> </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} accept="image/*" style={{ display: 'none' }} />
                    {currentImage ? (
                        <div className="generated-image-item" style={{width: '100%', height: '100%'}}>
                            <img src={currentImage} alt="Image to edit" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                             <div className="image-item-actions" style={{top: '10px', right: '10px', bottom: 'auto', flexDirection: 'column', gap: '0.75rem'}}>
                                <button onClick={handleRemoveImage} title={t('imageEdit_clear_image')} className="remove-reference-btn" style={{position: 'static', width: '32px', height: '32px', background: 'var(--failure-color)', border: '1px solid var(--background)'}}>&times;</button>
                                <button onClick={() => handleDownload(currentImage)} title={t('imageEdit_download')}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> </button>
                                <button onClick={() => handleUseInChat(currentImage)} title={t('imageEdit_use_in_chat')}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg> </button>
                            </div>
                        </div>
                    ) : (
                        !isGenerating && <p>{t('imageEdit_upload_placeholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};