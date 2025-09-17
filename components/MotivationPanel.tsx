import React from 'react';

// This component is deprecated and will be removed. 
// It is replaced by the StrategicPlannerPanel for the new Hierarchical Planning Engine.
// For now, we render a placeholder to avoid breaking the UI.

export const MotivationPanel = () => {
    return (
        <div className="side-panel goals-panel">
            <div className="kg-placeholder">
                This panel is deprecated. Please use the "Strategic Planner" panel.
            </div>
        </div>
    );
};
