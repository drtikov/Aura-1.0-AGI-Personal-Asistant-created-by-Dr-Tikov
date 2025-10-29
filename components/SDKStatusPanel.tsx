// components/SDKStatusPanel.tsx
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';
import { getSdkStatus, subscribeToSdkStatus, unsubscribeFromSdkStatus } from '../core/sdkLoader';

export const SDKStatusPanel = React.memo(() => {
    const { t } = useLocalization();
    const [statuses, setStatuses] = useState(() => getSdkStatus());

    useEffect(() => {
        const handleStatusChange = (newStatuses: Record<string, 'idle' | 'loading' | 'loaded' | 'error'>) => {
            setStatuses({ ...newStatuses });
        };

        subscribeToSdkStatus(handleStatusChange);
        
        // Initial sync in case statuses changed before subscription
        setStatuses(getSdkStatus());

        return () => {
            unsubscribeFromSdkStatus(handleStatusChange);
        };
    }, []);

    const sortedSdks = Object.entries(statuses).sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="side-panel sdk-status-panel">
            <p className="reason-text">
                This panel shows the real-time status of dynamically loaded third-party libraries (SDKs). SDKs are loaded on-demand when a feature requires them.
            </p>
            <div className="sdk-list">
                {sortedSdks.map(([sdkId, status]) => (
                    <div key={sdkId} className="sdk-item">
                        <span className="sdk-name">{sdkId}</span>
                        <span className={`sdk-status status-${status}`}>
                            {t(`sdk_status_${status}`)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
});