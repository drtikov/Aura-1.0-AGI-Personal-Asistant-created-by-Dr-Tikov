// components/SymbolicMathPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const SymbolicMathPanel = React.memo(() => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [expression, setExpression] = useState('x^2 + 2*x + 1');
    const [variable, setVariable] = useState('x');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleExecute = (command: 'simplify' | 'solve' | 'differentiate') => {
        if (!expression.trim()) {
            addToast('Expression is required.', 'warning');
            return;
        }
        setIsProcessing(true);
        syscall('EXECUTE_TOOL', {
            toolName: 'symbolic_math',
            args: {
                command,
                expression,
                variable,
            }
        });
        addToast(`Symbolic math command '${command}' dispatched.`, 'info');
        // The result will appear in the chat log. We'll just stop the spinner here.
        setTimeout(() => setIsProcessing(false), 2000);
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('mathTools_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="math-expression">{t('mathTools_expression')}</label>
                <input
                    id="math-expression"
                    type="text"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder={t('mathTools_expression_placeholder')}
                    className="vfs-path-input"
                    disabled={isProcessing}
                />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="math-variable">{t('mathTools_variable')}</label>
                <input
                    id="math-variable"
                    type="text"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value)}
                    placeholder={t('mathTools_variable_placeholder')}
                    className="vfs-path-input"
                    disabled={isProcessing}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={() => handleExecute('simplify')} disabled={isProcessing}>{t('mathTools_simplify')}</button>
                <button className="control-button" onClick={() => handleExecute('solve')} disabled={isProcessing}>{t('mathTools_solve')}</button>
                <button className="control-button" onClick={() => handleExecute('differentiate')} disabled={isProcessing}>{t('mathTools_differentiate')}</button>
            </div>
             <p className="reason-text" style={{fontSize: '0.8rem', marginTop: '1rem'}}>
                {t('mathTools_results_note')}
            </p>
        </div>
    );
});