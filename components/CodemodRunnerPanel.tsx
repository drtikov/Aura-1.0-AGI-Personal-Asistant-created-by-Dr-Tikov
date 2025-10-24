// components/CodemodRunnerPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

export const CodemodRunnerPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [targetPath, setTargetPath] = useState('components/App.tsx');
    const [script, setScript] = useState(
`// Example: Rename a component
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.JSXIdentifier, { name: 'OldComponentName' })
    .forEach(path => {
      j(path).replaceWith(j.jsxIdentifier('NewComponentName'));
    })
    .toSource();
}`
    );

    const handleRun = () => {
        if (!targetPath.trim() || !script.trim()) {
            addToast('Target path and script are required.', 'error');
            return;
        }
        syscall('EXECUTE_TOOL', {
            toolName: 'jscodeshift_transform',
            args: {
                targetPath: targetPath.trim(),
                transformationScript: script,
            }
        });
        addToast('Codemod transformation has been dispatched.', 'info');
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('codemod_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="codemod-path">{t('codemod_targetPath')}</label>
                <input
                    id="codemod-path"
                    type="text"
                    value={targetPath}
                    onChange={(e) => setTargetPath(e.target.value)}
                    placeholder={t('codemod_targetPath_placeholder')}
                    className="vfs-path-input"
                />
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="codemod-script">{t('codemod_script')}</label>
                <textarea
                    id="codemod-script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder={t('codemod_script_placeholder')}
                    rows={10}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button
                    className="control-button"
                    onClick={handleRun}
                    disabled={!targetPath.trim() || !script.trim()}
                >
                    {t('codemod_run')}
                </button>
            </div>
        </div>
    );
};