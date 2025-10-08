import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { Sparkline } from './Sparkline';
// FIX: Import PersonalityPortrait for type casting.
import { PersonalityPortrait } from '../types';

export const OtherAwarenessPanel = React.memo(() => {
    const { userModel: model } = useCoreState();
    const { t } = useLocalization();
    const { personalityPortrait } = model;

    const topTraits = Object.entries(personalityPortrait.traits)
        // FIX: Cast the trait data to access its properties safely.
        .sort(([, a], [, b]) => (b as PersonalityPortrait['traits'][string]).score - (a as PersonalityPortrait['traits'][string]).score)
        .slice(0, 5);

    return (
        <div className="side-panel other-awareness-panel">
            <div className="other-awareness-content">
                <div className="panel-subsection-title">{t('personality_portrait_title')}</div>
                <p className="reason-text" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                    {personalityPortrait.summary}
                </p>
                {topTraits.length > 0 && (
                    <div className="hormone-signals">
                        {topTraits.map(([trait, data]) => (
                            <div key={trait} className="hormone-item">
                                <label style={{ textTransform: 'capitalize' }}>{trait}</label>
                                {/* FIX: Cast the trait data to access its properties safely. */}
                                <div className="state-bar-container" title={(data as PersonalityPortrait['traits'][string]).evidence.join('\n')}>
                                    {/* FIX: Cast the trait data to access its properties safely. */}
                                    <div className="state-bar" style={{ width: `${(data as PersonalityPortrait['traits'][string]).score * 100}%`, backgroundColor: 'var(--primary-color)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                <div className="panel-subsection-title" style={{marginTop: '1.5rem'}}>{t('otherAwareness_realtimeState')}</div>
                <div className="awareness-item">
                    <label>{t('otherAwareness_predictedAffectiveState')}</label>
                    <strong className={`affective-state-${model.predictedAffectiveState.toLowerCase()}`}>
                        {model.predictedAffectiveState}
                        {model.affectiveStateSource === 'visual' && ' (👁️)'}
                        {model.affectiveStateSource === 'text' && ' (✍️)'}
                    </strong>
                </div>
                 <div className="awareness-item">
                    <label>{t('causalChainModal_sentimentScore')}</label>
                    <div className="sentiment-score-container">
                        <div className="sentiment-score-bar" style={{'--sentiment-score': model.sentimentScore} as React.CSSProperties}>
                            <span>{model.sentimentScore.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="awareness-item">
                    <label>{t('otherAwareness_inferredIntent')}</label>
                    <strong title={model.inferredIntent || 'None'}>{(model.inferredIntent || 'N/A').substring(0, 25)}{model.inferredIntent && model.inferredIntent.length > 25 ? '...' : ''}</strong>
                </div>
                <div className="awareness-item">
                    <label>Inferred Cognitive State</label>
                    <strong style={{textTransform: 'capitalize'}}>{model.inferredCognitiveState}</strong>
                </div>
                <div className="state-item">
                    <label>{t('metricUserTrust')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar trust-bar" style={{ width: `${model.trustLevel * 100}%` }}></div>
                    </div>
                </div>
                <div className="state-item">
                    <label>{t('otherAwareness_estimatedKnowledgeState')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar knowledge-bar" style={{ width: `${model.estimatedKnowledgeState * 100}%` }}></div>
                    </div>
                </div>
                <div className="panel-subsection-title">{t('otherAwareness_sentimentHistory')}</div>
                <div className="sentiment-sparkline-container">
                    <Sparkline data={model.sentimentHistory || []} strokeColor="var(--primary-color)" height={35} />
                </div>
            </div>
        </div>
    );
});