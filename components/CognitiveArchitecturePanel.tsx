import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext';
import { CognitiveModule, SynthesizedSkill } from '../types';

export const CognitiveArchitecturePanel = React.memo(() => {
    const { cognitiveArchitecture: architecture, cognitiveForgeState } = useArchitectureState();
    const { t } = useLocalization();
    const synthesizedSkills = cognitiveForgeState.synthesizedSkills || [];
    const moduleGroups = { 'Cognitive Core': ['DEDUCTIVE_REASONING', 'HYBRID_REASONING', 'HYPOTHETICAL_REASONING', 'PROBABILISTIC_REASONING', 'TEXT_GENERATION'], 'Knowledge Systems': ['INFORMATION_RETRIEVAL', 'ValidatedKnowledgeIntegrator'], 'Specialized Engines': ['CALCULATION', 'CODE_GENERATION', 'VISION', 'IngenuityEngine', 'ReflectiveInsightEngine'], 'Meta-Cognition': ['REFINEMENT', 'HELP'], };
    const allGroupedModules = Object.values(moduleGroups).flat();
    const ungroupedModules = Object.keys(architecture.components).filter( skill => !allGroupedModules.includes(skill) && skill !== 'UNKNOWN' );
    const renderModule = (skill: string, details: CognitiveModule) => ( <div key={skill} className="arch-module"> <span className={`arch-status-indicator status-${details.status}`} title={`${t('cogArchPanel_status')}: ${details.status}`}></span> <span className="arch-module-name">{skill.replace(/_/g, ' ')}</span> <span className="arch-module-version">v{details.version}</span> </div> );
    const renderSynthesizedSkill = (skill: SynthesizedSkill) => (
        <div key={skill.id} className={`arch-module synthesized ${skill.status === 'deprecated' ? 'deprecated' : ''}`}>
            <span className={`arch-status-indicator status-${skill.status === 'deprecated' ? 'inactive' : 'active'}`} title={`${t('cogArchPanel_synthSkillTitle')} (${skill.status})`}></span>
            <span className="arch-module-name">{skill.name}{skill.status === 'deprecated' && ` ${t('cogArchPanel_deprecated')}`}</span>
            <span className="arch-module-version" title={`${skill.steps.length} ${t('cogArchPanel_steps')}`}>Synth</span>
        </div>
    );

    return (
        <div className="side-panel">
            <div className="cognitive-arch-content">
                <div className="arch-module arch-summary"> <span className="arch-module-name">{t('cogArchPanel_complexityScore')}</span> <span className="arch-module-version">{architecture.modelComplexityScore.toFixed(3)}</span> </div>
                {Object.entries(moduleGroups).map(([groupName, modules]) => ( <div key={groupName} className="arch-group"> <div className="arch-group-header">{t(`cogArchPanel_group${groupName.replace(/ /g, '')}`)}</div> {modules.map(skill => architecture.components[skill] && renderModule(skill, architecture.components[skill]))} </div> ))}
                {synthesizedSkills && synthesizedSkills.length > 0 && (
                    <div className="arch-group">
                        <div className="arch-group-header">{t('cogArchPanel_groupSynthesizedSkills')}</div>
                        {synthesizedSkills.map(renderSynthesizedSkill)}
                    </div>
                )}
                {ungroupedModules.length > 0 && ( <div className="arch-group"> <div className="arch-group-header">{t('cogArchPanel_groupSpawnedModules')}</div> {ungroupedModules.map(skill => architecture.components[skill] && renderModule(skill, architecture.components[skill]))} </div> )}
            </div>
        </div>
    );
});