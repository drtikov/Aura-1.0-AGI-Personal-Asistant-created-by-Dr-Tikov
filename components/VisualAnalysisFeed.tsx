import React from 'react';

interface VisualAnalysisFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isAnalysisActive: boolean;
}

export const VisualAnalysisFeed = ({ videoRef, isAnalysisActive }: VisualAnalysisFeedProps) => {
    if (!isAnalysisActive) {
        return null;
    }

    return (
        <div className="visual-analysis-feed">
            <video ref={videoRef} autoPlay playsInline muted />
            <p>Visual Sensor Active</p>
        </div>
    );
};
