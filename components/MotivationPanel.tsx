import React from 'react';
import { useLocalization } from '../context/AuraContext';

// This component is deprecated and will be removed. 
// It is replaced by the StrategicPlannerPanel for the new Hierarchical Planning Engine.
// For now, we render a placeholder to avoid breaking the UI.

export const MotivationPanel = () => {
    const { t } = useLocalization();
    return (
        <div className="side-panel goals-panel">
            <div className="kg-placeholder">
                {t('motivationPanel_deprecated')}
            </div>
        </div>
    );
};