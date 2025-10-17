// components/HostBridgePanel.tsx
import React from 'react';
// FIX: Corrected import path for hooks from AuraProvider to AuraContext.
import { useLocalization } from '../context/AuraContext.tsx';
import { HostBridge } from '../core/hostBridge';

export const HostBridgePanel = React.memo(() => {
    const { t } = useLocalization();
    const isConnected = HostBridge.isHostConnected();

    return (
        <div className="side-panel">
            <div className="awareness-item">
                <label>{t('hostBridge_status')}</label>
                <strong style={{ color: isConnected ? 'var(--success-color)' : 'var(--text-muted)' }}>
                    {isConnected ? t('hostBridge_connected') : t('hostBridge_disconnected')}
                </strong>
            </div>
            <p className="reason-text" style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {isConnected ? t('hostBridge_connected_desc') : t('hostBridge_disconnected_desc')}
            </p>
        </div>
    );
});