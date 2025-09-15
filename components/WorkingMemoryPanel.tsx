import React from 'react';
import { Action } from '../state/reducer';

export const WorkingMemoryPanel = React.memo(({ memory, dispatch }: { memory: string[], dispatch: React.Dispatch<Action> }) => {
    if (memory.length === 0) return null;
    return (
        <div className="working-memory-panel">
            <h4>Working Memory</h4>
            <ul> {memory.map((item, index) => ( <li key={index}> <span>{item.substring(0, 100)}{item.length > 100 ? '...' : ''}</span> <button onClick={() => dispatch({ type: 'REMOVE_FROM_WORKING_MEMORY', payload: item })} title="Remove from memory">&times;</button> </li> ))} </ul>
        </div>
    );
});
