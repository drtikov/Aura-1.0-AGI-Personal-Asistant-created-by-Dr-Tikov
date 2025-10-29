// components/SymbioticCanvas.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuraDispatch, useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';
import { loadSdk } from '../core/sdkLoader';

declare const mermaid: any;

export const SymbioticCanvas = () => {
    const { t } = useLocalization();
    const { syscall, geminiAPI } = useAuraDispatch();
    const { symbioticCanvasState } = useCoreState();
    const editorRef = useRef<HTMLDivElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selection, setSelection] = useState<string>('');
    const [lastContent, setLastContent] = useState(symbioticCanvasState.content);
    
    // Sync state to the contentEditable div if it changes externally
    useEffect(() => {
        if (editorRef.current && symbioticCanvasState.content !== lastContent) {
            editorRef.current.innerHTML = symbioticCanvasState.content;
            setLastContent(symbioticCanvasState.content);
        }
    }, [symbioticCanvasState.content, lastContent]);

    useEffect(() => {
        // When content changes, load mermaid if needed and re-render diagrams
        if (editorRef.current) {
            const diagrams = Array.from(editorRef.current.querySelectorAll('.mermaid'));
            
            // Check for diagrams that haven't been processed by mermaid yet
            const unrenderedDiagrams = diagrams.filter(el => !(el as Element).hasAttribute('data-processed'));

            if (unrenderedDiagrams.length > 0) {
                const renderMermaid = async () => {
                    try {
                        await loadSdk('mermaid');
                        // Check if mermaid is now available
                        if (typeof mermaid !== 'undefined') {
                            // Initialize only once if needed, using a global flag
                            if (!(window as any).mermaidInitialized) {
                                mermaid.initialize({ startOnLoad: false, theme: 'dark' });
                                (window as any).mermaidInitialized = true;
                            }
                            // Run on the currently unrendered diagrams
                            mermaid.run({
                                nodes: unrenderedDiagrams
                            });
                        }
                    } catch (error) {
                        console.error("Failed to load or run Mermaid", error);
                    }
                };
                renderMermaid();
            }
        }
    }, [symbioticCanvasState.content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML;
        if (newContent !== lastContent) {
            syscall('CANVAS/SET_CONTENT', { content: newContent });
            setLastContent(newContent);
        }
    };

    const handleSelectionChange = () => {
        const currentSelection = window.getSelection()?.toString().trim();
        setSelection(currentSelection || '');
    };

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        // After command, sync state back from the DOM
        if (editorRef.current) {
            syscall('CANVAS/SET_CONTENT', { content: editorRef.current.innerHTML });
        }
    };
    
    const handleInsertCodeBlock = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const selectedText = selection.toString();
        const codeBlockHtml = `<pre><code>${selectedText || 'code goes here'}</code></pre><p><br/></p>`;
        handleFormat('insertHTML', codeBlockHtml);
    };

    const handleAuraAction = async (action: 'expand' | 'summarize' | 'diagram') => {
        if (!selection || isProcessing) return;

        setIsProcessing(true);
        try {
            let result = '';
            switch (action) {
                case 'expand':
                    result = await geminiAPI.expandOnText(selection);
                    break;
                case 'summarize':
                    result = await geminiAPI.summarizeText(selection);
                    break;
                case 'diagram':
                    result = await geminiAPI.generateDiagramFromText(selection);
                    const match = result.match(/```mermaid\n([\s\S]*?)\n```/);
                    if (match && match[1]) {
                        result = `<div class="mermaid">${match[1]}</div>`;
                    } else {
                        result = `<pre><code>${result}</code></pre>`;
                    }
                    break;
            }
            
            const auraContent = `<div class="aura-canvas-insertion"><div class="content-renderer">${result}</div></div><p><br/></p>`;
            handleFormat('insertHTML', auraContent);
            
        } catch (e) {
            console.error(`Error during canvas action '${action}':`, e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="symbiotic-canvas-panel">
            <div className="symbiotic-canvas-toolbar">
                <button className="canvas-toolbar-button" onClick={() => handleFormat('formatBlock', '<h1>')} disabled={isProcessing}>H1</button>
                <button className="canvas-toolbar-button" onClick={() => handleFormat('formatBlock', '<h2>')} disabled={isProcessing}>H2</button>
                <button className="canvas-toolbar-button" onClick={() => handleFormat('formatBlock', '<h3>')} disabled={isProcessing}>H3</button>
                <div className="canvas-toolbar-separator" />
                <button className="canvas-toolbar-button" onClick={() => handleFormat('bold')} disabled={isProcessing}>B</button>
                <button className="canvas-toolbar-button" onClick={() => handleFormat('italic')} disabled={isProcessing}>I</button>
                <div className="canvas-toolbar-separator" />
                <button className="canvas-toolbar-button" onClick={() => handleFormat('insertUnorderedList')} disabled={isProcessing}>UL</button>
                <button className="canvas-toolbar-button" onClick={() => handleFormat('insertOrderedList')} disabled={isProcessing}>OL</button>
                <button className="canvas-toolbar-button" onClick={handleInsertCodeBlock} disabled={isProcessing}>Code</button>
                <div className="canvas-toolbar-separator" />
                 <button className="canvas-toolbar-button" onClick={() => handleFormat('removeFormat')} disabled={isProcessing} title="Clear Formatting">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor"><path d="M228-200v-55h224v-316q-59-19-97.5-66T306-750q0-85 59-144t145-59q86 0 145 59t59 144q0 65-38.5 112T580-571v316h224v55H228Z"/></svg>
                </button>
                <div className="canvas-toolbar-separator" style={{ flexGrow: 1, background: 'none' }} />
                <button className="canvas-toolbar-button" onClick={() => handleAuraAction('expand')} disabled={!selection || isProcessing}>{t('canvas_expand')}</button>
                <button className="canvas-toolbar-button" onClick={() => handleAuraAction('summarize')} disabled={!selection || isProcessing}>{t('canvas_summarize')}</button>
                <button className="canvas-toolbar-button" onClick={() => handleAuraAction('diagram')} disabled={!selection || isProcessing}>{t('canvas_diagram')}</button>
            </div>
            <div className="canvas-editor-wrapper">
                <div
                    ref={editorRef}
                    className="canvas-editor"
                    contentEditable={!isProcessing}
                    dangerouslySetInnerHTML={{ __html: symbioticCanvasState.content }}
                    onInput={handleInput}
                    onSelect={handleSelectionChange}
                    onMouseUp={handleSelectionChange} 
                    onKeyUp={handleSelectionChange}
                />
            </div>
        </div>
    );
};
