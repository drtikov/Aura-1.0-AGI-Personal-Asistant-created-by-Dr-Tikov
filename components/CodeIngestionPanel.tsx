// components/CodeIngestionPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { HAL } from '../core/hal';

export const CodeIngestionPanel = React.memo(() => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('');
    const [code, setCode] = useState('');

    const handleImplement = () => {
        if (!filePath.trim() || !code.trim()) {
            addToast(t('liveCodeIngestion_error_toast'), 'error');
            return;
        }

        if (HAL.UI.confirm(t('liveCodeIngestion_confirm_message', { filePath }))) {
            syscall('INGEST_CODE_CHANGE', { filePath, code });
            addToast(t('liveCodeIngestion_success_toast', { filePath }), 'success');
            setFilePath('');
            setCode('');
        }
    };

    return (
        <div className="side-panel p-2 flex flex-col gap-4">
            <p className="text-xs text-gray-400 italic">
                {t('liveCodeIngestion_description')}
            </p>
            <div className="flex flex-col gap-2">
                <label htmlFor="ingest-path" className="text-sm font-bold text-cyan-400">{t('liveCodeIngestion_path')}</label>
                <input
                    id="ingest-path"
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder={t('liveCodeIngestion_path_placeholder')}
                    className="bg-black bg-opacity-30 border border-cyan-500/20 p-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
            </div>
             <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="ingest-code" className="text-sm font-bold text-cyan-400">{t('liveCodeIngestion_code')}</label>
                <textarea
                    id="ingest-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('liveCodeIngestion_code_placeholder')}
                    className="bg-black bg-opacity-30 border border-cyan-500/20 p-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 h-48 resize-y"
                />
            </div>
            <div className="flex justify-end">
                <button
                    className="control-button review-button w-full"
                    onClick={handleImplement}
                    disabled={!filePath.trim() || !code.trim()}
                >
                    {t('liveCodeIngestion_implement_button')}
                </button>
            </div>
        </div>
    );
});