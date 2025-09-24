import React, { useState, useRef, useCallback, DragEvent, useEffect } from 'react';
import { Modal } from './Modal';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext';
import { useModal } from '../context/ModalContext';
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
    
    const handleEdit = (imageUrl: string) => {
        modal.open('imageEditing', { initialImage: imageUrl });
        onClose(); // Close the generation modal
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
                        <label