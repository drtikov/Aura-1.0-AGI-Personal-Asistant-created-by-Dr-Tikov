
import React from 'react';
import { useLocalization } from '../context/AuraContext';
import { AuraConfig, CURRENT_STATE_VERSION } from '../constants';

const InfoItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="metric-item">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
    </div>
);

export const SystemInfoPanel = React.memo(() => {
    const { t } = useLocalization();

    return (
        <div className="side-panel system-info-panel">
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr', textAlign: 'left', gap: '0.2rem' }}>
                <InfoItem label={t('systemInfo_aiModel')} value="Aura" />
                <InfoItem label={t('systemInfo_stateVersion')} value={`v${CURRENT_STATE_VERSION}`} />
                <div className="panel-subsection-title" style={{ gridColumn: '1 / -1', marginTop: '0.5rem', marginBottom: 0 }}>Operating Parameters</div>
                <InfoItem label={t('systemInfo_boredomDecay')} value={AuraConfig.BOREDOM_DECAY_RATE} />
                <InfoItem label={t('systemInfo_hormoneDecay')} value={AuraConfig.HORMONE_DECAY_RATE} />
                <InfoItem label={t('systemInfo_loadDecay')} value={AuraConfig.LOAD_DECAY_RATE} />
                <InfoItem label={t('systemInfo_noveltyBoost')} value={AuraConfig.NOVELTY_BOOST} />
            </div>
        </div>
    );
});
