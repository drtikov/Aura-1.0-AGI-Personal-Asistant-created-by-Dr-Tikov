import React from 'react';
import { CognitiveArchitecture, CognitiveModule } from '../types';

export const CognitiveArchitecturePanel = React.memo(({ architecture }: { architecture: CognitiveArchitecture }) => {
    const moduleGroups = { 'Cognitive Core': ['DEDUCTIVE_REASONING', 'HYBRID_REASONING', 'HYPOTHETICAL_REASONING', 'PROBABILISTIC_REASONING', 'TEXT_GENERATION'], 'Knowledge Systems': ['INFORMATION_RETRIEVAL', 'ValidatedKnowledgeIntegrator'], 'Specialized Engines': ['CALCULATION', 'CODE_GENERATION', 'VISION', 'IngenuityEngine', 'ReflectiveInsightEngine'], 'Meta-Cognition': ['REFINEMENT', 'HELP'], };
    const allGroupedModules = Object.values(moduleGroups).flat();
    const ungroupedModules = Object.keys(architecture.components).filter( skill => !allGroupedModules.includes(skill) && skill !== 'UNKNOWN' );
    const renderModule = (skill: string, details: CognitiveModule) => ( <div key={skill} className="arch-module"> <span className={`arch-status-indicator status-${details.status}`} title={`Status: ${details.status}`}></span> <span className="arch-module-name">{skill.replace(/_/g, ' ')}</span> <span className="arch-module-version">v{details.version}</span> </div> );
    return (
        <div className="side-panel">
            <div className="cognitive-arch-content">
                <div className="arch-module arch-summary"> <span className="arch-module-name">Model Complexity Score</span> <span className="arch-module-version">{architecture.modelComplexityScore.toFixed(3)}</span> </div>
                {Object.entries(moduleGroups).map(([groupName, modules]) => ( <div key={groupName} className="arch-group"> <div className="arch-group-header">{groupName}</div> {modules.map(skill => architecture.components[skill] && renderModule(skill, architecture.components[skill]))} </div> ))}
                {ungroupedModules.length > 0 && ( <div className="arch-group"> <div className="arch-group-header">Spawned Modules</div> {ungroupedModules.map(skill => architecture.components[skill] && renderModule(skill, architecture.components[skill]))} </div> )}
            </div>
        </div>
    );
});
