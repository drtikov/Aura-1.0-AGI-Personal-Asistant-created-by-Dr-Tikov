// components/BrainstormModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useCoreState } from '../context/AuraContext.tsx';
import { BrainstormIdea, Persona, KernelTaskType } from '../types.ts';
import { HAL } from '../core/hal.ts';
import { personas as allRegisteredPersonas } from '../state/personas.ts';

// Re-using the results display logic from BrainstormingPanel
const BrainstormResults = ({ topic, ideas, winningIdea, onCopy }: { topic: string | null; ideas: BrainstormIdea[]; winningIdea: string | null; onCopy: () => void }) => {
    const { t } = useLocalization();

    return (
        <div className="brainstorming-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button className="control-button" onClick={onCopy} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                    {t('brainstorm_copy_all')}
                </button>
            </div>

            <div className="panel-subsection-title">{t('brainstorm_topic')}</div>
            <p className="reason-text"><em>"{topic}"</em></p>

            <div className="panel-subsection-title">{t('brainstorm_ideas')}</div>
            {ideas.map((idea: BrainstormIdea, index: number) => (
                <div key={index} className="axiom-card">
                    <div className="mod-log-header">
                        <span className="mod-log-type">{idea.personaName}</span>
                    </div>
                    <p className="axiom-card-text" style={{ fontStyle: 'normal' }}>{idea.idea}</p>
                </div>
            ))}

            {winningIdea && (
                <>
                    <div className="panel-subsection-title">{t('brainstorm_winner')}</div>
                     <div className="axiom-card accepted">
                        <div className="mod-log-header">
                            <span className="mod-log-type">{t('brainstorm_winner')}</span>
                        </div>
                        <p className="axiom-card-text">"{winningIdea}"</p>
                    </div>
                </>
            )}
        </div>
    );
};

export const BrainstormModal = ({ isOpen, onClose, initialTopic, personas: customPersonasProp }: { isOpen: boolean; onClose: () => void; initialTopic?: string; personas?: Persona[] }) => {
    const { t } = useLocalization();
    const { syscall, addToast } = useAuraDispatch();
    const { brainstormState } = useCoreState();
    
    const [localStatus, setLocalStatus] = useState<'input' | 'generating' | 'results'>('input');
    const [topic, setTopic] = useState(initialTopic || '');

    // Reset local state when modal is closed/reopened
    useEffect(() => {
        if (isOpen) {
            setLocalStatus('input');
            setTopic(initialTopic || '');
            // Reset the global state for a fresh session
            syscall('BRAINSTORM/RESET', {});
        }
    // The syscall function is stable and does not need to be in the dependency array.
    // Including it causes a re-render loop that prevents typing in the textarea.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialTopic]);

    // Listen to global state changes to update UI and close modal on completion
    useEffect(() => {
        if (brainstormState.status === 'brainstorming' || brainstormState.status === 'proposing') {
            setLocalStatus('generating');
        } else if (brainstormState.status === 'complete') {
            if (brainstormState.ideas.length > 0) {
                // Results are ready, close the modal as requested.
                onClose();
            } else {
                // This is the error/empty case. Reset the modal to the input state for a retry.
                setLocalStatus('input');
            }
        }
    }, [brainstormState.status, brainstormState.ideas, onClose]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            addToast(t('brainstorm_prompt_required_toast', { defaultValue: 'Please enter a topic to brainstorm.' }), 'warning');
            return;
        }
        
        // Define the expanded "Council of Innovators"
        const councilOfInnovatorsIds = [
            'nikola_tesla', 'steve_jobs', 'grigori_perelman', 'leonardo_da_vinci', 
            'richard_feynman', 'albert_einstein', 'elon_musk', 'ray_kurzweil', 
            'henri_poincare', 'andrey_kolmogorov', 'saul_griffith', 
            'r_buckminster_fuller', 'walter_russell'
        ];
        
        // Get the fixed council members
        const councilMembers = allRegisteredPersonas.filter(p => councilOfInnovatorsIds.includes(p.id));

        // Create a pool for the random selection by excluding the fixed council members
        const randomPersonaPool = allRegisteredPersonas.filter(p => !councilOfInnovatorsIds.includes(p.id));
        
        let randomPersona = null;
        if (randomPersonaPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * randomPersonaPool.length);
            randomPersona = randomPersonaPool[randomIndex];
        }

        // Combine the council with the random persona
        const personasToUse = [...councilMembers];
        if (randomPersona) {
            personasToUse.push(randomPersona);
        }

        // This is now the primary action. It queues the task for the kernel.
        syscall('KERNEL/QUEUE_TASK', {
            id: `task_brainstorm_${self.crypto.randomUUID()}`,
            type: KernelTaskType.RUN_BRAINSTORM_SESSION,
            payload: { triageResult: { goal: topic }, customPersonas: personasToUse },
            timestamp: Date.now(),
        });

        setLocalStatus('generating'); // Update local UI immediately
        addToast(t('brainstorm_started_toast'), 'info');
    };

    const handleStartNew = () => {
        syscall('BRAINSTORM/START', { topic: '' }); // Reset global state
        syscall('BRAINSTORM/FINALIZE', {});
        setLocalStatus('input');
        setTopic('');
    };

    const handleCopyAll = () => {
        let fullText = `Brainstorming Session\n`;
        fullText += `Topic: ${brainstormState.topic}\n\n`;
        fullText += `--- IDEAS ---\n\n`;
        brainstormState.ideas.forEach(idea => {
            fullText += `${idea.personaName}:\n${idea.idea}\n\n`;
        });
        if (brainstormState.winningIdea) {
            fullText += `--- WINNING IDEA ---\n\n${brainstormState.winningIdea}\n`;
        }
        HAL.Clipboard.writeText(fullText.trim()).then(() => {
            addToast(t('brainstorm_copy_all_success'), 'success');
        }, () => {
            addToast(t('brainstorm_copy_all_failed'), 'error');
        });
    };

    const renderContent = () => {
        switch (localStatus) {
            case 'input':
                return (
                    <div className="trace-section"> 
                        <h4>{t('brainstorm_heading')}</h4> 
                        <p>{t('brainstorm_description')}</p> 
                        <textarea 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder={t('brainstorm_placeholder')} 
                            rows={4} 
                        /> 
                    </div>
                );
            case 'generating':
                 return (
                    <div className="kg-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', minHeight: '200px'}}>
                        <div className="spinner-small"></div>
                        <span>{t('brainstorm_processing')}</span>
                    </div>
                );
            case 'results':
                return <BrainstormResults topic={brainstormState.topic} ideas={brainstormState.ideas} winningIdea={brainstormState.winningIdea} onCopy={handleCopyAll} />;
        }
    };

    const renderFooter = () => {
        const isGenerating = localStatus === 'generating';
        switch (localStatus) {
            case 'input':
                return (
                    <>
                        <button className="proposal-reject-button" onClick={onClose} disabled={isGenerating}>{t('brainstorm_cancel')}</button>
                        <button className="proposal-approve-button" onClick={handleGenerate} disabled={isGenerating || !topic.trim()}>{t('brainstorm_generate')}</button>
                    </>
                );
            case 'generating':
                return null; // No footer while generating
            case 'results':
                return (
                     <>
                        <button className="proposal-reject-button" onClick={handleStartNew}>{t('brainstorm_start_new')}</button>
                        <button className="proposal-approve-button" onClick={onClose}>{t('brainstorm_close')}</button>
                    </>
                );
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('brainstorm_session_title')} 
            footer={renderFooter()}
            className="advanced-controls-modal" // Use large modal style
        >
            {renderContent()}
        </Modal>
    );
};