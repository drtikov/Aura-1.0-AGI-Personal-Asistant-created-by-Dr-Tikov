// components/ProactiveUIPanel.tsx
import React, { useState } from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext';

export const ProactiveUIPanel = () => {
    const { proactiveUI } = useCoreState();
    const { handleSendCommand, syscall } = useAuraDispatch();
    const { t } = useLocalization();
    const [reflectionText, setReflectionText] = useState('');

    if (!proactiveUI.isActive) {
        return null;
    }

    const handleOptionClick = (option: string) => {
        // This handles both clarification requests and suggestions.
        // For clarifications, it resubmits the original prompt with the user's choice.
        // For suggestions, it executes the suggestion as a new command.
        const commandToSend = proactiveUI.type === 'clarification_request' && proactiveUI.originalPrompt
            ? `${proactiveUI.originalPrompt} (User clarified: ${option})`
            : option;

        handleSendCommand(commandToSend, proactiveUI.originalFile || undefined);
        syscall('HIDE_PROACTIVE_UI', {});
    };
    
    const handleReflectionSubmit = () => {
        if (!reflectionText.trim()) return;
        handleSendCommand(`My reflection on that: "${reflectionText}"`);
        syscall('HIDE_PROACTIVE_UI', {});
        setReflectionText('');
    };

    const handleCancel = () => {
        syscall('HIDE_PROACTIVE_UI', {});
    };

    if (proactiveUI.type === 'reflection_prompt') {
        return (
            <form className="input-area" onSubmit={(e) => { e.preventDefault(); handleReflectionSubmit(); }}>
                <p className="proactive-ui-question" style={{textAlign: 'left', marginBottom: '0.5rem'}}>{proactiveUI.question}</p>
                <div className="input-area-content">
                    <textarea 
                        value={reflectionText} 
                        onChange={(e) => setReflectionText(e.target.value)} 
                        placeholder="Share your thoughts..." 
                        rows={1}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReflectionSubmit(); } }}
                    />
                    <div className="input-controls">
                        <button type="submit" disabled={!reflectionText.trim()}>Submit</button>
                    </div>
                </div>
                 <button onClick={handleCancel} className="proactive-ui-cancel" title={t('proactiveUI_cancel', { defaultValue: 'Dismiss' })} style={{position: 'absolute', top: '0.5rem', right: '0.5rem', margin: 0}}>
                    &times;
                </button>
            </form>
        );
    }


    return (
        <div className="proactive-ui-panel">
            <div className="proactive-ui-content">
                <p className="proactive-ui-question">{proactiveUI.question}</p>
                <div className="proactive-ui-options">
                    {proactiveUI.options && proactiveUI.options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option)} className="control-button">
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleCancel} className="proactive-ui-cancel" title={t('proactiveUI_cancel', { defaultValue: 'Dismiss' })}>
                &times;
            </button>
        </div>
    );
};