// components/IngestPanel.tsx
import React, { useState, useRef } from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useLocalization } from '../context/AuraContext.tsx';

export const IngestPanel = ({ onIngest, onCancel }: { onIngest: (text: string) => void, onCancel: () => void }) => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLocalization();
    const handleSubmit = () => { if (text.trim()) onIngest(text.trim()); };
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return;
        try { const fileContent = await file.text(); setText(fileContent); setFileName(file.name); } catch (e) { console.error("Could not read file", e); setFileName(t('ingestPanel_fileError')); }
    };
    const handleClearFile = () => { setText(''); setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

    return (
        <div className="ingest-panel">
            <div className="ingest-panel-content">
                <div className="ingest-body"> <h3>{t('ingestPanel_title')}</h3> <p>{t('ingestPanel_description')}</p> <textarea value={text} onChange={e => { setText(e.target.value); if (fileName) { setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; } }} placeholder={t('ingestPanel_placeholder')}></textarea>
                    <div className="ingest-file-controls">
                        {fileName ? ( <div className="ingest-file-display"> <span>{fileName}</span> <button onClick={handleClearFile} title={t('ingestPanel_clear')}></button> </div> ) : ( <> <button onClick={() => fileInputRef.current?.click()}>{t('ingestPanel_uploadButton')}</button> <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".txt,.md,.json" style={{ display: 'none' }} /> </> )}
                    </div>
                </div>
                <div className="ingest-controls"> <button onClick={onCancel}>{t('ingestPanel_cancel')}</button> <button onClick={handleSubmit} disabled={!text.trim()}>{t('ingestPanel_ingest')}</button> </div>
            </div>
        </div>
    );
};