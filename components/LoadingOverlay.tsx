

import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
    isActive: boolean;
    text: string;
}

const thinkingStages = [
    "[Accessing Knowledge Graph]",
    "[Cross-Referencing Memories]",
    "[Hypothesizing...]",
    "[Simulating Outcomes]",
    "[Ethical Governor Check]",
    "[Formatting Output]",
    "[Refining Logic]",
    "[Consulting World Model]",
    "[Running Intuition Check]",
];

const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const LoadingOverlay = ({ isActive, text }: LoadingOverlayProps) => {
    const [currentStage, setCurrentStage] = useState(thinkingStages[0]);
    const [shuffledStages] = useState(() => shuffleArray([...thinkingStages]));

    useEffect(() => {
        if (isActive && !['Drafting...', 'Refining...', 'Synthesizing...'].includes(text)) {
            let stageIndex = 0;
            const interval = setInterval(() => {
                stageIndex = (stageIndex + 1) % shuffledStages.length;
                setCurrentStage(shuffledStages[stageIndex]);
            }, 300); // Change stage every 300ms for a dynamic effect
            return () => clearInterval(interval);
        }
    }, [isActive, text, shuffledStages]);
    
    // Determine the title and stage based on the `text` prop
    let title = text || 'COGNITIVE FLOW ACTIVE';
    let stage = currentStage;

    if (text === 'Drafting...') {
        title = 'COGNITIVE FLOW';
        stage = '[Intuitive Spark]';
    } else if (text === 'Refining...') {
        title = 'COGNITIVE FLOW';
        stage = '[Logical Structuring]';
    } else if (text === 'Synthesizing...') {
        title = 'COGNITIVE FLOW';
        stage = '[Synthesizing Flow]';
    }
    
    return (
        <div className={`loading-overlay ${isActive ? 'active' : ''}`}>
            <div className="cognitive-flow-container">
                <span className="cognitive-flow-title">{title}</span>
                <div className="spinner-small"></div>
            </div>
            <span className="cognitive-flow-stage">{stage}</span>
        </div>
    );
};