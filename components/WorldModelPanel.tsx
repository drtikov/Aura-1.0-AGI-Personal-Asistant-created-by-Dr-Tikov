import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { Sparkline } from './Sparkline';

export const WorldModelPanel = React.memo(() => {
    const { worldModelState: state } = useCoreState();
    const { t } = useLocalization();

    const errorHistoryData = state.predictionErrorHistory.map(e => e.magnitude).reverse();

    return (
        <div className="side-panel world-model-panel">
            <div className="panel-subsection-title">{t('worldModel_predictionError')}</div>
            <div className="state-item">
                <label>{t('worldModel_lastErrorMagnitude')}</label>
                <div className="state-bar-container">
                    <div className="state-bar prediction-error-bar" style={{ width: `${state.predictionError.magnitude * 100}%` }}></div>
                </div>
            </div>
            {state.predictionError.magnitude > 0.01 && (
                 <div className="prediction-error-details">
                    <p><strong>{t('worldModel_errorSource')}:</strong> {state.predictionError.source.replace(/_/g, ' ')}</p>
                    <p><strong>{t('worldModel_predicted')}:</strong> <em>"{state.predictionError.failedPrediction}"</em></p>
                    <p><strong>{t('worldModel_actual')}:</strong> <em>"{state.predictionError.actualOutcome}"</em></p>
                </div>
            )}
             <div className="sentiment-sparkline-container" style={{ marginTop: '0.75rem' }}>
                <Sparkline data={errorHistoryData} strokeColor="var(--failure-color)" height={35} />
            </div>


            <div className="panel-subsection-title">{t('worldModel_hierarchicalPredictions')}</div>
            
            <div className="prediction-item level-high">
                <div className="prediction-header">
                    <span>{t('worldModel_highLevel')}</span>
                    <span>{t('causalSelfModel_confidence')}: {(state.highLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.highLevelPrediction.content}
                </p>
            </div>

            <div className="prediction-item level-mid">
                <div className="prediction-header">
                    <span>{t('worldModel_midLevel')}</span>
                     <span>{t('causalSelfModel_confidence')}: {(state.midLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.midLevelPrediction.content}
                </p>
            </div>

             <div className="prediction-item level-low">
                <div className="prediction-header">
                    <span>{t('worldModel_lowLevel')}</span>
                     <span>{t('causalSelfModel_confidence')}: {(state.lowLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.lowLevelPrediction.content}
                </p>
            </div>
        </div>
    );
});