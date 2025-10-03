// components/ReinforcementLearningPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { SynthesizedSkill } from '../types';

export const ReinforcementLearningPanel = React.memo(() => {
    const { cognitiveForgeState } = useArchitectureState();
    const { t } = useLocalization();

    const { synthesizedSkills } = cognitiveForgeState;

    // A simple color scale for the policy weight
    const getWeightColor = (weight: number) => {
        if (weight > 1.5) return 'var(--success-color)';
        if (weight < 0.7) return 'var(--failure-color)';
        if (weight > 1.1) return 'var(--primary-color)';
        if (weight < 0.9) return 'var(--warning-color)';
        return 'var(--text-muted)';
    };

    return (
        <div className="side-panel reinforcement-learning-panel">
            <div className="panel-subsection-title">{t('rl_synthesizedSkills')}</div>
            {synthesizedSkills.length > 0 ? (
                synthesizedSkills.map((skill: SynthesizedSkill) => (
                    <div key={skill.id} className="state-item">
                        <label title={skill.description}>{skill.name}</label>
                        <div className="state-bar-container" title={`${t('rl_policyWeight')}: ${skill.policyWeight.toFixed(3)}`}>
                            <div
                                className="state-bar"
                                style={{
                                    width: `${Math.min((skill.policyWeight / 2) * 100, 100)}%`, // Scale from 0-2 to 0-100%
                                    backgroundColor: getWeightColor(skill.policyWeight)
                                }}
                            ></div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="kg-placeholder">{t('rl_noSynthesizedSkills')}</div>
            )}
            
            {/* Placeholder for Design Heuristics once they are integrated */}
            <div className="panel-subsection-title">{t('rl_designHeuristics')}</div>
            <div className="kg-placeholder">{t('rl_noHeuristics')}</div>
        </div>
    );
});