import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { SensoryEngram, SensoryPrimitive } from '../types';

// FIX: Wrapped component in React.memo to correctly handle the `key` prop in a list.
const PrimitiveDisplay = React.memo(({ primitive }: { primitive: SensoryPrimitive }) => {
    let valueStr = '';
    if (typeof primitive.value === 'number') {
        valueStr = primitive.value.toFixed(2);
    } else {
        valueStr = primitive.value;
    }
    const confidence = 'confidence' in primitive && primitive.confidence ? `(${(primitive.confidence * 100).toFixed(0)}%)` : '';

    return (
        <div className="kg-fact" style={{ gridTemplateColumns: '1fr auto', padding: '0.2rem 0' }}>
            <span className="kg-subject" style={{textTransform: 'capitalize'}}>{primitive.type.replace(/_/g, ' ')}</span>
            <span className="kg-object">{valueStr} {confidence}</span>
        </div>
    );
});

const EngramDisplay = ({ engram, title }: { engram: SensoryEngram | null, title: string }) => {
    const { t } = useLocalization();
    if (!engram) {
        return (
            <>
                <div className="panel-subsection-title">{title}</div>
                <div className="kg-placeholder">{t('granularCortex_noEngram')}</div>
            </>
        );
    }

    return (
        <>
            <div className="panel-subsection-title">{title}</div>
            <div className="metric-item">
                <span className="metric-label">{t('granularCortex_modality')}</span>
                <span className="metric-value" style={{textTransform: 'capitalize'}}>{engram.modality}</span>
            </div>
            {/* FIX: Changed `primitives` to `rawPrimitives` to match the SensoryEngram type definition. */}
            {engram.rawPrimitives.map((p, i) => <PrimitiveDisplay key={i} primitive={p} />)}
        </>
    );
};

export const GranularCortexPanel = React.memo(() => {
    const { granularCortexState } = useArchitectureState();
    const { t } = useLocalization();
    const { lastPredictionError, lastActualEngram, lastPredictedEngram, log } = granularCortexState;

    return (
        <div className="side-panel granular-cortex-panel">
            <div className="panel-subsection-title">{t('granularCortex_predictionError')}</div>
            {lastPredictionError ? (
                <div className="state-item">
                    <label>{t('granularCortex_lastErrorMagnitude')}</label>
                    <div className="state-bar-container">
                        <div className="state-bar prediction-error-bar" style={{ width: `${lastPredictionError.magnitude * 100}%` }}></div>
                    </div>
                </div>
            ) : (
                <div className="kg-placeholder">{t('granularCortex_noError')}</div>
            )}
            
            <EngramDisplay engram={lastActualEngram} title={t('granularCortex_actual')} />
            <EngramDisplay engram={lastPredictedEngram} title={t('granularCortex_predicted')} />

            <div className="panel-subsection-title">{t('granularCortex_log')}</div>
            <div className="command-log-list">
                 {log.length === 0 ? (
                    <div className="kg-placeholder">{t('granularCortex_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-text">{entry.message}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});