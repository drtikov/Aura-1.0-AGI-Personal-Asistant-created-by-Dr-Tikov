
import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
    isActive: boolean;
    text: string;
}

const thinkingStages = [
    "[Initializing Query]",
    "[Accessing Knowledge Graph]",
    "[Cross-Referencing Memories]",
    "[Hypothesizing...]",
    "[Simulating Outcomes]",
    "[Ethical Governor Check]",
    "[Synthesizing Response]",
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
        if (isActive) {
            let stageIndex = 0;
            const interval = setInterval(() => {
                stageIndex = (stageIndex + 1) % shuffledStages.length;
                setCurrentStage(shuffledStages[stageIndex]);
            }, 300); // Change stage every 300ms for a dynamic effect
            return () => clearInterval(interval);
        }
    }, [isActive, shuffledStages]);
    
    return (
        <div className={`loading-overlay ${isActive ? 'active' : ''}`}>
            <div className="cognitive-flow-container">
                <span className="cognitive-flow-title">{text || 'COGNITIVE FLOW ACTIVE'}</span>
                <div className="spinner-small"></div>
            </div>
            <span className="cognitive-flow-stage">{currentStage}</span>
        </div>
    );
};