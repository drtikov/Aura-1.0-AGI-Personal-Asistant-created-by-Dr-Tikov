// components/MarketAnalyzerPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Type } from '@google/genai';

interface MarketData {
    medianSalePrice: string;
    averageDaysOnMarket: string;
    pricePerSquareFoot: string;
    marketStatus: string;
    oneYearPriceChange: string;
}

export const MarketAnalyzerPanel = () => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    
    const [location, setLocation] = useState('Austin, TX');
    const [propertyType, setPropertyType] = useState('single-family home');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<MarketData | null>(null);

    const handleAnalyze = async () => {
        if (!location.trim() || !propertyType.trim()) {
            addToast('Please provide both a location and a property type.', 'warning');
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            // We use performWebSearch via the Gemini API, which is part of the tool execution logic.
            // The prompt guides the AI to find specific information.
            const prompt = `Provide the latest real estate market data for ${propertyType}s in ${location}. I need the following specific metrics: median sale price, average days on market, price per square foot, market status (e.g., Seller's Market), and one-year price change percentage.`;
            
            const response = await geminiAPI.performWebSearch(prompt);
            
            // Now, we need to parse the natural language response into structured data.
            // We can ask another LLM call to do this reliably.
            const structuredDataResponse = await geminiAPI.generateChatResponse(
                [{ from: 'user', text: `Extract the following data points from the text below into a JSON object: medianSalePrice, averageDaysOnMarket, pricePerSquareFoot, marketStatus, oneYearPriceChange.\n\nText: "${response.summary}"` }],
                'collaborative_scaffolding', // strategy
                null // mode
            );

            let fullText = '';
            for await (const chunk of structuredDataResponse) {
                fullText += chunk.text;
            }
            
            const jsonText = fullText.replace(/```json\n?/, '').replace(/```/, '');
            setResult(JSON.parse(jsonText));

        } catch (e) {
            console.error(e);
            addToast(`Failed to analyze market data: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('marketAnalyzer_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="market-location">{t('marketAnalyzer_location')}</label>
                <input id="market-location" type="text" value={location} onChange={e => setLocation(e.target.value)} disabled={isLoading} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="market-prop-type">{t('marketAnalyzer_propertyType')}</label>
                <input id="market-prop-type" type="text" value={propertyType} onChange={e => setPropertyType(e.target.value)} placeholder={t('marketAnalyzer_propertyType_placeholder')} disabled={isLoading} />
            </div>
            <button className="control-button" onClick={handleAnalyze} disabled={isLoading} style={{ marginTop: '1rem', width: '100%' }}>
                {isLoading ? t('marketAnalyzer_analyzing') : t('marketAnalyzer_analyze_button')}
            </button>

            {result && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h4 className="panel-subsection-title">{t('marketAnalyzer_result_title', { location })}</h4>
                    <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '0.5rem 1rem' }}>
                        <div className="metric-item">
                            <span className="metric-label">Median Sale Price</span>
                            <span className="metric-value">{result.medianSalePrice}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Avg. Days on Market</span>
                            <span className="metric-value">{result.averageDaysOnMarket}</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">Price / Sq. Ft.</span>
                            <span className="metric-value">{result.pricePerSquareFoot}</span>
                        </div>
                         <div className="metric-item">
                            <span className="metric-label">1-Year Change</span>
                            <span className="metric-value">{result.oneYearPriceChange}</span>
                        </div>
                        <div className="metric-item" style={{gridColumn: '1 / -1'}}>
                            <span className="metric-label">Market Status</span>
                            <span className="metric-value">{result.marketStatus}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};