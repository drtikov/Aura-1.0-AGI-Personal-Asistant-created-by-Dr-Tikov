import React from 'react';
// FIX: Corrected import path for types to resolve module error.
import { Action } from '../types';
import { useMemoryState, useLocalization } from '../context/AuraContext';

export const WorkingMemoryPanel = React.memo(({ onDispatch }: { onDispatch: React.Dispatch<Action> }) => {
    const { workingMemory: memory } = useMemoryState();
    const { t } = useLocalization();

    if (memory.length === 0) return null;
    return (
        <div className="working-memory-panel">
            <div className="working-memory-header">
                <h4>{t('workingMemoryTitle')}</h4>
                {memory.length > 0 && <button className="clear-wm-button" onClick={() => onDispatch({ type: 'CLEAR_WORKING_MEMORY' })}>{t('workingMemoryClear')}</button>}
            </div>
            <ul> {memory.map((item, index) => ( <li key={index}> <span>{item.substring(0, 100)}{item.length > 100 ? '...' : ''}</span> <button onClick={() => onDispatch({ type: 'REMOVE_FROM_WORKING_MEMORY', payload: item })} title={t('workingMemoryRemove')}>&times;</button> </li> ))} </ul>
        </div>
    );
});
