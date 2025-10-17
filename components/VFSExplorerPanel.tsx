import React, { useState, useMemo } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { AuraState } from '../types';

// --- Type Definitions ---
type VFSNode = { name: string; type: 'f' | 'd' };

// --- CVFS Facade Logic ---
const cvfsRead = (path: string, state: AuraState): string | null => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return null; // Can't read root

    const contentMapping: { [key: string]: (s: AuraState) => any } = {
        '/sys/persona/active': (s) => s.personalityState.dominantPersona,
        '/sys/logs/boot.log': (s) => s.selfProgrammingState.virtualFileSystem['/system/logs/boot.log'] || 'Log not found.',
        '/mem/semantic/graph.json': (s) => JSON.stringify(s.knowledgeGraph, null, 2),
        '/mem/episodic/log': (s) => s.episodicMemoryState.episodes.map(e => `[${new Date(e.timestamp).toISOString()}] ${e.title}: ${e.summary}`).join('\n'),
        '/dev/user_in': (s) => s.history.filter(h => h.from === 'user').slice(-1)[0]?.text || '',
        '/dev/user_out': (s) => s.history.filter(h => h.from === 'bot').slice(-1)[0]?.text || '',
        '/dev/null': () => '',
    };
    
    if (contentMapping[path]) {
        try {
            return String(contentMapping[path](state));
        } catch (e) {
            console.error(`Error reading VFS path ${path}:`, e);
            return "Error reading file content.";
        }
    }
    
    return `File not found or cannot be read: ${path}`;
};

const cvfsLs = (path: string, state: AuraState): VFSNode[] | null => {
    const structure: any = {
        proc: { type: 'd' },
        mem: { 
            type: 'd',
            children: {
                semantic: {
                    type: 'd',
                    children: { 'graph.json': { type: 'f' } }
                },
                episodic: {
                    type: 'd',
                    children: { 'log': { type: 'f' } }
                }
            }
        },
        sys: {
            type: 'd',
            children: {
                persona: {
                    type: 'd',
                    children: { 'active': { type: 'f' } }
                },
                logs: {
                    type: 'd',
                    children: { 'boot.log': { type: 'f' } }
                }
            }
        },
        dev: {
            type: 'd',
            children: {
                'user_in': { type: 'f' },
                'user_out': { type: 'f' },
                'null': { type: 'f' },
            }
        }
    };
    
    if (path === '/') {
        return Object.keys(structure).map(name => ({ name, type: structure[name].type }));
    }

    const parts = path.split('/').filter(Boolean);
    let currentLevel = structure;
    for (const part of parts) {
        if (currentLevel[part] && currentLevel[part].type === 'd') {
            currentLevel = currentLevel[part].children;
        } else {
            return null; // Path not found or is a file
        }
    }

    if (currentLevel) {
        return Object.keys(currentLevel).map(name => ({ name, type: currentLevel[name].type }));
    }

    return null;
};


// --- VFS Explorer Component ---
export const VFSExplorerPanel = () => {
    const { state } = useAuraDispatch();
    const { t } = useLocalization();
    const [currentPath, setCurrentPath] = useState('/');
    const [fileContent, setFileContent] = useState<string | null>(null);

    const nodes = useMemo(() => {
        const items = cvfsLs(currentPath, state);
        if (currentPath !== '/') {
            return [{ name: '..', type: 'd' as const }, ...(items || [])];
        }
        return items;
    }, [currentPath, state]);

    const handleNodeClick = (node: VFSNode) => {
        if (node.type === 'd') {
            setFileContent(null);
            if (node.name === '..') {
                const parentPath = currentPath.split('/').filter(Boolean).slice(0, -1).join('/');
                setCurrentPath(`/${parentPath}`);
            } else {
                const newPath = (currentPath === '/' ? '' : currentPath) + `/${node.name}`;
                setCurrentPath(newPath);
            }
        } else {
            const filePath = (currentPath === '/' ? '' : currentPath) + `/${node.name}`;
            const content = cvfsRead(filePath, state);
            setFileContent(content);
        }
    };
    
    return (
        <div className="vfs-explorer-panel">
            <div className="vfs-path-bar">
                <span>aura@cvfs:</span>{currentPath}$
            </div>
            <div className="vfs-main-area">
                <div className="vfs-file-list">
                    {nodes ? nodes.map(node => (
                        <div key={node.name} className="vfs-node" onClick={() => handleNodeClick(node)}>
                            <span className={`vfs-node-type type-${node.type}`}>{`[${node.type}]`}</span>
                            <span className="vfs-node-name">{node.name}</span>
                        </div>
                    )) : <div className="kg-placeholder">{t('vfs_error')}</div>}
                </div>
                <div className="vfs-content-viewer">
                    {fileContent !== null ? (
                        <pre><code>{fileContent}</code></pre>
                    ) : (
                        <div className="kg-placeholder">{t('vfs_selectFile')}</div>
                    )}
                </div>
            </div>
        </div>
    );
};