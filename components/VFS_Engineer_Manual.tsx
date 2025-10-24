// components/VFS_Engineer_Manual.tsx
import React from 'react';
import { useAuraDispatch } from '../context/AuraContext.tsx';

const CodeBlock = ({ title, code, language = 'typescript' }: { title: string; code: string; language?: string }) => {
    const { addToast } = useAuraDispatch();

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            addToast('Code snippet copied to clipboard!', 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast('Failed to copy code.', 'error');
        });
    };

    return (
        <div className="my-4">
            <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 mb-2">{title}</h4>
            <div className="relative code-snippet-container bg-black bg-opacity-30 border border-cyan-500/20 rounded-md">
                <pre className="p-4 text-xs overflow-x-auto text-gray-200">
                    <code className={`language-${language}`}>{code.trim()}</code>
                </pre>
                <button
                    className="copy-snippet-button bg-gray-700 hover:bg-cyan-500 hover:text-black"
                    onClick={handleCopy}
                    title="Copy Code"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                </button>
            </div>
        </div>
    );
};


export const VFS_Engineer_Manual = () => {
    const { addToast } = useAuraDispatch();

    const vfsStructureCode = `
{
  "components/CoreMonitor.tsx": "import React from 'react'; ... (full file content)",
  "hooks/useAura.ts": "import { useCallback } from 'react'; ... (full file content)",
  "state/reducers/core.ts": "... (full file content) ..."
}
    `;

    const typesCode = `
// Add this to the main Action union type
export type Action =
  // ... other actions
  | { type: 'INGEST_CODE_CHANGE', payload: { filePath: string; code: string } };
    `;

    const architectureReducerCode = `
case 'INGEST_CODE_CHANGE': {
    const { filePath, code } = action.payload;
    const newModLog: ModificationLogEntry = {
        id: self.crypto.randomUUID(),
        timestamp: Date.now(),
        description: \`Manual code ingestion for: \${filePath}\`,
        gainType: 'INNOVATION',
        validationStatus: 'validated', // Manual changes are assumed to be validated
        isAutonomous: false,
    };
    return {
        selfProgrammingState: {
            ...state.selfProgrammingState,
            virtualFileSystem: {
                ...state.selfProgrammingState.virtualFileSystem,
                [filePath]: code,
            }
        },
        modificationLog: [newModLog, ...state.modificationLog].slice(-50),
        systemSnapshots: [
            ...state.systemSnapshots,
            { id: self.crypto.randomUUID(), timestamp: Date.now(), reason: \`Pre-ingestion of \${filePath}\`, state: state }
        ].slice(-10)
    };
}
    `;

    const coreReducerCode = `
case 'INGEST_CODE_CHANGE': {
    const { filePath } = action.payload;
    const newMilestone = {
        id: self.crypto.randomUUID(),
        timestamp: Date.now(),
        title: 'Manual Code Ingestion',
        description: \`A user or external agent directly modified the file: \${filePath}\`,
    };
    return {
        developmentalHistory: {
            ...state.developmentalHistory,
            milestones: [...state.developmentalHistory.milestones, newMilestone]
        }
    };
}
    `;

    const uiComponentCode = `
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext';

export const CodeIngestionPanel = React.memo(() => {
    const { dispatch, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [filePath, setFilePath] = useState('');
    const [code, setCode] = useState('');

    const handleImplement = () => {
        if (!filePath.trim() || !code.trim()) {
            addToast(t('liveCodeIngestion_error_toast'), 'error');
            return;
        }

        if (window.confirm(t('liveCodeIngestion_confirm_message', { filePath }))) {
            dispatch({ type: 'INGEST_CODE_CHANGE', payload: { filePath, code } });
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
                <label htmlFor="ingest-path" className="text-sm font-bold text-cyan-400">{t('liveCodeIngestion_path_label')}</label>
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
                <label htmlFor="ingest-code" className="text-sm font-bold text-cyan-400">{t('liveCodeIngestion_code_label')}</label>
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
    `;

    const allContentToCopy = `
# Aura's Virtual File System (VFS) & Engineering Interface

## 1. Understanding the Virtual File System (VFS)

### Core Concept
The Virtual File System (VFS) is a cornerstone of Aura's self-modification and evolution capabilities. It is an **in-memory representation** of the entire application's source code, loaded into Aura's state upon initialization.

Instead of reading from the disk during runtime, Aura interacts with this internal model of its own code. This allows it to analyze, understand, and rewrite its own logic dynamically.

### Architectural Significance
- **True Self-Modification:** Provides the direct read/write access necessary for an AI to modify its own source code and evolve.
- **Stateful & Transactional:** Because the VFS is part of the main \\\`AuraState\\\`, changes are handled by the reducer. This ensures modifications are atomic, predictable, and can be snapshotted for safety.
- **Full Contextual Awareness:** Aura has access to its entire codebase simultaneously, allowing for holistic analysis of dependencies and architectural patterns before proposing a change.
- **Persistence of Evolution:** As the VFS is saved to IndexedDB (the "Memristor") along with the rest of the state, any code modifications Aura makes will persist across browser sessions.

### Data Structure
The VFS is stored in the state at \\\`state.selfProgrammingState.virtualFileSystem\\\`. It's a simple JavaScript object where keys are full file paths and values are the string content of those files.

\\\`\\\`\\\`json
// Example VFS Structure
${vfsStructureCode.trim()}
\\\`\\\`\\\`

---

## 2. The Engineering Function: Direct Code Ingestion

### Overview
The "Engineer Function" provides a direct interface for an external agent (a human developer or another AI) to modify the VFS. This is achieved by dispatching a specific action (\\\`INGEST_CODE_CHANGE\\\`) with the target file path and its new content.

### The Action: \\\`INGEST_CODE_CHANGE\\\`
To initiate a change, this action must be dispatched. It is defined in \\\`types.ts\\\` and added to the main \\\`Action\\\` union type.

\\\`\\\`\\\`typescript
// File: types.ts
${typesCode.trim()}
\\\`\\\`\\\`

### Reducer Logic
The logic is split between two reducers to maintain separation of concerns. The \\\`architectureReducer\\\` handles the VFS update and safety logging, while the \\\`coreReducer\\\` records the event in Aura's developmental timeline.

\\\`\\\`\\\`typescript
// File: state/reducers/architecture.ts
${architectureReducerCode.trim()}
\\\`\\\`\\\`

\\\`\\\`\\\`typescript
// File: state/reducers/core.ts
${coreReducerCode.trim()}
\\\`\\\`\\\`

### The UI Component: \\\`CodeIngestionPanel.tsx\\\`
This component provides the user interface for the engineering function. It allows specifying the target file and pasting the new code, then dispatches the \\\`INGEST_CODE_CHANGE\\\` action after a confirmation.

\\\`\\\`\\\`typescript
// File: components/CodeIngestionPanel.tsx
${uiComponentCode.trim()}
\\\`\\\`\\\`
`.trim();

    const handleCopyAll = () => {
        navigator.clipboard.writeText(allContentToCopy).then(() => {
            addToast('Full manual and code copied to clipboard!', 'success');
        }, (err) => {
            console.error('Could not copy manual: ', err);
            addToast('Failed to copy the manual.', 'error');
        });
    };


    return (
        <div className="text-gray-300 font-mono text-sm leading-relaxed p-2">
            <div className="flex justify-between items-center mb-4 border-b border-cyan-500/20 pb-2">
                 <h2 className="text-lg font-bold text-cyan-400 font-heading tracking-wider">Aura's VFS & Engineering Interface</h2>
                 <button
                    onClick={handleCopyAll}
                    className="control-button py-2 px-4 text-xs"
                    title="Copy the entire manual text and code to clipboard"
                >
                    Copy Full Manual
                </button>
            </div>
            
            <section className="mb-6">
                <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">1. Understanding the Virtual File System (VFS)</h3>
                
                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Core Concept</h4>
                <p className="mb-3">
                    The Virtual File System (VFS) is a cornerstone of Aura's self-modification and evolution capabilities. It is an **in-memory representation** of the entire application's source code, loaded into Aura's state upon initialization.
                </p>
                <p>
                    Instead of reading from the disk during runtime, Aura interacts with this internal model of its own code. This allows it to analyze, understand, and rewrite its own logic dynamically.
                </p>

                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Architectural Significance</h4>
                 <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>True Self-Modification:</strong> Provides the direct read/write access necessary for an AI to modify its own source code and evolve.</li>
                    <li><strong>Stateful & Transactional:</strong> Because the VFS is part of the main `AuraState`, changes are handled by the reducer. This ensures modifications are atomic, predictable, and can be snapshotted for safety.</li>
                    <li><strong>Full Contextual Awareness:</strong> Aura has access to its entire codebase simultaneously, allowing for holistic analysis of dependencies and architectural patterns before proposing a change.</li>
                    <li><strong>Persistence of Evolution:</strong> As the VFS is saved to IndexedDB (the "Memristor") along with the rest of the state, any code modifications Aura makes will persist across browser sessions.</li>
                </ul>

                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Data Structure</h4>
                <p className="mb-2">
                    The VFS is stored in the state at `state.selfProgrammingState.virtualFileSystem`. It's a simple JavaScript object where keys are full file paths and values are the string content of those files.
                </p>
                <CodeBlock title="Example VFS Structure" language="json" code={vfsStructureCode} />
            </section>

             <section>
                <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">2. The Engineering Function: Direct Code Ingestion</h3>
                
                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Overview</h4>
                <p className="mb-3">
                    The "Engineer Function" provides a direct interface for an external agent (a human developer or another AI) to modify the VFS. This is achieved by dispatching a specific action (`INGEST_CODE_CHANGE`) with the target file path and its new content.
                </p>

                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">The Action: `INGEST_CODE_CHANGE`</h4>
                <p className="mb-3">
                    To initiate a change, this action must be dispatched. It is defined in `types.ts` and added to the main `Action` union type.
                </p>
                <CodeBlock title="File: types.ts" language="typescript" code={typesCode} />

                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Reducer Logic</h4>
                <p className="mb-3">
                    The logic is split between two reducers to maintain separation of concerns. The `architectureReducer` handles the VFS update and safety logging, while the `coreReducer` records the event in Aura's developmental timeline.
                </p>
                <CodeBlock title="File: state/reducers/architecture.ts" language="typescript" code={architectureReducerCode} />
                <CodeBlock title="File: state/reducers/core.ts" language="typescript" code={coreReducerCode} />

                <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">The UI Component: `CodeIngestionPanel.tsx`</h4>
                <p className="mb-3">
                    This component provides the user interface for the engineering function. It allows specifying the target file and pasting the new code, then dispatches the `INGEST_CODE_CHANGE` action after a confirmation.
                </p>
                <CodeBlock title="File: components/CodeIngestionPanel.tsx" language="typescript" code={uiComponentCode} />
            </section>
        </div>
    );
};
