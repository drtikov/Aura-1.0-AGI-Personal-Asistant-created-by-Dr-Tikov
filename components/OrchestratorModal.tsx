// components/OrchestratorModal.tsx
import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useSystemState } from '../context/AuraContext.tsx';
import { CoCreatedWorkflow } from '../types.ts';

export const OrchestratorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { geminiAPI, syscall, addToast } = useAuraDispatch();
    const { pluginState } = useSystemState();
    
    const [goal, setGoal] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<Omit<CoCreatedWorkflow, 'id'> | null>(null);

    const handleOrchestrate = async () => {
        if (!goal.trim()) {
            addToast('Please provide a goal to orchestrate.', 'warning');
            return;
        }
        setIsProcessing(true);
        setResult(null);
        try {
            const toolPlugins = pluginState.registry
                .filter(p => p.type === 'TOOL' && p.toolSchema)
                .map(p => ({ name: p.toolSchema!.name, description: p.toolSchema!.description }));

            const workflow = await geminiAPI.orchestrateWorkflow(goal, toolPlugins);
            setResult(workflow);
            addToast('Workflow orchestrated successfully.', 'success');
        } catch (e) {
            addToast(`Orchestration failed: ${(e as Error).message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = () => {
        if (result) {
            syscall('ADD_WORKFLOW_PROPOSAL', result);
            addToast(t('toast_workflowCreated'), 'success');
            onClose();
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>{t('searchModal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleOrchestrate} disabled={isProcessing || !goal.trim()}>
                {isProcessing ? t('orchestrating') : t('orchestrate')}
            </button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('orchestrator_modal_title')} 
            footer={footer}
            className="search-modal"
        >
            <div className="trace-section">
                <h4>{t('orchestrator_modal_heading')}</h4>
                <p>{t('orchestrator_modal_description')}</p>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder={t('orchestrator_modal_placeholder')}
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
            {isProcessing && (
                <div className="processing-indicator">
                    {t('orchestrating')} <div className="spinner"></div>
                </div>
            )}
            {result && (
                <div className="trace-section">
                    <h4>{t('orchestrator_modal_result')}</h4>
                     <details className="workflow-details" open>
                        <summary className="workflow-summary">
                            <span>{result.name}</span>
                        </summary>
                        <div className="workflow-content">
                            <p className="workflow-description">{result.description}</p>
                            <p className="workflow-trigger"><strong>Trigger:</strong> {result.trigger}</p>
                            <ol className="workflow-steps-list">
                                {result.steps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                     </details>
                     <div className="modal-footer" style={{paddingTop: '1rem', borderTop: 'none'}}>
                        <button className="proposal-approve-button" onClick={handleSave}>
                            {t('orchestrator_modal_save')}
                        </button>
                     </div>
                </div>
            )}
        </Modal>
    );
};