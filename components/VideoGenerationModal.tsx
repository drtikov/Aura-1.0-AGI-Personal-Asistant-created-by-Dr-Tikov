import React, { useState, useCallback, useEffect, useRef, DragEvent } from 'react';
import { Modal } from './Modal';
import { Accordion } from './Accordion';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';
import { GunaState } from '../types';

type GenerationMode = 'text-to-video' | 'image-to-video' | 'video-to-video';
type V2VSubMode = 'style-transfer' | 'content-modification';
type CinematicMovement = 'static' | 'slow_pan' | 'whip_pan' | 'tilt' | 'zoom' | 'drone' | 'orbit' | 'tracking' | 'dolly_zoom';
type ShotFraming = 'none' | 'long' | 'full' | 'medium' | 'cowboy' | 'closeup' | 'extreme_closeup';
type LensChoice = 'none' | 'standard' | 'wide' | 'telephoto' | 'macro' | 'fisheye';
type Pacing = 'slow-motion' | 'real-time' | 'timelapse' | 'hyperlapse';


const cinematicMovements: { id: CinematicMovement; labelKey: string }[] = [
    { id: 'static', labelKey: 'videoGen_movement_static' },
    { id: 'slow_pan', labelKey: 'videoGen_movement_slowPan' },
    { id: 'whip_pan', labelKey: 'videoGen_movement_whipPan' },
    { id: 'tilt', labelKey: 'videoGen_movement_tilt' },
    { id: 'zoom', labelKey: 'videoGen_movement_zoom' },
    { id: 'drone', labelKey: 'videoGen_movement_drone' },
    { id: 'orbit', labelKey: 'videoGen_movement_orbit' },
    { id: 'tracking', labelKey: 'videoGen_movement_tracking' },
    { id: 'dolly_zoom', labelKey: 'videoGen_movement_dollyZoom' },
];

const shotFramings: { id: ShotFraming; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'long', labelKey: 'videoGen_framing_long' },
    { id: 'full', labelKey: 'videoGen_framing_full' },
    { id: 'medium', labelKey: 'videoGen_framing_medium' },
    { id: 'cowboy', labelKey: 'videoGen_framing_cowboy' },
    { id: 'closeup', labelKey: 'videoGen_framing_closeup' },
    { id: 'extreme_closeup', labelKey: 'videoGen_framing_extreme_closeup' },
];

const lensChoices: { id: LensChoice; labelKey: string }[] = [
    { id: 'none', labelKey: 'imageGen_preset_none' },
    { id: 'standard', labelKey: 'videoGen_lens_standard' },
    { id: 'wide', labelKey: 'videoGen_lens_wide' },
    { id: 'telephoto', labelKey: 'videoGen_lens_telephoto' },
    { id: 'macro', labelKey: 'videoGen_lens_macro' },
    { id: 'fisheye', labelKey: 'videoGen_lens_fisheye' },
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
            { id: 'cinematic', labelKey: 'videoGen_style_cinematic' },
            { id: 'anime', labelKey: 'videoGen_style_anime' },
            { id: 'photorealistic', labelKey: 'imageGen_style_photorealistic' },
            { id: 'fantasy', labelKey: 'imageGen_style_fantasy' },
            { id: 'cyberpunk', labelKey: 'imageGen_style_cyberpunk' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_painting',
        styles: [
            { id: 'watercolor', labelKey: 'videoGen_style_watercolor' },
            { id: 'oilPainting', labelKey: 'imageGen_style_oilPainting' },
            { id: 'impressionism', labelKey: 'imageGen_style_impressionism' },
            { id: 'surrealism', labelKey: 'imageGen_style_surrealism' },
            { id: 'charcoalSketch', labelKey: 'imageGen_style_charcoalSketch' },
            { id: 'impasto', labelKey: 'imageGen_style_impasto' },
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
        ]
    },
    {
        labelKey: 'imageGen_style_group_unconventional',
        styles: [
            { id: 'psychedelic', labelKey: 'imageGen_style_psychedelic' },
            { id: 'fractalArt', labelKey: 'imageGen_style_fractalArt' },
            { id: 'opArt', labelKey: 'imageGen_style_opArt' },
            { id: 'generativeArt', labelKey: 'imageGen_style_generativeArt' },
        ]
    },
    {
        labelKey: 'imageGen_style_group_technical',
        styles: [
            { id: 'blueprint', labelKey: 'imageGen_style_blueprint' },
            { id: 'xRay', labelKey: 'imageGen_style_xRay' },
            { id: 'schematic', labelKey: 'imageGen_style_schematic' },
            { id: 'isometric', labelKey: 'imageGen_style_isometric' },
        ]
    }
];

