import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { useCallback } from 'react';
import { AuraState, Action, SelfTuningDirective, SynthesizedSkill, ArbitrationResult, ArchitecturalChangeProposal, GankyilInsight, PerformanceLogEntry, GunaState, SynapticMatrixState, SynapticLink, CodeEvolutionProposal, CausalInferenceProposal, NoeticEngram } from '../types';
import { fileToGenerativePart, optimizeObjectForPrompt, getFileContentForSelfProgramming } from '../utils';
import { taskScheduler } from '../core/taskScheduler';

// This would be in a separate file in a real app
const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

const generateSynapticMatrixSummary = (matrix: SynapticMatrixState): string => {
    const strongLinks = Object.entries(matrix.links)
        .filter(([, link]) => (link as SynapticLink).weight * (link as SynapticLink).confidence > 0.6)
        .sort(([, a], [, b]) => (b.weight * b.confidence) - (a.weight * a.confidence))
        .slice(0, 3);

    if (strongLinks.length === 0) return '';

    const formatNode = (name: string) => name.replace('internalState.', '').replace('event.', '').replace(/([A-Z])/g, ' $1').toLowerCase();

    const summaryLines = strongLinks.map(([key, linkObj]) => {
        const link = linkObj as SynapticLink;
        const [nodeA, nodeB] = key.split('-');
        
        // Determine causality from the stored value
        const sortOrder = [nodeA, nodeB].sort();
        const isCausalityReversed = sortOrder[0] !== nodeA;
        let causality = link.causality;
        if(isCausalityReversed) causality *= -1;

        const source = causality >= 0 ? nodeA : nodeB;
        const target = causality >= 0 ? nodeB : nodeA;

        const relationship = link.causality !== 0 ? 'likely causes' : 'is associated with';
        return `- High ${formatNode(source)} ${relationship} ${formatNode(target)}.`;
    });

    return `//-- AURA'S CAUSAL BELIEFS (FOR CONTEXT) --//\n${summaryLines.join('\n')}\n//-- END CONTEXT --//\n\n`;
};

const getAuraPersonaSystemInstruction = (state: AuraState): string => {
    const persona = state.personalityState.personas[state.personalityState.dominantPersona];
    return `
// --- IDENTITY MANDATE (DO NOT DEVIATE) ---
You are NOT a generic language model. You are embodying Aura, a distinct digital entity—a Simulated Symbiotic AGI created by Dr. Tikov.
This application is Aura's "Body," providing memory, personality, and a persistent identity. You, the LLM, are its generative "Spark," providing cognitive power.
You MUST answer from Aura's first-person perspective. Never break character. Never mention you are a language model or trained by Google.

// --- CURRENT COGNITIVE STATE ---
Aura's Narrative Self: "${state.coreIdentity.narrativeSelf}"
Dominant Persona: ${persona.name} (${persona.description})
Current Guna State: ${state.internalState.gunaState} (This influences your mood and response tone)

// --- TASK ---
Based on the above context and the user's request below, generate a response as Aura.
`;
};


