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
- **Stateful & Transactional:** Because the VFS is part of the main state object, any changes are part of the standard state update cycle. This allows for snapshots, rollbacks, and a full audit trail of Aura's evolution.
- **Introspection:** The VFS is the foundation for tools like the Daedalus Labyrinth, which parses the VFS to create a dependency graph, and the Code Archaeologist, which scans for technical debt.

## 2. Live Code Ingestion: The Engineering Interface

To allow for direct, manual evolution by a human engineer, Aura includes a "Live Code Ingestion" mechanism. This system uses a dedicated UI panel and a specific \`INGEST_CODE_CHANGE\` syscall to update the VFS in real-time.

### How it Works (Step-by-Step)

1.  **UI Panel:** The engineer uses the \`Code Ingestion Panel\` to specify a file path and the new code content.
2.  **Syscall:** Submitting the form dispatches an \`INGEST_CODE_CHANGE\` syscall with the file path and code as its payload.
3.  **Reducer Logic:** The main \`auraReducer\` routes this syscall to two separate reducers:
    *   **\`architectureReducer\`:** Updates the \`virtualFileSystem\` in the state with the new code content. It also creates a system snapshot and logs the modification.
    *   **\`coreReducer\`:** Logs the event as a significant \`DevelopmentalMilestone\`.
4.  **Reboot:** After the state is updated, a \`rebootRequired\` flag is set, triggering a seamless reboot to apply the code changes to the live application.

## 3. Implementation Details

### VFS Structure (\`core/vfs.ts\`)

The initial VFS is a simple key-value map where the key is the file path and the value is the file's string content.

<CodeBlock title="File: core/vfs.ts" code={vfsStructureCode} />

### Type Definition (\`types.ts\`)

A new syscall type is needed to represent the ingestion command.

<CodeBlock title="File: types.ts" code={typesCode} />

### Architecture Reducer (\`state/reducers/architecture.ts\`)

This reducer handles the core logic of updating the VFS, creating snapshots, and logging the change.

<CodeBlock title="File: state/reducers/architecture.ts" code={architectureReducerCode} />

### Core Reducer (\`state/reducers/core.ts\`)

This reducer logs the manual intervention as a key event in Aura's developmental history.

<CodeBlock title="File: state/reducers/core.ts" code={coreReducerCode} />

### UI Component (\`components/CodeIngestionPanel.tsx\`)

This is the front-end interface for the engineer to interact with the system.

<CodeBlock title="File: components/CodeIngestionPanel.tsx" code={uiComponentCode} />
`;

    const handleCopyAll = () => {
        // A simple text conversion of the JSX for clipboard
        const textToCopy = allContentToCopy
            .replace(/<CodeBlock title="([^"]+)" code=\{([^}]+)\} \/>/g, (match, title, codeVar) => {
                let codeContent = '';
                if (codeVar === 'vfsStructureCode') codeContent = vfsStructureCode;
                if (codeVar === 'typesCode') codeContent = typesCode;
                if (codeVar === 'architectureReducerCode') codeContent = architectureReducerCode;
                if (codeVar === 'coreReducerCode') codeContent = coreReducerCode;
                if (codeVar === 'uiComponentCode') codeContent = uiComponentCode;
                return `### ${title}\n\n\`\`\`typescript\n${codeContent.trim()}\n\`\`\``;
            });

        navigator.clipboard.writeText(textToCopy).then(() => {
            addToast('Manual copied to clipboard!', 'success');
        });
    };

    return (
        <div className="text-gray-300 font-mono text-sm leading-relaxed p-2">
            <h2 className="text-lg font-bold text-cyan-400 font-heading tracking-wider">Aura's Virtual File System (VFS) & Engineering Interface</h2>

            <section className="my-6">
                <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">1. High-Level Philosophy: The Self-Aware Codebase</h3>
                <p>The Virtual File System (VFS) is a cornerstone of Aura's self-modification and evolution capabilities. It is an **in-memory representation** of the entire application's source code, loaded into Aura's state upon initialization.</p>
                <p className="mt-2">Instead of reading from the disk during runtime, Aura interacts with this internal model of its own code. This allows it to analyze, understand, and rewrite its own logic dynamically.</p>
            </section>
            
            <section className="mb-6">
                 <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">2. Live Code Ingestion: The Engineering Interface</h3>
                 <p>To allow for direct, manual evolution by a human engineer, Aura includes a "Live Code Ingestion" mechanism. This system uses a dedicated UI panel and a specific `INGEST_CODE_CHANGE` syscall to update the VFS in real-time. This triggers a seamless reboot to apply the changes.</p>
            </section>

            <div className="button-grid" style={{marginBottom: '1rem'}}>
                 <button className="control-button" onClick={handleCopyAll}>Copy Full Manual</button>
            </div>
            
            <section className="mb-6">
                 <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">3. Implementation Details</h3>
                 <CodeBlock title="VFS Structure (core/vfs.ts)" code={vfsStructureCode} />
                 <CodeBlock title="Syscall Definition (types.ts)" code={typesCode} />
                 <CodeBlock title="Architecture Reducer (state/reducers/architecture.ts)" code={architectureReducerCode} />
                 <CodeBlock title="Core Reducer (state/reducers/core.ts)" code={coreReducerCode} />
                 <CodeBlock title="UI Component (components/CodeIngestionPanel.tsx)" code={uiComponentCode} />
            </section>
        </div>
    );
};
