// components/CognitiveArchitecturePanel.tsx
import React from 'react';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
// FIX: Added '.ts' extension to satisfy module resolution.
import { CognitiveModule, SynthesizedSkill, Coprocessor, CoprocessorArchitecture } from '../types.ts';

export const CognitiveArchitecturePanel = React.memo(() => {
    const { cognitiveArchitecture: architecture, cognitiveForgeState } = useArchitectureState();
    const { t } = useLocalization();
    const synthesizedSkills = cognitiveForgeState.synthesizedSkills || [];
    
    // Base Skills
    const moduleGroups = { 'Cognitive Core': ['DEDUCTIVE_REASONING', 'HYBRID_REASONING', 'HYPOTHETICAL_REASONING', 'PROBABILISTIC_REASONING', 'TEXT_GENERATION'], 'Knowledge Systems': ['INFORMATION_RETRIEVAL', 'ValidatedKnowledgeIntegrator'], 'Specialized Engines': ['CALCULATION', 'CODE_GENERATION', 'VISION', 'IngenuityEngine', 'ReflectiveInsightEngine'], 'Meta-Cognition': ['REFINEMENT', 'HELP'], };
    const allGroupedModules = Object.values(moduleGroups).flat();
    const ungroupedModules = Object.keys(architecture.components).filter( skill => !allGroupedModules.includes(skill) && skill !== 'UNKNOWN' );
    const renderModule = (skill: string, details: CognitiveModule) => ( <div key={skill} className="arch-module"> <span className={`arch-status-indicator status-${details.status}`} title={`${t('cogArchPanel_status')}: ${details.status}`}></span> <span className="arch-module-name">{skill.replace(/_/g, ' ')}</span> <span className="arch-module-version">v{details.version}</span> </div> );
    const renderSynthesizedSkill = (skill: SynthesizedSkill) => (
        <div key={skill.id} className={`arch-module synthesized ${skill.status === 'deprecated' ? 'deprecated' : ''}`}>
            <span className={`arch-status-indicator status-${skill.status === 'deprecated' ? 'inactive' : 'active'}`} title={`${t('cogArchPanel_synthSkillTitle')} (${skill.status})`}></span>
            <span className="arch-module-name">{skill.name}{skill.status === 'deprecated' ? ` ${t('cogArchPanel_deprecated')}` : ''}</span>
            <span className="arch-module-version" title={`${skill.steps.length} ${t('cogArchPanel_steps')}`}>Synth</span>
        </div>
    );

    // Coprocessors
    const renderCoprocessor = (coprocessor: Coprocessor) => {
        let primaryMetricValue: string | number = coprocessor.metrics.activations || 0;
        let primaryMetricTitle: string = `Activated ${primaryMetricValue} times`;

        switch (coprocessor.id) {
            case 'STATE_QUERY_INTERCEPT':
                primaryMetricValue = coprocessor.metrics.intercepts || 0;
                primaryMetricTitle = `Handled ${primaryMetricValue} queries`;
                break;
            case 'HEURISTIC_CAUSAL_LINKER':
                primaryMetricValue = coprocessor.metrics.linksForged || 0;
                primaryMetricTitle = `Forged ${primaryMetricValue} links`;
                break;
            case 'STATE_ANOMALY_DETECTOR':
                primaryMetricValue = coprocessor.metrics.anomaliesDetected || 0;
                primaryMetricTitle = `Detected ${primaryMetricValue} anomalies`;
                break;
            case 'PERFORMANCE_PATTERN_ANALYZER':
                 primaryMetricValue = coprocessor.metrics.patternsFound || 0;
                 primaryMetricTitle = `Found ${primaryMetricValue} patterns`;
                 break;
            case 'ENGAGEMENT_MONITOR':
                primaryMetricValue = ((coprocessor.metrics.engagementLevel || 0) * 100).toFixed(0) + '%';
                primaryMetricTitle = `Current engagement level`;
                break;
        }

        return (
             <div key={coprocessor.id} className="arch-module">
                <span className={`arch-status-indicator status-${coprocessor.status}`} title={`${t('cogArchPanel_status')}: ${coprocessor.status}`}></span>
                <span className="arch-module-name">{coprocessor.name}</span>
                <span className="arch-module-version" title={primaryMetricTitle}>{primaryMetricValue}</span>
            </div>
        );
    };

    // FIX: Explicitly type the parameter `c` as `Coprocessor` in the filter callback to resolve errors where `Object.values` was inferring it as `unknown`.
    const activeCoprocessors = Object.values(architecture.coprocessors).filter((c: Coprocessor) => c.status === 'active');
    
    let coprocessorGroups: { [key: string]: Coprocessor[] } = {};
    const currentArch = architecture.coprocessorArchitecture;

    const groupTitles: { [key:string]: string } = {
        // Triune
        krono: 'Krono Cluster (State & Instinct)',
        pali: 'Pali Cluster (Social & User Model)',
        neo: 'Neo Cluster (Logic & Patterns)',
        // Reflex Arc
        alpha: 'Alpha Layer (Perception & Triage)',
        beta: 'Beta Layer (Integration & Rules)',
        gamma: 'Gamma Layer (Action & Dispatch)',
        // Event Stream
        stream_processor: 'Stream Processors',
        event_subscriber: 'Event Subscribers',
        // Temporal Engine
        chronicler: 'Chronicler Cluster (Past)',
        reactor: 'Reactor Cluster (Present)',
        oracle: 'Oracle Cluster (Future)',
        // Symbiotic Ecosystem
        janitor: 'Janitor Symbiont (System Purity)',
        weaver: 'Weaver Symbiont (System Coherence)',
        mycelial: 'Mycelial Network (System Growth)',
        // Sensory Integration
        proprioceptive: 'Proprioceptive Cluster (Internal Signals)',
        linguistic: 'Linguistic Cluster (Textual Data)',
        structural: 'Structural Cluster (Structured Data)',
    };
    
    activeCoprocessors.forEach((p: Coprocessor) => {
        let key: string | undefined;
        switch (currentArch) {
            case CoprocessorArchitecture.TRIUNE:                key = p.cluster; break;
            case CoprocessorArchitecture.REFLEX_ARC:            key = p.layer; break;
            case CoprocessorArchitecture.EVENT_STREAM:        key = p.processorType; break;
            case CoprocessorArchitecture.TEMPORAL_ENGINE:       key = p.temporalCluster; break;
            case CoprocessorArchitecture.SYMBIOTIC_ECOSYSTEM:   key = p.symbiont; break;
            case CoprocessorArchitecture.SENSORY_INTEGRATION:   key = p.sensoryModality; break;
        }
        key = key || 'ungrouped';
        if (!coprocessorGroups[key]) coprocessorGroups[key] = [];
        coprocessorGroups[key].push(p);
    });

    return (
        <div className="side-panel">
            <div className="cognitive-arch-content">
                <div className="arch-module arch-summary"> <span className="arch-module-name">{t('cogArchPanel_complexityScore')}</span> <span className="arch-module-version">{architecture.modelComplexityScore.toFixed(3)}</span> </div>
                {/* FIX: Corrected regex to handle both spaces and hyphens in group names, ensuring valid translation keys are generated. */}
                {Object.entries(moduleGroups).map(([groupName, modules]) => ( <div key={groupName} className="arch-group"> <div className="arch-group-header">{t(`cogArchPanel_group${groupName.replace(/[\s-]/g, '')}`)}</div> {modules.map(skill => architecture.components[skill] && renderModule(skill, architecture.components[skill]))} </div> ))}
                
                {Object.entries(coprocessorGroups).map(([groupId, processors]) => (
                    processors.length > 0 && (
                        <div key={groupId} className="arch-group">
                            <div className="arch-group-header">{groupTitles[groupId] || 'Coprocessors'}</div>
                            {processors.sort((a,b) => a.name.localeCompare(b.name)).map(renderCoprocessor)}
                        </div>
                    )
                ))}

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