// components/AutoCodeForgePanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization, useCoreState } from '../context/AuraContext.tsx';
import { TestSuite } from '../types.ts';
import { Accordion } from './Accordion.tsx';

const CodeViewer = ({ code, language = 'python' }: { code: string; language?: string }) => {
    return (
        <div className="code-snippet-container vfs-viewer">
            <pre><code>{code}</code></pre>
        </div>
    );
};

export const AutoCodeForgePanel = React.memo(() => {
    const { syscall, geminiAPI, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const { autoCodeForgeState } = useCoreState();
    const { status, testSuite, error } = autoCodeForgeState;

    const [problemStatement, setProblemStatement] = useState('Given a list of integers, find the sum of all even numbers.');

    const handleGenerate = async () => {
        if (!problemStatement.trim()) {
            addToast("Please provide a problem statement.", 'warning');
            return;
        }
        syscall('AUTOCODE/SET_STATE', { status: 'generating', error: null, testSuite: null });
        try {
            const suite = await geminiAPI.runAutoCodeVGC(problemStatement);
            syscall('AUTOCODE/SET_STATE', { status: 'complete', testSuite: suite });
            addToast("Test suite generated successfully!", 'success');
        } catch (e) {
            const errorMessage = (e as Error).message;
            syscall('AUTOCODE/SET_STATE', { status: 'error', error: errorMessage });
            addToast(errorMessage, 'error');
        }
    };

    const isGenerating = status === 'generating';

    return (
        <div className="side-panel">
            <p className="reason-text">Implement the Validator-Generator-Checker (VGC) framework. Provide a programming problem statement to generate a competition-grade test suite.</p>

            <div className="image-gen-control-group" style={{ margin: '1rem 0' }}>
                <label htmlFor="autocode-problem">Problem Statement</label>
                <textarea
                    id="autocode-problem"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    rows={4}
                    disabled={isGenerating}
                />
            </div>

            <button className="control-button" onClick={handleGenerate} disabled={isGenerating} style={{ width: '100%' }}>
                {isGenerating ? 'Generating...' : 'Generate Test Suite'}
            </button>
            
            {isGenerating && (
                <div className="generating-indicator" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                    <div className="spinner-small"></div>
                    <span>Generating VGC components...</span>
                </div>
            )}
            
            {error && <div className="failure-reason-display">{error}</div>}
            
            {testSuite && (
                <div style={{ marginTop: '1.5rem' }}>
                    <Accordion title="Validator" defaultOpen>
                        <CodeViewer code={testSuite.validator} />
                    </Accordion>
                    <Accordion title="Generator" defaultOpen>
                        <CodeViewer code={testSuite.generator} />
                    </Accordion>
                    <Accordion title="Checker" defaultOpen>
                        <CodeViewer code={testSuite.checker} />
                    </Accordion>
                    <Accordion title="Sample Test Cases" defaultOpen>
                        {testSuite.testCases.map((tc, i) => (
                            <div key={i} style={{marginBottom: '0.5rem'}}>
                                <CodeViewer code={`--- INPUT ---\n${tc.input}\n--- OUTPUT ---\n${tc.output}`} language='text'/>
                            </div>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
});