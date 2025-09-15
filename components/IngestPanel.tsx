import React, { useState, useRef } from 'react';

export const IngestPanel = ({ onIngest, onCancel }: { onIngest: (text: string) => void, onCancel: () => void }) => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = () => { if (text.trim()) onIngest(text.trim()); };
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return;
        try { const fileContent = await file.text(); setText(fileContent); setFileName(file.name); } catch (e) { console.error("Could not read file", e); setFileName('Error: Could not read file as text.'); }
    };
    const handleClearFile = () => { setText(''); setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

    return (
        <div className="ingest-panel">
            <div className="ingest-panel-content">
                <div className="ingest-body"> <h3>Ingest Raw Data</h3> <p>Paste text below, or upload a file. Aura will autonomously extract facts and add them to the knowledge graph.</p> <textarea value={text} onChange={e => { setText(e.target.value); if (fileName) { setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; } }} placeholder="Paste raw text here or upload a file..."></textarea>
                    <div className="ingest-file-controls">
                        {fileName ? ( <div className="ingest-file-display"> <span>{fileName}</span> <button onClick={handleClearFile} title="Clear">&times;</button> </div> ) : ( <> <button onClick={() => fileInputRef.current?.click()}>Upload File (.txt, .md, .json)</button> <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.md,.json" style={{ display: 'none' }} /> </> )}
                    </div>
                </div>
                <div className="ingest-controls"> <button onClick={onCancel}>Cancel</button> <button onClick={handleSubmit} disabled={!text.trim()}>Ingest</button> </div>
            </div>
        </div>
    );
};
