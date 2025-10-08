// components/PsychePanel.tsx
import React from 'react';
import { useArchitectureState, useAuraDispatch, useLocalization } from '../context/AuraContext';
import { CognitivePrimitiveDefinition } from '../types';
import { useModal } from '../context/ModalContext';

export const PsychePanel = () => {
    const { psycheState } = useArchitectureState();
    const { handleAuditArchitecture } = useAuraDispatch();
    const { t } = useLocalization();
    const modal = useModal();
    const { version, primitiveRegistry } = psycheState;

    // FIX: Explicitly type `a` and `b` as `CognitivePrimitiveDefinition` to resolve type errors on their properties.
    const sortedPrimitives = Object.values(primitiveRegistry).sort((a: CognitivePrimitiveDefinition, b: CognitivePrimitiveDefinition) => {
        if (a.isSynthesized && !b.isSynthesized) return 1;
        if (!a.isSynthesized && b.isSynthesized) return -1;
        return a.type.localeCompare(b.type);
    });

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

            <div className="panel-subsection-title">{t('psyche_primitiveRegistry')} ({Object.keys(primitiveRegistry).length})</div>
            {sortedPrimitives.map((primitive: CognitivePrimitiveDefinition) => (
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
            ))}
        </div>
    );
};