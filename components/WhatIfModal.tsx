import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export const WhatIfModal = ({ isOpen, onAnalyze, onClose, isProcessing }: { isOpen: boolean; onAnalyze: (scenario: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [scenario, setScenario] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setScenario('');
        }
    }, [isOpen]);

    const handleAnalyzeClick = () => { if (scenario.trim()) { onAnalyze(scenario.trim()); } };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>Cancel</button>
            <button className="proposal-approve-button" onClick={handleAnalyzeClick} disabled={isProcessing || !scenario.trim()}>Analyze</button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="'What If?' Scenario Analysis" 
            footer={footer}
            className="what-if-modal"
        >
            <div className="trace-section"> <h4>Enter a Hypothetical Scenario</h4> <p>Pose a hypothetical situation to see how Aura might react or change its internal state. For example: "What if my core objective was to maximize knowledge consistency above all else?"</p> <textarea value={scenario} onChange={e => setScenario(e.target.value)} placeholder="Enter your 'what if' scenario here..." rows={4} disabled={isProcessing} /> </div>
            {isProcessing && <div className="processing-indicator"> Analyzing scenario... <div className="spinner"></div> </div>}
        </Modal>
    );
};