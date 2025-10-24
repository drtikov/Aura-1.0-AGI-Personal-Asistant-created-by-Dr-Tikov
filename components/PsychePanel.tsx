// components/PsychePanel.tsx
import React from 'react';
// FIX: Added '.ts' extension to satisfy module resolution.
import { CognitivePrimitiveDefinition } from '../types.ts';
import { useArchitectureState, useLocalization } from '../context/AuraContext.tsx';
import { useModal } from '../context/ModalContext.tsx';
import { Accordion } from './Accordion.tsx';

export const PsychePanel = () => {
    const { psycheState } = useArchitectureState();
    const { t } = useLocalization();
    const modal = useModal();
    const { version, primitiveRegistry } = psycheState;

    // FIX: Explicitly type 'corePrimitives' array to ensure type inference works correctly for its elements in later code, resolving errors with `Object.values`.
    const allPrimitives = Object.values(primitiveRegistry) as CognitivePrimitiveDefinition[];
    const corePrimitives: CognitivePrimitiveDefinition[] = allPrimitives.filter(p => !p.isSynthesized && ['CLASSIFY', 'SEQUENCE', 'TRANSFORM', 'AGGREGATE', 'QUERY', 'DESCRIBE_PRIMITIVE', 'LIST_PRIMITIVES'].includes(p.type));
    const algorithmicPrimitives = allPrimitives.filter(p => !p.isSynthesized && !corePrimitives.some(c => c.type === p.type));
    const synthesizedPrimitives = allPrimitives.filter(p => p.isSynthesized);

    const renderPrimitive = (primitive: CognitivePrimitiveDefinition) => (
        <details key={primitive.type} className="workflow-details">
            <summary className="workflow-summary">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {primitive.isSynthesized && <span title="Synthesized Primitive">🤖</span>}
                    {primitive.type}
                </span>
            </summary>
            <div className="workflow-content">
                <p className="workflow-description">{primitive.description}</p>
                {primitive.isSynthesized && primitive.sourcePrimitives && (
                    <p className="workflow-description" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        <strong>Source:</strong> {primitive.sourcePrimitives.join(' → ')}
                    </p>
                )}
                <div className="code-snippet-container">
                    <pre><code>{JSON.stringify(primitive.payloadSchema, null, 2)}</code></pre>
                </div>
            </div>
        </details>
    );

    return (
        <div className="side-panel psyche-panel">
            <div className="awareness-item">
                <label>{t('psyche_languageVersion')}</label>
                <strong>v{version}</strong>
            </div>
             <div className="button-grid" style={{marginBottom: '1rem'}}>
                <button 
                    className="control-button"
                    onClick={() => modal.open('psychePrimitives', {})}
                    title={t('psyche_library_tooltip')}
                >
                    {t('psyche_library_button')}
                </button>
            </div>
            
            <Accordion title={t('psyche_group_algorithmic')} defaultOpen>
                {algorithmicPrimitives.map(renderPrimitive)}
            </Accordion>
            
            <Accordion title={t('psyche_group_core')}>
                {corePrimitives.map(renderPrimitive)}
            </Accordion>
            
            {synthesizedPrimitives.length > 0 && (
                <Accordion title={t('psyche_group_synthesized')}>
                    {synthesizedPrimitives.map(renderPrimitive)}
                </Accordion>
            )}
        </div>
    );
};