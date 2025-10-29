// components/CoreIdentityPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';

export const CoreIdentityPanel = React.memo(() => {
    const { coreIdentity } = useCoreState();
    const { t } = useLocalization();

    return (
        <div className="side-panel">
            <div className="panel-subsection-title">{t('atman_coreValues')}</div>
            <ul className="ethical-principles-list">
                {coreIdentity.values.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div className="panel-subsection-title" style={{marginTop: '1rem'}}>{t('atman_dominantNarrative')}</div>
            <p className="reason-text" style={{fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)'}}>
                {coreIdentity.narrativeSelf}
            </p>
        </div>
    );
});