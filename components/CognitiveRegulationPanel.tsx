// components/CognitiveRegulationPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const CognitiveRegulationPanel = React.memo(() => {
    const { internalState, userModel, cognitiveStrategy } = useCoreState();
    const { t } = useLocalization();

    const strategyText = cognitiveStrategy === 'full_guidance' 
        ? t('strategy_full_guidance') 
        : t('strategy_collaborative_scaffolding');
    
    const taskDifficulty = internalState.lastTaskDifficulty;
    const userCompetence = userModel.perceivedCompetence;

    return (
        <div className="side-panel">
            <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {t('cognitiveRegulation_desc')}
            </p>

            <div className="awareness-item">
                <label>{t('cognitiveStrategy')}</label>
                <strong>{strategyText}</strong>
            </div>

            <div className="panel-subsection-title">{t('modulator_inputs')}</div>
            <div className="state-item">
                <label title="Aura's assessment of the complexity of the last user request (0 to 1).">
                    {t('lastTaskDifficulty')}
                </label>
                <div className="state-bar-container">
                    <div 
                        className="state-bar" 
                        style={{ 
                            width: `${taskDifficulty * 100}%`,
                            backgroundColor: 'var(--resource-cpu)' 
                        }} 
                    />
                </div>
                 <span>{taskDifficulty.toFixed(2)}</span>
            </div>
            <div className="state-item">
                <label title="Aura's model of your success rate and confidence with the system (0 to 1).">
                    {t('userCompetence')}
                </label>
                <div className="state-bar-container">
                    <div 
                        className="state-bar" 
                        style={{ 
                            width: `${userCompetence * 100}%`,
                            backgroundColor: 'var(--state-mastery)'
                        }} 
                    />
                </div>
                <span>{(userCompetence * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
});