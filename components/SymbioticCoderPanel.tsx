// components/SymbioticCoderPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion';

type ActionType = 'explain' | 'refactor' | 'test';

const DiffViewer = ({ oldCode, newCode }: { oldCode: string; newCode: string }) => {
    // A simple line-by-line diff for demonstration purposes.
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);
    const lines = [];

    for (let i = 0; i < maxLines; i++) {
        const oldLine = oldLines[i];
        const newLine = newLines[i];
        if (oldLine !== newLine) {
            if (oldLine !== undefined) lines.push({ type: 'del', content: `- ${oldLine}` });
            if (newLine !== undefined) lines.push({ type: 'add', content: `+ ${newLine}` });
        } else if (oldLine !== undefined) {
            lines.push({ type: 'same', content: `  ${oldLine}` });
        }
    }

    return (
        <div className="diff-viewer">
            <pre><code>
                {lines.map((line, index) => (
                    <div key={index} className={`diff-${line.type}`}>{line.content}</div>
                ))}
            </code></pre>
        </div>
    );
};


export const SymbioticCoderPanel = React.memo(() => {
    const { t } = useLocalization();
    const { syscall, addToast, geminiAPI } = useAuraDispatch();
    
    const [action, setAction] = useState<ActionType>('explain');
    const [inputCode, setInputCode] = useState('');
    const [refactorInstruction, setRefactorInstruction] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // --- Output States ---
    const [explanation, setExplanation] = useState('');
    const [testResult, setTestResult] = useState('');
    const [refactorDiff, setRefactorDiff] = useState<{ old: string; new: string } | null>(null);

    const handleExecute = async () => {
        if (!inputCode.trim()) {
            addToast(t('symbioticCoder_inputCode_placeholder'), 'warning');
            return;
        }
        setIsProcessing(true);
        // Reset outputs
        setExplanation('');
        setTestResult('');
        setRefactorDiff(null);

        try {
            let responseText = '';
            // This is a placeholder for actual Gemini API calls.
            // In a real implementation, you would call functions like geminiAPI.explainCode(inputCode)
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

            switch(action) {
                case 'explain':
                    responseText = `// This is a simulated explanation for the provided code.\n// The function appears to take two arguments and return their sum.\n// It uses modern arrow function syntax.`;
                    setExplanation(responseText);
                    break;
                case 'test':
                     responseText = `import { describe, it, expect } from 'vitest';\n\n// Simulated test case\ndescribe('myFunction', () => {\n  it('should return the correct sum', () => {\n    // Assuming the input was: const myFunction = (a, b) => a + b;\n    expect(myFunction(2, 3)).toBe(5);\n  });\n});`;
                    setTestResult(responseText);
                    break;
                case 'refactor':
                     if (!refactorInstruction.trim()) {
                        addToast(t('symbioticCoder_refactorInstruction_placeholder'), 'warning');
                        setIsProcessing(false);
                        return;
                    }
                    responseText = `// This is a simulated refactor of the code based on your instruction.\n${inputCode.replace('const', 'let')}`;
                    setRefactorDiff({ old: inputCode, new: responseText });
                    break;
            }
        } catch(e) {
            addToast(`Error during symbiotic coding: ${(e as Error).message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="side-panel symbiotic-coder-panel">
            <p className="reason-text">{t('symbioticCoder_description')}</p>

            <div className="image-gen-control-group">
                <label>{t('symbioticCoder_action')}</label>
                <div className="media-gen-mode-tabs">
                    <button className={action === 'explain' ? 'active' : ''} onClick={() => setAction('explain')}>{t('symbioticCoder_explain')}</button>
                    <button className={action === 'refactor' ? 'active' : ''} onClick={() => setAction('refactor')}>{t('symbioticCoder_refactor')}</button>
                    <button className={action === 'test' ? 'active' : ''} onClick={() => setAction('test')}>{t('symbioticCoder_generateTest')}</button>
                </div>
            </div>

             <div className="image-gen-control-group">
                <label htmlFor="coder-input">{t('symbioticCoder_inputCode')}</label>
                <textarea id="coder-input" value={inputCode} onChange={e => setInputCode(e.target.value)} placeholder={t('symbioticCoder_inputCode_placeholder')} disabled={isProcessing} rows={8} />
            </div>

            {action === 'refactor' && (
                 <div className="image-gen-control-group">
                    <label htmlFor="coder-instruction">{t('symbioticCoder_refactorInstruction')}</label>
                    <input id="coder-instruction" type="text" value={refactorInstruction} onChange={e => setRefactorInstruction(e.target.value)} placeholder={t('symbioticCoder_refactorInstruction_placeholder')} disabled={isProcessing} />
                </div>
            )}
            
            <button className="image-generator-button" onClick={handleExecute} disabled={isProcessing}>
                {isProcessing ? t('symbioticCoder_processing') : t('symbioticCoder_execute')}
            </button>
            
            <div className="symbiotic-coder-output">
                {isProcessing && (
                    <div className="loading-overlay active" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
                        <div className="spinner-small"></div>
                        <span>{t('symbioticCoder_processing')}</span>
                    </div>
                )}
                {!isProcessing && explanation && (
                    <div className="explanation-output">
                         <div className="panel-subsection-title">{t('symbioticCoder_explanation')}</div>
                         <pre><code>{explanation}</code></pre>
                    </div>
                )}
                {!isProcessing && testResult && (
                    <div className="test-result-output">
                         <div className="panel-subsection-title">{t('symbioticCoder_generatedTest')}</div>
                         <div className="code-snippet-container">
                             <pre><code>{testResult}</code></pre>
                         </div>
                    </div>
                )}
                {!isProcessing && refactorDiff && (
                     <div className="refactor-output">
                         <div className="panel-subsection-title">{t('symbioticCoder_refactorSuggestion')}</div>
                         <DiffViewer oldCode={refactorDiff.old} newCode={refactorDiff.new} />
                     </div>
                )}
            </div>
        </div>
    );
});