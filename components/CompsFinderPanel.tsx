// components/CompsFinderPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Type } from '@google/genai';

interface Comp {
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    salePrice: string;
    saleDate: string;
}

export const CompsFinderPanel = () => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    
    const [address, setAddress] = useState('123 Main St, Anytown, USA');
    const [beds, setBeds] = useState(3);
    const [baths, setBaths] = useState(2);
    const [sqft, setSqft] = useState(1800);
    const [radius, setRadius] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Comp[] | null>(null);

    const handleFind = async () => {
        setIsLoading(true);
        setResults(null);
        try {
            const prompt = `Simulate finding 3 comparable sold properties (comps) for a subject property. The subject property is a ${beds}-bed, ${baths}-bath, ${sqft} sqft house at ${address}. Find comps within a ${radius}-mile radius that have sold in the last 6 months. For each comp, provide a plausible random address, beds, baths, sqft, sale price, and sale date.`;
            
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

            // Now, parse this text into structured JSON
            const jsonResponse = await geminiAPI.generateChatResponse(
                // FIX: Added missing id and timestamp to satisfy HistoryEntry type.
                [{ from: 'user', text: `Extract the comparable properties from the following text into a JSON array. Each object should have these keys: address, beds, baths, sqft, salePrice, saleDate.\n\nText: "${fullText}"`, id: 'temp-id-2', timestamp: Date.now() }],
                'collaborative_scaffolding',
                null
            );

            let jsonFullText = '';
            for await (const chunk of jsonResponse) {
                jsonFullText += chunk.text;
            }
            
            const jsonText = jsonFullText.replace(/```json\n?/, '').replace(/```/, '');
            setResults(JSON.parse(jsonText));

        } catch (e) {
            console.error(e);
            addToast(`Failed to find comps: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('compsFinder_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="comps-address">{t('compsFinder_address')}</label>
                <input id="comps-address" type="text" value={address} onChange={e => setAddress(e.target.value)} disabled={isLoading} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="image-gen-control-group">
                    <label htmlFor="comps-beds">{t('compsFinder_beds')}</label>
                    <input id="comps-beds" type="number" value={beds} onChange={e => setBeds(Number(e.target.value))} disabled={isLoading} />
                </div>
                <div className="image-gen-control-group">
                    <label htmlFor="comps-baths">{t('compsFinder_baths')}</label>
                    <input id="comps-baths" type="number" value={baths} onChange={e => setBaths(Number(e.target.value))} disabled={isLoading} />
                </div>
                 <div className="image-gen-control-group">
                    <label htmlFor="comps-sqft">{t('compsFinder_sqft')}</label>
                    <input id="comps-sqft" type="number" value={sqft} onChange={e => setSqft(Number(e.target.value))} disabled={isLoading} />
                </div>
                 <div className="image-gen-control-group">
                    <label htmlFor="comps-radius">{t('compsFinder_radius')}</label>
                    <input id="comps-radius" type="number" value={radius} onChange={e => setRadius(Number(e.target.value))} disabled={isLoading} />
                </div>
            </div>
            <button className="control-button" onClick={handleFind} disabled={isLoading} style={{ marginTop: '1rem', width: '100%' }}>
                {isLoading ? t('compsFinder_finding') : t('compsFinder_find_button')}
            </button>

            {results && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h4 className="panel-subsection-title">{t('compsFinder_result_title', { address })}</h4>
                    {results.map((comp, index) => (
                        <div key={index} className="proposal-card" style={{ marginBottom: '1rem' }}>
                            <div className="proposal-card-header">
                                <span className="proposal-type-badge" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background)' }}>
                                    {comp.salePrice}
                                </span>
                                <span>Sold: {comp.saleDate}</span>
                            </div>
                            <div className="proposal-card-body">
                                <p><strong>{comp.address}</strong></p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {comp.beds} beds | {comp.baths} baths | {comp.sqft.toLocaleString()} sqft
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};