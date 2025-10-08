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
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const maxLineWidth = pageWidth - margin * 2;
        let y = 40;

        const checkPageBreak = (neededHeight: number) => {
            if (y + neededHeight > pageHeight - margin) {
                doc.addPage();
                y = margin;
                return true;
            }
            return false;
        };
        
        const drawTable = (tableData: string[][]) => {
            if (tableData.length === 0) return;

            const rowHeight = 20;
            const cellPadding = 5;
            const numColumns = tableData[0].length;
            const colWidth = maxLineWidth / numColumns;
            
            const drawHeader = () => {
                doc.setFont(undefined, 'bold');
                doc.setFontSize(9);
                doc.setFillColor(230, 230, 230);
                doc.rect(margin, y, maxLineWidth, rowHeight, 'F');
                tableData[0].forEach((cell, i) => {
                    const text = doc.splitTextToSize(cell, colWidth - cellPadding * 2);
                    doc.text(text, margin + (i * colWidth) + cellPadding, y + rowHeight / 2, { verticalAlign: 'middle' });
                });
                 y += rowHeight;
            };

            checkPageBreak(rowHeight * 2); // Check space for header + one row
            drawHeader();

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);

            for (let i = 1; i < tableData.length; i++) {
                if (checkPageBreak(rowHeight)) {
                    drawHeader(); // Redraw header on new page
                }
                
                tableData[i].forEach((cell, j) => {
                    const text = doc.splitTextToSize(cell, colWidth - cellPadding * 2);
                    doc.text(text, margin + (j * colWidth) + cellPadding, y + rowHeight / 2, { verticalAlign: 'middle' });
                });

                // Draw lines
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, y, margin + maxLineWidth, y); // Top line of row
                
                y += rowHeight;
            }

            // Final bottom line
            doc.line(margin, y, margin + maxLineWidth, y);

            // Vertical lines
            for (let i = 0; i <= numColumns; i++) {
                 doc.line(margin + (i * colWidth), y - (tableData.length * rowHeight), margin + (i * colWidth), y);
            }
        };

        const addContent = (text: string, size: number, isBold: boolean = false) => {
            doc.setFontSize(size);
            doc.setFont(undefined, isBold ? 'bold' : 'normal');

            const lines = text.split('\n');
            const tableRows: string[][] = [];

            const processTable = () => {
                if (tableRows.length > 0) {
                    drawTable(tableRows);
                    tableRows.length = 0; // Clear the buffer
                }
            };
            
            lines.forEach(line => {
                if (line.startsWith('|') && line.endsWith('|')) {
                    const cells = line.slice(1, -1).split('|').map(c => c.trim());
                    if (tableRows.length > 0 && tableRows[0].length !== cells.length) {
                        processTable(); // process existing table if column count changes
                    }
                    tableRows.push(cells);
                } else {
                    processTable(); // process any collected table rows
                    const textLines = doc.splitTextToSize(line, maxLineWidth);
                    checkPageBreak(textLines.length * size * 0.7 + (size * 0.5));
                    doc.text(textLines, margin, y);
                    y += (textLines.length * size * 0.7) + (size * 0.5);
                }
            });

            processTable(); // process any remaining table at the end
        };

        addContent(document.title, 18, true);
        y += 10;

        document.chapters.forEach(chapter => {
            checkPageBreak(40);
            addContent(chapter.title, 14, true);
            if (chapter.content) {
                addContent(chapter.content, 10);
            }

            if (chapter.diagram?.imageUrl) {
                const imgHeight = maxLineWidth * (9/16);
                checkPageBreak(imgHeight + 20);
                addContent(t('documentForge_diagram_caption', { description: chapter.diagram.description }), 8);
                y += 5;
                try {
                    doc.addImage(chapter.diagram.imageUrl, 'PNG', margin, y, maxLineWidth, imgHeight);
                    y += imgHeight + 20;
                } catch (e) {
                    console.error("Failed to add image to PDF:", e);
                    addContent("[Error: Could not embed diagram]", 8);
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
            
            <div className="standalone-panel" style={{background: 'rgba(0,0,0,0.2)', padding: '0.5rem'}}>
                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                    <strong>Tip:</strong> The AI can now generate diagrams and tables.
                    For diagrams, include a request in your goal (e.g., "...with a diagram of the system").
                    For tables, the AI will use markdown: <code>| Header | ... |</code>
                </p>
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