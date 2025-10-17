// components/CoCreatedWorkflowModal.tsx
import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { CoCreatedWorkflow } from '../types.ts';

interface CoCreatedWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CoCreatedWorkflowModal = ({ isOpen, onClose }: CoCreatedWorkflowModalProps) => {
    const { t } = useLocalization();
    const { handleCreateWorkflow } = useAuraDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [trigger, setTrigger] = useState('');
    const [steps, setSteps] = useState(['']);

    const handleAddStep = () => setSteps([...steps, '']);
    const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const handleSubmit = () => {
        const workflowData: Omit<CoCreatedWorkflow, 'id'> = {
            name,
            description,
            trigger,
            steps: steps.filter(s => s.trim() !== ''),
        };
        handleCreateWorkflow(workflowData);
        onClose();
    };
    
    const isFormValid = name.trim() && trigger.trim() && steps.some(s => s.trim());

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose}>{t('workflow_modal_cancel')}</button>
            <button className="proposal-approve-button" onClick={handleSubmit} disabled={!isFormValid}>{t('workflow_modal_create')}</button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('workflow_modal')} footer={footer}>
            <div className="image-gen-control-group">
                <label htmlFor="wf-name">{t('workflow_modal_name')}</label>
                <input id="wf-name" type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="wf-desc">{t('workflow_modal_description')}</label>
                <textarea id="wf-desc" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="wf-trigger">{t('workflow_modal_trigger')}</label>
                <input id="wf-trigger" type="text" value={trigger} onChange={e => setTrigger(e.target.value)} placeholder={t('workflow_modal_trigger_placeholder')} />
            </div>
            <div className="image-gen-control-group">
                <label>{t('workflow_modal_steps')}</label>
                {steps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <textarea value={step} onChange={e => handleStepChange(index, e.target.value)} rows={1} style={{ flexGrow: 1 }} />
                        <button className="control-button" onClick={() => handleRemoveStep(index)} disabled={steps.length <= 1}>&times;</button>
                    </div>
                ))}
                <button className="control-button" onClick={handleAddStep}>{t('workflow_modal_add_step')}</button>
            </div>
        </Modal>
    );
};