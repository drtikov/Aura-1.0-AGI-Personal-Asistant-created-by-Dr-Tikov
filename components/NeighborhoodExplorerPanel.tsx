// components/NeighborhoodExplorerPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader.ts';

declare const L: any;

interface NeighborhoodData {
    schoolRating: string;
    crimeIndex: string;
    walkabilityScore: number;
    nearbyAmenities: string[];
}

export const NeighborhoodExplorerPanel = () => {
    const { t } = useLocalization();
    const { geminiAPI, addToast } = useAuraDispatch();
    
    const [location, setLocation] = useState('1600 Amphitheatre Parkway, Mountain View, CA');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<NeighborhoodData | null>(null);
    const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    const handleSearch = async () => {
        if (!location.trim()) {
            addToast('Please enter an address or neighborhood.', 'warning');
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const response = await geminiAPI.generateChatResponse(
                [{ from: 'user', text: `Provide hyperlocal data for the address: ${location}. I need school ratings (e.g., 8/10), a general crime index (e.g., Low, Moderate, High), a walkability score (0-100), and a short list of 3-5 nearby amenities (e.g., "City Park", "Main St. Cafe").`}],
                'collaborative_scaffolding', null
            );
            
            let fullText = '';
            for await (const chunk of response) {
                fullText += chunk.text;
            }

            // Extract to JSON
             const jsonResponse = await geminiAPI.generateChatResponse(
                [{ from: 'user', text: `Extract the following data points from the text below into a JSON object: schoolRating, crimeIndex, walkabilityScore (as a number), nearbyAmenities (as an array of strings).\n\nText: "${fullText}"` }],
                'collaborative_scaffolding', null
            );

            let jsonFullText = '';
            for await (const chunk of jsonResponse) {
                jsonFullText += chunk.text;
            }
            
            const jsonText = jsonFullText.replace(/```json\n?/, '').replace(/```/, '');
            setResult(JSON.parse(jsonText));

        } catch (e) {
            console.error(e);
            addToast(`Failed to fetch neighborhood data: ${(e as Error).message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Init map
    useEffect(() => {
        const initMap = async () => {
            if (mapRef.current && !mapInstance.current && typeof L !== 'undefined') {
                 mapInstance.current = L.map(mapRef.current).setView([37.422, -122.084], 13); // Default to Googleplex
                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance.current);
            }
        };
        
        loadSdk('leaflet').then(initMap);
    }, []);
    
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserCoords({ lat: latitude, lng: longitude });
                    setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                    if(mapInstance.current) {
                        mapInstance.current.setView([latitude, longitude], 15);
                        L.marker([latitude, longitude]).addTo(mapInstance.current);
                    }
                    addToast('Location updated.', 'success');
                },
                () => {
                    addToast('Unable to retrieve your location.', 'error');
                }
            );
        } else {
            addToast('Geolocation is not supported by your browser.', 'error');
        }
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('neighborhoodExplorer_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="neighborhood-location">{t('neighborhoodExplorer_location')}</label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input id="neighborhood-location" type="text" value={location} onChange={e => setLocation(e.target.value)} disabled={isLoading} style={{flexGrow: 1}} />
                    <button onClick={handleGetLocation} className="control-button" style={{width: 'auto', padding: '0 0.5rem'}} title="Use my current location">📍</button>
                </div>
            </div>
            <button className="control-button" onClick={handleSearch} disabled={isLoading} style={{ marginTop: '1rem', width: '100%' }}>
                {isLoading ? t('neighborhoodExplorer_searching') : t('neighborhoodExplorer_search_button')}
            </button>
            
             <div ref={mapRef} style={{height: '200px', width: '100%', border: '1px solid var(--border-color)', marginTop: '1.5rem'}}></div>

            {result && (
                <div style={{ marginTop: '1.5rem' }}>
                    <h4 className="panel-subsection-title">{t('neighborhoodExplorer_results_title', { location })}</h4>
                    <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '0.5rem 1rem' }}>
                        <div className="metric-item">
                            <span className="metric-label">School Rating</span>
                            <span className="metric-value">{result.schoolRating}</span>
                        </div>
                         <div className="metric-item">
                            <span className="metric-label">Crime Index</span>
                            <span className="metric-value">{result.crimeIndex}</span>
                        </div>
                         <div className="metric-item">
                            <span className="metric-label">Walkability</span>
                            <span className="metric-value">{result.walkabilityScore} / 100</span>
                        </div>
                    </div>
                     <div className="panel-subsection-title" style={{marginTop: '1rem'}}>Nearby Amenities</div>
                     <ul style={{listStyle: 'disc', paddingLeft: '1rem', fontSize: '0.85rem'}}>
                         {result.nearbyAmenities.map((item, index) => <li key={index}>{item}</li>)}
                     </ul>
                </div>
            )}
        </div>
    );
};