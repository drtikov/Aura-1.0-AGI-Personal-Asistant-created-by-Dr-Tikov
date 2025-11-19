// components/ListingGeneratorPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { HAL } from '../core/hal.ts';

export const ListingGeneratorPanel = () => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();

    const [features, setFeatures] = useState('renovated kitchen with quartz countertops, hardwood floors throughout, large fenced backyard, two-car garage');
    const [characteristics, setCharacteristics] = useState('Located on a quiet, tree-lined street. Perfect for a growing family. Close to parks and excellent schools.');
    const [tone, setTone] = useState<'Luxury' | 'Cozy' | 'Modern' | 'Family-Friendly'>('Family-Friendly');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setResult('');
        try {
            const prompt = `Generate a compelling real estate listing description.
            - Features: ${features}
            - Unique Characteristics: ${characteristics}
            - Tone: ${tone}`;

            const response = await geminiAPI.generateChatResponse(
                // FIX: Added missing id and timestamp to satisfy HistoryEntry type.
                [{ from: 'user', text: prompt, id: 'temp-id', timestamp: Date.now() }],
                'collaborative_scaffolding',
                null
            );
            
            let fullText = '';
            for await (const chunk of response) {
                fullText += chunk.text;
            }

            setResult(fullText);

        } catch (e) {
            console.error(e);
            addToast(`Failed to generate listing: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!result) return;
        HAL.Clipboard.writeText(result)
            .then(() => addToast(t('listingGenerator_copy_success'), 'success'))
            .catch(() => addToast(t('listingGenerator_copy_fail'), 'error'));
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('listingGenerator_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="listing-features">{t('listingGenerator_features')}</label>
                <textarea id="listing-features" value={features} onChange={e => setFeatures(e.target.value)} rows={3} placeholder={t('listingGenerator_features_placeholder')} disabled={isLoading} />
            </div>
             <div className="image-gen-control-group">
                <label htmlFor="listing-chars">{t('listingGenerator_characteristics')}</label>
                <textarea id="listing-chars" value={characteristics} onChange={e => setCharacteristics(e.target.value)} rows={3} placeholder={t('listingGenerator_characteristics_placeholder')} disabled={isLoading} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="listing-tone">{t('listingGenerator_tone')}</label>
                <select id="listing-tone" value={tone} onChange={e => setTone(e.target.value as any)} disabled={isLoading}>
                    <option value="Luxury">{t('listingGenerator_tone_luxury')}</option>
                    <option value="Cozy">{t('listingGenerator_tone_cozy')}</option>
                    <option value="Modern">{t('listingGenerator_tone_modern')}</option>
                    <option value="Family-Friendly">{t('listingGenerator_tone_family')}</option>
                </select>
            </div>
            <button className="control-button" onClick={handleGenerate} disabled={isLoading} style={{ marginTop: '1rem', width: '100%' }}>
                {isLoading ? t('listingGenerator_generating') : t('listingGenerator_generate_button')}
            </button>
            
            {result && (
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="image-gen-control-group">
                        <textarea value={result} readOnly rows={10} />
                    </div>
                     <button className="control-button" onClick={handleCopy} style={{ marginTop: '0.5rem', width: '100%' }}>
                        {t('listingGenerator_copy_button')}
                    </button>
                </div>
            )}
        </div>
    );
};