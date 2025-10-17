// components/WisdomIngestionPanel.tsx
import React, { useState, useCallback, DragEvent } from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { ProposedAxiom } from '../types';

declare const pdfjsLib: any;

export const WisdomIngestionPanel = React.memo(() => {
    const { wisdomIngestionState } = useArchitectureState();
    const { handleIngestWisdom, handleProcessAxiom, handleResetWisdomIngestion, handleApproveAllAxioms, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const extractTextFromPdf = async (file: File): Promise<string> => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async (event) => {
                try {
                    const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    let textContent = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const text = await page.getTextContent();
                        textContent += text.items.map((item: any) => item.str).join(' ');
                        textContent += '\n\n'; // Add space between pages
                    }
                    resolve(textContent);
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

        if (file.type === 'text/plain' || file.type === 'text/markdown') {
            const content = await file.text();
            handleIngestWisdom(content);
        } else if (file.type === 'application/pdf') {
            setIsProcessingFile(true);
            try {
                const content = await extractTextFromPdf(file);
                handleIngestWisdom(content);
            } catch (error) {
                console.error("Failed to process PDF:", error);
                addToast(t('toast_wisdomIngestion_pdfError'), 'error');
            } finally {
                setIsProcessingFile(false);
            }
        } else {
            addToast(t('toast_wisdomIngestion_invalidFileType'), 'error');
        }
    };
    
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); await handleFile(e.dataTransfer.files?.[0] || null); }, [handleIngestWisdom]);

    const renderContent = () => {
        if (isProcessingFile) {
            return (
                <div className="generating-indicator" style={{ justifyContent: 'center', minHeight: '200px' }}>
                    <div className="spinner-small"></div>
                    <span>{t('wisdomIngestion_processing_pdf')}</span>
                </div>
            );
        }

        switch(wisdomIngestionState.status) {
            case 'analyzing':
                return (
                     <div className="generating-indicator" style={{justifyContent: 'center', minHeight: '200px'}}>
                        <div className="spinner-small"></div>
                        <span>{t('wisdomIngestion_analyzing')}</span>
                    </div>
                );

            case 'error':
                return (
                    <div className="failure-reason-display">
                        <strong>{t('wisdomIngestion_error')}:</strong>
                        <p>{wisdomIngestionState.errorMessage}</p>
                        <div className="button-grid" style={{marginTop: '1rem'}}>
                            <button className="control-button" onClick={handleResetWisdomIngestion}>{t('wisdomIngestion_tryAgain')}</button>
                        </div>
                    </div>
                );
            
            case 'complete':
                const proposedAxioms = wisdomIngestionState.proposedAxioms.filter(a => a.status === 'proposed');
    
                const handleApproveAll = () => {
                    if (proposedAxioms.length > 0) {
                        handleApproveAllAxioms(proposedAxioms);
                    }
                };

                return (
                    <div>
                        {wisdomIngestionState.proposedAxioms.map(axiom => (
                            <div key={axiom.id} className={`axiom-card ${axiom.status}`}>
                                <p className="axiom-card-text">"{axiom.axiom}"</p>
                                <p className="axiom-card-source"><strong>{t('wisdomIngestion_source')}:</strong> "{axiom.source}"</p>
                                {axiom.status === 'proposed' && (
                                    <div className="proposal-actions-footer">
                                        <button className="control-button reject-button" onClick={() => handleProcessAxiom(axiom, 'rejected')}>{t('proposalReview_reject')}</button>
                                        <button className="control-button implement-button" onClick={() => handleProcessAxiom(axiom, 'accepted')}>{t('proposalReview_approve')}</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="button-grid" style={{marginTop: '1rem', gridTemplateColumns: proposedAxioms.length > 0 ? '1fr 1fr' : '1fr'}}>
                            {proposedAxioms.length > 0 && (
                                <button className="control-button implement-button" onClick={handleApproveAll}>{t('wisdomIngestion_approveAll')}</button>
                            )}
                            <button className="control-button" onClick={handleResetWisdomIngestion}>{t('wisdomIngestion_ingestNew')}</button>
                        </div>
                    </div>
                );

            case 'idle':
            default:
                return (
                    <div 
                        className={`wisdom-ingestion-dropzone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver} 
                        onDragLeave={handleDragLeave} 
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('wisdom-file-input')?.click()}
                    >
                        <p>{t('wisdomIngestion_dropzone')}</p>
                        <input id="wisdom-file-input" type="file" accept=".txt,.md,.pdf" style={{display: 'none'}} onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                    </div>
                );
        }
    };
    
    return (
        <div className="side-panel wisdom-ingestion-panel">
            {renderContent()}
        </div>
    );
});