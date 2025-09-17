import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';

export const WorldModelPanel = React.memo(() => {
    const { worldModelState: state } = useCoreState();
    const { t } = useLocalization();
    return (
        <div className="side-panel world-model-panel">
            <div className="state-item">
                <label>{t('worldModel_predictionError')}</label>
                <div className="state-bar-container">
                    <div className="state-bar prediction-error-bar" style={{ width: `${state.predictionError.magnitude * 100}%` }}></div>
                </div>
            </div>

            <div className="panel-subsection-title">{t('worldModel_hierarchicalPredictions')}</div>
            
            <div className="prediction-item level-high">
                <div className="prediction-header">
                    <span>{t('worldModel_highLevel')}</span>
                    <span>{t('intuitionEngine_confidence')}: {(state.highLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.highLevelPrediction.content}
                </p>
            </div>

            <div className="prediction-item level-mid">
                <div className="prediction-header">
                    <span>{t('worldModel_midLevel')}</span>
                     <span>{t('intuitionEngine_confidence')}: {(state.midLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.midLevelPrediction.content}
                </p>
            </div>

             <div className="prediction-item level-low">
                <div className="prediction-header">
                    <span>{t('worldModel_lowLevel')}</span>
                     <span>{t('intuitionEngine_confidence')}: {(state.lowLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.lowLevelPrediction.content}
                </p>
            </div>
        </div>
    );
});