// components/SelfProgrammingPanel.tsx
import React from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const SelfProgrammingPanel = React.memo(() => {
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="kg-placeholder">
                Autonomous evolution proposals are now managed in the main "Autonomous Evolution" modal, accessible from the header.
            </div>
        </div>
    );
});