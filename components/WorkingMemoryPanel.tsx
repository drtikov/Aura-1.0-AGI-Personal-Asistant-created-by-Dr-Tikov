


import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { SyscallCall } from '../types';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useMemoryState, useLocalization, useAuraDispatch } from '../context/AuraContext.tsx';

export const WorkingMemoryPanel = React.memo(() => {
    const { workingMemory: memory } = useMemoryState();
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();

    if (memory.length === 0) return null;
    return (
        <div className="working-memory-panel">
            <div className="working-memory-header">
                <h4>{t('workingMemoryTitle')}</h4>
                {memory.length > 0 && <button className="clear-wm-button" onClick={() => syscall('CLEAR_WORKING_MEMORY', {})}>{t('workingMemoryClear')}</button>}
            </div>
            <ul> {memory.map((item, index) => ( <li key={index}> <span>{item.substring(0, 100)}{item.length > 100 ? '...' : ''}</span> <button onClick={() => syscall('REMOVE_FROM_WORKING_MEMORY', item)} title={t('workingMemoryRemove')}>&times;</button> </li> ))} </ul>
        </div>
    );
});