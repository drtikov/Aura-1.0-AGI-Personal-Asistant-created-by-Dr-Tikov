import React from 'react';
import { ResourceMonitor } from '../types';

export const ResourceMonitorPanel = React.memo(({ monitor }: { monitor: ResourceMonitor }) => (
    <div className="side-panel">
        <div className="internal-state-content">
            <div className="state-item"> <label>CPU Usage</label> <div className="state-bar-container"> <div className="state-bar cpu-bar" style={{ width: `${monitor.cpu_usage * 100}%` }}></div> </div> </div>
            <div className="state-item"> <label>Memory Usage</label> <div className="state-bar-container"> <div className="state-bar memory-bar" style={{ width: `${monitor.memory_usage * 100}%` }}></div> </div> </div>
            <div className="state-item"> <label>I/O Throughput</label> <div className="state-bar-container"> <div className="state-bar io-bar" style={{ width: `${monitor.io_throughput * 100}%` }}></div> </div> </div>
            <div className="state-item"> <label>Allocation Stability</label> <div className="state-bar-container"> <div className="state-bar stability-bar" style={{ width: `${monitor.resource_allocation_stability * 100}%` }}></div> </div> </div>
        </div>
    </div>
));
