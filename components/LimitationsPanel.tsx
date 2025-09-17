import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const LimitationsPanel = React.memo(() => {
    const { limitations } = useCoreState();
    return (
        <div className="side-panel limitations-panel">
            <div className="limitations-content">
                {limitations.length === 0 ? <div className="kg-placeholder">No limitations identified.</div> : <ul>{limitations.map((limitation, index) => <li key={index}><span>{limitation}</span></li>)}</ul>}
            </div>
        </div>
    );
});