const colorGrades: { id: string; labelKey: string }[] = [
    { id: 'none', labelKey: 'videoGen_grade_none' },
    { id: 'technicolor', labelKey: 'videoGen_grade_technicolor' },
    { id: 'scifi', labelKey: 'videoGen_grade_scifi' },
    { id: 'desert', labelKey: 'videoGen_grade_desert' },
    { id: 'noir', labelKey: 'videoGen_grade_noir' },
    { id: 'nostalgia', labelKey: 'videoGen_grade_nostalgia' },
];

const pacingOptions: { id: Pacing; labelKey: string }[] = [
    { id: 'slow-motion', labelKey: 'videoGen_pacing_slow' },
    { id: 'real-time', labelKey: 'videoGen_pacing_realtime' },
    { id: 'timelapse', labelKey: 'videoGen_pacing_timelapse' },
    { id: 'hyperlapse', labelKey: 'videoGen_pacing_hyperlapse' },
];

export const VideoGenerationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { generateVideo, setAttachedFile, addToast, handleGenerateDreamPrompt } = useAuraDispatch();
    const { internalState } = useCoreState();
    
    const [prompt, setPrompt] = useState('');
    const [sourceMedia, setSourceMedia] = useState<{ file: File, previewUrl: string, type: 'image' | 'video' } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');
    
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Director's Toolkit State
    const [cinematicMovement, setCinematicMovement] = useState<CinematicMovement>('static');
    const [movementSpeed, setMovementSpeed] = useState(50); // 0-100
    const [shotFraming, setShotFraming] = useState<ShotFraming>('none');
    const [lensChoice, setLensChoice] = useState<LensChoice>('none');
    const [motionIntensity, setMotionIntensity] = useState(50); // 0-100
    
    // Artistic Controls State
    const [artisticStyle, setArtisticStyle] = useState('none');
    const [styleAdherence, setStyleAdherence] = useState(50); // 0-100
    const [colorGrade, setColorGrade] = useState('none');
    const [negativePrompt, setNegativePrompt] = useState('');

    // Technical Controls State
    const [duration, setDuration] = useState(10); // 2-60s
    const [pacing, setPacing] = useState<Pacing>('real-time');
    const [seed, setSeed] = useState(0);
    const [promptAdherence, setPromptAdherence] = useState(70); // 0-100

    // New features state
    const [motionBrushPrompt, setMotionBrushPrompt] = useState('');
    const [isCharacterLock, setIsCharacterLock] = useState(false);
    const [isPerfectLoop, setIsPerfectLoop] = useState(false);

    // Aura Integration State
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

    const resetState = useCallback(() => {
        setPrompt('');
        setSourceMedia(null);
        setGeneratedVideoUrl(null);
        setProgressMessage('');
        setCinematicMovement('static');
        setMovementSpeed(50);
        setShotFraming('none');
        setLensChoice('none');
        setMotionIntensity(50);
        setArtisticStyle('none');
        setStyleAdherence(50);
        setColorGrade('none');
        setNegativePrompt('');
        setDuration(10);
        setPacing('real-time');
        setSeed(0);
        setPromptAdherence(70);
        setMotionBrushPrompt('');
        setIsCharacterLock(false);
        setIsPerfectLoop(false);
        setUseAuraMood(false);
        setShowMoodTweaks(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetMoodToCurrent();
        } else if (!isOpen) {
            resetState();
        }
    }, [isOpen, resetState, resetMoodToCurrent]);

    useEffect(() => {
        // Cleanup the object URL
        return () => {
            if (sourceMedia) {
                URL.revokeObjectURL(sourceMedia.previewUrl);
            }
        };
    }, [sourceMedia]);

    const handleFileSelect = (file: File | null) => {
        if (file) {
            if (sourceMedia) {
                URL.revokeObjectURL(sourceMedia.previewUrl);
            }
            const type = file.type.startsWith('image/') ? 'image' : 'video';
            setSourceMedia({ file, previewUrl: URL.createObjectURL(file), type });
        }
    };

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; handleFileSelect(file || null); }, []);
    const handleRemoveMedia = useCallback((e: React.MouseEvent) => { e.stopPropagation(); if (sourceMedia) { URL.revokeObjectURL(sourceMedia.previewUrl); } setSourceMedia(null); if(fileInputRef.current) { fileInputRef.current.value = ''; } }, [sourceMedia]);


    const handleGenerate = async () => {
        if (!prompt.trim() && !sourceMedia) {
            addToast('Please enter a prompt or provide source media.', 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedVideoUrl(null);
        setProgressMessage(t('videoGen_progress_sending'));
        
        try {
            const videoUrl = await generateVideo(
                prompt,
                (msg) => setProgressMessage(msg),
                sourceMedia ? { file: sourceMedia.file, type: sourceMedia.type } : undefined,
                cinematicMovement,
                movementSpeed,
                shotFraming,
                lensChoice,
                motionIntensity,
                artisticStyle,
                styleAdherence,
                colorGrade,
                negativePrompt,
                duration,
                pacing,
                seed > 0 ? seed : undefined,
                promptAdherence,
                motionBrushPrompt,
                isCharacterLock,
                isPerfectLoop,
                useAuraMood,
                useAuraMood ? {
                    gunaState: moodGuna,
                    noveltySignal: moodNovelty,
                    harmonyScore: moodHarmony,
                    loveSignal: moodLove,
                    wisdomSignal: moodWisdom,
                } : undefined
            );

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

    const handleUseInChat = async (videoUrl: string) => {
        if (!videoUrl) return;
        try {
            const response = await fetch(videoUrl);
            const blob = await response.blob();
            const file = new File([blob], "generated-video.mp4", { type: "video/mp4" });
            const previewUrl = URL.createObjectURL(file);
            setAttachedFile({ file, previewUrl, type: 'video' });
            onClose();
        } catch (error) {
            console.error("Failed to attach video:", error);
            addToast("Failed to attach video to chat.", "error");
        }
    };
    
    const handleDownload = (videoUrl: string) => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `aura-generated-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleResetMood = () => {
        resetMoodToCurrent();
        addToast("Mood parameters reset to Aura's current state.", 'info');
    };

    const handleGenerateDream = async () => {
        setIsGenerating(true);
        const dreamPrompt = await handleGenerateDreamPrompt();
        if (dreamPrompt) {
            setPrompt(dreamPrompt);
        }
        setIsGenerating(false);
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('videoGen_title')} className="video-generation-modal">
            <div className="image-gen-layout">
                <div className="image-gen-controls">
                    {/* Prompt and Media */}
                    <div className="image-gen-control-group">
                        <label htmlFor="vid-prompt">{t('videoGen_prompt')}</label>
                        <textarea id="vid-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('videoGen_promptPlaceholder')} disabled={isGenerating} />
                    </div>
                    <div className="image-gen-control-group">
                        <label>{t('videoGen_sourceMedia')}</label>
                         <div 
                            className={`image-gen-reference-upload ${isDragging ? 'dropzone-active' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files?.[0] || null)} accept="image/*,video/*" style={{ display: 'none' }} />
                            {sourceMedia ? (
                                <div className="image-gen-reference-preview">
                                    {sourceMedia.type === 'image' ? <img src={sourceMedia.previewUrl} alt="Reference" className="reference-preview-img" /> : <video src={sourceMedia.previewUrl} autoPlay loop muted className="reference-preview-img" />}
                                    <button className="remove-reference-btn" onClick={handleRemoveMedia} title={t('videoGen_clearMedia')}>&times;</button>
                                </div>
                            ) : (
                                <span>{t('videoGen_uploadOrDrop')}</span>
                            )}
                        </div>
                    </div>
                     {sourceMedia?.type === 'image' && (
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-motion-brush">{t('videoGen_motionBrush')}</label>
                            <p className="control-group-description">{t('videoGen_motionBrushDesc')}</p>
                            <textarea id="vid-motion-brush" value={motionBrushPrompt} onChange={e => setMotionBrushPrompt(e.target.value)} placeholder={t('videoGen_motionBrushPlaceholder')} disabled={isGenerating} rows={2}/>
                        </div>
                    )}

                    {/* Director's Toolkit */}
                     <Accordion title={t('videoGen_directorsToolkit')} defaultOpen={true}>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-movement">{t('videoGen_cinematicMovement')}</label>
                            <select id="vid-movement" value={cinematicMovement} onChange={e => setCinematicMovement(e.target.value as CinematicMovement)} disabled={isGenerating}>
                                {cinematicMovements.map(m => <option key={m.id} value={m.id}>{t(m.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="vid-move-speed">{t('videoGen_movementSpeed')}</label>
                            <span>{t('videoGen_speedSlow')}</span>
                            <input type="range" id="vid-move-speed" min="0" max="100" value={movementSpeed} onChange={e => setMovementSpeed(Number(e.target.value))} disabled={isGenerating || cinematicMovement === 'static'} />
                            <span>{t('videoGen_speedFast')}</span>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-framing">{t('videoGen_shotFraming')}</label>
                            <select id="vid-framing" value={shotFraming} onChange={e => setShotFraming(e.target.value as ShotFraming)} disabled={isGenerating}>
                                {shotFramings.map(f => <option key={f.id} value={f.id}>{t(f.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-lens">{t('videoGen_lensChoice')}</label>
                            <select id="vid-lens" value={lensChoice} onChange={e => setLensChoice(e.target.value as LensChoice)} disabled={isGenerating}>
                                {lensChoices.map(l => <option key={l.id} value={l.id}>{t(l.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="vid-motion-intensity">{t('videoGen_motionIntensity')}</label>
                            <span>{t('videoGen_intensitySubtle')}</span>
                            <input type="range" id="vid-motion-intensity" min="0" max="100" value={motionIntensity} onChange={e => setMotionIntensity(Number(e.target.value))} disabled={isGenerating} />
                            <span>{t('videoGen_intensityExtreme')}</span>
                        </div>
                    </Accordion>
                    
                    {/* Artistic Controls */}
                     <Accordion title="Artistic Controls">
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-art-style">{t('videoGen_artisticStyle')}</label>
                            <select id="vid-art-style" value={artisticStyle} onChange={e => setArtisticStyle(e.target.value)} disabled={isGenerating}>
                                <option value="none">{t('imageGen_style_none')}</option>
                                {styleGroups.map(group => (
                                    <optgroup key={group.labelKey} label={t(group.labelKey)}>
                                        {group.styles.map(s => <option key={s.id} value={s.id}>{t(s.labelKey)}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="vid-style-adherence">{t('videoGen_styleAdherence')}</label>
                             <span>{t('videoGen_adherenceSubtle')}</span>
                            <input type="range" id="vid-style-adherence" min="0" max="100" value={styleAdherence} onChange={e => setStyleAdherence(Number(e.target.value))} disabled={isGenerating || artisticStyle === 'none'} />
                            <span>{t('videoGen_adherenceTotal')}</span>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-color-grade">{t('videoGen_colorGrade')}</label>
                            <select id="vid-color-grade" value={colorGrade} onChange={e => setColorGrade(e.target.value)} disabled={isGenerating}>
                                {colorGrades.map(g => <option key={g.id} value={g.id}>{t(g.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-neg-prompt">{t('videoGen_negativePrompt')}</label>
                            <textarea id="vid-neg-prompt" value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)} placeholder={t('videoGen_negativePromptPlaceholder')} disabled={isGenerating} rows={2} />
                        </div>
                    </Accordion>

                    {/* Technical Controls */}
                     <Accordion title="Technical Controls">
                        <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="vid-duration">{t('videoGen_duration')}</label>
                            <input type="range" id="vid-duration" min="2" max="60" value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isGenerating} />
                            <span>{t('videoGen_seconds', {count: duration})}</span>
                        </div>
                        <div className="image-gen-control-group">
                            <label htmlFor="vid-pacing">{t('videoGen_pacing')}</label>
                            <select id="vid-pacing" value={pacing} onChange={e => setPacing(e.target.value as Pacing)} disabled={isGenerating}>
                                {pacingOptions.map(p => <option key={p.id} value={p.id}>{t(p.labelKey)}</option>)}
                            </select>
                        </div>
                        <div className="image-gen-control-group seed-input-group">
                            <label htmlFor="vid-seed">{t('videoGen_seed')}</label>
                            <input type="number" id="vid-seed" value={seed} onChange={e => setSeed(Number(e.target.value))} placeholder="0 for random" disabled={isGenerating} />
                            <button onClick={() => setSeed(Math.floor(Math.random() * 1000000))} disabled={isGenerating} title={t('videoGen_randomize')}>🎲</button>
                        </div>
                         <div className="image-gen-control-group slider-label-group">
                            <label htmlFor="vid-prompt-adherence">{t('videoGen_promptAdherence')}</label>
                            <span>{t('videoGen_adherenceCreative')}</span>
                            <input type="range" id="vid-prompt-adherence" min="0" max="100" value={promptAdherence} onChange={e => setPromptAdherence(Number(e.target.value))} disabled={isGenerating} />
                            <span>{t('videoGen_adherenceStrict')}</span>
                        </div>
                         <div className="image-gen-control-group toggle-group">
                            <label htmlFor="vid-char-lock" className="toggle-switch-label">{t('videoGen_characterLock')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="vid-char-lock" checked={isCharacterLock} onChange={e => setIsCharacterLock(e.target.checked)} disabled={isGenerating} />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                         <p className="control-group-description">{t('videoGen_characterLockDesc')}</p>

                        <div className="image-gen-control-group toggle-group">
                            <label htmlFor="vid-loop" className="toggle-switch-label">{t('videoGen_perfectLoop')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="vid-loop" checked={isPerfectLoop} onChange={e => setIsPerfectLoop(e.target.checked)} disabled={isGenerating} />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <p className="control-group-description">{t('videoGen_perfectLoopDesc')}</p>
                    </Accordion>

                    <Accordion title={t('videoGen_auraIntegration')}>
                        <div className="image-gen-control-group toggle-group">
                            <label htmlFor="vid-aura-mood-toggle" className="toggle-switch-label">{t('videoGen_useAuraMood')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" id="vid-aura-mood-toggle" checked={useAuraMood} onChange={e => {
                                    setUseAuraMood(e.target.checked);
                                    setShowMoodTweaks(e.target.checked);
                                }} disabled={isGenerating} />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        {useAuraMood && (
                            <div className={`image-gen-control-group mood-tweaks-submenu ${showMoodTweaks ? 'open' : ''}`}>
                                <div className="mood-tweaks-header">
                                    <h4>{t('videoGen_tweakMood')}</h4>
                                    <button onClick={handleResetMood} className="control-button reset-mood-button">{t('videoGen_resetMood')}</button>
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
                                {t('videoGen_generateFromDream')}
                            </button>
                        </div>
                    </Accordion>
                    
                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? t('videoGen_generating') : t('videoGen_generate')}
                    </button>
                </div>

                <div className="image-gen-preview">
                    {isGenerating && (
                        <div className="loading-overlay active">
                            <div className="spinner-small"></div>
                            <span>{progressMessage || t('videoGen_generating')}</span>
                        </div>
                    )}
                    {generatedVideoUrl ? (
                        <div className="image-results-grid">
                            <div className="generated-image-item">
                                <video src={generatedVideoUrl} controls autoPlay loop />
                                <div className="image-item-actions">
                                    <button onClick={() => handleDownload(generatedVideoUrl)} title={t('videoGen_download')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                                    </button>
                                    <button onClick={() => handleUseInChat(generatedVideoUrl)} title={t('videoGen_useInChat')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        !isGenerating && <p>{t('videoGen_placeholder')}</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};