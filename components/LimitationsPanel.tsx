import React from 'react';

export const LimitationsPanel = React.memo(({ limitations }: { limitations: string[] }) => (
    <div className="side-panel limitations-panel">
        <div className="limitations-content">
            {limitations.length === 0 ? <div className="kg-placeholder">No limitations identified.</div> : <ul>{limitations.map((limitation, index) => <li key={index}><span>{limitation}</span></li>)}</ul>}
        </div>
    </div>
));
