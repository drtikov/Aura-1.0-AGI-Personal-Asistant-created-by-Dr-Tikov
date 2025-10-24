// components/BrainstormModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';
import { BrainstormIdea, Persona } from '../types.ts';
import { HAL } from '../core/hal.ts';

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

export const BrainstormModal = ({ isOpen, onClose, initialTopic, personas }: { isOpen: boolean; onClose: () => void; initialTopic?: string; personas?: Persona[] }) => {
    const { t } = useLocalization();
    const { geminiAPI, syscall, addToast } = useAuraDispatch();
    
    const [status, setStatus] = useState<'input' | 'generating' | 'results'>('input');
    const [topic, setTopic] = useState(initialTopic || '');
    const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
    const [winningIdea, setWinningIdea] = useState<string | null>(null);

    // Reset state when modal is closed/reopened
    useEffect(() => {
        if (isOpen) {
            setStatus('input');
            setTopic(initialTopic || '');
            setIdeas([]);
            setWinningIdea(null);
        }
    }, [isOpen, initialTopic]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            addToast(t('brainstorm_prompt_required_toast', { defaultValue: 'Please enter a topic to brainstorm.' }), 'warning');
            return;
        }

        setStatus('generating');
        addToast(t('brainstorm_started_toast'), 'info');

        try {
            // Perform the brainstorm
            const generatedIdeas = await geminiAPI.generateBrainstormingIdeas(topic, personas);
            const generatedWinner = await geminiAPI.synthesizeBrainstormWinner(topic, generatedIdeas);

            // Update local state to show results
            setIdeas(generatedIdeas);
            setWinningIdea(generatedWinner);

            // Also update global state for persistence
            syscall('BRAINSTORM/START', { topic });
            generatedIdeas.forEach(idea => {
                syscall('BRAINSTORM/ADD_IDEA', { idea });
            });
            syscall('BRAINSTORM/SET_WINNER', { winningIdea: generatedWinner });
            syscall('BRAINSTORM/FINALIZE', {});
            
            setStatus('results');
            addToast(t('brainstorm_complete_toast_short', { defaultValue: 'Brainstorming complete!'}), 'success');

        } catch (error) {
            console.error("Brainstorming session failed:", error);
            addToast(t('brainstorm_failed_toast'), 'error');
            setStatus('input'); // Revert to input screen on failure
        }
    };

    const handleStartNew = () => {
        setStatus('input');
        setTopic('');
        setIdeas([]);
        setWinningIdea(null);
    };

    const handleCopyAll = () => {
        let fullText = `Brainstorming Session\n`;
        fullText += `Topic: ${topic}\n\n`;
        fullText += `--- IDEAS ---\n\n`;
        ideas.forEach(idea => {
            fullText += `${idea.personaName}:\n${idea.idea}\n\n`;
        });
        if (winningIdea) {
            fullText += `--- WINNING IDEA ---\n\n${winningIdea}\n`;
        }
        HAL.Clipboard.writeText(fullText.trim()).then(() => {
            addToast(t('brainstorm_copy_all_success'), 'success');
        }, () => {
            addToast(t('brainstorm_copy_all_failed'), 'error');
        });
    };

    const renderContent = () => {
        switch (status) {
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
                return <BrainstormResults topic={topic} ideas={ideas} winningIdea={winningIdea} onCopy={handleCopyAll} />;
        }
    };

    const renderFooter = () => {
        const isGenerating = status === 'generating';
        switch (status) {
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