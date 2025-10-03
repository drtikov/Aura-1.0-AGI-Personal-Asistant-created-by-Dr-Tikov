// components/CognitiveOSPanel.tsx
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';
import { SEDLDirective, CGLPlan, POLCommand } from '../types';

const DirectiveDisplay = ({ directive }: { directive: SEDLDirective | null }) => {
    if (!directive) return null;
    return (
        <div className="cecs-display-box">
            <pre><code>{JSON.stringify({ type: directive.type, content: directive.content }, null, 2)}</code></pre>
        </div>
    );
};

const PlanDisplay = ({ plan }: { plan: CGLPlan | null }) => {
    if (!plan) return null;
    return (
        <div className="cecs-display-box">
            <pre><code>{JSON.stringify({ goal: plan.goal, steps: plan.steps.map(s => s.details) }, null, 2)}</code></pre>
        </div>
    );
};

const CommandQueueDisplay = ({ queue, currentIndex, currentCommands }: { queue: POLCommand[][], currentIndex: number, currentCommands: POLCommand[] | null }) => {
    if (queue.length === 0) return null;
    
    return (
        <div className="cecs-queue-container">
            {queue.map((stage, stageIndex) => (
                <div key={stageIndex} className={`cecs-stage ${stageIndex < currentIndex -1 ? 'completed' : ''} ${stageIndex === currentIndex -1 ? 'executing' : ''}`}>
                    <div className="cecs-stage-header">Stage {stageIndex + 1} {stage.length > 1 ? `(Parallel: ${stage.length})` : '(Sequential)'}</div>
                     {stage.map(command => (
                        <div key={command.id} className="cecs-command">
                           {command.type === 'TOOL_EXECUTE' ? `${command.type}: ${command.payload.name}` : command.type}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


export const CognitiveOSPanel = () => {
    const { cognitiveOSState } = useSystemState();
    const { t } = useLocalization();
    const { status, activeDirective, activePlan, commandQueue, currentStageIndex, currentStageCommands, lastError } = cognitiveOSState;

    return (
        <div className="side-panel">
            <div className="awareness-item">
                <label>{t('cogArchPanel_status')}</label>
                <strong>{status.replace(/_/g, ' ')}</strong>
            </div>

            {lastError && (
                <div className="failure-reason-display">
                    <strong>Error:</strong>
                    <p>{lastError}</p>
                </div>
            )}
            
            <div className="panel-subsection-title">Layer 3: SEDL Directive</div>
            <DirectiveDisplay directive={activeDirective} />

            <div className="panel-subsection-title">Layer 2: CGL Plan</div>
            <PlanDisplay plan={activePlan} />
            
            <div className="panel-subsection-title">Layer 1: POL Command Queue</div>
            <CommandQueueDisplay queue={commandQueue} currentIndex={currentStageIndex} currentCommands={currentStageCommands} />
        </div>
    );
};