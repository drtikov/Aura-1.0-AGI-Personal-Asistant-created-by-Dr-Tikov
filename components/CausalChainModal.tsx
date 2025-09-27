import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { PerformanceLogEntry } from '../types';
import { Modal } from './Modal';
import { useLocalization } from '../context/AuraContext';

export const CausalChainModal = ({ log, onClose }: { log: PerformanceLogEntry | null, onClose: () => void }) => {
    const { t } = useLocalization();
    const snapshot = log?.decisionContext?.internalStateSnapshot;
    const workingMemory = log?.decisionContext?.workingMemorySnapshot;
    const reasoningPlan = log?.decisionContext?.reasoningPlan;
    
    return (
        <Modal isOpen={!!log} onClose={onClose} title={t('causalChainModal_title')}>
            {log && (
                <>
                    <div className="trace-section"> <h4>1. {t('causalChainModal_initialState')}</h4> {snapshot ? ( <div className="state-grid"> <span>{t('hormoneNovelty')}: {snapshot.noveltySignal?.toFixed(2) ?? 'N/A'}</span> <span>{t('hormoneMastery')}: {snapshot.masterySignal?.toFixed(2) ?? 'N/A'}</span> <span>{t('hormoneUncertainty')}: {snapshot.uncertaintySignal?.toFixed(2) ?? 'N/A'}</span> <span>{t('hormoneBoredom')}: {snapshot.boredomLevel?.toFixed(2) ?? 'N/A'}</span> <span>{t('metricCogLoad')}: {(snapshot.load * 100)?.toFixed(0) ?? 'N/A'}%</span> <span>Guna: {snapshot.gunaState ?? 'N/A'}</span> </div> ) : <p><i>{t('causalChainModal_noSnapshot')}</i></p>} </div>
                    <div className="trace-section"> <h4>2. {t('causalChainModal_workingMemory')}</h4> {workingMemory && workingMemory.length > 0 ? ( <ul>{workingMemory.map((item, i) => <li key={i}>{item}</li>)}</ul> ) : ( <p><i>{t('causalChainModal_wmEmpty')}</i></p> )} </div>
                    <div className="trace-section">
                        <h4>3. {t('causalChainModal_decisionReasoning')}</h4>
                        <p><strong>{t('causalChainModal_input')}:</strong> "{log.input ?? 'N/A'}"</p>
                        {reasoningPlan && reasoningPlan.length > 0 ? (
                            <div className="reasoning-plan">
                                <p><strong>{t('causalChainModal_reasoningPlan')}:</strong></p>
                                {reasoningPlan.map(step => (
                                    <div key={step.step} className="plan-step">
                                        <div className="step-header">{t('causalChainModal_step')} {step.step}: {step.skill}</div>
                                        <div className="step-reasoning"><em>{step.reasoning}</em></div>
                                        <div className="step-input">{t('causalChainModal_input')}: "{step.input}"</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="reasoning-text"><strong>{t('causalChainModal_reasoning')}:</strong> "{log.decisionContext?.reasoning ?? 'N/A'}"</p>
                        )}
                    </div>
                    <div className="trace-section"> <h4>4. {t('causalChainModal_outcome')}</h4> <p><strong>{t('causalChainModal_success')}:</strong> <span className={log.success ? 'success' : 'failure'}>{log.success ? t('causalChainModal_yes') : t('causalChainModal_no')}</span></p> <p><strong>{t('causalChainModal_duration')}:</strong> {log.duration ?? 'N/A'}ms</p> <p><strong>{t('causalChainModal_cognitiveGain')}:</strong> {log.cognitiveGain?.toFixed(2) ?? 'N/A'}</p> {log.sentiment !== undefined && <p><strong>{t('causalChainModal_sentimentScore')}:</strong> {log.sentiment?.toFixed(2) ?? 'N/A'}</p>} <p><strong>{t('causalChainModal_output')}:</strong></p> <pre className="output-preview">{log.output?.substring(0, 300) || 'N/A'}{log.output && log.output.length > 300 ? '...' : ''}</pre> </div>
                </>
            )}
        </Modal>
    );
};