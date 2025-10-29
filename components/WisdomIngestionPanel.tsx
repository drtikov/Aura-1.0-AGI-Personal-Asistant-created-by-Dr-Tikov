// components/WisdomIngestionPanel.tsx
import React, { useState, useCallback, DragEvent } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { SafeMarkdown } from './SafeMarkdown.tsx';
import { loadSdk } from '../core/sdkLoader';

declare const pdfjsLib: any;

type Status = 'idle' | 'processing_pdf' | 'analyzing' | 'displaying_results' | 'ingesting';

export const WisdomIngestionPanel = React.memo(() => {
    const { syscall, addToast, geminiAPI } = useAuraDispatch();
    const { t } = useLocalization();

    const [status, setStatus] = useState<Status>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [markdownContent, setMarkdownContent] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleReset = () => {
        setStatus('idle');
        setStatusMessage('');
        setMarkdownContent('');
    };

    const extractImagesFromPdf = async (file: File): Promise<string[]> => {
        await loadSdk('pdfjs');
        if (typeof pdfjsLib === 'undefined') {
            throw new Error("pdf.js library not loaded.");
        }
        
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (event) => {
                try {
                    const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const pageImages: string[] = [];

                    for (let i = 1; i <= pdf.numPages; i++) {
                        setStatusMessage(`Processing page ${i} of ${pdf.numPages}...`);
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        if (context) {
                            await page.render({ canvasContext: context, viewport: viewport }).promise;
                            const base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
                            pageImages.push(base64);
                        }
                    }
                    resolve(pageImages);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFile = async (file: File | null) => {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            addToast(t('toast_wisdomIngestion_invalidFileType'), 'error');
            return;
        }

        setStatus('processing_pdf');
        setStatusMessage('Reading PDF file...');
        try {
            const pageImages = await extractImagesFromPdf(file);
            
            setStatus('analyzing');
            setStatusMessage('Analyzing document with Gemini...');
            
            const markdown = await geminiAPI.analyzePdfWithVision(pageImages);
            
            setMarkdownContent(markdown);
            setStatus('displaying_results');
            setStatusMessage('Analysis complete.');

        } catch (error) {
            console.error("Failed to process PDF:", error);
            addToast(t('toast_wisdomIngestion_pdfError'), 'error');
            handleReset();
        }
    };
    
    const handleIngestFacts = async () => {
        if (!markdownContent) return;
        setStatus('ingesting');
        setStatusMessage('Extracting facts from Markdown...');
        try {
            const facts = await geminiAPI.processCurriculumAndExtractFacts(markdownContent);
            if (facts && facts.length > 0) {
                const factsToAdd = facts.map(fact => ({
                    ...fact,
                    source: 'pdf_ingestion_docling_sim',
                }));
                syscall('ADD_FACTS_BATCH', factsToAdd);
                addToast(`Successfully ingested ${facts.length} facts into the knowledge graph.`, 'success');
                handleReset();
            } else {
                 addToast('No facts could be extracted from the document.', 'warning');
                 setStatus('displaying_results');
            }
        } catch(e) {
            console.error("Failed to ingest facts:", e);
            addToast(`Fact ingestion failed: ${(e as Error).message}`, 'error');
            setStatus('displaying_results');
        }
    };
    
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); await handleFile(e.dataTransfer.files?.[0] || null); }, [geminiAPI]);

    const renderContent = () => {
        if (status === 'idle') {
            return (
                 <div 
                    className={`wisdom-ingestion-dropzone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver} 
                    onDragLeave={handleDragLeave} 
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('doc-analysis-file-input')?.click()}
                >
                    <p>{t('docAnalysis_dropzone')}</p>
                    <input id="doc-analysis-file-input" type="file" accept=".pdf" style={{display: 'none'}} onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                </div>
            );
        }

        if (status === 'processing_pdf' || status === 'analyzing' || status === 'ingesting') {
            return (
                 <div className="generating-indicator" style={{justifyContent: 'center', minHeight: '200px'}}>
                    <div className="spinner-small"></div>
                    <span>{statusMessage}</span>
                </div>
            );
        }

        if (status === 'displaying_results' && markdownContent) {
            return (
                <div>
                    <div className="document-content" style={{maxHeight: '400px'}}>
                        <SafeMarkdown text={markdownContent} />
                    </div>
                    <div className="button-grid" style={{marginTop: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                        <button className="control-button" onClick={handleReset}>{t('docAnalysis_reset_button')}</button>
                        <button className="control-button implement-button" onClick={handleIngestFacts}>{t('docAnalysis_ingest_button')}</button>
                    </div>
                </div>
            );
        }

        return null;
    };
    
    return (
        <div className="side-panel wisdom-ingestion-panel">
            {renderContent()}
        </div>
    );
});