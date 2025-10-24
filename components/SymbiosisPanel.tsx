// components/SymbiosisPanel.tsx
import React from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';

export const SymbiosisPanel = React.memo(() => {
    const { symbioticState: state } = useCoreState();
    const { t } = useLocalization();
    const modal = useModal();
    const { dispatch } = useAuraDispatch();


    return (
        <div className="side-panel symbiosis-panel">
            <div className="awareness-item">
                <label>{t('symbiosis_cognitiveStyle')}</label>
                <strong>{state.inferredCognitiveStyle}</strong>
            </div>
             <div className="awareness-item">
                <label>{t('symbiosis_emotionalNeeds')}</label>
                <strong>{state.inferredEmotionalNeeds.join(', ') || 'N/A'}</strong>
            </div>

            <div className="panel-subsection-title">{t('symbiosis_metamorphosisProposals')}</div>
            {state.metamorphosisProposals.filter(p => p.status === 'proposed').length === 0 ? (
                 <div className="kg-placeholder">{t('symbiosis_noProposals')}</div>
            ) : (
                state.metamorphosisProposals.filter(p => p.status === 'proposed').map(proposal => (
                     <div key={proposal.id} className="suggestion-item" style={{background: 'rgba(187, 154, 247, 0.1)', border: '1px solid var(--primary-color)'}}>
                        <p className="suggestion-text"><strong>{proposal.title}</strong></p>
                        <p style={{fontSize: '0.85rem', margin: '0.3rem 0'}}>{proposal.description}</p>
                        <p className="suggestion-footer" style={{ justifyContent: 'start', fontStyle: 'italic', fontSize: '0.8rem' }}>
                           {proposal.rationale}
                        </p>
                    </div>
                ))
            )}

            <div className="panel-subsection-title">{t('symbiosis_userDevelopmentModel')}</div>
            {Object.keys(state.userDevelopmentalModel.trackedSkills).length === 0 ? (
                <div className="kg-placeholder">{t('symbiosis_noTrackedSkills')}</div>
            ) : (
                Object.entries(state.userDevelopmentalModel.trackedSkills).map(([skill, data]) => {
                    const typedData = data as { level: number };
                    return (
                        <div key={skill} className="state-item">
                            <label>{skill}</label>
                            <div className="state-bar-container">
                                <div className="state-bar" style={{ width: `${typedData.level * 100}%`, backgroundColor: 'var(--primary-color)' }} title={`${t('symbiosis_level')}: ${typedData.level.toFixed(2)}`}></div>
                            </div>
                        </div>
                    );
                })
            )}


            <div className="panel-subsection-title">{t('symbiosis_latentGoals')}</div>
            {state.latentUserGoals.length === 0 ? (
                <div className="kg-placeholder">{t('symbiosis_noLatentGoals')}</div>
            ) : (
                state.latentUserGoals.map((goal, index) => (
                    <div key={index} className="prediction-item" style={{ borderLeftColor: 'var(--guna-dharma)' }}>
                        <div className="prediction-header">
                            <span>{t('symbiosis_goalHypothesis')}</span>
                            <span>{`${t('causalSelfModel_confidence')}: ${(goal.confidence * 100).toFixed(0)}%`}</span>
                        </div>
                        <p className="prediction-content">{goal.goal}</p>
                    </div>
                ))
            )}

            <div className="panel-subsection-title">{t('symbiosis_coCreatedWorkflows')}</div>
            {state.coCreatedWorkflows.length === 0 ? (
                <div className="kg-placeholder">{t('symbiosis_noWorkflows')}</div>
            ) : (
                state.coCreatedWorkflows.map(workflow => (
                     <details key={workflow.id} className="workflow-details">
                        <summary className="workflow-summary">
                            <span>{workflow.name}</span>
                        </summary>
                        <div className="workflow-content">
                            <p className="workflow-description">{workflow.description}</p>
                            <p className="workflow-trigger"><strong>Trigger:</strong> {workflow.trigger}</p>
                            <ol className="workflow-steps-list">
                                {workflow.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                     </details>
                ))
            )}
            <div className="button-grid" style={{marginTop: '1rem'}}>
                <button className="control-button" onClick={() => modal.open('coCreatedWorkflow', {})}>
                    {t('symbiosis_createWorkflow')}
                </button>
            </div>
        </div>
    );
});