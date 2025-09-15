import React from 'react';
import { AgentProfile } from '../types';
import { Sparkline } from './Sparkline';

export const OtherAwarenessPanel = React.memo(({ model }: { model: AgentProfile }) => (
    <div className="side-panel other-awareness-panel">
        <div className="other-awareness-content">
            <div className="awareness-item">
                <label>Predicted Affective State</label>
                <strong className={`affective-state-${model.predictedAffectiveState.toLowerCase()}`}>
                    {model.predictedAffectiveState}
                    {model.affectiveStateSource === 'visual' && ' (👁️)'}
                    {model.affectiveStateSource === 'text' && ' (✍️)'}
                </strong>
            </div>
             <div className="awareness-item">
                <label>Sentiment Score</label>
                <div className="sentiment-score-container">
                    <div className="sentiment-score-bar" style={{'--sentiment-score': model.sentimentScore} as React.CSSProperties}>
                        <span>{model.sentimentScore.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="awareness-item">
                <label>Inferred Intent</label>
                <strong title={model.inferredIntent || 'None'}>{(model.inferredIntent || 'N/A').substring(0, 25)}{model.inferredIntent && model.inferredIntent.length > 25 ? '...' : ''}</strong>
            </div>
            <div className="state-item">
                <label>Trust Level</label>
                <div className="state-bar-container">
                    <div className="state-bar trust-bar" style={{ width: `${model.trustLevel * 100}%` }}></div>
                </div>
            </div>
            <div className="state-item">
                <label>Estimated Knowledge State</label>
                <div className="state-bar-container">
                    <div className="state-bar knowledge-bar" style={{ width: `${model.estimatedKnowledgeState * 100}%` }}></div>
                </div>
            </div>
            <div className="panel-subsection-title">Sentiment History</div>
            <div className="sentiment-sparkline-container">
                <Sparkline data={model.sentimentHistory || []} strokeColor="var(--primary-color)" height={35} />
            </div>
            <div className="panel-subsection-title">Inferred Beliefs</div>
            {model.inferredBeliefs.length > 0 ? <ul> {model.inferredBeliefs.map((belief, i) => <li key={i}>{belief}</li>)} </ul> : <div className="kg-placeholder">No specific beliefs inferred yet.</div>}
        </div>
    </div>
));