// components/DoxasticEnginePanel.tsx
import React, { useState } from 'react';
import { useCoreState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { DoxasticHypothesis, DoxasticExperiment } from '../types.ts';
import { Accordion } from './Accordion.tsx';

export const DoxasticEnginePanel = () => {
    const { doxasticEngineState } = useCoreState();
    const { t, geminiAPI, syscall, addToast, handleRunExperiment } = useAuraDispatch();
    const { hypotheses, experiments } = doxasticEngineState;
    const [designingHypoId, setDesigningHypoId] = useState<string | null>(null);

    const getStatusColor = (status: DoxasticHypothesis['status']) => {
        switch(status) {
            case 'validated': return 'var(--success-color)';
            case 'refuted': return 'var(--failure-color)';
            case 'testing':
            case 'designed':
                return 'var(--warning-color)';
            default: return 'var(--text-muted)';
        }
    };
    
    const handleDesignExperiment = async (hypothesis: DoxasticHypothesis) => {
        setDesigningHypoId(hypothesis.id);
        addToast(`Designing experiment for hypothesis: ${hypothesis.id.slice(0,8)}...`, 'info');
        try {
            const experiment = await geminiAPI.designDoxasticExperiment(hypothesis.description);
            syscall('DOXASTIC/DESIGN_EXPERIMENT', { hypothesisId: hypothesis.id, experiment });
            addToast('Experiment designed successfully.', 'success');
        } catch (e) {
            addToast(`Failed to design experiment: ${(e as Error).message}`, 'error');
            syscall('DOXASTIC/UPDATE_HYPOTHESIS_STATUS', { hypothesisId: hypothesis.id, status: 'untested' });
        } finally {
            setDesigningHypoId(null);
        }
    };

    const untestedHypotheses = hypotheses.filter(h => h.status === 'untested');
    const designedExperiments = experiments.filter(e => {
        const hypo = hypotheses.find(h => h.id === e.hypothesisId);
        return hypo && hypo.status === 'designed';
    });
    const validatedOrRefuted = hypotheses.filter(h => h.status === 'validated' || h.status === 'refuted');


    return (
        <div className="side-panel doxastic-engine-panel">
            <Accordion title={t('doxastic_untested_hypotheses')} defaultOpen={true} hasNotifications={untestedHypotheses.length > 0}>
                 {untestedHypotheses.length === 0 ? (
                    <div className="kg-placeholder">{t('doxastic_no_untested')}</div>
                ) : (
                    untestedHypotheses.map(hypo => {
                        const isDesigning = designingHypoId === hypo.id;
                        return (
                            <div key={hypo.id} className="proposal-card">
                                <div className="proposal-card-body">
                                    <p><em>"{hypo.description}"</em></p>
                                </div>
                                <div className="proposal-actions-footer">
                                    <button className="control-button" onClick={() => handleDesignExperiment(hypo)} disabled={isDesigning}>
                                        {isDesigning ? <><div className="spinner-small" /> Designing...</> : t('doxastic_design_experiment')}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </Accordion>

            <Accordion title={t('doxastic_designed_experiments')} defaultOpen={true} hasNotifications={designedExperiments.length > 0}>
                {designedExperiments.length === 0 ? (
                    <div className="kg-placeholder">{t('doxastic_no_designed')}</div>
                ) : (
                     designedExperiments.map(exp => {
                         const hypo = hypotheses.find(h => h.id === exp.hypothesisId);
                         const isTesting = hypo?.status === 'testing';
                         return (
                            <div key={exp.id} className="proposal-card">
                                <div className="proposal-card-body">
                                    <p><strong>Hypothesis:</strong> <em>"{hypo?.description}"</em></p>
                                    <p style={{marginTop: '0.5rem'}}><strong>Method:</strong> {exp.method}</p>
                                </div>
                                 <div className="proposal-actions-footer">
                                    <button className="control-button implement-button" onClick={() => handleRunExperiment(exp)} disabled={isTesting}>
                                        {isTesting ? <><div className="spinner-small" /> Testing...</> : t('doxastic_run_experiment')}
                                    </button>
                                </div>
                            </div>
                         );
                    })
                )}
            </Accordion>
            
            <Accordion title={t('doxastic_validated_beliefs')} defaultOpen={false}>
                 {validatedOrRefuted.length === 0 ? (
                    <div className="kg-placeholder">{t('doxastic_noHypotheses')}</div>
                ) : (
                    validatedOrRefuted.map(hypo => (
                        <div key={hypo.id} className="gde-status" style={{ borderLeftColor: getStatusColor(hypo.status) }}>
                            <p><em>"{hypo.description}"</em> ({hypo.status})</p>
                        </div>
                    ))
                )}
            </Accordion>
        </div>
    );
};