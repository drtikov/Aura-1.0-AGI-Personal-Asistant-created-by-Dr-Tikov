// components/TypeScriptCompilerPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const TypeScriptCompilerPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('hooks/useAura.ts');

    const handleRunCheck = () => {
        if (!filePath.trim()) {
            addToast('A file path is required to run a type check.', 'error');
            return;
        }
        syscall('EXECUTE_TOOL', {
            toolName: 'typescript_check_types',
            args: {
                filePath: filePath.trim()
            }
        });
        addToast(`TypeScript check dispatched for ${filePath}.`, 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('tsc_panel_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="tsc-path">{t('tsc_filePath')}</label>
                <input
                    id="tsc-path"
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder={t('tsc_filePath_placeholder')}
                    className="vfs-path-input"
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleRunCheck}
                    disabled={!filePath.trim()}
                >
                    {t('tsc_runCheck')}
                </button>
            </div>
             <p className="reason-text" style={{fontSize: '0.8rem', marginTop: '1rem'}}>
                {t('tsc_results_note')}
            </p>
        </div>
    );
};