// components/DocumentForgeContainerModal.tsx
import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { useLocalization, useAuraDispatch, useArchitectureState } from '../context/AuraContext.tsx';
import { loadSdk } from '../core/sdkLoader';

// The jsPDF library is loaded dynamically now
declare const jspdf: any;

export const DocumentForgeContainerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const { t } = useLocalization();
    const { handleStartDocumentForge, syscall } = useAuraDispatch();
    const { documentForgeState } = useArchitectureState();
    const { isActive, status, document, statusMessage, error, goal } = documentForgeState;

    const [localGoal, setLocalGoal] = useState('');

    const handleBegin = () => {
        if (localGoal.trim()) {
            handleStartDocumentForge(localGoal.trim());
        }
    };
    
    const handleReset = () => {
        syscall('DOCUMENT_FORGE/RESET', {});
        setLocalGoal('');
    }

    const handleDownloadPdf = async () => {
        if (!document) return;
        
        await loadSdk('jspdf');
        if (typeof jspdf === 'undefined') {
            console.error("jspdf library not loaded.");
            return;
        }

        const { jsPDF } = jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const maxLineWidth = pageWidth - margin * 2;
        let y = 40; // Current y position

        const checkAndAddPage = (neededHeight: number) => {
            if (y + neededHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        const titleLines = doc.splitTextToSize(document.title, maxLineWidth);
        checkAndAddPage(titleLines.length * 18 * 1.15);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 18 * 1.15;
        y += 20; // Space after title

        // Chapters
        document.chapters.forEach(chapter => {
            // Chapter Title
            checkAndAddPage(16 * 1.15 + 10);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            const chapterTitleLines = doc.splitTextToSize(chapter.title, maxLineWidth);
            doc.text(chapterTitleLines, margin, y);
            y += chapterTitleLines.length * 14 * 1.15;
            y += 10;

            // Chapter Content
            if (chapter.content) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const contentLines = doc.splitTextToSize(chapter.content.replace(/\|/g, ' '), maxLineWidth);
                
                contentLines.forEach((line: string) => {
                    checkAndAddPage(10 * 1.15); // Check for space for a single line
                    doc.text(line, margin, y);
                    y += 10 * 1.15; // Increment y by one line height
                });
                y += 15; // Space after content
            }

            // Diagram
            if (chapter.diagram?.imageUrl) {
                const imgHeight = maxLineWidth * (9 / 16); // Assuming 16:9 aspect ratio
                
                doc.setFontSize(8);
                doc.setFont(undefined, 'italic');
                const captionLines = doc.splitTextToSize(t('documentForge_diagram_caption', { description: chapter.diagram.description }), maxLineWidth);
                
                checkAndAddPage(captionLines.length * 8 * 1.15 + 5 + imgHeight + 20); // Check for caption + image
                
                doc.text(captionLines, margin, y);
                y += captionLines.length * 8 * 1.15 + 5;
                
                try {
                    doc.addImage(chapter.diagram.imageUrl, 'PNG', margin, y, maxLineWidth, imgHeight);
                    y += imgHeight + 20;
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                    checkAndAddPage(8 * 1.15);
                    doc.text("[Error: Could not embed diagram]", margin, y);
                    y += 8 * 1.15 + 20;
                }
            }
        });

        doc.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
    };

    const totalChapters = document?.chapters.length || 0;
    const completedChapters = document?.chapters.filter(c => c.content).length || 0;

    const renderInputView = () => (
        <div className="trace-section">
            <h4>{t('documentForge_modal_heading')}</h4>
            <p>{t('documentForge_modal_description')}</p>
            <textarea
                value={localGoal}
                onChange={e => setLocalGoal(e.target.value)}
                placeholder={t('documentForge_modal_placeholder')}
                rows={4}
                disabled={isActive}
            />
            <div className="modal-footer">
                <button className="proposal-reject-button" onClick={onClose} disabled={isActive}>{t('documentForge_modal_cancel')}</button>
                <button className="proposal-approve-button" onClick={handleBegin} disabled={isActive || !localGoal.trim()}>{t('documentForge_modal_begin')}</button>
            </div>
        </div>
    );
    
    const renderProgressView = () => (
        <div className="document-forge-panel">
            <div className="forge-status-bar">
                <span>Status:</span>
                <strong>{statusMessage || status}</strong>
                {(status === 'generating_content' || status === 'generating_diagrams') && <span>({completedChapters}/{totalChapters})</span>}
            </div>
            
             <p className="reason-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)'}}>
                <strong>Goal:</strong> "{goal}"
            </p>

            {error && <div className="failure-reason-display">{error}</div>}

            {document ? (
                <div className="document-content">
                    <h3 className="document-title">{document.title}</h3>
                    {document.chapters.map(chapter => (
                        <div key={chapter.id} className="document-chapter">
                            <h4 className="chapter-title">{chapter.title}</h4>
                            {chapter.isGenerating && !chapter.content && (
                                <div className="generating-indicator">
                                    <div className="spinner-small"></div>
                                    <span>{t('documentForge_generating_content')}</span>
                                </div>
                            )}
                            {chapter.content && <p className="chapter-content">{chapter.content.replace(/\|/g, ' ')}</p>}

                            {chapter.diagram && (
                                <div className="diagram-placeholder">
                                    <p>{chapter.diagram.description}</p>
                                    {chapter.diagram.isGenerating && (
                                        <div className="generating-indicator">
                                            <div className="spinner-small"></div>
                                            <span>{t('documentForge_generating_diagram')}</span>
                                        </div>
                                    )}
                                    {chapter.diagram.imageUrl && <img src={chapter.diagram.imageUrl} alt={chapter.diagram.description} />}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="kg-placeholder" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="spinner-small"></div>
                    <span>{statusMessage || t('documentForge_placeholder')}</span>
                </div>
            )}
            
            <div className="modal-footer">
                <button
                    className="proposal-reject-button"
                    onClick={handleReset}
                    disabled={status !== 'complete' && status !== 'error'}
                >
                    Start New Document
                </button>
                <button
                    className="proposal-approve-button"
                    onClick={handleDownloadPdf}
                    disabled={status !== 'complete'}
                >
                    {t('documentForge_downloadPdf')}
                </button>
            </div>
        </div>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={t('documentForge_modal')}
            className="document-forge-container-modal"
        >
            <div className="modal-body">
                {isActive ? renderProgressView() : renderInputView()}
            </div>
        </Modal>
    );
};