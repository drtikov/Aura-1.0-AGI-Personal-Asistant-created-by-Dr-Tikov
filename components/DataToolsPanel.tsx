// components/DataToolsPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

declare const Papa: any;

export const DataToolsPanel = React.memo(() => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [csvData, setCsvData] = useState('name,age,city\nAlice,30,New York\nBob,25,Paris');
    const [jsonData, setJsonData] = useState<any[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleParse = () => {
        if (!csvData.trim()) {
            addToast(t('dataTools_csv_required'), 'warning');
            return;
        }
        setIsProcessing(true);
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
                setJsonData(results.data);
                syscall('EXECUTE_TOOL', {
                    toolName: 'parse_csv_data',
                    args: { rowCount: results.data.length },
                });
                addToast(t('dataTools_parse_success', { count: results.data.length }), 'success');
                setIsProcessing(false);
            },
            error: (error: any) => {
                addToast(t('dataTools_parse_error', { message: error.message }), 'error');
                setIsProcessing(false);
            }
        });
    };

    const handleSendToMemory = () => {
        if (!jsonData || jsonData.length === 0) {
            addToast(t('dataTools_no_json'), 'warning');
            return;
        }
        const summary = `User has loaded CSV data with ${jsonData.length} rows. The columns are: ${Object.keys(jsonData[0]).join(', ')}.`;
        syscall('ADD_TO_WORKING_MEMORY', summary);
        addToast(t('dataTools_sent_to_memory'), 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('dataTools_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="csv-input">{t('dataTools_csv_input')}</label>
                <textarea
                    id="csv-input"
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    rows={8}
                    disabled={isProcessing}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                <button className="control-button" onClick={handleParse} disabled={isProcessing || !csvData.trim()}>
                    {isProcessing ? t('dataTools_parsing') : t('dataTools_parse')}
                </button>
                <button className="control-button" onClick={handleSendToMemory} disabled={!jsonData}>
                    {t('dataTools_send_to_memory')}
                </button>
            </div>
            {jsonData && (
                <div className="code-snippet-container" style={{ marginTop: '1rem' }}>
                    <pre><code>{JSON.stringify(jsonData, null, 2)}</code></pre>
                </div>
            )}
        </div>
    );
});