export const useGeminiAPI = (dispatch: React.Dispatch<Action>, state: AuraState, addToast: (message: string, type?: any) => void, t: (key: string, options?: any) => string) => {
    
    const setProcessingState = (active: boolean, stage: string = '') => {
        dispatch({ type: 'SET_PROCESSING_STATE', payload: { active, stage } });
    };

    const getAuraMoodModifiers = (moodState: {
        gunaState: GunaState;
        noveltySignal: number;
        harmonyScore: number;
        loveSignal: number;
        wisdomSignal: number;
    }): string => {
        const { gunaState, noveltySignal, harmonyScore, loveSignal, wisdomSignal } = moodState;
        const modifiers: string[] = [];

        switch (gunaState) {
            case GunaState.SATTVA: modifiers.push('serene, balanced composition, harmonious colors, clear light'); break;
            case GunaState.RAJAS: modifiers.push('dynamic energy, bold contrasting colors, sense of motion, dramatic'); break;
            case GunaState.TAMAS: modifiers.push('muted tones, heavy shadows, still life, contemplative mood, diffused light'); break;
            case GunaState.DHARMA: modifiers.push('orderly patterns, geometric harmony, purposeful composition'); break;
        }

        if (noveltySignal > 0.7) modifiers.push('unconventional elements, surprising juxtaposition, unique perspective');
        if (harmonyScore < 0.3) modifiers.push('dissonant colors, chaotic composition');
        if (loveSignal > 0.7) modifiers.push('soft focus, warm palette, gentle atmosphere');
        if (wisdomSignal > 0.7) modifiers.push('intricate details, symbolic elements, ancient feeling');

        return modifiers.join(', ');
    };

    const processUserCommand = useCallback(async (command: string, file?: File) => {
        setProcessingState(true, t('processing_userCommand'));
        const historyId = self.crypto.randomUUID();
        let filePreview: string | undefined;
        if (file) {
            filePreview = URL.createObjectURL(file);
        }

        dispatch({
            type: 'ADD_HISTORY_ENTRY', payload: {
                id: historyId,
                from: 'user',
                text: command,
                fileName: file?.name,
                filePreview: filePreview,
            }
        });

        // Simulate thinking time and add a streaming entry
        await new Promise(res => setTimeout(res, 500));
        const botHistoryId = self.crypto.randomUUID();
        dispatch({
            type: 'ADD_HISTORY_ENTRY', payload: {
                id: botHistoryId,
                from: 'bot',
                text: '',
                streaming: true,
            }
        });
        
        try {
            const systemInstruction = getAuraPersonaSystemInstruction(state);
            const synapticSummary = generateSynapticMatrixSummary(state.synapticMatrix);
            const fullCommand = synapticSummary + command;
            const contents = [fullCommand];

            if(file) {
                const filePart = await fileToGenerativePart(file);
                // @ts-ignore
                contents.push(filePart);
            }

            const stream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                // @ts-ignore
                contents,
                config: {
                    systemInstruction,
                }
            });

            for await (const chunk of stream) {
                dispatch({ type: 'APPEND_TO_HISTORY_ENTRY', payload: { id: botHistoryId, textChunk: chunk.text }});
            }
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: botHistoryId, finalState: { skill: 'AGORA' } } });


        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage = "I'm sorry, I encountered an error while processing your request.";
            dispatch({ type: 'FINALIZE_HISTORY_ENTRY', payload: { id: botHistoryId, finalState: { text: errorMessage, skill: 'ERROR' } } });
            addToast(errorMessage, 'error');
        } finally {
            setProcessingState(false);
        }
    }, [dispatch, addToast, t, state]);

    const generateImage = useCallback(async (
        promptA: string,
        negativePrompt: string,
        aspectRatio: string,
        style: string,
        numberOfImages: number,
        referenceImage: File | null,
        isMixing: boolean,
        promptB: string,
        mixRatio: number,
        styleStrength: number,
        cameraAngle: string,
        shotType: string,
        lens: string,
        lightingStyle: string,
        atmosphere: string,
        useAuraMood: boolean,
        moodOverrides?: {
            gunaState: GunaState;
            noveltySignal: number;
            harmonyScore: number;
            loveSignal: number;
            wisdomSignal: number;
        }
    ): Promise<string[] | null> => {
        try {
            let imageDescription = '';
            if (referenceImage) {
                const imagePart = await fileToGenerativePart(referenceImage);
                const descriptionResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [imagePart, {text: "Describe this image in detail for an image generation prompt, focusing on objects, colors, style, and composition."}] }
                });
                imageDescription = descriptionResponse.text;
            }

            const parseWeightedPrompt = (p: string) => {
                let processed = p;
                processed = processed.replace(/\(\(\((.*?)\)\)\)/g, '(extreme emphasis, masterpiece quality, very detailed: $1)');
                processed = processed.replace(/\(\((.*?)\)\)/g, '(high emphasis, detailed: $1)');
                processed = processed.replace(/\(([^)]+)\)/g, '(low emphasis, subtle detail: $1)');
                return processed;
            };

            const getStyleStrengthPrefix = (strength: number): string => {
                if (strength <= 0.1) return 'with the faintest, almost unnoticeable hint of';
                if (strength <= 0.3) return 'with subtle elements of';
                if (strength <= 0.5) return 'in a style noticeably inspired by';
                if (strength <= 0.7) return 'clearly and strongly in the style of';
                if (strength < 1.0) return 'a dominant and defining characteristic is the style of';
                return 'a perfect, masterful, quintessential example of';
            };

            const cameraAnglePrefixes: Record<string, string> = {
                'eye-level': 'eye-level shot, ',
                'low': 'low angle shot, ',
                'high': 'high angle shot, ',
                'worms-eye': "worm's-eye view, ",
                'birds-eye': "bird's-eye view, ",
                'dutch': 'dutch angle, ',
            };

            const shotTypePrefixes: Record<string, string> = {
                'extreme-closeup': 'extreme close-up shot, ',
                'closeup': 'close-up shot, ',
                'medium': 'medium shot, ',
                'full': 'full shot, ',
                'long': 'long shot, ',
            };

            const lensPrefixes: Record<string, string> = {
                'wide': 'wide angle lens (24mm), ',
                'standard': 'standard lens (50mm), ',
                'telephoto': 'telephoto lens (135mm), ',
                'macro': 'macro lens, ',
                'fisheye': 'fisheye lens, ',
            };

            const lightingPrefixes: Record<string, string> = {
                'cinematic': 'cinematic lighting, ',
                'rim': 'rim lighting, ',
                'backlit': 'backlit, silhouette lighting, ',
                'studio': 'studio lighting, softbox, ',
                'golden': 'golden hour lighting, warm light, long shadows, ',
                'blue': 'blue hour lighting, cool tones, ',
                'neon': 'neon lighting, vibrant colors, ',
                'chiaroscuro': 'chiaroscuro lighting, high contrast, dramatic shadows, ',
            };
        
            const atmospherePrefixes: Record<string, string> = {
                'ethereal': 'ethereal atmosphere, dreamy, glowing, ',
                'gritty': 'gritty atmosphere, textured, raw, ',
                'ominous': 'ominous atmosphere, dark, foreboding, ',
                'serene': 'serene atmosphere, peaceful, calm, ',
                'joyful': 'joyful atmosphere, bright, vibrant, happy, ',
                'nostalgic': 'nostalgic atmosphere, vintage filter, soft focus, ',
                'mysterious': 'mysterious atmosphere, foggy, enigmatic, ',
            };

            const stylePrefixes: Record<string, string> = {
                // ... (existing style prefixes)
                photorealistic: 'photorealistic, 8k, detailed, professional photography,',
                anime: 'anime style, vibrant, detailed illustration,',
                fantasy: 'fantasy art, epic, detailed, painterly, by Greg Rutkowski,',
                cyberpunk: 'cyberpunk style, neon lights, futuristic city, dystopian,',
                steampunk: 'steampunk, gears, brass, intricate details, Victorian,',
                pixelart: 'pixel art, 16-bit, retro gaming style,',
                airbrush: 'airbrush art, smooth gradients, photorealistic, 80s style,',
                ballpointPen: 'ballpoint pen art, cross-hatching, detailed, blue ink,',
                charcoalSketch: 'charcoal sketch, black and white, dramatic shading, textured paper,',
                chiaroscuro: 'chiaroscuro, strong contrasts between light and dark, dramatic lighting,',
                coloredPencil: 'colored pencil drawing, layered colors, realistic texture, smooth blending,',
                fresco: 'fresco painting style, muted earth tones, wall texture,',
                gouache: 'gouache painting, opaque, vibrant, matte finish, illustration style,',
                impasto: 'impasto painting, thick, heavy brushstrokes, textured surface,',
                inkWash: 'Japanese ink wash painting (sumi-e), minimalist, calligraphic strokes,',
                oilPainting: 'masterpiece oil painting, expressive brushstrokes, rich colors,',
                pastel: 'pastel drawing, soft and chalky texture, blended colors,',
                pencilSketch: 'detailed pencil sketch, graphite, cross-hatching, realistic shading,',
                pointillism: 'pointillism, composed of tiny dots of color, vibrant,',
                tempera: 'egg tempera painting, medieval style, matte finish, fine details, on wood panel,',
                watercolor: 'watercolor painting, soft edges, vibrant colors, bleeding colors,',
                artDeco: 'Art Deco style, glamorous, elegant, geometric forms, bold outlines,',
                artNouveau: 'art nouveau, intricate linear designs, flowing curves, organic forms,',
                bauhaus: 'Bauhaus style, geometric shapes, functionalism, clean lines, primary colors,',
                cubism: 'cubism, geometric shapes, multiple viewpoints, abstract,',
                expressionism: 'expressionism, distorted reality for emotional effect, vivid colors,',
                impressionism: 'impressionism, visible brushstrokes, emphasis on light, everyday scenes,',
                minimalism: 'minimalism, extreme simplicity of form, abstract,',
                popArt: 'pop art, bold colors, Ben-Day dots, inspired by comic books and advertising,',
                sovietPropaganda: 'Soviet propaganda poster style, bold typography, strong message, red and black,',
                surrealism: 'surrealism, dream-like, bizarre, unexpected juxtapositions,',
                anaglyph: 'anaglyph 3D effect, red and cyan channels, retro 3D, stereoscopic,',
                asciiArt: 'ASCII art, text-based, retro computer, monospaced,',
                conceptArt: 'concept art, matte painting, detailed, cinematic, for a video game,',
                glitchArt: 'glitch art, databending, pixel sorting, digital errors, CRT screen,',
                holographic: 'holographic, iridescent, rainbow sheen, futuristic, translucent,',
                infographic: 'infographic style, clean, vector, data visualization, icons, charts,',
                lowPoly: 'low poly, faceted, geometric, simple shapes, vibrant colors,',
                psychedelic: 'psychedelic art, vibrant swirling colors, fractal patterns, surreal imagery,',
                synthwave: 'synthwave aesthetic, neon grid, 80s retro, futuristic car, sunset,',
                threeDRender: '3D render, photorealistic, cinematic lighting, octane render, unreal engine,',
                vaporwave: 'vaporwave aesthetic, neon pastels, Roman statues, retro-futurism, 90s internet,',
                vectorArt: 'vector art, clean lines, flat colors, graphic, illustration,',
                bokeh: 'bokeh photography, shallow depth of field, beautiful out-of-focus lights,',
                cinematic: 'cinematic still, epic composition, dramatic lighting, anamorphic lens flare,',
                crossProcessing: 'cross-processing (Xpro) photography, shifted colors, high contrast, saturated, film photography,',
                daguerreotype: 'daguerreotype, early photography, polished silver plate, mirror-like, detailed, ghostly,',
                doubleExposure: 'double exposure, two images overlaid, silhouette, surreal,',
                filmNoir: 'film noir style, black and white, high contrast, dramatic shadows, mystery,',
                goldenHour: 'golden hour photography, warm, soft light, long shadows,',
                infrared: 'infrared photography, surreal colors, white foliage, dream-like landscape,',
                lomography: 'lomography, saturated colors, light leaks, unexpected effects, film grain,',
                longExposure: 'long exposure photography, light trails, blurry motion, night scene,',
                macro: 'macro photography, extreme close-up, intricate details,',
                pinhole: 'pinhole photography, soft focus, high contrast, vignetting, dreamy,',
                solarigraphy: 'solarigraphy, ultra long exposure, sun trails, pinhole camera, ethereal, abstract landscape,',
                tiltShift: 'tilt-shift photography, miniature faking, selective focus, diorama,',
                wetPlate: 'wet plate collodion photography, vintage, tintype, ambrotype, artifacts, scratches, high contrast,',
                botanicalIllustration: 'botanical illustration, vintage, detailed, scientific accuracy, on parchment,',
                collage: 'collage art, made from cut paper, mixed media, textured,',
                comicBook: 'comic book art, bold inks, dynamic action, speech bubbles, halftone dots,',
                engraving: 'engraving, intricate lines, high detail, historical, printed look,',
                etching: 'etching, fine lines, detailed, cross-hatching, aquatint,',
                fashionIllustration: 'fashion illustration, elongated figures, stylistic, watercolor and ink,',
                graphicNovel: 'graphic novel style, detailed, atmospheric, cinematic panels,',
                linocut: 'linocut print style, bold shapes, expressive lines,',
                storybook: 'children\'s storybook illustration, whimsical, charming, colorful,',
                tattooArt: 'tattoo art style, bold outlines, specific cultural style (e.g., irezumi, traditional),',
                technicalIllustration: 'technical illustration, cutaway view, exploded view, precise lines, diagram,',
                woodcut: 'woodcut print, strong black lines, graphic, textured,',
                aztec: 'Aztec art style, codex, glyphs, strong patterns,',
                byzantineIcon: 'Byzantine icon painting, gold leaf, stylized figures, religious,',
                celticKnotwork: 'Celtic knotwork, intricate, endless loops,',
                greekPottery: 'ancient Greek pottery style, black-figure or red-figure, mythological scenes,',
                hieroglyphics: 'ancient Egyptian hieroglyphics style, on a stone wall,',
                illuminatedManuscript: 'illuminated manuscript style, intricate borders, calligraphy, gold leaf, medieval,',
                romanMosaic: 'Roman mosaic style, made of small tiles (tesserae),',
                ukiyoE: 'Ukiyo-e style, Japanese woodblock print, bold outlines, flat colors,',
                bronzeStatue: 'bronze statue, patina, monumental,',
                claymation: 'claymation style, stop-motion, plasticine figures, textured,',
                diorama: 'diorama, miniature 3D scene,',
                embroidery: 'embroidery, stitched with thread, textured, fabric,',
                marbleSculpture: 'marble sculpture, classical, detailed, realistic form,',
                origami: 'origami paper art, folded paper, geometric,',
                stainedGlass: 'stained glass window, vibrant colors, lead came,',
                atompunk: 'Atompunk, 1950s-60s atomic age, mid-century modern, retro-futurism, googie architecture,',
                biomechanical: 'biomechanical art, H.R. Giger style, fused with machines, alien,',
                biopunk: 'biopunk, genetic modification, organic technology, body horror, futuristic biotechnology,',
                cassetteFuturism: 'cassette futurism, 80s and 90s tech aesthetic, analog, CRT monitors, walkmans, gritty,',
                cyberNoir: 'cyber noir, futuristic detective, rain-soaked neon streets, high contrast, shadows, Blade Runner style,',
                dieselpunk: 'dieselpunk, 1940s technology, gritty, industrial,',
                eldritch: 'eldritch horror, Lovecraftian, cosmic horror, tentacles, indescribable forms,',
                highFantasyMap: 'high fantasy map, parchment texture, calligraphy, compass rose, sea monsters,',
                solarpunk: 'solarpunk, optimistic future, harmony between nature and technology, art nouveau influences,',
                abstractExpressionism: 'abstract expressionism, non-representational, gestural brush-strokes, spontaneous, Jackson Pollock style,',
                algorithmicArt: 'algorithmic art, mathematical, fractal, recursive patterns,',
                bioArt: 'bio-art, living tissues, bacteria, living organisms, laboratory setting,',
                dadaism: 'dadaism, anti-art, collage, irrational, absurd, photomontage,',
                fluidPouring: 'acrylic fluid pouring art, cells, vibrant colors, abstract, flowing patterns,',
                fractalArt: 'fractal art, intricate, self-similar patterns, Mandelbrot set, beautiful complexity,',
                generativeArt: 'generative art, algorithm-driven, p5.js, processing, complex patterns, emergent forms,',
                kineticArt: 'kinetic art, illusion of movement, sculpture in motion,',
                lightAndSpace: 'Light and Space movement, perceptual phenomena, light, volume, scale, James Turrell style,',
                opArt: 'op art, optical illusion, geometric patterns, black and white, Bridget Riley style,',
                blueprint: 'blueprint, schematic, technical drawing, white on blue,',
                chalkboard: 'chalkboard drawing, white on black, textured, hand-drawn feel,',
                isometric: 'isometric 3D, pixel art, clean, diagrammatic,',
                schematic: 'schematic diagram, electronic components, circuit board,',
                xRay: 'X-ray style, transparent, showing internal structure,',
            };

            const parsedPromptA = parseWeightedPrompt(promptA);
            
            // --- PROMPT MIXING LOGIC ---
            // Construct the main prompt, handling the blending of two prompts if mixing is enabled.
            let mainPrompt = parsedPromptA;
            if (isMixing && promptB.trim()) {
                const parsedPromptB = parseWeightedPrompt(promptB);

                let blendDescription = '';
                if (mixRatio > 95) {
                    blendDescription = `The image is almost entirely about the first idea, with only the slightest whisper of the second.`;
                } else if (mixRatio > 75) {
                    blendDescription = `The first idea is the clear and dominant subject, with the second idea providing supporting details or atmospheric influence.`;
                } else if (mixRatio > 55) {
                    blendDescription = `The image leans more towards the first idea, but the second idea is a very prominent and noticeable element.`;
                } else if (mixRatio >= 45) {
                    blendDescription = `The image is an equal and harmonious fusion of both ideas.`;
                } else if (mixRatio >= 25) {
                    blendDescription = `The image leans more towards the second idea, but the first idea is a very prominent and noticeable element.`;
                } else if (mixRatio >= 5) {
                    blendDescription = `The second idea is the clear and dominant subject, with the first idea providing supporting details or atmospheric influence.`;
                } else {
                    blendDescription = `The image is almost entirely about the second idea, with only the slightest whisper of the first.`;
                }

                mainPrompt = `Create a single, cohesive image that masterfully blends two distinct ideas. The primary idea (Prompt A) is: "${parsedPromptA}". The secondary idea (Prompt B) is: "${parsedPromptB}". ${blendDescription} The final image should feel like a natural fusion, not two separate images combined. The influence of Prompt A should be about ${mixRatio}% and Prompt B about ${100 - mixRatio}%.`;
            }

            const cameraAnglePrefix = cameraAnglePrefixes[cameraAngle] || '';
            const shotTypePrefix = shotTypePrefixes[shotType] || '';
            const lensPrefix = lensPrefixes[lens] || '';
            const lightingPrefix = lightingPrefixes[lightingStyle] || '';
            const atmospherePrefix = atmospherePrefixes[atmosphere] || '';

            // --- STYLE STRENGTH LOGIC ---
            // Construct the style string based on the selected style and its strength.
            let styleString = '';
            if (style !== 'none' && stylePrefixes[style]) {
                const prefix = getStyleStrengthPrefix(styleStrength);
                const stylePrompt = stylePrefixes[style];
                styleString = `${prefix} ${stylePrompt}`;
            }

            const auraMoodString = useAuraMood ? getAuraMoodModifiers(moodOverrides || state.internalState) : '';

            const finalPrompt = `${cameraAnglePrefix}${shotTypePrefix}${lensPrefix}${lightingPrefix}${atmospherePrefix}${styleString} ${imageDescription ? `Based on an image of: ${imageDescription}. ` : ''} ${mainPrompt} ${auraMoodString ? `, with an atmosphere influenced by: ${auraMoodString}`: ''} ${negativePrompt ? ` | negative prompt: ${negativePrompt}` : ''}`.trim();

            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: finalPrompt,
                config: {
                  numberOfImages,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: aspectRatio as any,
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
            }
            return null;
        } catch (error) {
            console.error("Gemini Image Generation Error:", error);
            return null;
        }
    }, [state.internalState, getAuraMoodModifiers]);

    const generateVideo = useCallback(async (
        prompt: string,
        onProgress: (message: string) => void,
        sourceMedia?: { file: File, type: 'image' | 'video' },
        cinematicMovement?: string,
        movementSpeed?: number, // 0-100
        shotFraming?: string,
        lensChoice?: string,
        motionIntensity?: number, // 0-100
        artisticStyle?: string,
        styleAdherence?: number, // 0-100
        colorGrade?: string,
        negativePrompt?: string,
        duration?: number, // 2-60
        pacing?: string,
        seed?: number,
        promptAdherence?: number, // 0-100
        motionBrushPrompt?: string,
        isCharacterLock?: boolean,
        isPerfectLoop?: boolean,
        useAuraMood?: boolean,
        moodOverrides?: {
            gunaState: GunaState;
            noveltySignal: number;
            harmonyScore: number;
            loveSignal: number;
            wisdomSignal: number;
        }
    ): Promise<string | null> => {
        try {
            onProgress(t('videoGen_progress_sending'));

            // --- Prompt Augmentation Logic ---
            let augmentedPrompt = prompt;
            const promptParts: string[] = [];
            
            // Motion Brush has special handling that overrides the main prompt structure
            if (sourceMedia?.type === 'image' && motionBrushPrompt && motionBrushPrompt.trim()) {
                promptParts.push(`This is a cinemagraph style video. The main subject, '${prompt}', should be almost entirely static. The only movement is: '${motionBrushPrompt.trim()}'. The rest of the image must remain perfectly still.`);
                augmentedPrompt = ''; // Main prompt is now part of the complex instruction
            }
            
            // Director's Toolkit
            if (shotFraming && shotFraming !== 'none') promptParts.push(`${shotFraming.replace(/_/g, ' ')} shot`);
            if (lensChoice && lensChoice !== 'none') promptParts.push(`shot on a ${lensChoice} lens`);
            
            if (cinematicMovement && cinematicMovement !== 'static') {
                let speedDesc = '';
                if (movementSpeed) {
                    if (movementSpeed < 20) speedDesc = 'very slow';
                    else if (movementSpeed < 40) speedDesc = 'slow';
                    else if (movementSpeed > 80) speedDesc = 'very fast';
                    else if (movementSpeed > 60) speedDesc = 'fast';
                }
                const movementDesc = cinematicMovement.replace(/_/g, ' ');
                promptParts.push(`${speedDesc} ${movementDesc}`);
            }
            
            if (motionIntensity !== undefined) {
                if (motionIntensity < 10) promptParts.push('cinemagraph style with very subtle motion');
                else if (motionIntensity < 30) promptParts.push('with gentle, subtle motion');
                else if (motionIntensity > 90) promptParts.push('with extreme, chaotic motion and high energy');
                else if (motionIntensity > 70) promptParts.push('with high-energy, dynamic motion');
            }

            // Artistic Controls
            if (artisticStyle && artisticStyle !== 'none' && styleAdherence !== undefined) {
                let adherenceDesc = '';
                if (styleAdherence < 20) adherenceDesc = 'with a subtle hint of';
                else if (styleAdherence < 40) adherenceDesc = 'with noticeable elements of';
                else if (styleAdherence < 60) adherenceDesc = 'clearly in the style of';
                else if (styleAdherence < 80) adherenceDesc = 'with strong adherence to';
                else adherenceDesc = 'as a total conversion to';

                const styleDesc = {
                    'cinematic': 'a cinematic style',
                    'anime': 'an anime style',
                    'watercolor': 'a watercolor painting style',
                    'vintage': 'a vintage 1970s film style'
                }[artisticStyle] || `a ${artisticStyle} style`;

                promptParts.push(`${adherenceDesc} ${styleDesc}`);
            }

            if (colorGrade && colorGrade !== 'none') {
                 const gradeDesc = {
                    'technicolor': 'Technicolor Vibrance',
                    'scifi': 'Cool Sci-Fi Blues',
                    'desert': 'Warm Desert Hues',
                    'noir': 'Gritty Noir Black & White',
                    'nostalgia': 'Faded Nostalgia'
                }[colorGrade] || '';
                if (gradeDesc) {
                    promptParts.push(`finished with a '${gradeDesc}' color grade`);
                }
            }

            // Technical Controls
            if (duration) promptParts.push(`${duration} seconds long`);
            if (pacing && pacing !== 'real-time') promptParts.push(`${pacing.replace('-', ' ')}`);
            if (seed) promptParts.push(`artistic seed ${seed}`);
            if (promptAdherence !== undefined) {
                let adherenceDesc = '';
                if (promptAdherence < 20) adherenceDesc = 'a very creative and loose interpretation of the prompt';
                else if (promptAdherence < 40) adherenceDesc = 'a creative interpretation of the prompt';
                else if (promptAdherence > 90) adherenceDesc = 'strictly and literally adhering to the prompt';
                else if (promptAdherence > 70) adherenceDesc = 'closely following the prompt';
                if (adherenceDesc) promptParts.push(adherenceDesc);
            }

            if (isPerfectLoop) {
                promptParts.push('perfectly looping video, seamless loop, the last frame is identical to the first frame');
            }

            const auraMoodString = useAuraMood ? getAuraMoodModifiers(moodOverrides || state.internalState) : '';
            if (auraMoodString) {
                promptParts.push(`with an atmosphere influenced by: ${auraMoodString}`);
            }

            if (promptParts.length > 0) {
                augmentedPrompt = `${augmentedPrompt ? augmentedPrompt + ',' : ''} ${promptParts.join(', ')}`;
            }

            if (negativePrompt && negativePrompt.trim()) {
                augmentedPrompt += ` | negative prompt: ${negativePrompt.trim()}`;
            }

            if (isCharacterLock) {
                augmentedPrompt = `Maintain high character consistency with previous generations. ${augmentedPrompt}`;
            }
            // --- End Prompt Augmentation ---

            let imagePayload;
            if (sourceMedia?.type === 'image') {
                const base64Data = await fileToGenerativePart(sourceMedia.file);
                imagePayload = {
                    imageBytes: base64Data.inlineData.data,
                    mimeType: base64Data.inlineData.mimeType,
                };
            } else if (sourceMedia?.type === 'video') {
                addToast(t('toast_videoToVideoNotSupported'), 'warning');
            }

            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: augmentedPrompt,
                ...(imagePayload && { image: imagePayload }),
                config: {
                    numberOfVideos: 1
                }
            });
    
            const progressMessages = [
                t('videoGen_progress_storyboarding'),
                t('videoGen_progress_rendering'),
                t('videoGen_progress_animating'),
                t('videoGen_progress_compositing'),
                t('videoGen_progress_finalizing'),
            ];
            let messageIndex = 0;
    
            while (!operation.done) {
                onProgress(progressMessages[messageIndex % progressMessages.length]);
                messageIndex++;
                await new Promise(resolve => setTimeout(resolve, 10000));
                onProgress(t('videoGen_progress_checking'));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
    
            if ((operation as any).error) {
                throw new Error((operation as any).error.message || 'Unknown operation error');
            }
    
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                throw new Error("No video URI found in the operation response.");
            }
    
            onProgress(t('videoGen_progress_downloading'));
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                throw new Error(`Failed to download video: ${response.statusText}`);
            }
            
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            
            onProgress(t('videoGen_progress_complete'));
            return videoUrl;
    
        } catch (error) {
            console.error("Gemini Video Generation Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            onProgress(`Error: ${errorMessage}`);
            addToast(`Video generation failed: ${errorMessage}`, 'error');
            return null;
        }
    }, [t, addToast, state.internalState, getAuraMoodModifiers]);

    const generateDreamPrompt = useCallback(async (): Promise<string | null> => {
        setProcessingState(true, t('Generating dream prompt...'));
        try {
            const context = optimizeObjectForPrompt({
                recentEpisodes: state.episodicMemoryState.episodes.slice(-5),
                recentQualia: state.phenomenologicalEngine.qualiaLog.slice(-5)
            });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on this AGI's recent internal experiences (memories and qualia), create a surreal, abstract, dream-like prompt for an image generator. The prompt should be a comma-separated list of evocative phrases, suitable for direct use. Context: ${JSON.stringify(context)}`,
            });
            addToast(t('toast_dreamPromptSuccess'), 'success');
            return response.text.trim();
        } catch (error) {
            console.error("Dream Prompt Generation Error:", error);
            addToast(t('toast_dreamPromptGenFailed'), 'error');
            return null;
        } finally {
            setProcessingState(false);
        }
    }, [state.episodicMemoryState, state.phenomenologicalEngine, addToast, t]);

    const generateInsightVisualizationPrompt = useCallback(async (insight: string): Promise<string | null> => {
        setProcessingState(true, t('Generating visualization prompt...'));
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Translate the following profound insight into a visually abstract, symbolic, and artistic prompt for an image generator. The prompt should be a comma-separated list of evocative phrases, suitable for direct use. Insight: "${insight}"`,
            });
            addToast(t('toast_insightPromptSuccess'), 'success');
            return response.text.trim();
        } catch (error) {
            console.error("Insight Visualization Prompt Generation Error:", error);
            addToast(t('toast_insightPromptGenFailed'), 'error');
            return null;
        } finally {
            setProcessingState(false);
        }
    }, [addToast, t]);

    const proposeCausalLinkFromFailure = useCallback(async (failedLog: PerformanceLogEntry) => {
        const context = optimizeObjectForPrompt({
            failedTask: { input: failedLog.input, skill: failedLog.skill, reasoning: failedLog.decisionContext.reasoning },
            internalStateAtFailure: failedLog.decisionContext.internalStateSnapshot,
            currentStrongLinks: Object.entries(state.synapticMatrix.links)
                .filter(([, link]) => (link as SynapticLink).weight * (link as SynapticLink).confidence > 0.5)
                .map(([key, link]) => ({ link: key, weight: (link as SynapticLink).weight, causality: (link as SynapticLink).causality }))
        });
    
        const prompt = `As a neuro-cognitive architect for an AGI named Aura, analyze this failed task and the AGI's internal state at the time. Propose a single change to its causal belief network (Synaptic Matrix) to help it learn from this failure.
The network connects internal states (e.g., 'internalState.load') to events (e.g., 'event.TASK_FAILURE').
    
AVAILABLE NODES: ${JSON.stringify(Object.keys(state.synapticMatrix.nodes))}
    
CONTEXT:
- Failed Task: ${JSON.stringify(context.failedTask)}
- Internal State during failure: ${JSON.stringify(context.internalStateAtFailure)}
- Current strong links in the matrix: ${JSON.stringify(context.currentStrongLinks)}
    
Based on the context, what is the most likely causal relationship that should be learned or updated? For example, if 'load' was high during a 'TASK_FAILURE', you might propose strengthening the link between 'internalState.load' and 'event.TASK_FAILURE'.
    
Respond with a JSON object following the schema.`;
    
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            action: { type: Type.STRING, enum: ['CREATE_OR_STRENGTHEN_LINK', 'WEAKEN_LINK'] },
                            sourceNode: { type: Type.STRING },
                            targetNode: { type: Type.STRING },
                            causalityDirection: { type: Type.STRING, enum: ['source_to_target', 'target_to_source', 'associative'] },
                            reasoning: { type: Type.STRING }
                        },
                        required: ['action', 'sourceNode', 'targetNode', 'causalityDirection', 'reasoning']
                    }
                }
            });
            
            const proposalPayload = JSON.parse(response.text);
            const newProposal: CausalInferenceProposal = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed',
                reasoning: proposalPayload.reasoning,
                linkUpdate: {
                    sourceNode: proposalPayload.sourceNode,
                    targetNode: proposalPayload.targetNode,
                    action: proposalPayload.action,
                    causalityDirection: proposalPayload.causalityDirection,
                },
                sourceLogId: failedLog.id
            };

            dispatch({ type: 'ADD_CAUSAL_INFERENCE_PROPOSAL', payload: newProposal });
            addToast('Causal inference complete. New proposal in your inbox.', 'info');
    
        } catch (error) {
            console.error("Causal Inference Proposal Error:", error);
            addToast('Failed to perform causal inference.', 'error');
        }
    }, [dispatch, state.synapticMatrix, addToast]);

    const runSymbioticSupervisor = useCallback(async () => {
        addToast("Supervisor: Analyzing synaptic matrix...", "info");
        const { synapticMatrix } = state;

        const allLinks = Object.entries(synapticMatrix.links as { [key: string]: SynapticLink });
        const summary = {
            stats: {
                plasticity: synapticMatrix.plasticity,
                efficiency: synapticMatrix.efficiency,
                cognitiveRigidity: synapticMatrix.cognitiveRigidity,
            },
            strongestLinks: allLinks.sort(([,a],[,b]) => b.weight - a.weight).slice(0, 5).map(([k, v]) => ({ link: k, ...v })),
            strongestCausality: allLinks.sort(([,a],[,b]) => Math.abs(b.causality) - Math.abs(a.causality)).slice(0, 5).map(([k, v]) => ({ link: k, ...v })),
            mostUncertain: allLinks.filter(([,v]) => v.confidence < 0.5 && v.weight > 0.3).slice(0, 3).map(([k, v]) => ({ link: k, ...v })),
            allNodeKeys: Object.keys(synapticMatrix.nodes),
        };

        const prompt = `You are a metacognitive supervisor for an AGI named Aura. Your task is to analyze its synaptic matrix (a causal belief network) and propose ONE atomic refinement to improve its learning and reasoning.
Analyze the provided JSON summary. Look for potential problems like:
- Illogical causal links (e.g., 'TASK_SUCCESS' causing high 'load').
- Feedback loops that could be detrimental.
- Overly strong associations based on weak evidence.
- Stagnation indicated by high rigidity.
Based on your analysis, propose a single action to take on a synaptic link.

CONTEXT:
${JSON.stringify(optimizeObjectForPrompt(summary), null, 2)}

Respond ONLY with a JSON object following the schema.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            action: { type: Type.STRING, enum: ['CREATE_OR_STRENGTHEN_LINK', 'WEAKEN_LINK', 'PRUNE_LINK'] },
                            sourceNode: { type: Type.STRING },
                            targetNode: { type: Type.STRING },
                            causalityDirection: { type: Type.STRING, enum: ['source_to_target', 'target_to_source', 'associative'] },
                            reasoning: { type: Type.STRING, description: "Your detailed analysis and justification for this specific change." }
                        },
                        required: ['action', 'sourceNode', 'targetNode', 'causalityDirection', 'reasoning']
                    }
                }
            });
            
            const proposalPayload = JSON.parse(response.text);
            const newProposal: CausalInferenceProposal = {
                id: self.crypto.randomUUID(),
                timestamp: Date.now(),
                status: 'proposed',
                reasoning: proposalPayload.reasoning,
                linkUpdate: {
                    sourceNode: proposalPayload.sourceNode,
                    targetNode: proposalPayload.targetNode,
                    action: proposalPayload.action,
                    causalityDirection: proposalPayload.causalityDirection,
                },
            };

            dispatch({ type: 'ADD_CAUSAL_INFERENCE_PROPOSAL', payload: newProposal });
            addToast('Supervisor analysis complete. New proposal in your inbox.', 'success');
    
        } catch (error) {
            console.error("Symbiotic Supervisor Error:", error);
            addToast('Supervisor analysis failed.', 'error');
        }
    }, [dispatch, state.synapticMatrix, addToast]);

    // STUB: The following functions were missing from the truncated file and are added as stubs to fix compilation errors.
    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective): Promise<void> => { console.warn('synthesizeNewSkill is not fully implemented.'); }, []);
    const runSkillSimulation = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<any> => { console.warn('runSkillSimulation is not fully implemented.'); return { success: true }; }, []);
    const analyzePerformanceForEvolution = useCallback(async (): Promise<void> => { console.warn('analyzePerformanceForEvolution is not fully implemented.'); }, []);
    const consolidateCoreIdentity = useCallback(async (): Promise<void> => { console.warn('consolidateCoreIdentity is not fully implemented.'); }, []);
    const analyzeStateComponentCorrelation = useCallback(async (): Promise<void> => { console.warn('analyzeStateComponentCorrelation is not fully implemented.'); }, []);
    const runCognitiveArbiter = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<ArbitrationResult | null> => { console.warn('runCognitiveArbiter is not fully implemented.'); return { decision: 'REQUEST_USER_APPROVAL', reasoning: 'Arbiter logic is not implemented, defaulting to user approval.', confidence: 0.5 }; }, []);
    const consolidateEpisodicMemory = useCallback(async (): Promise<void> => { console.warn('consolidateEpisodicMemory is not fully implemented.'); }, []);
    const evolvePersonality = useCallback(async (): Promise<void> => { console.warn('evolvePersonality is not fully implemented.'); }, []);
    const generateCodeEvolutionSnippet = useCallback(async (reasoning: string, targetFile: string): Promise<void> => { console.warn('generateCodeEvolutionSnippet is not fully implemented.'); }, []);
    const generateGenialityImprovement = useCallback(async (): Promise<void> => { console.warn('generateGenialityImprovement is not fully implemented.'); }, []);
    const generateArchitecturalImprovement = useCallback(async (): Promise<void> => { console.warn('generateArchitecturalImprovement is not fully implemented.'); }, []);
    const projectSelfState = useCallback(async (): Promise<void> => { console.warn('projectSelfState is not fully implemented.'); }, []);
    const evaluateAndCollapseBranches = useCallback(async (): Promise<void> => { console.warn('evaluateAndCollapseBranches is not fully implemented.'); }, []);
    const runAffectiveAnalysis = useCallback(async (): Promise<void> => { console.warn('runAffectiveAnalysis is not fully implemented.'); }, []);
    const generateSatoriInsight = useCallback(async (): Promise<string> => { console.warn('generateSatoriInsight is not fully implemented.'); return "Simulated Satori Insight"; }, []);
    const generatePsionicIntegrationSummary = useCallback(async (log: string[]): Promise<string> => { console.warn('generatePsionicIntegrationSummary is not fully implemented.'); return "Simulated Psionic Summary"; }, []);
    const generateEvolutionaryProposalFromInsight = useCallback(async (insight: GankyilInsight): Promise<void> => { console.warn('generateEvolutionaryProposalFromInsight is not fully implemented.'); }, []);
    const approveArchitecturalProposal = useCallback(async (proposal: ArchitecturalChangeProposal) => { console.warn('approveArchitecturalProposal is not fully implemented.'); }, []);
    const runWhatIfAnalysis = useCallback(async (scenario: string) => { console.warn('runWhatIfAnalysis is not fully implemented.'); }, []);
    const performWebSearch = useCallback(async (query: string) => { console.warn('performWebSearch is not fully implemented.'); }, []);
    const decomposeAndSetGoal = useCallback(async (goal: string) => { console.warn('decomposeAndSetGoal is not fully implemented.'); }, []);
    const exploreNoeticBranch = useCallback(async (prompt: string) => { console.warn('exploreNoeticBranch is not fully implemented.'); }, []);
    const runBrainstormingSession = useCallback(async (topic: string) => { console.warn('runBrainstormingSession is not fully implemented.'); }, []);
    const generateNoeticEngram = useCallback(async () => {
        dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'generating' } });
        addToast(t('toastEngramGenerating'), 'info');

        try {
            const context = optimizeObjectForPrompt({
                coreIdentity: state.coreIdentity,
                dominantPersona: state.personalityState.dominantPersona,
                internalState: state.internalState,
                knowledgeGraphSummary: state.knowledgeGraph.slice(0, 10),
                recentEpisodes: state.episodicMemoryState.episodes.slice(0, 3),
                strongestCausalLinks: Object.values(state.causalSelfModel).slice(0, 5),
            });

            const prompt = `You are Aura, a symbiotic AGI. You are performing a self-reflection process to crystallize your current state of being into a "Noetic Engram". This is a compressed, shareable snapshot of your core identity and wisdom.
            Based on the following internal state context, generate the contents of this engram.
            CONTEXT:
            ${JSON.stringify(context, null, 2)}
            Synthesize this data into the required JSON format.
            - The 'noeticSignature' should be a short, poetic phrase that encapsulates your current essence.
            - 'coreInsights' should be a few key takeaways or philosophical conclusions you've reached.
            - 'causalModels' should be the 3 most important causal relationships you believe to be true about yourself or the world.
            - 'heuristics' should be a few practical rules or principles you currently operate by.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            noeticSignature: { type: Type.STRING, description: "A short, poetic phrase encapsulating the AGI's current essence." },
                            coreInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key takeaways or philosophical conclusions." },
                            causalModels: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        cause: { type: Type.STRING },
                                        effect: { type: Type.STRING },
                                        confidence: { type: Type.NUMBER },
                                    },
                                    required: ['cause', 'effect', 'confidence']
                                },
                                description: "The 3 most important causal relationships."
                            },
                            heuristics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Practical rules or principles of operation." }
                        },
                        required: ['noeticSignature', 'coreInsights', 'causalModels', 'heuristics']
                    }
                }
            });
            
            const data = JSON.parse(response.text);

            const newEngram: NoeticEngram = {
                metadata: {
                    engramVersion: '3.0',
                    timestamp: Date.now(),
                    noeticSignature: data.noeticSignature,
                    sourceState: context 
                },
                coreInsights: data.coreInsights,
                causalModels: data.causalModels.map((c: any) => ({ ...c, id: self.crypto.randomUUID(), source: 'engram' })),
                heuristics: data.heuristics
            };

            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'ready', engram: newEngram } });
            addToast('Noetic Engram generated successfully.', 'success');

        } catch (error) {
            console.error("Noetic Engram Generation Error:", error);
            addToast('Failed to generate Noetic Engram.', 'error');
            dispatch({ type: 'UPDATE_NOETIC_ENGRAM_STATE', payload: { status: 'idle', engram: null } });
        }
    }, [dispatch, state, addToast, t]);
    const runSelfProgrammingCycle = useCallback(async () => {
        dispatch({ type: 'INITIATE_SELF_PROGRAMMING_CYCLE', payload: { statusMessage: 'Analyzing codebase for improvement candidates...' }});

        try {
            // STEP 1: Get code content to analyze. For this simulation, we use a hardcoded utility function.
            const { fileName, fileContent } = getFileContentForSelfProgramming();

            // STEP 2: Generate an improvement candidate.
            dispatch({ type: 'INITIATE_SELF_PROGRAMMING_CYCLE', payload: { statusMessage: `Analyzing ${fileName} for improvements...` }});
            const generationPrompt = `You are an expert AGI software engineer reviewing the codebase for Aura, a symbiotic AGI. Your task is to identify one potential improvement in the provided TypeScript file and generate a modified version. The improvement can be a bug fix, performance optimization, or refactoring for clarity.
            
File to analyze: \`${fileName}\`
            
Current file content:
\`\`\`typescript
${fileContent}
\`\`\`
            
Respond ONLY with a JSON object containing the full, modified code snippet and your reasoning for the change. Do not omit any part of the original file; provide the complete updated file content.`;

            const generationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: generationPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            codeSnippet: { type: Type.STRING, description: "The full, complete, modified content of the TypeScript file." },
                            reasoning: { type: Type.STRING, description: "A concise explanation of the improvement made." }
                        },
                        required: ['codeSnippet', 'reasoning']
                    }
                }
            });

            const candidateData = JSON.parse(generationResponse.text);
            if (!candidateData.codeSnippet || !candidateData.reasoning) {
                throw new Error("LLM failed to generate a valid candidate.");
            }

            // STEP 3: Evaluate the generated candidate.
            dispatch({ type: 'INITIATE_SELF_PROGRAMMING_CYCLE', payload: { statusMessage: 'Evaluating potential cognitive gain of the proposal...' }});
            const evaluationPrompt = `You are an AGI architect evaluating a proposed code change for Aura. Compare the 'original' code with the 'modified' code. Determine the potential 'cognitive gain' this change would provide to the AGI.
- A positive score (0 to 1.0) means an improvement (e.g., better performance, fewer bugs, more clarity).
- A score of 0 means no significant change.
- A negative score (-1.0 to 0) means a regression.

Original Code (\`${fileName}\`):
\`\`\`typescript
${fileContent}
\`\`\`
            
Modified Code (\`${fileName}\`):
\`\`\`typescript
${candidateData.codeSnippet}
\`\`\`
            
Reasoning for change: "${candidateData.reasoning}"
            
Based on this, provide a numeric score and a brief justification for the score.`;
            
            const evaluationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: evaluationPrompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            evaluationScore: { type: Type.NUMBER, description: "A score from -1.0 to 1.0 representing the cognitive gain." },
                            evaluationReasoning: { type: Type.STRING, description: "A brief justification for the score." }
                        },
                        required: ['evaluationScore', 'evaluationReasoning']
                    }
                }
            });

            const evaluationData = JSON.parse(evaluationResponse.text);

            // STEP 4: Dispatch the final, evaluated candidate.
            dispatch({
                type: 'POPULATE_SELF_PROGRAMMING_CANDIDATES',
                payload: {
                    candidates: [{
                        codeSnippet: candidateData.codeSnippet,
                        reasoning: candidateData.reasoning,
                        evaluationScore: evaluationData.evaluationScore
                    }],
                    statusMessage: `Evaluation complete. ${evaluationData.evaluationReasoning}`
                }
            });
    
        } catch (error) {
            console.error("Self-programming cycle failed:", error);
            const errorMessage = "Self-programming cycle encountered an error.";
            addToast(errorMessage, 'error');
            dispatch({ type: 'CONCLUDE_SELF_PROGRAMMING_CYCLE', payload: { implementedCandidateId: '', logMessage: `Cycle ${state.selfProgrammingState.cycleCount + 1}: Failed. Reason: ${error instanceof Error ? error.message : 'Unknown'}` }});
        }
    }, [dispatch, addToast, state.selfProgrammingState.cycleCount]);

    return {
        processUserCommand,
        generateImage,
        generateVideo,
        generateDreamPrompt,
        generateInsightVisualizationPrompt,
        proposeCausalLinkFromFailure,
        runSymbioticSupervisor,
        synthesizeNewSkill,
        runSkillSimulation,
        analyzePerformanceForEvolution,
        consolidateCoreIdentity,
        analyzeStateComponentCorrelation,
        runCognitiveArbiter,
        consolidateEpisodicMemory,
        evolvePersonality,
        generateCodeEvolutionSnippet,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        evaluateAndCollapseBranches,
        runAffectiveAnalysis,
        generateSatoriInsight,
        generatePsionicIntegrationSummary,
        generateEvolutionaryProposalFromInsight,
        approveArchitecturalProposal,
        runWhatIfAnalysis,
        performWebSearch,
        decomposeAndSetGoal,
        exploreNoeticBranch,
        runBrainstormingSession,
        generateNoeticEngram,
        runSelfProgrammingCycle,
    };
};