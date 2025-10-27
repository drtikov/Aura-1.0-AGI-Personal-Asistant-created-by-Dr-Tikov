// components/InternalScientistPanel.tsx
import React from 'react';
import { useCoreState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Imported missing types
import { DiagnosticFinding, InternalScientistExperiment, InternalScientistHypothesis, SelfProgrammingCandidate, CreateFileCandidate, ModifyFileCandidate } from '../types.ts';

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

// FIX: Added a type guard to correctly display code information from the SelfProgrammingCandidate union type.
const ExperimentCard = ({ experiment }: { experiment: InternalScientistExperiment }) => {
    let codeInfo = 'Unknown code change';
    if ('targetFile' in experiment.design) { // ModifyFileCandidate
        const modifyCandidate = experiment.design as ModifyFileCandidate;
        codeInfo = `// Target: ${modifyCandidate.targetFile}\n${modifyCandidate.codeSnippet}`;
    } else if ('newFile' in experiment.design) { // CreateFileCandidate
        const createCandidate = experiment.design as CreateFileCandidate;
        codeInfo = `// New File: ${createCandidate.newFile.path}\n${createCandidate.newFile.content}`;
    }

    return (
        <div className="gde-status" style={{ borderLeftColor: 'var(--secondary-color)'}}>
            <p><strong>Experiment:</strong> {experiment.design.reasoning}</p>
            <div className="code-snippet-container" style={{maxHeight: '100px', marginTop: '0.5rem'}}>
                <pre><code>{codeInfo}</code></pre>
            </div>
        </div>
    );
};

export const InternalScientistPanel = () => {
    const { internalScientistState } = useCoreState();
    const { t } = useLocalization();
    const { status, log, currentFinding, currentHypothesis, currentExperiment, causalInference, currentSimulationResult } = internalScientistState;

    const renderResultValue = (label: string, value: number) => {
        const isPositive = value > 0;
        const isNegative = value < 0;
        const color = isPositive ? 'var(--success-color)' : isNegative ? 'var(--failure-color)' : 'var(--text-muted)';
        const sign = isPositive ? '+' : '';

        return (
            <div className="metric-item">
                <span className="metric-label">{label}</span>
                <span className="metric-value" style={{ color }}>{sign}{(value * 100).toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="side-panel">
             <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong style={{ textTransform: 'capitalize' }}>
                    {status}
                    {status !== 'idle' && <div className="spinner-small" style={{ display: 'inline-block', marginLeft: '0.5rem' }} />}
                </strong>
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
            {status === 'simulating' && (
                 <>
                    <div className="panel-subsection-title">{t('scientist_simulationResult')}</div>
                     <div className="gde-status" style={{ borderLeftColor: 'var(--guna-dharma)'}}>
                        <p><strong>{t('scientist_prediction')}:</strong> <em>"{t('scientist_simulating')}"</em></p>
                    </div>
                </>
            )}
            {currentSimulationResult && (
                 <>
                    <div className="panel-subsection-title">{t('scientist_simulationResult')}</div>
                     <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center' }}>
                        {renderResultValue(t('scientist_wisdomChange'), currentSimulationResult.wisdomChange)}
                        {renderResultValue(t('scientist_happinessChange'), currentSimulationResult.happinessChange)}
                        {renderResultValue(t('scientist_harmonyChange'), currentSimulationResult.harmonyChange)}
                    </div>
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
                            <span className="log-text" style={{ textTransform: 'capitalize' }}>{entry.event.replace(/_/g, ' ')}</span>
                            <span className="log-time">{timeAgo(entry.timestamp, t)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};