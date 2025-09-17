
import React from 'react';
import { useArchitectureState } from '../context/AuraContext';

export const CognitiveForgePanel = React.memo(() => {
    const { cognitiveForgeState: state } = useArchitectureState();
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="side-panel">
            <div className="panel-subsection-title">Skill Templates</div>
            {Object.values(state.skillTemplates).length === 0 ? (
                <div className="kg-placeholder">No skill templates defined.</div>
            ) : (
                Object.values(state.skillTemplates).slice(0, 5).map(template => (
                    <div key={template.skill} className="mod-log-item">
                        <div className="mod-log-header">
                            <span className="mod-log-type">{template.skill.replace(/_/g, ' ')}</span>
                            <span className="mod-log-status">v{template.metadata.version.toFixed(1)}</span>
                        </div>
                        <p className="mod-log-description" title={template.systemInstruction}>
                            Temp: {template.parameters.temperature?.toFixed(1) ?? 'N/A'} |
                            Success: {(template.metadata.successRate * 100).toFixed(0)}% |
                            Avg. Duration: {template.metadata.avgDuration}ms
                        </p>
                    </div>
                ))
            )}
             <div className="panel-subsection-title">Synthesized Skills</div>
            {state.synthesizedSkills.length === 0 ? (
                <div className="kg-placeholder">No new skills synthesized yet.</div>
            ) : (
                state.synthesizedSkills.map(skill => (
                    <div key={skill.id} className="rie-insight-item">
                        <p><strong>{skill.name.replace(/_/g, ' ')}</strong></p>
                        <p className="rie-insight-model-update">
                            <em>{skill.description}</em>
                        </p>
                    </div>
                ))
            )}
            <div className="panel-subsection-title">Simulation Log</div>
             {state.simulationLog.length === 0 ? (
                <div className="kg-placeholder">No simulations run yet.</div>
            ) : (
                state.simulationLog.slice(0, 5).map(log => (
                    <div key={log.id} className={`veto-log-item status-${log.result}`}>
                        <p className="veto-action">
                           <strong className={`mod-log-status status-${log.result === 'improved' ? 'success' : 'failed'}`}>{log.result.toUpperCase()}:</strong> Tuned {log.skill}
                        </p>
                        <p className="veto-principle">{log.details} ({timeAgo(log.timestamp)})</p>
                    </div>
                ))
            )}
        </div>
    );
});