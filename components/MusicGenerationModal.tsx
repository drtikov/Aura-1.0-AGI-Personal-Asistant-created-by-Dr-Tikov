import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useCoreState, useMemoryState } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion';

type GenerationMode = 'lyrics' | 'chords' | 'soundscape' | 'structure';

const abstractConcepts = ['solitude', 'epiphany', 'nostalgia', 'chaos'];

export const MusicGenerationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { addToast, handleSendCommand, generateSonicContent, generateMusicalDiceRoll } = useAuraDispatch();
    const { personalityState } = useCoreState();
    const { episodicMemoryState } = useMemoryState();
    
    const [mode, setMode] = useState<GenerationMode>('lyrics');
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('');
    const [mood, setMood] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOutput, setGeneratedOutput] = useState('');

    // --- New Feature States ---
    const [persona, setPersona] = useState<'aura' | 'zeno' | 'iris' | 'eris'>(personalityState.dominantPersona as any || 'aura');
    const [useAuraMood, setUseAuraMood] = useState(false);
    const [memoryContext, setMemoryContext] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [refinementPrompt, setRefinementPrompt] = useState('');


    useEffect(() => {
        if (!isOpen) {
            setPrompt('');
            setGenre('');
            setMood('');
            setGeneratedOutput('');
            setPersona(personalityState.dominantPersona as any || 'aura');
            setUseAuraMood(false);
            setMemoryContext('');
            setRefinementPrompt('');
        } else {
            // Set default persona when modal opens
            setPersona(personalityState.dominantPersona as any || 'aura');
        }
    }, [isOpen, personalityState.dominantPersona]);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            addToast(t('sonicForge_prompt_required'), 'warning');
            return;
        }
        setIsGenerating(true);
        setGeneratedOutput('');
        
        try {
            const output = await generateSonicContent(mode, prompt, genre, mood, persona, useAuraMood, memoryContext);
            if (output) {
                setGeneratedOutput(output);
            } else {
                throw new Error("Generation returned no data.");
            }
        } catch (error) {
            console.error("Music generation failed:", error);
            addToast(t('sonicForge_error'), 'error');
        } finally {
            setIsGenerating(false);
            setMemoryContext(''); // Clear memory context after use
        }
    };

    const handleRefine = async () => {
        if (!refinementPrompt.trim() || !generatedOutput) return;
        setIsRefining(true);
        try {
            // Simulate a conversation by feeding the previous output and the new instruction back to the model.
            // This is a simplified approach that doesn't require stateful chat objects.
            const refinementContextPrompt = `
The previous generation resulted in:
--- START PREVIOUS ---
${generatedOutput}
--- END PREVIOUS ---

Now, apply this refinement instruction: "${refinementPrompt}"

Generate ONLY the fully refined piece based on the instruction. Do not explain what you changed.
            `;
            const refinedOutput = await generateSonicContent(mode, refinementContextPrompt, genre, mood, persona, useAuraMood, memoryContext);
             if (refinedOutput) {
                setGeneratedOutput(refinedOutput); // Replace the output with the refined version
            }
        } catch (error) {
             console.error("Music refinement failed:", error);
            addToast(t('sonicForge_error'), 'error');
        } finally {
            setIsRefining(false);
            setRefinementPrompt('');
        }
    };

    const handleTranslateToTheme = async () => {
        if (mode !== 'soundscape' || !generatedOutput) return;
        setIsGenerating(true);
        try {
            const theme = await generateSonicContent('theme', generatedOutput, '', '', persona, useAuraMood, '');
            if (theme) {
                setGeneratedOutput(prev => `${prev}\n\n--- MUSICAL THEME ---\n${theme}`);
            }
        } catch (error) {
            console.error("Theme translation failed:", error);
            addToast(t('sonicForge_error'), 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInspireFromMemory = () => {
        const lastEpisode = episodicMemoryState.episodes[episodicMemoryState.episodes.length - 1];
        if (lastEpisode) {
            const context = `Inspired by the memory of "${lastEpisode.title}", where the key takeaway was "${lastEpisode.keyTakeaway}".`;
            setMemoryContext(context);
            addToast("Inspiration from Aura's last memory has been primed.", "success");
        } else {
            addToast("No episodic memories found to draw inspiration from.", "warning");
        }
    };
    
    const handleRollDice = async () => {
        const result = await generateMusicalDiceRoll();
        if (result) {
            setPrompt(`An interesting piece about a ${result.instrument}.`);
            setGenre(result.key);
            setMood(`${result.mood}, ${result.tempo}`);
            addToast("Musical dice rolled!", "success");
        }
    };

    const handleAbstractConcept = (concept: string) => {
        setPrompt(`An abstract piece about the feeling of ${concept}.`);
        setMood(concept);
        setGenre('Ambient');
    };

    const handleCopy = () => {
        if (!generatedOutput) return;
        navigator.clipboard.writeText(generatedOutput).then(() => {
            addToast(t('sonicForge_copied'), 'success');
        }, () => {
            addToast(t('sonicForge_copyFailed'), 'error');
        });
    };

    const handleUseInChat = () => {
        if (!generatedOutput) return;
        const chatCommand = `Here are the ${mode} I generated for "${prompt}":\n\n${generatedOutput}`;
        handleSendCommand(chatCommand);
        onClose();
    };
    
    const renderOutput = () => {
        if (mode === 'structure' && generatedOutput) {
            try {
                const data = JSON.parse(generatedOutput);
                return (
                    <div className="structure-output">
                        <h4>{t('sonicForge_structure_lyrics')}</h4>
                        <p>{data.lyrics.join('\n')}</p>
                        <h4>{t('sonicForge_structure_chords')}</h4>
                        <p>{data.chord_progression}</p>
                        <h4>{t('sonicForge_structure_rhythm')}</h4>
                        <p>{data.rhythmic_feel}</p>
                    </div>
                );
            } catch (e) {
                // If it's not valid JSON, just show the raw text.
                return <pre><code>{generatedOutput}</code></pre>;
            }
        }
        return <pre><code>{generatedOutput}</code></pre>;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('sonicForge')} className="music-generation-modal">
            <div className="sonic-forge-layout">
                <div className="sonic-forge-controls">
                    <div className="media-gen-mode-tabs">
                        <button className={`${mode === 'lyrics' ? 'active' : ''}`} onClick={() => setMode('lyrics')}>{t('sonicForge_mode_lyrics')}</button>
                        <button className={`${mode === 'chords' ? 'active' : ''}`} onClick={() => setMode('chords')}>{t('sonicForge_mode_chords')}</button>
                        <button className={`${mode === 'soundscape' ? 'active' : ''}`} onClick={() => setMode('soundscape')}>{t('sonicForge_mode_soundscape')}</button>
                        <button className={`${mode === 'structure' ? 'active' : ''}`} onClick={() => setMode('structure')}>{t('sonicForge_mode_structure')}</button>
                    </div>

                    <div className="image-gen-control-group">
                        <label htmlFor="sf-prompt">{t('sonicForge_prompt')}</label>
                        <textarea id="sf-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t(`sonicForge_prompt_placeholder_${mode}`)} disabled={isGenerating || isRefining} />
                    </div>

                    <div className="image-gen-control-group">
                        <label htmlFor="sf-genre">{t('sonicForge_genre')}</label>
                        <input type="text" id="sf-genre" value={genre} onChange={e => setGenre(e.target.value)} placeholder={t('sonicForge_genre_placeholder')} disabled={isGenerating || isRefining} />
                    </div>

                    <div className="image-gen-control-group">
                        <label htmlFor="sf-mood">{t('sonicForge_mood')}</label>
                        <input type="text" id="sf-mood" value={mood} onChange={e => setMood(e.target.value)} placeholder={t('sonicForge_mood_placeholder')} disabled={isGenerating || isRefining} />
                    </div>
                    
                     <Accordion title={t('sonicForge_creativeModifiers')}>
                        <div className="image-gen-control-group">
                            <label>{t('sonicForge_compositionPersona')}</label>
                            <div className="radio-button-group">
                                {(['aura', 'zeno', 'iris', 'eris'] as const).map(p => (
                                    <label key={p} className="radio-button-label">
                                        <input type="radio" name="persona" value={p} checked={persona === p} onChange={() => setPersona(p)} />
                                        <span className="radio-button-custom"></span>
                                        <span>{t(`sonicForge_persona_${p}`)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="image-gen-control-group toggle-group">
                            <label className="toggle-switch-label">{t('sonicForge_useAuraMood')}</label>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={useAuraMood} onChange={e => setUseAuraMood(e.target.checked)} />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </Accordion>
                    
                    <Accordion title={t('sonicForge_inspirationTools')}>
                         <div className="button-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <button className="control-button" onClick={handleInspireFromMemory}>{t('sonicForge_inspireFromMemory')}</button>
                            <button className="control-button" onClick={handleRollDice}>{t('sonicForge_rollTheDice')}</button>
                        </div>
                        <div className="image-gen-control-group" style={{marginTop: '1rem'}}>
                            <label>{t('sonicForge_abstractConcepts')}</label>
                            <div className="composition-buttons">
                                {abstractConcepts.map(concept => (
                                    <button key={concept} className="control-button" onClick={() => handleAbstractConcept(concept)}>{t(`sonicForge_concept_${concept}`)}</button>
                                ))}
                            </div>
                        </div>
                    </Accordion>
                    
                    <button className="image-generator-button" onClick={handleGenerate} disabled={isGenerating || isRefining}>
                        {isGenerating ? t('sonicForge_generating') : t('sonicForge_generate')}
                    </button>
                </div>
                <div className="sonic-forge-preview">
                    {(isGenerating || isRefining) && (
                        <div className="loading-overlay active">
                            <div className="spinner-small"></div>
                            <span>{isGenerating ? t(`sonicForge_generating_stage_${mode}`) : 'Refining...'}</span>
                        </div>
                    )}
                    {generatedOutput ? (
                        <div className="generated-music-output">
                             {renderOutput()}
                            <div className="image-item-actions">
                                <button onClick={handleCopy} title={t('sonicForge_copy')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                </button>
                                <button onClick={handleUseInChat} title={t('sonicForge_useInChat')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                                </button>
                                {mode === 'soundscape' && (
                                    <button onClick={handleTranslateToTheme} title={t('sonicForge_translateToTheme')} className="control-button" style={{width: 'auto', padding: '0 0.5rem'}}>Translate</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        !isGenerating && <p>{t('sonicForge_placeholder')}</p>
                    )}
                    {generatedOutput && !isGenerating && (
                         <form className="input-area" onSubmit={(e) => { e.preventDefault(); handleRefine(); }} style={{padding: '0.5rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem'}}>
                            <div className="input-area-content">
                                <textarea
                                    value={refinementPrompt}
                                    onChange={e => setRefinementPrompt(e.target.value)}
                                    placeholder={t('sonicForge_refinement_placeholder')}
                                    rows={2}
                                    disabled={isGenerating || isRefining}
                                />
                                <div className="input-controls">
                                    <button type="submit" disabled={isGenerating || isRefining || !refinementPrompt.trim()}>
                                        {isRefining ? t('sonicForge_refining', { defaultValue: 'Refining...' }) : t('sonicForge_refine')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    );
};