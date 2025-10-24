// components/LintingResultsPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const LintingResultsPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('hooks/useAura.ts');

    const handleRunScan = () => {
        if (!filePath.trim()) {
            addToast('A file path is required to run a scan.', 'error');
            return;
        }
        syscall('EXECUTE_TOOL', {
            toolName: 'eslint_scan',
            args: {
                filePath: filePath.trim()
            }
        });
        addToast(`ESLint scan dispatched for ${filePath}.`, 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('linting_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="lint-path">{t('linting_filePath')}</label>
                <input
                    id="lint-path"
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder={t('linting_filePath_placeholder')}
                    className="vfs-path-input"
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleRunScan}
                    disabled={!filePath.trim()}
                >
                    {t('linting_runScan')}
                </button>
            </div>
             <p className="reason-text" style={{fontSize: '0.8rem', marginTop: '1rem'}}>
                {t('linting_results_note')}
            </p>
        </div>
    );
};