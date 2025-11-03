// components/AxiomaticGenesisForgePanel.tsx
import React from 'react';
import { useAuraDispatch, useCoreState, useLocalization } from '../context/AuraContext.tsx';
import { Axiom, ProposedAxiom } from '../types.ts';
import { SafeMarkdown } from './SafeMarkdown';
import { Accordion } from './Accordion';

const baseSystems = {
    zfc: {
        name: 'ZFC Set Theory',
        axioms: [
            { id: 'extensionality', text: '∀x∀y(∀z(z∈x ↔ z∈y) → x=y)' },
            { id: 'pairing', text: '∀x∀y∃z∀w(w∈z ↔ (w=x ∨ w=y))' },
            { id: 'union', text: '∀F∃A∀Y∀x((x∈Y ∧ Y∈F) → x∈A)' },
            { id: 'infinity', text: '∃X(∅∈X ∧ ∀y(y∈X → S(y)∈X))' },
            { id: 'replacement', text: '∀A∀w1..∀wn(∀x(x∈A → ∃!yφ) → ∃B∀x(x∈A → ∃y(y∈B ∧ φ)))' },
            { id: 'power_set', text: '∀x∃y∀z(z⊆x → z∈y)' },
            { id: 'regularity', text: '∀X(X≠∅ → ∃y(y∈X ∧ y∩X=∅))' },
            { id: 'choice', text: '∀X(∅∉X → ∃f:X→⋃X ∀A∈X(f(A)∈A))' },
        ]
    },
    peano: {
        name: 'Peano Arithmetic',
        axioms: [
            { id: 'zero_is_natural', text: '0 is a natural number.' },
            { id: 'successor', text: 'For every natural number x, S(x) is a natural number.' },
            { id: 'no_predecessor_to_zero', text: 'For every natural number x, S(x) = 0 is false.' },
            { id: 'injectivity', text: 'For all natural numbers x and y, if S(x) = S(y), then x = y.' },
            { id: 'induction', text: 'If K is a set such that 0 is in K, and for every natural number n, n being in K implies that S(n) is in K, then K contains every natural number.' },
        ]
    }
};

export const AxiomaticGenesisForgePanel = () => {
    const { t } = useLocalization();
    const { syscall } = useAuraDispatch();
    const { axiomaticGenesisForgeState } = useCoreState();
    const { status, baseSystemId, currentSystem, mutationLog, surveyorResults, langlandsCandidates } = axiomaticGenesisForgeState;

    const handleLoadSystem = (systemId: keyof typeof baseSystems) => {
        syscall('FORGE/LOAD_BASE_SYSTEM', { systemId, axioms: baseSystems[systemId].axioms });
    };

    const handleMutate = (axiomId: string, mutationType: 'negate' | 'remove') => {
        const axiomText = currentSystem.axioms.find((a: Axiom) => a.id === axiomId)?.text;
        syscall('FORGE/APPLY_MUTATION', { axiomId, mutationType });
        syscall('RICCI_FLOW/LOG_SURGERY', { description: `Performed "${mutationType}" on axiom: ${axiomText}` });
    };

    const handleAddCandidate = (candidate: ProposedAxiom) => {
        syscall('FORGE/APPLY_MUTATION', { mutationType: 'add', newAxiom: candidate });
        syscall('RICCI_FLOW/LOG_SURGERY', { description: `Added candidate axiom: ${candidate.axiom}` });
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('axiomatic_genesis_forge_description')}</p>

            <div className="genesis-forge-controls">
                <label htmlFor="base-system-select" className="metric-label">Base System</label>
                <select id="base-system-select" value={baseSystemId} onChange={e => handleLoadSystem(e.target.value as any)} disabled={status === 'surveying'}>
                    <option value="zfc">ZFC Set Theory</option>
                    <option value="peano">Peano Arithmetic</option>
                </select>
            </div>

            <div className="panel-subsection-title">Current Axiomatic System</div>
            <div className="axiom-list">
                {currentSystem.axioms.map((axiom: Axiom) => (
                    <div key={axiom.id} className="axiom-item">
                        <span className={`axiom-item-text status-${axiom.status}`}>
                            <SafeMarkdown text={`$${axiom.text}$`} />
                        </span>
                        <div className="axiom-mutation-controls">
                            <button className="axiom-mutation-btn" title="Negate" onClick={() => handleMutate(axiom.id, 'negate')} disabled={status === 'surveying'}>¬</button>
                            <button className="axiom-mutation-btn" title="Remove" onClick={() => handleMutate(axiom.id, 'remove')} disabled={status === 'surveying'}>X</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="panel-subsection-title">Surveyor Results</div>
            <div className="surveyor-results-grid">
                <div className="metric-item">
                    <span className="metric-label">Consistency</span>
                    <span className="metric-value" style={{ color: status === 'inconsistent' ? 'var(--failure-color)' : 'var(--success-color)' }}>
                        {status === 'surveying' ? 'Surveying...' : status === 'inconsistent' ? 'Inconsistent' : 'Consistent'}
                    </span>
                </div>
                <div className="metric-item">
                    <span className="metric-label">Emergent Theorems</span>
                    <span className="metric-value">{surveyorResults.emergentTheorems.length}</span>
                </div>
            </div>

            <Accordion title="Langlands Candidates" defaultOpen={false} hasNotifications={langlandsCandidates.length > 0}>
                 {langlandsCandidates.length > 0 ? (
                    langlandsCandidates.map(candidate => (
                        <div key={candidate.id} className="axiom-card unvalidated">
                            <p className="axiom-card-text">"{candidate.axiom}"</p>
                            <div className="proposal-actions-footer">
                                <button className="control-button" onClick={() => handleAddCandidate(candidate)}>+ Add to System</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="kg-placeholder">No novel axioms proposed by the Langlands Engine.</div>
                )}
            </Accordion>
        </div>
    );
};
