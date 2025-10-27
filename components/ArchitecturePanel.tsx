// components/ArchitecturePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';

export const ArchitecturePanel = React.memo(() => {
    const { t } = useLocalization();

    return (
        <div className="side-panel architecture-panel">
            <div className="kg-placeholder">{t('architecturePanel_deprecated')}</div>
        </div>
    );
});