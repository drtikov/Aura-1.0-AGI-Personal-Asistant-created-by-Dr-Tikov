// components/InternalScientistPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext';
import { DiagnosticFinding, InternalScientistExperiment, InternalScientistHypothesis } from '../types';

const timeAgo = (timestamp: number, t: (key: string, options?: any) => string) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return t('timeAgoSeconds', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    return t('timeAgoMinutes', { count: minutes });
};

const FindingCard = ({ finding }: { finding: DiagnosticFinding }) => (
    <div className="gde-status" style={{ borderLeftColor: 'var(--accent-color)'}}>
        <p title={finding.finding}>
            <strong>[{finding.severity.toUpperCase()}]</strong> {finding.finding.substring(0, 60)}{finding.finding.length > 60 ? '...' : ''}
        </p>
    </div>
);

const HypothesisCard = ({ hypothesis }: { hypothesis: InternalScientistHypothesis }) => (
    <div className="gde-status" style={{ borderLeftColor: 'var(--primary-color)'}}>
        <p><em>{hypothesis.text}</em></p>
    </div>
);

const ExperimentCard = ({ experiment }: { experiment: InternalScientistExperiment }) => (
    <div className="gde-status" style={{ borderLeftColor: 'var(--secondary-color)'}}>
        <p><strong>Experiment:</strong> {experiment.design.reasoning}</p>
        <div className="code-snippet-container" style={{maxHeight: '100px', marginTop: '0.5rem'}}>
            <pre><code>{`// Target: ${experiment.design.targetFile}\n${experiment.design.codeSnippet}`}</code></pre>
        </div>
    </div>
);

export const InternalScientistPanel = () => {
    const { internalScientistState } = useCoreState();
    const { t } = useLocalization();
    const { status, log, currentFinding, currentHypothesis, currentExperiment, causalInference } = internalScientistState;

    return (
        <div className="side-panel">
             <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong>{status.replace(/_/g, ' ')}</strong>
            </div>

            {currentFinding && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentFinding')}</div>
                    <FindingCard finding={currentFinding} />
                </>
            )}
            {currentHypothesis && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentHypothesis')}</div>
                    <HypothesisCard hypothesis={currentHypothesis} />
                </>
            )}
            {currentExperiment && (
                <>
                    <div className="panel-subsection-title">{t('scientist_currentExperiment')}</div>
                    <ExperimentCard experiment={currentExperiment} />
                </>
            )}
            {causalInference && (
                 <>
                    <div className="panel-subsection-title">{t('scientist_lastInference')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--success-color)'}}>
                        <p>
                           <strong>{causalInference.link.cause} → {causalInference.link.effect}</strong>
                           <span style={{marginLeft: '0.5rem'}}>({(causalInference.confidence * 100).toFixed(0)}%)</span>
                        </p>
                    </div>
                </>
            )}

            <div className="panel-subsection-title">{t('scientist_log')}</div>
            <div className="command-log-list">
                {log.length === 0 ? (
                    <div className="kg-placeholder">{t('scientist_noLog')}</div>
                ) : (
                    log.map(entry => (
                        <div key={entry.timestamp} className="command-log-item log-type-info">
                            <span className="log-icon">🔬</span>
                            <span className="log-text">{entry.event.replace(/_/g, ' ')}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};