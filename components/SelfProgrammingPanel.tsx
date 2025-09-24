// components/SelfProgrammingPanel.tsx
import React, { useState } from 'react';
import { useArchitectureState, useLocalization, useAuraDispatch } from '../context/AuraContext';
import { SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate } from '../types';

// FIX: Wrapped the component in `React.memo` to correctly handle the `key` prop when used in a list, resolving a TypeScript error.
const CodeSnippet = React.memo(({ code, title }: { code: string, title?: string }) => {
    const { addToast } = useAuraDispatch();
    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            addToast('Code copied to clipboard!', 'success');
        }, () => {
            addToast('Failed to copy code.', 'error');
        });
    };
    return (
        <div className="code-snippet-container vfs-viewer">
            {title && <div className="panel-subsection-title" style={{ marginTop: 0, marginBottom: '0.5rem' }}>{title}</div>}
            <pre><code>{code}</code></pre>
            <button className="copy-snippet-button" onClick={handleCopy} title="Copy Snippet">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
        </div>
    );
});

const CandidateDetails = ({ candidate }: { candidate: SelfProgrammingCandidate }) => {
    const { t } = useLocalization();
    
    if (candidate.type === 'CREATE') {
        const createCandidate = candidate as CreateFileCandidate;
        return (
            <>
                <CodeSnippet code={createCandidate.newFile.content} title={`${t('selfProgramming_newComponentTitle')}: ${createCandidate.newFile.path}`} />
                {createCandidate.integrations.length > 0 && (
                    <div style={{marginTop: '1rem'}}>
                        <div className="panel-subsection-title">{t('selfProgramming_integrationPlanTitle')}</div>
                        {createCandidate.integrations.map((mod, index) => (
                            <CodeSnippet key={index} code={mod.newContent} title={`${t('selfProgramming_modificationTitle')}: ${mod.filePath}`} />
                        ))}
                    </div>
                )}
            </>
        );
    }

    if (candidate.type === 'MODIFY') {
        const modifyCandidate = candidate as ModifyFileCandidate;
        return <CodeSnippet code={modifyCandidate.codeSnippet} title={`${t('selfProgramming_modificationTitle')}: ${modifyCandidate.targetFile}`} />;
    }

    return null;
};


export const SelfProgrammingPanel = React.memo(() => {
    const { selfProgrammingState } = useArchitectureState();
    const { dispatch } = useAuraDispatch();
    const { t } = useLocalization();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

    const { virtualFileSystem, candidates } = selfProgrammingState;
    const filePaths = Object.keys(virtualFileSystem).sort();
    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

    const handleSelectFile = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFile(e.target.value);
    };

    const handleImplement = (id: string) => {
        if (window.confirm("Implement this autonomous code change? This will modify Aura's source code in the Virtual File System.")) {
            dispatch({ type: 'IMPLEMENT_SELF_PROGRAMMING_CANDIDATE', payload: { id } });
        }
    };

    return (
        <div className="side-panel self-programming-panel">
            <div className="panel-subsection-title">{t('selfProgramming_vfs')}</div>
            <div className="vfs-controls">
                <select onChange={handleSelectFile} value={selectedFile || ''}>
                    <option value="" disabled>{t('selfProgramming_selectFile')}</option>
                    {filePaths.map(path => (
                        <option key={path} value={path}>{path}</option>
                    ))}
                </select>
            </div>
            {selectedFile && <CodeSnippet code={virtualFileSystem[selectedFile]} />}

            <div className="panel-subsection-title">{t('selfProgramming_candidates')}</div>
            {candidates.length === 0 ? (
                <div className="kg-placeholder">{t('selfProgramming_noCandidates')}</div>
            ) : (
                candidates.map(candidate => (
                    <div key={candidate.id} className={`rie-insight-item type-${candidate.type} ${selectedCandidateId === candidate.id ? 'selected' : ''}`}>
                        <div className="rie-insight-header" onClick={() => setSelectedCandidateId(prev => prev === candidate.id ? null : candidate.id)} style={{cursor: 'pointer'}}>
                            <span className={`proposal-title-${candidate.type}`}>{candidate.type}: {candidate.type === 'CREATE' ? (candidate as CreateFileCandidate).newFile.path : (candidate as ModifyFileCandidate).targetFile}</span>
                            <strong>{candidate.status}</strong>
                        </div>
                        <p><em>{candidate.reasoning}</em></p>
                        
                        {selectedCandidateId === candidate.id && selectedCandidate && (
                            <div className="candidate-details-container" style={{marginTop: '1rem'}}>
                                <CandidateDetails candidate={selectedCandidate} />
                            </div>
                        )}

                        {candidate.status === 'evaluated' && (
                             <div className="proposal-actions-footer">
                                <span className="evaluation-score" title={`${t('selfProgramming_score')}: ${candidate.evaluationScore?.toFixed(3)}`}>
                                    Score: <strong>{candidate.evaluationScore! > 0 ? '+' : ''}{candidate.evaluationScore?.toFixed(2)}</strong>
                                </span>
                                <button className="control-button" onClick={() => handleImplement(candidate.id)}>
                                    Implement
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
});