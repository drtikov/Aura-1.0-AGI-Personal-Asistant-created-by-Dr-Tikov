// components/ResourceMonitorPanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks to resolve module not found error.
import { useSystemState, useLocalization } from '../context/AuraContext.tsx';

export const ResourceMonitorPanel = React.memo(() => {
    const { resourceMonitor: monitor } = useSystemState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="internal-state-content">
                <div className="state-item"> <label>{t('resourceMonitor_cpu')}</label> <div className="state-bar-container"> <div className="state-bar cpu-bar" style={{ width: `${monitor.cpu_usage * 100}%` }}></div> </div> </div>
                <div className="state-item"> <label>{t('resourceMonitor_memory')}</label> <div className="state-bar-container"> <div className="state-bar memory-bar" style={{ width: `${monitor.memory_usage * 100}%` }}></div> </div> </div>
                <div className="state-item"> <label>{t('resourceMonitor_io')}</label> <div className="state-bar-container"> <div className="state-bar io-bar" style={{ width: `${monitor.io_throughput * 100}%` }}></div> </div> </div>
                <div className="state-item"> <label>{t('resourceMonitor_stability')}</label> <div className="state-bar-container"> <div className="state-bar stability-bar" style={{ width: `${monitor.resource_allocation_stability * 100}%` }}></div> </div> </div>
            </div>
        </div>
    );
});