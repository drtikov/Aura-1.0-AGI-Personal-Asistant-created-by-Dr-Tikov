import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const SymbiosisPanel = React.memo(() => {
    const { symbioticState: state } = useCoreState();

    return (
        <div className="side-panel symbiosis-panel">
            <div className="awareness-item">
                <label>Inferred Cognitive Style</label>
                <strong>{state.inferredCognitiveStyle}</strong>
            </div>
             <div className="awareness-item">
                <label>Inferred Emotional Needs</label>
                <strong>{state.inferredEmotionalNeeds.join(', ') || 'N/A'}</strong>
            </div>

            <div className="panel-subsection-title">Inferred Latent Goals</div>
            {state.latentUserGoals.length === 0 ? (
                <div className="kg-placeholder">No latent user goals have been inferred yet. This model builds over longer conversations.</div>
            ) : (
                state.latentUserGoals.map((goal, index) => (
                    <div key={index} className="prediction-item" style={{ borderLeftColor: 'var(--guna-dharma)' }}>
                        <div className="prediction-header">
                            <span>Goal Hypothesis</span>
                            <span>Conf: {(goal.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <p className="prediction-content">{goal.goal}</p>
                    </div>
                ))
            )}
            
            <div className="panel-subsection-title">Co-Created Workflows</div>
             {state.coCreatedWorkflows.length === 0 ? (
                <div className="kg-placeholder">No workflows co-created yet. Aura may propose them based on repeated interaction patterns.</div>
            ) : (
                state.coCreatedWorkflows.map((flow) => (
                    <div key={flow.id} className="suggestion-item" style={{ background: 'rgba(85, 107, 47, 0.05)' }}>
                        <p className="suggestion-text"><strong>{flow.name}</strong></p>
                        <p className="suggestion-footer" style={{ justifyContent: 'start', fontStyle: 'italic', fontSize: '0.8rem' }}>
                           {flow.pattern}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
});