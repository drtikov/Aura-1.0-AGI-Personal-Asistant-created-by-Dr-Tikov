// components/VisualAnalysisFeed.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

interface VisualAnalysisFeedProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isAnalysisActive: boolean;
}

export const VisualAnalysisFeed = ({ videoRef, isAnalysisActive }: VisualAnalysisFeedProps) => {
    const { t } = useLocalization();
    if (!isAnalysisActive) {
        return null;
    }

    return (
        <div className="visual-analysis-feed">
            <video ref={videoRef} autoPlay playsInline muted />
            <p>{t('visualAnalysis_active')}</p>
        </div>
    );
};