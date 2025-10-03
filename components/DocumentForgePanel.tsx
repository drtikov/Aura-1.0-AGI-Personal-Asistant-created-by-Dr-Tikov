import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

// The jsPDF library is loaded from CDN in index.html
declare const jspdf: any;

export const DocumentForgePanel = () => {
    const { documentForgeState } = useArchitectureState();
    const { t } = useLocalization();
    const { status, document, statusMessage, error } = documentForgeState;

    const handleDownloadPdf = () => {
        if (!document) return;

        const { jsPDF } = jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxLineWidth = pageWidth - margin * 2;
        let y = 20;

        const addText = (text: string, size: number, isBold: boolean = false) => {
            doc.setFontSize(size);
            doc.setFont(undefined, isBold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, maxLineWidth);
            lines.forEach((line: string) => {
                if (y > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += size * 0.7; // line height
            });
            y += size * 0.5; // space after paragraph
        };

        addText(document.title, 18, true);
        y += 10;

        document.chapters.forEach(chapter => {
            addText(chapter.title, 14, true);
            if (chapter.content) {
                addText(chapter.content, 10);
            }

            if (chapter.diagram?.imageUrl) {
                 if (y > doc.internal.pageSize.getHeight() - 150) { // Check if there's enough space for an image
                    doc.addPage();
                    y = margin;
                }
                try {
                    // Assuming imageUrl is a data URL (base64)
                    doc.addImage(chapter.diagram.imageUrl, 'JPEG', margin, y, maxLineWidth, maxLineWidth * (9/16));
                    y += (maxLineWidth * (9/16)) + 20;
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                    addText("[Error: Could not embed diagram]", 8);
                }
            }
        });

        doc.save(`${document.title.replace(/\s+/g, '_')}.pdf`);
    };

    const totalChapters = document?.chapters.length || 0;
    const completedChapters = document?.chapters.filter(c => c.content).length || 0;

    return (
        <div className="document-forge-panel">
            <div className="forge-status-bar">
                <span>Status:</span>
                <strong>{statusMessage || status}</strong>
                {status === 'generating_content' && <span>({completedChapters}/{totalChapters})</span>}
            </div>

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
                            {chapter.content && <p className="chapter-content">{chapter.content}</p>}

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
                <div className="kg-placeholder" style={{ minHeight: '200px' }}>
                    {t('documentForge_placeholder')}
                </div>
            )}
            
            <div className="forge-actions">
                <button
                    className="control-button"
                    onClick={handleDownloadPdf}
                    disabled={status !== 'complete'}
                >
                    {t('documentForge_downloadPdf')}
                </button>
            </div>
        </div>
    );
};
