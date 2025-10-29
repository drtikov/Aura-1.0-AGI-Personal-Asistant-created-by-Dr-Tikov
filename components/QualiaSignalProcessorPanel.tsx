// components/QualiaSignalProcessorPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { QualiaSignalProcessorState } from '../types.ts';

interface AffectivePrimitiveBarProps {
    label: string;
    value: number;
    color: string;
}

const AffectivePrimitiveBar = React.memo(({ label, value, color }: AffectivePrimitiveBarProps) => (
    <div className="hormone-item">
        <label>{label}</label>
        <div className="state-bar-container">
            <div 
                className="state-bar"
                style={{ width: `${value * 100}%`, backgroundColor: `var(--${color})` }}
                title={`${(value * 100).toFixed(1)}%`}
            ></div>
        </div>
    </div>
));

export const QualiaSignalProcessorPanel = React.memo(() => {
    const { qualiaSignalProcessorState: state } = useCoreState();
    const { t } = useLocalization();
    const { isAudioStreamActive, isVideoStreamActive, affectivePrimitives, perceptualLog } = state;
    
    const primitives: { key: keyof QualiaSignalProcessorState['affectivePrimitives']; labelKey: string; color: string }[] = [
        { key: 'excitement', labelKey: 'qsp_excitement', color: 'state-happiness' },
        { key: 'confusion', labelKey: 'qsp_confusion', color: 'state-uncertainty' },
        { key: 'confidence', labelKey: 'qsp_confidence', color: 'state-mastery' },
        { key: 'urgency', labelKey: 'qsp_urgency', color: 'resource-cpu' },
        { key: 'sarcasm', labelKey: 'qsp_sarcasm', color: 'mode-creativity' },
        { key: 'frustration', labelKey: 'qsp_frustration', color: 'failure-color' },
        { key: 'humor', labelKey: 'qsp_humor', color: 'accent-color' },
    ];
    
    return (
        <div className="side-panel qsp-panel">
            <div className="panel-subsection-title">{t('qsp_streamStatus')}</div>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginBottom: '1rem' }}>
                <div className="metric-item" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="metric-label">{t('qsp_audioStream')}</span>
                    <span className={`metric-value ${isAudioStreamActive ? 'status-processing' : ''}`}>
                        {isAudioStreamActive ? t('qsp_status_active') : t('qsp_status_inactive')}
                    </span>
                </div>
                <div className="metric-item" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="metric-label">{t('qsp_videoStream')}</span>
                    <span className={`metric-value ${isVideoStreamActive ? 'status-processing' : ''}`}>
                        {isVideoStreamActive ? t('qsp_status_active') : t('qsp_status_inactive')}
                    </span>
                </div>
            </div>

            <div className="panel-subsection-title">{t('qsp_affectivePrimitives')}</div>
            <div className="hormone-signals">
                {primitives.map(p => (
                    <AffectivePrimitiveBar 
                        key={p.key}
                        label={t(p.labelKey)}
                        value={affectivePrimitives[p.key]}
                        color={p.color}
                    />
                ))}
            </div>

            <div className="panel-subsection-title">{t('qsp_perceptualLog')}</div>
            <div className="command-log-list">
                {perceptualLog.length === 0 ? (
                    <div className="kg-placeholder">{t('qsp_logPlaceholder')}</div>
                ) : (
                    perceptualLog.map((log, index) => (
                        <div key={index} className="command-log-item log-type-info">
                            <span className="log-icon">👁️</span>
                            <span className="log-text">{log}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});