import React from 'react';
import { useCoreState } from '../context/AuraContext';

export const AtmanProjectorPanel = React.memo(() => {
    const { coreIdentity: identity } = useCoreState();
    return (
        <div className="side-panel">
            <div className="panel-subsection-title">Core Values</div>
            <ul className="ethical-principles-list">
                {identity.values.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>

            <div className="panel-subsection-title">Narrative Self</div>
            <p className="narrative-self-text">
                <em>{identity.narrativeSelf}</em>
            </p>
        </div>
    );
});
