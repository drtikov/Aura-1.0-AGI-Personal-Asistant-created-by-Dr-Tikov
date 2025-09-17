import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const WorldModelPanel = React.memo(() => {
    const { worldModelState: state } = useCoreState();
    return (
        <div className="side-panel world-model-panel">
            <div className="state-item">
                <label>Prediction Error</label>
                <div className="state-bar-container">
                    <div className="state-bar prediction-error-bar" style={{ width: `${state.predictionError.magnitude * 100}%` }}></div>
                </div>
            </div>

            <div className="panel-subsection-title">Hierarchical Predictions</div>
            
            <div className="prediction-item level-high">
                <div className="prediction-header">
                    <span>High-Level (Goals/Beliefs)</span>
                    <span>Conf: {(state.highLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.highLevelPrediction.content}
                </p>
            </div>

            <div className="prediction-item level-mid">
                <div className="prediction-header">
                    <span>Mid-Level (Intent/Topic)</span>
                     <span>Conf: {(state.midLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.midLevelPrediction.content}
                </p>
            </div>

             <div className="prediction-item level-low">
                <div className="prediction-header">
                    <span>Low-Level (Syntax/Semantics)</span>
                     <span>Conf: {(state.lowLevelPrediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="prediction-content">
                    {state.lowLevelPrediction.content}
                </p>
            </div>
        </div>
    );
});