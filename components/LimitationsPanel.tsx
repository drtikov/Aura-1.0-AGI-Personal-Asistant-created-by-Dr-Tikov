// components/LimitationsPanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const LimitationsPanel = React.memo(() => {
    const { limitations } = useCoreState();
    const { t } = useLocalization();
    return (
        <div className="side-panel limitations-panel">
            <div className="limitations-content">
                {limitations.length === 0 ? <div className="kg-placeholder">{t('limitationsPanel_placeholder')}</div> : <ul>{limitations.map((limitation, index) => <li key={index}><span>{limitation}</span></li>)}</ul>}
            </div>
        </div>
    );
});