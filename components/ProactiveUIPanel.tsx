// components/ProactiveUIPanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useCoreState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const ProactiveUIPanel = () => {
    const { proactiveUI } = useCoreState();
    const { handleSendCommand, syscall } = useAuraDispatch();
    const { t } = useLocalization();

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

    const handleCancel = () => {
        syscall('HIDE_PROACTIVE_UI', {});
    };

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