// components/KoniocortexSentinelPanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { Percept } from '../types';

export const KoniocortexSentinelPanel = React.memo(() => {
    const { koniocortexSentinelState } = useArchitectureState();
    const { t } = useLocalization();
    const { lastPercept } = koniocortexSentinelState;

    if (!lastPercept) {
        return (
            <div className="side-panel">
                <div className="kg-placeholder">{t('koniocortex_placeholder')}</div>
            </div>
        );
    }

    return (
        <div className="side-panel koniocortex-panel">
            <div className="panel-subsection-title">{t('koniocortex_lastPercept')}</div>
            <div className="awareness-item">
                <label>{t('koniocortex_intent')}</label>
                <strong>{lastPercept.intent}</strong>
            </div>
            {lastPercept.entities.length > 0 && (
                <div className="awareness-item">
                    <label>{t('koniocortex_entities')}</label>
                    <strong title={lastPercept.entities.join(', ')}>{lastPercept.entities.slice(0, 3).join(', ')}{lastPercept.entities.length > 3 ? '...' : ''}</strong>
                </div>
            )}
             <div className="awareness-item">
                <label>{t('koniocortex_rawText')}</label>
                <em style={{textAlign: 'right', color: 'var(--text-muted)'}} title={lastPercept.rawText}>"{lastPercept.rawText.substring(0, 20)}..."</em>
            </div>

            {lastPercept.sensoryEngram && (
                <>
                    <div className="panel-subsection-title">{t('koniocortex_sensoryInput')}</div>
                     <div className="awareness-item">
                        <label>{t('granularCortex_modality')}</label>
                        <strong style={{textTransform: 'capitalize'}}>{lastPercept.sensoryEngram.modality}</strong>
                    </div>
                    {/* FIX: Corrected property access from `primitives` to `rawPrimitives` to match the SensoryEngram type in types.ts. */}
                    {lastPercept.sensoryEngram.rawPrimitives.slice(0,2).map((p, i) => (
                         <div className="awareness-item" key={i}>
                            <label style={{textTransform: 'capitalize'}}>{p.type.replace(/_/g, ' ')}</label>
                            <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
});
