// components/SymbioticCoderPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';

type ActionType = 'explain' | 'refactor' | 'test' | 'critique_ui';

const DiffViewer = ({ oldCode, newCode }: { oldCode: string; newCode: string }) => {
    // This is a simplified diff viewer. A real implementation might use a library like diff-match-patch.
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    // For simplicity, we assume the refactored code has a similar structure.
    // This is just for visualization.
    const lines = newLines.map((line, i) => {
        if (oldLines[i] !== line) {
            return { type: 'add', content: `+ ${line}` };
        }
        return { type: 'same', content: `  ${line}` };
    });

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
    const { addToast, geminiAPI } = useAuraDispatch();
    
    const [action, setAction] = useState<ActionType>('explain');
    const [inputCode, setInputCode] = useState('');
    const [refactorInstruction, setRefactorInstruction] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // --- Output States ---
    const [explanation, setExplanation] = useState('');
    const [testResult, setTestResult] = useState('');
    const [refactorDiff, setRefactorDiff] = useState<{ old: string; new: string } | null>(null);
    const [critique, setCritique] = useState('');

    const handleExecute = async () => {
        // FIX: Removed check for non-existent 'creative' action type.
        if (!inputCode.trim()) {
            addToast(t('symbioticCoder_inputCode_placeholder'), 'warning');
            return;
        }
        setIsProcessing(true);
        // Reset outputs
        setExplanation('');
        setTestResult('');
        setRefactorDiff(null);
        setCritique('');

        try {
            switch(action) {
                case 'explain':
                    const explainedText = await geminiAPI.explainCode(inputCode);
                    setExplanation(explainedText);
                    break;
                case 'test':
                    const generatedTest = await geminiAPI.generateTestForCode(inputCode);
                    setTestResult(generatedTest);
                    break;
                case 'refactor':
                     if (!refactorInstruction.trim()) {
                        addToast(t('symbioticCoder_refactorInstruction_placeholder'), 'warning');
                        setIsProcessing(false);
                        return;
                    }
                    const refactoredCode = await geminiAPI.refactorCode(inputCode, refactorInstruction);
                    setRefactorDiff({ old: inputCode, new: refactoredCode });
                    break;
                case 'critique_ui':
                    const uiCritique = await geminiAPI.critiqueUIVisually(inputCode);
                    setCritique(uiCritique);
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
                    <button className={action === 'critique_ui' ? 'active' : ''} onClick={() => setAction('critique_ui')}>{t('symbioticCoder_critique_ui')}</button>
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
                         <SafeMarkdown text={explanation} />
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
                 {!isProcessing && critique && (
                    <div className="critique-output">
                        <div className="panel-subsection-title">{t('symbioticCoder_visual_critique')}</div>
                        <SafeMarkdown text={critique} />
                    </div>
                )}
            </div>
        </div>
    );
});